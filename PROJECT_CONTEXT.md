# Project Context: LPU Summer School

Last audited: 2026-05-26, Asia/Calcutta.

This file is the permanent project memory for the LPU Summer School site. Update it whenever changing routes, data shape, Supabase objects, payment behavior, admin behavior, deployment settings, environment requirements, or major UI flows.

## Project Purpose

This repository powers the LPU Summer School 2026 public website, registration flow, UPI screenshot payment flow, and browser-based admin dashboard.

The site lets families:

- Browse program tracks, session schedules, fee tiers, contact details, and gallery images.
- Register a student by choosing one course per selected session.
- Pay manually through UPI deep links or UPI ID/QR.
- Upload a payment screenshot for later admin verification.
- See a pending-verification receipt after screenshot upload.

Admins can:

- Log in through Supabase Auth.
- View, filter, export, approve, reject, or cancel registrations.
- Manage programs, sessions, courses, fee tiers, gallery images, and site settings.
- Upload course/gallery images into Supabase Storage.
- Send confirmation email through a Supabase Edge Function after approval.

## Repository Shape

Tracked source files:

- `index.html`: public homepage.
- `register.html`: registration and payment page.
- `admin.html`: admin login/dashboard shell.
- `script.js`: public homepage and registration behavior.
- `styles.css`: public homepage, registration, payment modal, receipt, and mobile styles.
- `admin.js`: admin auth, data loading, CRUD, storage upload, email trigger, and dashboard UI.
- `admin.css`: admin dashboard styles.
- `supabase/migrations/20260521170842_program_model.sql`: program-aware schema, seed programs, and public registration RPC.
- `supabase/migrations/20260521171245_tighten_program_security.sql`: tightened RPC/admin execute surface.
- `supabase/migrations/20260521181947_tighten_program_public_policy.sql`: narrowed active program public read policy to anon.
- `supabase/migrations/20260526084756_update_hostel_daily_rates.sql`: updates hostel config to daily per-bed rates and recalculates hostel totals in the registration RPC from daily rate times program duration days.
- `assets/dsosww-logo.png`, `assets/lpu-naac-logo.png`, `assets/sww-logo.png`: tracked local image assets.
- `.gitignore`: ignores `node_modules/`, `.playwright-mcp/`, `.code-review-graph/`, root `*.png` screenshots except `assets/*.png`, `.claude/`, and `.vercel/`.

Important local/generated files:

- `.vercel/project.json`: local Vercel link metadata for project `lpu-summer-school`; should stay ignored.
- `.claude/settings.local.json`: previous local tool permissions; ignored, not source of app behavior.
- Many root PNG files are local visual QA screenshots and are ignored by git.

No local files currently exist for:

- Supabase RLS/storage policies.
- Supabase Edge Function source.
- Environment variable examples.
- Package manager config, build scripts, tests, linting, or bundling.
- Backend/API server code.

## Architecture

This is a static, vanilla HTML/CSS/JS application deployed as static files. There is no local backend server in the repository.

The browser talks directly to Supabase:

- Public pages read Supabase REST tables with the anon key.
- Registration creation calls a public Supabase REST RPC (`create_program_registration`), while screenshot upload still calls a public Supabase Edge Function.
- Admin logs in with Supabase Auth and then calls Supabase REST/Storage/Functions with the user access token.
- Static deployment is linked to Vercel.

High-level flow:

```text
Browser pages
  -> static HTML/CSS/JS
  -> Supabase REST for public content and admin CRUD
  -> Supabase Auth for admin sessions
  -> Supabase REST RPC for registration creation
  -> Supabase Edge Functions for screenshot upload and email
  -> Supabase Storage for public course/gallery images and inferred payment proof storage
```

## Tech Stack

- Frontend: vanilla HTML, CSS, JavaScript.
- Hosting: Vercel static project.
- Backend services: Supabase REST, Auth, Storage, and Edge Functions.
- Payment model: manual UPI payment plus screenshot verification.
- Email: inferred Supabase Edge Function named `send-email`.
- Build system: none. Files are served directly.
- Runtime dependencies: none checked into repo.

