import yaml from 'js-yaml'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Notebook metadata for app pages
 */
export interface NotebookMetadata {
  id: string
  title: string
  projectId: string
  link: string
  yamlPath: string
  status?: string
  decision?: string
  methods?: string[]
  tags?: string[]
  generatedAt?: Date
}

/**
 * Find the monorepo root by looking for pnpm-workspace.yaml
 * This works whether we're building from the root or from a package
 */
function findMonorepoRoot(): string {
  let dir = process.cwd()

  // Walk up the directory tree looking for pnpm-workspace.yaml
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
      return dir
    }
    dir = path.dirname(dir)
  }

  // Fallback to cwd if not found (shouldn't happen in this monorepo)
  return process.cwd()
}

/**
 * Get all notebooks for a specific project
 * Reads YAML files from public/analysis/{projectId}/
 *
 * Uses fs.readdirSync instead of import.meta.glob so it works
 * correctly when consumed from any package in the monorepo.
 */
export function getNotebooksForProject(projectId: string): NotebookMetadata[] {
  const notebooks: NotebookMetadata[] = []

  // Find monorepo root to access public/analysis/
  const root = findMonorepoRoot()
  const projectDir = path.join(root, 'public', 'analysis', projectId)

  // Check if directory exists
  if (!fs.existsSync(projectDir)) {
    return notebooks
  }

  // Read all YAML files in the project directory
  const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.yaml'))

  for (const file of files) {
    try {
      const filePath = path.join(projectDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const data = yaml.load(content) as any

      const notebookId = file.replace('.yaml', '')

      // Build link to notebook detail page
      const link = `/projects/${projectId}/analysis/${notebookId}/`

      notebooks.push({
        id: notebookId,
        title: data.title || notebookId,
        projectId: projectId,
        link,
        yamlPath: filePath,
        status: data.status,
        decision: data.decision,
        methods: data.methods || [],
        tags: data.tags || [],
        generatedAt: data.generated_at ? new Date(data.generated_at) : undefined,
      })
    } catch (e) {
      console.warn(`Failed to parse notebook YAML ${file}:`, e)
    }
  }

  // Sort by generated date (newest first)
  notebooks.sort((a, b) => {
    if (!a.generatedAt) return 1
    if (!b.generatedAt) return -1
    return b.generatedAt.getTime() - a.generatedAt.getTime()
  })

  return notebooks
}
