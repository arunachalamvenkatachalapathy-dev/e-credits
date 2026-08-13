import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key';

export const isSupabaseConfigured = () => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('xyzcompany')
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Save or Update Project to Supabase Database
export async function saveProjectToSupabase(project) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase credentials not configured in VITE_SUPABASE_URL. Project saved to LocalStorage.');
    return { success: false, mode: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        project_name: project.projectName,
        company_name: project.companyName,
        standard: project.standard,
        bom_data: project.bom,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true, data, mode: 'supabase' };
  } catch (err) {
    console.error('Supabase Sync Error:', err.message);
    return { success: false, error: err.message, mode: 'local' };
  }
}

// Fetch All Projects from Supabase Database
export async function fetchProjectsFromSupabase() {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      projectName: row.project_name,
      companyName: row.company_name,
      standard: row.standard,
      bom: row.bom_data || []
    }));
  } catch (err) {
    console.error('Failed to load projects from Supabase:', err.message);
    return null;
  }
}
