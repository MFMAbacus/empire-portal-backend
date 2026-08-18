-- Up
CREATE TABLE customers (
  id VARCHAR(16) PRIMARY KEY,
  project_id VARCHAR(16) NULL,
  first_name VARCHAR(64),
  last_name VARCHAR(64),
  email VARCHAR(64),
  phone_number VARCHAR(64),
  date_of_birth DATE,
  address VARCHAR(512),
  comments VARCHAR(512) NULL,
  emergency_contact_name VARCHAR(64) NULL,
  emergency_contact_relationship VARCHAR(64) NULL,
  emergency_contact_number VARCHAR(64) NULL,
  username VARCHAR(32),
  password VARCHAR(64),
  is_invited BOOLEAN,
  is_active BOOLEAN,
  is_blocked BOOLEAN,
  profile_picture VARCHAR(64) NULL
);

CREATE TABLE customers_vehicules (
  id VARCHAR(16) PRIMARY KEY,
  customer_id VARCHAR(16),
  pallet_number VARCHAR(32),
  model VARCHAR(32),
  type VARCHAR(32),
  color VARCHAR(32)
);

-- Down
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS customers_vehicules;
