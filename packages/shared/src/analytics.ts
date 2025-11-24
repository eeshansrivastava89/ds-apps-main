// Shared analytics utilities
// Future: Common event tracking patterns, user identification helpers

export function generateUserId() {
	return 'user_' + Math.random().toString(36).slice(2, 11)
}
