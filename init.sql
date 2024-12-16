-- Initialize get_in_touch table for contact form messages
CREATE TABLE IF NOT EXISTS get_in_touch (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_spam BOOLEAN DEFAULT FALSE
); 