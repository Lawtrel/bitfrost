import { Card } from "@/components/ui/card/card";
import { CircleCheck, Users } from "lucide-react";
import SingUpForm from "./SingUpForm";

export default function Cadastro() {

  return (
    <>
    <section className="flex flex-col lg:flex-row relative py-12 px-6 lg:px-12 gap-10 lg:gap-16 w-full">
      <img className="absolute h-full top-0 object-cover z-[-1] w-full" src="/assets/Hero Bifrost.png" alt="Imagem de fundo do Hero" />
      <div className="flex flex-col w-full lg:w-1/2 max-w-xl mx-auto items-start gap-6">
        <div className="w-12 h-12 bg-black bg-opacity-10 rounded-md flex items-center justify-center">
          <Users className="text-blue-600" />
        </div>
        <p className="text-blue-600 uppercase font-bold text-sm">Junte-se ao Vale Pallet</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-blue-900">Faça parte de uma plataforma que <span className="bg-gradient-to-r from-blue-800 to-purple-400 bg-clip-text text-transparent"> move o futuro</span></h1>
        <p className="text-gray-600 opacity-80">
          Cadastre a sua equipe e tenha acesso a todas as ferramentas para uma gestão de pallets mais eficiente, segura e inteligente
        </p>
        <ol className="gap-5 flex flex-col">
          <li className="flex items-center gap-2 text-blue-600"><CircleCheck /> Mais controle </li>
          <li className="flex items-center gap-2 text-blue-600"><CircleCheck /> Mais produtividade </li>
          <li className="flex items-center gap-2 text-blue-600"><CircleCheck /> Mais resultados </li>
        </ol>
      </div>
      <div className="flex w-full lg:w-1/2 max-w-lg mx-auto self-start">
        <Card 
          cardIcon={<Users />} 
          iconClassName="w-12 h-12 text-blue-600 bg-opacity-10"
          cardTitle="Cadastro de Colaborador" 
          titleClassName="text-center text-2xl text-blue-800 font-bold"
          cardSubtitle="Preencha os campos abaixo para criar sua conta"
          subtitleClassName="text-center text-md"
          className="w-full p-8 bg-card shadow-xl border-0">
            <SingUpForm />
        </Card>
      </div>
    </section>
    </>
  );
}
