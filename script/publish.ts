import { execSync as exec } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { consola } from 'consola'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const pkgDir = resolve(rootDir, 'packages', 'create-injection')
const distDir = resolve(pkgDir, 'dist')

const main = async () => {
	consola.info('Building package')
	exec('npm run build', { stdio: 'inherit' })

	consola.info('Publishing package')
	exec('npm publish --access public', { stdio: 'inherit', cwd: distDir })

	consola.success('Published package: create-injection')
}

main()
