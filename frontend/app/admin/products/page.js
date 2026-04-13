'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductForm from '@/components/admin/ProductForm';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    api.get('/products')
      .then(res => {
        const productData = res.data.products || res.data;
        setProducts(Array.isArray(productData) ? productData : []);
      })
      .catch(err => {
        console.error(err);
        setProducts([]);
      });
  };

  const handleSubmit = async (formData, imageFiles) => {
    try {
      const formDataToSend = new FormData();
      
      // Add all images to FormData
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formDataToSend.append('images', file);
        });
      }
      
      // Add product data as JSON string
      formDataToSend.append('data', JSON.stringify(formData));
      
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product created successfully!');
      }
      
      setShowModal(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted!');
        loadProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const getTotalStock = (product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total, variant) => {
        return total + variant.sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
      }, 0);
    }
    return product.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;
  };

  return (
    <div className="bg-bg min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Products</h1>
          <p className="text-muted">{products.length} total products</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-bg font-bold rounded-2xl hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto overflow-y-hidden rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1120px]">
          <thead className="bg-hover border-b border-border">
            <tr>
              <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-text">Product</th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-text">Category</th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-text">Price</th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-text">Variants</th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-text">Stock</th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-text">Status</th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-text">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b border-border hover:bg-hover transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {(product.images?.[0] || product.variants?.[0]?.images?.[0]) && (
                        <img 
                          src={product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url} 
                          alt="" 
                          className="w-12 h-12 object-cover rounded-lg border border-border" 
                        />
                      )}
                      <div>
                        <p className="font-semibold text-text">{product.name}</p>
                        <p className="text-xs text-muted">{product.brand || 'ABSENCE'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(product.category) && product.category.length > 0 ? (
                        product.category.map((cat, idx) => (
                          <span key={idx} className="px-2 py-1 bg-hover border border-border rounded-full text-xs text-muted capitalize">
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-hover border border-border rounded-full text-xs text-muted capitalize">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-accent font-bold">₹{product.price}</p>
                      {product.comparePrice && (
                        <p className="text-xs text-muted line-through">₹{product.comparePrice}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.variants && product.variants.length > 0 ? (
                      <div className="flex gap-1">
                        {product.variants.slice(0, 3).map((variant, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-border"
                            style={{ backgroundColor: variant.colorCode }}
                            title={variant.color}
                          />
                        ))}
                        {product.variants.length > 3 && (
                          <span className="text-xs text-muted ml-1">+{product.variants.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted text-sm">No variants</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${getTotalStock(product) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {getTotalStock(product)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {product.featured && (
                        <span className="px-2 py-1 bg-accent text-bg text-xs rounded-full font-bold">
                          Featured
                        </span>
                      )}
                      {product.newArrival && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-bold">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`/product/${product.slug}`, '_blank')}
                        className="p-2 hover:bg-card rounded-lg text-muted hover:text-text transition"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-card rounded-lg text-muted hover:text-text transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 hover:bg-card rounded-lg text-red-500 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-hover rounded-full flex items-center justify-center">
                      <Plus size={32} className="text-muted" />
                    </div>
                    <p className="text-muted text-lg">No products yet</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-6 py-2 bg-accent text-bg font-bold rounded-lg hover:scale-105 transition-transform"
                    >
                      Add Your First Product
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-4xl my-8">
            <ProductForm
              initialData={editingProduct}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowModal(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
