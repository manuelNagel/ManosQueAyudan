import React, { useState, useEffect } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { Share2, Mail, Facebook, Phone } from 'lucide-react';

const ShareButton = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = "¡Mira esto!";

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(currentUrl)}`;
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareViaTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareViaInstagram = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('URL copiada al portapapeles. Ábrela en Instagram para compartir.');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: currentUrl
        });
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-primary" id="dropdown-share">
        <Share2 className="me-2" size={16} /> Compartir
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        {isMobile && navigator.share && (
          <Dropdown.Item onClick={shareNative} className="d-flex align-items-center">
            <Phone className="me-2" size={16} />
            Compartir
          </Dropdown.Item>
        )}
        <Dropdown.Item onClick={shareViaEmail} className="d-flex align-items-center">
          <Mail className="me-2" size={16} />
          Correo
        </Dropdown.Item>
        <Dropdown.Item onClick={shareViaFacebook} className="d-flex align-items-center">
          <Facebook className="me-2" size={16} />
          Facebook
        </Dropdown.Item>
        {isMobile && (
          <>
            <Dropdown.Item onClick={shareViaWhatsApp} className="d-flex align-items-center">
              <i className="bi bi-whatsapp me-2"></i>
              WhatsApp
            </Dropdown.Item>
            <Dropdown.Item onClick={shareViaTelegram} className="d-flex align-items-center">
              <i className="bi bi-telegram me-2"></i>
              Telegram
            </Dropdown.Item>
            <Dropdown.Item onClick={shareViaInstagram} className="d-flex align-items-center">
              <i className="bi bi-instagram me-2"></i>
              Instagram
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ShareButton;