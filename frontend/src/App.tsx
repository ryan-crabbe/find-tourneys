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
import { Typography, List, ListItem, Card, CardContent } from "@mui/material";

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
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  });

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTournaments(usersCoordinates);
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

  const getCenterCoordinates = (): google.maps.LatLngLiteral => {
    const [lat, lng] = usersCoordinates.split(",").map(Number);
    return { lat, lng };
  };

  const renderMap = () => {
    if (loadError) return <div>Error loading map</div>;
    if (!isLoaded) return <div>Loading map...</div>;

    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={9}
        center={getCenterCoordinates()}
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
                  >
                    {selectedTourney.name}
                  </a>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedTourney.numAttendees} entrants
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
    <div className="app-container">
      <Typography variant="h2" component="h1" gutterBottom>
        Tournament Map
      </Typography>
      <div className="map-container">{renderMap()}</div>
      <Typography variant="h3" component="h2" gutterBottom>
        Tournament List
      </Typography>
      <List className="list-container">
        {tournaments.map((tournament: Tournament) => (
          <ListItem key={tournament.id} className="list-item">
            <CardContent>
              <Typography variant="h6" component="h3">
                <a
                  href={`https://start.gg/${tournament.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tournament.name}
                </a>
              </Typography>
              <Typography variant="body2">
                Number of Entrants: {tournament.numAttendees}
              </Typography>
              <Typography variant="body2">
                Address: {tournament.venueAddress}
              </Typography>
              <Typography variant="body2">
                Starts at: {getDateTime(tournament.startAt!)}
              </Typography>
            </CardContent>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default App;
