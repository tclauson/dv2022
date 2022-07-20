import { DvNavigation } from '@dv/types';

export const navigationShop: DvNavigation[] = [
  {
    id: 'applications',
    title: 'Applications',
    translate: 'NAV.APPLICATIONS',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'dashboards',
        title: 'Dashboards',
        translate: 'NAV.DASHBOARDS',
        type: 'item',
        icon: 'dashboard',
        url: '/apps/dashboard/analytics'
      },
      {
        id: 'spots',
        title: 'Spots',
        translate: 'NAV.SPOTS',
        type: 'item',
        icon: 'waves',
        url: '/apps/spots'
      },
      {
        id: 'deals',
        title: 'Deals',
        translate: 'NAV.DEALS',
        type: 'item',
        icon: 'card_giftcard',
        url: '/apps/deals'
      }
    ]
  }
];
