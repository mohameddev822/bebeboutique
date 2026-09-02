import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "./sharedcomponents/Navbar";
import axios from 'axios';
import { useState, useEffect } from 'react';


export default function App() {
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const fetchClientId = async () => {
        const response = await axios.get("https://backend-theta-gold-46.vercel.app/api/getclientid");
        const id = typeof response.data === 'string' ? response.data : response.data.clientId;
        setClientId(id);
     
    };

    fetchClientId();
  }, []);

  // Show loading state while fetching clientId
  if (!clientId) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full font-serif">
      <GoogleOAuthProvider clientId={clientId}>
        <Navbar />
      </GoogleOAuthProvider>
    </div>
  );
}