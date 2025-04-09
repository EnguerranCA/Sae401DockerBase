import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import WritingTweet from './WritingTweet';
import Posts from '../../data/data-posts';
import Users from '../../data/data-users';
import ReloadButton from '../../ui/Buttons/ReloadButton';
import TweetFeed from './TweetFeed';
import FeedSwitch from './FeedSwitch';


// Save the current page number
let page = 1;

const MainPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pageKey, setPageKey] = useState(1); // Utilisé pour forcer le rechargement
  const [filter, setFilter] = useState<string>('none'); // État pour le filtre

  useEffect(() => {
    Users.getCurrentUserInfo().then(user => setCurrentUser(user));
  }, []);

  const refreshFeed = () => {
    setPageKey((prevKey) => prevKey + 1); // Incrémente la clé pour forcer le rechargement
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter); // Met à jour le filtre sélectionné
    refreshFeed(); // Recharge le flux
  };

  return (
    <div className="flex flex-col items-center w-full border border-lightborder md:w-2/3">
      {currentUser && (
        <WritingTweet
          user={currentUser}
          className="w-10 h-10"
          refreshTweets={refreshFeed} // Passe la fonction de rafraîchissement
        />
      )}

      {/* Commutateur pour choisir entre "Tous les tweets" et "Tweets suivis" */}
      <FeedSwitch
        refreshTweets={refreshFeed}
        tabs={[
          { label: 'Home', filter: 'none' },
          { label: 'Follow', filter: 'follow' },
        ]}
        onFilterChange={handleFilterChange} // Passe la fonction de changement de filtre
      />

      {/* Affiche les tweets en fonction du filtre */}
      <div className="flex flex-col items-center w-full relative" key={pageKey}>
        <TweetFeed refreshTweets={refreshFeed} filter={filter} />
      </div>
    </div>
  );
};

export default MainPage;