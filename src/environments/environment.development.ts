export const environment = {
  production: false,
  supabase: {
    supabaseUrl: process.env['SUPABASE_URL'] || '',
    supabaseAnonKey: process.env['SUPABASE_ANON_KEY'] || '',
  },
};
