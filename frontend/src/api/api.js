// import axios from 'axios';
// const ApiFormData = axios.create({
//   baseURL: 'http://localhost:5008',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// });



// // const Api = axios.create({
// //   baseURL: 'http://localhost:5008',
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });


// // const loginUserApi = axios.create({
// //   baseURL: 'http://localhost:5008',
// //   withCredentials: true, // only needed if using cookies
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });



// const Api = axios.create({
//   baseURL: 'http://localhost:5008', // or your backend URL
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // const createStudent = axios.create({
// //   baseURL: 'http://localhost:5008', // or your backend URL
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'multipart/form-data',
// //   },
// // });


// const Apistudent = axios.create({
//   baseURL: 'http://localhost:5008',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// const config={
//   headers: {
//     'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6MSwiZW1haWwiOiJrY2hoZXRyaTIwMDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUyMDM0NTU1LCJleHAiOjE3NTIwMzgxNTV9JC7LJIzBZ9rfKlNX3UMjz1TFNQiRjmmhLAkchhh0Gfs` //
//   },  
  
// }

// export const createstudents = (data) => Apistudent.post('/api/createstudent/createstudent', data,config);


// const Apiteacher = axios.create({
//   baseURL: 'http://localhost:5008',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// const config={
//   headers: {
//     'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6MSwiZW1haWwiOiJrY2hoZXRyaTIwMDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUyMDM0NTU1LCJleHAiOjE3NTIwMzgxNTV9JC7LJIzBZ9rfKlNX3UMjz1TFNQiRjmmhLAkchhh0Gfs` }
// export const createteacher = (data) => Apiteacher.post('/api/createteacher/createteacher', data,config);






// export const loginUserApi = (data) => Api.post('/api/login/login', data);


// // export const loginUserApi = (data) => Api.post('/api/login/login', data);



// export const createUser = (data) => ApiFormData.post('/api/users/createusers', data);

// // export const Loginuser = (data) => Api.post('/user/login/login', data);
// // export const loginUserApi = (data) => {
// //   return  Api.post("api/login/login",data);
// // }

// // export const loginUserApi = (data) => Api.post('/api/login/login', data)
// export const createProduct = (data) => ApiFormData.post('/api/users/createproduct', data);




///second half///////



import axios from 'axios';


const Api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false, // Changed to false to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});


const ApiFormData = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false, // Changed to false to avoid CORS issues
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 10000, // 10 second timeout
});


const config = {
  headers: {
    'authorization': `Bearer ${localStorage.getItem('token') }`,
  },
};

// const Apistudent = axios.create({
//   baseURL: 'http://localhost:5008',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
export const createstudents = (data) => Api.post('/api/createstudent/createstudent', data, config);
export const getAllStudentsApi = () => Api.get('/api/createstudent/getallstudents',config);
export const getstudentcountApi = () => Api.get('/api/createstudent/getstudentcount', config);
export const getStudentCountForTeachersApi = () => Api.get('/api/createstudent/getstudentcountforteachers', config);
export const getStudentsByClassApi = (className) => Api.get(`/api/createstudent/getstudentsbyclass/${className}`, config);

// const Apiteacher = axios.create({
//   baseURL: 'http://localhost:5008',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
export const createUser = (data) => ApiFormData.post('/api/users/createusers', data);
export const addAnnouncementApi = (data) => Api.post('/api/announcement/addannouncements', data, config);
export const getAllAnnouncementsApi = () => Api.get('/api/announcement/getannouncements'); // No auth required
export const deleteAnnouncementApi = (id) => Api.delete(`/api/announcement/deleteannouncement/${id}`, config);


export const createTeacherApi = (data) => Api.post('/api/createteacher/createteacher', data, config);
export const getAllTeachersApi = () => Api.get('/api/createteacher/getallteachers', config);
export const getTeacherCountApi = () => Api.get('/api/createteacher/getteachercount', config);


export const AssignmentApi = (data) => Api.post('/api/assignment/add', data, config);
export const getAllAssignmentsApi = () => Api.get('/api/assignment/all',config);
export const deleteAssignmentApi = (id) => Api.delete(`/api/assignment/delete/${id}`, config);

// Attendance APIs
export const markAttendanceApi = (data) => Api.post('/api/assignment/attendance/mark', data, config);
export const getAttendanceByClassApi = (className, date) => Api.get(`/api/assignment/attendance/${className}/${date}`, config);


export const loginUserApi = (data) => Api.post('/api/login/login', data);

// Message APIs
export const sendMessageApi = (data) => Api.post('/api/message/send', data, config);
export const getStudentMessagesApi = () => Api.get('/api/message/student', config);
export const getAllMessagesApi = () => Api.get('/api/message/all', config);
export const getMessageCountApi = () => Api.get('/api/message/count', config);
export const markMessageAsReadApi = (id) => Api.put(`/api/message/read/${id}`, {}, config);
export const respondToMessageApi = (id, response) => Api.put(`/api/message/respond/${id}`, { response }, config);

// Test API connection
export const testApiConnection = () => Api.get('/api/test');

