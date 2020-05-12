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
//import SharedIncident from '../views/SharedIncident'
import Test from '../views/Test'
import PermissionTypes from '../model/constants/permissionTypes'
import AuthenticationService from '../services/authentication'
import AuthenticationStatus from '../model/constants/authenticationStatus'
import InvestigationComponent from '../views/Investigations.vue'
import InvestigationDetailsComponent from '../views/InvestigationDetails.vue'
import PhishingReporter from "../views/PhishingReporter";
import Integrations from "../views/Integrations";
import Playbook from "../views/Playbook";

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active-link',
  scrollBehavior() {
    return {x: 0, y: 0}
  },
  routes: [{
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
      children: [{
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
          }
        },
        {
          path: '/community/:name',
          name: 'Community',
          component: Community,
          meta: {
            isAuthenticated: true
          }
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
          path: '/incident-responder',
          name: 'Incident Responder',
          component: IncidentResponder,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/phishing-reporter',
          name: 'Phishing Reporter',
          component: PhishingReporter,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/integrations',
          name: 'Integrations',
          component: Integrations,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/playbook',
          name: 'Playbook',
          component: Playbook,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/investigations',
          name: 'Investigations',
          component: InvestigationComponent,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/investigation-details/:id',
          name: 'Investigation Details',
          component: InvestigationDetailsComponent,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/analysis-details',
          name: 'Analysis Details',
          component: AnalysisDetails,
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/test',
          name: 'test',
          component: Test,
          meta: {
            isAuthenticated: false
          }
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
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.isAuthenticated) {
    let authenticationStatus = AuthenticationService.getAuthenticationStatus()
    if (authenticationStatus === AuthenticationStatus.AUTHENTICATED) {
      next()
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
