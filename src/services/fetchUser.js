import axios from 'axios';

const fetchUserData = async user => {
  axios.defaults.baseURL = process.env.REACT_APP_localServer
  const { data } = await axios.post(`api/users`, user,{headers:{messageMeToken:localStorage.getItem('JWT_messageME')}})
    .catch(err => alert("Inform Developers regarding this error"));
  return data;
}

export default fetchUserData;
