// Test script to verify database connection and schema
const db = require('./src/config/db');

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const [rows] = await db.query('SELECT 1 AS test');
    console.log('✅ Database connection successful:', rows[0]);
    
    // Check if crops table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'crops'");
    if (tables.length === 0) {
      console.log('❌ crops table does not exist');
      return;
    }
    console.log('✅ crops table exists');
    
    // Check crops table structure
    const [columns] = await db.query('DESCRIBE crops');
    console.log('📋 crops table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'}`);
    });
    
    // Check if price_per_unit column exists
    const priceColumn = columns.find(col => col.Field === 'price_per_unit');
    if (priceColumn) {
      console.log('✅ price_per_unit column exists:', priceColumn.Type);
    } else {
      console.log('❌ price_per_unit column is missing');
      console.log('💡 Run the migration script to add this column');
    }
    
    // Test a simple query
    const [crops] = await db.query('SELECT COUNT(*) as count FROM crops');
    console.log(`📊 Total crops in database: ${crops[0].count}`);
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    // Close the connection pool
    await db.end();
  }
}

testDatabase();
