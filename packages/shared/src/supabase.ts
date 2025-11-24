// Shared Supabase utilities
// Currently Supabase client is project-specific (ab-sim/supabase-api.js)
// Future: Extract common client configuration here when multiple projects need it

export function getSupabaseConfig() {
	return {
		url: import.meta.env.PUBLIC_SUPABASE_URL || '',
		anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''
	}
}
