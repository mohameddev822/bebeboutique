import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "./sharedcomponents/Navbar";
export default function App() {
 

  return (
    <div className="overflow-y-auto h-screen font-serif width-full">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
      <Navbar></Navbar>
     </GoogleOAuthProvider>
    </div>
  );
}