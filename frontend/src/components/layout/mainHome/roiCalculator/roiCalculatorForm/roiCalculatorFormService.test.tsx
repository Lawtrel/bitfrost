import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RoiCalculatorFormService from "./roiCalculatorFormService";
import { RoiCalculatorSchema } from "./roiCalculatorSchema";
import { useForm } from "react-hook-form";

vi.mock("@/components/ui/button/button", () => ({
    default: ({
        children,
        onClick,
        className,
        type,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
        className?: string;
        type?: "button" | "submit" | "reset";
    }) => (
        <button
            data-testid="button"
            type={type}
            onClick={onClick}
            className={className}
        >
            {children}
        </button>
    ),
}));

interface WrapperProps {
    value: "both" | "dev" | "maintenance";
    selectedService: "both" | "dev" | "maintenance";
    onSelect: (service: "both" | "dev" | "maintenance") => void;
}

function Wrapper({
    value,
    selectedService,
    onSelect,
}: WrapperProps) {
    const { register } = useForm<RoiCalculatorSchema>();

    return (
        <RoiCalculatorFormService
            register={register}
            value={value}
            selectedService={selectedService}
            onSelect={onSelect}
        />
    );
}

describe("RoiCalculatorFormService", () => {
    const register = vi.fn(() => ({
        name: "service",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
    }));

    it("Deve renderizar corretamente", () => {
        render(
            <Wrapper
                value="both"
                selectedService="both"
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByTestId("button")).toBeInTheDocument();
    });

    it("Deve renderizar o texto do serviço completo", () => {
        render(
            <Wrapper
                value="both"
                selectedService="both"
                onSelect={vi.fn()}
            />
        );

        expect(
            screen.getByText(/desenvolvimento \+ manutenção/i)
        ).toBeInTheDocument();
    });

    it("Deve renderizar o texto do serviço de desenvolvimento", () => {
        render(
            <Wrapper
                value="dev"
                selectedService="dev"
                onSelect={vi.fn()}
            />
        );

        expect(
            screen.getByText(/somente desenvolvimento/i)
        ).toBeInTheDocument();
    });

    it("Deve renderizar o texto do serviço de manutenção", () => {
        render(
            <Wrapper
                value="maintenance"
                selectedService="maintenance"
                onSelect={vi.fn()}
            />
        );

        expect(
            screen.getByText(/somente manutenção/i)
        ).toBeInTheDocument();
    });

    it("Deve chamar onSelect ao clicar no botão", async () => {
        const user = userEvent.setup();

        const onSelect = vi.fn();

        render(
            <Wrapper
                value="dev"
                selectedService="both"
                onSelect={onSelect}
            />
        );

        await user.click(screen.getByTestId("button"));

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect).toHaveBeenCalledWith("dev");
    });

    it("Deve aplicar a classe de selecionado", () => {
        render(
            <Wrapper
                value="maintenance"
                selectedService="maintenance"
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByTestId("button")).toHaveClass("border-cyan-500");
    });

    it("Não deve aplicar a classe de selecionado quando outro serviço estiver ativo", () => {
        render(
            <Wrapper
                value="maintenance"
                selectedService="dev"
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByTestId("button")).not.toHaveClass("border-cyan-500");
    });

    it("Deve renderizar o input radio", () => {
        render(
            <Wrapper
                value="both"
                selectedService="both"
                onSelect={vi.fn()}
            />
        );

        expect(
            screen.getByRole("radio", { hidden: true })
        ).toBeInTheDocument();
    });
});