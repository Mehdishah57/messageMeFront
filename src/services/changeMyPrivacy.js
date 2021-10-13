import axios from 'axios';

const changeMyPrivacy = async(params) => {
  try {
    axios.defaults.baseURL = process.env.REACT_APP_localServer;
    const { data } = await axios.post("api/users/privacy",{params},{headers:{messageMeToken:localStorage.getItem("JWT_messageME")}})
    return {data, error:null}
  } catch (error) {
    return {data:null, error}
  }
}

export default changeMyPrivacy
