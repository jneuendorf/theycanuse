import fs from 'fs-extra'

import { camelCase } from 'change-case'

import { AbstractProvider as Provider } from '../providers'
import { BrowserSupport, NormalizedData } from '../types-data'


/*
Generic subset of node_modules/@types/babel__traverse/index.d.ts > NodePath

ESLint: https://github.com/eslint/eslint/blob/33efd71d7c3496b4b9cbfe006280527064940826/lib/linter/linter.js#L851-L926
*/
export interface NodeMetaData<Node, NodePath, Scope> {
        node: Node
        nodePath: NodePath
        scope: Scope
        parent: Node
        parentPath: NodePath
        opts?: object
}

export type Features = {[feature: string]: {[provider: string]: BrowserSupport}}
export type Detector<NodeMetaData> = (metaData: NodeMetaData) => boolean

interface Has<T> {
    has(item: T): boolean
}
// type UseFeature = (feature: string) => boolean
// const alwaysUseFeature: UseFeature = (_feature: string) => true


export abstract class AbstractAnalyzer<Node, NodePath, Scope> {
    private dataProviders: Provider[]
    // private useFeature: UseFeature
    private usedFeatures?: Has<string>
    private normalizedDatas: NormalizedData[] = []
    private isDataLoaded = false
    private features: Features = {}

    // constructor(dataProviders: Provider[], useFeature?: UseFeature) {
    constructor(dataProviders: Provider[], usedFeatures?: Has<string>) {
        this.dataProviders = dataProviders
        // this.useFeature = useFeature || alwaysUseFeature
        this.usedFeatures = usedFeatures
    }

    async getData(): Promise<NormalizedData[]> {
        return await Promise.all(
            this.dataProviders.map(provider => provider.getData())
        )
    }


    // Parsing

    abstract parse(code: string): Node

    async parseFile(file: string): Promise<Node> {
        const fileContents = await fs.readFile(file, 'utf8')
        return this.parse(fileContents)
    }


    // AST Traversal

    abstract traverse(ast: Node): void

    /*
    Pre-implemented helper method that can be called when the tree traversal
    visites a node.
    */
    visit(metaData: NodeMetaData<Node, NodePath, Scope>): void {
        this.normalizedDatas.forEach((normalizedData, index) => {
            const provider = this.dataProviders[index]
            const entries = Object.entries(normalizedData)
            for (const [feature, browserSupport] of entries) {
                if (this.useFeature(feature)) {
                    if (this.detectedFeature(feature, metaData)) {
                        if (!this.features[feature]) {
                            this.features[feature] = {}
                        }
                        this.features[feature][provider.name] = browserSupport
                    }
                }
            }
        })
    }

    private useFeature(feature: string): boolean {
        if (!this.usedFeatures) {
            return true
        }
        else {
            return this.usedFeatures.has(feature)
        }
    }


    // Feature detection

    abstract getDetector(feature: string): Detector<NodeMetaData<Node, NodePath, Scope>> | void

    detectedFeature(feature: string, metaData: NodeMetaData<Node, NodePath, Scope>): boolean {
        const detector = this.getDetector(camelCase(feature))
        return (
            detector
            ? detector(metaData)
            : false
        )
    }

    async analyzeFeatures(code: string): Promise<Features> {
        await this.reset()
        const ast = this.parse(code)
        this.traverse(ast)
        return this.features
    }

    private async reset(): Promise<void> {
        this.features = {}
        if (!this.isDataLoaded) {
            this.normalizedDatas = await this.getData()
            this.isDataLoaded = true
        }
    }
}
