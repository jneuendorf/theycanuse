import fs from 'fs-extra'

import { camelCase } from 'change-case'

import { AbstractProvider as Provider } from '../providers'
import { NormalizedData } from '../types/data'
import { NodeMetaData, Features, Detector } from './types'


interface Has<T> {
    has(item: T): boolean
}


export abstract class AbstractAnalyzer<Node, NodePath, Scope> {
    private dataProviders: Provider[]
    private usedFeatures?: Has<string>
    private normalizedDatas: NormalizedData[] = []
    private isDataLoaded = false
    private features: Features = {}

    constructor(dataProviders: Provider[], usedFeatures?: Has<string>) {
        this.dataProviders = dataProviders
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
