// src/pages/Login.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import  Button  from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginUsuario } from "@/services/api";
import Header from "@/components/layout/header/header";

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
    <>
    <Header />
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        
      </Card>
    </div>
    </>
  );
}
