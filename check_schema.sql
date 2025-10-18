-- Check current database schema
USE `dbms-cp`;

-- Check if price_per_unit column exists in crops table
DESCRIBE crops;

-- Check all columns in crops table
SHOW COLUMNS FROM crops;

-- Check if the column exists
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'dbms-cp' 
AND TABLE_NAME = 'crops' 
AND COLUMN_NAME = 'price_per_unit';
