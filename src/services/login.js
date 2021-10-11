import axios from 'axios';

const login = async (user) => {
  axios.defaults.baseURL = process.env.REACT_APP_localServer
  const result = await axios.post(`api/users/login`, user);
  return result;
}

const signup = async (user) => {
  axios.defaults.baseURL = process.env.REACT_APP_localServer
  const result = await axios.post(`api/users/signup`, user);
  return result;
}

export default login;
export {
  signup
}