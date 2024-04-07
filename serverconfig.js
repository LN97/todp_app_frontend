const env = 'prod';
const devUrl = 'http://localhost:5000';
const prodUrl = 'https://todo-js-b4e218e142e2.herokuapp.com';


export const apiUrl = env == 'dev' ? devUrl : prodUrl;

