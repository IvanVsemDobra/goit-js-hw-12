import axios from "axios";

const API_KEY = "51715222-245823a157b91ecf18a5e059a";
const BASE_URL = "https://pixabay.com/api/";

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page,
    per_page: 15,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}