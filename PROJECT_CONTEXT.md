# Project Context: LPU Summer School

Last audited: 2026-05-20, Asia/Calcutta.

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
- Manage sessions, courses, fee tiers, gallery images, and site settings.
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
- `assets/dsosww-logo.png`, `assets/lpu-naac-logo.png`, `assets/sww-logo.png`: tracked local image assets.
- `.gitignore`: ignores `node_modules/`, `.playwright-mcp/`, `.code-review-graph/`, root `*.png` screenshots except `assets/*.png`, `.claude/`, and `.vercel/`.

Important local/generated files:

- `.vercel/project.json`: local Vercel link metadata for project `lpu-summer-school`; should stay ignored.
- `.claude/settings.local.json`: previous local tool permissions; ignored, not source of app behavior.
- Many root PNG files are local visual QA screenshots and are ignored by git.

No local files currently exist for:

- Supabase migrations or seed SQL.
- Supabase RLS/storage policies.
- Supabase Edge Function source.
- Environment variable examples.
- Package manager config, build scripts, tests, linting, or bundling.
- Backend/API server code.

## Architecture

This is a static, vanilla HTML/CSS/JS application deployed as static files. There is no local backend server in the repository.

The browser talks directly to Supabase:

- Public pages read Supabase REST tables with the anon key.
- Registration and screenshot upload call public Supabase Edge Functions.
- Admin logs in with Supabase Auth and then calls Supabase REST/Storage/Functions with the user access token.
- Static deployment is linked to Vercel.

High-level flow:

