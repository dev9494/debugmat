-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  github_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  access_token VARCHAR(255), -- Encrypt this in prod!
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Errors Table
CREATE TABLE errors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  file_path VARCHAR(255),
  line_number INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fixes Table (The core feature)
CREATE TABLE fixes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  error_id INTEGER REFERENCES errors(id),
  original_code TEXT NOT NULL,
  fixed_code TEXT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, applied, failed
  pr_url VARCHAR(255),
  branch_name VARCHAR(255),
  confidence_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  applied_at TIMESTAMP
);

-- Usage Tracking (Monetization)
CREATE TABLE usage_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action_type VARCHAR(50), -- 'analyze', 'autofix'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
