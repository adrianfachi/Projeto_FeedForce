const SupabaseConnection = require('./connection');

const SUPABASE_URL = 'https://dpmyuojkrmgnwfyieqig.supabase.co'; // change this
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbXl1b2prcm1nbndmeWllcWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjQ0NzgsImV4cCI6MjA2NDI0MDQ3OH0.NnNTpy36xLrBzHlLPmm8ACOzNXfZ3pAOtM8hdOa5Q3A';    // change this

const db = new SupabaseConnection(SUPABASE_URL, SUPABASE_KEY);

(async () => {
  try {
    const users = await db.fetchAll('users');
    console.log('Users:', users);

    const newUser = await db.insert('users', {});
    console.log('Inserted user:', newUser);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
