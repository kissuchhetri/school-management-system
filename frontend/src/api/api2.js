// // import axios from 'axios';

// // // Axios instance for JSON requests with auth header
// // const Api = axios.create({
// //   baseURL: 'http://localhost:5008',
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // Axios instance for multipart/form-data (file uploads)
// // const ApiFormData = axios.create({
// //   baseURL: 'http://localhost:5008',
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'multipart/form-data',
// //   },
// // });

// // // Auth config with Authorization header
// // const authConfig = {
// //   headers: {
// //     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6MSwiZW1haWwiOiJrY2hoZXRyaTIwMDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUyMDM0NTU1LCJleHAiOjE3NTIwMzgxNTV9JC7LJIzBZ9rfKlNX3UMjz1TFNQiRjmmhLAkchhh0Gfs`
// //   }
// // };

// // // Students API
// // export const createstudents = (data) => Api.post('/api/createstudent/createstudent', data, authConfig);

// // // Teachers API (including optional image uploads)
// // // If you want to send multipart/form-data for teachers (image upload), you should use ApiFormData
// // export const createteacher = (data) => {
// //   // Check if data is FormData (for image upload)
// //   if (data instanceof FormData) {
// //     return ApiFormData.post('/api/createteacher/createteacher', data, authConfig);
// //   }
// //   // Otherwise send JSON
// //   return Api.post('/api/createteacher/createteacher', data, authConfig);
// // };

// // // User login
// // export const loginUserApi = (data) => Api.post('/api/login/login', data);

// // // Create user with form data (possibly file uploads)
// // export const createUser = (data) => ApiFormData.post('/api/users/createusers', data);

// // // Create product with form data (possibly file uploads)
// // export const createProduct = (data) => ApiFormData.post('/api/users/createproduct', data);




// // // api/api.js
// // import axios from 'axios';

// // // Base Axios instance
// // const ApiFormData = axios.create({
// //   baseURL: 'http://localhost:5008/api', // adjust if your baseURL is different
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'multipart/form-data',
// //   },
// // });

// // // Attach token to every request
// // ApiFormData.interceptors.request.use((config) => {
// //   const token = localStorage.getItem('token'); // or sessionStorage
// //   if (token) {
// //     config.headers['Authorization'] = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // // API function
// // export const createTeacherApi = (formData) => {
// //   return ApiFormData.post('/teachers', formData);
// // };


// // src/api/api.js
// // import axios from 'axios';

// // // === BASE URL ===
// // const BASE_URL = 'http://localhost:5008';

// // // === JSON API instance ===
// // const Api = axios.create({
// //   baseURL: BASE_URL,
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // === FormData API instance ===
// // const ApiFormData = axios.create({
// //   baseURL: BASE_URL,
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'multipart/form-data',
// //   },
// // });

// // // === Attach token from localStorage ===
// // const attachToken = (config) => {
// //   const token = localStorage.getItem('token');
// //   if (token) {
// //     config.headers['Authorization'] = `Bearer ${token}`;
// //   }
// //   return config;
// // };

// // // Apply interceptor to both instances
// // Api.interceptors.request.use(attachToken);
// // ApiFormData.interceptors.request.use(attachToken);

// // // ========== API FUNCTIONS ==========

// // // Create Teacher (with or without photo)
// // export const createteacher = (data) => {
// //   if (data instanceof FormData) {
// //     return ApiFormData.post('/api/createteacher/createteacher', data);
// //   }
// //   return Api.post('/api/createteacher/createteacher', data);
// // };

// // // Create Student
// // export const createstudents = (data) =>
// //   Api.post('/api/createstudent/createstudent', data);

// // // Login
// // export const loginUserApi = (data) =>
// //   Api.post('/api/login/login', data);

// // // Create User (with FormData)
// // export const createUser = (data) =>
// //   ApiFormData.post('/api/users/createusers', data);

// // // Create Product (with FormData)
// // export const createProduct = (data) =>
// //   ApiFormData.post('/api/users/createproduct', data);




// import axios from 'axios';

// // === BASE URL ===
// const BASE_URL = 'http://localhost:5008';

// // === JSON API instance ===
// const Api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // === FormData API instance ===
// const ApiFormData = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// });

// // === Automatically attach token from localStorage ===
// const attachToken = (config) => {
//   const token = localStorage.getItem('token'); // or sessionStorage
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// };

// // Apply interceptors to both instances
// Api.interceptors.request.use(attachToken);
// ApiFormData.interceptors.request.use(attachToken);

// // ========== API FUNCTIONS ==========

// // Create Teacher (handles both JSON and FormData)
// export const createteacher = (data) => {
//   return data instanceof FormData
//     ? ApiFormData.post('/api/createteacher/createteacher', data)
//     : Api.post('/api/createteacher/createteacher', data);
// };

// // Create Student
// export const createstudents = (data) =>
//   Api.post('/api/createstudent/createstudent', data);

// // Login
// export const loginUserApi = (data) =>
//   Api.post('/api/login/login', data);

// // Create User (with FormData)
// export const createUser = (data) =>
//   ApiFormData.post('/api/users/createusers', data);

// // Create Product (with FormData)
// export const createProduct = (data) =>
//   ApiFormData.post('/api/users/createproduct', data);

