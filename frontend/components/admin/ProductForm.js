'use client';
import { useState } from 'react';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductForm({ initialData, onSubmit, onCancel }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(initialData || {
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    brand: 'ABSENCE',
    price: '',
    comparePrice: '',
    costPrice: '',
    discount: { type: 'percentage', value: 0 },
    category: [],
    gender: 'unisex',
    ageGroup: 'adult',
    attributes: {
      material: '100% Cotton',
      fit: 'regular',
      neckType: 'round',
      sleeveType: 'half',
      pattern: 'plain',
      gsm: 180
    },
    variants: [],
    sizeChart: {},
    shipping: {
      weight: 250,
      freeShipping: true,
      deliveryTime: '3-5 days'
    },
    tags: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },
    featured: false,
    newArrival: false
  });

  const [currentVariant, setCurrentVariant] = useState({
    color: '',
    colorCode: '#000000',
    images: [],
    imageFiles: [], // For file upload
    sizes: [
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 0 }
    ]
  });

  const [mainImages, setMainImages] = useState([]);
  const [mainImageFiles, setMainImageFiles] = useState([]);

  // Handle main image upload - ADD to existing images
  const handleMainImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Add new files to existing files
    setMainImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs and add to existing previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setMainImages(prev => [...prev, ...newPreviews]);
  };

  // Handle variant image upload - ADD to existing images
  const handleVariantImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setCurrentVariant(prev => ({
      ...prev,
      imageFiles: [...(prev.imageFiles || []), ...files],
      images: [...(prev.images || []), ...newPreviews.map(url => ({ url }))]
    }));
  };

  // Remove main image
  const removeMainImage = (index) => {
    setMainImages(prev => prev.filter((_, i) => i !== index));
    setMainImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove variant image
  const removeVariantImage = (index) => {
    setCurrentVariant(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  // Auto-generate slug from name
  const handleNameChange = (name) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));
  };

  // Add variant
  const addVariant = () => {
    if (!currentVariant.color) {
      toast.error('Please enter color name');
      return;
    }
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ...currentVariant }]
    }));
    setCurrentVariant({
      color: '',
      colorCode: '#000000',
      images: [],
      imageFiles: [],
      sizes: [
        { size: 'S', stock: 0 },
        { size: 'M', stock: 0 },
        { size: 'L', stock: 0 },
        { size: 'XL', stock: 0 }
      ]
    });
    toast.success('Variant added!');
  };

  // Remove variant
  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'variants', label: 'Variants' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'seo', label: 'SEO' }
  ];

  return (
    <div className="bg-card border border-border rounded-2xl">
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          // Pass both formData and image files
          onSubmit(formData, mainImageFiles); 
        }}>
          
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  placeholder="Classic Black Oversized Tee"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Slug (Auto-generated)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-muted focus:outline-none focus:border-accent"
                  placeholder="classic-black-oversized-tee"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  placeholder="Premium oversized tee in classic black"
                  maxLength={150}
                />
                <p className="text-xs text-muted mt-1">{formData.shortDescription?.length || 0}/150 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  rows="5"
                  placeholder="Detailed product description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Category * (Multiple Select)</label>
                <div className="grid grid-cols-3 gap-3">
                  {['t-shirt', 'oversized', 'printed', 'plain', 'graphic', 'minimal'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 px-4 py-3 bg-bg border border-border rounded-lg cursor-pointer hover:border-accent transition">
                      <input
                        type="checkbox"
                        checked={formData.category?.includes(cat)}
                        onChange={(e) => {
                          const categories = formData.category || [];
                          if (e.target.checked) {
                            setFormData({ ...formData, category: [...categories, cat] });
                          } else {
                            setFormData({ ...formData, category: categories.filter(c => c !== cat) });
                          }
                        }}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-text capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
                {formData.category?.length > 0 && (
                  <p className="text-xs text-accent mt-2 font-semibold">
                    Selected: {formData.category.join(', ')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Age Group</label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  >
                    <option value="adult">Adult</option>
                    <option value="teen">Teen</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags?.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  placeholder="streetwear, trending, summer, oversized"
                />
                <p className="text-xs text-muted mt-1">Separate tags with commas</p>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Selling Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    placeholder="1299"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">MRP (Compare Price)</label>
                  <input
                    type="number"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    placeholder="1999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Cost Price</label>
                  <input
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    placeholder="800"
                  />
                </div>
              </div>

              {formData.price && formData.comparePrice && (
                <div className="p-4 bg-hover rounded-lg">
                  <p className="text-sm text-muted">
                    Discount: <span className="text-accent font-bold">
                      {Math.round(((formData.comparePrice - formData.price) / formData.comparePrice) * 100)}% OFF
                    </span>
                  </p>
                  {formData.costPrice && (
                    <p className="text-sm text-muted mt-1">
                      Profit Margin: <span className="text-green-500 font-bold">
                        ₹{formData.price - formData.costPrice} ({Math.round(((formData.price - formData.costPrice) / formData.price) * 100)}%)
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Attributes Tab */}
          {activeTab === 'attributes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Material</label>
                  <input
                    type="text"
                    value={formData.attributes.material}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      attributes: { ...formData.attributes, material: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    placeholder="100% Cotton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">GSM (Fabric Weight)</label>
                  <input
                    type="number"
                    value={formData.attributes.gsm}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      attributes: { ...formData.attributes, gsm: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    placeholder="180"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Fit</label>
                  <select
                    value={formData.attributes.fit}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      attributes: { ...formData.attributes, fit: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  >
                    <option value="regular">Regular</option>
                    <option value="oversized">Oversized</option>
                    <option value="slim">Slim</option>
                    <option value="relaxed">Relaxed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Neck Type</label>
                  <select
                    value={formData.attributes.neckType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      attributes: { ...formData.attributes, neckType: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  >
                    <option value="round">Round Neck</option>
                    <option value="v-neck">V-Neck</option>
                    <option value="collar">Collar</option>
                    <option value="henley">Henley</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Sleeve Type</label>
                  <select
                    value={formData.attributes.sleeveType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      attributes: { ...formData.attributes, sleeveType: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  >
                    <option value="half">Half Sleeve</option>
                    <option value="full">Full Sleeve</option>
                    <option value="sleeveless">Sleeveless</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Pattern</label>
                  <select
                    value={formData.attributes.pattern}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      attributes: { ...formData.attributes, pattern: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  >
                    <option value="plain">Plain</option>
                    <option value="printed">Printed</option>
                    <option value="graphic">Graphic</option>
                    <option value="striped">Striped</option>
                    <option value="checked">Checked</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div className="space-y-6">
              {/* Main Product Images */}
              <div className="p-4 bg-hover rounded-lg border border-border">
                <h3 className="font-bold text-text mb-4">Main Product Images</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-text mb-2">Upload Images (Multiple)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-bg file:font-semibold hover:file:scale-105 file:transition-transform"
                  />
                  <p className="text-xs text-muted mt-1">Select multiple images (JPG, PNG, WebP)</p>
                </div>

                {/* Image Preview */}
                {mainImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {mainImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img} 
                          alt={`Preview ${idx + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border-2 border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeMainImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-hover rounded-lg border border-border">
                <h3 className="font-bold text-text mb-4">Add Color Variant</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Color Name</label>
                    <input
                      type="text"
                      value={currentVariant.color}
                      onChange={(e) => setCurrentVariant({ ...currentVariant, color: e.target.value })}
                      className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                      placeholder="Black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Color Code</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={currentVariant.colorCode}
                        onChange={(e) => setCurrentVariant({ ...currentVariant, colorCode: e.target.value })}
                        className="w-16 h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={currentVariant.colorCode}
                        onChange={(e) => setCurrentVariant({ ...currentVariant, colorCode: e.target.value })}
                        className="flex-1 px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Variant Images */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-text mb-2">Variant Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleVariantImageUpload}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-bg file:font-semibold hover:file:scale-105 file:transition-transform"
                  />
                  
                  {/* Variant Image Preview */}
                  {currentVariant.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {currentVariant.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={img.url} 
                            alt={`Variant ${idx + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border-2 border-border"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-text mb-2">Sizes & Stock</label>
                  <div className="grid grid-cols-4 gap-3">
                    {currentVariant.sizes.map((sizeObj, idx) => (
                      <div key={idx}>
                        <label className="block text-xs text-muted mb-1">{sizeObj.size}</label>
                        <input
                          type="number"
                          value={sizeObj.stock}
                          onChange={(e) => {
                            const newSizes = [...currentVariant.sizes];
                            newSizes[idx].stock = parseInt(e.target.value) || 0;
                            setCurrentVariant({ ...currentVariant, sizes: newSizes });
                          }}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full px-4 py-3 bg-accent text-bg font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add Variant
                </button>
              </div>

              {/* Added Variants */}
              {formData.variants.length > 0 && (
                <div>
                  <h3 className="font-bold text-text mb-3">Added Variants ({formData.variants.length})</h3>
                  <div className="space-y-3">
                    {formData.variants.map((variant, idx) => (
                      <div key={idx} className="p-4 bg-hover rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg border-2 border-border"
                              style={{ backgroundColor: variant.colorCode }}
                            ></div>
                            <div>
                              <p className="font-semibold text-text">{variant.color}</p>
                              <p className="text-sm text-muted">
                                Stock: {variant.sizes.reduce((sum, s) => sum + s.stock, 0)} units
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVariant(idx)}
                            className="p-2 hover:bg-card rounded-lg text-red-500 transition"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        
                        {/* Variant Images Preview */}
                        {variant.images && variant.images.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto">
                            {variant.images.map((img, imgIdx) => (
                              <img 
                                key={imgIdx}
                                src={img.url} 
                                alt={`${variant.color} ${imgIdx + 1}`}
                                className="w-16 h-16 object-cover rounded border border-border"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Weight (grams)</label>
                  <input
                    type="number"
                    value={formData.shipping.weight}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      shipping: { ...formData.shipping, weight: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    placeholder="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Delivery Time</label>
                  <input
                    type="text"
                    value={formData.shipping.deliveryTime}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      shipping: { ...formData.shipping, deliveryTime: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    placeholder="3-5 days"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="freeShipping"
                  checked={formData.shipping.freeShipping}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    shipping: { ...formData.shipping, freeShipping: e.target.checked }
                  })}
                  className="w-5 h-5 accent-accent"
                />
                <label htmlFor="freeShipping" className="text-text font-semibold">
                  Free Shipping
                </label>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    seo: { ...formData.seo, metaTitle: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  placeholder="Classic Black Oversized Tee - ABSENCE"
                  maxLength={60}
                />
                <p className="text-xs text-muted mt-1">{formData.seo.metaTitle?.length || 0}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Meta Description</label>
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    seo: { ...formData.seo, metaDescription: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  rows="3"
                  placeholder="Premium oversized t-shirt in classic black. 100% cotton, perfect fit."
                  maxLength={160}
                />
                <p className="text-xs text-muted mt-1">{formData.seo.metaDescription?.length || 0}/160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={formData.seo.keywords?.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    seo: { ...formData.seo, keywords: e.target.value.split(',').map(k => k.trim()) }
                  })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  placeholder="oversized tee, black t-shirt, streetwear"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-text">Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-text">New Arrival</span>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-hover text-text font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-accent text-bg font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
