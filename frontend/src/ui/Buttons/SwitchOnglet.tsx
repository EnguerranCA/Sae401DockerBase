import { useState } from "react";
import { cva } from "class-variance-authority";

interface SwitchOngletProps {
    className?: string;
    onClick: (isSelected: boolean) => void; // Pass the new state to the parent
    isSelectedInitial?: boolean; // Initial state for the tab
    label: string; // Label for the tab
}

const SwitchOngletStyles = cva(
    "flex items-center gap-1 hover:cursor-pointer px-4 py-2 rounded-full font-bold",
    {
        variants: {
            isSelected: {
                true: "border-b-2 border-primary bg-primary text-white hover:bg-primary-hover",
                false: "bg-gray-200 text-black hover:bg-gray-300",
            },
        },
    }
);

const SwitchOnglet = ({ className, onClick, isSelectedInitial = false, label }: SwitchOngletProps) => {
    const [isSelected, setIsSelected] = useState(isSelectedInitial);

    const handleClick = () => {
        const newSelectedState = !isSelected;
        setIsSelected(newSelectedState); // Update local state
        onClick(newSelectedState); // Notify parent
    };

    return (
        <button
            className={`${SwitchOngletStyles({ isSelected })} ${className}`}
            onClick={handleClick}
        >
            <span>{label}</span>
        </button>
    );
};

export default SwitchOnglet;
