import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Autonomia() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const { data: missions, isLoading } = trpc.missions.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const [autonomyScore, setAutonomyScore] = useState(0);
  const [readyToExit, setReadyToExit] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (missions) {
      const completedMissions = missions.filter((m) => m.status === "completed").length;
      const score = Math.min((completedMissions / 4) * 100, 100);
      setAutonomyScore(score);
      setReadyToExit(completedMissions >= 3);
    }
  }, [missions]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const completedMissions = missions?.filter((m) => m.status === "completed").length || 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="brutalist-header">
        <div className="container">
          <h1 className="brutalist-title">AUTONOMIA E SAÍDA</h1>
          <p className="brutalist-subtitle">
            {readyToExit
              ? "Você está pronto para operar sozinho"
              : "Continue construindo seu padrão"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Autonomy Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="brutalist-card p-12 text-center">
            <div className="brutalist-subtitle mb-4">NÍVEL DE AUTONOMIA</div>
            <div className="text-6xl font-bold mb-4">{Math.round(autonomyScore)}%</div>
            <div className="w-full bg-muted h-2 border-2 border-foreground">
              <div
                className="bg-foreground h-full transition-all duration-500"
                style={{ width: `${autonomyScore}%` }}
              />
            </div>
          </div>

          <div className="brutalist-card p-12 text-center">
            <div className="brutalist-subtitle mb-4">MISSÕES COMPLETAS</div>
            <div className="text-6xl font-bold">{completedMissions}</div>
            <div className="text-xs text-muted-foreground mt-4">de 4</div>
          </div>

          <div className="brutalist-card p-12 text-center">
            <div className="brutalist-subtitle mb-4">STATUS</div>
            <div className={`text-2xl font-bold ${readyToExit ? "text-accent" : "text-muted-foreground"}`}>
              {readyToExit ? "PRONTO" : "EM PROGRESSO"}
            </div>
            <div className="text-xs text-muted-foreground mt-4">
              {readyToExit ? "Você pode sair do sistema" : `Faltam ${4 - completedMissions} missões`}
            </div>
          </div>
        </div>

        {/* Autonomy Assessment */}
        <div className="brutalist-card mb-12 p-12">
          <h2 className="brutalist-title mb-8">AVALIAÇÃO DE AUTONOMIA</h2>

          <div className="space-y-6">
            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                ✓ Você consegue identificar o ruído
              </h3>
              <p className="text-sm text-muted-foreground">
                Sabe o que cortar sem precisar de validação externa.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                ✓ Você toma decisões objetivas
              </h3>
              <p className="text-sm text-muted-foreground">
                Consegue escolher sem ambiguidade ou procrastinação.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                ✓ Você executa a ação mínima
              </h3>
              <p className="text-sm text-muted-foreground">
                Consegue definir e executar em 15 minutos sem estruturas complexas.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                ✓ Você registra o binário
              </h3>
              <p className="text-sm text-muted-foreground">
                Consegue registrar FEITO/NÃO FEITO sem meio-termo.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                ✓ Você confronta a fuga
              </h3>
              <p className="text-sm text-muted-foreground">
                Consegue identificar quando está escapando e agir mesmo assim.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="brutalist-card mb-12 p-12">
          <h2 className="brutalist-title mb-8">PRÓXIMOS PASSOS</h2>

          {!readyToExit ? (
            <div className="space-y-6">
              <p className="text-sm leading-relaxed">
                Você ainda está em construção. Continue executando as missões operacionais.
              </p>

              <div className="bg-muted p-6 border-l-4 border-foreground">
                <p className="text-xs text-muted-foreground mb-2">RECOMENDAÇÃO:</p>
                <p className="text-sm">
                  Volte ao Dashboard e continue com a missão ativa. A autonomia vem da repetição,
                  não da compreensão.
                </p>
              </div>

              <Button
                className="brutalist-button w-full"
                onClick={() => navigate("/dashboard")}
              >
                CONTINUAR OPERANDO
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm leading-relaxed">
                Você completou o ciclo de 30 dias. Agora é hora de operar sozinho.
              </p>

              <div className="bg-accent/10 p-6 border-l-4 border-accent">
                <p className="text-xs text-muted-foreground mb-2">MANIFESTO DO OPERADOR:</p>
                <p className="text-sm italic">
                  "Eu não preciso mais do sistema. Eu sou o sistema. Minha execução é meu padrão.
                  Meu feedback é meu confronto. Minha autonomia é meu resultado."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="brutalist-button"
                  onClick={() => navigate("/dashboard")}
                >
                  VOLTAR AO DASHBOARD
                </Button>
                <Button
                  className="brutalist-button"
                  onClick={() => {
                    // Implement logout or exit flow
                    window.location.href = "/";
                  }}
                >
                  SAIR DO SISTEMA
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* The Exit Protocol */}
        <div className="brutalist-card mb-12 p-12">
          <h2 className="brutalist-title mb-8">O PROTOCOLO DE SAÍDA</h2>

          <div className="space-y-6">
            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                Fase 1: Reconhecimento
              </h3>
              <p className="text-sm text-muted-foreground">
                Você construiu um padrão. Isso é fato, não opinião.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                Fase 2: Transferência
              </h3>
              <p className="text-sm text-muted-foreground">
                O sistema agora é você. Você é o algoritmo.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                Fase 3: Autonomia
              </h3>
              <p className="text-sm text-muted-foreground">
                Você opera sozinho. Sem validação. Sem acolhimento.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                Fase 4: Evolução
              </h3>
              <p className="text-sm text-muted-foreground">
                Você agora pode ajudar outros a construir seu próprio padrão.
              </p>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="brutalist-card border-4 p-12 text-center mb-12">
          <p className="text-lg font-bold mb-4">
            "Se você precisa de nós para sempre, nós falhamos."
          </p>
          <p className="text-sm text-muted-foreground">
            O objetivo do sistema é se tornar obsoleto.
          </p>
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
