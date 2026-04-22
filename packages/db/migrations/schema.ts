import { pgTable, text, timestamp, foreignKey, uuid, integer, unique, boolean, real, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const difficulty = pgEnum("difficulty", ['easy', 'medium', 'hard'])
export const gameType = pgEnum("game_type", ['quiz', 'bugfixer', 'multiplayer'])
export const questionStatus = pgEnum("question_status", ['correct', 'incorrect', 'notAttempted'])
export const questionType = pgEnum("question_type", ['single correct', 'multiple correct', 'bugfixer'])
export const status = pgEnum("status", ['used', 'unused'])


export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
});

export const account = pgTable("account", {
	userId: uuid().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const authenticator = pgTable("authenticator", {
	credentialId: text().notNull(),
	userId: uuid().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: boolean().notNull(),
	transports: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "authenticator_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("authenticator_credentialID_unique").on(table.credentialId),
]);

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: uuid().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const questionAttempted = pgTable("question_attempted", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	questionId: uuid("question_id").notNull(),
	isCorrect: integer("is_correct").notNull(),
	timeTaken: real("time_taken").notNull(),
	attemptedAt: timestamp("attempted_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "question_attempted_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	username: text(),
	points: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	pointsUpdated: boolean("points_updated").default(false).notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
	unique("user_username_unique").on(table.username),
]);

export const attempt = pgTable("attempt", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	questionStatus: questionStatus("question_status").notNull(),
	userId: uuid().notNull(),
	score: integer().notNull(),
	totalTime: integer("total_time").notNull(),
	gameType: gameType("game_type").notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "attempt_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const multiplayerGame = pgTable("multiplayer_game", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	timeTaken: integer("time_taken").notNull(),
	score: integer().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "multiplayer_game_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const multiplayerAttempts = pgTable("multiplayer_attempts", {
	multiplayerId: uuid("multiplayer_id").notNull(),
	attemptId: uuid("attempt_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.multiplayerId],
			foreignColumns: [multiplayerGame.id],
			name: "multiplayer_attempts_multiplayer_id_multiplayer_game_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.attemptId],
			foreignColumns: [attempt.id],
			name: "multiplayer_attempts_attempt_id_attempt_id_fk"
		}).onDelete("cascade"),
]);
