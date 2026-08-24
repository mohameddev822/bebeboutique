import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "./sharedcomponents/Navbar";
import axios from 'axios';

export default function App() {
 
   const response = axios.get("http://localhost:3000/api/getclientid");
  return (
    <div className="overflow-y-auto h-screen font-serif w-full">
      <GoogleOAuthProvider clientId={response.data} >
      <Navbar></Navbar>
     </GoogleOAuthProvider>
    </div>
  );
}