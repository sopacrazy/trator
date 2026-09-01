CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tractors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  plate VARCHAR(20) NOT NULL,
  model VARCHAR(100) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS operators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  registration VARCHAR(30) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usage_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tractor_id INT NOT NULL,
  operator_id INT NOT NULL,
  departure_time DATETIME NOT NULL,
  initial_rpm INT NOT NULL,
  destination VARCHAR(255) NOT NULL,
  departure_notes TEXT NULL,
  return_time DATETIME NULL,
  final_rpm INT NULL,
  return_notes TEXT NULL,
  status ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
  created_by INT NULL,
  CONSTRAINT fk_usage_tractor FOREIGN KEY (tractor_id) REFERENCES tractors(id),
  CONSTRAINT fk_usage_operator FOREIGN KEY (operator_id) REFERENCES operators(id),
  CONSTRAINT fk_usage_user FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_usage_status ON usage_records (status);
CREATE INDEX idx_usage_departure ON usage_records (departure_time);
