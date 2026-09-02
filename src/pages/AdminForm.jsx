import axios from 'axios';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AdminForm() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [age, setAge] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [useAIDescription, setUseAIDescription] = useState(false);
    const [prompt, setPrompt] = useState('');

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        
        // Create previews
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...imagePreviews];
        
        URL.revokeObjectURL(newPreviews[index]);
        
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const generateAIDescription = async () => {
        if (!prompt) {
            return;
        }

        setIsGenerating(true);
            const response = await axios.post('https://backend-theta-gold-46.vercel.app/api/generate-description', {
                prompt: prompt,
            });
            
            if (response.data) {
                setDescription(response.data.description || response.data);
            }
            setIsGenerating(false);
        };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (images.length === 0) {
            alert('Veuillez ajouter au moins une image');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('age', age);
        formData.append('useAIDescription', useAIDescription);
        
        // Append all images
        images.forEach((image) => {
            formData.append('images', image);
        });

        
            await axios.post('https://backend-theta-gold-46.vercel.app/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Reset form
            setName('');
            setDescription('');
            setPrice('');
            setAge('');
            setImages([]);
            setImagePreviews([]);
            setPrompt('');
            setUseAIDescription(false);
            
        
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-pink-400 px-4 sm:px-6 py-5 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="text-2xl sm:text-3xl">✨</span>
                                    Ajouter un Nouveau Produit
                                </h1>
                                <p className="text-pink-50 mt-1 text-xs sm:text-sm opacity-90">
                                    Remplissez les détails ci-dessous pour ajouter un produit à votre catalogue
                                </p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-2">
                                <span className="text-white text-xs sm:text-sm font-medium">Nouveau</span>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">
                        <div>
                            <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Nom du produit <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Entrez le nom du produit"
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 placeholder-gray-400 hover:border-gray-400 text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={generateAIDescription}
                                        disabled={isGenerating || !name}
                                        className={`px-3 py-1 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                                            isGenerating || !name
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-purple-500 hover:bg-purple-600 text-white'
                                        }`}
                                    >
                                        {isGenerating ? '⏳ Génération...' : '🤖 Générer IA'}
                                    </button>
                                </div>
                            </div>
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows="4"
                                placeholder="Entrez la description du produit ou utilisez l'IA pour la générer"
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 placeholder-gray-400 resize-y hover:border-gray-400 text-sm sm:text-base"
                            />
                          {description && (
    <div className="mt-4 p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
            <span className="text-lg">📝</span>
            <h4 className="text-sm font-semibold text-gray-700">Aperçu de la description générée</h4>
            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                ✨ IA
            </span>
        </div>
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({...props}) => <h1 className="text-xl font-bold text-gray-800 mt-3 mb-2" {...props} />,
                    h2: ({ ...props}) => <h2 className="text-lg font-semibold text-gray-800 mt-3 mb-2" {...props} />,
                    h3: ({...props}) => <h3 className="text-base font-semibold text-gray-800 mt-2 mb-1.5" {...props} />,
                    p: ({...props}) => <p className="text-sm leading-relaxed mb-2 text-gray-700" {...props} />,
                    ul: ({ ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                    ol: ({ ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                    li: ({ ...props}) => <li className="text-sm text-gray-700" {...props} />,
                    strong: ({...props}) => <strong className="font-semibold text-gray-800" {...props} />,
                    em: ({...props}) => <em className="italic text-gray-600" {...props} />,
                    blockquote: ({...props}) => <blockquote className="border-l-4 border-pink-300 pl-4 italic text-gray-600 my-2" {...props} />,
                }}
            >
                {description}
            </ReactMarkdown>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center gap-3 text-xs text-gray-400">
            <span>✅ Description prête à être utilisée</span>
            <span className="w-px h-3 bg-gray-300"></span>
            <span>📊 {description.split(' ').length} mots</span>
            <span className="w-px h-3 bg-gray-300"></span>
            <span>⏱️ Générée par IA</span>
        </div>
    </div>
)}
                            
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prompt
                                    </label>
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Ton prompt ici"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none text-sm"
                                    />
                                </div>
                        
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label htmlFor="prix" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Prix (DHS) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="prix"
                                        name="prix"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 placeholder-gray-400 hover:border-gray-400 text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Âge
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="age"
                                        name="age"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="Ex: 2-3 ans"
                                        className="w-full pl-8 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 placeholder-gray-400 hover:border-gray-400 text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Images du produit <span className="text-red-500">*</span>
                                <span className="text-xs font-normal text-gray-500 ml-2">(Max 5 images)</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                                />
                            </div>
                            
                            {imagePreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 sm:h-32  rounded-lg border border-gray-200 shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-md"
                                            >
                                                ×
                                            </button>
                                            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                                                {index + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {imagePreviews.length > 0 && (
                                <p className="text-xs text-gray-500 mt-2">
                                    {imagePreviews.length} image(s) sélectionnée(s)
                                </p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={images.length === 0}
                                className={`w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium py-2.5 sm:py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-4 focus:ring-pink-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base ${
                                    images.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                ➕ Ajouter le produit
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 text-center pt-2">
                            * Champs obligatoires • Vous pouvez ajouter jusqu'à 5 images
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}