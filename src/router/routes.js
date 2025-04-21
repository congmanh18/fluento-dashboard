const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Dashboard.vue')},
      {path: '/Dashboard2', component: () => import('pages/Dashboard2.vue')},
      {path: '/Dashboard3', component: () => import('pages/Dashboard3.vue')},
      {path: '/Profile', component: () => import('pages/UserProfile.vue')},
      {path: '/Map', component: () => import('pages/Map.vue')},
      {path: '/MapMarker', component: () => import('pages/MapMarker.vue')},
      {path: '/TreeTable', component: () => import('pages/TreeTable.vue')},
      {path: '/StreetView', component: () => import('pages/StreetView.vue')},
      {path: '/Cards', component: () => import('pages/Cards.vue')},
      {path: '/Tables', component: () => import('pages/Tables.vue')},
      {path: '/Contact', component: () => import('pages/Contact.vue')},
      {path: '/Checkout', component: () => import('pages/Checkout.vue')},
      {path: '/Ecommerce', component: () => import('pages/ProductCatalogues.vue')},
      {path: '/Pagination', component: () => import('pages/Pagination.vue')},
      {path: '/Charts', component: () => import('pages/Charts.vue')},
      {path: '/Directory', component: () => import('pages/Directory.vue')},
      {path: '/Footer', component: () => import('pages/Footer.vue')},
      {path: '/CardHeader', component: () => import('pages/CardHeader.vue')},


      { path: 'content/topics', component: () => import('src/pages/content/TopicsManagement.vue') },
      { path: 'content/lessons', component: () => import('pages/content/LessonsPage.vue') },
      { path: 'content/dialogs', component: () => import('pages/content/DialogsPage.vue') },
      { path: 'content/stories', component: () => import('pages/content/StoriesPage.vue') },
      { path: 'content/vocabulary', component: () => import('pages/content/VocabulariesPage.vue') },

      { path: 'support/feedback', component: () => import('pages/support/Feedback.vue') },
      { path: 'support/contact', component: () => import('pages/support/Contact.vue') },
      { path: 'support/resolved', component: () => import('pages/support/Resolved.vue') },
      { path: 'support/faq', component: () => import('pages/support/FAQ.vue') },


      // { path: 'approval', component: () => import('pages/ApprovalPage.vue') },
      // { path: 'organize', component: () => import('pages/OrganizePage.vue') },
      // { path: 'reviews', component: () => import('pages/ReviewsPage.vue') },
      // { path: 'submissions', component: () => import('pages/SubmissionsPage.vue') },
      // { path: 'reports', component: () => import('pages/ReportsPage.vue') },
      // { path: 'settings', component: () => import('pages/SettingsPage.vue') },
      // { path: 'developer', component: () => import('pages/DeveloperPage.vue') },
      // { path: 'notifications', component: () => import('pages/NotificationsPage.vue') },
      // { path: 'docs', component: () => import('pages/DocsPage.vue') },
      // { path: 'features', component: () => import('pages/FeaturesPage.vue') },
      // { path: 'support', component: () => import('pages/SupportPage.vue') },
      // { path: 'index', component: () => import('pages/IndexPage.vue') },
      // { path: 'topic', component: () => import('pages/TopicPage.vue') },

      // Not completed yet
      // {path: '/Taskboard', component: () => import('pages/TaskBoard.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  },
  {
    path: '/Mail',
    component: () => import('layouts/Mail.vue')
  },
  {
    path: '/Maintenance',
    component: () => import('pages/Maintenance.vue')
  },
  {
    path: '/Pricing',
    component: () => import('pages/Pricing.vue')
  },
  {
    path: '/Login-1',
    component: () => import('pages/Login-1.vue')
  },
  {
    path: '/Lock',
    component: () => import('pages/LockScreen.vue')
  },
  {
    path: '/Lock-2',
    component: () => import('pages/LockScreen-2.vue')
  }
]

export default routes
