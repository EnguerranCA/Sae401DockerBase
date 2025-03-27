import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import Posts from '../../data/data-posts';
import ReloadButton from '../../ui/Buttons/ReloadButton';

// Save the current page number
let page = 1;

interface TweetFeedProps {
  refreshTweets: () => void;
}

const TweetFeed: React.FC<TweetFeedProps> = ({ refreshTweets }) => {
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
      const response = await Posts.loadAllPosts();
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
      const response = await Posts.loadPostsByPage(page + 1);
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
  }, [key]); // Add `key` as a dependency to re-fetch tweets when it changes

  return (
    <div id='tweetFeed' className="flex flex-col items-center w-full relative">
      {error && <div className="text-red-500 font-bold">{error}</div>}
      <ReloadButton
        key={key}
        reloadParent={reloadParent}
        text="Reload"
        className="bg-blue-500 text-white px-4 py-2 rounded-full absolute w-min"
      />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} user={tweet.user} message={tweet.content} />
      ))}
    </div>
  );
};

export default TweetFeed;