import { render, screen } from "@testing-library/react"; 
import userEvent from "@testing-library/user-event"; 
import { describe, expect, it } from "vitest"; 
import { useForm } from "react-hook-form"; 
import RoiCalculatorFormField from "./roiCalculatorFormField"; 
import { RoiCalculatorSchema } from "./roiCalculatorSchema"; 

interface WrapperProps { 
    id: keyof RoiCalculatorSchema; 
    label: string; type?: "text" | "number"; 
    placeholder?: string; 
    errorMessage?: string; 
} 
function Wrapper({ id, label, type, placeholder, errorMessage, }: WrapperProps) { 
    const { register } = useForm<RoiCalculatorSchema>(); 
    return ( 
        <RoiCalculatorFormField 
            id={id} 
            label={label} 
            register={register} 
            type={type} 
            placeholder={placeholder} 
            error={ errorMessage ? { type: "manual", message: errorMessage, } : undefined } 
        /> 
    ); 
} 

describe("RoiCalculatorFormField", () => { 
    it("Deve renderizar corretamente", () => { 
        render( <Wrapper id="companyName" label="Nome da empresa" /> ); 
        expect( screen.getByLabelText(/nome da empresa/i) ).toBeInTheDocument(); 
    });
    
    it("Deve renderizar o placeholder informado", () => { 
        render( <Wrapper id="companyName" label="Nome da empresa" placeholder="Minha empresa" /> ); 
        expect( screen.getByPlaceholderText("Minha empresa") ).toBeInTheDocument(); 
    });
    
    it("Deve renderizar input do tipo texto por padrão", () => { 
        render( <Wrapper id="companyName" label="Nome da empresa" /> ); 
        expect( screen.getByLabelText(/nome da empresa/i) ).toHaveAttribute("type", "text"); 
    }); 

    it("Deve renderizar input do tipo number quando informado", () => { 
        render( <Wrapper id="years" label="Anos" type="number" /> ); 
        expect( screen.getByLabelText(/anos/i) ).toHaveAttribute("type", "number"); 
    }); 
    
    it("Deve permitir digitação", async () => { 
        const user = userEvent.setup(); 
        render( <Wrapper id="companyName" label="Nome da empresa" /> ); 
        const input = screen.getByLabelText(/nome da empresa/i); 
        await user.type(input, "Vale Pallet"); expect(input).toHaveValue("Vale Pallet"); 
    }); 
    
    it("Deve exibir mensagem de erro quando existir", () => { 
        render( <Wrapper id="companyName" label="Nome da empresa" errorMessage="Campo obrigatório" /> ); 
        expect( screen.getByText("Campo obrigatório") ).toBeInTheDocument(); 
    });
    
    it("Não deve exibir mensagem de erro quando não existir", () => { 
        render( <Wrapper id="companyName" label="Nome da empresa" /> ); 
        expect( screen.queryByText("Campo obrigatório") ).not.toBeInTheDocument(); 
    }); 
    
    it("Deve associar corretamente o label ao input", () => { 
        render( <Wrapper id="companyName" label="Nome da empresa" /> ); 
        expect( screen.getByLabelText(/nome da empresa/i) ).toHaveAttribute("id", "companyName"); 
    });

    it("Deve registrar campos numéricos utilizando valueAsNumber", () => {
        const register = vi.fn(() => ({
            name: "years",
            onChange: vi.fn(),
            onBlur: vi.fn(),
            ref: vi.fn(),
        }));

        render(
            <RoiCalculatorFormField
                id="years"
                label="Anos"
                type="number"
                register={register as any}
            />
        );

        expect(register).toHaveBeenCalledWith(
            "years",
            {
                valueAsNumber: true,
            }
        );
    });

    it("Não deve utilizar valueAsNumber em campos de texto", () => {
        const register = vi.fn(() => ({
            name: "companyName",
            onChange: vi.fn(),
            onBlur: vi.fn(),
            ref: vi.fn(),
        }));

        render(
            <RoiCalculatorFormField
                id="companyName"
                label="Empresa"
                register={register as any}
            />
        );

        expect(register).toHaveBeenCalledWith(
            "companyName",
            undefined
        );
    });
});