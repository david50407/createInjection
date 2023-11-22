import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { version } from '../package.json'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const pkgDir = resolve(rootDir, 'packages', 'create-injection')
const distDir = resolve(pkgDir, 'dist')

const buildPackageJSON = async () => {
	const packageJSON = JSON.parse(readFileSync(resolve(pkgDir, 'package.json'), 'utf-8'))
	packageJSON.version = version

	writeFileSync(resolve(distDir, 'package.json'), JSON.stringify(packageJSON, null, 2))
}

const main = async () => {
	await buildPackageJSON()
}

main()
