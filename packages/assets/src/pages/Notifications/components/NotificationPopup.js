import React from 'react';
import './NoticationPopup.scss';
import {truncate} from '@assets/pages/Notifications/utils/truncate';

const NotificationPopup = ({
  settings = {},
  productName = '',
  customerName = '',
  location = '',
  time = '',
  productImage = ''
}) => {
  return (
    <div className="Avava-SP__Wrapper fadeInUp animated">
      <div className="Avava-SP__Inner">
        <div className="Avava-SP__Container">
          <a href="#" className={'Avava-SP__LinkWrapper'}>
            <div
              className="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage})`
              }}
            ></div>
            <div className="Avada-SP__Content">
              <div className={'Avada-SP__Title'}>
                {customerName} in {location}
              </div>
              <div className={'Avada-SP__Subtitle'}>
                purchased {!settings.truncateProductName ? productName : truncate(productName)}
              </div>
              <div className={'Avada-SP__Footer'}>
                {settings.hideTimeAgo ? ' ' : time}{' '}
                <span className="uni-blue">
                  <i className="fa fa-check" aria-hidden="true" /> by Avada
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

NotificationPopup.propTypes = {};

export default NotificationPopup;
