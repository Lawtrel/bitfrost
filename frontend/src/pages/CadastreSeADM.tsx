import { useState } from "react";
import { Card } from "@/components/ui/card/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import  Button  from "@/components/ui/button/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { createUsuario, getUsuariosByEmail, getUsuariosByRole } from "../services/api";
import Header from "@/components/layout/header/header";

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
    <>
    <Header />
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        
      </Card>
    </div>
    </>
  );
}
