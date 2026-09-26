// src/pages/Login.tsx
import { Card } from "@/components/ui/card/card";
import { ChartColumnBig, MapPin, ShieldCheck, UserRoundCheck, Users } from "lucide-react";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <>
      <section className="flex h-[90vh] gap-[150px] pt-16 relative w-full">
        <img className="absolute h-full top-0 object-cover z-[-1] w-full" src="/assets/Hero Bifrost.png" alt="Imagem de fundo do Hero" />
        <div className="flex flex-col w-[35%] pl-40 items-start h-full gap-6">
          <div className="w-12 h-12 bg-black bg-opacity-10 rounded-md flex text-blue-800 items-center justify-center">
            <ShieldCheck />
          </div>
                <p className="text-blue-600 uppercase font-bold text-sm">Bem vindo de volta</p>
                <h1 className="text-5xl font-bold text-blue-900">A gestão dos seus pallets, <span className="bg-gradient-to-r from-blue-800 to-purple-400 bg-clip-text text-transparent">mais simples e eficiente</span></h1>
                <p className="text-gray-600 opacity-80 font-semibold">
                  Acesse sua conta e tenha controle total da sua operação, com dados em tempo real, relatórios inteligentes e muito mais.
                </p>
                <ol className="gap-5 flex flex-col text-lg">
                  <li className="flex items-center gap-2 text-blue-600"><MapPin /> Rastreamento em tempo real </li>
                  <li className="flex items-center gap-2 text-blue-600"><ChartColumnBig /> Relatórios e Indicadores </li>
                  <li className="flex items-center gap-2 text-blue-600"><Users /> Gestão de Parceiros </li>
                  <li className="flex items-center gap-2 text-blue-600"><ShieldCheck /> Mais controle e Eficiência </li>
                </ol>
        </div>
        <div className="flex w-1/3 h-[65%]"> 
          <Card
            headerClassName="items-center justify-center text-center ml-0"
            cardIcon={<UserRoundCheck />}
            iconClassName="w-12 h-12 text-blue-600 bg-opacity-10"
            cardTitle="Login de Colaborador"
            titleClassName="text-center text-2xl text-blue-800 font-bold"
            cardSubtitle="Acesse sua conta para gerenciar vales paletes"
            subtitleClassName="text-center text-sm text-gray-600"
            className="w-full max-w-lg bg-card flex items-center justify-center flex-col shadow-xl border-0"
          >
          <LoginForm />
          </Card>
        </div>
      </section>
    </>
  );
}
