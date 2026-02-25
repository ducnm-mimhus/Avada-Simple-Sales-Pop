export const navigationLinks = [
  {
    label: 'Notifications',
    destination: '/notifications'
  },
  {
    label: 'Settings',
    destination: '/settings'
  },
  {
    label: 'Statistics',
    destination: '/statistics'
  }
].map(item => ({
  ...item,
  destination: '/embed' + item.destination
}));
