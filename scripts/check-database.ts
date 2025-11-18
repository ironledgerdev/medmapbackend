import { supabase } from '../server/supabase';

async function checkDatabase() {
  console.log('Checking Supabase database tables...\n');

  // Try to list tables by attempting common table names
  const possibleTables = [
    'doctors',
    'medical_professionals',
    'practitioners',
    'appointments',
    'bookings',
    'patients',
    'users',
    'profiles',
    'admins'
  ];

  for (const tableName of possibleTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        console.log(`✅ Table '${tableName}' exists - ${count || 0} rows`);
        
        // Get a sample row to see the structure
        const { data: sample } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (sample && sample.length > 0) {
          console.log(`   Columns: ${Object.keys(sample[0]).join(', ')}`);
        }
      }
    } catch (e: any) {
      // Table doesn't exist or access denied
    }
  }
}

checkDatabase().catch(console.error);
