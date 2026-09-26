import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import RoiCalculatorForm from "./roiCalculatorForm";

vi.mock("@/components/ui/button/button", () => ({
    default: ({
        children,
        type,
    }: {
        children: React.ReactNode;
        type?: "button" | "submit" | "reset";
    }) => (
        <button
            data-testid="submit-button"
            type={type}
        >
            {children}
        </button>
    ),
}));

vi.mock("./roiCalculatorFormField", () => ({
    default: ({
        id,
        label,
    }: {
        id: string;
        label: string;
    }) => (
        <div data-testid="form-field">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                aria-label={label}
            />
        </div>
    ),
}));

vi.mock("./roiCalculatorFormService", () => ({
    default: ({
        value,
        onSelect,
    }: {
        value: string;
        onSelect: (value: "both" | "dev" | "maintenance") => void;
    }) => (
        <button
            data-testid={`service-${value}`}
            onClick={() => onSelect(value as any)}
        >
            {value}
        </button>
    ),
}));

describe("RoiCalculatorForm", () => {

    it("Deve renderizar corretamente", () => {
        render(<RoiCalculatorForm onSubmit={vi.fn()} />);

        expect(
            screen.getByTestId("roi-form")
        ).toBeInTheDocument();
    });

    it("Deve renderizar todos os campos", () => {
        render(<RoiCalculatorForm onSubmit={vi.fn()} />);

        expect(
            screen.getAllByTestId("form-field")
        ).toHaveLength(6);
    });

    it("Deve renderizar os três serviços", () => {
        render(<RoiCalculatorForm onSubmit={vi.fn()} />);

        expect(
            screen.getByTestId("service-both")
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("service-dev")
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("service-maintenance")
        ).toBeInTheDocument();
    });

    it("Deve renderizar o botão de submit", () => {
        render(<RoiCalculatorForm onSubmit={vi.fn()} />);

        expect(
            screen.getByTestId("submit-button")
        ).toBeInTheDocument();
    });

    it("Deve exibir o texto do botão", () => {
        render(<RoiCalculatorForm onSubmit={vi.fn()} />);

        expect(
            screen.getByRole("button", {
                name: /calcular roi/i,
            })
        ).toBeInTheDocument();
    });

    it("Deve selecionar o serviço Desenvolvimento + Manutenção", async () => {
        const user = userEvent.setup();

        render(<RoiCalculatorForm onSubmit={vi.fn()} />);

        await user.click(
            screen.getByTestId("service-both")
        );

        expect(
            screen.getByTestId("service-both")
        ).toBeInTheDocument();
    });

    it("Deve selecionar o serviço Desenvolvimento", async () => {
        const user = userEvent.setup();

        render(<RoiCalculatorForm onSubmit={vi.fn()} />);

        await user.click(
            screen.getByTestId("service-dev")
        );

        expect(
            screen.getByTestId("service-dev")
        ).toBeInTheDocument();
    });

    it("Deve selecionar o serviço Manutenção", async () => {
        const user = userEvent.setup();

        render(<RoiCalculatorForm onSubmit={vi.fn()} />);

        await user.click(
            screen.getByTestId("service-maintenance")
        );

        expect(
            screen.getByTestId("service-maintenance")
        ).toBeInTheDocument();
    });

    it("Deve chamar o submit do formulário", async () => {
        const user = userEvent.setup();

        const onSubmit = vi.fn();

        render(
            <RoiCalculatorForm
                onSubmit={onSubmit}
            />
        );

        await user.click(
            screen.getByRole("button", {
                name: /calcular roi/i,
            })
        );

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

});