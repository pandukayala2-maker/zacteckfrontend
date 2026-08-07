import React, { useState, useEffect, FormEvent } from 'react';
import { useData } from '../context/DataContext';
import { 
  ShoppingBag, Edit, Trash, Plus, Check, Info, Upload, 
  Search, Grid, FolderTree, TrendingUp, Eye, MoreVertical, 
  Filter, RotateCcw, Package, X 
} from 'lucide-react';
import { Item, Subcategory } from '../types';

interface ItemManagerProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
const PRESET_IMAGES = [
  { name: 'Polo T-Shirt (Beige)', url: '/images/polo_tshirt.jpg' },
  { name: 'Men\'s Vest (White Pack)', url: '/images/mens_vest.jpg' },
  { name: 'General Apparel Item', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60' },
  { name: 'Corporate Trading Package', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60' },
  { name: 'Sea Shark environmental Logo', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=60' }
];

export default function ItemManager({ onNotify }: ItemManagerProps) {
  const { categories, subcategories, items, setItems } = useData();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCatId, setFilterCatId] = useState('all');
  const [filterSubcatId, setFilterSubcatId] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('150');
  const [catId, setCatId] = useState('');
  const [subcatId, setSubcatId] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [customSizes, setCustomSizes] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('QAR 45.00');
  
  // Extra Details
  const [origin, setOrigin] = useState('Made in India');
  const [fabric, setFabric] = useState('');
  const [packaging, setPackaging] = useState('');

  // Image Upload Mode state ('upload' | 'url' | 'presets')
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'presets'>('upload');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onNotify('error', 'File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          onNotify('success', 'Product image uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Subcategories helper
  const [filteredSubcats, setFilteredSubcats] = useState<Subcategory[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Dynamic filter for subcategory dropdown in the search bar
  const searchSubcatsList = filterCatId === 'all' 
    ? subcategories 
    : subcategories.filter(sc => sc.categoryId === filterCatId);

  // Filter subcategories when modal category changes
  useEffect(() => {
    if (catId) {
      setFilteredSubcats(subcategories.filter(sc => sc.categoryId === catId));
    } else {
      setFilteredSubcats([]);
    }
  }, [catId, subcategories]);

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setEditingItemId(null);
    setName('');
    setBrand('');
    setSku('');
    setStock('150');
    setCatId('');
    setSubcatId('');
    setSelectedSizes([]);
    setCustomSizes('');
    setDescription('');
    setImageUrl('');
    setPrice('QAR 45.00');
    setOrigin('Made in India');
    setFabric('');
    setPackaging('');
    setIsFormOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !catId || !subcatId) {
      onNotify('error', 'Please fill in the Product Name, Category, and Subcategory.');
      return;
    }

    let finalSizes = [...selectedSizes];
    if (customSizes.trim()) {
      const extra = customSizes.split(',').map(s => s.trim()).filter(Boolean);
      finalSizes = Array.from(new Set([...finalSizes, ...extra]));
    }

    if (finalSizes.length === 0) {
      finalSizes = ["Free Size"];
    }

    const finalImage = imageUrl.trim() || PRESET_IMAGES[0].url;

    if (isEditing && editingItemId) {
      setItems(items.map(item => item.id === editingItemId ? {
        ...item,
        name: name.trim(),
        brand: brand.trim() || 'ONN Premiums',
        sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
        stock: parseInt(stock) || 100,
        categoryId: catId,
        subcategoryId: subcatId,
        sizes: finalSizes,
        description: description.trim(),
        imageUrl: finalImage,
        price: price.trim() || 'Wholesale (Contact for Quote)'
      } : item));
      onNotify('success', `Product "${name}" updated successfully!`);
    } else {
      const newItem: Item = {
        id: `item-${Date.now()}`,
        name: name.trim(),
        brand: brand.trim() || 'ONN Premiums',
        sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
        stock: parseInt(stock) || 100,
        categoryId: catId,
        subcategoryId: subcatId,
        sizes: finalSizes,
        status: 'Active',
        description: description.trim(),
        imageUrl: finalImage,
        price: price.trim() || 'Wholesale (Contact for Quote)'
      };
      setItems([...items, newItem]);
      onNotify('success', `Product "${name}" added to catalog!`);
    }

    handleResetForm();
  };

  const handleEditClick = (item: Item) => {
    setIsEditing(true);
    setEditingItemId(item.id);
    setName(item.name);
    setBrand(item.brand || '');
    setSku(item.sku || '');
    setStock((item.stock || 150).toString());
    setCatId(item.categoryId);
    setSubcatId(item.subcategoryId);
    setSelectedSizes(item.sizes || []);
    setDescription(item.description || '');
    setImageUrl(item.imageUrl || '');
    setPrice(item.price || '');
    setIsFormOpen(true);
  };

  const handleDeleteItem = (id: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
      setItems(items.filter(i => i.id !== id));
      onNotify('error', `Product "${itemName}" deleted.`);
    }
  };

  const handleOpenAddForm = () => {
    handleResetForm();
    if (categories.length > 0) {
      setCatId(categories[0].id);
      const sub = subcategories.filter(sc => sc.categoryId === categories[0].id);
      if (sub.length > 0) {
        setSubcatId(sub[0].id);
      }
    }
    setIsFormOpen(true);
  };

  const filteredItems = items.filter(item => {
    const itemName = item?.name || '';
    const itemBrand = item?.brand || '';
    const itemSku = item?.sku || '';

    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          itemBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          itemSku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCatId === 'all' || item.categoryId === filterCatId;
    const matchesSubcategory = filterSubcatId === 'all' || item.subcategoryId === filterSubcatId;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Garments';
  const getSubcategoryName = (id: string) => subcategories.find(sc => sc.id === id)?.name || 'General';

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* 1. Action Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={handleOpenAddForm} className="btn btn-primary" style={styles.headerBtn}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="kpi-stats-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-purple">
            <ShoppingBag size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Products</span>
            <span className="kpi-value">{items.length}</span>
            <span className="kpi-subtext">Items in catalog</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-green">
            <Grid size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Categories</span>
            <span className="kpi-value">{categories.length}</span>
            <span className="kpi-subtext">Product groups</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-blue">
            <FolderTree size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Subcategories</span>
            <span className="kpi-value">{subcategories.length}</span>
            <span className="kpi-subtext">Classifications</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-purple">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Views</span>
            <span className="kpi-value">4,120</span>
            <span className="kpi-subtext">Product engagements</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="glass-panel" style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            className="form-control"
            placeholder="Search products by SKU, name, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filtersGroup}>
          <select
            className="form-control"
            value={filterCatId}
            onChange={(e) => {
              setFilterCatId(e.target.value);
              setFilterSubcatId('all');
            }}
            style={styles.filterSelect}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="form-control"
            value={filterSubcatId}
            onChange={(e) => setFilterSubcatId(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Subcategories</option>
            {searchSubcatsList.map(sc => (
              <option key={sc.id} value={sc.id}>{sc.name}</option>
            ))}
          </select>

          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCatId('all');
              setFilterSubcatId('all');
              setFilterStatus('all');
            }}
            className="btn btn-secondary"
            style={styles.resetBtn}
            title="Reset Filters"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* 4. Products Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>IMAGE</th>
                <th>PRODUCT DETAILS</th>
                <th>CATEGORY / SUBCAT</th>
                <th>SKU / STOCK</th>
                <th>SIZES</th>
                <th>STATUS</th>
                <th style={{ width: '100px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const sizesList = item.sizes || ["M", "L", "XL"];
                  const displaySizes = sizesList.slice(0, 4);
                  const extraCount = sizesList.length - 4;

                  return (
                    <tr key={item.id}>
                      {/* IMAGE */}
                      <td>
                        <div style={styles.tableImgThumb}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e: any) => {
                              e.target.src = 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60';
                            }}
                          />
                        </div>
                      </td>

                      {/* PRODUCT DETAILS */}
                      <td>
                        <div>
                          <strong style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: '700' }}>{item.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            Brand: {item.brand || 'ONN Premiums'}
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY / SUBCAT */}
                      <td>
                        <div>
                          <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.85rem' }}>
                            {getCategoryName(item.categoryId)}
                          </span>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {getSubcategoryName(item.subcategoryId)}
                          </div>
                        </div>
                      </td>

                      {/* SKU / STOCK */}
                      <td>
                        <div>
                          <code>{item.sku || `SKU-${item.id.slice(-4)}`}</code>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            Stock: {item.stock || 450} pcs
                          </div>
                        </div>
                      </td>

                      {/* SIZES */}
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {displaySizes.map((sz, idx) => (
                            <span key={idx} style={styles.sizePillBadge}>{sz}</span>
                          ))}
                          {extraCount > 0 && (
                            <span style={{ ...styles.sizePillBadge, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                              +{extraCount}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span className="status-badge active">
                          &bull; Active
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => handleEditClick(item)}
                            style={styles.actionIconBtn} 
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            style={{ ...styles.actionIconBtn, color: '#f87171' }} 
                            title="Delete Product"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="pagination-container">
          <span className="pagination-info">
            Showing 1 to {filteredItems.length} of {items.length} entries
          </span>
          <div className="pagination-actions">
            <button className="pagination-btn" disabled>&larr;</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn" disabled>&rarr;</button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal Overlay */}
      {isFormOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsFormOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()} className="glass-panel animate-fade-in">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <Package size={18} color="var(--color-primary)" /> {isEditing ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button style={styles.modalCloseBtn} onClick={() => setIsFormOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div style={styles.formGrid}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. ONN Premium Polo T-Shirt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Brand Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. ONN Premiums"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    className="form-control"
                    value={catId}
                    onChange={(e) => {
                      setCatId(e.target.value);
                      const sub = subcategories.filter(sc => sc.categoryId === e.target.value);
                      if (sub.length > 0) setSubcatId(sub[0].id);
                    }}
                    required
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subcategory *</label>
                  <select
                    className="form-control"
                    value={subcatId}
                    onChange={(e) => setSubcatId(e.target.value)}
                    required
                  >
                    {filteredSubcats.map(sc => (
                      <option key={sc.id} value={sc.id}>{sc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label>SKU Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. ONN-TS-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="450"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Available Sizes</label>
                <div style={styles.pillContainer}>
                  {SIZE_OPTIONS.map(size => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      style={{
                        ...styles.modalSizeBtn,
                        backgroundColor: selectedSizes.includes(size) ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                        borderColor: selectedSizes.includes(size) ? 'var(--color-primary)' : 'var(--color-border)',
                        color: selectedSizes.includes(size) ? '#fff' : 'var(--color-text-secondary)'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Image Upload UI */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0, fontWeight: '600', color: '#fff' }}>Product Image *</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        border: '1px solid',
                        cursor: 'pointer',
                        backgroundColor: imageMode === 'upload' ? 'var(--color-primary)' : 'rgba(255,255,255,0.04)',
                        borderColor: imageMode === 'upload' ? 'var(--color-primary)' : 'var(--color-border)',
                        color: imageMode === 'upload' ? '#fff' : 'var(--color-text-secondary)'
                      }}
                    >
                      <Upload size={12} style={{ marginRight: '4px' }} /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        border: '1px solid',
                        cursor: 'pointer',
                        backgroundColor: imageMode === 'url' ? 'var(--color-primary)' : 'rgba(255,255,255,0.04)',
                        borderColor: imageMode === 'url' ? 'var(--color-primary)' : 'var(--color-border)',
                        color: imageMode === 'url' ? '#fff' : 'var(--color-text-secondary)'
                      }}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('presets')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        border: '1px solid',
                        cursor: 'pointer',
                        backgroundColor: imageMode === 'presets' ? 'var(--color-primary)' : 'rgba(255,255,255,0.04)',
                        borderColor: imageMode === 'presets' ? 'var(--color-primary)' : 'var(--color-border)',
                        color: imageMode === 'presets' ? '#fff' : 'var(--color-text-secondary)'
                      }}
                    >
                      Presets
                    </button>
                  </div>
                </div>

                {/* Live Thumbnail Preview */}
                {imageUrl && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '12px'
                  }}>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{ width: '54px', height: '54px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                      onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>Image Attached</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {imageUrl.startsWith('data:') ? 'Custom Uploaded Image File' : imageUrl}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                      title="Remove Image"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                )}

                {/* File Drag-and-Drop Area */}
                {imageMode === 'upload' && (
                  <div style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: '12px',
                    padding: '20px 16px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <Upload size={26} color="var(--color-primary)" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
                      Click to choose image or drag &amp; drop file here
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Supports PNG, JPG, WEBP, SVG (Max 5MB)
                    </div>
                  </div>
                )}

                {/* Direct URL Input */}
                {imageMode === 'url' && (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Paste image URL (e.g. https://example.com/item.jpg)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                )}

                {/* Presets Grid */}
                {imageMode === 'presets' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: imageUrl === preset.url ? 'var(--color-primary)' : 'var(--color-border)',
                          backgroundColor: imageUrl === preset.url ? 'rgba(211,30,37,0.15)' : 'rgba(255,255,255,0.02)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <img src={preset.url} alt={preset.name} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                        <span style={{ fontSize: '0.65rem', color: '#fff', textAlign: 'center', lineHeight: '1.2' }}>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Detailed product descriptions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> {isEditing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  headerBtn: {
    padding: '10px 18px',
    fontSize: '0.9rem',
  },
  filterBar: {
    padding: '14px 20px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    width: '100%',
  },
  searchWrapper: {
    position: 'relative',
    flex: '1.5',
    minWidth: '220px',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
  },
  searchInput: {
    paddingLeft: '42px',
    height: '42px',
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
  },
  filtersGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '2.5',
    justifyContent: 'flex-end',
  },
  filterSelect: {
    height: '42px',
    fontSize: '0.85rem',
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    flex: '1',
    minWidth: '140px',
    maxWidth: '200px',
  },
  resetBtn: {
    height: '42px',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    padding: '0 16px',
    flexShrink: 0,
  },
  tableImgThumb: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#1b223c',
  },
  sizePillBadge: {
    fontSize: '0.7rem',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
  },
  actionIconBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '650px',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: '#0c0f1b',
    borderRadius: '16px',
    border: '1px solid var(--color-border)',
    padding: '24px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  pillContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '6px',
  },
  modalSizeBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
  }
};
