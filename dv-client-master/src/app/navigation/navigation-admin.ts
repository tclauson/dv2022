import { DvNavigation } from '@dv/types';

export const navigationAdmin: DvNavigation[] = [
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
        id: 'shops',
        title: 'Shops',
        translate: 'NAV.SHOPS',
        type: 'item',
        icon: 'store',
        url: '/apps/shops'
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
        id: 'users',
        title: 'Users',
        translate: 'NAV.USERS',
        type: 'item',
        icon: 'person',
        url: '/apps/users'
      },
      {
        id: 'advertisements',
        title: 'Advertisements',
        translate: 'NAV.ADVERTISEMENTS',
        type: 'item',
        icon: 'branding_watermark',
        url: '/apps/advs'
      }
    ]
  },
  {
    id: 'pages',
    title: 'Pages',
    translate: 'NAV.PAGES',
    type: 'group',
    icon: 'pages',
    children: [
      {
        id: 'tier',
        title: 'Tier',
        translate: 'NAV.TIER',
        type: 'item',
        icon: 'card_membership',
        url: '/pages/tier'
      },
      {
        id: 'promotion',
        title: 'Promotion',
        translate: 'NAV.PROMOTION',
        type: 'item',
        icon: 'local_offer',
        url: '/pages/promotion'
      }
    ]
  }
];
