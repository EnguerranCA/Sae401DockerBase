import React from 'react';
import Tweet from './Tweet';
import Posts from '../../data/data-posts';
import { useEffect, useState } from 'react';

const TweetFeed = () => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await Posts.loadAllPosts();
        if (response && response.posts) {
          setTweets(response.posts);
        } else {
          setError('No posts found');
        }
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      }
    };

    fetchTweets();
  }, []);
  
  return (
    <div className="space-y-4 flex flex-col items-center w-96">
      {error && <div className="text-red-500">{error}</div>}
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} username={`User ${tweet.id}`} message={tweet.content} />
      ))}
    </div>
  );
};

export default TweetFeed;