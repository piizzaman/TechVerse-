# Security notes

TechVerse is a learning and portfolio application. Keep security testing confined to a local instance or an environment for which you have explicit authorization.

## Existing controls

- Customer passwords are hashed with bcrypt before storage.
- Customer and administrator API routes use role checks on signed JWTs.
- Customer address and order queries are scoped to the authenticated customer.
- Product create/update/delete and order administration routes require an administrator token.
- The frontend demo checkout does not request or store payment-card data.
- Environment files and generated dependency/build directories are excluded from version control.

## Important limitations

- The local demo checkout is not an actual payment or order fulfillment system.
- The optional Stripe route requires a configured secret key and still needs production success/cancel URLs, verified webhooks, idempotency, and a persistent order lifecycle before real use.
- Add rate limiting, strict CORS allowlists, schema validation, security headers, CSRF strategy where applicable, logging/monitoring, and automated authorization tests before deployment.
- Never use real customer data in a security-testing environment.
