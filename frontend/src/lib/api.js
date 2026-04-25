import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({ baseURL: BASE_URL });

export const getCategories = () => api.get('/categories').then(r => r.data);
export const getProducts = (params = {}) => api.get('/products', { params }).then(r => r.data);
export const getProduct = (slug) => api.get(`/products/${slug}`).then(r => r.data);
export const getBlogPosts = () => api.get('/blog').then(r => r.data);
export const getBlogPost = (slug) => api.get(`/blog/${slug}`).then(r => r.data);
export const getTestimonials = () => api.get('/testimonials').then(r => r.data);
export const postContact = (data) => api.post('/contacts', data).then(r => r.data);
export const postOrder = (data) => api.post('/orders', data).then(r => r.data);

export default api;
