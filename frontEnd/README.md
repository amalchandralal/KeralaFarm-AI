# KeralaFarm AI Assistant — Frontend

Voice-first AI farming assistant for Kerala's smallholder farmers.

## Tech Stack

- **React 18** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Axios** (API requests)
- **React Router v6** (navigation)
- **Context API** (auth state)
- **Web Speech API** (voice input/output)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on `http://localhost:5173` and connects to the backend at `http://localhost:5000`.

## Project Structure

```
client/
├── components/
│   ├── Navbar.tsx          # Responsive navigation
│   ├── HeroSection.tsx     # Landing hero
│   ├── FeatureCard.tsx     # Reusable feature card
│   ├── VoiceAssistantWidget.tsx  # Voice AI widget
│   ├── DiseaseScanner.tsx  # Crop disease upload & results
│   ├── PlaceCard.tsx       # Place display card
│   ├── BookingCard.tsx     # Booking display card
│   └── Footer.tsx          # Site footer
├── contexts/
│   └── AuthContext.tsx     # Auth state (React Context)
├── hooks/
│   └── useVoice.ts         # Web Speech API hook
├── lib/
│   └── axios.ts            # Axios instance with interceptors
├── pages/
│   ├── HomePage.tsx        # Landing page
│   ├── VoicePage.tsx       # Voice assistant page
│   ├── ScanPage.tsx        # Disease scanner page
│   ├── LoginPage.tsx       # Login
│   ├── RegisterPage.tsx    # Registration
│   ├── ProfilePage.tsx     # User profile
│   ├── PlacesPage.tsx      # Browse places
│   ├── BookingsPage.tsx    # View & create bookings
│   └── NotFoundPage.tsx    # 404
├── services/
│   └── api.ts              # All API service functions
├── App.tsx                 # Router & layout
└── global.css              # Tailwind + custom styles
```

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | User registration |
| POST | /login | User login |
| GET | /profile | Get user profile |
| POST | /logout | Logout user |
| POST | /voice-assistant | AI voice Q&A |
| POST | /detect-disease | Crop disease detection |
| GET | /places | List agricultural places |
| POST | /bookings | Create booking |
| GET | /bookings | Get user bookings |

## Features

- 🎤 **Voice Assistant** — Speak in Malayalam/English, get AI answers read aloud
- 📷 **Crop Disease Scanner** — Upload photo, get disease diagnosis
- 📍 **Places** — Browse agricultural service centers
- 📅 **Bookings** — Book visits to centers
- 👤 **Authentication** — Register/Login with cookie-based auth
- 📱 **Mobile-First** — Responsive, large buttons, farmer-friendly UI
- 🌿 **Malayalam Support** — Bilingual interface throughout
