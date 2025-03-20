import { getRequest, postRequests } from "../lib/utils";

const Posts = {
    loadAllPosts: async () => {
        try {
            const posts = await getRequest('http://localhost:8080/posts');
            return posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            throw error;
        }
    },

    loadPostsByPage: async (page: number) => {
        try {
            const posts = await getRequest(`http://localhost:8080/posts?page=${page}`);
            return posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            throw error;
        }
    },

    createOnePost: async (content: string, username: string) => {
        try {
            const response = await postRequests('http://localhost:8080/posts?content=' + content + '&username=' + username);
            return response;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }
};

export default Posts;