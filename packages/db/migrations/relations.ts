import { relations } from "drizzle-orm/relations";
import { user, account, authenticator, session, questionAttempted, attempt, multiplayerGame, multiplayerAttempts } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	authenticators: many(authenticator),
	sessions: many(session),
	questionAttempteds: many(questionAttempted),
	attempts: many(attempt),
	multiplayerGames: many(multiplayerGame),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(user, {
		fields: [authenticator.userId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const questionAttemptedRelations = relations(questionAttempted, ({one}) => ({
	user: one(user, {
		fields: [questionAttempted.userId],
		references: [user.id]
	}),
}));

export const attemptRelations = relations(attempt, ({one, many}) => ({
	user: one(user, {
		fields: [attempt.userId],
		references: [user.id]
	}),
	multiplayerAttempts: many(multiplayerAttempts),
}));

export const multiplayerGameRelations = relations(multiplayerGame, ({one, many}) => ({
	user: one(user, {
		fields: [multiplayerGame.userId],
		references: [user.id]
	}),
	multiplayerAttempts: many(multiplayerAttempts),
}));

export const multiplayerAttemptsRelations = relations(multiplayerAttempts, ({one}) => ({
	multiplayerGame: one(multiplayerGame, {
		fields: [multiplayerAttempts.multiplayerId],
		references: [multiplayerGame.id]
	}),
	attempt: one(attempt, {
		fields: [multiplayerAttempts.attemptId],
		references: [attempt.id]
	}),
}));