import axios from "axios";

const BASE_API_URL = "http://localhost:8080/api/v1/data";
class DataService {
  saveData = (data) => {
    return axios.post(BASE_API_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  getData = () => {
    return axios.get(BASE_API_URL);
  };
  deleteData = (id) => {
    return axios.delete(`${BASE_API_URL}/${id}`);
  };
  getDataById = async (id) => {
    return await axios.get(`${BASE_API_URL}/${id}`);
  };
  deletePage = async (templateId, pageId) => {
    return await axios.delete(`${BASE_API_URL}/deletePage`, {
      data: {
        templateId,
        pageId,
      },
    });
  };
  duplicateData = async (id) => {
    return await axios.post(`${BASE_API_URL}/duplicate/${id}`);
  };
  getOptionsFromApi = async(apiLink) => {
    return await axios.get(apiLink).then((res) => res.json());
  }
  saveResponse = async (data) => {
    // const token = localStorage.getItem("token");
    // if (!token) throw new Error("No token provided!");
    // return await axios.put(
    //   `${BASE_API_URL}/saveResponse`,
    //   data,
    //   {
    //     headers: { Authorization: `Bearer ${token}`, "Content-Type":
    //     "multipart/form-data" }
    //     }
    //     );
    return await axios.post(`${BASE_API_URL}/response`, data, {
      headers: { "Content-Type": "application/json" },
    });
  };
}

export default new DataService();
