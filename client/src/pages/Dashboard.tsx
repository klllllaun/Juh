import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const { data: missions, isLoading } = trpc.missions.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const activeMission = missions?.find((m) => m.status === "active");
  const completedMissions = missions?.filter((m) => m.status === "completed").length || 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="brutalist-header">
        <div className="container">
          <h1 className="brutalist-title">OPERADOR</h1>
          <p className="brutalist-subtitle">Sistema de Prática Deliberada sob Atrito Controlado</p>
          <p className="text-sm mt-4">Usuário: {user?.name || user?.email}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Missões Completas */}
          <div className="brutalist-card">
            <div className="brutalist-subtitle mb-4">MISSÕES COMPLETAS</div>
            <div className="text-5xl font-bold">{completedMissions}</div>
            <div className="text-xs text-muted-foreground mt-2">de 4</div>
          </div>

          {/* Missão Ativa */}
          <div className="brutalist-card">
            <div className="brutalist-subtitle mb-4">MISSÃO ATUAL</div>
            <div className="text-lg font-bold">{activeMission?.title || "Nenhuma"}</div>
            <div className="text-xs text-muted-foreground mt-2">{activeMission?.missionNumber || 0} de 4</div>
          </div>

          {/* Estado */}
          <div className="brutalist-card">
            <div className="brutalist-subtitle mb-4">ESTADO MENTAL</div>
            <div className="text-lg font-bold">
              {completedMissions === 0 && "FRUSTRAÇÃO"}
              {completedMissions === 1 && "CLAREZA PARCIAL"}
              {completedMissions === 2 && "CONFIANÇA FRIA"}
              {completedMissions >= 3 && "AUTONOMIA"}
            </div>
            <div className="text-xs text-muted-foreground mt-2">Semana {Math.floor(completedMissions / 1) + 1}</div>
          </div>
        </div>

        {/* Missions List */}
        <div className="brutalist-card mb-12">
          <h2 className="brutalist-title mb-8">MISSÕES OPERACIONAIS</h2>

          <div className="space-y-6">
            {missions?.map((mission) => (
              <div key={mission.id} className="border-b-2 border-muted pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{mission.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{mission.objective}</p>
                  </div>
                  <div
                    className={`px-4 py-2 border-2 font-bold text-xs uppercase tracking-widest ${
                      mission.status === "active"
                        ? "border-foreground bg-foreground text-background"
                        : mission.status === "completed"
                          ? "border-foreground bg-background text-foreground"
                          : "border-muted text-muted-foreground"
                    }`}
                  >
                    {mission.status === "active" && "ATIVA"}
                    {mission.status === "completed" && "COMPLETA"}
                    {mission.status === "locked" && "BLOQUEADA"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Ação Mínima:</span>
                    <p className="font-mono text-sm mt-1">{mission.minimalAction}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Regra:</span>
                    <p className="font-mono text-sm mt-1">{mission.repetitionRule}</p>
                  </div>
                </div>

                {mission.status === "active" && (
                  <Button className="brutalist-button mt-6 w-full">
                    REGISTRAR EXECUÇÃO
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Button className="brutalist-button" onClick={() => navigate('/ritual-diario')}>
            RITUAL DIÁRIO SIMPLES
          </Button>
          <Button className="brutalist-button" onClick={() => navigate('/sistema-operador')}>
            SISTEMA O.P.E.R.A.D.O.R
          </Button>
          <Button className="brutalist-button" onClick={() => navigate('/guias')}>
            BIBLIOTECA DE GUIAS
          </Button>
          <Button className="brutalist-button" onClick={() => navigate('/agentes-ia')}>
            AGENTES DE IA
          </Button>
        </div>

        <Button
          className="brutalist-button w-full border-4"
          onClick={() => navigate('/autonomia')}
        >
          AUTONOMIA E SAIDA
        </Button>
      </div>
    </div>
  );
}
