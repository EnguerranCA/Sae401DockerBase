import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import WritingTweet from './WritingTweet';
import Posts from '../../data/data-posts';
import Users from '../../data/data-users';
import ReloadButton from '../../ui/Buttons/ReloadButton';
import TweetFeed from './TweetFeed';


// Save the current page number
let page = 1;

const MainPage = () => {
  // Load the data for the current user
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    Users.getCurrentUserInfo().then(user => setCurrentUser(user));
  }, []);

  const refreshFeed = () => {
    const tweetFeedElement = document.querySelector('#tweetFeed');
    if (tweetFeedElement) {
      tweetFeedElement.scrollTo(0, 0);
      
    }
  };

  return (
    <div className="flex flex-col items-center w-full border md:w-1/3">
      {/* {error && <div className="text-red-500">{error}</div>} */}
      {currentUser && (
        <WritingTweet
          user={currentUser}
          className="w-10 h-10"
          refreshTweets={() => refreshFeed()}
        />
      )}

      <div className="flex flex-col items-center w-full relative" key={page}>
        <TweetFeed refreshTweets={() => refreshFeed()}/>
      </div>

      {/* <button onClick={() => fetchMoreTweets()} className="bg-blue-500 text-white px-4 py-2 rounded-full">Load More</button> */}
    </div>
  );
};

export default MainPage;