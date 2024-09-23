import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js'; // Asegúrate de que la ruta sea la correcta para tu proyecto
import { AuthService } from './auth.service'; // Asegúrate de que la ruta sea la correcta para tu proyecto
import { environment } from '../../environments/environment'; // Ajusta si la ruta es diferente

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  /**
   * Método para obtener los datos de un usuario específico
   * @param userId - ID del usuario
   */

  async getUserData(userId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  /**
   * Método para obtener todos los datos de una tabla específica
   * @param tableName - Nombre de la tabla de la que deseas obtener datos
   */
  async getAllData(tableName: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.from(tableName).select('*');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      return null;
    }
  }

  /**
   * Método para insertar un registro en una tabla
   * @param tableName - Nombre de la tabla donde se va a insertar
   * @param data - Los datos que se quieren insertar
   */
  async insertData(tableName: string, data: any): Promise<any> {
    try {
      const { error } = await this.supabase.from(tableName).insert([data]);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error inserting data into ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Método para actualizar un registro
   * @param tableName - Nombre de la tabla donde se actualiza
   * @param id - ID del registro que se va a actualizar
   * @param updatedData - Los datos actualizados
   */
  async updateData(
    tableName: string,
    id: string,
    updatedData: any
  ): Promise<any> {
    try {
      const { error } = await this.supabase
        .from(tableName)
        .update(updatedData)
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating data in ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Método para eliminar un registro por ID
   * @param tableName - Nombre de la tabla donde se va a eliminar
   * @param id - ID del registro que se desea eliminar
   */
  async deleteData(tableName: string, id: string): Promise<any> {
    try {
      const { error } = await this.supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting data from ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Método para obtener datos filtrados
   * @param tableName - Nombre de la tabla
   * @param column - Columna para filtrar
   * @param value - Valor de la columna para filtrar
   */
  async getFilteredData(
    tableName: string,
    column: string,
    value: any
  ): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*')
        .eq(column, value);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error filtering data from ${tableName}:`, error);
      return null;
    }
  }
}
