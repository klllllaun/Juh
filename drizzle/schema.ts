import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Email único para autenticação */
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** Senha hasheada com bcrypt */
  passwordHash: text("passwordHash").notNull(),
  name: text("name"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UserPublic = Omit<User, 'passwordHash'>;

/**
 * Sessions table - Store JWT tokens for authentication
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 500 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Missions table - Stores the 4 operational missions
 */
export const missions = mysqlTable("missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  missionNumber: int("missionNumber").notNull(), // 1-4
  title: varchar("title", { length: 255 }).notNull(),
  objective: text("objective").notNull(),
  minimalAction: text("minimalAction").notNull(),
  repetitionRule: text("repetitionRule").notNull(),
  completionCriteria: text("completionCriteria").notNull(),
  silentPenalty: text("silentPenalty").notNull(),
  status: mysqlEnum("status", ["locked", "active", "completed"]).default("locked").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Mission = typeof missions.$inferSelect;
export type InsertMission = typeof missions.$inferInsert;

/**
 * Daily progress table - Binary tracking (DONE/NOT DONE)
 */
export const dailyProgress = mysqlTable("daily_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  missionId: int("missionId").notNull().references(() => missions.id),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  completed: int("completed").default(0).notNull(), // 0 = NOT DONE, 1 = DONE
  consecutiveDays: int("consecutiveDays").default(0).notNull(),
  rdsCompleted: int("rdsCompleted").default(0).notNull(), // Ritual Diário Simples
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyProgress = typeof dailyProgress.$inferSelect;
export type InsertDailyProgress = typeof dailyProgress.$inferInsert;

/**
 * Weekly review table - Automatic reset every Monday
 */
export const weeklyReview = mysqlTable("weekly_review", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  weekStartDate: varchar("weekStartDate", { length: 10 }).notNull(), // YYYY-MM-DD (Monday)
  totalDaysCompleted: int("totalDaysCompleted").default(0).notNull(),
  missionsFailed: int("missionsFailed").default(0).notNull(),
  insights: text("insights"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WeeklyReview = typeof weeklyReview.$inferSelect;
export type InsertWeeklyReview = typeof weeklyReview.$inferInsert;

/**
 * Guides table - Mini-ebooks organized by layers
 */
export const guides = mysqlTable("guides", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  layer: mysqlEnum("layer", ["illusion", "clarity", "pattern", "escape", "autonomy"]).notNull(),
  content: text("content").notNull(), // Markdown content
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  readingTime: int("readingTime"), // in minutes
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Guide = typeof guides.$inferSelect;
export type InsertGuide = typeof guides.$inferInsert;

/**
 * AI interactions table - Track conversations with AI agents
 */
export const aiInteractions = mysqlTable("ai_interactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  agentType: mysqlEnum("agentType", ["clarity", "decision", "execution", "cut"]).notNull(),
  userMessage: text("userMessage").notNull(),
  aiResponse: text("aiResponse").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIInteraction = typeof aiInteractions.$inferSelect;
export type InsertAIInteraction = typeof aiInteractions.$inferInsert;

/**
 * User autonomy tracking - Detect when user is ready to operate alone
 */
export const autonomyTracking = mysqlTable("autonomy_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  weekNumber: int("weekNumber").notNull(),
  autonomyScore: int("autonomyScore").default(0).notNull(), // 0-100
  isReadyToExit: int("isReadyToExit").default(0).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AutonomyTracking = typeof autonomyTracking.$inferSelect;
export type InsertAutonomyTracking = typeof autonomyTracking.$inferInsert;