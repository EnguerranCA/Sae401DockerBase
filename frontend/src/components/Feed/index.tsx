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
  const [pageKey, setPageKey] = useState(1); // Use state for the key

  useEffect(() => {
    Users.getCurrentUserInfo().then(user => setCurrentUser(user));
  }, []);

  const refreshFeed = () => {
    setPageKey((prevKey) => prevKey + 1); // Increment the key to force re-render
  };

  return (
    <div className="flex flex-col items-center w-full border border-lightborder md:w-1/3">

      {currentUser && (
        <WritingTweet
          user={currentUser}
          className="w-10 h-10"
          refreshTweets={refreshFeed} // Pass refreshFeed to WritingTweet
        />
      )}

      <div className="flex flex-col items-center w-full relative" key={pageKey}>
        <TweetFeed refreshTweets={refreshFeed} />
      </div>
    </div>
  );
};

export default MainPage;