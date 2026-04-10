-- Up
CREATE TABLE users (
  id VARCHAR(16) PRIMARY KEY,
  salesperson_id VARCHAR(16) NULL,
  employee_id VARCHAR(16) NULL,
  department_id VARCHAR(16) NULL,
  first_name VARCHAR(64),
  last_name VARCHAR(64),
  email VARCHAR(64),
  phone_number VARCHAR(64) NULL,
  job_title VARCHAR(64) NULL,
  profile_picture VARCHAR(64),
  password VARCHAR(64),
  is_mobile_user BOOLEAN,
  is_cashier BOOLEAN,
  is_archived BOOLEAN
);

CREATE TABLE users_permissions (
  user_id VARCHAR(16),
  module VARCHAR(32),
  is_read BOOLEAN,
  is_write BOOLEAN
);

-- Down
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS users_permissions;
