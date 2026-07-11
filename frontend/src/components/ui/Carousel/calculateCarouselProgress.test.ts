import { calculateCarouselProgress } from "./calculateCarouselProgress";

describe("CalculateCarouselProgress", () => {
    it("Deve retornar 100 quando existir apenas um slide", () => {
        expect(
            calculateCarouselProgress(0, 1)
        ).toBe(100)
    });

    it("Deve retornar a porcentagem correta do progresso", () => {
        expect(
            calculateCarouselProgress(0, 5)
        ).toBe(20);

        expect(
            calculateCarouselProgress(1, 5)
        ).toBe(40);

    });

    it("Deve retornar 100 quando não existir apenas nenhum slide", () => {
        expect(
            calculateCarouselProgress(0, 1)
        ).toBe(100)
    });
})