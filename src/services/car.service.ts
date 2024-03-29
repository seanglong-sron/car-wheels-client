import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Form {
  name: string;
  wheels: number;
}

export default {
  findByName: (name: string) => {
    return axios({
      baseURL: BASE_URL,
      url: `/api/cars/${name}`
    })
  },
  create: (form: Form) => {
    return axios({
      baseURL: BASE_URL,
      url: `/api/cars`,
      method: 'POST',
      data: form
    })
  },
  getAll: () => {
    return axios({
      baseURL: BASE_URL,
      url: `/api/cars`,
    })
  },
  getByWheels: (wheels: number) => {
    return axios({
      baseURL: BASE_URL,
      url: `/api/cars/wheels/${wheels}`,
    })
  }
}