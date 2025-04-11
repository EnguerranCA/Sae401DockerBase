import UserList from "./UserList";

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center w-full border md:w-1/3">
            <UserList />
        </div>
    );
}

export default Dashboard;