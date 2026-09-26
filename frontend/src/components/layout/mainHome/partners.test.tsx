import { render, screen } from "@testing-library/react";
import { vi, describe } from "vitest";
import Partners from "./partners";
import { partnersList } from "./partnersList";
import { CardProps } from "@/components/ui/card/card";

vi.mock("@/components/ui/card/card", () => ({
    Card: ({cardIcon}: Pick<CardProps, "cardIcon">) => <div data-testid="card">{cardIcon}</div>,
}));

describe("Partners", () =>{
    it("Deve renderizar o componente corretamente", () => {
        render(<Partners />)

        const partner = screen.getByRole('heading', { name: /quem confia no vale pallet/i })

        expect(partner).toBeInTheDocument()
    });

    it("Deve renderizar o card e a quantidade de cards informadas", () => {
        render(<Partners />)

        const cardPartners = screen.getAllByTestId("card")

        expect(cardPartners).toHaveLength(partnersList.length);
    });

    it("Deve renderizar o texto alternativo de todos os cards informados", () => {
        render(<Partners />)

        partnersList.forEach((partner) => {
            expect(
                screen.getByAltText(`Logo ${partner.name}`)
            ).toBeInTheDocument();
        });
    });

})