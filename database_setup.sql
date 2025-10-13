-- 🚀 Agricultural Surplus Redistribution Database Setup
-- This script creates the database schema and inserts test data

-- Create database
CREATE DATABASE IF NOT EXISTS `dbms-cp` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dbms-cp`;

-- ========================
-- 📋 TABLE CREATION
-- ========================

-- Farmers table
CREATE TABLE IF NOT EXISTS `farmers` (
  `farmer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crops table
CREATE TABLE IF NOT EXISTS `crops` (
  `crop_id` INT AUTO_INCREMENT PRIMARY KEY,
  `farmer_id` INT NOT NULL,
  `crop_name` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(50) NOT NULL,
  `harvest_date` DATE,
  `expiry_date` DATE,
  `status` ENUM('Available', 'Matched', 'Expired') DEFAULT 'Available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`farmer_id`) REFERENCES `farmers`(`farmer_id`) ON DELETE CASCADE
);

-- Buyers table
CREATE TABLE IF NOT EXISTS `buyers` (
  `buyer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `buyer_type` ENUM('Individual', 'Restaurant', 'Retailer', 'Distributor') DEFAULT 'Individual',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- NGOs table
CREATE TABLE IF NOT EXISTS `ngos` (
  `ngo_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sellers (Transporters) table
CREATE TABLE IF NOT EXISTS `sellers` (
  `seller_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `vehicle_no` VARCHAR(50),
  `location` VARCHAR(255) NOT NULL,
  `availability_status` ENUM('Available', 'Busy', 'Offline') DEFAULT 'Available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `crop_id` INT NOT NULL,
  `buyer_id` INT NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Pending', 'Confirmed', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`crop_id`) REFERENCES `crops`(`crop_id`) ON DELETE CASCADE,
  FOREIGN KEY (`buyer_id`) REFERENCES `buyers`(`buyer_id`) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` INT AUTO_INCREMENT PRIMARY KEY,
  `crop_id` INT NOT NULL,
  `farmer_id` INT NOT NULL,
  `buyer_id` INT,
  `ngo_id` INT,
  `seller_id` INT,
  `transaction_type` ENUM('Commercial', 'Charity') NOT NULL,
  `price` DECIMAL(10,2),
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `delivery_status` ENUM('Pending', 'In Progress', 'Delivered', 'Failed') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`crop_id`) REFERENCES `crops`(`crop_id`) ON DELETE CASCADE,
  FOREIGN KEY (`farmer_id`) REFERENCES `farmers`(`farmer_id`) ON DELETE CASCADE,
  FOREIGN KEY (`buyer_id`) REFERENCES `buyers`(`buyer_id`) ON DELETE SET NULL,
  FOREIGN KEY (`ngo_id`) REFERENCES `ngos`(`ngo_id`) ON DELETE SET NULL,
  FOREIGN KEY (`seller_id`) REFERENCES `sellers`(`seller_id`) ON DELETE SET NULL
);

-- Logistics table
CREATE TABLE IF NOT EXISTS `logistics` (
  `logistics_id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` INT NOT NULL,
  `pickup_location` VARCHAR(255) NOT NULL,
  `drop_location` VARCHAR(255) NOT NULL,
  `delivery_date` DATE,
  `status` ENUM('Assigned', 'In Progress', 'Completed', 'Failed') DEFAULT 'Assigned',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`transaction_id`) ON DELETE CASCADE
);

-- ========================
-- 🌱 TEST DATA INSERTION
-- ========================

-- Insert test farmers
INSERT INTO `farmers` (`name`, `phone`, `location`, `email`) VALUES
('Rajesh Kumar', '+91-9876543210', 'Punjab, India', 'rajesh.kumar@email.com'),
('Priya Sharma', '+91-9876543211', 'Haryana, India', 'priya.sharma@email.com'),
('Amit Singh', '+91-9876543212', 'Uttar Pradesh, India', 'amit.singh@email.com'),
('Sunita Devi', '+91-9876543213', 'Bihar, India', 'sunita.devi@email.com'),
('Vikram Patel', '+91-9876543214', 'Gujarat, India', 'vikram.patel@email.com');

-- Insert test crops
INSERT INTO `crops` (`farmer_id`, `crop_name`, `quantity`, `unit`, `harvest_date`, `expiry_date`, `status`) VALUES
(1, 'Tomato', 200.50, 'kg', '2024-01-15', '2024-02-15', 'Available'),
(1, 'Potato', 500.00, 'kg', '2024-01-10', '2024-03-10', 'Available'),
(2, 'Onion', 300.75, 'kg', '2024-01-12', '2024-02-12', 'Available'),
(2, 'Carrot', 150.25, 'kg', '2024-01-08', '2024-02-08', 'Available'),
(3, 'Wheat', 1000.00, 'kg', '2024-01-05', '2024-06-05', 'Available'),
(3, 'Rice', 800.00, 'kg', '2024-01-03', '2024-12-03', 'Available'),
(4, 'Cauliflower', 100.00, 'kg', '2024-01-14', '2024-02-14', 'Available'),
(4, 'Spinach', 75.50, 'kg', '2024-01-16', '2024-01-26', 'Available'),
(5, 'Mango', 250.00, 'kg', '2024-01-01', '2024-01-31', 'Available'),
(5, 'Banana', 400.00, 'kg', '2024-01-02', '2024-01-22', 'Available');

