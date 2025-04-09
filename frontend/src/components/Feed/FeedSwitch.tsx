import React, { useState, useEffect } from 'react';
import { cva } from "class-variance-authority";

interface FeedSwitchProps {
    refreshTweets: () => void;
    tabs: {
      label: string;
      filter: string;
    }[];
    onFilterChange: (filter: string) => void; // Fonction de rappel pour le changement de filtre
  }
  
  const tabStyles = cva(
    "flex-1 px-4 py-2 border-b-4 transition-colors duration-200",
    {
        variants: {
            state: {
                active: "border-primary text-primary",
                inactive: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            },
        },
        defaultVariants: {
            state: 'inactive',
        },
    }
);

const FeedSwitch = ({ tabs, refreshTweets, onFilterChange }: FeedSwitchProps) => {
    const [selectedTab, setSelectedTab] = useState<string | null>(tabs[0]?.label || null);

    useEffect(() => {
        if (tabs.length > 0) {
            onFilterChange(tabs[0].filter);
            refreshTweets();
        }
    }, []);

    const handleSwitchClick = (label: string, filter: string) => {
      setSelectedTab(label); // Met à jour l'onglet sélectionné
      onFilterChange(filter); // Notifie le parent du changement de filtre
      refreshTweets(); // Recharge les tweets
    };

    return (
      <div className="flex w-full">
        {tabs.map((tab) => (
          <button
        key={tab.label}
        className={tabStyles({ state: selectedTab === tab.label ? 'active' : 'inactive' })}
        onClick={() => handleSwitchClick(tab.label, tab.filter)}
          >
        {tab.label}
          </button>
        ))}
      </div>
    );
  };
  
  export default FeedSwitch;