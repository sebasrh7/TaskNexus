export const environment = {
  production: true,
  supabase: {
    supabaseUrl: process.env['SUPABASE_URL'] || '',
    supabaseAnonKey: process.env['SUPABASE_ANON_KEY'] || '',
  },
};
