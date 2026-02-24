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
    label: 'Analytics',
    destination: '/analytics'
  }
].map(item => ({
  ...item,
  destination: '/embed' + item.destination
}));
