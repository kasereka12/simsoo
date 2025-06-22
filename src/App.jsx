import { useState } from 'react';

// Base de données des produits (simulée)
const productsDatabase = [
  {
    id: 1,
    name: "Canapé d'angle Milano",
    reference: "CAN-MIL-001",
    category: "canape",
    price: "2 499 €",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
    ],
    description: "Canapé d'angle moderne en tissu premium avec coussins moelleux. Parfait pour votre salon contemporain."
  },
  {
    id: 2,
    name: "Table basse design Zen",
    reference: "TAB-ZEN-002",
    category: "table-basse",
    price: "599 €",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
    ],
    description: "Table basse au design épuré en bois massif et métal. Alliant élégance et fonctionnalité."
  },
  {
    id: 3,
    name: "Fauteuil Barcelona",
    reference: "FAU-BAR-003",
    category: "fauteuil",
    price: "1 299 €",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
    ],
    description: "Fauteuil iconique en cuir véritable. Un classique du design moderne."
  },
  {
    id: 4,
    name: "Lit coffre Stockholm",
    reference: "LIT-STO-004",
    category: "lit",
    price: "1 899 €",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"
    ],
    description: "Lit coffre avec tête de lit capitonnée. Rangement optimal et confort maximal."
  }
];

const categoryNames = {
  salon: 'Salon',
  canape: 'Canapé',
  lit: 'Lit',
  fauteuil: 'Fauteuil',
  'salon-jardin': 'Salon Jardin',
  'canape-jardin': 'Canapé Jardin',
  table: 'Table',
  'table-basse': 'Table Basse',
  decoration: 'Décoration',
};

const App = () => {
  const [products, setProducts] = useState(productsDatabase);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalProduct, setModalProduct] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const openModal = (product) => {
    setModalProduct(product);
  };

  const closeModal = () => {
    setModalProduct(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 0'
    }}>
      <div className="container">
        {/* Header avec design moderne */}
        <div className="text-center mb-5">
          <div className="bg-white rounded-4 shadow-lg p-4 mx-auto" style={{ maxWidth: '900px' }}>
            <h1 className="display-4 fw-bold text-primary mb-4">
              <i className="fas fa-couch me-3"></i>
              Showroom Mobilier
            </h1>

            {/* Barre de recherche */}
            <div className="row justify-content-center mb-4">
              <div className="col-md-6">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5 rounded-pill shadow-sm"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ border: '2px solid #e9ecef' }}
                  />
                  <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                </div>
              </div>
            </div>

            {/* Filtres de catégories */}
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {['all', 'canape', 'fauteuil', 'lit', 'table-basse', 'salon', 'decoration'].map(category => (
                <button
                  key={category}
                  className={`btn btn-sm rounded-pill px-3 py-2 ${activeCategory === category
                    ? 'btn-primary shadow-sm'
                    : 'btn-outline-primary'
                    }`}
                  onClick={() => handleCategoryFilter(category)}
                  style={{
                    minWidth: '80px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {category === 'all' ? 'Tous' : (categoryNames[category] || category)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grille des produits */}
        <div className="row g-4">
          {filteredProducts.length === 0 ? (
            <div className="col-12 text-center">
              <div className="bg-white rounded-4 shadow-sm p-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h3 className="text-muted">Aucun produit trouvé</h3>
                <p className="text-muted">Essayez de modifier vos critères de recherche</p>
              </div>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="col-xl-3 col-lg-4 col-md-6">
                <div
                  className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)'
                  }}
                  onClick={() => openModal(product)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="position-relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="card-img-top"
                      style={{
                        height: '220px',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-dark bg-opacity-75 rounded-pill px-2 py-1">
                        <i className="fas fa-images me-1"></i>
                        {product.images.length}
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 m-2">
                      <span className="badge bg-primary rounded-pill px-2 py-1">
                        {categoryNames[product.category] || product.category}
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-2">{product.name}</h5>
                    <p className="card-text text-muted small mb-2">
                      <i className="fas fa-tag me-1"></i>
                      Réf: {product.reference}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="h5 text-primary fw-bold mb-0">{product.price}</span>
                      <i className="fas fa-arrow-right text-primary"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {modalProduct && (
          <Modal product={modalProduct} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
};

const Modal = ({ product, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageChange = (direction) => {
    let newIndex = currentImageIndex + direction;
    if (newIndex >= product.images.length) newIndex = 0;
    if (newIndex < 0) newIndex = product.images.length - 1;
    setCurrentImageIndex(newIndex);
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
          {/* Header du modal */}
          <div className="modal-header bg-primary text-white border-0 p-4">
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

          {/* Corps du modal */}
          <div className="modal-body p-0">
            {/* Carrousel d'images */}
            <div className="position-relative bg-light">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-100"
                style={{
                  height: '300px',
                  objectFit: 'cover'
                }}
              />

              {/* Boutons de navigation */}
              {product.images.length > 1 && (
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

              {/* Indicateurs */}
              {product.images.length > 1 && (
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                  <div className="d-flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm rounded-circle ${currentImageIndex === index ? 'btn-primary' : 'btn-outline-light'
                          }`}
                        style={{ width: '12px', height: '12px', padding: 0 }}
                        onClick={() => handleDotClick(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Informations du produit */}
            <div className="p-4">
              <div className="row">
                <div className="col-md-8">
                  <h6 className="text-uppercase text-muted small fw-bold mb-2">Description</h6>
                  <p className="text-dark mb-3">{product.description}</p>

                  <h6 className="text-uppercase text-muted small fw-bold mb-2">Catégorie</h6>
                  <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                    {categoryNames[product.category] || product.category}
                  </span>
                </div>
                <div className="col-md-4">
                  <div className="bg-light rounded-3 p-3 text-center">
                    <h6 className="text-uppercase text-muted small fw-bold mb-2">Prix</h6>
                    <div className="h3 text-primary fw-bold mb-0">{product.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer du modal */}
          <div className="modal-footer border-0 bg-light p-4">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
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