# Setting Up Google OAuth for UReport

This guide explains how to enable "Sign in with Google" for your UReport instance.

## Overview

UReport supports Google OAuth as an optional authentication method. Users can sign in with their Google account (personal or Google Workspace) in addition to traditional username/password login.

Since UReport is self-hosted, each deployment requires its own Google OAuth credentials.

## Prerequisites

- A Google account (personal Gmail or Google Workspace)
- Your UReport instance deployed with a public URL (not localhost for production)
- Admin access to your UReport configuration

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top and select **New Project**
3. Enter a project name (e.g., "UReport Auth")
4. Click **Create**

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (allows any Google account) or **Internal** (Google Workspace only)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: Your UReport instance name (e.g., "MyCompany UReport")
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **Save and Continue**
6. On the **Scopes** page, click **Add or Remove Scopes**
7. Select these scopes:
   - `email` - See your primary Google Account email address
   - `profile` - See your personal info, including any personal info you've made publicly available
8. Click **Update**, then **Save and Continue**
9. On **Test users** page (if External):
   - Add email addresses of users who can test before verification
   - You can add up to 100 test users
10. Click **Save and Continue**, then **Back to Dashboard**

## Step 3: Create OAuth Credentials

1. In the left sidebar, go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application** as the application type
4. Enter a name (e.g., "UReport Web Client")
5. Under **Authorized redirect URIs**, add:
   ```
   https://your-ureport-domain.com/api/auth/google/callback
   ```
   For local development, also add:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
6. Click **Create**
7. A dialog will show your **Client ID** and **Client Secret** - save these securely!

## Step 4: Configure UReport

Add the following environment variables to your UReport deployment:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-ureport-domain.com/api/auth/google/callback
```

### Docker Deployment

Add to your `docker-compose.yml`:

```yaml
environment:
  - GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
  - GOOGLE_CLIENT_SECRET=your-client-secret
  - GOOGLE_CALLBACK_URL=https://your-ureport-domain.com/api/auth/google/callback
```

### Manual Deployment

Add to your environment or `.env` file:

```bash
export GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
export GOOGLE_CLIENT_SECRET=your-client-secret
export GOOGLE_CALLBACK_URL=https://your-ureport-domain.com/api/auth/google/callback
```

## Step 5: Restart UReport

Restart your UReport server to apply the changes. The "Sign in with Google" button will appear on the login page when OAuth is configured.

## User Account Behavior

When a user signs in with Google:

1. **Existing user with matching email**: The Google account is linked to the existing UReport account
2. **New email**: A new UReport account is created automatically
3. **Subsequent logins**: User can use either Google or password (if set)

## Restricting to Specific Domains

To allow only users from your organization's domain:

1. In Google Cloud Console, set the OAuth consent screen to **Internal** (requires Google Workspace)

Or configure UReport to restrict domains by setting:

```bash
GOOGLE_ALLOWED_DOMAINS=yourcompany.com,partner.com
```

## Troubleshooting

### "Access blocked: This app's request is invalid"

- Verify the redirect URI in Google Console matches exactly (including http/https)
- Check for trailing slashes

### "Error 403: access_denied"

- If using External type, ensure the user is added as a test user
- Or submit your app for Google verification

### Google button doesn't appear

- Verify environment variables are set correctly
- Check server logs for OAuth configuration errors
- Ensure `GOOGLE_CLIENT_ID` is not empty

## Going to Production

For production use with External users:

1. In OAuth consent screen, click **Publish App**
2. For basic scopes (email, profile), Google may approve automatically
3. If additional verification is needed, Google will guide you through the process

## Security Notes

- Never commit `GOOGLE_CLIENT_SECRET` to version control
- Use environment variables or secrets management
- Regularly rotate credentials if compromised
- The Client ID can be public; the Client Secret must stay private

## Disabling Google OAuth

To disable Google OAuth, simply remove or unset the environment variables:

```bash
unset GOOGLE_CLIENT_ID
unset GOOGLE_CLIENT_SECRET
```

Restart UReport - the Google sign-in option will no longer appear.
