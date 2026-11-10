WHITE PACK CATALOGUE UPDATE

Included changes
1. Admin workspace now has embedded Quotations, Orders, Driver Tracking, and Catalogue Preview sections.
2. The catalogue preview includes a Full screen preview control and an option to open separately.
3. The public catalogue cart has Order Mode and Quotation Mode.
4. Quotation Mode accepts cart quantities without stock availability checks, saves a customer request to wp_quote_requests, and opens WhatsApp with the requested items.
5. Customer quotation requests appear in the Quotations page inbox after staff sign in. Staff can open a request in the existing quotation builder or mark it reviewed.
6. Quotation requests are separate from confirmed orders and do not call submit_white_pack_order or deduct stock.

IMPORTANT SUPABASE STEP
Before deploying the updated files, open Supabase SQL Editor for the existing White Pack project and run:
wp_quote_requests_setup.sql

This creates the separate quotation-request table and its Row Level Security policies.
Do not delete or replace existing tables, products, orders, quotations, or stock data.

DEPLOY
Upload the contents of this package to the existing whitepack-clients repository, preserving the folder structure and replacing the matching files. Keep the current Supabase project and keys unchanged.

TEST CHECKLIST
- Sign in to Admin and open Quotations, Orders, Tracking, and Catalogue Preview from the sidebar.
- Use Full screen preview.
- In the public catalogue, add a product and select Quotation Mode.
- Submit with customer name and phone; address is optional in quotation mode.
- Confirm the request appears in Admin > Quotations.
- Confirm product stock in Admin > Products has not changed.
- Test Order Mode separately and confirm its existing order workflow still works.
