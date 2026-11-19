-- Example idempotent seed row
INSERT INTO categories (name)
VALUES ('General')
ON CONFLICT (name) DO NOTHING;