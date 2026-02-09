import {useEffect, useState} from 'preact/hooks';
import './Popup.css';
import Helper from '../helpers/Helper';

/**
 *
 * @param notification
 * @param setting
 * @returns {Element}
 * @constructor
 */
export const Popup = ({notification, setting}) => {
  const [isVisible, setIsVisible] = useState(false);
  const helper = new Helper();

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const timeAgoString = helper.timeAgo(notification.timestamp);
  const productNameDisplay = setting.truncateProductName
    ? helper.truncate(notification.productName)
    : notification.productName;

  const positionStyle = {
    bottom: setting.position.includes('bottom') ? '20px' : 'auto',
    top: setting.position.includes('top') ? '20px' : 'auto',
    left: setting.position.includes('left') ? '20px' : 'auto',
    right: setting.position.includes('right') ? '20px' : 'auto',

    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out'
  };

  const handleClick = () => {
    window.location.href = `/products/${helper.slugify(notification.productName)}`;
  };

  return (
    <div className="avada-sales-popup" style={positionStyle} onClick={handleClick}>
      <img
        src={notification.productImage}
        className="avada-popup-img"
        alt={notification.productName}
      />
      <div className="avada-popup-content">
        <div className="avada-customer">
          <strong>{notification.firstName}</strong> in {notification.city}
        </div>

        <div className="avada-product">
          purchased <strong>{productNameDisplay}</strong>
        </div>

        <div className="avada-time">
          {!setting.hideTimeAgo && <span>{timeAgoString}</span>}
          <span className="avada-verify">✓ by Avada</span>
        </div>
      </div>
    </div>
  );
};