```text
Browser pages
  -> static HTML/CSS/JS
  -> Supabase REST for public content and admin CRUD
  -> Supabase Auth for admin sessions
  -> Supabase Edge Functions for registration creation, screenshot upload, and email
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
- Hero with rotating gallery images.
- Countdown and seats-left urgency UI.
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
- Pending-verification receipt.
- Body-level hidden file input for mobile upload reliability.

Current working tree note: `register.html` has a pre-existing local modification adding `blob:` to the CSP `img-src` so payment screenshot previews can render from object URLs.

### `admin.html`

Admin page with:

- Supabase Auth email/password login.
- Forgot password flow.
- Dashboard shell after login.
- Tabs: Registrations, Courses, Sessions, Fees, Gallery, Settings.
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
- Current Codex sessions may need restart/reload before the `supabase` MCP tools appear.

The Supabase anon key is also hardcoded in both files. Do not duplicate the key in docs unless necessary; rotate/update both JS files together if the anon key changes.

The public anon key can read at least these content tables, verified by read-only REST samples:

- `sessions`
- `courses`
- `fee_tiers`
- `site_config`
- `gallery_images`

The Supabase OpenAPI schema endpoint rejected the anon key and requires a service role key, so exact schema, RLS, policies, constraints, triggers, and Edge Function settings are not fully verified from this repo.

### Inferred Tables

#### `sessions`

Verified columns from REST sample:

- `id`
- `name`
- `time_slot`
- `sort_order`
- `is_active`
- `created_at`

Used by:

- Homepage session cards.
- Registration session labels/time slots.
- Admin Sessions tab.
- Admin Courses tab session relation/filter.

#### `courses`

Verified columns from REST sample:

- `id`
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

- Homepage track grid and mobile course bottom sheet.
- Registration course dropdowns.
- Admin Courses CRUD.

`session_id` is inferred to reference `sessions.id`.

#### `fee_tiers`

Verified columns from REST sample:

- `id`
- `session_count`
- `fee_amount`
- `label`

Used by:

- Homepage fee table.
- Registration fee calculation.
- Admin Fees CRUD.

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
- `hostel_food_fee`
- `hostel_only_fee`
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
- Hostel fee labels and calculations.
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

- Homepage hero gallery rotation.
- Admin Gallery CRUD.

#### `registrations`

Not directly sampled to avoid exposing registration data. Inferred from `script.js`, `admin.js`, and Edge Function responses.

Likely columns:

- Identity/timestamps: `id`, `created_at`
- Student: `student_name`, `class_level`, `school_name`, `city`
- Guardian/contact: `guardian_name`, `phone`, `email`, `emergency_phone`
- Course selections: `session1_course`, `session2_course`, `session3_course`
- Hostel: `hostel_option`, `hostel_amount`
- Payment/fees: `session_fee`, `gst_amount`, `total_fee`, `payment_reference`, `payment_status`
- Verification/admin: `status`, `screenshot_url`, `verified_by`, `verified_at`
- Notes: `medical_note`

Admin expects statuses including:

- Registration `status`: `pending`, `confirmed`, `cancelled`, `rejected`
- `payment_status`: `verification_pending`, `paid`, `unpaid`, `failed`

## Storage

Verified/inferred buckets:

- `images`: public bucket used for course and gallery images. Admin uploads via `POST /storage/v1/object/images/{fileName}` and constructs public URLs at `/storage/v1/object/public/images/{fileName}`.
- Payment screenshot bucket/path is not visible in this repo. `script.js` uploads screenshots to `functions/v1/upload-screenshot`, which likely stores proof images and updates `registrations.screenshot_url`.

Storage policy source is missing from repo. Because admin uploads directly from the browser using a Supabase user JWT, the `images` bucket policy must allow authenticated uploads. Public image display assumes public read access.

## Edge Functions

Function source is not present in the repo. Current client code depends on:

### `create-registration`

Called by `script.js` from `register.html`:

- URL: `/functions/v1/create-registration`
- Method: `POST`
- Headers: `Content-Type: application/json`
- No `apikey` or `Authorization` header is sent by the client.

Request body:

- `student_name`
- `class_level`
- `school_name`
- `city`
- `guardian_name`
- `phone`
- `email`
- `emergency_phone`
- `session1_course`
- `session2_course`
- `session3_course`
- `hostel_option`
- `medical_note`

Expected response fields used by UI:

- `registration_id`
- `payment_reference`
- `session_fee`
- `hostel_amount`
- `gst_amount`
- `total_amount`
- `courses`
- `upi_id`
- `upi_url`
- `qr_data_url`

Inferred responsibilities:

- Validate registration payload.
- Calculate fee/server truth.
- Read fee tiers, hostel fees, and UPI ID from Supabase.
- Create a pending registration with a unique payment reference.
- Return UPI payment data and QR data URL.

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

1. Defines default `sessionCourses` and `feeBySessionCount` fallbacks.
2. Fetches active sessions, active courses, fee tiers, and site config from Supabase REST.
3. Applies settings to contact/footer/deadline/date/hostel UI.
4. Builds `sessionCourses` by mapping sorted sessions to `session1`, `session2`, `session3` by array index.
5. Populates registration course dropdowns.
6. Populates homepage track cards, session cards, and fee table.
7. Loads active gallery images and rotates the hero gallery.
8. Runs countdown, seats-left urgency, nav, reveal, contact overlay, and social-proof UI.

Important: REST fetch failures are mostly silent and leave hardcoded HTML/JS fallback content in place.

## Registration Flow

1. User fills student, guardian, session/course, hostel, medical note, and consent fields.
2. Validation runs per field/block and controls the submit button.
3. Session fee is based on number of selected sessions and `feeBySessionCount`.
4. Hostel fee is added from `HOSTEL_FEES`, which can be overridden by `site_config`.
5. GST is calculated client-side as 18% of session fee plus hostel fee.
6. On submit, the browser calls `create-registration`.
7. The returned payment data opens the UPI payment modal.
8. Pending registration state is stored in `sessionStorage` as `lpu_pending_reg` for up to two hours.
9. User pays externally in a UPI app or manually by UPI ID/QR.
10. User selects a screenshot.
11. Browser validates `file`, `file.size`, and image MIME/extension before processing.
12. Browser creates a preview with `URL.createObjectURL()` and waits for `img.onload` before enabling submit.
13. Browser attempts compression only after preview/decode succeeds; large images and HEIC/HEIF are converted to JPEG when possible.
14. If compression/blob creation fails after a valid preview, the browser falls back to the original validated image instead of blocking submission.
15. Browser posts the screenshot to `upload-screenshot`.
16. UI shows a pending-verification receipt and clears/revokes upload preview state.

## Payment Verification Flow

Payment is not gateway-verified. It is a manual UPI flow:

1. Edge Function creates a pending registration and payment reference.
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
- Filters by registration status, payment status, and search text.
- Exports all registration fields to CSV.
- Shows screenshot thumbnail and registration detail modal.
- Approves/rejects payment verification.
- Sends confirmation email on approval or direct confirm status.

### Sessions

- CRUD over `sessions`.
- `time_slot` is edited as start/end native time inputs and saved as `"HH:MM - HH:MM"`.
- Delete calls only `DELETE sessions?id=eq.{id}`; cascade behavior is database-defined and not visible in repo.

### Courses

- CRUD over `courses`.
- Relation display uses `select=*,sessions(name)`.
- Can upload image to `images` bucket or enter an image URL.
- Categories supported in UI: `tech`, `creative`, `career`, `sports`, `general`.

### Fees

- CRUD over `fee_tiers`.
- Fee calculation assumes a tier exists for the selected session count.

### Gallery

- CRUD over `gallery_images`.
- Can upload to `images` bucket or enter an image URL.
- Active gallery images feed homepage hero rotation.

### Settings

- Loads and edits all rows from `site_config`.
- Special input handling for dates, datetime, numeric fields, and text.
- `registration_deadline` is edited as date/time and saved as IST ISO string with `+05:30`.

## Reusable UI/Code Patterns

Public site:

- Data attributes drive behavior: `data-cfg`, `data-session-toggle`, `data-session-course`, `data-payment-section`, `data-upload-state`, etc.
- Shared `esc()` function for HTML escaping.
- Shared `formatFee()`, `selectedSessions()`, and registration validation helpers.
- Contact overlay shared by homepage and registration page.
- Course bottom sheet exists only on mobile track cards.
- Payment modal uses a state attribute: `pick`, `processing`, `ready`.

Admin:

- `$()` and `$$()` query helpers.
- `apiGet`, `apiInsert`, `apiUpdate`, `apiDelete` wrappers.
- Shared modal with dirty-state detection.
- Table rows use rendered inline handlers such as `onclick="editCourse(...)"`.
- Admin image upload helper writes directly to Supabase Storage.

## Deployment Flow

Deployment is static and linked to Vercel:

- Main production URL: `https://summerschool.unisportscouncil.co.in/`
- Vercel project name: `lpu-summer-school`
- Local Vercel metadata exists in `.vercel/project.json`, but `.vercel/` is ignored and should not be committed.
- There is no `vercel.json`, package script, build output, or framework config.
- Expected deployment artifact is the repo root static files.

