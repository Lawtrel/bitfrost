interface PartnessListProps {
    id: number;
    name: string;
    logo: string;
    description: string;
}

export const partnersList: PartnessListProps[] = [
    {
        id:1,
        name: "Heineken",
        logo: "/assets/heineken.svg",
        description: "Uma das maiores empresas de cerveja do Brasil e do mundo.",
    },
] 