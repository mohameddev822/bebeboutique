import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "./sharedcomponents/Navbar";

export default function App() {
  return (
    <div className="min-h-screen h-screen overflow-y-auto font-serif bg-gray-50">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Navbar />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}