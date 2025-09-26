// src/pages/Login.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginUsuario } from "@/services/api";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
  if (!form.email || !form.senha) {
    toast({
      title: "❌ Campos vazios",
      description: "Por favor, preencha o email e a senha.",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);

  try {
    // Chama sua API para fazer login
    const response = await loginUsuario(form.email, form.senha);
    const usuario = response.data;

    if (usuario.status !== "ativo") {
      toast({
        title: "⏳ Aguardando aprovação",
        description: "Seu acesso ainda não foi liberado pelo administrador master.",
        variant: "destructive",
      });
      return;
    }

    // Armazena os dados do usuário
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("admId", usuario.id); // ou qualquer campo que represente o ID

    toast({
      title: "✅ Login realizado",
      description: `Bem-vindo, ${usuario.nome}!`,
    });

    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    const message =
      error?.response?.data?.error || "Erro ao tentar fazer login.";

    toast({
      title: "❌ Erro de login",
      description: message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-blue-800 font-bold">
            Login de Colaborador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Email Corporativo</Label>
            <Input
              type="email"
              placeholder="exemplo@heineken.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
            />
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <p className="text-center text-sm text-gray-600">
              Ainda não tem uma conta?{" "}
              <a
                href="/"
                className="text-blue-600 hover:underline font-medium"
              >
                Cadastre-se
              </a>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
