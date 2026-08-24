import logo from '../assets/logo.jpeg';
import { useGoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import AdminForm from '../pages/AdminForm';
import HomePage from '../pages/HomePage';
import Product from '../pages/Product';
import axios from 'axios';

export default function Navbar() {
    const [authorized, setAuthorized] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const AUTHORIZED_EMAIL = 'sihamnouali7@gmail.com';

    useEffect(() => {
        const checkStoredAuth = async () => {
            const savedAuth = localStorage.getItem('adminAuthorized');
            if (savedAuth === 'true') {
                setAuthorized(true);
                return;
            }

            try {
                const response = await axios.get('http://localhost:3000/api/getuser');
                if (response.data && response.data.isauthorizeduser === AUTHORIZED_EMAIL) {
                    setAuthorized(true);
                    localStorage.setItem('adminAuthorized', 'true');
                }
            } catch (error) {
                console.error('Error checking authorization:', error);
            }
        };

        checkStoredAuth();
    }, []);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const userInfo = await response.json();

                if (userInfo.email === AUTHORIZED_EMAIL) {
                    setAuthorized(true);
                    localStorage.setItem('adminAuthorized', 'true');

                    await axios.post('http://localhost:3000/api/saveuser', {
                        isauthorizeduser: userInfo.email
                    });
                    
                    setShowProducts(true);
                    setShowAdmin(false);
                    setIsMobileMenuOpen(false);
                } 
            } catch (error) {
                console.error('Error during Google login:', error);
            }
        },
        onError: (error) => {
            console.log('Login Failed:', error);
        },
    });

    const handleLogout = () => {
        setAuthorized(false);
        setShowProducts(false);
        setShowAdmin(false);
        localStorage.removeItem('adminAuthorized');
        setIsMobileMenuOpen(false);
    };

    const goToHome = () => {
        setShowProducts(false);
        setShowAdmin(false);
        setIsMobileMenuOpen(false);
    };

    const goToAdmin = () => {
        setShowProducts(false);
        setShowAdmin(true);
        setIsMobileMenuOpen(false);
    };

    const goToProducts = () => {
        setShowAdmin(false);
        setShowProducts(true);
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* NAVBAR */}
            <div className="sticky top-0 z-50 bg-white shadow-md">
                <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
                    {/* Logo and Brand */}
                    <nav className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <img 
                            src={logo} 
                            alt="logo" 
                            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 cursor-pointer rounded-full object-cover" 
                            onClick={goToHome} 
                        />
                        <h1 
                            className="font-bold text-lg sm:text-xl md:text-2xl text-pink-600 cursor-pointer whitespace-nowrap"
                            onClick={goToHome}
                        >
                            BebeBoutique
                        </h1>
                    </nav>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3 lg:gap-4">
                        {!authorized ? (
                            <>
                                <button 
                                    onClick={goToProducts} 
                                    className="font-semibold text-pink-600 hover:text-pink-800 transition-colors text-sm lg:text-base"
                                >
                                    Découvrir nos produits
                                </button>
                                <button
                                    onClick={loginWithGoogle}
                                    className="font-semibold text-blue-600 hover:text-blue-800 transition-colors text-sm lg:text-base"
                                >
                                    Se connecter avec Google 🚀
                                </button>
                            </>
                        ) : (
                            <>
                                {!showAdmin && !showProducts && (
                                    <>
                                        <button onClick={goToProducts} className="font-semibold text-pink-600 hover:text-pink-800 transition-colors text-sm lg:text-base">
                                            Découvrir nos produits
                                        </button>
                                        <button onClick={goToAdmin} className="font-semibold text-blue-600 hover:text-blue-800 transition-colors text-sm lg:text-base">
                                            ⚙️ Admin
                                        </button>
                                    </>
                                )}
                                {authorized && showAdmin && (
                                    <button onClick={goToProducts} className="font-semibold text-blue-600 hover:text-blue-800 transition-colors text-sm lg:text-base">
                                        🛍️ Produits
                                    </button>
                                )}
                                {authorized && showProducts && (
                                    <button onClick={goToAdmin} className="font-semibold text-blue-600 hover:text-blue-800 transition-colors text-sm lg:text-base">
                                        ⚙️ Admin
                                    </button>
                                )}
                                {!authorized && showProducts && (
                                    <button onClick={goToHome} className="font-semibold text-pink-600 hover:text-pink-800 transition-colors text-sm lg:text-base">
                                        ← Retour à l'accueil
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-semibold transition-colors text-sm lg:text-base"
                                >
                                    Déconnexion
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleMobileMenu}
                        className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col px-4 py-3 space-y-2">
                        {!authorized ? (
                            <>
                                <button 
                                    onClick={goToProducts} 
                                    className="w-full text-left py-2.5 px-4 rounded-lg bg-pink-50 text-pink-600 font-semibold hover:bg-pink-100 transition-colors"
                                >
                                    Découvrir nos produits
                                </button>
                                <button
                                    onClick={loginWithGoogle}
                                    className="w-full text-left py-2.5 px-4 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors"
                                >
                                    Se connecter avec Google 🚀
                                </button>
                            </>
                        ) : (
                            <>
                                {!showAdmin && !showProducts && (
                                    <>
                                        <button onClick={goToProducts} className="w-full text-left py-2.5 px-4 rounded-lg bg-pink-50 text-pink-600 font-semibold hover:bg-pink-100 transition-colors">
                                            Découvrir nos produits
                                        </button>
                                        <button onClick={goToAdmin} className="w-full text-left py-2.5 px-4 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">
                                            ⚙️ Admin
                                        </button>
                                    </>
                                )}
                                {authorized && showAdmin && (
                                    <button onClick={goToProducts} className="w-full text-left py-2.5 px-4 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">
                                        🛍️ Produits
                                    </button>
                                )}
                                {authorized && showProducts && (
                                    <button onClick={goToAdmin} className="w-full text-left py-2.5 px-4 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">
                                        ⚙️ Admin
                                    </button>
                                )}
                                {!authorized && showProducts && (
                                    <button onClick={goToHome} className="w-full text-left py-2.5 px-4 rounded-lg bg-pink-50 text-pink-600 font-semibold hover:bg-pink-100 transition-colors">
                                        ← Retour à l'accueil
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left py-2.5 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                                >
                                    Déconnexion
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
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
                    )
                )}
            </div>
        </>
    );
}