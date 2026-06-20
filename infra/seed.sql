CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_md5 VARCHAR(32)
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    account_type VARCHAR(10),
    account_name VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'SEK'
);

CREATE TABLE holdings (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id),
    ticker VARCHAR(20),
    instrument_name VARCHAR(100),
    quantity DECIMAL(12,4),
    avg_buy_price DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'SEK'
);

CREATE TABLE target_allocations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    account_type VARCHAR(10),
    target_pct DECIMAL(5,2)
);

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    alert_type VARCHAR(50),
    message TEXT,
    dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed users
-- password: password123  →  md5: 482c811da5d5b4bc6d497ffa98491e38
INSERT INTO users (name, email, password_md5) VALUES
('Anna Lindqvist', 'anna@example.com', '482c811da5d5b4bc6d497ffa98491e38'),
('Erik Johansson', 'erik@example.com', '482c811da5d5b4bc6d497ffa98491e38');

INSERT INTO accounts (user_id, account_type, account_name) VALUES
(1, 'ISK', 'Anna ISK'),
(1, 'KF', 'Anna KF'),
(1, 'Depa', 'Anna Depå');

INSERT INTO holdings (account_id, ticker, instrument_name, quantity, avg_buy_price, currency) VALUES
(1, 'ERIC-B', 'Ericsson B', 500, 68.50, 'SEK'),
(1, 'VOLV-B', 'Volvo B', 100, 245.00, 'SEK'),
(1, 'AAPL', 'Apple Inc', 50, 165.00, 'USD'),
(2, 'SWED-A', 'Swedbank A', 200, 185.00, 'SEK'),
(3, 'SAND', 'Sandvik', 300, 205.00, 'SEK');

INSERT INTO target_allocations (user_id, account_type, target_pct) VALUES
(1, 'ISK', 60.00),
(1, 'KF', 25.00),
(1, 'Depa', 15.00);

INSERT INTO alerts (user_id, alert_type, message) VALUES
(1, 'DRIFT', 'ISK-allokering avviker 8% från mål (60%). Överväg ombalansering.'),
(1, 'DRIFT', 'KF-allokering avviker 6% från mål (25%).');
