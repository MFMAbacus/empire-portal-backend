-- Up
CREATE TABLE otps (
  id VARCHAR(16) PRIMARY KEY,
  customer_id VARCHAR(16),
  password VARCHAR(8),
  token VARCHAR(64)
);

-- Down
DROP TABLE IF EXISTS otps;