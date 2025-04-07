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

interface Post {
  id: number;
  content: string;
  createdAt: string;
  created_at?: string;
  user: {
    id: number;
    username: string;
    name: string;
    avatar: string;
  };
  likes: {
    count: number;
    hasLiked: boolean;
    users: Array<{
      name: string;
      username: string;
      avatar: string;
    }>;
  };
  media: string[];
  replyCount: number;
  replies: Array<{
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      username: string;
      name: string;
      avatar: string;
    };
    likes: {
      count: number;
      hasLiked: boolean;
    };
  }>;
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
        response = await Posts.loadAllFollowedPosts(1);
      } else if (filter.includes('user')) {
        const username = filter.split('/')[1];
        console.log('Fetching tweets for user:', username);
        response = await Posts.loadUserPosts(username);
      } else {
        response = await Posts.loadAllPosts();
      }

      if (response && response.posts) {
        if (response.posts.length === 0) {
          setError('No posts found');
          return;
        }
        const formattedPosts = response.posts.map((post: Post) => ({
          ...post,
          createdAt: post.createdAt || post.created_at,
          likes: post.likes.count,
          hasLiked: post.likes.hasLiked,
          images: post.media,
          replyCount: post.replyCount || 0,
          replies: post.replies?.map(reply => ({
            ...reply,
            likes: reply.likes.count,
            hasLiked: reply.likes.hasLiked
          })) || []
        }));
        setTweets(formattedPosts);
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
        response = await Posts.loadFollowedPostsByPage(page + 1);
      } else {
        response = await Posts.loadPostsByPage(page + 1);
      }

      if (response && response.posts) {
        const formattedPosts = response.posts.map((post: Post) => ({
          ...post,
          createdAt: post.createdAt || post.created_at,
          likes: post.likes.count,
          hasLiked: post.likes.hasLiked,
          images: post.media,
          replyCount: post.replyCount || 0,
          replies: post.replies?.map(reply => ({
            ...reply,
            likes: reply.likes.count,
            hasLiked: reply.likes.hasLiked
          })) || []
        }));
        setTweets((prevTweets) => [...prevTweets, ...formattedPosts]);
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

  const isUserAuthor = (tweet: Post) => {
    const currentUsername = localStorage.getItem('username');
    return currentUsername === tweet.user.username;
  };

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
        <Tweet
          key={tweet.id}
          id={tweet.id}
          content={tweet.content}
          createdAt={tweet.createdAt}
          user={tweet.user}
          likes={tweet.likes}
          hasLiked={tweet.hasLiked}
          replyCount={tweet.replyCount}
          images={tweet.images}
          replies={tweet.replies}
          onLike={reloadParent}
          onDelete={reloadParent}
        />
      ))}
    </div>
  );
};

export default TweetFeed;