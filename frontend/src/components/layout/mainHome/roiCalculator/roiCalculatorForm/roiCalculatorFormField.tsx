import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface RoiCalculatorFormFieldProps<T extends FieldValues> {
    id: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    error?: FieldError;
    type?: "text" | "number";
    placeholder?: string;
}

export default function RoiCalculatorFormField<T extends FieldValues> ({
    id, label, register, error, placeholder, type = "text"
}: RoiCalculatorFormFieldProps<T>) {
    return(
        <div className="flex flex-col gap-3">
            <label
                htmlFor={id}
                className="font-semibold"
            >
                {label}
            </label>
            <input 
                id={id}
                type={type}
                placeholder={placeholder}
                className="text-black border-gray-400 bg-white  p-4 rounded-lg border-[3px] focus:ring-0 focus:outline-none focus:shadow-none focus:border-cyan-500"
                {...register(
                    id,
                    type === "number"
                        ? {valueAsNumber: true}
                        : undefined
                )}
            />
            {error && (
                <span className="text-red-400 text-sm">
                    {error.message}
                </span>
            )}
        </div>
    );
}