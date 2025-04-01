import Users from '../../data/data-users';
import TweetFeed from '../Feed/TweetFeed';

interface ProfilePageProps {
    user: {
        id: number;
        username: string;
        name: string;
        bio: string;
        avatar: string;
        banner: string;
    };
};

const ProfilePage = ({ user }: ProfilePageProps) => {
    return (
        <div className="flex flex-col items-center w-full border border-lightborder md:w-1/3">
            <div className="flex flex-col items-center w-full border border-lightborder">
                <img src={user.banner} alt="Banner" className="w-full h-32 object-cover" />
                <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full -mt-12 mb-4 border-4 border-white" />
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-gray-500 text-center mt-2">{user.bio}</p>
            </div>
            <div className="w-full mt-4">
                <TweetFeed key={user.id} filter={"user/" + user.username} refreshTweets={() => { }} />
            </div>
        </div>
    );
}
export default ProfilePage;