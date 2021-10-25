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
import Audit from '../views/Audit'
import MailConfiguration from '../components/MailConfiguration/MailConfiguration'
import store from '../store'
import Companies from '@/views/Companies'
import Company from '@/views/Company'
import ExampleGrapesJS from '../components/GrapesJs/ExampleGrapesJS'
import CompanySettings from '@/views/CompanySettings'
import SystemUsers from '@/views/SystemUsers'
import Widgets from '@/views/Widgets'
import TargetGroupUsers from '@/components/TargetUsers/GroupUsers/TargetGroupUsers'
import PhishingSimulator from '@/views/PhishingSimulator'
import Sandbox from '@/views/Sandbox'
import DnsServices from '@/views/DnsServices'
import CampaignManager from '@/views/CampaignManager'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active-link',
  scrollBehavior(to, from, savedPosition) {
    if (to.name === 'Incident Responder' && from.name === 'Incident Responder') {
      return
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
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
          component: DashBoard,
          beforeEnter: (to, from, next) => {
            //checkPermission()
            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()
            next()
          }
        },
        {
          path: '/',
          name: 'Company',
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          //redirect: { path: '/' },
          component: Company,
          beforeEnter: (to, from, next) => {
            //checkPermission()
            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()
            next()
          }
        },
        {
          path: '/threat-sharing',
          name: 'Threat Sharing',
          component: ThreatSharing,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          params: true,
          props: true
        },
        {
          path: '/community/:id',
          name: 'Community',
          component: Community,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Threat Sharing'
          },
          props: true,
          params: true,
          force: true
        },
        {
          path: '/target-users',
          name: 'Target Users',
          component: TargetUsers,
          beforeEnter: (to, from, next) => {
            //checkPermission()
            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Company'
          }
        },
        {
          path: '/target-users/:id',
          name: 'Target Group Users',
          component: TargetGroupUsers,
          meta: {
            isAuthenticated: true,
            parentName: 'Target Users'
          },
          props: true,
          params: true
        },
        {
          path: '/companies',
          name: 'Companies',
          component: Companies,
          beforeEnter: (to, from, next) => {
            //checkPermission()
            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Company'
          },
          props: true,
          params: true
        },
        {
          path: '/company-group-details/:groupId',
          name: 'Company Group Details',
          component: Companies,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Companies'
          },
          props: true,
          params: true
        },
        {
          path: '/phishing-scenarios',
          name: 'Phishing Scenarios',
          component: PhishingSimulator,
          beforeEnter: (to, from, next) => {
            //checkPermission()
            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()
            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          props: true,
          params: true
        },
        {
          path: '/services',
          name: 'DNSs and Domains',
          component: DnsServices,
          beforeEnter: (to, from, next) => {
            //checkPermission()
            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()
            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          props: true,
          params: true
        },
        {
          path: '/campaign-manager',
          name: 'Campaign Manager',
          component: CampaignManager,
          beforeEnter: (to, from, next) => {
            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder',
          name: 'Incident Responder',
          component: IncidentResponder,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          props: true,
          params: true
        },
        {
          path: '/company-settings',
          name: 'Company Settings',
          component: CompanySettings,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Company'
          },
          props: true,
          params: true
        },
        {
          path: '/widgets',
          name: 'Widgets',
          component: Widgets,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
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
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Company'
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder/:id',
          name: 'Analysis Details',
          component: EmailDetails,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder'
          },
          props: true,
          params: true
        },
        {
          path: '/phishing-reporter',
          name: 'Phishing Reporter',
          component: PhishingReporter,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          props: true,
          params: true
        },
        {
          path: '/integrations',
          name: 'Integrations',
          component: Integrations,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder'
          },
          props: true,
          params: true
        },
        {
          path: '/playbook',
          name: 'Playbook',
          component: Playbook,
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder'
          },
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          }
        },
        {
          path: '/audit',
          name: 'Audit',
          component: Audit,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder'
          },
          props: true,
          params: true
        },
        {
          path: '/mailConfiguration',
          name: 'Mail Configurations',
          component: MailConfiguration,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder'
          },
          props: true,
          params: true
        },
        {
          path: '/sandbox',
          name: 'Cross Company Integration',
          component: Sandbox,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder'
          },
          props: true,
          params: true
        },
        {
          path: '/investigations',
          name: 'Investigations',
          component: InvestigationComponent,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder'
          },
          props: true
        },
        {
          path: '/investigation-details/:id',
          name: 'Investigation Details',
          component: InvestigationDetailsComponent,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true,
            parentName: 'Investigations'
          },
          props: true,
          params: true
        },
        {
          path: '/analysis-details',
          name: 'Analysis Details',
          component: AnalysisDetails,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
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
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: false
          }
        },
        {
          path: '/workshop',
          name: 'Workshop',
          component: Workshop,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
          meta: {
            isAuthenticated: true
          }
        },
        {
          path: '/grapesjs',
          name: 'Grapes',
          component: ExampleGrapesJS,
          beforeEnter: (to, from, next) => {
            //checkPermission()

            next()
          },
          beforeRouteUpdate: (to, from, next) => {
            //checkPermission()

            next()
          },
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
  //global guard structure
  const storeRef = store
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
