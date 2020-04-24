const fs = require('fs-extra')
const path = require('path')

const {camelCase} = require('change-case')


fs.readdir(__dirname, 'utf8', async (err, files) => {
    if (err) {
        throw err
    }

    const typeScriptFiles = files.filter(
        file => file !== 'index.ts' && path.extname(file) === '.ts'
    )
    const target = path.join(__dirname, 'index.ts')
    const lines = []
    for (const tsFile of typeScriptFiles) {
        const filename = path.basename(tsFile, '.ts')
        const stats = await fs.stat(path.join(__dirname, tsFile))
        lines.push(
            `${stats.size === 0 ? '// ' : ''}`
            + `export `
            + `{ ${camelCase(filename)} } `
            + `from './${filename}'`
        )
    }

    await fs.writeFile(target, lines.join('\n'), 'utf8')
    console.log(`generated ${target}`)
})
