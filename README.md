# NIT HostelHub

Premium black and gold hostel management website for an engineering college in the Mangalore/Udupi side of Karnataka. It includes a bilingual English/Kannada landing page, working student login, working admin platform, student dashboard with ID-based profile photo, hostel presence tracking, room allocation, notice board, grievance queue, leave/outpass requests, visitor requests, fee/mess modules, and a PG tracker with map, list, search, local distance calculation, and route links.

## Demo credentials

Admin:
- Email: `admin@hostelhub.edu.in`
- Password: `Admin@1234`

Student:
- Admission number: `NITHH2026CSE014`
- College Gmail: `rahul.shetty26@nithostelhub.edu.in`
- Password: `Student@123`

Alternate student:
- College Gmail: `aisha.dsouza26@nithostelhub.edu.in`
- Password: `Student@123`

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://127.0.0.1:5173/`.

## Production build

```bash
npm run build
npm run preview
```

## Backend setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Add role-specific RLS policies for students, wardens, and admins before storing real student data.

The current front end works immediately with `localStorage`, so every login, status update, complaint, leave request, visitor request, notice, room allocation, and admin arrangement is functional in the browser before Supabase is connected.

## Next configuration questions

- What exact campus location should the PG tracker use for live map coordinates?
- Which payment provider should be used for hostel fee tracking?
- Should document verification require OTP, manual admin approval, or both in production?
- Who can publish notices: admins only, wardens, or department offices too?