## Routing And Pages

### `index.html`

Public landing page with:

- Utility bar and sticky header.
- Premium cinematic single-column hero with a fixed `LPU Summer School 2026` main heading, orange `Learn. Build. Showcase.` pill, dynamic program description/urgency, plain-text CTA buttons, responsive desktop program grid, compact countdown bar, and a darkened program-specific background media layer that changes when the selected/auto-rotated program changes on desktop/tablet. Desktop/tablet program background images come from separate admin Settings keys (`hero_bg_campus`, `hero_bg_online`, `hero_bg_staff_camp`, `hero_bg_skills`, `hero_bg_immersion`) and are independent from the scrolling Gallery. The hero countdown uses stable grid columns for date, timer boxes, and seats so program changes do not shift the timer or overflow long notes. Programs without an announced deadline show muted timer boxes and `Seats Update / TBA` instead of calculating a misleading seats-left number. Active `gallery_images` rows, ordered by `sort_order`, populate the auto-advancing hero strip only, with bundled fallbacks if the admin gallery is empty. The strip scrolls through unique images with JS auto-advance, pauses on user interaction, and scrolls only the gallery container via centered `scrollTo` so the whole page cannot shift horizontally. It does not create duplicate loop cards. The previous `Eligibility / Duration / Mode / Focus` hero stats cards were removed to reduce clutter. Mobile is the priority layout: the background image layer and desktop dark bottom overlay are hidden, the hero surface uses warm orange/white instead of dark navy, spacing is compressed, the image strip is visually ordered directly after the hero CTAs as a centered carousel with small side peeks, solid white surfaces are used for the secondary CTA/program/countdown cards, and program cards become full-width horizontal swipe cards so text does not cut off.
- Program dates strip.
- Impact strip.
- Story cards.
- Track grid populated from Supabase `courses`.
- Session cards populated from Supabase `sessions` and `courses`.
- Fee table populated from Supabase `fee_tiers`.
- Hostel fee note.
- Recognition section.
- Footer/contact overlay.
- Floating register and floating contact buttons.

### `register.html`

Registration page with:

- Shared header/footer/contact overlay.
- Registration hero and step progress.
- Student details block.
- Parent/guardian details block.
- Three session selection cards, statically named `session1`, `session2`, `session3`.
- Optional hostel/meals radio group.
- Additional info and consent.
- Sticky submit/fee summary.
- UPI payment modal.
- Screenshot upload state machine.
- Pending-verification receipt modal shown after screenshot upload.
- Body-level hidden file input for mobile upload reliability.

`register.html` CSP allows `blob:` in `img-src` so payment screenshot previews can render from object URLs.

### `admin.html`

Admin page with:

- Supabase Auth email/password login.
- Forgot password flow.
- Dashboard shell after login.
- Tabs: Registrations, Programs, Courses, Sessions, Fees, Gallery, Settings.
- Shared modal for CRUD forms and registration detail view.

## Content Security Policy

- `index.html`: `script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `connect-src 'self' https://bynpuhoysivxxlblxica.supabase.co`, `img-src 'self' https: data:`.
- `register.html`: same pattern, with local working-tree change to also allow `blob:` images.
- `admin.html`: allows `script-src 'self' 'unsafe-inline'` because admin renders inline `onclick` handlers into table/modal HTML.

Risk: `register.html` includes an inline `onclick="window.print()"` button while its CSP does not allow inline scripts. The print button may be blocked unless CSP is relaxed or the handler is moved into `script.js`.

## Supabase Integration

Supabase project URL hardcoded in both `script.js` and `admin.js`:

- `https://bynpuhoysivxxlblxica.supabase.co`

Production Supabase project confirmed by user on 2026-05-20:

- Project URL: `https://bynpuhoysivxxlblxica.supabase.co`
- Project ref: `bynpuhoysivxxlblxica`

Local Codex Supabase access setup on 2026-05-20:

