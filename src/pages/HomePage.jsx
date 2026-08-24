import bebeboutique2 from '../assets/bebeboutique2.jpeg';
import bebeboutique1 from '../assets/bebeboutique1.jpeg';
import clothes1 from '../assets/clothes1.jpeg';
import clothes2 from '../assets/clothes2.jpeg';
import clothes3 from '../assets/clothes3.jpeg';
import clothes4 from '../assets/clothes4.jpeg';
export default function HomePage() {
   
    return (
        <>
    
                <div>
                    <div className="flex flex-row">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold pl-10 mt-10">Bienvenue au site officiel de BebeBoutique 😊</h1>
                            <div className="py-4 px-10 flex break-normal w-[60ch]">
                                <p>
                                    Nous sommes ravis de vous accueillir sur notre site officiel, où vous trouverez une sélection
                                    soigneusement choisie de vêtements et d'accessoires pour bébés. Chez Bebe Boutique, nous nous
                                    engageons à offrir des produits de qualité, confortables et élégants pour vos tout-petits.
                                    Explorez notre collection et découvrez des articles qui allient style et praticité pour le bonheur
                                    de votre bébé.
                                </p>
                            </div>
                            <div className="flex flex-row">
                                <img src={bebeboutique2} alt="bebeboutique2" className="h-80 w-80 ml-10 mt-5" />
                                <img src={bebeboutique1} alt="bebeboutique1" className="h-80 w-80 ml-10 mt-5" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-5 ml-10 mr-10">
                        <img src={clothes1} alt="clothes1" className="h-64 w-64 ml-10 mt-5" />
                            <img src={clothes2} alt="clothes2" className="h-64 w-64 ml-10 mt-5" />
                            <img src={clothes3} alt="clothes3" className="h-64 w-64 ml-10 mt-5" />
                            <img src={clothes4} alt="clothes4" className="h-64 w-64 ml-10 mt-5" />
                        </div>
                    </div>
                </div>
        </>
    );
}