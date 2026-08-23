import axios from "axios"
import { useEffect, useState } from "react"

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
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
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
            image: null
        });
        setImagePreview(product.image);
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
            image: null
        });
        setImagePreview(null);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditForm({
                ...editForm,
                image: file
            });
            setImagePreview(URL.createObjectURL(file));
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
            if (editForm.image) {
                formData.append('image', editForm.image);
            }

            const response = await axios.put(
                `http://localhost:3000/api/products/${editingProduct.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                const productsResponse = await axios.get('http://localhost:3000/api/products');
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
            const response = await axios.delete(`http://localhost:3000/api/products/${productId}`);

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
        axios.get('http://localhost:3000/api/products')
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

    return (
        <>
            <div className="flex flex-row justify-between items-center rounded-lg mt-9 mr-28 ml-28">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-pink-600">🛍️ Panier: {order.length} article(s)</h2>
                    {order.length > 0 && (
                        <span className="text-sm text-gray-500">
                            Total: {order.reduce((total, product) => total + (product.price * product.quantity), 0)} DHS
                        </span>
                    )}
                </div>
                <button
                    disabled={order.length === 0}
                    onClick={() => setShowCheckout(true)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${order.length > 0
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
                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4 rounded-t-2xl">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                📝 Informations de commande
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
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

                            <div className="flex gap-3 pt-2">
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
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleBuy(order)}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    ✅ Confirmer et envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Description Modal */}
            {showDescriptionModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                📖 Description détaillée
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-white hover:text-gray-200 transition-colors text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedProduct.name}</h3>
                                    <p className="text-pink-600 font-semibold">{selectedProduct.price} DHS</p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Age:</span> {selectedProduct.age || 'Non spécifié'}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Description :</h4>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {selectedProduct.description}
                                </p>
                            </div>
                    {!authorized && 
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        handlePanier(selectedProduct.id);
                                        handleCloseModal();
                                    }}
                                    className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    🛒 Ajouter au panier
                                </button>
                    
                            </div>
}
                    </div>
                    </div>
                </div>
            )}

            { showEditModal && editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                ✏️ Modifier le produit
                            </h2>
                            <button
                                onClick={handleCloseEditModal}
                                className="text-white hover:text-gray-200 transition-colors text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
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

                            <div className="grid grid-cols-2 gap-3">
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
                                    Image du produit
                                </label>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleEditImageChange}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Laissez vide pour conserver l'image actuelle</p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCloseEditModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    💾 Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                    {allproducts.map((product) => {
                        return (
                            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 border border-gray-100 relative">
                                <div className="h-64 overflow-hidden bg-gray-50">
                                    <img src={product.image} alt={product.name} className="w-full h-full hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                                        {authorized && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleOpenEditModal(product)}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                                                    title="Modifier"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                    title="Supprimer"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <p className="text-gray-600 text-sm">
                                            {product.description.length > MAX_LENGTH
                                                ? `${product.description.slice(0, MAX_LENGTH)}...`
                                                : product.description}
                                        </p>
                                        {product.description.length > MAX_LENGTH && (
                                            <button
                                                onClick={() => handleOpenModal(product.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
                                            >
                                                Voir plus 📖
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Age:</span> {product.age || 'Non spécifié'}
                                    </p>
                                    <p className="text-xl font-bold text-pink-600">{product.price} DHS</p>
{!authorized &&
<>
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-gray-700">Quantité :</label>
                                        <select
                                            value={quantities[product.id] || 1}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                handleQuantitySelection(product.id, value);
                                            }}
                                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                         </div>
 
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handlePanier(product.id)}
                                            className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${cartStatus[product.id]
                                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                                    : 'bg-yellow-500 hover:bg-yellow-600 text-white hover:shadow-md'
                                                }`}
                                        >
                                            {cartStatus[product.id] ? '✅ Dans le panier' : '🛒 Ajouter au panier'}
                                        </button>

                                        {cartStatus[product.id] && (
                                            <button
                                                onClick={() => removeFromCart(product.id)}
                                                className="w-full px-4 py-1.5 text-sm rounded-lg font-medium bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                                            >
                                                Retirer du panier
                                            </button>
                                        )}
  </div>
  </>                                  
                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}