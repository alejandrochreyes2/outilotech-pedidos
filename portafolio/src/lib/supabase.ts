import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Proyecto = {
  id: string;
  nombre: string;
  descripcion: string;
  tecnologias: string[];
  enlace: string;
  imagen: string;
  categoria: string;
  estado: 'ONLINE' | 'ARCHIVADO' | 'EN_DESARROLLO';
  created_at: string;
  updated_at: string;
};
