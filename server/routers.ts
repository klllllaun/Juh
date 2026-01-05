import { z } from "zod";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// Default user ID for public access
const DEFAULT_USER_ID = 1;

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(() => null), // No user auth needed
  }),

  missions: router({
    list: publicProcedure.query(async () => {
      const { getMissionsByUserId } = await import("./db");
      return getMissionsByUserId(DEFAULT_USER_ID);
    }),
    recordProgress: publicProcedure
      .input(z.object({ missionId: z.number(), completed: z.boolean() }))
      .mutation(async ({ input }) => {
        const { recordDailyProgress } = await import("./db");
        await recordDailyProgress(DEFAULT_USER_ID, input.missionId, input.completed);
        return { success: true };
      }),
    getTodayProgress: publicProcedure
      .input(z.object({ missionId: z.number() }))
      .query(async ({ input }) => {
        const { getTodayProgress } = await import("./db");
        return getTodayProgress(DEFAULT_USER_ID, input.missionId);
      }),
  }),

  guides: router({
    getAll: publicProcedure.query(async () => {
      const { getAllGuides } = await import("./db");
      return getAllGuides();
    }),
    getByLayer: publicProcedure
      .input(z.object({ layer: z.string() }))
      .query(async ({ input }) => {
        const { getGuidesByLayer } = await import("./db");
        return getGuidesByLayer(input.layer);
      }),
  }),

  ai: router({
    chat: publicProcedure
      .input(z.object({ agentType: z.string(), message: z.string() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const { recordAIInteraction } = await import("./db");

        const agentPrompts: Record<string, string> = {
          clarity: "Voce eh um agente confrontador de clareza. Pergunte: Qual eh a unica decisao objetiva agora? Nao valide, confronte.",
          decision: "Voce eh um agente de decisao. Force uma escolha binaria. Sem meio-termo.",
          execution: "Voce eh um agente de execucao. Defina a Acao Minima de 15 minutos. Sem estruturas complexas.",
          cut: "Voce eh um agente de corte. Identifique o que deve ser eliminado. Seja frio e direto.",
        };

        const systemPrompt = agentPrompts[input.agentType] || agentPrompts.clarity;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt as string },
            { role: "user", content: input.message as string },
          ],
        });

        const aiResponseContent = response.choices[0]?.message?.content;
        const aiResponse = typeof aiResponseContent === 'string' ? aiResponseContent : "";
        await recordAIInteraction(DEFAULT_USER_ID, input.agentType, input.message, aiResponse);

        return { response: aiResponse };
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Initialize missions for new users
export async function initializeUserMissions(userId: number) {
  const { createMissionsForUser } = await import("./db");
  await createMissionsForUser(userId);
}
