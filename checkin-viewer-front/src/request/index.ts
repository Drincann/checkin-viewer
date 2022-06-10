import Axios from 'axios';
export default Axios.create({
  baseURL: `${window.location.protocol}//${window.location.host}`,
})