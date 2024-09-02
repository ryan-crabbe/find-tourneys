import { useState, useEffect } from "react";
import "./App.css";
import { getTournaments } from "./services/tournamentService";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { getCoordinates } from "./services/coordinatesService";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";

interface Tournament {
  id: string;
  name: string;
  city: string;
  venueAddress?: string;
  lat?: number;
  lng?: number;
  slug?: string;
  numAttendees?: number;
  startAt?: string;
}

function App() {
  const [usersCoordinates, setUsersCoordinates] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTourney, setSelectedTourney] = useState<Tournament | null>(
    null
  );

  const getDateTime = (unixTimestamp: string) => {
    const date = new Date(Number(unixTimestamp) * 1000);

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format the time
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  const getCoordinatesObject = (coordinatesString: string) => {
    const [lat, lng] = coordinatesString.split(",").map(Number);
    return { lat, lng };
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
    margin: "0 auto",
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
      } else {
        setError("Geolocation is not supported by your browser");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (usersCoordinates) {
      fetchTournaments();
    }
  }, [usersCoordinates]);

  const center = getCoordinatesObject(usersCoordinates);

  const renderMap = () => {
    if (loadError) return <div>Error loading map</div>;
    if (!isLoaded) return <div>Loading map...</div>;

    return (
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={9} center={center}>
        {tournaments.map((tournament: Tournament) => (
          <Marker
            key={tournament.id}
            position={{ lat: tournament.lat!, lng: tournament.lng! }}
            title={tournament.name}
            onClick={() => setSelectedTourney(tournament)}
          />
        ))}

        {selectedTourney && (
          <InfoWindow
            position={{
              lat: selectedTourney.lat!,
              lng: selectedTourney.lng!,
            }}
            onCloseClick={() => setSelectedTourney(null)}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  <a
                    href={`https://start.gg/${selectedTourney.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#4A148C" }}
                  >
                    {selectedTourney.name}
                  </a>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedTourney.numAttendees} entrants rn
                </Typography>
                <Typography variant="body2">
                  Starts at: {getDateTime(selectedTourney.startAt!)}
                </Typography>
                <Typography variant="body2">
                  Address: {selectedTourney.venueAddress}
                </Typography>
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom>
          Tournaments Near You
        </Typography>
        {loading && <Typography>Loading tournaments...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
      </Box>

      <Box mt={5} mb={5}>
        {renderMap()}
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Tournaments
        </Typography>
        <List>
          {tournaments.map((tournament: Tournament) => (
            <ListItem key={tournament.id} className="list-item">
              <ListItemText
                primary={
                  <a
                    href={`https://start.gg/${tournament.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#4A148C" }}
                  >
                    {tournament.name}
                  </a>
                }
                secondary={
                  <>
                    Starts at: {getDateTime(tournament.startAt!)} <br />
                    Entrants: {tournament.numAttendees}
                    <br />
                    Address: {tournament.venueAddress}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default App;
