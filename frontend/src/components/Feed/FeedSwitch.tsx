import React, { useState } from 'react';
import SwitchOnglet from '../../ui/Buttons/SwitchOnglet';

interface FeedSwitchProps {
    refreshTweets: () => void;
    tabs: {
        label: string;
        filter: string;
    }[];
}

const FeedSwitch = ({ tabs, refreshTweets }: FeedSwitchProps) => {
    const [selectedTab, setSelectedTab] = useState<string | null>(null);

    const handleSwitchClick = (label: string, isSelected: boolean) => {
        if (isSelected) {
            setSelectedTab(label);
            refreshTweets(); // Call the refreshTweets function when a tab is selected
        } else {
            setSelectedTab(null); // Deselect the tab
        }
    };

    return (
        <div className="flex gap-4">
            {tabs.map((tab) => (
                <SwitchOnglet
                    key={tab.label}
                    label={tab.label}
                    isSelectedInitial={selectedTab === tab.label}
                    onClick={(isSelected) => handleSwitchClick(tab.label, isSelected)}
                />
            ))}
        </div>
    );
};

export default FeedSwitch;