- `~/.codex/config.toml` has a remote MCP server named `supabase` pointing to `https://mcp.supabase.com/mcp?project_ref=bynpuhoysivxxlblxica`.
- `remote_mcp_client_enabled = true` is enabled in the local Codex config.
- `codex mcp login supabase` completed successfully through OAuth.
- Supabase MCP is configured. On 2026-05-26 the Codex MCP client needed a fresh OAuth login before tools became available; after re-login, migration `20260526084756_update_hostel_daily_rates` was applied through Supabase MCP. The local Supabase CLI account still does not have direct project access through `supabase link`.

The Supabase anon key is also hardcoded in both files. Do not duplicate the key in docs unless necessary; rotate/update both JS files together if the anon key changes.

The public anon key can read at least these content tables, verified by read-only REST samples:

- `programs`
- `sessions`
- `courses`
- `fee_tiers`
- `site_config`
- `gallery_images`

The Supabase OpenAPI schema endpoint rejected the anon key and requires a service role key. Schema was therefore verified through Supabase MCP `list_tables` and REST smoke checks instead of OpenAPI.

### Verified Tables

#### `programs`

Added by `supabase/migrations/20260521170842_program_model.sql`.

Important columns:

- Identity/display: `id`, `slug`, `name`, `short_label`, `description`, `cta_context`, `sort_order`, `is_active`
- Program metadata: `dates_label`, `start_date`, `end_date`, `mode`, `duration`, `location`
- Registration urgency: `registration_deadline`, `deadline_label`, `seats_label`, `seats_base`, `seats_min`, `seats_note`
- Fee behavior: `fee_mode`, `fee_status`, `base_fee`, `gst_rate`, `allow_hostel`, `registration_enabled`
- Media: `image_url`, `background_image_url`

Seeded programs:

- `campus`: 2 Week Campus Program; registration open; session-count fee tiers; hostel allowed.
- `online`: Online Course; date/fee to be announced; registration closed until admin enables it.
- `staff-camp`: LPU Staff Kid Summer Camp; date known; fee to be announced; registration closed.
- `skills`: Tailor-Made Skills Workshop; date/fee to be announced; registration closed.
- `immersion`: LPU Immersion Program; date known; fee to be announced; registration closed.

Used by:

- Homepage hero program selector, descriptions, metadata, urgency, and program backgrounds.
- Homepage Program tracks filter/section.
- Registration program picker and submit gating.
- Admin Programs CRUD and filters in Registrations/Courses/Sessions/Fees.

RLS/policies:

- Public active read policy is restricted to `anon`.
- Authenticated admin policy allows full program management when `auth.uid()` is present.
- Supabase advisor still warns that the public registration RPC is a callable `SECURITY DEFINER` function; this is intentional for public registration creation and must remain narrowly validated.

#### `sessions`

Verified columns:

- `id`
- `program_id`
- `name`
- `time_slot`
- `sort_order`
- `is_active`
- `created_at`

Used by:

- Homepage session cards, filtered by selected program.
- Registration session labels/time slots, filtered by selected program.
- Admin Sessions tab, with program filter and program assignment.
- Admin Courses tab session relation/filter.

#### `courses`

Verified columns:

- `id`
- `program_id`
- `session_id`
- `name`
- `description`
- `category`
- `class_range`
- `image_url`
- `is_active`
- `sort_order`
- `created_at`

Used by:

- Homepage track grid and mobile course bottom sheet, filtered by selected program and category.
- Registration course dropdowns, filtered by selected program and session.
- Admin Courses CRUD, with program filter/assignment and program-filtered session choices.

`session_id` references `sessions.id`; `program_id` references `programs.id`.

#### `fee_tiers`

Verified columns:

- `id`
- `program_id`
- `session_count`
- `fee_amount`
- `label`

Used by:

- Homepage fee table for the selected program.
- Registration fee calculation for the selected program.
- Admin Fees CRUD, with program filter/assignment.

Constraint:

