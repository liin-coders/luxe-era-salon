# Luxe Era Salon – Multipage Website

Pure HTML5 + CSS3 + JavaScript. No framework, no build step. Just double-click `erasalon.html`.

## Pages
| File | Page |
|---|---|
| `erasalon.html` | Home (hero, about, services, before/after, products, insta glam, reviews, CTA) |
| `about.html` | About Us (story, stats, mission/values, journey timeline, team, before/after) |
| `services.html` | 30 services in 5 categories (Hair, Skin & Facial, Nails & Spa, Bridal & Makeup, Men's Grooming), combo packages, how it works, FAQ |
| `products.html` | 16 products with category filter, gift sets, how to order |
| `contact.html` | Quick contact cards, booking form, Google Map, what happens next, FAQ |
| `privacy-policy.html` | Privacy Policy |
| `terms-conditions.html` | Terms & Conditions |

## Header
Home | About Us | Services (icon mega menu with 5 categories x 6 services, each linking to its service card) | Products | Contact Us.
On mobile the menu opens as a side drawer and the mega menu becomes tap-to-open.

## How WhatsApp booking works
1. User opens **Contact Us** and fills the booking form.
2. On "Book on WhatsApp" the details are placed in a ready message and WhatsApp opens (`wa.me` link).
3. User only presses **Send** and the salon receives all details.
Product cards also have "Enquire on WhatsApp" buttons.

## Booking form slots
Contact page has a 5-step form: details > service > month calendar (next 30 days, with previous/next month arrows) > time-slot chips (Morning / Afternoon / Evening) > notes, with a live summary.
Edit timings in `js/main.js` (`HOURS` = open/close hour per weekday, `STEP` = slot gap in minutes, `DAYS` = how many days ahead can be booked, `LEAD_MIN` = minimum notice in minutes). Keep the footer / contact page timing text in sync.

## MUST CHANGE (important)
1. **WhatsApp number** – open `js/config.js` and edit `whatsapp` (country code + number, no `+`, no spaces, e.g. `919876543210`). Also change `name` if the salon name changes.
2. **Business details** – use Find & Replace (Ctrl+Shift+F in VS Code) across the folder:
   - `Luxe Era Salon` → your salon name
   - `+91 98765 43210` and `tel:+919876543210` and `wa.me/919876543210` → your phone
   - `hello@luxeerasalon.com` → your email
   - `123, Main Market Road, Your City, Your State - 000000, India` → your address
   - Timings: edit the footer list and the Contact page table
3. **Google Map** – in `contact.html` find `https://www.google.com/maps?q=...&output=embed` and replace the text after `q=` with your salon address (use `+` for spaces). Or paste Google Maps > Share > Embed a map > the iframe `src`.
4. **Social links** – footer links currently point to facebook.com / instagram.com / youtube.com. Put your page URLs there.
5. **Footer services list** – edit the "Our Services" column in the footer of each page (links go to `services.html#service-name`).
6. **Prices & services** – edit text in `services.html`, `products.html` and the mega menu (header on every page). Service cards have an `id` (e.g. `haircut-styling`) used by mega menu and footer links, so keep ids unchanged if you rename a service title only.

## Images
All images are placeholders in `images/` (SVG). Replace with real photos:
- Keep the same file name and change the extension in the HTML (`.svg` → `.jpg`), or save your photo as the same name.
- Before / After: `before1`, `after1`, `before2`, `after2`
- Team: `team1`–`team4`; Men's grooming: `men1`
- Hero: `hero`; About: `about1`, `about2`; Services: `service-*`; Products: `prod1`–`prod16`; Insta: `gal1`–`gal5`
- Recommended: portrait photos around 800×1000 px, compressed (WebP/JPG).

## Folder structure
```
luxe-era-salon/
├── erasalon.html  about.html  services.html  products.html  contact.html
├── privacy-policy.html  terms-conditions.html
├── css/style.css      (all design, colors in :root variables)
├── js/config.js       (WhatsApp number)
├── js/main.js         (menu, slider, filter, booking → WhatsApp, back to top)
└── images/
```

## Design
Colors (top of `css/style.css`): cream `#fbf1ee`, blush `#f6dcd9`, pink `#ee8fa5`, dark brown `#2a1d1a`.
Fonts: Anton (headings) + Poppins (body) from Google Fonts (internet required for fonts and map).

## Every page includes
Header with working nav links, before/after sections, footer (logo, short description, social links, quick links, services, weekly timings column, location, phone, email, Privacy Policy, Terms), "Created by LiinStudio" credit and a Back to Top button.

Created by [LiinStudio](https://liinstudio.netlify.app/)
