import { cva } from "class-variance-authority";


interface ReloadButtonProps {
    text: string;
    className?: string;
    variant?: 'primary' | 'border';
    reloadParent: () => void;
}

const buttonStyles = cva(
    "sticky top-50 font-bold py-2 px-4 rounded-full focus:outline-hidden w-full ",
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

const ReloadButton = ({ text, className, variant, reloadParent }: ReloadButtonProps) => {
    
    return (
        <button
            className={`${buttonStyles({ variant })} ${className} hover:cursor-pointer flex items-center justify-between`}
            onClick={reloadParent}
        >
            {text}
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 ml-2"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5v5h5M19.5 19.5v-5h-5M19.5 4.5l-15 15"
            />
            </svg>
        </button>
    );
};

export default ReloadButton;