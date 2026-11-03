# AmisA Hub Android release candidate

This isolated Android WebView wrapper loads https://amisa-dental-connect.base44.app/ and uses applicationId `com.amisabc.amisahub`. It does not contain the Base44 application source.

## Status
- Prototype only: **not tested on a physical Android device**, and not approved for Google Play submission.
- GitHub Actions builds an **unsigned** release AAB unless signing environment variables are configured. An unsigned AAB **cannot** be uploaded to Google Play.
- Do not upload clinical data or real patient records during testing.
- The Base44 app must be **published** before this wrapper can display its latest changes.
- Test authentication (especially Google OAuth redirects), office roles, file uploads, navigation, links, notifications, and offline/error behavior. Some external login redirects may not return to the WebView; if so, a different integration is required.
- WebView-only apps may be rejected by store reviewers for insufficient functionality. No approval is guaranteed.

## Signing
Create an Android upload key securely. Store its base64-encoded keystore and passwords in GitHub Actions **encrypted secrets**. Never commit keys or credentials. The workflow must be extended to decode the secret into a temporary keystore, set `AMISA_KEYSTORE_PATH`, `AMISA_KEYSTORE_PASSWORD`, `AMISA_KEY_ALIAS`, and `AMISA_KEY_PASSWORD`, and remove the temporary key after building. Until that setup is complete, the workflow artifact is not release-ready.

## Package identity
Google Play app package ID must be `com.amisabc.amisahub` and the first upload must use a previously unused versionCode. The current value is 1. Google Play App Signing enrollment is also required.

## Workflow
See `.github/workflows/amisa-hub-android.yml`. Build uses GitHub-hosted Linux and does not require a local computer. The workflow and its output must be verified before relying on them.
