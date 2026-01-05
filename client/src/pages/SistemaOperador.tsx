import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const OPERADOR_PHASES = [
  {
    letter: "O",
    title: "Observar",
    question: "O que foi cortado hoje?",
    error: "Confundir movimento com progresso",
    description: "Observe o que está acontecendo sem julgamento. Identifique padrões.",
  },
  {
    letter: "P",
    title: "Posicionar",
    question: "Qual é a única decisão objetiva que precisa ser tomada agora?",
    error: "Tentar otimizar antes de ter um padrão",
    description: "Defina a posição exata. Sem ambiguidade.",
  },
  {
    letter: "E",
    title: "Estruturar",
    question: "Qual é a Ação Mínima executável em 15 minutos?",
    error: "Criar estruturas complexas",
    description: "Simplifique ao máximo. Uma ação. Um resultado.",
  },
  {
    letter: "R",
    title: "Rotina",
    question: "Onde está o atrito intencional desta semana?",
    error: "Buscar motivação em vez de repetição",
    description: "Estabeleça a repetição. O atrito cria o padrão.",
  },
  {
    letter: "A",
    title: "Ajustar",
    question: "O que o feedback frio está dizendo sobre sua execução?",
    error: "Ignorar o feedback ou torná-lo emocional",
    description: "Escute o feedback sem defesa. Ajuste racionalmente.",
  },
  {
    letter: "D",
    title: "Desacelerar",
    question: "Onde você está fugindo da execução com reflexão excessiva?",
    error: "Pensar demais como forma de covardia",
    description: "Identifique a fuga. Confronte-a.",
  },
  {
    letter: "O",
    title: "Operar",
    question: "Qual é o critério binário (FEITO/NÃO FEITO) para esta tarefa?",
    error: "Deixar a conclusão subjetiva",
    description: "Defina o binário. Sem meio-termo.",
  },
  {
    letter: "R",
    title: "Revisar",
    question: "Se você tivesse que sair do sistema hoje, o que faria?",
    error: "Criar dependência do sistema",
    description: "Prepare-se para a autonomia. O sistema é temporário.",
  },
];

export default function SistemaOperador() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
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
          <h1 className="brutalist-title">O.P.E.R.A.D.O.R</h1>
          <p className="brutalist-subtitle">O mapa-mãe da execução</p>
          <p className="text-sm mt-4">
            Um sistema de prática deliberada sob atrito controlado.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Introduction */}
        <div className="brutalist-card mb-12 p-12">
          <h2 className="brutalist-title mb-6">DEFINIÇÃO OFICIAL</h2>
          <p className="text-sm leading-relaxed mb-8">
            O Sistema O.P.E.R.A.D.O.R é a sequência lógica para transformar caos em padrão.
            A execução repetível não é mágica, mas a aplicação disciplinada de um algoritmo que
            força a decisão objetiva e a ação.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nada disso muda a essência. Só fecha as brechas.
          </p>
        </div>

        {/* Phases Grid */}
        <div className="space-y-8 mb-12">
          {OPERADOR_PHASES.map((phase, index) => (
            <div key={index} className="brutalist-card">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 border-4 border-foreground flex items-center justify-center">
                    <span className="text-3xl font-bold">{phase.letter}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold">{phase.title}</h3>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      Fase {index + 1}
                    </span>
                  </div>

                  <div className="mb-6 p-4 bg-muted border-l-4 border-foreground">
                    <p className="text-sm font-bold mb-2">PERGUNTA CONFRONTADORA:</p>
                    <p className="text-sm italic">"{phase.question}"</p>
                  </div>

                  <p className="text-sm mb-4 leading-relaxed">{phase.description}</p>

                  <div className="p-4 bg-destructive/10 border-l-4 border-destructive">
                    <p className="text-xs font-bold text-destructive mb-1">ERRO COMUM:</p>
                    <p className="text-sm text-destructive">{phase.error}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Principles */}
        <div className="brutalist-card mb-12 p-12">
          <h2 className="brutalist-title mb-8">PRINCÍPIOS INEGOCIÁVEIS</h2>

          <div className="space-y-6">
            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">1. Ação antes de explicação</h3>
              <p className="text-sm text-muted-foreground">
                Você só entende depois que faz. A clareza é uma recompensa da execução.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">2. Desconforto é parte do método</h3>
              <p className="text-sm text-muted-foreground">
                O atrito intencional cria calo mental. Se está confortável, você está fugindo.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">3. Pouco conteúdo, muita repetição</h3>
              <p className="text-sm text-muted-foreground">
                Maestria de poucos fundamentos. Não coleção de guias.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">4. Sem acolhimento emocional</h3>
              <p className="text-sm text-muted-foreground">
                Zero validação. O sistema é frio, direto e confrontador.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">5. Feedback rápido e frio</h3>
              <p className="text-sm text-muted-foreground">
                Ajuste racional e imediato. Sem drama ou autoengano.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">6. Autonomia como objetivo final</h3>
              <p className="text-sm text-muted-foreground">
                O sistema deve se tornar obsoleto para você em 30 dias.
              </p>
            </div>
          </div>
        </div>

        {/* Rule of Gold */}
        <div className="brutalist-card border-4 p-12 mb-12">
          <h2 className="brutalist-title mb-6">A REGRA DE OURO</h2>
          <p className="text-lg font-bold mb-4">
            Toda melhoria deve aumentar execução ou resistência.
          </p>
          <p className="text-sm text-muted-foreground">
            Se só aumenta conforto, está fora.
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
