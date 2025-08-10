# Node TypeScript Client (Axios)

Scaffold for WorqHat API examples.

Setup:
- Copy `.env.example` to `.env` and set values.
- Install deps: `npm install`

Dev:
- `npm run dev` (runs `src/index.ts`)
- Add endpoint scripts under `src/endpoints/` or `src/routes/` and import them from `src/index.ts`.

Provided utilities:
- `src/client.ts` exports pre-configured Axios client reading `API_URL` and `API_KEY`.
