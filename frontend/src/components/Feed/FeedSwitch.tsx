import React, { useState } from 'react';
import SwitchOnglet from '../../ui/Buttons/SwitchOnglet';

interface FeedSwitchProps {
    refreshTweets: () => void;
    tabs: {
      label: string;
      filter: string;
    }[];
    onFilterChange: (filter: string) => void; // Fonction de rappel pour le changement de filtre
  }
  
  const FeedSwitch = ({ tabs, refreshTweets, onFilterChange }: FeedSwitchProps) => {
    const [selectedTab, setSelectedTab] = useState<string | null>(null);

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
        className={`flex-1 px-4 py-2 border-b-4 ${
          selectedTab === tab.label ? 'border-primary text-primary' : 'border-transparent text-black'
        }`}
        onClick={() => handleSwitchClick(tab.label, tab.filter)}
          >
        {tab.label}
          </button>
        ))}
      </div>
    );
  };
  
  export default FeedSwitch;