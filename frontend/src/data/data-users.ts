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
    getUserInfoByUsername: async (username: string) => {
        try {
            const user = await getRequest('http://localhost:8080/api/users/' + username);
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
        localStorage.removeItem('username');
        
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
    },
    followUser: async (username: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await postRequests('http://localhost:8080/api/users/' + username + '/follow', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        }
        catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    },
    unfollowUser: async (username: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await postRequests('http://localhost:8080/api/users/' + username + '/unfollow' , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        }
        catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    },
    // Profile
    updateImage: async (image: File) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', image);
            const response = await postRequests('http://localhost:8080/api/users/avatar',  {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }, formData);
            return response;
        }
        catch (error) {
            console.error('Error updating image:', error);
            throw error;
        }
    },
    updateBanner: async (image: File) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('banner', image);
            const response = await postRequests('http://localhost:8080/api/users/banner',  {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }, formData);
            return response;
        }
        catch (error) {
            console.error('Error updating banner:', error);
            throw error;
        }
    }


};

export default Users;