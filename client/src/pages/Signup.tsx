import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Signup() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Falha ao criar conta");
        return;
      }

      // Reload page to update auth state
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="brutalist-title mb-2">OPERADOR</h1>
          <p className="brutalist-subtitle">Sistema de Prática Deliberada</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="brutalist-card p-8">
            <h2 className="font-bold text-sm uppercase tracking-widest mb-6">
              Criar Conta
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                  Nome
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  disabled={loading}
                  className="bg-background border-2 border-foreground text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={loading}
                  required
                  className="bg-background border-2 border-foreground text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                  Senha
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                  className="bg-background border-2 border-foreground text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">
                  Confirmar Senha
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                  className="bg-background border-2 border-foreground text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="brutalist-button w-full flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "CRIANDO..." : "CRIAR CONTA"}
            </Button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Já tem uma conta?
          </p>
          <Button
            variant="outline"
            className="brutalist-button w-full"
            onClick={() => navigate("/login")}
          >
            FAZER LOGIN
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Sistema de Prática Deliberada sob Atrito Controlado
          </p>
        </div>
      </div>
    </div>
  );
}
