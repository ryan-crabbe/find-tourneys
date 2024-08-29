import { useState, useEffect } from "react";
import "./App.css";
import { getTournaments } from "./services/tournamentService";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

function App() {
  const [coordinates, setCoordinates] = useState("32.7157, -117.1611");
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapContainerStyle = {
    width: "100vw",
    height: "400px",
  };

  const center = {
    lat: 33.7454725,
    lng: -117.86765300000002,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  });

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTournaments(coordinates);
      console.log("Fetched tournaments:", data);
      setTournaments(data);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setError("Failed to fetch tournaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates(`${latitude},${longitude}`);
            setError(null);
          },
          (error) => {
            setError("Unable to retrieve your location");
            console.error(error);
          }
        );
        console.log(coordinates);
      } else {
        setError("Geolocation is not supported by your browser");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [coordinates]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <>
      <div>
        <h1>Tournaments Near You</h1>
        <button onClick={fetchTournaments} disabled={loading}>
          {loading ? "Loading..." : "Fetch Tournaments"}
        </button>
        {error && <p>{error}</p>}
        <ul>
          {tournaments.map((tournament: any) => (
            <li key={tournament.id}>
              {tournament.name} - {tournament.city} - {tournament.venueAddress}
            </li>
          ))}
        </ul>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
        ></GoogleMap>
      </div>
    </>
  );
}

export default App;
