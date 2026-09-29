import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { loginUsuario } from "@/services/api";

export type LoginFormData = {
  email: string;
  senha: string;
};

const initialForm: LoginFormData = {
  email: "",
  senha: "",
};

export function useLoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormData>(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.email || !form.senha) {
      const message = {
        valid: false,
        title: "❌ Campos vazios",
        description: "Por favor, preencha o email e a senha.",
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
      const response = await loginUsuario(form.email, form.senha);
      const { user: usuario, token } = response.data;

      if (usuario.status !== "ativo") {
        toast({
          title: "⏳ Aguardando aprovação",
          description: "Seu acesso ainda não foi liberado pelo administrador master.",
          variant: "destructive",
        });
        return false;
      }

      if (!token) throw new Error('O servidor não retornou uma sessão válida.');
      sessionStorage.setItem('accessToken', token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("admId", usuario.id);

      toast({
        title: "✅ Login realizado",
        description: `Bem-vindo, ${usuario.nome}!`,
      });

      navigate("/dashboard");
      return true;
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Erro ao tentar fazer login.";

      toast({
        title: "❌ Erro de login",
        description: message,
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
  };
}
