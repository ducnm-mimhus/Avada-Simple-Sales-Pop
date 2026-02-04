import React from 'react';
import {Frame, Navigation, TopBar} from '@shopify/polaris';
import {HomeIcon, NotificationIcon, SettingsIcon} from '@shopify/polaris-icons';
import {useHistory, useLocation} from 'react-router-dom';
import '@assets/styles/layout/topbar.scss';
import '@assets/styles/layout/override.scss';

/**
 *
 * @param children
 * @returns {Element}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
export default function AppLayout({children}) {
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname;

  const navigationMarkup = (
    <Navigation location={path}>
      <Navigation.Section
        items={[
          {
            label: 'Home',
            icon: HomeIcon,
            selected: path === '/' || path === '/app',
            onClick: () => history.push('/')
          },
          {
            label: 'Notifications',
            icon: NotificationIcon,
            selected: path.startsWith('/notifications'),
            onClick: () => history.push('/notifications')
          },
          {
            label: 'Settings',
            icon: SettingsIcon,
            selected: path.startsWith('/settings'),
            onClick: () => history.push('/settings')
          }
        ]}
      />
    </Navigation>
  );

  const logo = {
    width: 124,
    topBarSource: 'https://static.ybox.vn/2024/4/3/1712743702509-1712671577316-logo.png',
    url: '/',
    accessibilityLabel: 'Avada'
  };
  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[]}
      name="Avada"
      initials="A"
      avatar="https://ui-avatars.com/api/?name=Avada&background=FCD34D&color=fff"
    />
  );

  const topBarMarkup = <TopBar showNavigationToggle userMenu={userMenuMarkup} />;

  return (
    <Frame logo={logo} topBar={topBarMarkup} navigation={navigationMarkup}>
      {children}
    </Frame>
  );
}
