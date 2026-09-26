import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  createUsuario,
  getUsuariosByEmail,
  getUsuariosByRole,
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

    if (form.role === "" || form.role === "selecione") {
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
      if (form.role === "adm") {
        const { data: admins } = await getUsuariosByRole("adm");

        if (admins.length > 0) {
          toast({
            title: "❌ Ação não permitida",
            description: "Já existe um administrador cadastrado.",
            variant: "destructive",
          });
          return false;
        }
      }

      const { data: usuariosExistentes } = await getUsuariosByEmail(form.email);

      if (usuariosExistentes.length > 0) {
        toast({
          title: "❌ Email em uso",
          description: "Já existe um usuário cadastrado com este email.",
          variant: "destructive",
        });
        return false;
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

      resetForm();
      setTimeout(() => navigate("/login"), 2000);
      return true;
    } catch (error: unknown) {
      console.error(error);

      const erroMsg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
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
