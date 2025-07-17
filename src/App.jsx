import { useState, useEffect } from 'react';
import { getProducts } from './firebaseService';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
const cleanImageUrls = (images) => {
  if (!images || !Array.isArray(images)) return [];

  return images
    .map(url => {
      // Supprimer les guillemets et espaces
      const cleaned = String(url).replace(/['"]+/g, '').trim();
      // Vérifier que c'est une URL valide
      return cleaned.startsWith('http') ? cleaned : null;
    })
    .filter(url => url !== null); // Filtrer les URLs invalides
};
const AdminPanel = ({
  newProduct,
  handleInputChange,
  handleImageChange,
  handleSubmit,
  categoryNames
}) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Header */}
        <div className="bg-dark text-white p-3 mb-4 text-center">
          <h2 className="mb-0 fw-bold">Nouvelle articles</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Left Column - Form Fields */}
            <div className="col-lg-6">
              <div className="d-flex flex-column gap-3">
                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="nom de l'article"
                  value={newProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    fontSize: '14px'
                  }}
                />

                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="catégorie"
                  value={newProduct.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  required
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    fontSize: '14px'
                  }}
                />

                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="sous catégorie"
                  value={newProduct.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    fontSize: '14px'
                  }}
                />

                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="référence"
                  value={newProduct.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  required
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    fontSize: '14px'
                  }}
                />

                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="dimension"
                  value={newProduct.dimension}
                  onChange={(e) => handleInputChange('dimension', e.target.value)}
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    fontSize: '14px'
                  }}
                />

                <div>
                  <label className="form-label text-muted small">description du produit</label>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={newProduct.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    style={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="col-lg-6">
              <div className="row g-2">
                {newProduct.images.map((image, index) => (
                  <div key={index} className="col-6">
                    <div
                      className="d-flex align-items-center justify-content-center border"
                      style={{
                        height: '150px',
                        backgroundColor: '#f8f9fa',
                        borderStyle: 'dashed',
                        borderColor: '#dee2e6',
                        borderRadius: '4px'
                      }}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={`Aperçu ${index + 1}`}
                          className="img-fluid rounded"
                          style={{
                            maxHeight: '140px',
                            maxWidth: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted">
                          <div style={{ fontSize: '48px', color: '#d4af37' }}>photo</div>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      className="form-control mt-2"
                      placeholder={`URL Image ${index + 1}`}
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      style={{
                        fontSize: '12px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-dark px-4 py-2"
              style={{
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Ajouter le produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const categoryNames = {
  salon: 'Salon',
  canape: 'Canapé',
  lit: 'Lit',
  fauteuil: 'Fauteuil',
  'salon-jardin': 'Salon de jardin',
  'canape-jardin': 'Canapé de jardin',
  table: 'Table +',
  'table-basse': 'Table Basse',
  decoration: 'Décoration',
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('salon');
  const [modalProduct, setModalProduct] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    reference: '',
    dimension: '',
    description: '',
    price: '',
    images: ['', '', '', '']
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const firebaseProducts = await getProducts();
        const cleanedProducts = firebaseProducts.map(product => ({
          ...product,
          images: cleanImageUrls(product.images)
        }));
        setProducts(cleanedProducts);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const openModal = (product) => {
    setModalProduct(product);
  };

  const closeModal = () => {
    setModalProduct(null);
  };

  const handleAdminToggle = () => {
    setShowAdminPanel(!showAdminPanel);
  };

  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (index, value) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productToAdd = {
      ...newProduct,
      price: "0 DH",
      images: newProduct.images.filter(img => img.trim() !== '')
    };

    try {
      const docRef = await addDoc(collection(db, 'equipement'), productToAdd);
      setProducts(prev => [...prev, { id: docRef.id, ...productToAdd }]);

      setNewProduct({
        name: '',
        category: '',
        subcategory: '',
        reference: '',
        dimension: '',
        description: '',
        price: '',
        images: ['', '', '', '']
      });

      alert('Produit ajouté avec succès !');
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
      alert("Erreur lors de l'ajout du produit. Veuillez réessayer.");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          width: '280px',
          backgroundColor: '#1a1a1a',
          position: 'relative',
          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        {/* Logo */}
        <div className="p-4 border-bottom" style={{ borderColor: '#333' }}>
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#d4af37',
                border: '2px solid #fff'
              }}
            >
              <span className="text-white fw-bold" style={{ fontSize: '20px' }}>K</span>
            </div>
            <div>
              <h5 className="text-white mb-0 fw-bold">KIMSOO</h5>
              <small className="text-muted">DESIGN & MOBILIER</small>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3">
          {['salon', 'canape', 'lit', 'fauteuil', 'salon-jardin', 'canape-jardin', 'table', 'decoration'].map(category => (
            <button
              key={category}
              className={`btn w-100 mb-2 text-start rounded-pill ${activeCategory === category
                ? 'text-dark'
                : 'btn-link text-white text-decoration-none'
                }`}
              style={{
                backgroundColor: activeCategory === category ? '#d4af37' : 'transparent',
                border: 'none',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: activeCategory === category ? 'bold' : 'normal'
              }}
              onClick={() => {
                handleCategoryFilter(category);
                setShowAdminPanel(false);
              }}
            >
              {categoryNames[category] || category}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="position-absolute bottom-0 w-100 p-3 text-center">
          <div className="d-flex justify-content-center">
            <div className="text-white opacity-50" style={{ fontSize: '12px' }}>
              © 2024 KIMSOO
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <div className="bg-white shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center flex-grow-1 me-4">
              <div className="position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
                <input
                  type="text"
                  className="form-control rounded-pill ps-4"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    fontSize: '14px'
                  }}
                />
                <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ fontSize: '14px' }}></i>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button className="btn btn-link text-dark me-3">
                <i className="fas fa-bars" style={{ fontSize: '18px' }}></i>
              </button>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '35px',
                  height: '35px',
                  backgroundColor: '#1a1a1a',
                  cursor: 'pointer'
                }}
                onClick={handleAdminToggle}
              >
                <i className="fas fa-user text-white" style={{ fontSize: '14px' }}></i>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Panel */}
        {showAdminPanel ? (
          <AdminPanel
            newProduct={newProduct}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
            categoryNames={categoryNames}
          />
        ) : (
          /* Products Grid */
          <div className="p-4">
            <div className="row g-3">
              {filteredProducts.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <i className="fas fa-search fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">Aucun produit trouvé</h4>
                  <p className="text-muted">Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                    <div
                      className="card h-100 border-0 shadow-sm"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                      onClick={() => openModal(product)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div className="position-relative">
                        {product.images && product.images.length > 0 && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="card-img-top"
                            style={{
                              height: '200px',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{ height: '200px' }}
                          >
                            <i className="fas fa-image fa-3x text-muted"></i>
                          </div>
                        )}
                        <div className="position-absolute bottom-0 start-0 w-100 p-3">
                          <div
                            className="text-center text-white fw-bold py-2"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          >
                            {categoryNames[product.category] || product.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {modalProduct && (
        <Modal product={modalProduct} closeModal={closeModal} categoryNames={categoryNames} />
      )}
    </div>
  );
};

const Modal = ({ product, closeModal, categoryNames }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageChange = (direction) => {
    let newIndex = currentImageIndex + direction;
    if (newIndex >= product.images.length) newIndex = 0;
    if (newIndex < 0) newIndex = product.images.length - 1;
    setCurrentImageIndex(newIndex);
  };

  return (
    <div
      className="modal d-flex align-items-center justify-content-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1050,
        backdropFilter: 'blur(5px)'
      }}
      onClick={closeModal}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div className="modal-header bg-dark text-white border-0 p-4">
            <div>
              <h4 className="modal-title mb-1 fw-bold">{product.name}</h4>
              <small className="opacity-75">Référence: {product.reference}</small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={closeModal}
            ></button>
          </div>

          <div className="modal-body p-0">
            <div className="position-relative bg-light">
              {product.images && product.images.length > 0 && product.images[currentImageIndex] ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-100"
                  style={{
                    height: '350px',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '350px' }}
                >
                  <i className="fas fa-image fa-5x text-muted"></i>
                </div>
              )}

              {product.images && product.images.length > 1 && (
                <>
                  <button
                    className="btn btn-light btn-sm position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle"
                    style={{ width: '40px', height: '40px' }}
                    onClick={() => handleImageChange(-1)}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="btn btn-light btn-sm position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle"
                    style={{ width: '40px', height: '40px' }}
                    onClick={() => handleImageChange(1)}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>

            <div className="p-4">
              <div className="row">
                <div className="col-md-8">
                  <h6 className="text-uppercase text-muted small fw-bold mb-2">Description</h6>
                  <p className="text-dark mb-3">{product.description}</p>
                  <h6 className="text-uppercase text-muted small fw-bold mb-2">Catégorie</h6>
                  <span className="badge bg-dark text-white px-3 py-2 rounded-pill">
                    {categoryNames[product.category] || product.category}
                  </span>
                </div>
                <div className="col-md-4">
                  <div className="bg-light rounded-3 p-3 text-center">
                    <h6 className="text-uppercase text-muted small fw-bold mb-2">Prix</h6>
                    <div className="h3 text-dark fw-bold mb-0">{product.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 bg-light p-4">
            <button
              type="button"
              className="btn btn-dark rounded-pill px-4"
              onClick={closeModal}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;