Missing deployment details:

- Production domain and DNS ownership.
- Vercel team/member access.
- Vercel environment variables, if any.
- Supabase Auth redirect URLs for password recovery.
- Edge Function deployment/configuration process.

## Known Issues / TODO / Risks

- Missing source of truth for backend: no Supabase migrations, RLS policies, storage policies, seed data, Edge Function source, or environment docs are in the repo.
- Need Supabase service role/dashboard access to verify exact schema, policies, triggers, buckets, and function settings.
- Supabase URL and anon key are duplicated in `script.js` and `admin.js`; future key/project changes can drift.
- Admin performs direct browser CRUD against Supabase REST; security depends entirely on RLS/admin policies that are not visible here.
- Public Edge Functions appear unauthenticated from the browser because `create-registration` and `upload-screenshot` send no auth or apikey headers. Verify CORS, JWT verification, rate limits, spam protection, server-side validation, and file validation.
- Manual UPI screenshot verification is fragile and not payment-gateway verified.
- `verified_by` is hardcoded as `"admin"` rather than the authenticated user's email/id.
- Confirmation email failure is non-blocking and only logged to console, so admins may think email was sent when it failed.
- Registration supports exactly three static session selectors and stores `session1_course`, `session2_course`, `session3_course`; admin can create more sessions, but registration will not adapt beyond three without schema/UI changes.
- Registration course choices are stored as course names, not course IDs. Renames can make old registrations ambiguous.
- Dynamic sessions are mapped by sorted array position to `session1`, `session2`, `session3`; reordering sessions changes registration meaning unless controlled carefully.
- Fee/hostel/GST calculation happens in the client for display and should be treated as advisory. `create-registration` must recalculate server-side.
- Public content fetch failures are mostly silent, leaving stale hardcoded fallback content.
- Deadline enforcement depends on `registrationDeadline` being loaded from Supabase; if config fetch fails, registration may remain submittable.
- The displayed seats-left number is simulated from time and does not use `site_config.max_seats` or actual registrations.
- Social proof popups are generated fake registration notifications. This is a trust/ethics and UX risk.
- Screenshot upload currently includes detailed temporary console logging for file metadata, preview/decode/compression/upload states. Remove or gate these logs after the mobile upload issue is confirmed fixed in production.
- `register.html` print receipt button uses inline `onclick` that may be blocked by CSP.
- `admin.html` allows `script-src 'unsafe-inline'` to support inline handlers, which increases XSS impact if any escaping is missed.
- Admin auth token is stored in `localStorage`; XSS would expose it.
- Admin image uploads have no visible client-side size/compression limits.
- `deleteSession` assumes deleting a session deletes or handles courses, but cascade behavior is unknown.
- Site uses a mix of hardcoded static values and dynamic `site_config`; future edits should avoid updating only one source.
- There are no automated tests, lint checks, schema checks, or deployment smoke tests.
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
