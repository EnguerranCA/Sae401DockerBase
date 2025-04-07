import ProfileButton from '../../ProfileButton';

interface ProfileSectionProps {
  currentUser: any;
}

const ProfileSection = ({ currentUser }: ProfileSectionProps) => {
  return (
    <div className="flex flex-col items-center mt-4 md:flex-row md:mt-0">
      {currentUser && (
        <ProfileButton
          user={currentUser}
          className="w-10 h-10"
        />
      )}
    </div>
  );
};

export default ProfileSection; 