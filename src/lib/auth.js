import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },

  database: mongodbAdapter(db, {client}),

  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
        required: false,
        input: true,
      },

      isPremium: {
        type: "boolean",
        default: false,
        required: false,
        input: false,
      },

      premiumActivatedAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: user.role || "user",
            },
          };
        },
      },
    },
  },
  /* plugins: [
    admin(),
  ] */

  trustedOrigins: [
    "http://localhost:3000", // Local frontend development port
    "https://learnora-client-main.vercel.app", // Production frontend subdomain
  ],
});

