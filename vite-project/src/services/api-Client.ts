import axios,{CanceledError, AxiosError} from 'axios';

// Set config defaults when creating the instance
export default axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    //headers: {}
})

export {CanceledError, AxiosError}