- Fee tiers are unique per `(program_id, session_count)`.

#### `site_config`

Verified columns/shape:

- `key`
- `value`
- `description`
- `updated_at`

Verified keys:

- `address`
- `contact_email`
- `contact_phone_1`
- `contact_phone_2`
- `director_email`
- `event_end_date`
- `event_name`
- `event_start_date`
- `event_year`
- `hero_bg_campus`
- `hero_bg_immersion`
- `hero_bg_online`
- `hero_bg_skills`
- `hero_bg_staff_camp`
- `hostel_food_fee` (daily AC hostel bed rate per student bed; currently intended as Rs. 300/day)
- `hostel_only_fee` (daily Non-AC hostel bed rate per student bed; currently intended as Rs. 100/day)
- `max_seats`
- `program_director`
- `project_manager_1`
- `project_manager_2`
- `registration_deadline`
- `university_name`
- `upi_id`

Used by:

- Public contact/footer settings.
- Program date/deadline display.
- Desktop/tablet hero program backgrounds through `hero_bg_*` keys. These are separate from `gallery_images`.
- Hostel daily per-bed rate labels and calculations.
- Admin Settings tab.
- Inferred Edge Function payment setup through `upi_id`.

#### `gallery_images`

Verified columns from REST sample:

- `id`
- `image_url`
- `alt_text`
- `sort_order`
- `is_active`
- `created_at`

Used by:

- Homepage hero full-bleed bottom image strip.
- Admin Gallery CRUD.

#### `registrations`

Verified through MCP table inspection; row data was not broadly sampled to avoid exposing private registration data.

Important columns:

- Identity/timestamps: `id`, `created_at`
- Program: `program_id`, `program_slug`, `program_name`, `program_snapshot`
- Student: `student_name`, `class_level`, `school_name`, `city`
- Guardian/contact: `guardian_name`, `phone`, `email`, `emergency_phone`
- Course selections: legacy `session1_course`, `session2_course`, `session3_course`, plus `selected_course_ids` JSONB
- Hostel: `hostel_option`, `hostel_amount`
- Payment/fees: `session_fee`, `gst_amount`, `total_fee`, `payment_reference`, `payment_status`
- Verification/admin: `status`, `screenshot_url`, `verified_by`, `verified_at`
- Notes: `medical_note`

Admin expects statuses including:

- Registration `status`: `pending`, `confirmed`, `cancelled`, `rejected`
- `payment_status`: `verification_pending`, `paid`, `unpaid`, `failed`

New registrations should be created through `public.create_program_registration(payload jsonb)`, not by direct table inserts from the public browser.

#### `payments`

Verified table exists but currently has zero rows. It is retained for historical Razorpay/gateway-shaped data:

- `registration_id`
- `razorpay_order_id`
- `razorpay_payment_id`
- `razorpay_signature`
- `base_amount`
- `gst_amount`
- `total_amount`
- `currency`
- `status`

The current public payment flow is manual UPI screenshot verification, not Razorpay capture.

## Storage

Verified/inferred buckets:

- `images`: public bucket used for course and gallery images. Admin uploads via `POST /storage/v1/object/images/{fileName}` and constructs public URLs at `/storage/v1/object/public/images/{fileName}`.
- Payment screenshot bucket/path is not visible in this repo. `script.js` uploads screenshots to `functions/v1/upload-screenshot`, which likely stores proof images and updates `registrations.screenshot_url`.

Storage policy source is missing from repo. Because admin uploads directly from the browser using a Supabase user JWT, the `images` bucket policy must allow authenticated uploads. Public image display assumes public read access.

## Registration API

### `public.create_program_registration(payload jsonb)`

Added by `supabase/migrations/20260521170842_program_model.sql`.

Called by `script.js` from `register.html` through Supabase REST RPC:

- URL: `/rest/v1/rpc/create_program_registration`
- Method: `POST`
- Headers: public anon `apikey` and `Authorization: Bearer <anon key>`
- Body: `{ "payload": { ... } }`

Request payload:

