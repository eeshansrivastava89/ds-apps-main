// Shared PostHog utilities
// Currently PostHog init is inline in BaseHead.astro
// Future: Extract common initialization logic here when needed

export function getPostHogConfig() {
	return {
		apiHost: import.meta.env.PUBLIC_POSTHOG_HOST || 'https://api-v2.eeshans.com',
		apiKey: import.meta.env.PUBLIC_POSTHOG_KEY || ''
	}
}
