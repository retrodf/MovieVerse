import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getMovies = async () => {
  try {
    const response = await axios.get(`${API_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies", error);
    throw error;
  }
};
