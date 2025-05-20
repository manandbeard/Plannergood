# Helland Family Calendar Dashboard

A self-hosted web application for a family calendar dashboard designed to run on a Raspberry Pi with a connected display.

## Features

- **Integrated Calendar View**: Displays a weekly agenda with color-coded events for each family member
- **Meal Planning**: Shows meals from a dedicated calendar feed
- **Photo Slideshow**: Cycles through family photos with smooth transitions
- **Task Management**: Keep track of family tasks and notes
- **Weather Information**: Displays current weather conditions
- **Screensaver Mode**: Transitions to a full-screen photo slideshow after inactivity
- **Responsive Design**: Optimized for 27" displays but works on various screen sizes

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Start the production server:

```bash
npm run start
```

## Configuration

### Application Settings

Access the settings panel by clicking the gear icon in the dashboard header. From here you can configure:

- Family member names and their calendar URLs
- Meal calendar URL
- Weather location and API key
- Photo directory
- Display preferences (12/24 hour format)
- Screensaver timeout duration

### Adding Photos

Upload photos through the settings panel. The application will store and display them in the slideshow.

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express API
- `/shared` - Shared types and schemas
- `/photos` - Storage location for uploaded photos

## Technologies Used

- **Frontend**: React, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **State Management**: React Query
- **Calendar Integration**: node-ical for iCal parsing
- **Storage**: In-memory with file persistence

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to a Raspberry Pi.

## License

This project is available under the MIT License.