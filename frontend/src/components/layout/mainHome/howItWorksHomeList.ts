import { BellRing, Building2, ChartNoAxesCombined, FileText, LucideIcon, MapPin } from "lucide-react"

interface HowItWorksListProps {
    id: number,
    title: string,
    subtitle: string,
    icon: LucideIcon,
}

export const howItWorksList: HowItWorksListProps[] = [
    {
        id:1,
        title:"Cadastre sua empresa",
        subtitle:"Crie seu ambiente dedicado na nuvem em menos de 2 minutos. Configure filiais, centros de distribuição e usuários com controle hierárquico.",
        icon: Building2,
    },
    {
        id:2,
        title:"Registre seu vale",
        subtitle:"Registre individualmente cada vale emitido pela sua empresa que será enviado a todos os seus parceiros.",
        icon: FileText,
    },
    {
        id:3,
        title:"Receba notificações sobre seus registros",
        subtitle:"Receba notificação para cada passo realizado com seu vale, desde a criação a entrega.",
        icon: BellRing,
    },
    {
        id:4,
        title:"Rastreie seu vale",
        subtitle:"Tenha registro da localização e situação de cada vale enviado de qualquer lugar que acessar o sistema.",
        icon: MapPin,
    },
    {
        id:5,
        title:"Relatórios Inteligentes",
        subtitle:"Tenha auditorias instantâneas de saldo por parceiro e relatórios fiscais automatizados.",
        icon: ChartNoAxesCombined,
    },
]