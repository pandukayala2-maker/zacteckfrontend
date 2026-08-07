import React, { useState, FormEvent } from 'react';
import { useData } from '../context/DataContext';
import { 
  FolderPlus, Edit2, Trash2, Save, X, Info, Search, 
  Filter, Plus, Folder, Package, TrendingUp, MoreVertical, Check 
} from 'lucide-react';
import { Subcategory } from '../types';

interface SubcategoryManagerProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function SubcategoryManager({ onNotify }: SubcategoryManagerProps) {
  const { categories, subcategories, setSubcategories, items } = useData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [subcatName, setSubcatName] = useState('');
  const [subcatDesc, setSubcatDesc] = useState('');
  const [parentId, setParentId] = useState('');

  const handleOpenAddModal = () => {
    setEditId(null);
    setSubcatName('');
    setSubcatDesc('');
    setParentId(categories[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subcat: Subcategory) => {
    setEditId(subcat.id);
    setSubcatName(subcat.name);
    setSubcatDesc(subcat.description || '');
    setParentId(subcat.categoryId);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subcatName.trim() || !parentId) {
      onNotify('error', 'Please fill in the subcategory name and select a parent category.');
      return;
    }

    if (editId) {
      setSubcategories(subcategories.map(sc => 
        sc.id === editId ? { 
          ...sc, 
          name: subcatName.trim(), 
          description: subcatDesc.trim(), 
          categoryId: parentId 
        } : sc
      ));
      onNotify('success', 'Subcategory updated successfully!');
    } else {
      const id = `subcat-${Date.now()}`;
      const newSubcat: Subcategory = {
        id,
        categoryId: parentId,
        name: subcatName.trim(),
        description: subcatDesc.trim(),
        status: 'Active',
        productCount: 0
      };
      setSubcategories([...subcategories, newSubcat]);
      onNotify('success', 'Subcategory added successfully!');
    }

    setIsModalOpen(false);
    setSubcatName('');
    setSubcatDesc('');
  };

  const handleDeleteSubcategory = (id: string, name: string) => {
    const hasItems = items.some(i => i.subcategoryId === id);

    if (hasItems) {
      if (!confirm(`Warning: The subcategory "${name}" contains products. Deleting it will leave those products orphaned. Are you sure you want to delete it?`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete subcategory "${name}"?`)) {
        return;
      }
    }

    setSubcategories(subcategories.filter(sc => sc.id !== id));
    onNotify('error', `Subcategory "${name}" deleted.`);
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : 'Apparel & Garments';
  };

  const getParentCategoryPill = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes('garment') || lower.includes('apparel')) {
      return { bg: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', border: 'rgba(139, 92, 246, 0.3)' };
    }
    if (lower.includes('corporate') || lower.includes('service')) {
      return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
    }
    return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
  };

  const filteredSubcategories = subcategories.filter(sc => {
    const name = sc?.name || '';
    const desc = sc?.description || '';
    const parentName = getCategoryName(sc.categoryId);

    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
           parentName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* 1. Header Row */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Subcategories</h2>
          <p style={styles.subtitle}>Organize items under main product categories.</p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary" style={styles.headerBtn}>
          <Plus size={16} /> Add Subcategory
        </button>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="kpi-stats-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-purple">
            <Folder size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Subcategories</span>
            <span className="kpi-value">{subcategories.length}</span>
            <span className="kpi-subtext">Active item groupings</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-blue">
            <Package size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Products</span>
            <span className="kpi-value">{items.length}</span>
            <span className="kpi-subtext">Across subcategories</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-icon-circle kpi-icon-green">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-title">Total Views</span>
            <span className="kpi-value">2,840</span>
            <span className="kpi-subtext">Subcategory impressions</span>
          </div>
          <button className="card-more-btn"><MoreVertical size={14} /></button>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="glass-panel" style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            className="form-control"
            placeholder="Search subcategories by name or parent category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* 4. Subcategories Table Panel */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>SUBCATEGORY NAME</th>
                <th>PARENT CATEGORY</th>
                <th>PRODUCTS COUNT</th>
                <th>STATUS</th>
                <th style={{ width: '120px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubcategories.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                    No subcategories found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSubcategories.map(sc => {
                  const parentName = getCategoryName(sc.categoryId);
                  const pillStyle = getParentCategoryPill(parentName);
                  const prodCount = items.filter(i => i.subcategoryId === sc.id).length;

                  return (
                    <tr key={sc.id}>
                      {/* SUBCATEGORY NAME */}
                      <td>
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{sc.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {sc.description || 'No description provided.'}
                          </span>
                        </div>
                      </td>

                      {/* PARENT CATEGORY */}
                      <td>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: pillStyle.bg,
                          color: pillStyle.color,
                          border: `1px solid ${pillStyle.border}`
                        }}>
                          {parentName}
                        </span>
                      </td>

                      {/* PRODUCTS COUNT */}
                      <td>
                        <span style={{ fontWeight: '600', color: '#fff', fontSize: '0.9rem' }}>
                          {prodCount} Products
                        </span>
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
                            onClick={() => handleOpenEditModal(sc)}
                            style={styles.actionIconBtn} 
                            title="Edit Subcategory"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSubcategory(sc.id, sc.name)}
                            style={{ ...styles.actionIconBtn, color: '#f87171' }} 
                            title="Delete Subcategory"
                          >
                            <Trash2 size={14} />
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
            Showing 1 to {filteredSubcategories.length} of {subcategories.length} entries
          </span>
          <div className="pagination-actions">
            <button className="pagination-btn" disabled>&larr;</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn" disabled>&rarr;</button>
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Subcategory */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()} className="glass-panel animate-fade-in">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <FolderPlus size={18} color="var(--color-primary)" /> {editId ? 'Edit Subcategory' : 'Add New Subcategory'}
              </h3>
              <button style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div className="form-group">
                <label>Parent Category *</label>
                <select
                  className="form-control"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  required
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subcategory Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Polo T-Shirts"
                  value={subcatName}
                  onChange={(e) => setSubcatName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Brief summary of subcategory..."
                  value={subcatDesc}
                  onChange={(e) => setSubcatDesc(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> {editId ? 'Save Changes' : 'Create Subcategory'}
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
    padding: '16px 20px',
    marginBottom: '20px',
  },
  searchWrapper: {
    position: 'relative',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)',
  },
  searchInput: {
    paddingLeft: '42px',
    height: '42px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
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
    maxWidth: '500px',
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
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
  }
};
