import bebeboutique2 from '../assets/bebeboutique2.jpeg';
import bebeboutique1 from '../assets/bebeboutique1.jpeg';
import clothes1 from '../assets/clothes1.jpeg';
import clothes2 from '../assets/clothes2.jpeg';
import clothes3 from '../assets/clothes3.jpeg';
import clothes4 from '../assets/clothes4.jpeg';

export default function HomePage() {
    return (
        <div className="py-4 sm:py-6 md:py-8">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                {/* Left Section */}
                <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold px-4 sm:px-6 md:px-8 lg:px-10 mt-4 sm:mt-6 md:mt-8 lg:mt-10 text-center sm:text-left">
                        Bienvenue au site officiel de BebeBoutique 😊
                    </h1>
                    
                    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4">
                        <p className="text-sm sm:text-base leading-relaxed max-w-full lg:max-w-[60ch]">
                            Nous sommes ravis de vous accueillir sur notre site officiel, où vous trouverez une sélection
                            soigneusement choisie de vêtements et d'accessoires pour bébés. Chez Bebe Boutique, nous nous
                            engageons à offrir des produits de qualité, confortables et élégants pour vos tout-petits.
                            Explorez notre collection et découvrez des articles qui allient style et praticité pour le bonheur
                            de votre bébé.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 lg:px-10">
                        <img 
                            src={bebeboutique2} 
                            alt="bebeboutique2" 
                            className="w-full sm:w-48 md:w-56 lg:w-64 h-auto rounded-lg shadow-md object-cover" 
                        />
                        <img 
                            src={bebeboutique1} 
                            alt="bebeboutique1" 
                            className="w-full sm:w-48 md:w-56 lg:w-64 h-auto rounded-lg shadow-md object-cover" 
                        />
                    </div>
                </div>

                {/* Right Section - Image Grid */}
                <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 mt-6 lg:mt-5">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="col-span-1">
                            <img 
                                src={clothes1} 
                                alt="clothes1" 
                                className="w-full h-auto rounded-lg shadow-md object-cover aspect-square" 
                            />
                        </div>
                        <div className="col-span-1">
                            <img 
                                src={clothes2} 
                                alt="clothes2" 
                                className="w-full h-auto rounded-lg shadow-md object-cover aspect-square" 
                            />
                        </div>
                        <div className="col-span-1">
                            <img 
                                src={clothes3} 
                                alt="clothes3" 
                                className="w-full h-auto rounded-lg shadow-md object-cover aspect-square" 
                            />
                        </div>
                        <div className="col-span-1">
                            <img 
                                src={clothes4} 
                                alt="clothes4" 
                                className="w-full h-auto rounded-lg shadow-md object-cover aspect-square" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}