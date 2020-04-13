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
import Investigations from '../views/Investigations'
import SharedIncident from '../views/SharedIncident'
import Test from '../views/Test'
import PermissionTypes from '../model/constants/permissionTypes'
import AuthenticationService from '../services/authentication'
import AuthenticationStatus from '../model/constants/authenticationStatus'

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
          path: '/investigations',
          name: 'Investigations',
          component: Investigations,
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
      component: SharedIncident,
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
      if (router.currentRoute.name != 'login') next('/login')
    }
  } else {
    next()
  }
})

export default router
