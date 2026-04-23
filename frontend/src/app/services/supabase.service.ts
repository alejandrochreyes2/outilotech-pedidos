import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gklxdzhmpjwwmffjdmwv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHhkemhtcGp3d21mZmpkbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTM0MDEsImV4cCI6MjA5MTQyOTQwMX0.Es3YyKtLnx9lKiA_xyTHxK_IDSICb9kGf5-nu2XE_jg';

@Injectable({ providedIn: 'root' })
export class SupabaseService {

  readonly client: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  private channels: RealtimeChannel[] = [];

  /** Lee todos los registros de una tabla */
  async getAll<T>(tabla: string, columnas = '*'): Promise<T[]> {
    const { data, error } = await this.client.from(tabla).select(columnas);
    if (error) { console.warn(`[Supabase] Error leyendo ${tabla}:`, error.message); return []; }
    return (data ?? []) as T[];
  }

  /**
   * Suscribe a cambios en tiempo real de una tabla.
   * Llama a `callback` cada vez que hay INSERT, UPDATE o DELETE en AppSheet.
   * Devuelve la función para desuscribirse (úsala en ngOnDestroy).
   *
   * Ejemplo de uso en cualquier servicio:
   *   this.supabase.escucharTabla('inventario_productos', (payload) => {
   *     // payload.eventType: 'INSERT' | 'UPDATE' | 'DELETE'
   *     // payload.new: fila nueva  |  payload.old: fila anterior
   *   });
   */
  escucharTabla(tabla: string, callback: (payload: any) => void): () => void {
    const channel = this.client
      .channel(`realtime-${tabla}-${Date.now()}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: tabla },
        (payload) => {
          console.log(`[Supabase Realtime] ${tabla} → ${payload.eventType}`);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log(`[Supabase Realtime] ${tabla} suscripción: ${status}`);
      });

    this.channels.push(channel);
    return () => {
      this.client.removeChannel(channel);
      this.channels = this.channels.filter(c => c !== channel);
    };
  }

  /** Cierra todas las suscripciones activas */
  desconectar(): void {
    this.channels.forEach(c => this.client.removeChannel(c));
    this.channels = [];
  }
}
