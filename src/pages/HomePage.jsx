import bebeboutique2 from '../assets/bebeboutique2.jpeg';
import bebeboutique1 from '../assets/bebeboutique1.jpeg';
import clothes1 from '../assets/clothes1.jpeg';
import clothes2 from '../assets/clothes2.jpeg';
import clothes3 from '../assets/clothes3.jpeg';
import clothes4 from '../assets/clothes4.jpeg';

export default function HomePage() {
   
    return (
        <>
    
            <div className="w-full px-4 sm:px-0">
                <div className="flex flex-col lg:flex-row w-full">
                    <div className="flex flex-col w-full lg:w-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold pl-4 sm:pl-10 mt-6 sm:mt-10 text-center sm:text-left">
                            Bienvenue au site officiel de BebeBoutique 😊
                        </h1>
                        <div className="py-4 px-4 sm:px-10 flex break-normal w-full sm:w-[60ch]">
                            <p className="text-sm sm:text-base">
                                Nous sommes ravis de vous accueillir sur notre site officiel, où vous trouverez une sélection
                                soigneusement choisie de vêtements et d'accessoires pour bébés. Chez Bebe Boutique, nous nous
                                engageons à offrir des produits de qualité, confortables et élégants pour vos tout-petits.
                                Explorez notre collection et découvrez des articles qui allient style et praticité pour le bonheur
                                de votre bébé.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start">
                            <img 
                                src={bebeboutique2} 
                                alt="bebeboutique2" 
                                className="h-64 w-full sm:h-80 sm:w-80 ml-0 sm:ml-10 mt-5 " 
                            />
                            <img 
                                src={bebeboutique1} 
                                alt="bebeboutique1" 
                                className="h-64 w-full sm:h-80 sm:w-80 ml-0 sm:ml-10 mt-5 " 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-4 mt-5 ml-2 sm:ml-10 mr-2 sm:mr-10 w-full lg:w-auto">
                        <img 
                            src={clothes1} 
                            alt="clothes1" 
                            className="w-full h-48 sm:h-64 sm:w-64  ml-0 sm:ml-10 mt-2 sm:mt-5 rounded-lg shadow-md" 
                        />
                        <img 
                            src={clothes2} 
                            alt="clothes2" 
                            className="w-full h-48 sm:h-64 sm:w-64 ml-0 sm:ml-10 mt-2 sm:mt-5 rounded-lg shadow-md" 
                        />
                        <img 
                            src={clothes3} 
                            alt="clothes3" 
                            className="w-full h-48 sm:h-64 sm:w-64  ml-0 sm:ml-10 mt-2 sm:mt-5 rounded-lg shadow-md" 
                        />
                        <img 
                            src={clothes4} 
                            alt="clothes4" 
                            className="w-full h-48 sm:h-64 sm:w-64  ml-0 sm:ml-10 mt-2 sm:mt-5 rounded-lg shadow-md" 
                        />
                    </div>
                </div>
            </div>
        </>
    );
}