import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "./sharedcomponents/Navbar";
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function App() {
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await axios.get("https://backend-16xoh6qkq-mohameddev822s-projects.vercel.app//api/getclientid");
        setClientId(response.data);
      } catch (error) {
        console.error('Error fetching client ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientId();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-y-auto h-screen font-serif w-full">
      <GoogleOAuthProvider clientId={clientId}>
        <Navbar />
      </GoogleOAuthProvider>
    </div>
  );
}