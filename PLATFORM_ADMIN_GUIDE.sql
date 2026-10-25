-- OPERATOR-ONLY SQL EXAMPLES. Run in Supabase SQL Editor after verifying each target.
-- Never put the Supabase service-role key in browser files.

-- 1) Review businesses awaiting approval:
-- select id, company_name, slug, owner_id, is_published, created_at
-- from public.mc_saas_businesses order by created_at desc;

-- 2) Manually publish a business after review:
-- update public.mc_saas_businesses set is_published = true, updated_at = now()
-- where slug = 'cedar-bakery';

-- 3) Pause a business:
-- update public.mc_saas_businesses set is_published = false, updated_at = now()
-- where slug = 'cedar-bakery';

-- 4) Review custom-domain requests and their verification tokens:
-- select d.id, d.domain, d.verification_token, d.verified, d.active,
--        b.company_name, b.slug
-- from public.mc_saas_custom_domains d
-- join public.mc_saas_businesses b on b.id = d.business_id
-- order by d.created_at desc;

-- 5) After checking DNS TXT verification and confirming the domain is attached to
-- the production hosting provider with HTTPS, activate that exact domain:
-- update public.mc_saas_custom_domains
-- set verified = true, active = true
-- where domain = 'shop.example.com';

-- 6) Assign an existing authenticated user as a driver for one business.
-- Replace both UUIDs after checking Supabase Auth > Users and mc_saas_businesses.
-- insert into public.mc_saas_members(business_id, user_id, role)
-- values ('BUSINESS_UUID', 'AUTH_USER_UUID', 'driver')
-- on conflict (business_id, user_id) do update set role = 'driver';

-- 7) Revoke a member:
-- delete from public.mc_saas_members
-- where business_id = 'BUSINESS_UUID' and user_id = 'AUTH_USER_UUID';
