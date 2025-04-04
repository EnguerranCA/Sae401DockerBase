import Users from '../../data/data-users';
import TweetFeed from '../Feed/TweetFeed';
import ProfileHeader from './ProfileHeader';

interface ProfilePageProps {
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

};

const ProfilePage = ({ user }: ProfilePageProps) => {
    const isUserAuthor = localStorage.getItem('username') === user.username;

    return (
        <div className="flex flex-col items-center w-full border border-lightborder md:w-1/3">
            <ProfileHeader user={user} />
            <div className="w-full mt-4">
                <TweetFeed key={user.id} filter={"user/" + user.username} refreshTweets={() => { }} />
            </div>

        </div>
    );
}
export default ProfilePage;