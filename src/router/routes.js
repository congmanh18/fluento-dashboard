const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('../modules/pages/contents/topics/TopicsPage.vue')},


      // Auth
      { path: 'auth/login', component: () => import('../modules/pages/auth/Login.vue') },
      { path: 'auth/register', component: () => import('../modules/pages/auth/Register.vue') },
      { path: 'auth/forgot', component: () => import('../modules/pages/auth/Forgot.vue') },
      { path: 'auth/reset', component: () => import('../modules/pages/auth/Reset.vue') },

      // Content
      { path: 'content/topics', component: () => import('../modules/pages/contents/topics/TopicsPage.vue') },
      { path: 'content/dialogs', component: () => import('../modules/pages/contents/dialogs/DialogsPage.vue') },
      { path: 'content/stories', component: () => import('../modules/pages/contents/stories/StoriesPage.vue') },
      { path: 'content/vocabulary', component: () => import('../modules/pages/contents/vocabulary/VocabulariesPage.vue') },

      // Master-data
      { path: 'master-data/languages', component: () => import('../modules/pages/master-data/LanguagesPage.vue') },
      { path: 'master-data/characters', component: () => import('../modules/pages/master-data/characters/CharactersPage.vue') },

      // Images
      { path: 'images', component: () => import('pages/ImagePage.vue') },

      // { path: 'content/lessons', component: () => import('pages/content/LessonsPage.vue') },
      // { path: 'content/karaoke', component: () => import('pages/content/KaraokePage.vue') },
      // { path: 'content/quiz', component: () => import('pages/content/QuizPage.vue') },



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
