import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import Posts from '../../data/data-posts';
import ReloadButton from '../../ui/Buttons/ReloadButton';
import FeedSwitch from './FeedSwitch';

// Save the current page number
let page = 1;

interface TweetFeedProps {
  refreshTweets: () => void;
  filter: string; // Added the filter property
}

const TweetFeed: React.FC<TweetFeedProps> = ({ refreshTweets, filter }) => {
  // Reload state
  const [key, setKey] = useState(0);

  const reloadParent = () => {
    setKey((prevKey) => prevKey + 1); // Increment the key to force re-render
    refreshTweets(); // Call the refreshTweets prop
  };

  const [tweets, setTweets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTweets = async () => {
    try {
      let response;
      if (filter === 'follow') {
        response = await Posts.loadAllFollowedPosts(1); // Load tweets from followed users
      } else {
        response = await Posts.loadAllPosts(); // Load all tweets
      }

      if (response && response.posts) {
        if (response.posts.length === 0) {
          setError('No posts found');
          return;
        }
        setTweets(response.posts);
      } else {
        setError('No posts found');
      }
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    }
  };

  const fetchMoreTweets = async () => {
    try {
      let response;
      if (filter === 'follow') {
        response = await Posts.loadFollowedPostsByPage(page + 1); // Load more tweets from followed users
      } else {
        response = await Posts.loadPostsByPage(page + 1); // Load more tweets
      }

      if (response && response.posts) {
        setTweets((prevTweets) => [...prevTweets, ...response.posts]);
        page++;
      } else {
        setError('No more posts found');
      }
    } catch (err) {
      setError('Failed to fetch more posts');
      console.error(err);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      fetchMoreTweets();
    }
  };

  useEffect(() => {
    fetchTweets();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [key, filter]); // Add `filter` as a dependency to re-fetch tweets when it changes

  return (
    <div id="tweetFeed" className="flex flex-col items-center w-full relative">
      {error && <div className="text-red-500 font-bold">{error}</div>}
      <ReloadButton
        key={key}
        reloadParent={reloadParent}
        text="Reload"
        className="bg-blue-500 text-white px-4 py-2 rounded-full absolute w-min"
      />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} user={tweet.user} message={tweet.content} likes={tweet.likes.count} hasLiked={tweet.likes.hasLiked} id={tweet.id} />
      ))}
    </div>
  );
};

export default TweetFeed;