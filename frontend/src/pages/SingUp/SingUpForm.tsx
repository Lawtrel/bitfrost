import Button from "@/components/ui/button/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSingUpForm } from "@/hooks/singUpForm/useSingUpForm";

export default function SingUpForm() {
  const { form, loading, handleChange, submit } = useSingUpForm();

  return (
    <>
      <section className="flex flex-col gap-4 w-full p-4 border-0">
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
            onClick={submit}
            disabled={loading}
            variant="primary"
            className="w-full h-12 text-white font-semibold"
          >
            {loading ? "Enviando..." : "Cadastrar"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Faça login
            </a>
          </p>
        </div>
      </section>
    </>
  );
}