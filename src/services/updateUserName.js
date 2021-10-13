import axios from 'axios';

const updateUserName = async(name) => {
  try {
    axios.defaults.baseURL = process.env.REACT_APP_localServer
    const { data } = await axios.post(`api/users/name`,{name},{headers:{messageMeToken:localStorage.getItem("JWT_messageME")}});
    return {data, error:null};
  } catch (error) {
    return {error, data:null};
  } 
}

export default updateUserName;