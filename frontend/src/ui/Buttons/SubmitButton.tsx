import { cva } from "class-variance-authority";

interface ButtonProps {
    text: string;
    className?: string;
    variant?: 'blue' | 'border';
}

const buttonStyles = cva(
    "  font-bold py-2 px-4 rounded-full focus:outline-none w-full",
    {
        variants: {
            variant: {
                blue: "hover:bg-primary text-white bg-primary border-primary",
                border: "border border-black hover:bg-black text-black hover:text-white", 
            },
        },
        defaultVariants: {
            variant: 'blue',
        },
    }
);

const SubmitButton = ({ text, className, variant }: ButtonProps) => {
    return (
        <button
            className={`${buttonStyles({ variant })} ${className}`}
            type="submit"
        >
            {text}
        </button>
    );
};

export default SubmitButton;