import axios from 'axios';
import { useState } from 'react';

export default function AdminForm() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [age, setAge] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('age', age);
        formData.append('image', image);

        try {
            await axios.post('https://backend-24nzmvbay-mohameddev822s-projects.vercel.app/api/products', formData);
            setName('');
            setDescription('');
            setPrice('');
            setAge('');
            setImage('');
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-pink-400 px-6 py-8 sm:px-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="text-3xl">✨</span>
                                    Ajouter un Nouveau Produit
                                </h1>
                                <p className="text-pink-50 mt-1 text-sm opacity-90">
                                    Remplissez les détails ci-dessous pour ajouter un produit à votre catalogue
                                </p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                <span className="text-white text-sm font-medium">Nouveau</span>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10 space-y-6">
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 placeholder-gray-400 hover:border-gray-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows="4"
                                placeholder="Entrez la description du produit"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 placeholder-gray-400 resize-y hover:border-gray-400"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 placeholder-gray-400 hover:border-gray-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Age <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="age"
                                        name="age"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        required
                                        placeholder="Age"
                                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 placeholder-gray-400 hover:border-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="w-full sm:w-3/4">
                                <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Image du produit <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="image"
                                        onChange={(e) => setImage(e.target.files[0])}
                                        name="image"
                                        required
                                        className="w-fit px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-4 focus:ring-pink-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                ➕ Ajouter le produit
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 text-center pt-2">
                            * Champs obligatoires
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}