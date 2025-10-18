-- Verification script - run this after migration
USE `dbms-cp`;

-- Check if price_per_unit column exists
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'dbms-cp' 
AND TABLE_NAME = 'crops' 
AND COLUMN_NAME = 'price_per_unit';

-- Show all columns in crops table
DESCRIBE crops;

-- Check sample data with prices
SELECT crop_id, crop_name, quantity, unit, price_per_unit, status 
FROM crops 
WHERE price_per_unit IS NOT NULL
LIMIT 5;