- `program_slug`
- `student_name`
- `class_level`
- `school_name`
- `city`
- `guardian_name`
- `phone`
- `email`
- `emergency_phone`
- `course_ids`
- `hostel_option`
- `medical_note`

Server/database responsibilities:

- Validate required fields and selected program.
- Reject inactive programs, closed registration, or fee-to-be-announced programs.
- Validate selected course IDs are active, belong to the selected program, and do not duplicate a session.
- Recalculate fee from program-specific `fee_tiers` or `programs.base_fee`.
- Apply hostel fee only when the program allows hostel. Hostel settings are daily per-bed rates; the RPC multiplies the selected daily rate by program duration days, preferring duration text such as `2 weeks` -> 14 days, then falling back to program start/end dates.
- Calculate GST from `programs.gst_rate`.
- Create a pending registration with program snapshot and unique payment reference.
- Return UPI payment data and receipt-ready fields.

Expected response fields used by UI:

- `registration_id`
- `payment_reference`
- `program_slug`
- `program_name`
- `session_fee`
- `hostel_amount`
- `gst_amount`
- `total_amount`
- `courses`
- `upi_id`
- `upi_url`
- `qr_data_url`

Security note:

- The function is `SECURITY DEFINER` because anon users cannot directly insert registrations under RLS.
- Execute permission is granted to `anon` only, not `authenticated`.
- Supabase security advisor will still warn about an anon-callable security definer function. Treat this as intentional but keep validation strict.

## Edge Functions

Function source is not present in the repo. Current client code still depends on:

### `create-registration`

Legacy function that was previously called by `script.js`. The current browser registration creation path uses `public.create_program_registration` instead. Keep this function only for backward compatibility until the Supabase dashboard/function list confirms whether any live traffic still uses it.

### `upload-screenshot`

Called by `script.js` from `register.html`:

- URL: `/functions/v1/upload-screenshot`
- Method: `POST`
- Body: `FormData`
- No `apikey` or `Authorization` header is sent by the client.

Form fields:

- `registration_id`
- `payment_reference`
- `screenshot`

Inferred responsibilities:

- Validate registration/payment reference.
- Store proof image.
- Update registration `screenshot_url`.
- Set `payment_status` to `verification_pending`.

### `send-email`

Called by `admin.js`:

- URL: `/functions/v1/send-email`
- Method: `POST`
- Headers include `Content-Type`, `apikey`, and admin `Authorization` bearer token.
- Body: `{ to, subject, html }`

Used after admin approval/confirmation. Failures are caught and only logged in the browser console, so email failure does not block admin approval.

## Public Data Flow

On page load, `script.js`:

1. Defines fallback program, session/course, and fee data.
2. Fetches active programs, active sessions, active courses, fee tiers, and site config from Supabase REST.
3. Applies settings to contact/footer/deadline/date/hostel UI.
4. Normalizes `programs` rows into the hero/registration/admin-friendly program model.
5. Builds per-program fee maps and filters sessions/courses by selected program.
6. Populates registration program cards, course dropdowns, homepage track cards, session cards, and fee table.
7. Initializes the homepage hero program selector. The main heading stays fixed; only description, metadata, deadline/countdown, seats-left note/count, and active tab state change. Legacy facts targets are optional because the visible hero stats cards were removed.
8. Auto-rotates the selected hero program every few seconds while preserving click/tap and keyboard selection.
9. Hero media loads active `gallery_images` rows from Supabase/admin and rebuilds the homepage hero strip without adding duplicate loop images. The strip auto-advances through existing cards in JS, pauses on user interaction, and uses centered container `scrollTo` rather than card `scrollIntoView` to avoid page-level horizontal shifting. On mobile the centered card intentionally shows small previous/next peeks. Desktop/tablet program backgrounds load from separate `site_config` `hero_bg_*` keys, with hardcoded fallbacks if those settings are empty.
10. Homepage Program tracks, Sessions, and Fees sections follow the selected hero/program filter. Programs without configured tracks show an empty-state message instead of showing campus courses.
11. Runs nav, countdown, seats-left urgency, reveal, contact overlay, and social-proof UI. The social-proof toast is hidden on small mobile viewports so it does not cover the hero program list.

