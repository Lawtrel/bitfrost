// src/pages/LoginADM.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export default function LoginADM() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // --- LÓGICA DE LOGIN NA API (FUTURO) ---
    // try {
    //   const { token } = await loginApi(email, password);
    //   localStorage.setItem('authToken', token);
    //   navigate('/dashboard');
    // } catch (error) {
    //   toast({ title: "Erro de Login", description: "Credenciais inválidas.", variant: "destructive"});
    // } finally {
    //   setIsLoading(false);
    // }
    
    // --- LÓGICA SIMULADA POR ENQUANTO ---
    if (email === "admin@symbolon.com" && password === "admin") {
      toast({ title: "Login bem-sucedido!" });
      navigate('/dashboard');
    } else {
       toast({ title: "Erro de Login", description: "Credenciais inválidas.", variant: "destructive"});
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login Administrador</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}