import React, { useState, FormEvent } from 'react';
import { useData } from '../context/DataContext';
import { Settings, Save, ShieldAlert, KeyRound } from 'lucide-react';

interface SettingsManagerProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function SettingsManager({ onNotify }: SettingsManagerProps) {
  const { settings, setSettings } = useData();

  // Settings State
  const [companyName, setCompanyName] = useState(settings.companyName || '');
  const [companyArabic, setCompanyArabic] = useState(settings.companyArabic || '');
  const [managerName, setManagerName] = useState(settings.managerName || '');
  const [managerRole, setManagerRole] = useState(settings.managerRole || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [email, setEmail] = useState(settings.email || '');
  const [address, setAddress] = useState(settings.address || '');
  
  // Security Credentials State
  const [adminUsername, setAdminUsername] = useState((settings as any).adminUsername || 'admin');
  const [adminPassword, setAdminPassword] = useState((settings as any).adminPassword || 'admin123');

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !phone.trim() || !email.trim()) {
      onNotify('error', 'Please fill in the required fields (Company Name, Phone, Email).');
      return;
    }

    setSettings({
      ...settings,
      companyName,
      companyArabic,
      managerName,
      managerRole,
      phone,
      email,
      address,
      adminUsername,
      adminPassword
    } as any);

    onNotify('success', 'Profile and contact settings saved!');
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <form onSubmit={handleSaveProfile} style={styles.layout}>
        {/* Profile Card Settings */}
        <div className="glass-panel" style={styles.panel}>
          <h3 style={styles.panelTitle}>
            <Settings size={18} color="var(--color-primary)" /> Profile & Contact Details
          </h3>

          <div style={styles.grid2}>
            <div className="form-group">
              <label htmlFor="compEng">Company Name (English) *</label>
              <input
                id="compEng"
                type="text"
                className="form-control"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="compAra">Company Name (Arabic)</label>
              <input
                id="compAra"
                type="text"
                className="form-control"
                value={companyArabic}
                onChange={(e) => setCompanyArabic(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.grid2}>
            <div className="form-group">
              <label htmlFor="mgrName">Wholesale Manager Name</label>
              <input
                id="mgrName"
                type="text"
                className="form-control"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="mgrRole">Designation / Role</label>
              <input
                id="mgrRole"
                type="text"
                className="form-control"
                value={managerRole}
                onChange={(e) => setManagerRole(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.grid2}>
            <div className="form-group">
              <label htmlFor="setPhone">Phone Number *</label>
              <input
                id="setPhone"
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="setEmail">Email Address *</label>
              <input
                id="setEmail"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="setAddr">Office Address / Showroom location</label>
            <textarea
              id="setAddr"
              rows={3}
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        {/* Credentials and Security Settings */}
        <div style={styles.sidebarSection}>
          <div className="glass-panel" style={styles.panel}>
            <h3 style={styles.panelTitle}>
              <KeyRound size={18} color="var(--color-primary)" /> Security Credentials
            </h3>
            
            <div className="form-group">
              <label htmlFor="admUsr">Admin Username</label>
              <input
                id="admUsr"
                type="text"
                className="form-control"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="admPwd">Admin Password</label>
              <input
                id="admPwd"
                type="text"
                className="form-control"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>

            <div style={styles.securityWarning}>
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.75rem', margin: 0 }}>
                Keep these credentials secure. This password is required to log back in and manage items, subcategories, and generate QR cards.
              </p>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.saveBtn}>
            <Save size={18} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '24px',
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
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  panel: {
    padding: '24px',
  },
  panelTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  sidebarSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  securityWarning: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    color: 'var(--color-warning)',
    marginTop: '10px',
  },
  saveBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
  }
};
