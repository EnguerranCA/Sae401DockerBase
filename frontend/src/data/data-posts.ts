import { getRequest, postRequests, deleteRequest, patchRequest } from "../lib/utils";

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
    createOnePost: async (content: string, mediaFiles?: File[]) => {
        try {
            const apiToken = localStorage.getItem('apiToken');
            let formData = new FormData();
            formData.append('content', content);
            if (mediaFiles && mediaFiles.length > 0) {
                mediaFiles.forEach((file, index) => {
                    formData.append(`media[${index}]`, file);
                });
            }

            console.log('FormData:', Array.from(formData.entries()));
            

            const response = await postRequests('http://localhost:8080/api/posts', {
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
    likeOnePost: async (postId: number) => {
        try {
            const apiToken = localStorage.getItem('apiToken');
            const response = await postRequests('http://localhost:8080/api/posts/' + postId + '/like', {
                headers: {
                    Authorization: `Bearer ${apiToken}`
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
            const apiToken = localStorage.getItem('apiToken');
            const response = await postRequests('http://localhost:8080/api/posts/' + postId + '/unlike', {
                headers: {
                    Authorization: `Bearer ${apiToken}`
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
            const apiToken = localStorage.getItem('apiToken');
            const response = await deleteRequest('http://localhost:8080/api/posts/' + postId);
            return response;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    },
    updatePost: async (postId: number, content: string, mediaFiles?: string[]) => {
        try {
            const response = await patchRequest(`http://localhost:8080/api/posts/${postId}`, { content, mediaFiles });
            return response;
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    },
    async getReplies(postId: number): Promise<any[]> {
        try {
            const response = await getRequest(`http://localhost:8080/api/posts/${postId}/replies`);
            return response;
        } catch (error) {
            console.error('Error fetching replies:', error);
            throw error;
        }
    },
    async replyToTweet(postId: number, content: string): Promise<any> {
        try {
            const apiToken = localStorage.getItem('apiToken');
            const formData = new FormData();
            formData.append('content', content);
            
            const response = await postRequests(`http://localhost:8080/api/posts/${postId}/reply`, undefined, formData);
            return response;
        } catch (error) {
            console.error('Error posting reply:', error);
            throw error;
        }
    },
};

export default Posts;