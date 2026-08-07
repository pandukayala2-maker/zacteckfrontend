import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Search, ShoppingBag, Phone, Mail, MapPin, Send, 
  UserCheck, X, Check, Menu, Grid, Shirt, Package, Leaf, Globe 
} from 'lucide-react';
import { Item, Subcategory } from '../types';

interface CustomerCatalogProps {
  onNavigateToLogin: () => void;
}

export default function CustomerCatalog({ onNavigateToLogin }: CustomerCatalogProps) {
  const { categories, subcategories, items, settings } = useData();

  // Navigation & Filter State
  const [activeNav, setActiveNav] = useState<'home' | 'categories' | 'products' | 'about' | 'contact'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('all');
  const [selectedSubcatId, setSelectedSubcatId] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal State
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [inquirySize, setInquirySize] = useState('');

  // Subcategories List for filter
  const [subcatList, setSubcatList] = useState<Subcategory[]>([]);

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCatId === 'all') {
      setSubcatList([]);
      setSelectedSubcatId('all');
    } else {
      const list = subcategories.filter(sc => sc.categoryId === selectedCatId);
      setSubcatList(list);
      setSelectedSubcatId('all');
    }
  }, [selectedCatId, subcategories]);

  // WhatsApp Link Generation
  const generateWhatsAppLink = (item: Item, size: string) => {
    const phone = settings?.phone || '+965 60607922';
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const message = `Hello ZacTEK Team,\n\nI scanned your QR code card and would like a wholesale price quote for:\n\n*Product:* ${item.name}\n*Brand:* ${item.brand || 'ONN Premiums'}\n*Selected Size:* ${size || 'Any size'}\n*Category:* ${categories?.find(c => c.id === item.categoryId)?.name || ''}\n\nPlease let me know the bulk pricing and availability. Thank you!`;
    
    return `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
  };

  // Filter items dynamically
  const filteredItems = items.filter(item => {
    const itemName = item?.name || '';
    const itemBrand = item?.brand || '';
    const itemDesc = item?.description || '';

    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          itemBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          itemDesc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCatId === 'all' || item.categoryId === selectedCatId;
    const matchesSubcategory = selectedSubcatId === 'all' || item.subcategoryId === selectedSubcatId;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const getSubcategoryName = (id: string) => subcategories.find(sc => sc.id === id)?.name || 'Garments';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      
      {/* 1. Top Navbar Header */}
      <header style={styles.navbar} className="glass-panel catalog-navbar">
        <div style={styles.navLogo} className="catalog-nav-logo">
          <div style={styles.logoBadge} className="catalog-logo-badge">ZT</div>
          <div>
            <h1 style={styles.logoTitle} className="catalog-logo-title">{settings?.companyName || 'ZacTEK Corp W.L.L'}</h1>
            <p style={styles.logoSubtitle} className="catalog-logo-subtitle">Wholesale Catalog Store</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links" style={styles.navLinks}>
          <button 
            onClick={() => { setActiveNav('home'); scrollToSection('hero-section'); }} 
            style={{ ...styles.navLink, color: activeNav === 'home' ? '#fff' : 'var(--color-text-secondary)' }}
          >
            Home
            {activeNav === 'home' && <div style={styles.activeUnderline}></div>}
          </button>
          <button 
            onClick={() => { setActiveNav('categories'); scrollToSection('categories-section'); }} 
            style={{ ...styles.navLink, color: activeNav === 'categories' ? '#fff' : 'var(--color-text-secondary)' }}
          >
            Categories
          </button>
          <button 
            onClick={() => { setActiveNav('products'); scrollToSection('products-section'); }} 
            style={{ ...styles.navLink, color: activeNav === 'products' ? '#fff' : 'var(--color-text-secondary)' }}
          >
            Products
          </button>
          <button 
            onClick={() => { setActiveNav('about'); scrollToSection('footer-section'); }} 
            style={{ ...styles.navLink, color: activeNav === 'about' ? '#fff' : 'var(--color-text-secondary)' }}
          >
            About Us
          </button>
          <button 
            onClick={() => { setActiveNav('contact'); scrollToSection('footer-section'); }} 
            style={{ ...styles.navLink, color: activeNav === 'contact' ? '#fff' : 'var(--color-text-secondary)' }}
          >
            Contact
          </button>
        </nav>

        {/* Admin Login Action & Mobile Toggle */}
        <div style={styles.headerRight}>
          <button onClick={onNavigateToLogin} style={styles.adminLoginBtn} className="btn btn-secondary">
            <UserCheck size={16} /> Admin Login
          </button>
          <button 
            className="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={styles.menuToggleBtn}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div style={styles.mobileNavDrawer} className="glass-panel animate-fade-in no-print">
          <button onClick={() => { scrollToSection('hero-section'); setIsMobileMenuOpen(false); }} style={styles.mobileNavLink}>Home</button>
          <button onClick={() => { scrollToSection('categories-section'); setIsMobileMenuOpen(false); }} style={styles.mobileNavLink}>Categories</button>
          <button onClick={() => { scrollToSection('products-section'); setIsMobileMenuOpen(false); }} style={styles.mobileNavLink}>Products</button>
          <button onClick={() => { scrollToSection('footer-section'); setIsMobileMenuOpen(false); }} style={styles.mobileNavLink}>Contact Us</button>
          <button onClick={() => { onNavigateToLogin(); setIsMobileMenuOpen(false); }} style={{ ...styles.mobileNavLink, color: 'var(--color-primary-hover)' }}>Admin Login</button>
        </div>
      )}

      {/* 2. Hero Showcase Banner */}
      <section id="hero-section" style={styles.heroSection} className="catalog-hero-section">
        <div style={styles.heroLayout}>
          
          {/* Hero Left Content */}
          <div style={styles.heroContent} className="catalog-hero-content">
            <div style={styles.pillBadge}>WHOLESALE CATALOG</div>
            
            <h1 style={styles.heroTitle} className="catalog-hero-title">
              Premium Garments <br />
              <span style={styles.titleGradient}>&amp; Trading</span>
            </h1>
            
            <p style={styles.heroSubtitle} className="catalog-hero-subtitle">
              Browse our wholesale catalog of premium garments, shirts, vests and trading logistics services.
            </p>

            {/* Rounded Search Capsule Input */}
            <div style={styles.searchCapsule} className="catalog-search-capsule">
              <Search size={18} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search products, brands, models and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          {/* Hero Right 3D Showcase Stage */}
          <div style={styles.heroStageWrapper} className="desktop-only">
            <div style={styles.stageGlow}></div>
            <div style={styles.stagePedestal}>
              <img 
                src="/images/hero_3d_stage.jpg" 
                alt="3D Polo T-Shirt Showcase Stage" 
                style={styles.heroStageImg}
              />
              <div style={styles.pedestalBadge}>ZT</div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Category Cards Grid */}
      <section id="categories-section" style={styles.categoriesSection} className="catalog-categories-section">
        <div style={styles.categoriesGrid} className="catalog-categories-grid">
          
          {/* Card 1: All Categories */}
          <button
            onClick={() => { setSelectedCatId('all'); setSelectedSubcatId('all'); }}
            style={{
              ...styles.catCard,
              borderColor: selectedCatId === 'all' ? '#d31e25' : 'rgba(255,255,255,0.08)',
              boxShadow: selectedCatId === 'all' ? '0 0 20px rgba(211,30,37,0.3)' : 'none',
              background: selectedCatId === 'all' ? 'rgba(211, 30, 37, 0.12)' : 'rgba(15, 20, 32, 0.7)'
            }}
            className="glass-panel catalog-cat-card"
          >
            <div style={{ ...styles.catIconCircle, backgroundColor: 'rgba(211, 30, 37, 0.15)', color: '#ef4444' }} className="catalog-cat-icon">
              <Grid size={22} />
            </div>
            <strong style={styles.catTitle} className="catalog-cat-title">All Categories</strong>
            <span style={styles.catSubtext} className="catalog-cat-subtext">View all</span>
          </button>

          {/* Card 2: Apparel & Garments */}
          <button
            onClick={() => setSelectedCatId(categories[0]?.id || 'cat-1')}
            style={{
              ...styles.catCard,
              borderColor: selectedCatId === (categories[0]?.id || 'cat-1') ? '#d31e25' : 'rgba(255,255,255,0.08)',
              boxShadow: selectedCatId === (categories[0]?.id || 'cat-1') ? '0 0 20px rgba(211,30,37,0.3)' : 'none',
              background: selectedCatId === (categories[0]?.id || 'cat-1') ? 'rgba(211, 30, 37, 0.12)' : 'rgba(15, 20, 32, 0.7)'
            }}
            className="glass-panel catalog-cat-card"
          >
            <div style={{ ...styles.catIconCircle, backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }} className="catalog-cat-icon">
              <Shirt size={22} />
            </div>
            <strong style={styles.catTitle} className="catalog-cat-title">Apparel &amp; Garments</strong>
            <span style={styles.catSubtext} className="catalog-cat-subtext">Clothing</span>
          </button>

          {/* Card 3: Corporate Services */}
          <button
            onClick={() => setSelectedCatId(categories[1]?.id || 'cat-2')}
            style={{
              ...styles.catCard,
              borderColor: selectedCatId === (categories[1]?.id || 'cat-2') ? '#d31e25' : 'rgba(255,255,255,0.08)',
              boxShadow: selectedCatId === (categories[1]?.id || 'cat-2') ? '0 0 20px rgba(211,30,37,0.3)' : 'none',
              background: selectedCatId === (categories[1]?.id || 'cat-2') ? 'rgba(211, 30, 37, 0.12)' : 'rgba(15, 20, 32, 0.7)'
            }}
            className="glass-panel catalog-cat-card"
          >
            <div style={{ ...styles.catIconCircle, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }} className="catalog-cat-icon">
              <Package size={22} />
            </div>
            <strong style={styles.catTitle} className="catalog-cat-title">Corporate Services</strong>
            <span style={styles.catSubtext} className="catalog-cat-subtext">Services</span>
          </button>

          {/* Card 4: Environmental Services */}
          <button
            onClick={() => setSelectedCatId(categories[2]?.id || 'cat-3')}
            style={{
              ...styles.catCard,
              borderColor: selectedCatId === (categories[2]?.id || 'cat-3') ? '#d31e25' : 'rgba(255,255,255,0.08)',
              boxShadow: selectedCatId === (categories[2]?.id || 'cat-3') ? '0 0 20px rgba(211,30,37,0.3)' : 'none',
              background: selectedCatId === (categories[2]?.id || 'cat-3') ? 'rgba(211, 30, 37, 0.12)' : 'rgba(15, 20, 32, 0.7)'
            }}
            className="glass-panel catalog-cat-card"
          >
            <div style={{ ...styles.catIconCircle, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }} className="catalog-cat-icon">
              <Leaf size={22} />
            </div>
            <strong style={styles.catTitle} className="catalog-cat-title">Environmental Services</strong>
            <span style={styles.catSubtext} className="catalog-cat-subtext">Eco Solutions</span>
          </button>

        </div>
      </section>

      {/* Subcategories Horizontal Scroll Filter */}
      {selectedCatId !== 'all' && subcatList.length > 0 && (
        <div style={styles.subcatContainer}>
          <div style={styles.subcatScroll}>
            <button
              onClick={() => setSelectedSubcatId('all')}
              style={{
                ...styles.subcatTab,
                background: selectedSubcatId === 'all' ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                borderColor: selectedSubcatId === 'all' ? 'var(--color-primary)' : 'var(--color-border)'
              }}
            >
              All Subcategories
            </button>
            {subcatList.map(sc => {
              const isActive = selectedSubcatId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedSubcatId(sc.id)}
                  style={{
                    ...styles.subcatTab,
                    background: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                    borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)'
                  }}
                >
                  {sc.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Featured Products Showcase Section */}
      <section id="products-section" style={styles.productsSection} className="catalog-products-section">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <button 
            onClick={() => { setSelectedCatId('all'); setSearchQuery(''); }}
            style={styles.viewAllLink}
          >
            View all products &rarr;
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <div style={styles.emptyCatalog} className="glass-panel">
            <ShoppingBag size={48} color="var(--color-text-muted)" />
            <h3>No products found</h3>
            <p>Try searching for a different keyword or reset category filters.</p>
          </div>
        ) : (
          <div style={styles.productGrid} className="catalog-product-grid">
            {filteredItems.map((item) => {
              const sizesList = item.sizes || ["M", "L", "XL", "XXL"];
              const categoryNameTag = item.subcategoryId === 'subcat-1' ? 'POLO T-SHIRTS' : 
                                      item.subcategoryId === 'subcat-2' ? "MEN'S VESTS" : 'GARMENTS';

              return (
                <div
                  key={item.id}
                  style={styles.productCardHorizontal}
                  className="glass-panel product-hover-card catalog-product-card"
                >
                  {/* Card Left: Large Image Preview */}
                  <div style={styles.cardImageContainer} className="catalog-card-image-container">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={styles.cardImage}
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60';
                      }}
                    />
                    <div style={styles.cardCategoryBadge}>{categoryNameTag}</div>
                  </div>

                  {/* Card Right: Details */}
                  <div style={styles.cardBody} className="catalog-card-body">
                    <h3 style={styles.cardTitle}>{item.name}</h3>

                    {/* Sizing Tags Row */}
                    <div style={styles.sizesRow}>
                      {sizesList.map((s, i) => (
                        <span key={i} style={styles.sizeTag}>{s}</span>
                      ))}
                    </div>

                    <div style={styles.originTag}>Made in India</div>

                    <div style={styles.cardFooter}>
                      <button
                        onClick={() => {
                          setActiveItem(item);
                          setInquirySize(item.sizes?.[0] || '');
                        }}
                        style={styles.viewDetailsBtn}
                      >
                        View Details &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Footer Business Card */}
      <footer id="footer-section" style={styles.footer} className="glass-panel catalog-footer">
        <div style={styles.footerGrid} className="catalog-footer-grid">
          
          {/* Left Column: Company & Profile info */}
          <div style={styles.footerLeft}>
            <div style={styles.footerBrandRow}>
              <div style={styles.footerLogoBadge}>ZT</div>
              <div>
                <h3 style={styles.footerLogoTitle}>{settings?.companyName || 'ZacTEK Corp W.L.L'}</h3>
                <p style={styles.footerArabic}>{settings?.companyArabic || 'شركة زاك تيك ذ.م.م'}</p>
              </div>
            </div>

            <div style={styles.managerBadge}>
              <div style={styles.avatarCircle}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ color: '#fff' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <strong style={styles.managerName}>{settings?.managerName || 'Kumar'}</strong>
                <div style={styles.managerRole}>{settings?.managerRole || 'Marketing Manager'}</div>
              </div>
            </div>
          </div>

          {/* Middle Column: Contact Details */}
          <div style={styles.footerMiddle}>
            <div style={styles.contactList}>
              <a href={`tel:${settings?.phone || '+965 60607922'}`} style={styles.contactItem}>
                <div style={styles.contactIconCircle}><Phone size={12} fill="#fff" color="#d31e25" /></div>
                <span>{settings?.phone || '+965 60607922'}</span>
              </a>

              <a href={`mailto:${settings?.email || 'zactekaccouts@gmail.com'}`} style={styles.contactItem}>
                <div style={styles.contactIconCircle}><Mail size={12} fill="#fff" color="#d31e25" /></div>
                <span>{settings?.email || 'zactekaccouts@gmail.com'}</span>
              </a>

              <div style={styles.contactItem}>
                <div style={styles.contactIconCircle}><MapPin size={12} fill="#fff" color="#d31e25" /></div>
                <span style={styles.addressText}>{settings?.address || 'Abdulla Al-Mubarak Al-Sabah Street, Sharq, Kuwait City, Kuwait Complex 2, Zone 4'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Logistics Globe Illustration */}
          <div style={styles.footerRight}>
            <div style={styles.globeGraphicBox}>
              <div style={styles.globeGlow}></div>
              <img 
                src="/images/footer_3d_globe.jpg" 
                alt="3D Logistics Globe" 
                style={{ width: '130px', height: '130px', borderRadius: '16px', objectFit: 'cover', border: '1px solid rgba(211,30,37,0.4)', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }} 
              />
              <div style={styles.deliveryBadge}>
                🚚 Logistics &amp; Shipping Active
              </div>
            </div>
          </div>

        </div>

        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} ZacTEK Corporation. All Rights Reserved. Premium Garments &amp; Trading.</p>
        </div>
      </footer>

      {/* 6. Product Detail & WhatsApp Inquiry Modal */}
      {activeItem && (
        <div style={styles.modalOverlay} onClick={() => setActiveItem(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()} className="glass-panel animate-fade-in">
            
            <button style={styles.modalClose} onClick={() => setActiveItem(null)}>
              <X size={20} />
            </button>

            <div style={styles.modalBody}>
              {/* Product Image */}
              <div style={styles.modalImageWrapper}>
                <img src={activeItem.imageUrl} alt={activeItem.name} style={styles.modalImage} />
              </div>

              {/* Product Details & WhatsApp Quote Trigger */}
              <div style={styles.modalDetails}>
                <div style={styles.modalBrand}>{activeItem.brand || 'ONN Premiums'}</div>
                <h2 style={styles.modalTitle}>{activeItem.name}</h2>
                <p style={styles.modalDesc}>{activeItem.description}</p>

                {/* Sizing Picker */}
                <div style={styles.sizingPicker}>
                  <div style={styles.sizeTitle}>Select Preferred Size:</div>
                  <div style={styles.sizesGrid}>
                    {activeItem.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setInquirySize(size)}
                        style={{
                          ...styles.sizeButton,
                          backgroundColor: inquirySize === size ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                          borderColor: inquirySize === size ? 'var(--color-primary)' : 'var(--color-border)',
                          color: inquirySize === size ? '#fff' : 'var(--color-text-secondary)'
                        }}
                      >
                        {size} {inquirySize === size && <Check size={12} style={{ marginLeft: '4px' }} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Display */}
                <div style={styles.priceContainer}>
                  <div style={styles.priceLabel}>Wholesale Pricing</div>
                  <div style={styles.priceVal}>{activeItem.price || 'Wholesale (Contact for Quote)'}</div>
                </div>

                {/* WhatsApp Link Button */}
                <a
                  href={generateWhatsAppLink(activeItem, inquirySize)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={styles.whatsappBtn}
                >
                  <Send size={18} /> Send Instant WhatsApp Inquiry
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    textAlign: 'left',
    paddingBottom: '20px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBadge: {
    width: '36px',
    height: '36px',
    backgroundColor: '#d31e25',
    color: '#fff',
    fontWeight: '800',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.95rem',
  },
  logoTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
    lineHeight: '1.2',
  },
  logoSubtitle: {
    fontSize: '0.7rem',
    color: '#64748b',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    gap: '28px',
    alignItems: 'center',
  },
  navLink: {
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    position: 'relative',
    padding: '4px 0',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: '-4px',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: '#d31e25',
    borderRadius: '2px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  adminLoginBtn: {
    fontSize: '0.85rem',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  menuToggleBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '4px',
    display: 'none',
  },
  mobileNavDrawer: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#0c0f1b',
    borderBottom: '1px solid var(--color-border)',
  },
  mobileNavLink: {
    background: 'none',
    border: 'none',
    color: '#fff',
    textAlign: 'left',
    fontSize: '1rem',
    padding: '8px 0',
    cursor: 'pointer',
  },
  heroSection: {
    padding: '60px 32px 40px 32px',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  heroLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: '580px',
  },
  pillBadge: {
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: '20px',
    border: '1px solid #d31e25',
    color: '#d31e25',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '16px',
  },
  heroTitle: {
    fontSize: '2.8rem',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: '1.15',
    marginBottom: '16px',
  },
  titleGradient: {
    color: '#d31e25',
  },
  heroSubtitle: {
    fontSize: '1rem',
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '28px',
  },
  searchCapsule: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '30px',
    padding: '6px 20px',
    maxWidth: '480px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
  searchIcon: {
    color: '#64748b',
    marginRight: '12px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: '#0f172a',
    width: '100%',
    padding: '8px 0',
    fontSize: '0.9rem',
    outline: 'none',
  },
  heroStageWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageGlow: {
    position: 'absolute',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    backgroundColor: 'rgba(211, 30, 37, 0.15)',
    filter: 'blur(70px)',
  },
  stagePedestal: {
    width: '460px',
    height: '340px',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid #e2e8f0',
    boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 0 30px rgba(211, 30, 37, 0.15)',
    backgroundColor: '#ffffff',
  },
  heroStageImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '24px',
  },
  pedestalBadge: {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    width: '36px',
    height: '36px',
    backgroundColor: '#d31e25',
    color: '#fff',
    fontWeight: '800',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(211, 30, 37, 0.3)',
  },
  categoriesSection: {
    padding: '0 32px 40px 32px',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  catCard: {
    padding: '20px',
    borderRadius: '16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    transition: 'all var(--transition-normal)',
  },
  catIconCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  catTitle: {
    color: '#0f172a',
    fontSize: '0.95rem',
    marginBottom: '4px',
  },
  catSubtext: {
    color: '#64748b',
    fontSize: '0.75rem',
  },
  subcatContainer: {
    padding: '0 32px 30px 32px',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  subcatScroll: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  subcatTab: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: '1px solid #cbd5e1',
    color: '#0f172a',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  productsSection: {
    padding: '0 32px 60px 32px',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  viewAllLink: {
    background: 'none',
    border: 'none',
    color: '#d31e25',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  emptyCatalog: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: '24px',
  },
  productCardHorizontal: {
    display: 'flex',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  cardImageContainer: {
    width: '42%',
    position: 'relative',
    backgroundColor: '#f1f5f9',
    minHeight: '200px',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardCategoryBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '#0f172a',
    color: '#fff',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  cardBody: {
    width: '58%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '10px',
  },
  sizesRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  sizeTag: {
    fontSize: '0.7rem',
    background: '#f1f5f9',
    border: '1px solid #cbd5e1',
    color: '#475569',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  originTag: {
    fontSize: '0.75rem',
    color: '#64748b',
    marginBottom: '16px',
  },
  cardFooter: {
    marginTop: 'auto',
  },
  viewDetailsBtn: {
    background: 'none',
    border: 'none',
    color: '#d31e25',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },
  footer: {
    margin: '40px 32px 0 32px',
    padding: '40px 32px 20px 32px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    paddingBottom: '30px',
    borderBottom: '1px solid #e2e8f0',
  },
  footerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  footerBrandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  footerLogoBadge: {
    width: '40px',
    height: '40px',
    backgroundColor: '#d31e25',
    color: '#fff',
    fontWeight: '800',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  footerLogoTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  footerArabic: {
    fontSize: '0.75rem',
    color: '#64748b',
    margin: '2px 0 0 0',
  },
  managerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '10px 14px',
    borderRadius: '12px',
    width: 'fit-content',
  },
  avatarCircle: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: '#d31e25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  managerName: {
    fontSize: '0.9rem',
    color: '#0f172a',
  },
  managerRole: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  footerMiddle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#475569',
    textDecoration: 'none',
    fontSize: '0.85rem',
  },
  contactIconCircle: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'rgba(211, 30, 37, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addressText: {
    lineHeight: '1.4',
    fontSize: '0.8rem',
  },
  footerRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  globeGraphicBox: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  globeGlow: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: 'rgba(211, 30, 37, 0.15)',
    filter: 'blur(30px)',
  },
  deliveryBadge: {
    marginTop: '10px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
  },
  footerBottom: {
    paddingTop: '20px',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#64748b',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)',
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '20px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalBody: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalImageWrapper: {
    height: '350px',
    backgroundColor: '#1b223c',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  modalDetails: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
  },
  modalBrand: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#ff4d54',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  modalTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.2',
    marginBottom: '8px',
  },
  modalDesc: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  sizingPicker: {
    marginBottom: '20px',
  },
  sizeTitle: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
  },
  sizesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  sizeButton: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
  },
  priceContainer: {
    marginBottom: '20px',
  },
  priceLabel: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  priceVal: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#fff',
    marginTop: '2px',
  },
  whatsappBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }
};
