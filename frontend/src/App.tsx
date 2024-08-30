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
  Box,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

type Tournament = {
  id: string;
  name: string;
  city: string;
  venueAddress?: string;
  lat?: number;
  lng?: number;
  slug?: string;
  numAttendees?: number;
};

function App() {
  const [usersCoordinates, setUsersCoordinates] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTourney, setSelectedTourney] = useState<Tournament | null>(
    null
  );

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
      fetchTournaments().then(() => {
        setMapReady(true);
      });
    }
  }, [usersCoordinates]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const center = getCoordinatesObject(usersCoordinates);

  return (
    <Container className="container" maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom>
          Tournaments Near You
        </Typography>
      </Box>

      <Box mt={5} mb={5} width="100%">
        {loading ? (
          <Typography variant="h6">Loading Tournaments...</Typography>
        ) : mapReady ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={8}
            center={center}
          >
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
                      {selectedTourney.venueAddress}
                    </Typography>
                  </CardContent>
                </Card>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <Typography variant="h6">Preparing Map...</Typography>
        )}
      </Box>

      <Box>
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
                secondary={`${tournament.venueAddress} - Number of Entrants:${tournament.numAttendees}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default App;
