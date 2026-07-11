import { BellRing, ChartColumn, FileText, MapPin, ShieldAlert, ShieldCheck, Users, type LucideIcon } from "lucide-react";

interface HeroCardsProps {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
}

export const heroCards: HeroCardsProps[] = [
    {
        id: 1,
        title: "Dashboard completo",
        description: "Tenha uma visão completa de toda a logística de seus vales em tempo real.",
        icon: ChartColumn,
    },
    {
        id: 2,
        title: "Rastreamento",
        description: "Acompanhe a posição dos seus pallets e seu histórico de movimentações.",
        icon: MapPin,
    },
    {
        id: 3,
        title: "Relatórios Inteligentes",
        description: "Gere relatórios personalizados e tome decisões baseadas em dados.",
        icon: FileText,
    },
    {
        id: 4,
        title: "Gestão de Parceiros",
        description: "Gerencie seus parceiros e clientes de forma centralizada e eficiente.",
        icon: Users,
    },
    {
        id: 5,
        title: "Responsabilidade Clara",
        description: "Identifique o responsável por vales vencidos ou ausência de assinaturas.",
        icon: ShieldAlert,
    },
    {
        id: 6,
        title: "Mais segurança",
        description: "Com sistema completamente digital e impressões físicas evite perdas ou extravios.",
        icon: ShieldCheck,
    },
    {
        id: 7,
        title: "Sistema de Notificações",
        description: "Esteja sempre informado do estado dos vales desde locais a possíveis vencimentos.",
        icon: BellRing,
    },
]