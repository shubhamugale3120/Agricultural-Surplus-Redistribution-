-- Migration script to add price_per_unit column to crops table
-- Run this in MySQL Workbench

USE `dbms-cp`;

-- Add price_per_unit column to crops table
ALTER TABLE crops 
ADD COLUMN price_per_unit DECIMAL(10,2) DEFAULT NULL 
AFTER expiry_date;

-- Update existing crops with sample prices (optional)
UPDATE crops SET price_per_unit = 25.00 WHERE crop_name = 'Tomato';
UPDATE crops SET price_per_unit = 15.00 WHERE crop_name = 'Potato';
UPDATE crops SET price_per_unit = 20.00 WHERE crop_name = 'Onion';
UPDATE crops SET price_per_unit = 30.00 WHERE crop_name = 'Carrot';
UPDATE crops SET price_per_unit = 35.00 WHERE crop_name = 'Wheat';
UPDATE crops SET price_per_unit = 40.00 WHERE crop_name = 'Rice';
UPDATE crops SET price_per_unit = 18.00 WHERE crop_name = 'Cauliflower';
UPDATE crops SET price_per_unit = 12.00 WHERE crop_name = 'Spinach';
UPDATE crops SET price_per_unit = 50.00 WHERE crop_name = 'Mango';
UPDATE crops SET price_per_unit = 22.00 WHERE crop_name = 'Banana';

-- Verify the changes
DESCRIBE crops;

-- Check some sample data
SELECT crop_id, crop_name, quantity, unit, price_per_unit, status 
FROM crops 
LIMIT 5;
