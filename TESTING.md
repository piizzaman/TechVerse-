# Verification checklist

## Verified in the supplied source snapshot

- All JavaScript and JSX source files parse successfully with the Babel parser.
- All relative imports from the frontend source resolve to files in the project.
- The frontend has a local sample-product fallback when the API is unavailable.
- The cart persists in browser local storage and supports quantity changes/removal.
- The checkout is explicitly a local simulation and does not collect payment details.

## Still requires a local run

The uploaded `node_modules` folder was created for macOS and does not contain the Linux native Rolldown binding needed by this environment, so a production Vite build could not be executed here. On the development Mac, install dependencies from the lockfile (`npm ci`) and run:

```bash
npm run build
npm run lint
npm run dev
```

If the lockfile install reports an optional native dependency issue, remove `node_modules` and run `npm install` again on the target Mac. Test the storefront at desktop and mobile widths, then exercise search, category filtering, sorting, product details, cart updates, and the demo checkout. Backend account/admin flows additionally require the PostgreSQL setup described in `README.md`.
