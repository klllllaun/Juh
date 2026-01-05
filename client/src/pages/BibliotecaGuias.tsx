import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

type LayerType = "illusion" | "clarity" | "pattern" | "escape" | "autonomy";

const LAYERS: Record<LayerType, { title: string; description: string; color: string }> = {
  illusion: {
    title: "Camada 1: Ilusão",
    description: "O que você acredita que está fazendo vs. o que realmente está fazendo.",
    color: "bg-destructive/10 border-destructive",
  },
  clarity: {
    title: "Camada 2: Clareza",
    description: "Identificar o padrão real. Sem autoengano.",
    color: "bg-muted",
  },
  pattern: {
    title: "Camada 3: Padrão",
    description: "Estabelecer a repetição. O atrito cria o padrão.",
    color: "bg-muted",
  },
  escape: {
    title: "Camada 4: Fuga",
    description: "Identificar onde você está escapando da execução.",
    color: "bg-muted",
  },
  autonomy: {
    title: "Camada 5: Autonomia",
    description: "Operar sozinho. O sistema se torna obsoleto.",
    color: "bg-accent/10",
  },
};

const GUIDES: Record<LayerType, Array<{ title: string; description: string; pages: number }>> = {
  illusion: [
    {
      title: "Os 7 Autoenganos Operacionais",
      description: "Identifique as ilusões que bloqueiam sua execução.",
      pages: 12,
    },
    {
      title: "Movimento vs. Progresso",
      description: "A diferença entre parecer ocupado e estar construindo.",
      pages: 8,
    },
    {
      title: "O Espelho Frio",
      description: "Como ver a verdade sobre sua execução sem defesa.",
      pages: 10,
    },
  ],
  clarity: [
    {
      title: "Decisão Objetiva",
      description: "Como tomar decisões sem ambiguidade.",
      pages: 15,
    },
    {
      title: "Mapa Mental de Execução",
      description: "Estruture sua visão em 3 dimensões.",
      pages: 12,
    },
    {
      title: "O Binário Absoluto",
      description: "FEITO ou NÃO FEITO. Sem meio-termo.",
      pages: 8,
    },
  ],
  pattern: [
    {
      title: "Ação Mínima de 15 Minutos",
      description: "Como definir a ação mais pequena e executável.",
      pages: 10,
    },
    {
      title: "Repetição sem Recompensa",
      description: "O atrito intencional como ferramenta de construção.",
      pages: 14,
    },
    {
      title: "Rastreamento Binário",
      description: "Como registrar progresso sem ilusão.",
      pages: 9,
    },
  ],
  escape: [
    {
      title: "Identificar a Fuga",
      description: "Onde você está se escondendo da execução?",
      pages: 11,
    },
    {
      title: "O Custo da Procrastinação Racional",
      description: "Por que você pensa demais antes de agir.",
      pages: 13,
    },
    {
      title: "Confronto com a Verdade",
      description: "Como aceitar o feedback frio sem defesa.",
      pages: 10,
    },
  ],
  autonomy: [
    {
      title: "Operando Sozinho",
      description: "Como funcionar sem o sistema.",
      pages: 16,
    },
    {
      title: "Transferência de Responsabilidade",
      description: "De dependência para autonomia em 30 dias.",
      pages: 12,
    },
    {
      title: "O Manifesto do Operador",
      description: "Seus princípios não negociáveis.",
      pages: 8,
    },
  ],
};

export default function BibliotecaGuias() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedLayer, setSelectedLayer] = useState<LayerType>("illusion");

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

  const currentGuides = GUIDES[selectedLayer];
  const currentLayer = LAYERS[selectedLayer];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="brutalist-header">
        <div className="container">
          <h1 className="brutalist-title">BIBLIOTECA DE GUIAS</h1>
          <p className="brutalist-subtitle">Mini-ebooks organizados por camadas de desenvolvimento</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Layer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {(Object.keys(LAYERS) as LayerType[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              className={`brutalist-card p-4 text-center cursor-pointer transition-all ${
                selectedLayer === layer
                  ? "bg-foreground text-background border-4"
                  : "hover:border-4"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-widest mb-2">
                {layer === "illusion" && "Ilusão"}
                {layer === "clarity" && "Clareza"}
                {layer === "pattern" && "Padrão"}
                {layer === "escape" && "Fuga"}
                {layer === "autonomy" && "Autonomia"}
              </div>
              <div className="text-2xl font-bold">
                {layer === "illusion" && "1"}
                {layer === "clarity" && "2"}
                {layer === "pattern" && "3"}
                {layer === "escape" && "4"}
                {layer === "autonomy" && "5"}
              </div>
            </button>
          ))}
        </div>

        {/* Layer Description */}
        <div className={`brutalist-card mb-12 p-12 ${currentLayer.color}`}>
          <h2 className="brutalist-title mb-4">{currentLayer.title}</h2>
          <p className="text-sm leading-relaxed">{currentLayer.description}</p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {currentGuides.map((guide, index) => (
            <div key={index} className="brutalist-card flex flex-col">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-4">
                {guide.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                {guide.description}
              </p>
              <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-muted">
                <span className="text-xs text-muted-foreground">{guide.pages} páginas</span>
              </div>
              <Button className="brutalist-button flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                BAIXAR PDF
              </Button>
            </div>
          ))}
        </div>

        {/* How to Use */}
        <div className="brutalist-card mb-12 p-12">
          <h2 className="brutalist-title mb-8">COMO USAR A BIBLIOTECA</h2>

          <div className="space-y-6">
            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                1. Comece pela Camada 1
              </h3>
              <p className="text-sm text-muted-foreground">
                Identifique seus autoenganos antes de qualquer outra coisa.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                2. Leia uma Vez
              </h3>
              <p className="text-sm text-muted-foreground">
                Não releia. Leia uma vez e aplique imediatamente.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                3. Confronte a Verdade
              </h3>
              <p className="text-sm text-muted-foreground">
                Cada guia é um espelho. Não desvie do reflexo.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                4. Progresse Sequencialmente
              </h3>
              <p className="text-sm text-muted-foreground">
                Não pule camadas. A sequência é intencional.
              </p>
            </div>
          </div>
        </div>

        {/* Layer Progression */}
        <div className="brutalist-card mb-12 p-12">
          <h2 className="brutalist-title mb-8">PROGRESSÃO DAS CAMADAS</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-4 border-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-bold text-sm">Ilusão → Clareza</p>
                <p className="text-xs text-muted-foreground">Identifique o que é real</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-4 border-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-bold text-sm">Clareza → Padrão</p>
                <p className="text-xs text-muted-foreground">Estabeleça a repetição</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-4 border-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-bold text-sm">Padrão → Fuga</p>
                <p className="text-xs text-muted-foreground">Confronte a procrastinação</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-4 border-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <p className="font-bold text-sm">Fuga → Autonomia</p>
                <p className="text-xs text-muted-foreground">Opere sozinho</p>
              </div>
            </div>
          </div>
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
