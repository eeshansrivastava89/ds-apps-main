// Build Log Types - migrated from packages/build-log/src/lib/validate-build-log.ts

export type Category = 'frontend' | 'backend' | 'analytics' | 'wiring' | 'docs'
export type Status = 'open' | 'claimed' | 'in-review' | 'merged'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Task {
	id: string
	title: string
	projectSlug: string
	category: Category[]
	status: Status
	difficulty?: Difficulty
	assignees?: { name: string; avatarUrl?: string }[]
	closedBy?: { name: string; avatarUrl?: string }
	labels?: string[]
	skills?: string[]
	estimatedHours?: string
	isGoodFirstIssue?: boolean
	githubUrl: string
	updatedAt?: string
	closedAt?: string
	startDate?: string
	targetDate?: string
}

export interface Cycle {
	slug: string
	name: string
	phase: string
	openTasks: number
	claimed: number
	mergedThisWeek: number
	highlight?: string
}

export interface Contributor {
	name: string
	avatarUrl?: string
	mergedPRs: number
	reviews: number
	recentActivityCount?: number
}

export interface ActivityItem {
	type: 'merged' | 'claimed' | 'pr-opened'
	taskId: string
	taskTitle: string
	user: string
	avatarUrl?: string
	timestamp: string
	githubUrl: string
}

export interface BuildLogData {
	cycles: Cycle[]
	tasks: Task[]
	hats: { name: string; hats: Category[]; status: Status; prNumber?: number }[]
	contributors: Contributor[]
	recentActivity: ActivityItem[]
	lastFetchTime?: string
}

export function validateBuildLogData(data: unknown): BuildLogData | null {
	if (!data || typeof data !== 'object') return null
	const d = data as Record<string, unknown>
	if (!Array.isArray(d.cycles) || !Array.isArray(d.tasks) || !Array.isArray(d.contributors) || !Array.isArray(d.recentActivity)) {
		return null
	}
	return d as unknown as BuildLogData
}
