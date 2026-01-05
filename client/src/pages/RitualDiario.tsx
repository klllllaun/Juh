import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function RitualDiario() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<"cut" | "action" | "record">("cut");

  const { data: missions, isLoading } = trpc.missions.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const recordProgressMutation = trpc.missions.recordProgress.useMutation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setPhase("record");
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const activeMission = missions?.find((m) => m.status === "active");

  const handleComplete = async () => {
    if (activeMission) {
      await recordProgressMutation.mutateAsync({
        missionId: activeMission.id,
        completed: true,
      });
      navigate("/dashboard");
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="brutalist-header">
        <div className="container">
          <h1 className="brutalist-title">RITUAL DIÁRIO SIMPLES</h1>
          <p className="brutalist-subtitle">15 minutos de ação mínima sem recompensa imediata</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Phase Indicator */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div
            className={`brutalist-card text-center py-8 ${
              phase === "cut" ? "bg-foreground text-background" : "bg-background"
            }`}
          >
            <div className="brutalist-subtitle">FASE 1</div>
            <div className="text-lg font-bold mt-2">CORTE</div>
            <div className="text-xs text-muted-foreground mt-2">5 min</div>
          </div>

          <div
            className={`brutalist-card text-center py-8 ${
              phase === "action" ? "bg-foreground text-background" : "bg-background"
            }`}
          >
            <div className="brutalist-subtitle">FASE 2</div>
            <div className="text-lg font-bold mt-2">AÇÃO</div>
            <div className="text-xs text-muted-foreground mt-2">15 min</div>
          </div>

          <div
            className={`brutalist-card text-center py-8 ${
              phase === "record" ? "bg-foreground text-background" : "bg-background"
            }`}
          >
            <div className="brutalist-subtitle">FASE 3</div>
            <div className="text-lg font-bold mt-2">REGISTRO</div>
            <div className="text-xs text-muted-foreground mt-2">1 min</div>
          </div>
        </div>

        {/* Phase Content */}
        <div className="brutalist-card mb-12 p-12">
          {phase === "cut" && (
            <div>
              <h2 className="brutalist-title mb-8">FASE 1: CORTE</h2>
              <p className="text-sm mb-8 leading-relaxed">
                Identifique e corte uma distração ou tarefa de baixo valor antes de começar.
              </p>
              <div className="bg-muted p-6 mb-8 border-2 border-muted">
                <p className="text-xs text-muted-foreground mb-4">EXEMPLO:</p>
                <ul className="text-sm space-y-2">
                  <li>• Desativar notificações do celular</li>
                  <li>• Sair de grupos de Telegram</li>
                  <li>• Fechar abas desnecessárias do navegador</li>
                </ul>
              </div>
              <Button
                className="brutalist-button w-full"
                onClick={() => setPhase("action")}
              >
                CORTE REALIZADO - PRÓXIMA FASE
              </Button>
            </div>
          )}

          {phase === "action" && (
            <div>
              <h2 className="brutalist-title mb-8">FASE 2: AÇÃO MÍNIMA</h2>
              <p className="text-sm mb-8 leading-relaxed">
                Execute a ação mínima de 15 minutos. Sem otimização. Sem recompensa imediata.
              </p>

              <div className="text-center mb-12">
                <div className="text-7xl font-bold font-mono mb-4">{formatTime(timeLeft)}</div>
                <p className="text-sm text-muted-foreground">Tempo restante</p>
              </div>

              <div className="bg-muted p-6 mb-8 border-2 border-muted">
                <p className="text-xs text-muted-foreground mb-4">MISSÃO ATUAL:</p>
                <h3 className="text-lg font-bold">{activeMission?.title}</h3>
                <p className="text-sm mt-2">{activeMission?.minimalAction}</p>
              </div>

              <div className="flex gap-4">
                <Button
                  className="brutalist-button flex-1"
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? "PAUSAR" : "INICIAR"}
                </Button>
                <Button
                  className="brutalist-button flex-1"
                  onClick={() => setPhase("record")}
                >
                  PULAR PARA REGISTRO
                </Button>
              </div>
            </div>
          )}

          {phase === "record" && (
            <div>
              <h2 className="brutalist-title mb-8">FASE 3: REGISTRO BINÁRIO</h2>
              <p className="text-sm mb-8 leading-relaxed">
                Registre: FEITO ou NÃO FEITO. Sem meio-termo. Sem explicação.
              </p>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <Button
                  className="brutalist-button py-12 text-xl"
                  onClick={handleComplete}
                >
                  FEITO
                </Button>
                <Button
                  className="brutalist-button py-12 text-xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => navigate("/dashboard")}
                >
                  NÃO FEITO
                </Button>
              </div>

              <div className="bg-muted p-6 border-2 border-muted">
                <p className="text-xs text-muted-foreground mb-4">PENALIDADE SILENCIOSA:</p>
                <ul className="text-sm space-y-2">
                  <li>• Se NÃO FEITO: não avança para próxima fase</li>
                  <li>• Se NÃO FEITO: contador de dias consecutivos reseta</li>
                  <li>• Se NÃO FEITO: sem mensagem motivacional</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <Button
          className="brutalist-button w-full"
          onClick={() => navigate("/dashboard")}
        >
          VOLTAR AO DASHBOARD
        </Button>
      </div>
    </div>
  );
}
