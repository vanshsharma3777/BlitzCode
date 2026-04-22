import {
  boolean,
  timestamp,
  pgTable,
  pgEnum,
  real,
  text,
  primaryKey,
  uuid,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccount } from "next-auth/adapters";

const connectionString = process.env.DATABASE_URL!
const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool)

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]); 
export const statusEnum = pgEnum("status", ["used", "unused"]); 
export const questionTypeEnum = pgEnum("question_type", ["single correct", "multiple correct", "bugfixer"]);
export const gameTypeEnum = pgEnum("game_type", ["quiz", "bugfixer", "multiplayer"]);
export const questionStatus = pgEnum("question_status", ["correct", "incorrect", "notAttempted"]);

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  username: text("username").unique(),
  points: integer("points").default(0).notNull(),
  pointsUpdated: boolean("points_updated").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull().$onUpdate(() => new Date()),
})



export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

export const questions = pgTable("question", {
  questionId: uuid("questionId").defaultRandom().primaryKey(),
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  explanation: text("explanation").notNull(),
  correctOptions: text("correctOptions").array().notNull(),
  difficulty: text("difficulty").notNull(),
  language: text("language").notNull(),
  code: text("code"),
  status: statusEnum("status").default("unused").notNull(),
  questionType: text("questionType").notNull(),
  options: jsonb("options").notNull(),
  timeLimit: integer("timeLimit").default(30).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
},
  (table) => ({
    fetchQuestionIdx : index("questions_fetch_idx").on(
      table.topic,
      table.difficulty,
      table.language,
      table.questionType,
    ),
  }));


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;