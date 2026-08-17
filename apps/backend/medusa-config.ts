import { loadEnv, defineConfig, Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
      authMethodsPerActor: {
        user: ["emailpass"],
        customer: ["emailpass", "phone-auth"],
      },
    }
  },
  modules: [
    {
      resolve: "./src/modules/cms",
    },
    {
      resolve: "./src/modules/analytics",
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              backend_url: `${(process.env.MEDUSA_BACKEND_URL || "http://localhost:9000").replace(/\/$/, "")}/static`,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [
        Modules.CACHE,
        ContainerRegistrationKeys.LOGGER,
        Modules.EVENT_BUS,
      ],
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "./src/modules/phone-auth",
            id: "phone-auth",
            options: {
              jwtSecret: process.env.PHONE_AUTH_JWT_SECRET || process.env.JWT_SECRET,
            },
          },
        ],
      },
    },
  ],
})
