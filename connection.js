const { createClient } = require('@supabase/supabase-js');

class SupabaseConnection {
  constructor(supabaseUrl, supabaseKey) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async fetchAll(tableName) {
    const { data, error } = await this.supabase.from(tableName).select('*');
    if (error) throw error;
    return data;
  }

  async insert(tableName, rowData) {
    const { data, error } = await this.supabase.from(tableName).insert(rowData);
    if (error) throw error;
    return data;
  }

  async fetchWithFilter(tableName, column, value) {
    const { data, error } = await this.supabase.from(tableName).select('*').eq(column, value);
    if (error) throw error;
    return data;
  }

  async update(tableName, match, newData) {
    const { data, error } = await this.supabase.from(tableName).update(newData).match(match);
    if (error) throw error;
    return data;
  }

  async delete(tableName, match) {
    const { data, error } = await this.supabase.from(tableName).delete().match(match);
    if (error) throw error;
    return data;
  }
}

module.exports = SupabaseConnection;
