import logo from '../assets/logo.jpeg';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios';
import AdminForm from '../pages/AdminForm';
import HomePage from '../pages/HomePage';
import Product from '../pages/Product';

export default function Navbar() {
    const [authorized, setAuthorized] = useState(() => {
        return localStorage.getItem('adminAuthorized') === 'true';
    });
    const [showProducts, setShowProducts] = useState(() => {
        return localStorage.getItem('adminAuthorized') === 'true';
    });
    const [showAdmin, setShowAdmin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const AUTHORIZED_EMAIL = 'sihamnouali7@gmail.com';

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                if (!tokenResponse || !tokenResponse.access_token) {
                    throw new Error('No access token received');
                }
            
                const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const userEmail = userInfoResponse.data.email;
                if (userEmail === AUTHORIZED_EMAIL) {
                    setAuthorized(true);
                    setShowProducts(false);
                    setShowAdmin(true);
                    localStorage.setItem('adminAuthorized', 'true');
                } else {
                    alert('Unauthorized email. Access denied.');
                }

                
            } catch (error) {
                console.error('Error during Google login:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    alert(`Error: ${error.response.status} - Please try again.`);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    alert('Network error. Please check your connection.');
                } else {
                    console.error('Request error:', error.message);
                    alert('An error occurred. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            setIsLoading(false);
            // Check if error has a message before trying to trim
            const errorMessage = error?.error_description || error?.message || 'Failed to login with Google';
            alert(errorMessage);
        },
    });

    const handleLogout = () => {
        setAuthorized(false);
        setShowProducts(false);
        setShowAdmin(false);
        setIsMenuOpen(false);
        localStorage.removeItem('adminAuthorized');
    };

    const goToHome = () => {
        setShowProducts(false);
        setShowAdmin(false);
        setIsMenuOpen(false);
    };

    const goToAdmin = () => {
        setShowProducts(false);
        setShowAdmin(true);
        setIsMenuOpen(false);
    };

    const goToProducts = () => {
        setShowAdmin(false);
        setShowProducts(true);
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white shadow-md w-full relative">
                <nav className="flex flex-row items-center gap-2 sm:gap-4">
                    <img 
                        src={logo} 
                        alt="logo" 
                        className="h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 cursor-pointer" 
                        onClick={goToHome} 
                    />
                    <h1 
                        className="font-bold ml-1 sm:ml-3 text-lg sm:text-xl md:text-2xl text-pink-600 cursor-pointer"
                        onClick={goToHome}
                    >
                        BebeBoutique
                    </h1>
                </nav>
                
                <button 
                    onClick={toggleMenu}
                    className="flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>

                <div className="hidden md:flex flex-wrap items-center gap-2 sm:gap-4">
                    {!authorized ? (
                        <>
                            <button onClick={goToProducts} className="font-bold text-pink-600 hover:text-pink-800 text-sm sm:text-base whitespace-nowrap">
                                Découvrir nos produits
                            </button>
                            <button
                                onClick={() => loginWithGoogle()}
                                disabled={isLoading}
                                className="font-bold text-blue-600 hover:text-blue-800 text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Connexion...' : 'Se connecter avec Google 🚀'}
                            </button>
                        </>
                    ) : (
                        <>
                            {!showAdmin && !showProducts && (
                                <>
                                    <button onClick={goToProducts} className="font-bold text-pink-600 hover:text-pink-800 text-sm sm:text-base whitespace-nowrap">
                                        Découvrir nos produits
                                    </button>
                                    <button onClick={goToAdmin} className="font-bold text-blue-600 hover:text-blue-800 text-sm sm:text-base whitespace-nowrap">
                                        ⚙️ Admin
                                    </button>
                                </>
                            )}
                            {authorized && showAdmin && (
                                <button onClick={goToProducts} className="font-bold text-blue-600 hover:text-blue-800 text-sm sm:text-base whitespace-nowrap">
                                    🛍️ Produits
                                </button>
                            )}
                            {authorized && showProducts && (
                                <button onClick={goToAdmin} className="font-bold text-blue-600 hover:text-blue-800 text-sm sm:text-base whitespace-nowrap">
                                    ⚙️ Admin
                                </button>
                            )}
                            {!authorized && showProducts && (
                                <button onClick={goToHome} className="font-bold text-pink-600 hover:text-pink-800 text-sm sm:text-base whitespace-nowrap">
                                    ← Retour à l'accueil
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                            >
                                Déconnexion
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 py-3 space-y-3 w-full">
                    {!authorized ? (
                        <>
                            <button 
                                onClick={goToProducts} 
                                className="block w-full text-left font-bold text-pink-600 hover:text-pink-800 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Découvrir nos produits
                            </button>
                            <button
                                onClick={() => loginWithGoogle()}
                                disabled={isLoading}
                                className="block w-full text-left font-bold text-blue-600 hover:text-blue-800 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Connexion...' : 'Se connecter avec Google 🚀'}
                            </button>
                        </>
                    ) : (
                        <>
                            {!showAdmin && !showProducts && (
                                <>
                                    <button 
                                        onClick={goToProducts} 
                                        className="block w-full text-left font-bold text-pink-600 hover:text-pink-800 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Découvrir nos produits
                                    </button>
                                    <button 
                                        onClick={goToAdmin} 
                                        className="block w-full text-left font-bold text-blue-600 hover:text-blue-800 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        ⚙️ Admin
                                    </button>
                                </>
                            )}
                            {authorized && showAdmin && (
                                <button 
                                    onClick={goToProducts} 
                                    className="block w-full text-left font-bold text-blue-600 hover:text-blue-800 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    🛍️ Produits
                                </button>
                            )}
                            {authorized && showProducts && (
                                <button 
                                    onClick={goToAdmin} 
                                    className="block w-full text-left font-bold text-blue-600 hover:text-blue-800 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    ⚙️ Admin
                                </button>
                            )}
                            {!authorized && showProducts && (
                                <button 
                                    onClick={goToHome} 
                                    className="block w-full text-left font-bold text-pink-600 hover:text-pink-800 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    ← Retour à l'accueil
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="block w-full text-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Déconnexion
                            </button>
                        </>
                    )}
                </div>
            )}

            <div className="w-full">
                {authorized ? (
                    showAdmin ? (
                        <AdminForm authorized={authorized} setAuthorized={setAuthorized} />
                    ) : showProducts ? (
                        <Product authorized={authorized} setAuthorized={setAuthorized} />
                    ) : (
                        <HomePage />
                    )
                ) : (
                    showProducts ? (
                        <Product authorized={authorized} setAuthorized={setAuthorized} />
                    ) : (
                        <HomePage />
                    ))}
            </div>
        </>
    );
}