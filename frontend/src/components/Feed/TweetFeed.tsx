import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import Posts from '../../data/data-posts';
import ReloadButton from '../../ui/Buttons/ReloadButton';
import FeedSwitch from './FeedSwitch';

interface TweetFeedProps {
  refreshTweets: () => void;
  filter: string;
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
  const [key, setKey] = useState(0);
  const [tweets, setTweets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showReloadButton, setShowReloadButton] = useState(false);

  const reloadParent = () => {
    setKey((prevKey) => prevKey + 1);
    setPage(1);
    setHasMore(true);
    refreshTweets();
  };

  const fetchTweets = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      let response;
      if (filter === 'follow') {
        response = await Posts.loadFollowedPostsByPage(pageNum);
      } else if (filter.includes('user')) {
        const username = filter.split('/')[1];
        response = await Posts.loadUserPosts(username);
      } else {
        response = await Posts.loadPostsByPage(pageNum);
      }

      if (response && response.posts) {
        if (response.posts.length === 0) {
          if (pageNum === 1) {
            setError('No posts found');
          } else {
            setHasMore(false);
          }
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
        
        if (pageNum === 1) {
          setTweets(formattedPosts);
        } else {
          setTweets((prevTweets) => [...prevTweets, ...formattedPosts]);
        }
      } else {
        if (pageNum === 1) {
          setError('No posts found');
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
    const documentHeight = document.documentElement.offsetHeight;
    const scrollThreshold = window.innerHeight * 3; // 2 pages de défilement

    // Afficher le bouton après 2 pages de défilement
    if (scrollPosition > scrollThreshold) {
      setShowReloadButton(true);
    } 

    // Charger plus de tweets
    if (scrollPosition >= documentHeight - 20 && !isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchTweets(page);
  }, [page, filter]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  const isUserAuthor = (tweet: Post) => {
    const currentUsername = localStorage.getItem('username');
    return currentUsername === tweet.user.username;
  };

  return (
    <div id="tweetFeed" className="flex flex-col items-center w-full relative">
      {error && <div className="text-red-500 font-bold">{error}</div>}
      {showReloadButton && (
        <ReloadButton
          key={key}
          reloadParent={reloadParent}
          text="Reload"
          className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200 z-50 shadow-lg"
        />
      )}
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
      {isLoading && <div className="text-gray-500 py-4">Loading more tweets...</div>}
    </div>
  );
};

export default TweetFeed;