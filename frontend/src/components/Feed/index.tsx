import React from 'react';
import Tweet from './Tweet';
import WritingTweet from './WritingTweet';
import Posts from '../../data/data-posts';
import { useEffect, useState } from 'react';

// Save the current page number
let page = 1;

const TweetFeed = () => {
  const [tweets, setTweets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch more tweets when the user clicks the Load More button
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

  useEffect(() => {
    fetchTweets();
  }, []);
  
  return (
    <div className="space-y-4 flex flex-col items-center w-2/3 max-w-xl">
      {error && <div className="text-red-500">{error}</div>}
      <WritingTweet refreshTweets={() => fetchTweets()} />
      {tweets.map((tweet) => (
      <Tweet key={tweet.id} username={`User ${tweet.id}`} message={tweet.content} />
      ))}
      <button onClick={() => fetchMoreTweets()} className="bg-blue-500 text-white px-4 py-2 rounded-full">Load More</button>
    </div>
  );
};

export default TweetFeed;