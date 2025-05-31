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
  async updateFeedbacks(tableName, match, feedback1, feedback2, feedback3, feedback4, feedback5) {
    const feedbackData = {
      feedback1: feedback1 ?? null,
      feedback2: feedback2 ?? null,
      feedback3: feedback3 ?? null,
      feedback4: feedback4 ?? null,
      feedback5: feedback5 ?? null
    };

    const { data, error } = await this.supabase
      .from(tableName)
      .update(feedbackData)
      .match(match);

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
