import { getRequest, postRequests } from "../lib/utils";
import { config } from '../config/config';

const { API_URL } = config;

const Posts = {
    loadAllPosts: async () => {
        try {
            const posts = await getRequest(`${API_URL}/api/posts`);
            return posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            throw error;
        }
    },

    loadPostsByPage: async (page: number) => {
        try {
            const posts = await getRequest(`${API_URL}/api/posts?page=${page}`);
            return posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            throw error;
        }
    },

    createOnePost: async (content: string) => {
        try {
            const apiToken = localStorage.getItem('apiToken');
            let formData = new FormData();
            formData.append('content', content);

            console.log('FormData:', Array.from(formData.entries()));

            const response = await postRequests(`${API_URL}/api/posts`, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                }
            }, formData);
            return response;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },
};

export default Posts;