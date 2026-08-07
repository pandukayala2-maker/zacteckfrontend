import React, { useState, FormEvent } from 'react';
import { useData } from '../context/DataContext';
import { 
  FolderPlus, Edit2, Trash2, Save, X, Info, Download, 
  Search, Grid, Plus, ListFilter, ArrowUpDown, ChevronDown, 
  Calendar, Eye, EyeOff, MoreVertical, Shirt, Briefcase, Leaf, 
  Folder, FolderTree, PlusCircle, ArrowRight, Activity, Zap, Check, QrCode 
} from 'lucide-react';
import { Category } from '../types';

interface CategoryManagerProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface ActivityLog {
  id: number;
  type: 'create' | 'update' | 'delete';
  text: string;
  meta: string;
}

export default function CategoryManager({ onNotify, onNavigateTab }: CategoryManagerProps) {
  const { categories, setCategories, subcategories, items } = useData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'az'>('newest');

  // Add/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Pagination Mock
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Activity Log State
  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: 1, type: 'create', text: 'New category "Corporate Services" was created', meta: 'by Admin • May 18, 2024 03:15 PM' },
    { id: 2, type: 'update', text: 'Category "Apparel & Garments" was updated', meta: 'by Admin • May 17, 2024 09:20 AM' },
    { id: 3, type: 'delete', text: 'Category "Old Services" was deleted', meta: 'by Admin • May 16, 2024 04:10 PM' }
  ]);

  const addLog = (type: 'create' | 'update' | 'delete', text: string) => {
    const time = new Date().toLocaleString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
    const newLog: ActivityLog = {
      id: Date.now(),
      type,
      text,
      meta: `by Admin • ${time}`
    };
    setActivities([newLog, ...activities]);
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setCatName('');
    setCatDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editId) {
      setCategories(categories.map(cat => 
        cat.id === editId ? { ...cat, name: catName.trim(), description: catDesc.trim() } : cat
      ));
      addLog('update', `Category "${catName.trim()}" was updated`);
      onNotify('success', 'Category updated successfully!');
    } else {
      const id = `cat-${Date.now()}`;
      const newCat: Category = {
        id,
        name: catName.trim(),
        description: catDesc.trim(),
        status: 'Active',
        productCount: 0,
        views: 0
      };
      setCategories([...categories, newCat]);
      addLog('create', `New category "${catName.trim()}" was created`);
      onNotify('success', 'Category added successfully!');
    }

    setIsModalOpen(false);
    setCatName('');
    setCatDesc('');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const hasSubcats = subcategories.some(sc => sc.categoryId === id);
    const hasItems = items.some(i => i.categoryId === id);

    const warnMsg = hasSubcats || hasItems 
      ? `Warning: The category "${name}" contains subcategories or products. Deleting it will leave those elements orphaned. Are you sure you want to delete it?`
      : `Are you sure you want to delete category "${name}"?`;

    if (!confirm(warnMsg)) return;

    setCategories(categories.filter(cat => cat.id !== id));
    addLog('delete', `Category "${name}" was deleted`);
    onNotify('error', `Category "${name}" deleted.`);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(categories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "zactek_categories.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onNotify('success', 'Categories data exported successfully!');
  };

  const getCategoryIcon = (name: string) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('garment') || lower.includes('apparel') || lower.includes('clothing') || lower.includes('shirt')) {
      return { frame: 'cat-icon-purple', element: <Shirt size={18} /> };
    }
    if (lower.includes('corporate') || lower.includes('service') || lower.includes('trading') || lower.includes('logistic')) {
      return { frame: 'cat-icon-blue', element: <Briefcase size={18} /> };
    }
    if (lower.includes('environ') || lower.includes('shark') || lower.includes('sanitation') || lower.includes('clean') || lower.includes('nature') || lower.includes('waste')) {
      return { frame: 'cat-icon-green', element: <Leaf size={18} /> };
    }
    return { frame: 'cat-icon-grey', element: <Folder size={18} /> };
  };

  const filteredCategories = categories.filter(cat => {
    const name = cat?.name || '';
    const desc = cat?.description || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isMockActive = true; 
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && isMockActive) || 
                          (statusFilter === 'inactive' && !isMockActive);

    return matchesSearch && matchesStatus;
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortOrder === 'az') return a.name.localeCompare(b.name);
    if (sortOrder === 'oldest') return 1;
    return -1;
  });

  const totalSubcategoriesCount = subcategories.length;
  const totalProductsCount = items.length;

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      
      {/* 1. Action Buttons Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '20px' }}>
        <button onClick={handleExportData} className="btn btn-secondary" style={styles.headerBtn}>
          <Download size={16} /> Export
        </button>
        <button onClick={handleOpenAddModal} className="btn btn-primary" style={styles.headerBtn}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="glass-panel" style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            className="form-control"
            placeholder="Search categories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filtersGroup}>
          <div style={styles.filterSelectWrap}>
            <ListFilter size={14} style={styles.selectIcon} />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="form-control"
              style={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div style={styles.filterSelectWrap}>
            <ArrowUpDown size={14} style={styles.selectIcon} />
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="form-control"
              style={styles.filterSelect}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Categories Table Panel */}
      <div className="glass-panel" style={styles.tablePanel}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>CATEGORY DETAILS</th>
                <th>PRODUCTS COUNT</th>
                <th>VIEWS</th>
                <th>STATUS</th>
                <th style={{ width: '120px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                    No categories found matching your search.
                  </td>
                </tr>
              ) : (
                sortedCategories.map(cat => {
                  const iconConfig = getCategoryIcon(cat.name);
                  const subCount = subcategories.filter(sc => sc.categoryId === cat.id).length;
                  const prodCount = items.filter(i => i.categoryId === cat.id).length;
                  const mockViews = cat.views || (prodCount * 240 + 150);

                  return (
                    <tr key={cat.id}>
                      {/* CATEGORY DETAILS */}
                      <td>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                          <div className={`cat-icon-square ${iconConfig.frame}`}>
                            {iconConfig.element}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: '700' }}>
                              {cat.name}
                            </strong>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>
                              {cat.description || 'No description provided.'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* PRODUCTS COUNT */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>
                            {prodCount} Products
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            {subCount} Subcategories
                          </span>
                        </div>
                      </td>

                      {/* VIEWS */}
                      <td>
                        <span style={{ color: '#475569', fontWeight: '600', fontSize: '0.9rem' }}>
                          {mockViews.toLocaleString()}
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
                            onClick={() => handleOpenEditModal(cat)}
                            style={styles.actionIconBtn} 
                            title="Edit Category"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            style={{ ...styles.actionIconBtn, color: '#f87171' }} 
                            title="Delete Category"
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
            Showing 1 to {sortedCategories.length} of {categories.length} entries
          </span>
          <div className="pagination-actions">
            <button className="pagination-btn" disabled>&larr;</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn" disabled>&rarr;</button>
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Category */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()} className="glass-panel animate-fade-in">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <FolderPlus size={18} color="var(--color-primary)" /> {editId ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div className="form-group">
                <label htmlFor="catNameInput">Category Name *</label>
                <input
                  id="catNameInput"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Corporate Services"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="catDescInput">Description</label>
                <textarea
                  id="catDescInput"
                  rows={3}
                  className="form-control"
                  placeholder="Brief summary of products or services in this category..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> {editId ? 'Save Changes' : 'Create Category'}
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
  headerBtnGroup: {
    display: 'flex',
    gap: '10px',
  },
  headerBtn: {
    padding: '10px 18px',
    fontSize: '0.9rem',
  },
  filterBar: {
    padding: '16px 20px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flex: '1',
    minWidth: '260px',
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
  filtersGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterSelectWrap: {
    position: 'relative',
    width: '160px',
  },
  selectIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)',
    pointerEvents: 'none',
  },
  filterSelect: {
    paddingLeft: '34px',
    height: '42px',
    fontSize: '0.85rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  tablePanel: {
    padding: '20px',
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
