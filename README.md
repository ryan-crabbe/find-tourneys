# Find Tourneys

Web app to find a fighting game tournament near me happening in the next week. All tournament data is scraped from [start.gg](https://start.gg/). Gives a map of all the tournaments and a list of all the tournaments, including a link to the tournament on start.gg.

## Technologies and Practices

- **Frontend**: React with TypeScript, utilizing Vite for fast development and building
- **State Management**: React Hooks (useState, useEffect) for local state management
- **UI Components**: Material-UI (MUI) for a consistent and responsive design
- **Mapping**: Google Maps API integration using @react-google-maps/api
- **API Calls**: Axios for making HTTP requests
- **Geolocation**: Browser's Geolocation API for user location
- **Environment Variables**: Vite's environment variable handling for secure API key management
- **Type Safety**: TypeScript for improved code quality and developer experience
- **Code Quality**: ESLint for code linting and maintaining code standards

## Key Features

- Real-time geolocation-based tournament search
- Interactive map with tournament markers and info windows
- Detailed list view of nearby tournaments
- Direct links to tournament pages on start.gg

## Running the app

1. Clone the repo
2. Run `npm install`
3. Set up environment variables (VITE_GOOGLE_MAPS_API_KEY and VITE_API_URL)
4. Run `npm run dev`

## Future Improvements

- Implement server-side rendering for improved SEO
- Add feature where users can add tournaments to their google calendar
- Add feature where users can see the participants and seeding of a tournament
