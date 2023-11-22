import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { consola } from 'consola'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')

const exec = (command: string) => execSync(command, { cwd: rootDir, stdio: 'inherit' })

const main = async () => {
	consola.info('Cleanup')
	exec('npm run clean')

	consola.info('Rollup')
	exec('npm run build:rollup')

	consola.info('Meta-files')
	exec('npm run build:meta')
}

main()
