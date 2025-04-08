import { useState, useEffect } from 'react';
import Users from '../data/data-users';

export default function Settings() {
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const user = await Users.getCurrentUserInfo();
        setCurrentUser(user);
        setIsReadOnly(user.isReadOnly || false);
        setIsPrivate(user.isPrivate || false);
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchUserSettings();
  }, []);

  const handleReadOnlyChange = async () => {
    try {
      const newValue = !isReadOnly;
      await Users.updateUserInfo({ isReadOnly: newValue });
      setIsReadOnly(newValue);
    } catch (error) {
      console.error('Error updating read-only setting:', error);
    }
  };

  const handlePrivateChange = async () => {
    try {
      const newValue = !isPrivate;
      await Users.updateUserInfo({ isPrivate: newValue });
      setIsPrivate(newValue);
    } catch (error) {
      console.error('Error updating private setting:', error);
    }
  };

  return (
    <div className="max-w-1/3 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div>
            <h2 className="text-lg font-semibold">Read-Only Mode</h2>
            <p className="text-gray-600">When enabled, no one can comment or reply to your posts.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isReadOnly}
              onChange={handleReadOnlyChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div>
            <h2 className="text-lg font-semibold">Private Account</h2>
            <p className="text-gray-600">When enabled, only approved followers can see your posts.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isPrivate}
              onChange={handlePrivateChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
} 