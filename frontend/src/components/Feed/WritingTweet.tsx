import Avatar from '../../ui/Avatar';
import React, { useState } from 'react';
import Posts from '../../data/data-posts';

interface WritingTweetProps {
  refreshTweets: () => void;
  user: {
    avatar: string;
    name: string;
    username: string;
  };
  className?: string;
}

const WritingTweet = ({ refreshTweets, user }: WritingTweetProps) => {
  const [tweet, setTweet] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleTweetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tweetText = e.target.value;
    if (tweetText.length <= 280) {
      setTweet(tweetText);
      setCharCount(tweetText.length);
    }
  };

  const handlePostTweet = async () => {
    try {
      await Posts.createOnePost(tweet, user.username);
      setTweet('');
      setCharCount(0);
      refreshTweets(); // Call the function to refresh the feed
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="writing-tweet rounded-lg p-4 w-full mx-auto bg-white">
      <div className="flex items-start">
        <Avatar src={`http://localhost:8080/uploads/avatars/${user.avatar}`} alt={user.username} size={64} />
        <textarea
          value={tweet}
          onChange={handleTweetChange}
          placeholder="What's happening?"
          rows={4}
          className="w-full p-2 rounded-lg focus:outline-hidden"
        />
      </div>
      <div className="tweet-footer flex justify-between items-center mt-2">
        <span className={`text-gray-500 ${charCount > 260 && charCount < 280 ? 'text-orange-500' : ''} ${charCount === 280 ? 'text-red-500' : ''}`}>{charCount}/280</span>
        <button
          onClick={handlePostTweet}
          disabled={charCount === 0}
          className={`px-4 py-2 rounded-full text-white ${charCount === 0 ? 'bg-gray-400' : 'bg-primary hover:bg-primary-hover'}`}
        >
          Tweet
        </button>
      </div>
    </div>
  );
};

export default WritingTweet;
