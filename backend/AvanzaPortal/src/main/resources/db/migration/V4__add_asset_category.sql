-- Add asset_category to holdings
ALTER TABLE holdings
    ADD COLUMN asset_category VARCHAR(20);

-- Add asset_category to target_allocations
ALTER TABLE target_allocations
    ADD COLUMN asset_category VARCHAR(20);

-- Existing holdings in seed data are stocks
UPDATE holdings
SET asset_category = 'EQUITY';

-- Remove old allocation model
DELETE FROM target_allocations;

-- Insert new asset-based target allocations
INSERT INTO target_allocations (
    user_id,
    asset_category,
    target_pct
) VALUES
      (1, 'EQUITY', 60.00),
      (1, 'STABLE', 40.00);

-- Make asset_category required
ALTER TABLE holdings
    ALTER COLUMN asset_category SET NOT NULL;

ALTER TABLE target_allocations
    ALTER COLUMN asset_category SET NOT NULL;

-- Remove old column
ALTER TABLE target_allocations
DROP COLUMN account_type;