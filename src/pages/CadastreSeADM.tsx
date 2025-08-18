import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function Cadastro() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    role: "adm",
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

    setLoading(true);

    try {
            // Passo 1: Criar o usuário no Firebase Authentication
      // Esta função já verifica se o e-mail está em uso e lança um erro se estiver.
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.senha);
      const user = userCredential.user;

      // Passo 2: Se o usuário for criado com sucesso, salvar os dados adicionais no Firestore
      // Usaremos o UID do usuário como ID do documento para manter a consistência.
      const novoUsuario = {
        uid: user.uid,
        nome: form.nome,
        email: form.email,
        role: form.role,
        status: "pendente" // Novos usuários sempre começam como pendentes
      };

      // setDoc cria ou substitui um documento. Usamos doc() para especificar o ID do documento.
      await setDoc(doc(db, "admins", user.uid), novoUsuario);

      toast({
        title: "✅ Cadastro enviado",
        description: "Aguardando aprovação do administrador master.",
      });

      // Limpa o formulário e redireciona para o login
      setForm({ nome: "", email: "", senha: "", confirmarSenha: "", role: "adm" });
      setTimeout(() => navigate("/login"), 2000);

    } catch (error: any) {
      console.error(error);
      let description = "Não foi possível salvar o cadastro. Tente novamente.";

      // Fornece feedback específico com base nos erros do Firebase
      if (error.code === 'auth/email-already-in-use') {
        description = "Este e-mail já está em uso por outra conta.";
      } else if (error.code === 'auth/weak-password') {
        description = "A senha é muito fraca. Use pelo menos 6 caracteres.";
      } else if (error.code === 'auth/invalid-email') {
        description = "O formato do e-mail é inválido.";
      }

      toast({
        title: "❌ Erro ao cadastrar",
        description: description,
        variant: "destructive"
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
              <option value="adm">Administrador</option>
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
