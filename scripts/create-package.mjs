#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Get package name from command line
const packageName = process.argv[2]

if (!packageName) {
	console.error('❌ Usage: node scripts/create-package.mjs <package-name>')
	console.error('   Example: node scripts/create-package.mjs basketball-analyzer')
	process.exit(1)
}

// Validate package name (lowercase, hyphens only)
if (!/^[a-z][a-z0-9-]*$/.test(packageName)) {
	console.error('❌ Package name must be lowercase letters, numbers, and hyphens only')
	console.error('   Example: basketball-analyzer, my-cool-app')
	process.exit(1)
}

const packageDir = path.join(process.cwd(), 'packages', packageName)

// Check if package already exists
if (fs.existsSync(packageDir)) {
	console.error(`❌ Package "${packageName}" already exists in packages/`)
	process.exit(1)
}

console.log(`🚀 Creating new package: @soma/${packageName}`)

// Create directory structure
const dirs = [
	packageDir,
	path.join(packageDir, 'src'),
	path.join(packageDir, 'src', 'pages'),
	path.join(packageDir, 'src', 'components'),
	path.join(packageDir, 'public')
]

dirs.forEach((dir) => {
	fs.mkdirSync(dir, { recursive: true })
	console.log(`  ✓ ${path.relative(process.cwd(), dir)}/`)
})

// Generate package.json
const packageJson = {
	name: `@soma/${packageName}`,
	version: '0.0.1',
	private: true,
	type: 'module',
	scripts: {
		dev: 'astro dev',
		build: 'astro build',
		preview: 'astro preview'
	},
	dependencies: {
		'@astrojs/react': '^3.6.2',
		'@soma/shared': 'workspace:*',
		astro: '^4.4.15',
		react: '^18.3.1',
		'react-dom': '^18.3.1'
	},
	devDependencies: {
		'@types/react': '^18.3.12',
		'@types/react-dom': '^18.3.1',
		tailwindcss: '^3.4.17',
		typescript: '^5.7.2'
	}
}

fs.writeFileSync(path.join(packageDir, 'package.json'), JSON.stringify(packageJson, null, 2))
console.log(`  ✓ package.json`)

// Generate astro.config.mjs
const urlPath = packageName
const astroConfig = `import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
	integrations: [react(), tailwind()],
	base: '/${urlPath}',
	outDir: '../../dist/${urlPath}',
	publicDir: 'public',
	build: {
		format: 'directory'
	}
})
`

fs.writeFileSync(path.join(packageDir, 'astro.config.mjs'), astroConfig)
console.log(`  ✓ astro.config.mjs`)

// Generate tailwind.config.js
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {}
	},
	plugins: []
}
`

fs.writeFileSync(path.join(packageDir, 'tailwind.config.js'), tailwindConfig)
console.log(`  ✓ tailwind.config.js`)

// Generate tsconfig.json
const tsconfig = {
	extends: 'astro/tsconfigs/strict',
	compilerOptions: {
		strictNullChecks: true,
		allowJs: true,
		baseUrl: '.',
		lib: ['es2022', 'dom', 'dom.iterable'],
		jsx: 'react-jsx',
		jsxImportSource: 'react'
	},
	exclude: ['node_modules', '**/node_modules/*', '.vscode', 'dist']
}

fs.writeFileSync(path.join(packageDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2))
console.log(`  ✓ tsconfig.json`)

// Generate README.md
const displayName = packageName
	.split('-')
	.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
	.join(' ')

const readme = `# ${displayName}

## Development

\`\`\`bash
# Install dependencies (from root)
pnpm install

# Dev server
pnpm --filter @soma/${packageName} dev

# Build
pnpm --filter @soma/${packageName} build
\`\`\`

## URL

- Development: \`http://localhost:4321/${urlPath}/\`
- Production: \`https://eeshans.com/${urlPath}/\`

## Structure

- \`src/pages/index.astro\` - Main page using shared SiteLayout
- \`src/components/\` - React/Astro components
- \`public/\` - Static assets
`

fs.writeFileSync(path.join(packageDir, 'README.md'), readme)
console.log(`  ✓ README.md`)

// Generate src/pages/index.astro
const indexAstro = `---
import SiteLayout from '@soma/shared/layouts/SiteLayout.astro'
---

<SiteLayout meta={{ title: '${displayName}' }}>
	<div class='w-full space-y-8'>
		<div class='space-y-2'>
			<h1 class='text-3xl font-bold'>${displayName}</h1>
			<p class='text-base text-muted-foreground'>
				Description of your app goes here.
			</p>
		</div>

		<div class='rounded-lg border bg-card p-6'>
			<p class='text-sm text-muted-foreground'>
				Start building your app here. This page uses the shared SiteLayout with header/footer.
			</p>
		</div>
	</div>
</SiteLayout>
`

fs.writeFileSync(path.join(packageDir, 'src', 'pages', 'index.astro'), indexAstro)
console.log(`  ✓ src/pages/index.astro`)

// Done!
console.log(`\n✅ Package created successfully!\n`)
console.log(`Next steps:`)
console.log(`  1. cd packages/${packageName}`)
console.log(`  2. pnpm install (from root)`)
console.log(`  3. pnpm --filter @soma/${packageName} dev`)
console.log(`  4. Open http://localhost:4321/${urlPath}/\n`)
console.log(`Don't forget to add to root package.json scripts:`)
console.log(`  "dev:${packageName}": "pnpm --filter @soma/${packageName} dev"\n`)
