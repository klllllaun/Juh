import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, missions, dailyProgress, guides, aiInteractions, autonomyTracking, sessions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * AUTHENTICATION
 */
export async function createUser(email: string, passwordHash: string, name?: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(users).values({
      email,
      passwordHash,
      name: name || null,
      role: "user",
    });

    return result;
  } catch (error) {
    console.error("[Database] Failed to create user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSession(userId: number, token: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });
}

export async function getSessionByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteSession(token: string) {
  const db = await getDb();
  if (!db) return;

  await db.delete(sessions).where(eq(sessions.token, token));
}

/**
 * MISSIONS
 */
export async function getMissionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(missions).where(eq(missions.userId, userId));
}

export async function getMissionById(missionId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(missions).where(eq(missions.id, missionId)).limit(1);
  return result[0];
}

export async function createMissionsForUser(userId: number) {
  const db = await getDb();
  if (!db) return;

  const missionsData = [
    {
      userId,
      missionNumber: 1,
      title: "Corte de Ruído",
      objective: "Criar um vácuo operacional de 7 dias",
      minimalAction: "Identificar e cortar 3 fontes de ruído por 24h",
      repetitionRule: "Manter o corte por 7 dias seguidos",
      completionCriteria: "Registro binário FEITO por 7 dias consecutivos",
      silentPenalty: "Não avança para a Missão 2",
      status: "active" as const,
    },
    {
      userId,
      missionNumber: 2,
      title: "Visão Macro",
      objective: "Desmontar para entender",
      minimalAction: "Mapear 1 área de vida em 3 dimensões",
      repetitionRule: "Repetir por 7 dias",
      completionCriteria: "Visão clara de 1 área",
      silentPenalty: "Não destrava próxima",
      status: "locked" as const,
    },
    {
      userId,
      missionNumber: 3,
      title: "Operação Diária",
      objective: "Repetição sem recompensa imediata",
      minimalAction: "Executar a Ação Mínima de 15 minutos",
      repetitionRule: "Todos os dias por 7 dias",
      completionCriteria: "7 dias consecutivos FEITO",
      silentPenalty: "Sem mensagem motivacional",
      status: "locked" as const,
    },
    {
      userId,
      missionNumber: 4,
      title: "Autonomia e Saída",
      objective: "Operar sozinho",
      minimalAction: "Revisar padrão estabelecido",
      repetitionRule: "Revisão semanal",
      completionCriteria: "Autonomia detectada",
      silentPenalty: "Sem suporte",
      status: "locked" as const,
    },
  ];

  for (const mission of missionsData) {
    await db.insert(missions).values(mission);
  }
}

export async function updateMissionStatus(missionId: number, status: "locked" | "active" | "completed") {
  const db = await getDb();
  if (!db) return;
  await db.update(missions).set({ status }).where(eq(missions.id, missionId));
}

/**
 * DAILY PROGRESS
 */
export async function getTodayProgress(userId: number, missionId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const today = new Date().toISOString().split('T')[0];
  const result = await db
    .select()
    .from(dailyProgress)
    .where(and(eq(dailyProgress.userId, userId), eq(dailyProgress.missionId, missionId), eq(dailyProgress.date, today)))
    .limit(1);
  return result[0];
}

export async function recordDailyProgress(userId: number, missionId: number, completed: boolean) {
  const db = await getDb();
  if (!db) return;
  const today = new Date().toISOString().split('T')[0];

  const existing = await getTodayProgress(userId, missionId);
  if (existing) {
    await db.update(dailyProgress).set({ completed: completed ? 1 : 0 }).where(eq(dailyProgress.id, existing.id));
  } else {
    await db.insert(dailyProgress).values({
      userId,
      missionId,
      date: today,
      completed: completed ? 1 : 0,
      consecutiveDays: 1,
    });
  }
}

export async function getConsecutiveDays(userId: number, missionId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select()
    .from(dailyProgress)
    .where(and(eq(dailyProgress.userId, userId), eq(dailyProgress.missionId, missionId)))
    .orderBy(desc(dailyProgress.date))
    .limit(1);
  return result[0]?.consecutiveDays || 0;
}

/**
 * GUIDES
 */
export async function getGuidesByLayer(layer: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(guides).where(eq(guides.layer, layer as any));
}

export async function getAllGuides() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(guides).orderBy(guides.layer, guides.order);
}

/**
 * AI INTERACTIONS
 */
export async function recordAIInteraction(userId: number, agentType: string, userMessage: string, aiResponse: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(aiInteractions).values({
    userId,
    agentType: agentType as any,
    userMessage,
    aiResponse,
  });
}

export async function getAIInteractionHistory(userId: number, agentType?: string) {
  const db = await getDb();
  if (!db) return [];
  if (agentType) {
    return db.select().from(aiInteractions).where(and(eq(aiInteractions.userId, userId), eq(aiInteractions.agentType, agentType as any)));
  }
  return db.select().from(aiInteractions).where(eq(aiInteractions.userId, userId));
}

/**
 * AUTONOMY TRACKING
 */
export async function getAutonomyScore(userId: number, weekNumber: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(autonomyTracking)
    .where(and(eq(autonomyTracking.userId, userId), eq(autonomyTracking.weekNumber, weekNumber)))
    .limit(1);
  return result[0];
}

export async function updateAutonomyScore(userId: number, weekNumber: number, score: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await getAutonomyScore(userId, weekNumber);
  if (existing) {
    await db.update(autonomyTracking).set({ autonomyScore: score }).where(eq(autonomyTracking.id, existing.id));
  } else {
    await db.insert(autonomyTracking).values({
      userId,
      weekNumber,
      autonomyScore: score,
      isReadyToExit: 0,
    });
  }
}
