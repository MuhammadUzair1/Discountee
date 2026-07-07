-- Sample data for Discountee (mirrors frontend/src/lib/data.ts).
-- Runs automatically on `supabase db reset`, or paste into the SQL editor.

truncate table offers, merchants, banks restart identity cascade;

insert into banks (id, name, monogram, color) values
  ('meezan', 'Meezan Bank', 'MZN', '#0a7d4d'),
  ('hbl', 'HBL', 'HBL', '#00855b'),
  ('ubl', 'UBL', 'UBL', '#1763a6'),
  ('alfalah', 'Bank Alfalah', 'BAF', '#9b1b30'),
  ('scb', 'Standard Chartered', 'SC', '#0473ea'),
  ('faysal', 'Faysal Bank', 'FSL', '#1f7a52'),
  ('mcb', 'MCB Bank', 'MCB', '#16794c');

insert into merchants (id, name, category, vertical) values
  ('m-kolachi', 'Kolachi', 'BBQ & Pakistani', 'restaurant'),
  ('m-kababjees', 'Kababjees', 'BBQ & Grill', 'restaurant'),
  ('m-aylanto', 'Café Aylanto', 'Continental & Fine Dining', 'restaurant'),
  ('m-howdy', 'Howdy', 'American & Burgers', 'restaurant'),
  ('m-okra', 'OKRA', 'Mediterranean', 'restaurant'),
  ('m-chaayekhana', 'Chaaye Khana', 'Café & Desserts', 'restaurant'),
  ('m-bundukhan', 'Bundu Khan', 'BBQ & Pakistani', 'restaurant'),
  ('m-xanders', 'Xander''s', 'Continental', 'restaurant'),
  ('m-tooso', 'Tooso', 'Italian & Pizza', 'restaurant'),
  ('m-kfc', 'KFC', 'Fast Food', 'restaurant'),
  ('m-monal', 'Monal', 'Pakistani & BBQ', 'restaurant'),
  ('m-coliseum', 'Coliseum Cinema', 'Entertainment', 'retail');

