-- ==========================================
-- Flask User Management System Database
-- Author : Akash Raval
-- Database : user_management
-- ==========================================

CREATE DATABASE IF NOT EXISTS user_management;
USE user_management;

-- ==========================================
-- Admin Table
-- ==========================================

DROP TABLE IF EXISTS admin_tb;

CREATE TABLE admin_tb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Admin_name VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);

INSERT INTO admin_tb
(Admin_name, Email, Password)

VALUES
(
'Admin',
'admin@example.com',
'<hashed-password>'
);

-- ==========================================
-- User Registration Table
-- ==========================================

DROP TABLE IF EXISTS user_register;

CREATE TABLE user_register (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Full_name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    ragisterDate DATE NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(255)
);

INSERT INTO user_register
(
Full_name,
Email,
Password,
ragisterDate,
phone,
address
)

VALUES
(
'John Doe',
'john@example.com',
'<hashed-password>',
'2026-01-01',
'9876543210',
'New York'
),

(
'Alice Smith',
'alice@example.com',
'<hashed-password>',
'2026-01-02',
'9876543211',
'California'
);

-- ==========================================
-- Product Table
-- ==========================================

DROP TABLE IF EXISTS product_tb;

CREATE TABLE product_tb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(20) UNIQUE NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

INSERT INTO product_tb
(
product_code,
product_name,
price,
stock
)

VALUES
('PROD-001','Mechanical Keyboard',3000.00,15),
('PROD-002','Wireless Mouse',1200.00,30),
('PROD-003','Monitor',15000.00,8),
('PROD-004','Laptop Stand',1800.00,20),
('PROD-005','USB Hub',900.00,25);
