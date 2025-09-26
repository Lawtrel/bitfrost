import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { createUsuario, getUsuariosByEmail, getUsuariosByRole } from "../services/api";

export default function Cadastro() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    role: "",
    status: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validarEmailCorporativo = (email: string) => {
    const dominiosPermitidos = ["@heineken.com", "@heiway.net"];
    return dominiosPermitidos.some((dominio) =>
      email.toLowerCase().endsWith(dominio)
    );
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      toast({
        title: "❌ Senhas não coincidem",
        description: "As senhas devem ser iguais.",
        variant: "destructive"
      });
      return;
    }

    if (!validarEmailCorporativo(form.email)) {
      toast({
        title: "❌ Email inválido",
        description: "Use um email corporativo.",
        variant: "destructive"
      });
      return;
    } 
    if (form.role === "" || form.role === "selecione") {
      toast({
        title: "❌ Selecione um cargo",
        description: "Você deve selecionar a sua função",
        variant: "destructive"
      });
      return;
    }


    setLoading(true);
    
    try {
     // 🔒 Bloqueio de múltiplos ADMs
    if (form.role === "adm") {
      const { data: admins } = await getUsuariosByRole("adm");
      if (admins.length > 0) {
        toast({
          title: "❌ Ação não permitida",
          description: "Já existe um administrador cadastrado.",
          variant: "destructive",
        });
        return;
      }
    }
    const { data: usuariosExistentes } = await getUsuariosByEmail(form.email);
    if (usuariosExistentes.length > 0) {
      toast({
        title: "❌ Email em uso",
        description: "Já existe um usuário cadastrado com este email.",
        variant: "destructive",
      });
      return;
    }
    await createUsuario({
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      role: form.role,
      status: "pendente",
    });

    toast({
      title: "✅ Sucesso",
      description: "Cadastro realizado! Aguarde aprovação do administrador.",
    });
    setForm({
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      role: "",
      status: "",
    });
    setTimeout(() => navigate("/login"), 2000);
  }catch (error) {
    console.error(error);
    const erroMsg =
      error.response?.data?.message ||
      "Erro inesperado ao cadastrar. Tente novamente.";

    toast({
      title: "❌ Erro ao cadastrar",
      description: erroMsg,
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
            Cadastro de Colaborador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <Input
              type="text"
              placeholder="Digite seu nome"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>

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

          <div className="space-y-2">
            <Label>Confirmar Senha</Label>
            <Input
              type="password"
              placeholder="Confirme a senha"
              value={form.confirmarSenha}
              onChange={(e) => handleChange("confirmarSenha", e.target.value)}
            />
          </div>

          {/* Select de Cargo */}
          <div className="space-y-2">
            <Label>Tipo de Conta</Label>
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full border border-gray-300 rounded-md h-12 px-3 text-gray-700"
            >
              <option value="selecione">Selecione um cargo</option>
              <option value="adm">Administrador</option>
              <option value="supervisor">Supervisor</option>
              <option value="consultor">Consultor</option>
            </select>
          </div>

          <div className="space-y-3 mt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {loading ? "Enviando..." : "Cadastrar"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Faça login
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
