
## Recommended account + dashboard flow

### Current behavior
- A user fills out an enrollment page, such as `/enroll/sexual-health/better`.
- Their welcome email is triggered when they press **Continue** on the first step.
- They complete medical/shipping details, then go to Stripe checkout.
- After payment, they land on `/checkout/return`.
- The return page already sends them to signup with their email prefilled.
- The dashboard currently finds plans mainly by matching the signed-in user’s email to enrollment records, so if they create an account with the same email, their plan can appear in the dashboard.

### Best flow to build
We should support both scenarios:

```text
A) User creates account before Stripe
Enrollment -> logged-in user -> Stripe -> return to dashboard
Dashboard shows plan immediately because the account is already connected.

B) User pays before creating account
Enrollment -> Stripe -> payment success -> signup page with email prefilled
User creates/verifies account -> dashboard
Dashboard shows plan by matching the paid enrollment email, then links it to their account.
```

## Security recommendation

I would not automatically create a full account or password for the user after Stripe. That is risky and can create account-access issues.

Instead:
- After successful Stripe payment, automatically route them to **Create Account & View Dashboard**.
- Prefill the same email they used during enrollment.
- Once they sign up and verify/login, send them to `/dashboard`.
- Add a proper **Forgot password?** flow on the auth page.
- In welcome emails, include a safe dashboard CTA and a small sign-in help line:
  - “View your health plan, delivery updates, care details, and prescriptions in your dashboard.”
  - “If you already have an account, sign in. If you forgot your password, you can reset it securely from the sign-in page.”

I would not put a direct password-reset token/link inside every welcome email. Better security is to link to sign-in and let the user request a reset themselves.

## Implementation plan

### 1. Make dashboard plan linking more reliable
- Add a `user_id` column to enrollments, without exposing private data publicly.
- When a logged-in user enrolls, save their account ID on the enrollment.
- When an anonymous paid user signs up later with the same email, connect their paid enrollment to their new account.
- Keep email matching as a fallback so existing paid enrollments still show.

### 2. Improve Stripe-to-dashboard flow
- If the user is already signed in before checkout:
  - Pass their account ID into checkout.
  - After payment, send them straight to `/dashboard?checkout=success`.
- If the user is not signed in:
  - Keep sending them to `/auth?mode=signup&email=...`.
  - Update the page copy to clearly say: “Create your account to view your health plan, delivery updates, and care information.”

### 3. Update dashboard display
- Show active/paid health plans more clearly.
- Include helpful status text such as:
  - “Doctor review in progress”
  - “Prescription pending approval”
  - “Delivery updates will appear here”
- Add a dashboard section explaining that users can check:
  - Health plan status
  - Doctor review updates
  - Delivery/shipping updates
  - Prescription and care information

### 4. Update all welcome emails
For every plan welcome email:
- Add a stronger dashboard section near the bottom:
  - “Your Youth & Soul dashboard”
  - Link: `https://youthandsoul.com/dashboard`
  - Explain that after payment and signup, their dashboard will show health plan details, delivery dates, prescription/care updates, and account information.
- If they already have an account, tell them to sign in.
- If they do not have an account yet, tell them their account access is created after payment when they sign up with the same email.
- Add a small security/help line:
  - “Forgot your password? Use the secure reset option on the sign-in page.”

### 5. Add forgot password + reset password flow
- Add a **Forgot password?** link to the sign-in form.
- Add a password reset request form where the user enters their email.
- Add a `/reset-password` page where users can securely set a new password from the reset email.
- After reset, send them back to sign in or dashboard.

### 6. Test the full flows
- Test an anonymous enrollment through checkout:
  - Welcome email sends.
  - Payment success routes to signup.
  - Signup with the same email.
  - Dashboard shows the paid plan.
- Test a logged-in enrollment:
  - Checkout receives the account ID.
  - Payment success routes to dashboard.
  - Dashboard shows the plan.
- Test forgot password:
  - Reset email sends.
  - `/reset-password` allows setting a new password.
  - User can sign in and see dashboard.
