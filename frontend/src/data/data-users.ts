import { getRequest, postRequests, patchRequest } from "../lib/utils";
import { config } from '../config/config';

const { API_URL } = config;

interface User {
    id: number;
    username: string;
    name: string;
    bio?: string;
    website?: string;
    avatar?: string;
    banner?: string;
    isReadOnly?: boolean;
    isPrivate?: boolean;
}

const Users = {
    getUserInfo: async (userId: number) => {
        try {
            const user = await getRequest(`${API_URL}/users/${userId}`);
            return user;
        }
        catch (error) {
            console.error('Error loading user:', error);
            throw error;
        }
    },
    getUserInfoByUsername: async (username: string) => {
        try {
            const user = await getRequest(`${API_URL}/api/users/${username}`);
            return user;
        }
        catch (error) {
            console.error('Error loading user:', error);
            throw error;
        }
    },
    getCurrentUserInfo: async () => {
        try {
            const user = await getRequest(`${API_URL}/api/me`);
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
            const response = await postRequests(`${API_URL}/resend`, { username });
            return response;
        }
        catch (error) {
            console.error('Error resending verification:', error);
            throw error;
        }
    },
    getAllUsers: async () => {
        try {
            const users = await getRequest(`${API_URL}/api/admin/users`);
            return users;
        }
        catch (error) {
            console.error('Error loading users:', error);
            throw error;
        }
    },
    getUserInfoAdmin: async (username: string) => {
        try {
            const user = await getRequest(`${API_URL}/api/admin/users/${username}`);
            return user;
        }
        catch (error) {
            console.error('Error loading user:', error);
            throw error;
        }
    },
    followUser: async (username: string) => {
        try {
            const response = await postRequests(`${API_URL}/api/users/${username}/follow`, {});
            return response;
        }
        catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    },
    unfollowUser: async (username: string) => {
        try {
            const response = await postRequests(`${API_URL}/api/users/${username}/unfollow`, {});
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
            const formData = new FormData();
            formData.append('avatar', image);
            const response = await postRequests(`${API_URL}/api/users/avatar`, formData);
            return response;
        }
        catch (error) {
            console.error('Error updating image:', error);
            throw error;
        }
    },
    updateBanner: async (image: File) => {
        try {
            const formData = new FormData();
            formData.append('banner', image);
            const response = await postRequests(`${API_URL}/api/users/banner`, formData);
            return response;
        }
        catch (error) {
            console.error('Error updating banner:', error);
            throw error;
        }
    },
    updateUserInfo: async (data: Partial<User>) => {
        try {
            const response = await patchRequest(`${API_URL}/api/me`, data);
            return response;
        }
        catch (error) {
            console.error('Error updating user info:', error);
            throw error;
        }
    },
    blockUser: async (username: string) => {
        try {
            const response = await postRequests(`${API_URL}/api/users/${username}/block`, {});
            return response;
        }
        catch (error) {
            console.error('Error blocking user:', error);
            throw error;
        }
    },
    unblockUser: async (username: string) => {
        try {
            const response = await postRequests(`${API_URL}/api/users/${username}/unblock`, {});
            return response;
        }
        catch (error) {
            console.error('Error unblocking user:', error);
            throw error;
        }
    }
};

export default Users;