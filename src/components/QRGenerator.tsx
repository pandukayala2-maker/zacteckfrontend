import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { QRCodeCanvas } from 'qrcode.react';
import { Printer, Download, Phone, Mail, MapPin, Link as LinkIcon, Copy } from 'lucide-react';

interface QRGeneratorProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function QRGenerator({ onNotify }: QRGeneratorProps) {
  const { settings } = useData();
  const cardRef = useRef<HTMLDivElement>(null);

  // Encode catalog URL
  const getCatalogUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/?view=catalog`;
    }
    return 'https://zactek.com/catalog';
  };

  const catalogUrl = getCatalogUrl();

  const handleDownloadQR = () => {
    const canvas = document.getElementById('zactek-qr-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `zactek-catalog-qr.png`;
    link.href = url;
    link.click();
    onNotify('success', 'QR code image downloaded successfully!');
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(catalogUrl);
    onNotify('success', 'Catalog link copied to clipboard!');
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      
      {/* 1. Header & Top Buttons */}
      <div style={styles.header} className="no-print">
        <div>
          <h2 style={styles.title}>QR Card Generator</h2>
          <p style={styles.subtitle}>
            Scan this QR code to view the wholesale catalogue. Share or print this card for meetings with shop owners.
          </p>
        </div>
        <div style={styles.btnRow}>
          <button onClick={handleCopyLink} className="btn btn-secondary" style={styles.actionBtn}>
            <LinkIcon size={16} /> Copy URL
          </button>
          <button onClick={handleDownloadQR} className="btn btn-secondary" style={styles.actionBtn}>
            <Download size={16} /> Download QR Only
          </button>
          <button onClick={handlePrintCard} className="btn btn-primary" style={styles.actionBtn}>
            <Printer size={16} /> Print Card
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Grid Layout */}
      <div style={styles.mainGrid}>
        
        {/* Left Column: Instruction Guide Panel */}
        <div style={styles.guideCard} className="glass-panel no-print">
          <h3 style={styles.guideTitle}>
            <span style={styles.infoBadge}>i</span> How to use:
          </h3>
          
          <div style={styles.stepsList}>
            {/* Step 1 */}
            <div style={styles.stepItem}>
              <div style={{ ...styles.stepNum, backgroundColor: '#8b5cf6' }}>1</div>
              <div style={styles.stepText}>Verify manager and phone settings are correct.</div>
            </div>

            {/* Step 2 */}
            <div style={styles.stepItem}>
              <div style={{ ...styles.stepNum, backgroundColor: '#3b82f6' }}>2</div>
              <div style={styles.stepText}>Press the <strong>Print Card</strong> button.</div>
            </div>

            {/* Step 3 */}
            <div style={styles.stepItem}>
              <div style={{ ...styles.stepNum, backgroundColor: '#10b981' }}>3</div>
              <div style={styles.stepText}>
                It will open the system print prompt configured to print this premium circular sticker or card.
              </div>
            </div>

            {/* Step 4 */}
            <div style={styles.stepItem}>
              <div style={{ ...styles.stepNum, backgroundColor: '#f97316' }}>4</div>
              <div style={styles.stepText}>
                Shop owners scan the QR code using their phones. They are immediately taken to your live garments catalogue to see all products (Polo t-shirts, vests, etc.).
              </div>
            </div>
          </div>

          <div style={styles.encodedUrlBox}>
            <div style={styles.urlLabel}>ENCODED CATALOG LINK</div>
            <div style={styles.urlVal}>
              <span>{catalogUrl}</span>
              <button onClick={handleCopyLink} style={styles.inlineCopyBtn} title="Copy link">
                <Copy size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Circular Business Card Preview (500px Circular Design) */}
        <div style={styles.previewWrapper}>
          <div ref={cardRef} style={styles.circularCard} className="qr-printable-area">
            
            {/* Dark Curved Left Panel */}
            <div style={styles.cardLeftDark}>
              <div style={styles.managerAvatar}>
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ color: '#fff' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <strong style={styles.managerName}>{settings?.managerName || 'Kumar'}</strong>
              <span style={styles.managerRole}>{settings?.managerRole || 'Marketing Manager'}</span>

              <div style={styles.leftContactList}>
                <div style={styles.leftContactItem}>
                  <div style={styles.redIconCircle}><Phone size={10} color="#fff" /></div>
                  <span>{settings?.phone || '+965 60607922'}</span>
                </div>

                <div style={styles.leftContactItem}>
                  <div style={styles.redIconCircle}><Mail size={10} color="#fff" /></div>
                  <span style={{ fontSize: '0.65rem' }}>{settings?.email || 'zactekaccouts@gmail.com'}</span>
                </div>

                <div style={styles.leftContactItem}>
                  <div style={styles.redIconCircle}><MapPin size={10} color="#fff" /></div>
                  <span style={{ fontSize: '0.6rem', lineHeight: '1.2' }}>{settings?.address || 'Sharq, Kuwait City'}</span>
                </div>
              </div>
            </div>

            {/* White Right Panel */}
            <div style={styles.cardRightWhite}>
              <div style={styles.cardLogoRow}>
                <div style={styles.redBadgeZT}>ZT</div>
                <div style={styles.companyTitleWrap}>
                  <h4 style={styles.companyMainTitle}>{settings?.companyName || 'ZacTEK Corp W.L.L'}</h4>
                  <div style={styles.companyArabicTitle}>{settings?.companyArabic || 'شركة زاك تك ذ.م.م'}</div>
                </div>
              </div>

              {/* Encoded QRCode Canvas */}
              <div style={styles.qrCanvasFrame}>
                <QRCodeCanvas
                  id="zactek-qr-canvas"
                  value={catalogUrl}
                  size={140}
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>

              <div style={styles.sloganTagline}>
                CONNECTING SOLUTIONS / DELIVERING TRUST
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'left',
  },
  header: {
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
  btnRow: {
    display: 'flex',
    gap: '10px',
  },
  actionBtn: {
    fontSize: '0.85rem',
    padding: '8px 14px',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '30px',
    alignItems: 'start',
  },
  guideCard: {
    padding: '24px',
  },
  guideTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoBadge: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  stepItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  stepText: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
  },
  encodedUrlBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '12px',
  },
  urlLabel: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  urlVal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--color-primary-hover)',
    wordBreak: 'break-all',
  },
  inlineCopyBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    padding: '2px 4px',
  },
  previewWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularCard: {
    width: '460px',
    height: '460px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(211,30,37,0.3)',
    border: '4px solid #1a2035',
    position: 'relative',
  },
  cardLeftDark: {
    width: '44%',
    backgroundColor: '#0a0d18',
    color: '#ffffff',
    padding: '40px 16px 30px 24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderTopRightRadius: '160px',
    borderBottomRightRadius: '160px',
    boxShadow: '4px 0 15px rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  managerAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#d31e25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  managerName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '2px',
  },
  managerRole: {
    fontSize: '0.7rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '16px',
  },
  leftContactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  leftContactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.8)',
  },
  redIconCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#d31e25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardRightWhite: {
    width: '56%',
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '36px 20px 24px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  cardLogoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  redBadgeZT: {
    width: '28px',
    height: '28px',
    backgroundColor: '#d31e25',
    color: '#fff',
    fontWeight: '800',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
  },
  companyTitleWrap: {
    textAlign: 'left',
  },
  companyMainTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#000',
    margin: 0,
    lineHeight: '1.1',
  },
  companyArabicTitle: {
    fontSize: '0.65rem',
    color: '#666',
    margin: 0,
  },
  qrCanvasFrame: {
    padding: '6px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
  },
  sloganTagline: {
    fontSize: '0.55rem',
    fontWeight: '700',
    color: '#d31e25',
    letterSpacing: '0.5px',
    marginTop: '6px',
  }
};
