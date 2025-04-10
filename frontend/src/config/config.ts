export const config = {
    API_URL: import.meta.env.VITE_API_URL,
    UPLOADS_URL: import.meta.env.VITE_API_URL + '/uploads'
} as const;
