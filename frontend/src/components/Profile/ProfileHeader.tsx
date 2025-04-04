import Users from '../../data/data-users';
import TweetFeed from '../Feed/TweetFeed';
import ProfileImageEdit from '../../ui/Avatar/ProfileImageEdit';
import BannerImageEdit from '../../ui/Avatar/BannerImageEdit';
import FollowButton from '../../ui/Buttons/FollowButton';
import BlockButton from '../../ui/Buttons/BlockButton';
import SubmitButton from '../../ui/Buttons/SubmitButton';
import { useState, useEffect } from 'react';
import Avatar from '../../ui/Avatar';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
    user: {
        id: number;
        username: string;
        name: string;
        bio: string;
        avatar: string;
        banner: string;
        website: string;
        location: string;
        isFollowed: boolean;
        isBlocked: boolean;
    };
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    const isUserAuthor = localStorage.getItem('username') === user.username;
    const [isBlocked, setIsBlocked] = useState(user.isBlocked);
    const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
    const [showBlockedUsers, setShowBlockedUsers] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            try {
                const currentUser = await Users.getCurrentUserInfo();
                if (currentUser && currentUser.blockedUsers) {
                    setBlockedUsers(currentUser.blockedUsers);
                }
            } catch (error) {
                console.error('Error fetching blocked users:', error);
            }
        };
        if (isUserAuthor) {
            fetchBlockedUsers();
        }
    }, [isUserAuthor, isBlocked]);

    const handleUserClick = (username: string) => {
        navigate(`/profile/${username}`);
    };

    return (
        <div className="relative flex flex-col items-center w-full border border-lightborder">
            <div className='h-32 object-cover w-full relative'>
                <img src={`http://localhost:8080/uploads/banners/${user.banner}`} alt="Banner" className="h-32 w-full object-cover" />
                <div className="absolute bottom-2 right-2">
                    {isUserAuthor && <BannerImageEdit />}
                </div>
            </div>
            <img src={`http://localhost:8080/uploads/avatars/${user.avatar}`} alt="Avatar" className="w-24 h-24 rounded-full -mt-12 mb-4 border-4 border-white z-10" />
            {isUserAuthor && <ProfileImageEdit />}

            {/* Info */}
            <div className="text-center mt-4">
                {isUserAuthor ? (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const updatedData = {
                                name: formData.get('name') as string,
                                bio: formData.get('bio') as string,
                                website: formData.get('website') as string,
                                location: formData.get('location') as string,
                            };
                            try {
                                await Users.updateUserInfo(updatedData);
                                alert('Profile updated successfully!');
                                window.location.reload();
                            } catch (error) {
                                console.error('Error updating profile:', error);
                                alert('Failed to update profile.');
                            }
                        }}
                    >
                        <div className={`mb-6 relative border rounded-md pt-2 ${user.name ? 'text-primary' : ''}`}>
                            <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                defaultValue={user.name}
                                placeholder="Name"
                                className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
                            />
                        </div>
                        <div className={`mb-6 relative border rounded-md pt-2 ${user.username ? 'text-primary' : ''}`}>
                            <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                defaultValue={user.username}
                                placeholder="Username"
                                className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
                            />
                        </div>
                        <div className={`mb-6 relative border rounded-md pt-2 ${user.bio ? 'text-primary' : ''}`}>
                            <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="bio">Bio</label>
                            <textarea
                                name="bio"
                                id="bio"
                                defaultValue={user.bio}
                                placeholder="Bio"
                                className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
                            />
                        </div>
                        <div className={`mb-6 relative border rounded-md pt-2 ${user.website ? 'text-primary' : ''}`}>
                            <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="website">Website</label>
                            <input
                                type="text"
                                name="website"
                                id="website"
                                defaultValue={user.website}
                                placeholder="Website"
                                className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
                            />
                        </div>
                        <div className={`mb-6 relative border rounded-md pt-2 ${user.location ? 'text-primary' : ''}`}>
                            <label className="absolute left-2 text-gray-700 text-xs font-bold" htmlFor="location">Location</label>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                defaultValue={user.location}
                                placeholder="Location"
                                className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:border-primary mt-4"
                            />
                        </div>
                        <SubmitButton variant='primary' text="Update Profile" className="w-full" />
                    </form>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold">{user.name}</h2>
                        <p className="text-gray-500">@{user.username}</p>
                        <p className="text-gray-600 mt-2">{user.bio}</p>
                        {user.website && (
                            <a
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline mt-2 block"
                            >
                                {user.website}
                            </a>
                        )}

                        {user.location && (
                            <p className="text-gray-500 mt-2">
                                <i className="fas fa-map-marker-alt mr-2"></i>
                                {user.location}
                            </p>
                        )}
                    </>
                )}
            </div>

            <div className="flex gap-2 mt-4">
                {!isUserAuthor && (
                    <>
                        <FollowButton
                            className="ml-auto"
                            hasFollow={user.isFollowed}
                            onClick={(hasFollow) => {
                                if (hasFollow) {
                                    Users.followUser(user.username);
                                } else {
                                    Users.unfollowUser(user.username);
                                }
                            }}
                            username={user.username}
                        />
                        <BlockButton
                            hasBlock={isBlocked}
                            onClick={setIsBlocked}
                            username={user.username}
                        />
                    </>
                )}
            </div>

            {isUserAuthor && blockedUsers.length > 0 && (
                <div className="w-full mt-4 p-4 border-t">
                    <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => setShowBlockedUsers(!showBlockedUsers)}
                    >
                        {showBlockedUsers ? 'Hide Blocked Users' : `Show Blocked Users (${blockedUsers.length})`}
                    </button>
                    {showBlockedUsers && (
                        <div className="mt-2">
                            {blockedUsers.map((blockedUser) => (
                                <div key={blockedUser.id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                                    <div 
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={() => handleUserClick(blockedUser.username)}
                                    >
                                        <Avatar
                                            src={`http://localhost:8080/uploads/avatars/${blockedUser.avatar}`}
                                            alt={blockedUser.name}
                                            size={32}
                                        />
                                        <div>
                                            <p className="font-semibold">{blockedUser.name}</p>
                                            <p className="text-gray-500">@{blockedUser.username}</p>
                                        </div>
                                    </div>
                                    <BlockButton
                                        hasBlock={true}
                                        onClick={setIsBlocked}
                                        username={blockedUser.username}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProfileHeader;