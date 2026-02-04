import React from 'react';
import {Box} from '@shopify/polaris';
import NotificationPopup from '@assets/pages/Notifications/components/NotificationPopup';

export default function NotificationPopupPreview({settings}) {
  const containerStyle = {
    position: 'relative',
    height: '200px',
    background: 'rgba(218,220,222,0.54)',
    border: '1px solid #dfe3e8',
    borderRadius: '8px',
    overflow: 'hidden',
    pointerEvents: 'none'
  };

  const positionStyle = {
    position: 'absolute',
    bottom: settings.position.includes('bottom') ? '10px' : 'auto',
    top: settings.position.includes('top') ? '0px' : 'auto',
    left: settings.position.includes('left') ? '10px' : 'auto',
    right: settings.position.includes('right') ? '10px' : 'auto',
    transform: 'scale(0.7)',
    transformOrigin: settings.position.includes('left') ? 'bottom left' : 'bottom right',
    zIndex: 10
  };

  return (
    <Box style={containerStyle}>
      <div style={positionStyle}>
        <NotificationPopup
          settings={settings}
          productName="Adidas Stan Smith Sneaker"
          customerName="John Doe"
          location="New York, US"
          time="a day ago"
          productImage="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/9JZlHBORyCYYo6AkPrzGRtJmuaOVNRRb_1755511779____01fb0971c4813d94a9ac5ee1deb728ec.png"
        />
      </div>
    </Box>
  );
}
