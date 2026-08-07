import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import CategoryManager from './CategoryManager';
import SubcategoryManager from './SubcategoryManager';
import ItemManager from './ItemManager';
import SettingsManager from './SettingsManager';
import QRGenerator from './QRGenerator';
import UserManager from './UserManager';
import { 
  FolderTree, Tag, Settings, QrCode, 
  LogOut, Eye, Menu, X, Bell, User, 
  History, MessageSquare, Shield, Grid, Package 
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToCatalog: () => void;
}

type TabType = 'categories' | 'subcategories' | 'products' | 'qr' | 'settings' | 'users' | 'logs';

export default function AdminDashboard({ onBackToCatalog }: AdminDashboardProps) {
  const { logout, settings } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('categories');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Floating notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of the administration console?')) {
      logout();
      onBackToCatalog();
    }
  };

  const handleContactSupport = () => {
    const cleanPhone = (settings.phone || '').replace(/[^\d+]/g, '');
    const message = `Hello ZacTEK Support,\n\nI am the Administrator of the wholesale portal and require technical assistance. Please contact me back.`;
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const renderLogsTab = () => (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px' }}>Activity Logs</h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Review security audit logs and catalogue modification events.
      </p>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="var(--color-primary)" /> System Log History
        </h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Event Code</th>
                <th>Operation</th>
                <th>Actor</th>
                <th>IP Address</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>EVT-3094</code></td>
                <td>Category "Corporate Services" Created</td>
                <td>Admin</td>
                <td><code>192.168.1.45</code></td>
                <td>May 18, 2024 03:15 PM</td>
                <td><span className="status-badge active" style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#34d399' }}>Success</span></td>
              </tr>
              <tr>
                <td><code>EVT-2981</code></td>
                <td>Category "Apparel & Garments" Updated</td>
                <td>Admin</td>
                <td><code>192.168.1.45</code></td>
                <td>May 17, 2024 09:20 AM</td>
                <td><span className="status-badge active" style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#34d399' }}>Success</span></td>
              </tr>
              <tr>
                <td><code>EVT-2840</code></td>
                <td>Category "Old Services" Deleted</td>
                <td>Admin</td>
                <td><code>192.168.1.45</code></td>
                <td>May 16, 2024 04:10 PM</td>
                <td><span className="status-badge active" style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#34d399' }}>Success</span></td>
              </tr>
              <tr>
                <td><code>EVT-2703</code></td>
                <td>Admin Authenticated Successfully</td>
                <td>Admin</td>
                <td><code>192.168.1.45</code></td>
                <td>May 15, 2024 08:30 AM</td>
                <td><span className="status-badge active" style={{ backgroundColor: 'rgba(16,185,129,0.08)', color: '#34d399' }}>Success</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoryManager onNotify={showNotification} onNavigateTab={(tab) => setActiveTab(tab as TabType)} />;
      case 'subcategories':
        return <SubcategoryManager onNotify={showNotification} />;
      case 'products':
        return <ItemManager onNotify={showNotification} />;
      case 'qr':
        return <QRGenerator onNotify={showNotification} />;
      case 'settings':
        return <SettingsManager onNotify={showNotification} />;
      case 'users':
        return <UserManager onNotify={showNotification} />;
      case 'logs':
        return renderLogsTab();
      default:
        return <CategoryManager onNotify={showNotification} onNavigateTab={(tab) => setActiveTab(tab as TabType)} />;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      
      {/* Floating Notification */}
      {notification && (
        <div style={{
          ...styles.notificationToast,
          backgroundColor: notification.type === 'error' ? 'rgba(239, 68, 68, 0.9)' :
                           notification.type === 'info' ? 'rgba(59, 130, 246, 0.9)' : 'rgba(16, 185, 129, 0.9)'
        }} className="animate-fade-in">
          {notification.message}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside style={{
        ...styles.sidebar,
        transform: isSidebarOpen ? 'translateX(0)' : 'none'
      }} className="glass-panel no-print">
        <div style={styles.sidebarHeader}>
          <div style={styles.brandBadge}>ZT</div>
          <div>
            <h1 style={styles.brandTitle}>{settings.companyName}</h1>
            <span style={styles.brandSubtitle}>Management Portal</span>
          </div>
        </div>

        {/* Sidebar Nav Sections */}
        <nav style={styles.navMenu}>
          <div style={styles.navSectionLabel}>MAIN MENU</div>

          <button
            onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
            style={{
              ...styles.navItem,
              ...(activeTab === 'categories' ? styles.navItemActive : {})
            }}
          >
            <Grid size={18} /> Categories
          </button>

          <button
            onClick={() => { setActiveTab('subcategories'); setIsSidebarOpen(false); }}
            style={{
              ...styles.navItem,
              ...(activeTab === 'subcategories' ? styles.navItemActive : {})
            }}
          >
            <FolderTree size={18} /> Subcategories
          </button>

          <button
            onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
            style={{
              ...styles.navItem,
              ...(activeTab === 'products' ? styles.navItemActive : {})
            }}
          >
            <Package size={18} /> Products
          </button>

          <div style={{ ...styles.navSectionLabel, marginTop: '20px' }}>TOOLS & CARDS</div>

          <button
            onClick={() => { setActiveTab('qr'); setIsSidebarOpen(false); }}
            style={{
              ...styles.navItem,
              ...(activeTab === 'qr' ? styles.navItemActive : {})
            }}
          >
            <QrCode size={18} /> QR Business Card
          </button>

          <div style={{ ...styles.navSectionLabel, marginTop: '20px' }}>SETTINGS</div>

          <button
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            style={{
              ...styles.navItem,
              ...(activeTab === 'settings' ? styles.navItemActive : {})
            }}
          >
            <Settings size={18} /> Profile & Settings
          </button>

          <button
            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
            style={{
              ...styles.navItem,
              ...(activeTab === 'users' ? styles.navItemActive : {})
            }}
          >
            <Shield size={18} /> Users & Roles
          </button>

          <button
            onClick={() => { setActiveTab('logs'); setIsSidebarOpen(false); }}
            style={{
              ...styles.navItem,
              ...(activeTab === 'logs' ? styles.navItemActive : {})
            }}
          >
            <History size={18} /> Activity Logs
          </button>
        </nav>

        {/* Sidebar Footer Support Card */}
        <div style={styles.supportCard}>
          <div style={styles.supportHeader}>
            <MessageSquare size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Need Help?</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '4px 0 10px 0' }}>
            Contact technical support for catalogue configuration assistance.
          </p>
          <button onClick={handleContactSupport} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '6px' }}>
            Support Desk
          </button>
        </div>
      </aside>

      {/* Main Right Content Panel */}
      <div style={styles.mainContent}>
        {/* Top Header Bar */}
        <header style={styles.topHeader} className="glass-panel no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              style={styles.mobileToggle}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={styles.headerWelcome}>
              <strong>Dashboard Console</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={onBackToCatalog} className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
              <Eye size={16} /> View Shop Catalog
            </button>

            <button onClick={handleLogout} className="btn btn-danger" style={{ fontSize: '0.85rem', padding: '8px 12px' }} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Render Tab View */}
        <main style={styles.contentBody}>
          {renderTabContent()}
        </main>
      </div>

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  notificationToast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    zIndex: 2000,
    fontSize: '0.9rem',
    fontWeight: '500',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    padding: '20px',
    boxShadow: '2px 0 15px rgba(0,0,0,0.03)',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '20px',
  },
  brandBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    fontWeight: '800',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px var(--color-primary-glow)',
  },
  brandTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    margin: 0,
    color: '#0f172a',
    lineHeight: '1.2',
  },
  brandSubtitle: {
    fontSize: '0.7rem',
    color: '#64748b',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    overflowY: 'auto',
  },
  navSectionLabel: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '1px',
    marginBottom: '8px',
    textAlign: 'left',
    paddingLeft: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    background: 'none',
    border: 'none',
    color: '#475569',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all var(--transition-fast)',
  },
  navItemActive: {
    backgroundColor: 'rgba(211, 30, 37, 0.08)',
    color: '#d31e25',
    borderLeft: '3px solid #d31e25',
    fontWeight: '600',
  },
  supportCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '14px',
    marginTop: 'auto',
    textAlign: 'left',
  },
  supportHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  mainContent: {
    flex: 1,
    marginLeft: '260px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 28px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 90,
  },
  mobileToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#0f172a',
    cursor: 'pointer',
  },
  headerWelcome: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    color: '#0f172a',
  },
  contentBody: {
    padding: '28px',
    flex: 1,
  }
};
