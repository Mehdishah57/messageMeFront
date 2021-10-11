import axios from 'axios';

const getSearchResults = async (value, pageNumber, pageSize) => {
  axios.defaults.baseURL = process.env.REACT_APP_localServer
  const URL = `api/users`;
  const ENDPOINT = "/search";
  const { data } = await axios.post(URL + ENDPOINT, { value, pageNumber, pageSize },{headers:{messageMeToken:localStorage.getItem('JWT_messageME')}})
    .catch(err => alert("Inform Web Developer about Searching Error"));
  return data;
}

export default getSearchResults;