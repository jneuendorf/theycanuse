declare module "enum-nck" {
    export default function <T>(arr: T[], k: number): T[][]
}

declare module "jaro-winkler" {
    export default function(s1: string, s2: string): number
}
