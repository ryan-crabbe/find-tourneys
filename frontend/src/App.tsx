import { useState, useEffect } from "react";
import "./App.css";
import { getTournaments } from "./services/tournamentService";

function App() {
  const [coordinates, setCoordinates] = useState("37.75439, -121.91937");
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null); // Reset error state before new request

    try {
      const data = await getTournaments(coordinates);
      console.log("Fetched tournaments:", data); // For debugging purposes
      setTournaments(data);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setError("Failed to fetch tournaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [coordinates]);

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
      </div>
    </>
  );
}

export default App;
