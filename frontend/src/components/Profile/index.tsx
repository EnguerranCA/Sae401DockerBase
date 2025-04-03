import Users from '../../data/data-users';
import TweetFeed from '../Feed/TweetFeed';
import ProfileImageEdit from '../../ui/Avatar/ProfileImageEdit';
import BannerImageEdit from '../../ui/Avatar/BannerImageEdit';
import FollowButton from '../../ui/Buttons/FollowButton';

interface ProfilePageProps {
    user: {
        id: number;
        username: string;
        name: string;
        bio: string;
        avatar: string;
        banner: string;
        isFollowed: boolean;
    };

};

const ProfilePage = ({ user }: ProfilePageProps) => {
    const isUserAuthor = localStorage.getItem('username') === user.username;

    return (
        <div className="flex flex-col items-center w-full border border-lightborder md:w-1/3">
            <div className="relative flex flex-col items-center w-full border border-lightborder">
                <div className='h-32 object-cover w-full relative'>
                    <img src={`http://localhost:8080/uploads/banners/${user.banner}`} alt="Banner" className="h-32 w-full object-cover" />
                    <div className="absolute bottom-2 right-2">
                        <BannerImageEdit />
                    </div>
                </div>
                <img src={`http://localhost:8080/uploads/avatars/${user.avatar}`} alt="Avatar" className="w-24 h-24 rounded-full -mt-12 mb-4 border-4 border-white z-10" />
                <ProfileImageEdit />
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-gray-500 text-center mt-2">{user.bio}</p>

                <div className="flex gap-2 mt-4">
                    {!isUserAuthor && (
                        <FollowButton
                            className="ml-auto"
                            hasFollow={user.isFollowed}
                            onClick={(hasFollow) => {
                                // Handle follow/unfollow logic here
                                if (hasFollow) {
                                    Users.followUser(user.username);

                                } else {
                                    Users.unfollowUser(user.username);

                                }
                            }}
                            username={user.username}
                        />)}

                </div>

            </div>
            <div className="w-full mt-4">
                <TweetFeed key={user.id} filter={"user/" + user.username} refreshTweets={() => { }} />
            </div>

        </div>
    );
}
export default ProfilePage;