Important: REST fetch failures are mostly silent and leave hardcoded HTML/JS fallback content in place.

## Registration Flow

1. User chooses one of the five active programs.
2. Registration only opens if that program has `registration_enabled = true`, `fee_status = ready`, and usable fee configuration.
3. User fills student, guardian, session/course, hostel, medical note, and consent fields.
4. Session/course dropdowns are filtered to the selected program.
5. Hostel UI is hidden/disabled when the selected program does not allow hostel.
6. Validation runs per field/block and controls the submit button.
7. Session fee is based on the selected program's fee mode and fee tiers.
8. Hostel fee is calculated from `HOSTEL_DAILY_RATES`, overridden by `site_config`, then multiplied by the selected program's chargeable duration days. The public labels must say per student bed, per day.
9. GST is calculated client-side from the selected program GST rate for display only.
10. On submit, the browser calls `public.create_program_registration`.
11. The database/RPC recalculates all server-truth amounts and creates the registration.
12. The returned payment data opens the UPI payment modal.
13. Pending registration state is stored in `sessionStorage` as `lpu_pending_reg` for up to two hours.
14. User pays externally in a UPI app or manually by UPI ID/QR.
15. User selects a screenshot.
16. Browser validates `file`, `file.size`, and image MIME/extension before processing.
17. Browser creates a preview with `URL.createObjectURL()` and waits for `img.onload` before enabling submit.
18. Browser attempts compression only after preview/decode succeeds; large images and HEIC/HEIF are converted to JPEG when possible.
19. If compression/blob creation fails after a valid preview, the browser falls back to the original validated image instead of blocking submission.
20. Browser posts the screenshot to `upload-screenshot`.
21. UI shows a fixed pending-verification receipt modal, keeps the background locked, and clears/revokes upload preview state.

## Payment Verification Flow

Payment is not gateway-verified. It is a manual UPI flow:

1. Database RPC creates a pending registration and payment reference.
2. User pays via UPI outside the site.
3. User uploads a payment screenshot.
4. Admin reviews screenshot in `admin.html`.
5. Admin approves:
   - `status = confirmed`
   - `payment_status = paid`
   - `verified_by = admin`
   - `verified_at = current ISO timestamp`
   - confirmation email attempted through `send-email`
6. Admin rejects:
   - `status = rejected`
   - `payment_status = failed`
   - `verified_by = admin`
   - `verified_at = current ISO timestamp`

## Admin Modules

### Authentication

- Supabase Auth password grant at `/auth/v1/token?grant_type=password`.
- Password reset via `/auth/v1/recover`.
- Password update via `/auth/v1/user`.
- Logout via `/auth/v1/logout`.
- Access token, email, and login time stored in `localStorage`.
- Client-side session timeout is two hours.

### Registrations

- Loads `registrations` ordered by `created_at.desc`.
- Filters by program, registration status, payment status, and search text.
- Exports all registration fields to CSV.
- Shows screenshot thumbnail and registration detail modal.
- Approves/rejects payment verification.
- Sends confirmation email on approval or direct confirm status.
- Detail modal and confirmation email include program, program dates, selected courses, session fee, hostel fee, GST, and total amount.

### Programs

- CRUD over `programs`.
- Admin can edit names/labels, hero descriptions, dates, deadline, mode, duration, location, seats labels/notes, fee mode/status, base fee, GST rate, hostel allowance, registration enabled, active state, sort order, card image, and background image.
- Program image/background image can be uploaded to the `images` bucket or entered as a URL.
- Program activation is separate from registration opening. Keep `registration_enabled = false` and `fee_status = to_be_announced` until sessions, courses, and fees are configured.

### Sessions

- CRUD over `sessions`.
- Sessions belong to a program through `program_id`.
- Admin can filter sessions by program.
- `time_slot` is edited as start/end native time inputs and saved as `"HH:MM - HH:MM"`.
- Delete calls only `DELETE sessions?id=eq.{id}`; cascade behavior is database-defined and not visible in repo.

### Courses

- CRUD over `courses`.
- Courses belong to both `program_id` and `session_id`.
- Relation display uses `select=*,programs(name),sessions(name,time_slot,program_id)`.
- Admin can filter courses by program.
- Course form filters the session dropdown to the selected program.
- Can upload image to `images` bucket or enter an image URL.
- Categories supported in UI: `tech`, `creative`, `career`, `sports`, `general`.

### Fees

- CRUD over `fee_tiers`.
- Fee tiers belong to a program through `program_id`.
- Admin can filter fee tiers by program.
- Fee calculation assumes a tier exists for the selected program and selected session count unless the program uses package/custom/base fee mode.

### Gallery

- CRUD over `gallery_images`.
- Can upload to `images` bucket or enter an image URL.
- Active gallery images feed only the homepage hero auto-advancing strip. They do not control program backgrounds. Recommended upload ratio is 16:9.

### Settings

- Loads and edits all rows from `site_config`.
- Adds virtual Settings rows for `hero_bg_campus`, `hero_bg_online`, `hero_bg_staff_camp`, `hero_bg_skills`, and `hero_bg_immersion` if missing; saving a value inserts the missing row. These fields support direct file upload or URL entry.
- Special input handling for dates, datetime, numeric fields, and text.
- `registration_deadline` is edited as date/time and saved as IST ISO string with `+05:30`.

## Reusable UI/Code Patterns

Public site:

- Data attributes drive behavior: `data-cfg`, `data-program-hero`, `data-program-option`, `data-hero-meta`, `data-session-toggle`, `data-session-course`, `data-payment-section`, `data-upload-state`, etc.
- Shared `esc()` function for HTML escaping.
- Shared `formatFee()`, `selectedSessions()`, `normalizeProgram()`, program filtering helpers, and registration validation helpers.
- Contact overlay shared by homepage and registration page.
- Course bottom sheet exists only on mobile track cards.
- Payment modal uses a state attribute: `pick`, `processing`, `ready`.

Admin:

- `$()` and `$$()` query helpers.
- `apiGet`, `apiInsert`, `apiUpdate`, `apiDelete` wrappers.
- Shared modal with dirty-state detection.
- Table rows use rendered inline handlers such as `onclick="editCourse(...)"`.
- Admin image upload helper writes directly to Supabase Storage.
- Program options and filters are generated from the `programs` table, then reused by Sessions, Courses, Fees, and Registrations.

## Deployment Flow

Deployment is static and linked to Vercel:

- Main production URL: `https://summerschool.unisportscouncil.co.in/`
- Vercel project name: `lpu-summer-school`
- Local Vercel metadata exists in `.vercel/project.json`, but `.vercel/` is ignored and should not be committed.
- There is no `vercel.json`, package script, build output, or framework config.
- Expected deployment artifact is the repo root static files.
- Supabase database migrations are tracked locally under `supabase/migrations/` and have already been applied to production through Supabase MCP.

Missing deployment details:

- Production domain and DNS ownership.
- Vercel team/member access.
- Vercel environment variables, if any.
- Supabase Auth redirect URLs for password recovery.
- Edge Function deployment/configuration process.

## Known Issues / TODO / Risks

