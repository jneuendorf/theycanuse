import fs from 'fs-extra'

import { camelCase } from 'change-case'

import { AbstractProvider as Provider } from '../providers'
import { BrowserSupport, NormalizedData } from '../types-data'


export type Features = {[feature: string]: {[provider: string]: BrowserSupport}}
export type Recognizer<Node, NodePath> = (node: Node, nodePath: NodePath) => boolean


export abstract class AbstractAnalyzer<Node, NodePath> {
    private dataProviders: Provider[]
    private normalizedDatas: NormalizedData[] = []
    private isDataLoaded = false
    private features: Features = {}

    constructor(dataProviders: Provider[]) {
        this.dataProviders = dataProviders
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
    visit(node: Node, nodePath: NodePath): void {
        this.normalizedDatas.forEach((normalizedData, index) => {
            const provider = this.dataProviders[index]
            const entries = Object.entries(normalizedData)
            for (const [feature, browserSupport] of entries) {
                if (this.recognizedFeature(feature, node, nodePath)) {
                    if (!this.features[feature]) {
                        this.features[feature] = {}
                    }
                    this.features[feature][provider.name] = browserSupport
                }
            }
        })
    }

    abstract getRecognizer(feature: string): Recognizer<Node, NodePath> | void

    // Feature recognition

    // abstract recognizedFeature(feature: string, ast: Node, nodePath: NodePath): boolean
    recognizedFeature(feature: string, node: Node, nodePath: NodePath): boolean {
        const recognizer = this.getRecognizer(camelCase(feature))
        return (
            recognizer
            ? recognizer(node, nodePath)
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
