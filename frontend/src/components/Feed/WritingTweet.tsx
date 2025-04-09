import Avatar from '../../ui/Avatar';
import React, { useState } from 'react';
import Posts from '../../data/data-posts';
import { config } from '../../config/config';

const { UPLOADS_URL } = config;

interface WritingTweetProps {
  refreshTweets: () => void;
  user: {
    avatar: string;
    name: string;
    username: string;
  };
  className?: string;
}

const WritingTweet: React.FC<WritingTweetProps> = ({ refreshTweets, user }) => {
  const [tweet, setTweet] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleTweetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tweetText = e.target.value;
    if (tweetText.length <= 280) {
      setTweet(tweetText);
      setCharCount(tweetText.length);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (mediaFiles.length + filesArray.length <= 4) {
        setMediaFiles([...mediaFiles, ...filesArray]);
      } else {
        alert('You can only upload up to 4 media files.');
      }
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handlePostTweet = async () => {
    try {
      
      await Posts.createOnePost(tweet, mediaFiles);
      setTweet('');
      setCharCount(0);
      setMediaFiles([]);
      refreshTweets(); // Call the function to refresh the feed
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex space-x-4">
        <Avatar
          src={`${UPLOADS_URL}/avatars/${user.avatar}`}
          alt={user.username}
          size={64}
        />
        <textarea
          value={tweet}
          onChange={handleTweetChange}
          placeholder="What's happening?"
          rows={4}
          className="w-full p-2 rounded-lg focus:outline-hidden"
        />
      </div>
      <div className="media-upload mt-2">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaChange}
          className="hidden"
          id="media-upload"
        />
        <label htmlFor="media-upload" className="cursor-pointer text-primary hover:underline">
          Add Media (up to 4)
        </label>
        <div className="media-preview flex mt-2 space-x-2">
          {mediaFiles.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`media-${index}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveMedia(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="tweet-footer flex justify-between items-center mt-2">
        <span
          className={`text-gray-500 ${
            charCount > 260 && charCount < 280 ? 'text-orange-500' : ''
          } ${charCount === 280 ? 'text-red-500' : ''}`}
        >
          {charCount}/280
        </span>
        <button
          onClick={handlePostTweet}
          disabled={charCount === 0 && mediaFiles.length === 0}
          className={`px-4 py-2 rounded-full text-white ${
            charCount === 0 && mediaFiles.length === 0
              ? 'bg-gray-400'
              : 'bg-primary hover:bg-primary-hover'
          }`}
        >
          Tweet
        </button>
      </div>
    </div>
  );
};

export default WritingTweet;
