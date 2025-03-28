import { getRequest, postRequests } from "../lib/utils";


const Users = {
    getUserInfo: async (userId: number) => {
        try {
            const user = await getRequest('http://localhost:8080/users/' + userId);
            return user;
        }
        catch (error) {
            console.error('Error loading user:', error);
            throw error;
        }
    },
    getCurrentUserInfo: async () => {
        try {
            const user = await getRequest('http://localhost:8080/api/me');
            return user;
        }
        catch (error) {
            console.error('Error loading user:', error);
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('apiToken');
        
    },
    resendVerification: async (username: string) => {
        try {
            const response = await postRequests('http://localhost:8080/resend', { username });
            return response;
        }
        catch (error) {
            console.error('Error resending verification:', error);
            throw error;
        }
    },
    getAllUsers: async () => {
        try {
            const users = await getRequest('http://localhost:8080/api/admin/users');
            return users;
        }
        catch (error) {
            console.error('Error loading users:', error);
            throw error;
        }
    },
    getUserInfoAdmin: async (username: string) => {
        try {
            const user = await getRequest('http://localhost:8080/api/admin/users/' + username);
            return user;
        }
        catch (error) {
            console.error('Error loading user:', error);
            throw error;
        }
    }


};

export default Users;