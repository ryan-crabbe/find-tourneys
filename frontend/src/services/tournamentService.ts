import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

export const getTournaments = async (coordinates: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/tournaments`, {
      params: { coordinates: coordinates },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
};
