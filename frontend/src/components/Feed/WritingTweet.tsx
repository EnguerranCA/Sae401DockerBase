import Avatar from '../../ui/Avatar';
import React, { useState } from 'react';
import Posts from '../../data/data-posts';

interface WritingTweetProps {
  refreshTweets: () => void;
}

const WritingTweet: React.FC<WritingTweetProps> = ({ refreshTweets }) => {
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
      await Posts.createOnePost(tweet);
      setTweet('');
      setCharCount(0);
      refreshTweets(); // Call the function to refresh the feed
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="writing-tweet border-gray-300 rounded-lg p-4 w-full mx-auto bg-white">
      <div className="flex items-start">
        <Avatar src="../src/assets/images/default_pp.png" alt="User Avatar" size={64} />
        <textarea
          value={tweet}
          onChange={handleTweetChange}
          placeholder="What's happening?"
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="tweet-footer flex justify-between items-center mt-2">
        <span className="text-gray-500">{charCount}/280</span>
        <button
          onClick={handlePostTweet}
          disabled={charCount === 0}
          className={`px-4 py-2 rounded-full text-white ${charCount === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Tweet
        </button>
      </div>
    </div>
  );
};

export default WritingTweet;
