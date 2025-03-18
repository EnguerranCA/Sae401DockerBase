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
    }
};

export default Posts;