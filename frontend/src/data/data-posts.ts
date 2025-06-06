import { getRequest, postRequests, deleteRequest } from "../lib/utils";

const Posts = {
    loadAllPosts: async () => {
        try {
            const posts = await getRequest('http://localhost:8080/api/posts');
            return posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            throw error;
        }
    },
    loadAllFollowedPosts: async (page: number) => {
        try {
            const posts = await getRequest(`http://localhost:8080/api/posts?page=${page}&filter=follow`);
            return posts;
        } catch (error) {
            console.error('Error loading followed posts:', error);
            throw error;
        }
    },
    loadUserPosts: async (username: string) => {
        try {
            const posts = await getRequest(`http://localhost:8080/api/posts/user/${username}`);
            return posts;
        } catch (error) {
            console.error('Error loading user posts:', error);
            throw error;
        }
    },
    loadPostsByPage: async (page: number) => {
        try {
            const posts = await getRequest(`http://localhost:8080/api/posts?page=${page}`);
            return posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            throw error;
        }
    },
    loadFollowedPostsByPage: async (page: number) => {
        try {
            const posts = await getRequest(`http://localhost:8080/api/posts?page=${page}&filter=follow`);
            return posts;
        } catch (error) {
            console.error('Error loading followed posts:', error);
            throw error;
        }
    },
    createOnePost: async (content: string, username: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await postRequests('http://localhost:8080/api/posts?content=' + content + '&username=' + username, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },
    likeOnePost: async (postId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await postRequests('http://localhost:8080/api/posts/' + postId + '/like', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    },
    unlikeOnePost: async (postId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await postRequests('http://localhost:8080/api/posts/' + postId + '/unlike', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            console.error('Error unliking post:', error);
            throw error;
        }
    },
    deleteOnePost: async (postId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await deleteRequest('http://localhost:8080/api/posts/' + postId);
            return response;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }

};

export default Posts;