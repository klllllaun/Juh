import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type AgentType = "clarity" | "decision" | "execution" | "cut";

const AGENTS: Record<AgentType, { title: string; description: string; prompt: string }> = {
  clarity: {
    title: "Agente de Clareza",
    description: "Identifique a única decisão objetiva. Sem ambiguidade.",
    prompt: "Qual é a única decisão objetiva que você precisa tomar agora?",
  },
  decision: {
    title: "Agente de Decisão",
    description: "Force uma escolha binária. Sem meio-termo.",
    prompt: "Você escolhe A ou B? Sem terceira opção.",
  },
  execution: {
    title: "Agente de Execução",
    description: "Defina a Ação Mínima de 15 minutos. Sem estruturas complexas.",
    prompt: "Qual é a ação mínima que você pode fazer em 15 minutos?",
  },
  cut: {
    title: "Agente de Corte",
    description: "Identifique o que deve ser eliminado. Seja frio e direto.",
    prompt: "O que você precisa cortar para focar no essencial?",
  },
};

export default function AgentesIA() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("clarity");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatMutation = trpc.ai.chat.useMutation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({
        agentType: selectedAgent,
        message: userMessage,
      });

      setMessages((prev) => [...prev, { role: "ai", content: response.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Erro ao conectar com o agente. Tente novamente." },
      ]);
    } finally {
      setIsLoading(false);
      setUserMessage("");
    }
  };

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
          <h1 className="brutalist-title">AGENTES DE IA</h1>
          <p className="brutalist-subtitle">Confronto operacional sem validação emocional</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Agent Selection */}
          {(Object.keys(AGENTS) as AgentType[]).map((agentKey) => (
            <div
              key={agentKey}
              onClick={() => setSelectedAgent(agentKey)}
              className={`brutalist-card cursor-pointer transition-all ${
                selectedAgent === agentKey
                  ? "bg-foreground text-background border-4"
                  : "hover:border-4"
              }`}
            >
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                {AGENTS[agentKey].title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {AGENTS[agentKey].description}
              </p>
            </div>
          ))}
        </div>

        {/* Chat Interface */}
        <div className="brutalist-card mb-12 p-0 flex flex-col h-96">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-8 border-b-2 border-muted">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Nenhuma mensagem ainda.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {AGENTS[selectedAgent].prompt}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-foreground text-background"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-4 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 border-t-2 border-muted">
            <div className="flex gap-4">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Sua resposta..."
                className="brutalist-input flex-1"
                disabled={isLoading}
              />
              <Button
                className="brutalist-button"
                onClick={handleSendMessage}
                disabled={isLoading || !userMessage.trim()}
              >
                ENVIAR
              </Button>
            </div>
          </div>
        </div>

        {/* Agent Info */}
        <div className="brutalist-card mb-12 p-12">
          <h2 className="brutalist-title mb-6">{AGENTS[selectedAgent].title}</h2>
          <p className="text-sm mb-8 leading-relaxed">
            {AGENTS[selectedAgent].description}
          </p>

          <div className="bg-muted p-6 border-l-4 border-foreground">
            <p className="text-xs text-muted-foreground mb-2">PERGUNTA INICIAL:</p>
            <p className="text-sm italic">"{AGENTS[selectedAgent].prompt}"</p>
          </div>
        </div>

        {/* Rules */}
        <div className="brutalist-card mb-12 p-12">
          <h2 className="brutalist-title mb-6">COMO USAR</h2>

          <div className="space-y-6">
            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                1. Escolha o Agente
              </h3>
              <p className="text-sm text-muted-foreground">
                Selecione o agente que corresponde ao seu desafio atual.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                2. Seja Honesto
              </h3>
              <p className="text-sm text-muted-foreground">
                Responda com a verdade. O agente confrontará suas ilusões.
              </p>
            </div>

            <div className="border-b-2 border-muted pb-6 last:border-b-0">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                3. Sem Validação
              </h3>
              <p className="text-sm text-muted-foreground">
                Não espere motivação. Espere confronto frio e direto.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                4. Aja Imediatamente
              </h3>
              <p className="text-sm text-muted-foreground">
                O feedback só vale se você executar. Caso contrário, é apenas ruído.
              </p>
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
