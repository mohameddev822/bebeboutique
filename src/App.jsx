import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "./sharedcomponents/Navbar";
import { useMediaQuery } from 'react-responsive';

export default function App() {
  // Define responsive breakpoints
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isLargeDesktop = useMediaQuery({ minWidth: 1280 });

  return (
    <div className={`overflow-y-auto h-screen font-serif ${
      isMobile ? 'bg-gray-50' : 
      isTablet ? 'bg-gray-100' : 
      'bg-white'
    }`}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className={`
          mx-auto px-4
          ${isMobile ? 'max-w-full' : ''}
          ${isTablet ? 'max-w-2xl px-6' : ''}
          ${isDesktop ? 'max-w-4xl px-8' : ''}
          ${isLargeDesktop ? 'max-w-6xl px-10' : ''}
        `}>
          <Navbar 
            isMobile={isMobile}
            isTablet={isTablet}
            isDesktop={isDesktop}
            isLargeDesktop={isLargeDesktop}
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}