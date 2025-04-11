import { cva } from "class-variance-authority";

interface ButtonProps {
    text: string;
    className?: string;
    variant?: 'primary' | 'border';
}

const buttonStyles = cva(
    "  font-bold py-2 px-4 rounded-full focus:outline-hidden w-full",
    {
        variants: {
            variant: {
                primary: "hover:bg-primary text-white bg-primary border-primary",
                border: "border border-black hover:bg-black text-black hover:text-white", 
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    }
);

const SubmitButton = ({ text, className, variant }: ButtonProps) => {
    return (
        <button
            className={`${buttonStyles({ variant })} ${className} hover:cursor-pointer`}
            type="submit"
        >
            {text}
        </button>
    );
};

export default SubmitButton;