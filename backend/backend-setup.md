1. mkdir backend
2. pnpm init
3. **Packages:** pnpm add express@4 mongoose dotenv cors bcryptjs jsonwebtoken cookie-parser zod express-rate-limit
4. **Dev deps (TypeScript setup):** pnpm add -D typescript ts-node-dev @types/express @types/node @types/cors @types/bcryptjs @types/jsonwebtoken @types/cookie-parser tsx
5. Initialize TypeScript: npx tsc --init
6. Update the `tsconfig.json`:

```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",

    "rootDir": "./src",
    "outDir": "./dist",

    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    "skipLibCheck": true,
    "types": ["node"],
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

```

7.  `package.json` scripts:

```
"scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }

```

8. **_app.ts_**(Express core setup) & **_server.ts_** (entry point)
9.
