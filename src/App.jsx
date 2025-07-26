import { useState, useEffect } from 'react';
import { getProducts, uploadImageAndGetURL, updateProduct, deleteProduct, deleteProductImages } from './firebaseService';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

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

const ProductCard = ({ product, onClick, categoryNames }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div
        className="card h-100 border-0 shadow-sm"
        style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}
        onClick={onClick}
      >
        <div className="position-relative" style={{ height: '200px' }}>
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="img-fluid h-100 w-100"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center bg-light">
              <i className="fas fa-image fa-3x text-muted"></i>
            </div>
          )}
          <div className="position-absolute bottom-0 start-0 w-100 p-2">
            <div className="text-center text-white fw-bold py-1 bg-dark bg-opacity-75 rounded">
              {categoryNames[product.category] || product.category}
            </div>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text text-muted small">{product.reference}</p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">{product.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({ product, onClose, categoryNames }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enlarged, setEnlarged] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">{product.name}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="position-relative">
                  {product.images?.[currentImageIndex] ? (
                    <img
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      className="img-fluid rounded"
                      onClick={() => setEnlarged(true)}
                      style={{ height: '300px', width: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '300px' }}>
                      <i className="fas fa-image fa-5x text-muted"></i>
                    </div>
                  )}
                  {product.images?.length > 1 && (
                    <>
                      <button
                        className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle ms-2"
                        onClick={handlePrevImage}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button
                        className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle me-2"
                        onClick={handleNextImage}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </>
                  )}
                </div>
                <div className="d-flex mt-2">
                  {product.images?.map((img, index) => (
                    <div
                      key={index}
                      className={`border mx-1 ${currentImageIndex === index ? 'border-primary' : ''}`}
                      style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`Thumbnail ${index}`}
                          className="h-100 w-100"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center bg-light">
                          <i className="fas fa-image text-muted"></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <h6 className="text-muted small">Référence</h6>
                  <p>{product.reference}</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted small">Catégorie</h6>
                  <span className="badge bg-dark">
                    {categoryNames[product.category] || product.category}
                  </span>
                </div>
                {product.subcategory && (
                  <div className="mb-3">
                    <h6 className="text-muted small">Sous-catégorie</h6>
                    <p>{product.subcategory}</p>
                  </div>
                )}
                {product.dimension && (
                  <div className="mb-3">
                    <h6 className="text-muted small">Dimensions</h6>
                    <p>{product.dimension}</p>
                  </div>
                )}
                <div className="mb-3">
                  <h6 className="text-muted small">Description</h6>
                  <p>{product.description}</p>
                </div>
                <div className="bg-light p-3 rounded text-center">
                  <h6 className="text-muted small">Prix</h6>
                  <h4 className="fw-bold">{product.price}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-dark" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
      {enlarged && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1055 }}
          onClick={() => setEnlarged(false)}
        >
          <img
            src={product.images[currentImageIndex]}
            alt="Agrandie"
            className="img-fluid"
            style={{ maxHeight: '90%', maxWidth: '90%', cursor: 'zoom-out' }}
          />
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({
  newProduct,
  handleInputChange,
  handleImageUpload,
  handleSubmit,
  categoryNames,
  uploadProgress,
  onCancel,
  editingProduct,
  setEditingProduct,
  handleDeleteProduct,
  products
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      images: [...product.images, '', '', ''].slice(0, 4)
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    onCancel();
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h5>
          {editingProduct && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setConfirmDelete(true)}
            >
              <i className="fas fa-trash me-1"></i> Supprimer
            </button>
          )}
        </div>

        {confirmDelete && (
          <div className="card-body bg-light">
            <div className="alert alert-warning">
              <h5>Confirmer la suppression</h5>
              <p>Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete(false)}
                >
                  Annuler
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleDeleteProduct(editingProduct.id);
                    setConfirmDelete(false);
                  }}
                >
                  Confirmer la suppression
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Nom du produit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Catégorie</label>
                  <select
                    className="form-select"
                    value={newProduct.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {Object.entries(categoryNames).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Sous-catégorie (optionnel)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Référence</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Dimensions (optionnel)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.dimension}
                    onChange={(e) => handleInputChange('dimension', e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Prix</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={newProduct.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="col-lg-6">
                <h5 className="mb-3">Images du produit</h5>
                <div className="row g-3">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="col-md-6">
                      <div className="border rounded p-2">
                        <div
                          className="d-flex align-items-center justify-content-center bg-light"
                          style={{ height: '150px', position: 'relative' }}
                        >
                          {newProduct.images[index] ? (
                            <>
                              <img
                                src={newProduct.images[index]}
                                alt={`Preview ${index}`}
                                className="img-fluid h-100"
                                style={{ objectFit: 'contain' }}
                              />
                              {uploadProgress[index] > 0 && uploadProgress[index] < 100 && (
                                <div className="position-absolute bottom-0 w-100 bg-white">
                                  <div
                                    className="bg-primary"
                                    style={{
                                      height: '5px',
                                      width: `${uploadProgress[index]}%`
                                    }}
                                  ></div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-center text-muted">
                              <i className="fas fa-image fa-3x"></i>
                              <div className="mt-2">Image {index + 1}</div>
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) => handleImageUpload(index, e.target.files[0])}
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <small className="text-muted">
                    La première image est obligatoire et sera utilisée comme image principale.
                  </small>
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancelEdit}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-dark"
                disabled={!newProduct.images[0] || uploadProgress.some(p => p > 0 && p < 100)}
              >
                {uploadProgress.some(p => p > 0 && p < 100) ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Envoi en cours...
                  </>
                ) : (
                  editingProduct ? 'Mettre à jour' : 'Ajouter le produit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow mt-4">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Liste des produits</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Référence</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-light" style={{ width: '50px', height: '50px' }}>
                          <i className="fas fa-image text-muted"></i>
                        </div>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.reference}</td>
                    <td>{categoryNames[product.category] || product.category}</td>
                    <td>{product.price}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditProduct(product)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeCategory, onCategoryChange, onAdminToggle, showAdmin }) => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3" style={{
      width: '280px',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white'
    }}>
      <div className="d-flex align-items-center mb-4">
        <div className="rounded-circle bg-warning d-flex align-items-center justify-content-center me-3"
          style={{ width: '50px', height: '50px', border: '2px solid white' }}>
          <span className="fw-bold text-white">K</span>
        </div>
        <div>
          <h5 className="mb-0 fw-bold">KIMSOO</h5>
          <small className="text-muted">DESIGN & MOBILIER</small>
        </div>
      </div>

      <hr className="text-muted" />

      <div className="mb-3">
        <ul className="nav nav-pills flex-column">
          {Object.entries(categoryNames).map(([key, value]) => (
            <li key={key} className="nav-item mb-2">
              <button
                className={`nav-link text-white w-100 text-start rounded-pill ${activeCategory === key && !showAdmin ? 'bg-warning text-dark' : ''}`}
                onClick={() => onCategoryChange(key)}
                style={{
                  padding: '10px 15px',
                  border: 'none'
                }}
              >
                {value}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <button
          className="d-flex align-items-center text-white text-decoration-none bg-transparent border-0"
          onClick={onAdminToggle}
        >
          <i className={`fas ${showAdmin ? 'fa-store' : 'fa-user-cog'} me-2`}></i>
          {showAdmin ? 'Retour aux produits' : 'Administration'}
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('salon');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([0, 0, 0, 0]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    reference: '',
    dimension: '',
    description: '',
    price: '0 DH',
    images: ['', '', '', '']
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Erreur de chargement des produits:", error);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    try {
      const progressCallback = (progress) => {
        setUploadProgress(prev => {
          const newProgress = [...prev];
          newProgress[index] = progress;
          return newProgress;
        });
      };

      const url = await uploadImageAndGetURL(file, progressCallback);

      setNewProduct(prev => ({
        ...prev,
        images: prev.images.map((img, i) => i === index ? url : img)
      }));

      setUploadProgress(prev => {
        const newProgress = [...prev];
        newProgress[index] = 0;
        return newProgress;
      });
    } catch (error) {
      console.error("Erreur d'upload:", error);
      alert("Une erreur est survenue lors de l'upload de l'image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProduct.images[0]) {
      alert("Veuillez ajouter au moins une image pour le produit");
      return;
    }

    try {
      const productToSave = {
        ...newProduct,
        images: newProduct.images.filter(img => img)
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productToSave);
        setProducts(prev => prev.map(p =>
          p.id === editingProduct.id ? { ...p, ...productToSave } : p
        ));
        alert("Produit mis à jour avec succès !");
      } else {
        const docRef = await addDoc(collection(db, 'equipement'), productToSave);
        setProducts(prev => [...prev, { id: docRef.id, ...productToSave }]);
        alert("Produit ajouté avec succès !");
      }

      setNewProduct({
        name: '',
        category: '',
        subcategory: '',
        reference: '',
        dimension: '',
        description: '',
        price: '0 DH',
        images: ['', '', '', '']
      });
      setEditingProduct(null);
    } catch (error) {
      console.error("Erreur:", error);
      alert(`Une erreur est survenue lors de ${editingProduct ? 'la mise à jour' : 'l\'ajout'} du produit`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      const productToDelete = products.find(p => p.id === productId);
      if (productToDelete?.images) {
        await deleteProductImages(productToDelete.images);
      }

      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setEditingProduct(null);

      alert("Produit supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression du produit");
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setNewProduct({
        name: editingProduct.name,
        category: editingProduct.category,
        subcategory: editingProduct.subcategory || '',
        reference: editingProduct.reference,
        dimension: editingProduct.dimension || '',
        description: editingProduct.description,
        price: editingProduct.price,
        images: [...editingProduct.images, '', '', ''].slice(0, 4)
      });
      setShowAdmin(true);
    }
  }, [editingProduct]);

  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={(category) => {
          setActiveCategory(category);
          setShowAdmin(false);
          setEditingProduct(null);
        }}
        onAdminToggle={() => {
          setShowAdmin(!showAdmin);
          setEditingProduct(null);
        }}
        showAdmin={showAdmin}
      />

      <div className="flex-grow-1 bg-light">
        {showAdmin ? (
          <AdminPanel
            newProduct={newProduct}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            handleSubmit={handleSubmit}
            categoryNames={categoryNames}
            uploadProgress={uploadProgress}
            onCancel={() => {
              setEditingProduct(null);
              setNewProduct({
                name: '',
                category: '',
                subcategory: '',
                reference: '',
                dimension: '',
                description: '',
                price: '0 DH',
                images: ['', '', '', '']
              });
            }}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            handleDeleteProduct={handleDeleteProduct}
            products={products}
          />
        ) : (
          <>
            <div className="p-3 bg-white shadow-sm">
              <div className="container-fluid">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="input-group" style={{ maxWidth: '400px' }}>
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: 'none',
                        borderRadius: '20px'
                      }}
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <h4 className="mb-0 me-3">
                      {categoryNames[activeCategory] || activeCategory}
                    </h4>
                    <button className="btn btn-link text-dark">
                      <i className="fas fa-bars"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="container-fluid py-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
                  <h4 className="text-muted">Aucun produit trouvé</h4>
                  <p className="text-muted">
                    {searchTerm ? 'Essayez une autre recherche' : 'Ajoutez votre premier produit'}
                  </p>
                </div>
              ) : (
                <div className="row">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      categoryNames={categoryNames}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )
        }

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            categoryNames={categoryNames}
          />
        )}
      </div>
    </div>
  );
};

export default App;