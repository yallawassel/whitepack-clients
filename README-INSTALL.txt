WHITE PACK — INSTALLABLE WEB APP FILES
========================================

Included pages
- index.html — public catalogue, with Share Catalogue and install controls.
- admin.html — private product editor, installable; intentionally has NO Share button.
- quotation.html — quotation builder with its own dedicated document/checkmark app icon.
- orders.html — your existing orders dashboard.
- site.webmanifest, admin-manifest.webmanifest, quotation-manifest.webmanifest — separate app identities.
- service-worker.js — shared service worker for installability and safe same-origin caching.
- logo.png and icon assets — White Pack app branding and the dedicated Quotation icon.

INSTALL / PUBLISH
1. Open your EXISTING GitHub repository that is used for White Pack Pages.
2. Upload these files to the same repository root, replacing index.html, admin.html, quotation.html and the related PWA files where prompted.
3. Keep your existing products.json, Supabase settings, database tables, storage files, and any other current repository files. products.json is deliberately not bundled because an old backup could overwrite newer catalogue data; the live catalogue loads from Supabase first.
4. In GitHub, check Settings → Pages and wait until the Pages website is published over HTTPS.
5. Open the public catalogue URL. The “↗ Share Catalogue” button shares that live catalogue URL; on browsers without native sharing it copies the link. Share that URL with customers.

APP LINKS ONCE PUBLISHED
- Catalogue: your published Pages URL + index.html (or the repository root URL).
- Admin: the same base URL + admin.html. Do not share the admin link publicly. Admin still requires the authorized Supabase admin sign-in.
- Quotation: the same base URL + quotation.html. It still requires authorized sign-in.

INSTALL ON DEVICES
- Android: open the HTTPS link directly in Chrome, then use Install app / Add to Home screen.
- iPhone/iPad: open the HTTPS link directly in Safari → Share → Add to Home Screen → Add. (Apple uses the system Share menu for this install step.)
- Desktop: open the HTTPS link in Chrome or Edge and use the install icon in the address bar or browser menu.
- Install each URL separately to get distinct Catalogue, Admin and Quotation app entries/icons.

IMPORTANT
- The catalogue and admin require the existing Supabase project and current policies. Publishing HTML files does not change Supabase permissions.
- Keep the Supabase secret/service-role key out of client-side files. The files should use only the existing publishable/anon key.
- The apps are web apps installed from your website, not Play Store or App Store packages.
- For GitHub Pages in a repository subfolder (username.github.io/repository/), preserve the supplied relative paths and publish all files in the same folder.
