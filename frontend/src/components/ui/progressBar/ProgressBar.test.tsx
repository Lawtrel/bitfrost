import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
    it("Deve renderizar a porcentagem corretamente", () => {
        render(
            <ProgressBar progress={50} />
        );

        expect (
            screen.getByText("50%")
        ).toBeInTheDocument();
    });

    it("Deve atualizar a largura conforme o progresso", () => {
        render(
            <ProgressBar progress={75} data-testid="progress-value"/>
        );
        const progressElement = screen.getByTestId(
            'progress-value'
        );
        
        expect(
            progressElement
        ).toHaveStyle({
            width: "75%",
        });
    })
    
    it('Não deve exibir porcentagem quando showPercentage for false', () => {
        render(
            <ProgressBar progress={80} showPercentage={false}/>
        );

        expect(
            screen.queryByText("80%")
        ).not.toBeInTheDocument();
    });

    it('Deve aceitar classes personalizadas', () => {
        const { container } = render(
            <ProgressBar progress={40} className="custom-class" />
        );

        expect(
            container.firstChild
        ).toHaveClass("custom-class");
    });

    it('Não deve ultrapassar 100%', () => {
        render(
            <ProgressBar progress={150} />
        );

        expect(
            screen.getByText("100%")
        ).toBeInTheDocument();
    });

});