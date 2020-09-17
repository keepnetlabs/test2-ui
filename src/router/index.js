import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import DashBoard from '../views/DashBoard'
import Main from '../layout/Main'
import ThreatSharing from '../views/ThreatSharing'
import Community from '../views/Community'
import TargetUsers from '../views/TargetUsers'
import IncidentResponder from '../views/IncidentResponder'
import AnalysisDetails from '../views/AnalysisDetails'
import EmailDetails from '../components/IncidentResponder/emailDetails'
import Workshop from '../views/Workshop.vue'
import Test from '../views/Test'
import PermissionTypes from '../model/constants/permissionTypes'
import AuthenticationService from '../services/authentication'
import AuthenticationStatus from '../model/constants/authenticationStatus'
import InvestigationComponent from '../views/Investigations.vue'
import InvestigationDetailsComponent from '../views/InvestigationDetails.vue'
import PhishingReporter from '../views/PhishingReporter'
import Integrations from '../views/Integrations'
import Playbook from '../views/Playbook'
import store from '../store'
import Companies from '@/views/Companies'
import ExampleGrapesJS from '../components/GrapesJs/ExampleGrapesJS'
import CompanySettings from '@/views/CompanySettings'
import SystemUsers from '@/views/SystemUsers'
import Widgets from '@/views/Widgets'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active-link',
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        isAuthenticated: false
      }
    },
    {
      path: '/',
      name: 'home',
      component: Main,
      children: [
        {
          path: '/',
          name: 'Dashboard',
          meta: {
            isAuthenticated: true,
            permissions: [PermissionTypes.Permissions_Administrator]
          },
          component: DashBoard
        },
        {
          path: '/threat-sharing',
          name: 'Threat Sharing',
          component: ThreatSharing,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/community/:id',
          name: 'Community',
          component: Community,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/target-users',
          name: 'Target Users',
          component: TargetUsers,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/companies',
          name: 'Companies',
          component: Companies,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/company-group-details/:groupId',
          name: 'Company Group Details',
          component: Companies,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder',
          name: 'Incident Responder',
          component: IncidentResponder,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/company-settings',
          name: 'Company Settings',
          component: CompanySettings,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/widgets',
          name: 'Widgets',
          component: Widgets,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/system-users',
          name: 'System Users',
          component: SystemUsers,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder/:id',
          name: 'Analysis Details',
          component: EmailDetails,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/phishing-reporter',
          name: 'Phishing Reporter',
          component: PhishingReporter,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/integrations',
          name: 'Integrations',
          component: Integrations,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/playbook',
          name: 'Playbook',
          component: Playbook,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/investigations',
          name: 'Investigations',
          component: InvestigationComponent,
          meta: {
            isAuthenticated: true
          },
          props: true
        },
        {
          path: '/investigation-details/:id',
          name: 'Investigation Details',
          component: InvestigationDetailsComponent,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/analysis-details',
          name: 'Analysis Details',
          component: AnalysisDetails,
          meta: {
            isAuthenticated: true
          },
          props: true,
          params: true
        },
        {
          path: '/test',
          name: 'test',
          component: Test,
          meta: {
            isAuthenticated: false
          }
        },
        {
          path: '/workshop',
          name: 'Workshop',
          component: Workshop,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/grapesjs',
          name: 'Grapes',
          component: ExampleGrapesJS,
          meta: {
            isAuthenticated: true
          },
          props: true
        }
      ]
    },
    {
      path: '/shared-incident',
      name: 'Shared Incident',
      //component: SharedIncident,
      meta: {
        isAuthenticated: false
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const storeRef = store
  //storeli alakalı route değişiklikleri burada yönetilecek.
  if (to.meta.isAuthenticated) {
    let authenticationStatus = AuthenticationService.getAuthenticationStatus()
    if (authenticationStatus === AuthenticationStatus.AUTHENTICATED) {
      if (storeRef.state.common.downloadModalStatus) {
        storeRef.dispatch('common/changeDownloadModalStatus', false)
        next(false)
      } else {
        next()
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

/*router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.permissions)) {
    // TODO if Auth next() else redirect to login
    let isGrantedPermission = false
    to.meta.permissions.forEach(item => {
      if (isGranted(item)) {
        isGrantedPermission = true
      } // //////middleware
    });

    if (isGrantedPermission) {
      next()
    } else {
      router.push('/login')
    }
  }
  next()
});*/
export default router
