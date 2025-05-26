# Custom Event Calendar

A dynamic, interactive event calendar built with React that allows users to manage their schedule. Users can add, edit, delete, and view events, with support for recurring events and drag-and-drop functionality.

## Features

- Monthly calendar view with current day highlighting
- Add, edit, and delete events
- Event details including title, date/time, description, and color
- Recurring event support (Daily, Weekly, Monthly, Custom)
- Drag-and-drop event rescheduling
- Event persistence using local storage
- Responsive design
- Material-UI components for a modern look and feel

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calendar-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Usage

- Click on any day to add a new event
- Click on an existing event to edit it
- Drag and drop events to reschedule them
- Use the color picker to customize event colors
- Set up recurring events using the recurrence options
- Events are automatically saved to local storage

## Technologies Used

- React
- Material-UI
- date-fns
- react-beautiful-dnd
- Local Storage API

## Project Structure

```
src/
  ├── components/
  │   ├── Calendar.js
  │   ├── CalendarGrid.js
  │   ├── CalendarHeader.js
  │   ├── EventForm.js
  │   └── EventItem.js
  ├── hooks/
  │   └── useLocalStorage.js
  ├── App.js
  └── index.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
