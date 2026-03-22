# NSS Consultancy Website

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Full single-page landing website for NSS Consultancy, a professional inventory audit & stock verification company based in Panvel, Navi Mumbai.
- Sections: Navbar, Hero, Services, Why Us, Process, Industries, Testimonials, Contact, Footer
- Contact form that stores submissions in the backend (Name, Company, Phone, Email, Message)
- Animated stat counters in Hero section
- Mobile-responsive layout with hamburger menu

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend
- `submitContact(name, company, phone, email, message)` -- stores contact enquiry
- `getContacts()` -- returns all submitted contacts (admin use)

### Frontend Sections
1. **Navbar** -- Fixed top nav, transparent on top, white on scroll. Links: Home, Services, Why Us, Process, Industries, Contact. CTA: "Get Free Quote" button.
2. **Hero** -- Full-height section, navy gradient background, badge pill, large headline with amber gradient text, subheading, two CTA buttons, animated stats grid (1000+ Audits, 98% Accuracy, 45+ Staff, 40+ Cities).
3. **Services** -- Light gray background, 5 cards: Retail Store Audit, Warehouse Audit, Fixed Asset Tagging, Compliance Audit, Manpower Support.
4. **Why Us** -- Dark navy background, two-column layout: left checklist + CTA, right 2x2 feature cards (Pan India Service, In-House Technology, Expert Auditors, Fast Turnaround).
5. **Process** -- White background, 6-step numbered cards: Initial Assessment, Planning, Physical Count, Data Analysis, Reporting, Implementation.
6. **Industries** -- Light green-tinted background, 8 industry icon cards: Apparel, Electronics, Pharmaceuticals, FMCG/Retail, Jewelry, Manufacturing, Warehousing, Cosmetics.
7. **Testimonials** -- Warm cream background, 3 testimonial cards with stars, quotes, and author info.
8. **Contact** -- Warm off-white background, two-column: left has contact info (phone, email, address) + "Why Contact Us" box; right has contact form.
9. **Footer** -- Dark navy, 4-column: brand + description + socials, Quick Links, Our Services, Contact Info. Bottom copyright bar.

### Design Tokens
- Primary: Navy (#0f1e4a), Amber (#f0a500)
- Fonts: Bricolage Grotesque (headings), Plus Jakarta Sans (body)
- Style: Modern professional services, card-based, clean spacing