insert into offers (
  id, bank_id, merchant_id, title, description, discount_type, discount_value,
  max_discount_cap, min_spend, applicable_days, time_window, cities,
  eligible_networks, eligible_tiers, valid_to, scope_note, exclusions,
  terms_url, source_url, last_verified, status
) values
  ('ofr-001', 'meezan', 'm-kolachi', '15% off the total bill at Kolachi',
   'Get 15% off your total bill at Kolachi when you pay with an eligible Meezan card. Valid on dine-in and takeaway.',
   'percentage', 15, 3000, null, '["All"]'::jsonb, null, '["Karachi"]'::jsonb,
   '["Visa","Mastercard"]'::jsonb, '["Gold","Platinum","Signature"]'::jsonb,
   '2026-12-31', null, null,
   'https://www.meezanbank.com/offers', 'https://www.meezanbank.com/discounts',
   '2026-06-22', 'active'),

  ('ofr-002', 'hbl', 'm-kababjees', '20% off on Tuesdays at Kababjees',
   'Enjoy 20% off your bill every Tuesday with HBL credit cards. The perfect midweek treat.',
   'percentage', 20, null, 2000, '["Tue"]'::jsonb, null, '["Karachi","Lahore"]'::jsonb,
   '["Visa","Mastercard","UnionPay"]'::jsonb, '["Platinum","World","World Elite"]'::jsonb,
   '2026-09-30', null, 'Not valid on public holidays.',
   'https://www.hbl.com/offers/kababjees', 'https://www.hbl.com/personal/cards/discounts',
   '2026-06-18', 'active'),

  ('ofr-003', 'ubl', 'm-aylanto', 'Buy 1 Get 1 on main courses',
   'Buy one main course and get the second free at Café Aylanto, exclusively for UBL Signature cardholders.',
   'bogo', 0, null, null, '["Mon","Tue","Wed","Thu"]'::jsonb, 'Dinner · 7pm–11pm', '["Lahore","Karachi"]'::jsonb,
   '["Visa","Mastercard"]'::jsonb, '["Signature","Infinite"]'::jsonb,
   '2026-08-15', 'Valid on à la carte main courses only.', 'Not valid on weekends & public holidays.',
   'https://www.ubldigital.com/offers/aylanto', 'https://www.ubldigital.com/Personal/Cards/Discounts',
   '2026-06-24', 'active'),

  ('ofr-004', 'alfalah', 'm-howdy', 'Rs 500 off on orders above Rs 2,500',
   'Flat Rs 500 off when you spend Rs 2,500 or more at Howdy with Bank Alfalah cards.',
   'flat', 500, null, 2500, '["All"]'::jsonb, null, '["Islamabad","Rawalpindi"]'::jsonb,
   '["Visa","Mastercard","UnionPay"]'::jsonb, '["Gold","Platinum","Titanium"]'::jsonb,
   '2026-07-20', null, null,
   'https://www.bankalfalah.com/offers/howdy', 'https://www.bankalfalah.com/personal-banking/cards/offers',
   '2026-06-21', 'active'),

  ('ofr-005', 'scb', 'm-okra', '25% off for Standard Chartered Priority',
   'Standard Chartered Priority cardholders get 25% off the total bill at OKRA. Dine-in only.',
   'percentage', 25, 5000, null, '["All"]'::jsonb, null, '["Karachi"]'::jsonb,
   '["Visa","Mastercard"]'::jsonb, '["Infinite","World Elite"]'::jsonb,
   '2026-11-30', 'Dine-in only.', null,
   'https://www.sc.com/pk/offers/okra', 'https://www.sc.com/pk/promotions',
   '2026-06-15', 'active'),

  ('ofr-006', 'faysal', 'm-chaayekhana', '10% off on desserts',
   'Sweeten your day with 10% off the dessert menu at Chaaye Khana using Faysal Bank cards.',
   'percentage', 10, null, null, '["All"]'::jsonb, null, '["Islamabad","Lahore"]'::jsonb,
   '["Visa","PayPak"]'::jsonb, '["Debit","Classic","Gold"]'::jsonb,
   '2026-10-10', 'Valid on desserts only.', null,
   'https://www.faysalbank.com/offers/chaaye-khana', 'https://www.faysalbank.com/en/personal/cards/discounts',
   '2026-06-12', 'active'),

  ('ofr-007', 'mcb', 'm-bundukhan', '5% cashback at Bundu Khan',
   'Earn 5% cashback on your bill at Bundu Khan when you pay with MCB cards. Cashback credited within 30 days.',
   'cashback', 5, 1500, null, '["All"]'::jsonb, null, '["Lahore","Karachi","Islamabad"]'::jsonb,
   '["Visa","Mastercard","PayPak"]'::jsonb, '["Gold","Platinum"]'::jsonb,
   '2026-12-15', null, null,
   'https://www.mcb.com.pk/offers/bundu-khan', 'https://www.mcb.com.pk/personal/cards/discounts',
   '2026-06-23', 'active'),

  ('ofr-008', 'meezan', 'm-xanders', 'Weekend brunch — 20% off',
   '20% off the weekend brunch menu at Xander''s for Meezan Visa Platinum and above.',
   'percentage', 20, null, null, '["Sat","Sun"]'::jsonb, 'Brunch · 11am–4pm', '["Lahore","Islamabad"]'::jsonb,
   '["Visa"]'::jsonb, '["Platinum","Signature","Infinite"]'::jsonb,
   '2026-08-31', 'Valid on the brunch menu only.', null,
   'https://www.meezanbank.com/offers/xanders', 'https://www.meezanbank.com/discounts',
   '2026-06-19', 'active'),

  ('ofr-009', 'hbl', 'm-tooso', '15% off at Tooso',
   '15% off the total bill at Tooso with HBL debit and credit cards. Dine-in and delivery.',
   'percentage', 15, null, null, '["All"]'::jsonb, null, '["Karachi"]'::jsonb,
   '["Visa","Mastercard","PayPak"]'::jsonb, '["Debit","Classic","Gold","Platinum"]'::jsonb,
   '2026-07-05', null, null,
   'https://www.hbl.com/offers/tooso', 'https://www.hbl.com/personal/cards/discounts',
   '2026-05-02', 'active'),

  ('ofr-010', 'ubl', 'm-kfc', 'Rs 300 off on orders above Rs 1,500',
   'Flat Rs 300 off at KFC nationwide when you spend Rs 1,500 or more with UBL cards.',
   'flat', 300, null, 1500, '["All"]'::jsonb, null, '["Karachi","Lahore","Islamabad","Rawalpindi"]'::jsonb,
   '["Visa","Mastercard","UnionPay","PayPak"]'::jsonb, '["Debit","Classic","Gold","Platinum"]'::jsonb,
   '2026-09-01', null, null,
   'https://www.ubldigital.com/offers/kfc', 'https://www.ubldigital.com/Personal/Cards/Discounts',
   '2026-06-25', 'active'),

  ('ofr-011', 'scb', 'm-monal', '18% off with a view at Monal',
   '18% off your bill at Monal Islamabad for Standard Chartered cardholders.',
   'percentage', 18, 4000, null, '["All"]'::jsonb, null, '["Islamabad"]'::jsonb,
   '["Visa","Mastercard"]'::jsonb, '["Platinum","Signature","Infinite"]'::jsonb,
   '2026-10-31', null, null,
   'https://www.sc.com/pk/offers/monal', 'https://www.sc.com/pk/promotions',
   '2026-06-10', 'unverified'),

  ('ofr-012', 'alfalah', 'm-coliseum', '2 tickets for the price of 1',
   'Buy one cinema ticket and get one free at Coliseum with Bank Alfalah credit cards. Weekdays only.',
   'bogo', 0, null, null, '["Mon","Tue","Wed","Thu"]'::jsonb, null, '["Lahore"]'::jsonb,
   '["Visa","Mastercard"]'::jsonb, '["Gold","Platinum","Titanium"]'::jsonb,
   '2026-07-31', null, 'Not valid on weekends, public holidays, or premium screenings.',
   'https://www.bankalfalah.com/offers/coliseum', 'https://www.bankalfalah.com/personal-banking/cards/offers',
   '2026-06-20', 'active');
