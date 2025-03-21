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


    // createOnePost: async (content: string) => {
    //     try {
    //         const response = await postRequests('http://localhost:8080/posts?content=' + content);
    //         return response;
    //     } catch (error) {
    //         console.error('Error creating post:', error);
    //         throw error;
    //     }
    // }
};

export default Users;