- Backend source is still incomplete: program migrations are now tracked, but historical RLS policies, storage policies, old seed data, Edge Function source, and environment docs are still missing from the repo.
- Need Supabase dashboard/service-role access to fully verify storage policies, triggers, Auth settings, and Edge Function settings beyond MCP/table inspection.
- Supabase URL and anon key are duplicated in `script.js` and `admin.js`; future key/project changes can drift.
- Admin performs direct browser CRUD against Supabase REST; security depends entirely on RLS/admin policies that are not visible here.
- Public registration creation now uses anon-callable `public.create_program_registration`, a `SECURITY DEFINER` RPC. It is intentionally public but should be monitored, rate-limited if possible, and kept strictly validated.
- `upload-screenshot` still appears unauthenticated from the browser because it sends no auth or apikey headers. Verify CORS, JWT verification, rate limits, spam protection, server-side validation, and file validation.
- Manual UPI screenshot verification is fragile and not payment-gateway verified.
- `verified_by` is hardcoded as `"admin"` rather than the authenticated user's email/id.
- Confirmation email failure is non-blocking and only logged to console, so admins may think email was sent when it failed.
- Only the 2 Week Campus Program currently has configured sessions, courses, and fee tiers. Other programs are active for display but registration is closed until admin adds their sessions/courses/fees and enables registration.
- Registration supports exactly three static session selectors and legacy `session1_course`, `session2_course`, `session3_course` columns; admin can create more sessions, but registration will not adapt beyond three without schema/UI changes.
- New registration course choices store `selected_course_ids` JSONB plus legacy course-name fields. Renames are safer than before but the legacy text fields can still become ambiguous.
- Dynamic sessions are mapped by selected program and sorted array position to `session1`, `session2`, `session3`; reordering sessions changes registration meaning unless controlled carefully.
- Fee/hostel/GST calculation happens in the client for display and is recalculated server-side by `create_program_registration`. Hostel options use legacy values `hostel_only` and `hostel_food` for compatibility, but the visible labels are now Non-AC hostel bed and AC hostel bed.
- Public content fetch failures are mostly silent, leaving stale hardcoded fallback content.
- Deadline/countdown display is advisory. The RPC enforces program open/closed and fee status, but it does not currently hard-block registrations after `registration_deadline`.
- The homepage hero displays program-specific but simulated seats-left urgency from client-side time/deadline logic, not actual capacity or registration count.
- Social proof popups are generated fake registration notifications. This is a trust/ethics and UX risk.
- Screenshot upload currently includes detailed temporary console logging for file metadata, preview/decode/compression/upload states. Remove or gate these logs after the mobile upload issue is confirmed fixed in production.
- `admin.html` allows `script-src 'unsafe-inline'` to support inline handlers, which increases XSS impact if any escaping is missed.
- Admin auth token is stored in `localStorage`; XSS would expose it.
- Admin image uploads have no visible client-side size/compression limits.
- `deleteSession` assumes deleting a session deletes or handles courses, but cascade behavior is unknown.
- Site uses a mix of hardcoded static values and dynamic `site_config`; future edits should avoid updating only one source.
- There are no formal automated tests, lint checks, or deployment smoke tests. Current verification uses `node --check`, `git diff --check`, Supabase REST/RPC smoke tests, Supabase advisors, local HTTP checks, and headless Chrome screenshots/console checks.
- Root screenshot artifacts are ignored but clutter the workspace; keep them out of source commits.

## Access Needed For Full End-To-End Maintenance

To fully operate/manage this project as primary engineer, obtain:

- Supabase dashboard access for project `bynpuhoysivxxlblxica`.
- Supabase service role key or exported SQL schema, RLS policies, storage policies, triggers, and seed data.
- Supabase Edge Function source for `create-registration`, `upload-screenshot`, and `send-email`.
- Edge Function environment variables and deployment instructions.
- Storage bucket list and policies, especially the payment screenshot bucket/path.
- Admin test account credentials and a safe staging/test registration process.
- Email provider credentials/config used by `send-email`.
- UPI/payment owner details and reconciliation process.
- Vercel project/team access and deployment permissions.
- Production domain/DNS access and Supabase Auth redirect URL settings.

## Maintenance Rules For Future Changes

- Before editing behavior, check this file and update it if the architecture, schema, routes, flows, configs, or risks change.
- Keep Supabase/table/function changes documented here in the same PR/commit as the code change.
- Do not change payment, registration, admin approval, or storage behavior without checking server-side Edge Function/RLS implications.
- Preserve existing user-owned local changes unless explicitly asked to revert them.
