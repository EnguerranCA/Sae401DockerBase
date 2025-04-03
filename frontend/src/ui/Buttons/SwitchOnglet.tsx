import { useState } from "react";
import { cva } from "class-variance-authority";

interface SwitchOngletProps {
    className?: string;
    onClick: (isSelected: boolean) => void; // Pass the new state to the parent
    isSelectedState?: boolean; // Initial state for the tab
    label: string; // Label for the tab
}

const SwitchOngletStyles = cva(
    "flex items-center gap-1 hover:cursor-pointer px-4 py-2 font-bold w-full",
    {
        variants: {
            isSelected: {
                false: "border-b-4 border-primary text-black items-center",
                true: "text-black",
            },
        },
    }
);

const SwitchOnglet = ({ className, onClick, isSelectedState = true, label }: SwitchOngletProps) => {
    const [isSelected, setIsSelected] = useState(isSelectedState);

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