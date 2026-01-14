import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function checkDatabase() {
  try {
    // Check what tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log("📋 Existing tables:", tables);

    // Check columns in user table if it exists
    const userColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user'
    `;
    
    console.log("👤 User table columns:", userColumns);

    // Check columns in account table if it exists
    const accountColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'account'
    `;
    
    console.log("🔑 Account table columns:", accountColumns);

  } catch (error) {
    console.error("❌ Error:", error);
  }
  
  await sql.end();
}

checkDatabase();