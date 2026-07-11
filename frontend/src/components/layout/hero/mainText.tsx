import AnimatedText from "@/components/shared/animatedText/animatedText";
import Button from "@/components/ui/button/button";
import { MoveRight } from "lucide-react";

export default function MainText() {
    const heroMessages = [
        'impulsionar sua empresa para o futuro.',
        'melhorar a eficiência dos processos e reduzir custos.',
        'garantir a rastreabilidade e conformidade.',
        'otimizar o trabalho e aumentar a produtividade.',
    ];
    return (
        <section role="region" className="flex flex-col gap-8 pt-20 w-[600px]">
            <div className="flex flex-col gap-8">
                <h2 className="text-6xl font-bold font-inter">Gestão inteligente de pallets e documentos para {' '}
                    <AnimatedText items={heroMessages} />
                </h2>
                <p className="text-lg text-muted-foreground font-inter">
                    O vale pallet é a plataforma completa para controle, rastreamento e gestão de vales pallets de forma simples, eficiente e inteligente.
                </p>
            </div>
            <div className="flex gap-8">
                <Button variant='primary' href="/cadastre-se" size='md' rightIcon={<MoveRight aria-hidden className="w-5 h-5" />}>Cadastre-se</Button>
                <Button variant='secondary' size='md'>Saiba Mais</Button>
            </div>
        </section>
    )
}