-- Insert test buyers
INSERT INTO `buyers` (`name`, `phone`, `location`, `email`, `buyer_type`) VALUES
('Fresh Mart', '+91-9876543220', 'Delhi, India', 'fresh.mart@email.com', 'Retailer'),
('Green Restaurant', '+91-9876543221', 'Mumbai, India', 'green.restaurant@email.com', 'Restaurant'),
('John Doe', '+91-9876543222', 'Bangalore, India', 'john.doe@email.com', 'Individual'),
('Food Distributors Ltd', '+91-9876543223', 'Chennai, India', 'food.distributors@email.com', 'Distributor'),
('Healthy Eats', '+91-9876543224', 'Kolkata, India', 'healthy.eats@email.com', 'Restaurant');

-- Insert test NGOs
INSERT INTO `ngos` (`name`, `contact_person`, `phone`, `location`, `email`) VALUES
('Feed the Hungry', 'Dr. Anjali Mehta', '+91-9876543230', 'Delhi, India', 'feed.hungry@email.com'),
('Food for All', 'Mr. Ravi Verma', '+91-9876543231', 'Mumbai, India', 'food.all@email.com'),
('Community Kitchen', 'Ms. Sita Reddy', '+91-9876543232', 'Hyderabad, India', 'community.kitchen@email.com'),
('Hope Foundation', 'Dr. Kumar Singh', '+91-9876543233', 'Pune, India', 'hope.foundation@email.com'),
('Share & Care', 'Mrs. Meera Joshi', '+91-9876543234', 'Ahmedabad, India', 'share.care@email.com');

-- Insert test sellers (transporters)
INSERT INTO `sellers` (`name`, `phone`, `vehicle_no`, `location`, `availability_status`) VALUES
('Transport Solutions', '+91-9876543240', 'MH-01-AB-1234', 'Mumbai, India', 'Available'),
('Quick Delivery', '+91-9876543241', 'DL-02-CD-5678', 'Delhi, India', 'Available'),
('Fast Logistics', '+91-9876543242', 'KA-03-EF-9012', 'Bangalore, India', 'Available'),
('Reliable Transport', '+91-9876543243', 'TN-04-GH-3456', 'Chennai, India', 'Available'),
('Express Cargo', '+91-9876543244', 'WB-05-IJ-7890', 'Kolkata, India', 'Available');

-- Insert test orders
INSERT INTO `orders` (`crop_id`, `buyer_id`, `quantity`, `status`) VALUES
(1, 1, 50.00, 'Pending'),
(2, 2, 100.00, 'Confirmed'),
(3, 3, 25.00, 'Pending'),
(4, 4, 30.00, 'Confirmed'),
(5, 5, 200.00, 'Pending');

-- Insert test transactions
INSERT INTO `transactions` (`crop_id`, `farmer_id`, `buyer_id`, `seller_id`, `transaction_type`, `price`, `delivery_status`) VALUES
(1, 1, 1, 1, 'Commercial', 1500.00, 'Pending'),
(2, 1, 2, 2, 'Commercial', 2000.00, 'In Progress'),
(3, 2, 3, 3, 'Commercial', 750.00, 'Pending'),
(4, 2, 4, 4, 'Commercial', 900.00, 'In Progress'),
(5, 3, 5, 5, 'Commercial', 4000.00, 'Pending');

-- Insert test logistics
INSERT INTO `logistics` (`transaction_id`, `pickup_location`, `drop_location`, `delivery_date`, `status`) VALUES
(1, 'Punjab, India', 'Delhi, India', '2024-02-01', 'Assigned'),
(2, 'Punjab, India', 'Mumbai, India', '2024-02-02', 'In Progress'),
(3, 'Haryana, India', 'Bangalore, India', '2024-02-03', 'Assigned'),
(4, 'Haryana, India', 'Chennai, India', '2024-02-04', 'In Progress'),
(5, 'Uttar Pradesh, India', 'Kolkata, India', '2024-02-05', 'Assigned');

-- ========================
-- 📊 USEFUL QUERIES FOR TESTING
-- ========================

-- View all farmers
-- SELECT * FROM farmers;

-- View all available crops
-- SELECT c.*, f.name as farmer_name, f.location as farmer_location 
-- FROM crops c 
-- JOIN farmers f ON c.farmer_id = f.farmer_id 
-- WHERE c.status = 'Available';

-- View all buyers
-- SELECT * FROM buyers;

-- View all NGOs
-- SELECT * FROM ngos;

-- View all sellers
-- SELECT * FROM sellers;

-- View all orders with details
-- SELECT o.*, c.crop_name, b.name as buyer_name 
-- FROM orders o 
-- JOIN crops c ON o.crop_id = c.crop_id 
-- JOIN buyers b ON o.buyer_id = b.buyer_id;

-- View all transactions with details
-- SELECT t.*, c.crop_name, f.name as farmer_name, b.name as buyer_name, s.name as seller_name 
-- FROM transactions t 
-- JOIN crops c ON t.crop_id = c.crop_id 
-- JOIN farmers f ON t.farmer_id = f.farmer_id 
-- LEFT JOIN buyers b ON t.buyer_id = b.buyer_id 
-- LEFT JOIN sellers s ON t.seller_id = s.seller_id;

-- View all logistics with details
-- SELECT l.*, t.transaction_id, c.crop_name 
-- FROM logistics l 
-- JOIN transactions t ON l.transaction_id = t.transaction_id 
-- JOIN crops c ON t.crop_id = c.crop_id;

-- ========================
-- ✅ SETUP COMPLETE
-- ========================

SELECT 'Database setup completed successfully!' as message;
SELECT COUNT(*) as farmers_count FROM farmers;
SELECT COUNT(*) as crops_count FROM crops;
SELECT COUNT(*) as buyers_count FROM buyers;
SELECT COUNT(*) as ngos_count FROM ngos;
SELECT COUNT(*) as sellers_count FROM sellers;
SELECT COUNT(*) as orders_count FROM orders;
SELECT COUNT(*) as transactions_count FROM transactions;
SELECT COUNT(*) as logistics_count FROM logistics;


