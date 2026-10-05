import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/Button/button";
import { useLoginForm } from "@/hooks/loginForm/useLoginForm";

export default function LoginForm() {
  const { form, loading, handleChange, submit } = useLoginForm();

  return (
    <>
      <form aria-label="Login" onSubmit={event => { event.preventDefault(); void submit(); }} className="flex flex-col gap-4 w-full p-6">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email Corporativo</Label>
          <Input
            id="login-email"
            autoComplete="username"
            type="email"
            placeholder="exemplo@heineken.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-senha">Senha</Label>
          <Input
            id="login-senha"
            autoComplete="current-password"
            type="password"
            placeholder="Digite sua senha"
            value={form.senha}
            onChange={(e) => handleChange("senha", e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="secondary"
          className="w-full h-10 font-semibold mt-4"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Ainda não tem uma conta?{" "}
          <a href="/cadastre-se" className="text-blue-600 hover:underline font-medium">
            Cadastre-se
          </a>
        </p>
      </form>
    </>
  );
}