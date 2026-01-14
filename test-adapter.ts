import { db } from './packages/db/src/index';
import { accounts, users } from './packages/db/src/index'; // Update path
import { eq, and } from 'drizzle-orm';

async function testAdapterQuery() {
  try {
    console.log("Testing database connection...");
    
    // Test the exact query that's failing
    const result = await db
      .select()
      .from(accounts)
      .innerJoin(users, eq(accounts.userId, users.id))
      .where(
        and(
          eq(accounts.provider, 'google'),
          eq(accounts.providerAccountId, '101632281767165836877')
        )
      );
    
    console.log("✅ Query successful:", result);
  } catch (error) {
    console.error("❌ Query failed:", error);
  }
  
  process.exit(0);
}

testAdapterQuery();