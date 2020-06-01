import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We area on the server
    const uri = `http://${process.env.AUTH_SRV_SERVICE_HOST}:${process.env.AUTH_SRV_SERVICE_PORT}`
    return axios.create({
      baseURL: uri,
      headers: req.headers
    });
  } else {
    return axios.create({
      baseURL: '/'
    })
  }
};