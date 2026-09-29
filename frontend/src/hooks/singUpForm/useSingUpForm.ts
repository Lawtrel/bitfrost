import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  createUsuario,
} from "@/services/api";

export type SingUpFormData = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  role: string;
  status: string;
};

const initialForm: SingUpFormData = {
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  role: "",
  status: "",
};

export function useSingUpForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SingUpFormData>(initialForm);

  const handleChange = (field: keyof SingUpFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const validarEmailCorporativo = (email: string) => {
    const dominiosPermitidos = ["@heineken.com", "@heiway.net"];
    return dominiosPermitidos.some((dominio) =>
      email.toLowerCase().endsWith(dominio)
    );
  };

  const validateForm = () => {
    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
      const message = {
        valid: false,
        title: "❌ Campos obrigatórios",
        description: "Preencha todos os campos.",
      };

      toast({
        title: message.title,
        description: message.description,
        variant: "destructive",
      });

      return message;
    }

    if (form.senha !== form.confirmarSenha) {
      const message = {
        valid: false,
        title: "❌ Senhas não coincidem",
        description: "As senhas devem ser iguais.",
      };

      toast({
        title: message.title,
        description: message.description,
        variant: "destructive",
      });

      return message;
    }

    if (!validarEmailCorporativo(form.email)) {
      const message = {
        valid: false,
        title: "❌ Email inválido",
        description: "Use um email corporativo.",
      };

      toast({
        title: message.title,
        description: message.description,
        variant: "destructive",
      });

      return message;
    }

    if (form.senha.length < 8 || new TextEncoder().encode(form.senha).length > 72) {
      const message = { valid: false, title: '❌ Senha inválida', description: 'Use pelo menos 8 caracteres e no máximo 72 bytes.' };
      toast({ ...message, variant: 'destructive' });
      return message;
    }

    if (!["consultor", "supervisor"].includes(form.role)) {
      const message = {
        valid: false,
        title: "❌ Selecione um cargo",
        description: "Você deve selecionar a sua função",
      };

      toast({
        title: message.title,
        description: message.description,
        variant: "destructive",
      });

      return message;
    }

    return { valid: true, title: "", description: "" };
  };

  const submit = async () => {
    const validation = validateForm();

    if (!validation.valid) {
      return false;
    }

    setLoading(true);

    try {
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

      resetForm();
      setTimeout(() => navigate("/login"), 2000);
      return true;
    } catch (error: unknown) {
      const erroMsg =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Erro inesperado ao cadastrar. Tente novamente.";

      toast({
        title: "❌ Erro ao cadastrar",
        description: erroMsg,
        variant: "destructive",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleChange,
    validateForm,
    submit,
    resetForm,
  };
}
