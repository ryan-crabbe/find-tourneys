import axios from 'axios';

export async function getCoordinates(address: string): Promise<{ lat: number, lng: number }> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY!;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;

    if (results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
}
