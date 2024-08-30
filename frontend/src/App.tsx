import { useState, useEffect } from "react";
import "./App.css";
import { getTournaments } from "./services/tournamentService";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { getCoordinates } from "./services/coordinatesService";

type Tournament = {
  id: string;
  name: string;
  city: string;
  venueAddress?: string; // if you use it in the map
  lat?: number;
  lng?: number;
};

function App() {
  const [usersCoordinates, setUsersCoordinates] =
    useState("32.7157, -117.1611");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCoordinatesObject = (coordinatesString: string) => {
    const [lat, lng] = coordinatesString.split(",").map(Number);
    return { lat, lng };
  };

  const mapContainerStyle = {
    width: "100vw",
    height: "400px",
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  });

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTournaments(usersCoordinates);
      console.log("Fetched tournaments:", data);

      const tournamentsWithCoords = await Promise.all(
        data.map(async (tournament: Tournament) => {
          const coords = await getCoordinates(tournament.venueAddress!);
          return { ...tournament, ...coords };
        })
      );

      setTournaments(tournamentsWithCoords);
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
            setUsersCoordinates(`${latitude},${longitude}`);
            setError(null);
          },
          (error) => {
            setError("Unable to retrieve your location");
            console.error(error);
          }
        );
        console.log(usersCoordinates);
      } else {
        setError("Geolocation is not supported by your browser");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [usersCoordinates]);

  const center = getCoordinatesObject(usersCoordinates);

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
              {tournament.name} - {tournament.venueAddress} - lat:{" "}
              {tournament.lat} - long: {tournament.lng}
            </li>
          ))}
        </ul>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
        >
          {tournaments.map((tournament: any) => (
            <Marker
              key={tournament.id}
              position={{ lat: tournament.lat, lng: tournament.lng }}
              title={tournament.name}
            />
          ))}
        </GoogleMap>
      </div>
    </>
  );
}

export default App;
