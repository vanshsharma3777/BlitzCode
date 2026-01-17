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
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccount } from "next-auth/adapters";
const connectionString = process.env.DATABASE_URL!
const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool)

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const questionTypeEnum = pgEnum("question_type", ["single", "multiple", "bugfix"]);
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
  id: uuid("id").defaultRandom().primaryKey(), 
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  explanation: text("explanation").notNull(),
  correctOptions: text("correct_options").array().notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  language: text("language").notNull(),
  code: text("code").notNull(),
  questionType: questionTypeEnum("question_type").notNull(),
  options: jsonb("options").notNull(),
  timeLimit: integer("time_limit").default(30).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }), 
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const attempts = pgTable("attempt" , {
  id:uuid('id').defaultRandom().primaryKey(),
  status:questionStatus("question_status").notNull(),
  userId: uuid('userId').notNull().references(()=> users.id , { onDelete:"cascade"}), 
  score : integer("score").notNull(),
  totalTime : integer("total_time").notNull(),
  gameType: gameTypeEnum("game_type").notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }).defaultNow().notNull(),

})

export const multiplayerGame = pgTable("multiplayer_game", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  timeTaken: integer("time_taken").notNull(),
  score: integer("score").notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }).defaultNow().notNull(),
});

export const multiplayerAttempts = pgTable("multiplayer_attempts", {
  multiplayerId: uuid("multiplayer_id").notNull().references(() => multiplayerGame.id, { onDelete: "cascade" }),
  attemptId: uuid("attempt_id").notNull().references(() => attempts.id, { onDelete: "cascade" }), 
});

export const questionsAttempted = pgTable("question_attempted", {
  id: uuid("id").defaultRandom().primaryKey(), 
  userId: uuid("user_id") 
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: uuid("question_id") 
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  isCorrect: integer("is_correct").notNull(),
  timeTaken: real("time_taken").notNull(),
  attemptedAt: timestamp("attempted_at", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type QuestionAttempted = typeof questionsAttempted.$inferSelect;
export type NewQuestionAttempted = typeof questionsAttempted.$inferInsert;
export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;
export type MultiplayerGame = typeof multiplayerGame.$inferSelect;
export type NewMultiplayerGame = typeof multiplayerGame.$inferInsert;