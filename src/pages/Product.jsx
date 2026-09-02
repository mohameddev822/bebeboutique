import axios from "axios"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Product({ authorized }) {
    const [allproducts, setProducts] = useState([]);
    const [cartStatus, setCartStatus] = useState({});
    const [quantities, setQuantities] = useState({});
    const [order, setOrder] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        location: ''
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        price: '',
        age: '',
        images: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const MAX_LENGTH = 100;

    const handleOpenModal = (productId) => {
        const foundProduct = allproducts.find((product) => product.id === productId);
        setSelectedProduct(foundProduct);
        setShowDescriptionModal(true);
    };

    const handleCloseModal = () => {
        setShowDescriptionModal(false);
        setSelectedProduct(null);
    };

    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name,
            description: product.description,
            price: product.price,
            age: product.age || '',
            images: []
        });
        setImagePreviews(product.images || [product.image]);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingProduct(null);
        setEditForm({
            name: '',
            description: '',
            price: '',
            age: '',
            images: []
        });
        setImagePreviews([]);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    const handleEditImageChange = (e) => {
        const files = Array.from(e.target.files);
        setEditForm({
            ...editForm,
            images: files
        });
        
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
    };

    const removeEditImage = (index) => {
        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
        
        if (editForm.images.length > 0) {
            const newImages = [...editForm.images];
            newImages.splice(index, 1);
            setEditForm({
                ...editForm,
                images: newImages
            });
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', editForm.name);
            formData.append('description', editForm.description);
            formData.append('price', editForm.price);
            formData.append('age', editForm.age);
            if (editForm.images && editForm.images.length > 0) {
                editForm.images.forEach((image) => {
                    formData.append('images', image);
                });
            }

            const response = await axios.put(
                `https://backend-theta-gold-46.vercel.app/api/products/${editingProduct.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                const productsResponse = await axios.get('https://backend-theta-gold-46.vercel.app/api/products');
                setProducts(productsResponse.data);
                handleCloseEditModal();
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            return;
        }

        try {
            const response = await axios.delete(`https://backend-theta-gold-46.vercel.app/api/products/${productId}`);

            if (response.data.success) {
                setProducts(allproducts.filter(product => product.id !== productId));
                if (cartStatus[productId]) {
                    setCartStatus({ ...cartStatus, [productId]: false });
                    setOrder(order.filter(item => item.id !== productId));
                }
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    useEffect(() => {
        async function initializeQuantities() {
            const newQuantities = allproducts.reduce((acc, product) => {
                return {
                    ...acc,
                    [product.id]: 1
                }
            }, {});
            setQuantities(newQuantities);
        }
        if (allproducts.length > 0) {
            initializeQuantities();
        }
    }, [allproducts]);

    useEffect(() => {
        axios.get('https://backend-theta-gold-46.vercel.app/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const handlePanier = (productId) => {
        const isInCart = cartStatus[productId];
        setCartStatus({
            ...cartStatus,
            [productId]: !isInCart
        });

        const foundProduct = allproducts.find((product) => product.id === productId);
        if (!foundProduct) return;

        const productWithQuantity = { ...foundProduct, quantity: quantities[productId] || 1 };
        const existingProductIndex = order.findIndex(item => item.id === productId);

        if (existingProductIndex !== -1) {
            const updatedOrder = [...order];
            updatedOrder[existingProductIndex] = productWithQuantity;
            setOrder(updatedOrder);
        } else {
            setOrder([...order, productWithQuantity]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({
            ...customerInfo,
            [name]: value
        });
    };

    const handleBuy = (orderItems) => {
        if (orderItems.length === 0) {
            return;
        }

        if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone || !customerInfo.location) {
            return;
        }

        const phoneNumber = '212632474367';

        const customerDetails = `
👤 Informations du client :
   • Prénom: ${customerInfo.firstName}
   • Nom: ${customerInfo.lastName}
   • Téléphone: ${customerInfo.phone}
   • Localisation: ${customerInfo.location}
`;

        const productDetails = orderItems.map((product) => (
            `\n📦 Produit:
   • Nom: ${product.name}
   • Prix: ${product.price} DHS
   • Quantité: ${product.quantity}
   • Age: ${product.age || 'Non spécifié'}`
        )).join('\n');

        const totalPrice = orderItems.reduce((total, product) => total + (product.price * product.quantity), 0);

        const message = `🛒 NOUVELLE COMMANDE\n${customerDetails}\n${productDetails}\n📊 TOTAL: ${totalPrice} DHS\n\n📅 Date: ${new Date().toLocaleString()}`;
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    };

    const handleQuantitySelection = (productId, value) => {
        setQuantities({
            ...quantities,
            [productId]: value
        });

        const existingProductIndex = order.findIndex(item => item.id === productId);
        if (existingProductIndex !== -1) {
            const updatedOrder = [...order];
            const foundProduct = allproducts.find((product) => product.id === productId);
            if (foundProduct) {
                updatedOrder[existingProductIndex] = { ...foundProduct, quantity: value };
                setOrder(updatedOrder);
            }
        }
    };

    const removeFromCart = (productId) => {
        const updatedOrder = order.filter(item => item.id !== productId);
        setOrder(updatedOrder);
        setCartStatus({ ...cartStatus, [productId]: false });
    };

    // Fonction pour extraire le texte brut du markdown
    const stripMarkdown = (text) => {
        if (!text) return '';
        return text
            .replace(/#{1,6}\s/g, '')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
            .replace(/`{1,3}[^`]*`{1,3}/g, '')
            .replace(/\|/g, '')
            .replace(/---/g, '')
            .replace(/\n{2,}/g, '\n')
            .trim();
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-center rounded-lg mt-9 mr-4 sm:mr-28 ml-4 sm:ml-28 gap-4 sm:gap-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <h2 className="text-lg sm:text-xl font-bold text-pink-600">🛍️ Panier: {order.length} article(s)</h2>
                    {order.length > 0 && (
                        <span className="text-sm text-gray-500">
                            Total: {order.reduce((total, product) => total + (product.price * product.quantity), 0)} DHS
                        </span>
                    )}
                </div>
                <button
                    disabled={order.length === 0}
                    onClick={() => setShowCheckout(true)}
                    className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${order.length > 0
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {order.length > 0 ? '📦 Passer commande' : '🛒 Panier vide'}
                </button>
            </div>

            {showCheckout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
                            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                📝 Informations de commande
                            </h2>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prénom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={customerInfo.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Prénom"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={customerInfo.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Nom"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Numéro de téléphone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={customerInfo.phone}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 06 12 34 56 78"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Localisation <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={customerInfo.location}
                                    onChange={handleInputChange}
                                    placeholder="Ville, quartier, adresse..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                                    required
                                />
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-700 mb-2">📋 Résumé de votre commande</h3>
                                {order.map((product, index) => (
                                    <div key={index} className="text-sm text-gray-600 py-1 border-b border-gray-200 last:border-0">
                                        <span className="font-medium">{product.name}</span> -
                                        {product.quantity} x {product.price} DHS =
                                        <span className="font-semibold text-pink-600"> {product.quantity * product.price} DHS</span>
                                    </div>
                                ))}
                                <div className="mt-2 pt-2 border-t-2 border-pink-400">
                                    <span className="font-bold text-gray-800">Total: </span>
                                    <span className="font-bold text-pink-600 text-lg">
                                        {order.reduce((total, product) => total + (product.price * product.quantity), 0)} DHS
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setShowCheckout(false);
                                        setCustomerInfo({
                                            firstName: '',
                                            lastName: '',
                                            phone: '',
                                            location: ''
                                        });
                                    }}
                                    className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleBuy(order)}
                                    className="w-full sm:flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    ✅ Confirmer et envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Description Modal with Markdown Support and Image Grid */}
            {showDescriptionModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                📖 Description détaillée
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-white hover:text-gray-200 transition-colors text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4">
                            {/* Images Gallery - TOUJOURS EN GRILLE */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-full">
                                    {selectedProduct.images && selectedProduct.images.length > 1 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {selectedProduct.images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                    <img 
                                                        src={img} 
                                                        alt={`${selectedProduct.name} - image ${idx + 1}`} 
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                    {idx === 0 && (
                                                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                                            Principal
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="relative w-full aspect-square max-h-64 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                            <img 
                                                src={selectedProduct.images?.[0] || selectedProduct.image} 
                                                alt={selectedProduct.name} 
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center w-full">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{selectedProduct.name}</h3>
                                    <p className="text-pink-600 font-semibold text-lg">{selectedProduct.price} DHS</p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Âge:</span> {selectedProduct.age || 'Non spécifié'}
                                    </p>
                                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {selectedProduct.images.length} images disponibles
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description with Markdown */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm font-semibold text-gray-700">📝 Description</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                        Formaté
                                    </span>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({...props}) => <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-3" {...props} />,
                                            h2: ({...props}) => <h2 className="text-xl font-semibold text-gray-800 mt-3 mb-2" {...props} />,
                                            h3: ({...props}) => <h3 className="text-lg font-semibold text-gray-800 mt-3 mb-2" {...props} />,
                                            h4: ({...props}) => <h4 className="text-base font-semibold text-gray-800 mt-2 mb-1.5" {...props} />,
                                            h5: ({...props}) => <h5 className="text-sm font-semibold text-gray-700 mt-2 mb-1" {...props} />,
                                            h6: ({...props}) => <h6 className="text-xs font-semibold text-gray-600 mt-1.5 mb-1" {...props} />,
                                            p: ({...props}) => <p className="text-sm leading-relaxed mb-3 text-gray-700" {...props} />,
                                            ul: ({...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                                            ol: ({...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                                            li: ({...props}) => <li className="text-sm text-gray-700" {...props} />,
                                            strong: ({...props}) => <strong className="font-semibold text-gray-800" {...props} />,
                                            em: ({...props}) => <em className="italic text-gray-600" {...props} />,
                                            del: ({...props}) => <del className="text-gray-400" {...props} />,
                                            blockquote: ({...props}) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-600 my-3" {...props} />,
                                            code: ({inline, ...props}) => 
                                                inline ? 
                                                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-pink-600 text-xs" {...props} /> :
                                                    <code className="block bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto" {...props} />,
                                            pre: ({...props}) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-3" {...props} />,
                                            a: ({...props}) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
                                            img: ({...props}) => <img className="max-w-full h-auto rounded-lg my-2" {...props} />,
                                            hr: ({...props}) => <hr className="my-4 border-gray-200" {...props} />,
                                            table: ({...props}) => (
                                                <div className="overflow-x-auto my-3 border border-gray-200 rounded-lg">
                                                    <table className="min-w-full divide-y divide-gray-200" {...props} />
                                                </div>
                                            ),
                                            thead: ({...props}) => <thead className="bg-gray-50" {...props} />,
                                            tbody: ({...props}) => <tbody className="bg-white divide-y divide-gray-200" {...props} />,
                                            tr: ({...props}) => <tr className="hover:bg-gray-50 transition-colors" {...props} />,
                                            th: ({...props}) => (
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
                                            ),
                                            td: ({...props}) => (
                                                <td className="px-4 py-2 text-sm text-gray-700" {...props} />
                                            ),
                                        }}
                                    >
                                        {selectedProduct.description}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {!authorized && 
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            handlePanier(selectedProduct.id);
                                            handleCloseModal();
                                        }}
                                        className="w-full sm:flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                                    >
                                        🛒 Ajouter au panier
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal with Multiple Images */}
            {showEditModal && editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                ✏️ Modifier le produit
                            </h2>
                            <button
                                onClick={handleCloseEditModal}
                                className="text-white hover:text-gray-200 transition-colors text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProduct} className="p-4 sm:p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom du produit <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prix (DHS) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editForm.price}
                                        onChange={handleEditInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Âge
                                    </label>
                                    <input
                                        type="text"
                                        name="age"
                                        value={editForm.age}
                                        onChange={handleEditInputChange}
                                        placeholder="Ex: 2-3 ans"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Images du produit
                                </label>
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="file"
                                        name="images"
                                        multiple
                                        accept="image/*"
                                        onChange={handleEditImageChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                                    />
                                    <p className="text-xs text-gray-500">Ajoutez des images supplémentaires (elles s'ajouteront aux existantes)</p>
                                    
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-20 sm:h-24 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEditImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCloseEditModal}
                                    className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    💾 Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
                    {allproducts.map((product) => {
                        const productImages = product.images || [product.image];
                        const hasMultipleImages = productImages.length > 1;
                        const plainTextDescription = stripMarkdown(product.description);
                        const truncatedDescription = plainTextDescription.length > MAX_LENGTH 
                            ? plainTextDescription.slice(0, MAX_LENGTH) + '...' 
                            : plainTextDescription;
                        
                        return (
                            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 relative group">
                                {/* Affichage toujours en grille si plusieurs images, sinon une seule image */}
                                <div className="relative overflow-hidden bg-gray-100">
                                    {hasMultipleImages ? (
                                        <div className="relative">
                                            <div className="grid grid-cols-2 gap-0.5">
                                                {productImages.slice(0, 4).map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square overflow-hidden">
                                                        <img 
                                                            src={img} 
                                                            alt={`${product.name} - image ${idx + 1}`} 
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                        {idx === 0 && (
                                                            <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                                                Principal
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {productImages.length > 4 && (
                                                    <div className="relative aspect-square overflow-hidden bg-black/80 flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">+{productImages.length - 4}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 z-10 backdrop-blur-sm">
                                                <span>📸</span>
                                                {productImages.length}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-square overflow-hidden">
                                            <img 
                                                src={productImages[0]} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 space-y-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <h2 className="text-base font-semibold text-gray-800 line-clamp-1">{product.name}</h2>
                                        {authorized && (
                                            <div className="flex gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => handleOpenEditModal(product)}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors p-1 text-sm"
                                                    title="Modifier"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-1 text-sm"
                                                    title="Supprimer"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-h-[40px]">
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                            {truncatedDescription}
                                        </p>
                                        {plainTextDescription.length > MAX_LENGTH && (
                                            <button
                                                onClick={() => handleOpenModal(product.id)}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 inline-block"
                                            >
                                                Voir plus 📖
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-xs text-gray-500">
                                            <span className="font-medium">Âge:</span> {product.age || 'Non spécifié'}
                                        </p>
                                        <p className="text-lg font-bold text-pink-600">{product.price} DHS</p>
                                    </div>

                                    {!authorized && (
                                        <>
                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                <label className="text-xs font-medium text-gray-700">Quantité :</label>
                                                <select
                                                    value={quantities[product.id] || 1}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        handleQuantitySelection(product.id, value);
                                                    }}
                                                    className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                                                >
                                                    {[...Array(10)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex flex-col gap-2 pt-1">
                                                <button
                                                    onClick={() => handlePanier(product.id)}
                                                    className={`w-full px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                                                        cartStatus[product.id]
                                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                                            : 'bg-yellow-500 hover:bg-yellow-600 text-white hover:shadow-md'
                                                    }`}
                                                >
                                                    {cartStatus[product.id] ? '✅ Dans le panier' : '🛒 Ajouter au panier'}
                                                </button>

                                                {cartStatus[product.id] && (
                                                    <button
                                                        onClick={() => removeFromCart(product.id)}
                                                        className="w-full px-3 py-1 text-xs rounded-lg font-medium bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                                                    >
                                                        Retirer du panier
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}