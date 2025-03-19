import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import WritingTweet from './WritingTweet';
import Posts from '../../data/data-posts';

// Save the current page number
let page = 1;

const TweetFeed = () => {
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
  }, []);

  return (
    <div className="flex flex-col items-center w-1/3 border">
      {error && <div className="text-red-500">{error}</div>}
      <WritingTweet refreshTweets={() => fetchTweets()} />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} username={`User ${tweet.id}`} message={tweet.content} />
      ))}
      {/* <button onClick={() => fetchMoreTweets()} className="bg-blue-500 text-white px-4 py-2 rounded-full">Load More</button> */}
    </div>
  );
};

export default TweetFeed;