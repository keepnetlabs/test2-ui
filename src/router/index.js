import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import DashBoard from '../views/DashBoard'
import Main from '../layout/Main'
import ThreatSharing from '../views/ThreatSharing'
import Community from '../views/Community'
import TargetUsers from '../views/TargetUsers'
import IncidentResponder from '../views/IncidentResponder'
import EmailDetails from '../components/IncidentResponder/emailDetails'
import Workshop from '../views/Workshop.vue'
import Test from '../views/Test'
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
import CompanySettings from '@/views/CompanySettings'
import SystemUsers from '@/views/SystemUsers'
import TargetGroupUsers from '@/components/TargetUsers/GroupUsers/TargetGroupUsers'
import PhishingSimulator from '@/views/PhishingSimulator'
import Sandbox from '@/views/Sandbox'
import DnsServices from '@/views/DnsServices'
import CampaignManager from '@/views/CampaignManager'
import CampaignManagerReport from '@/views/CampaignManagerReport'
import CampaignReports from '@/views/CampaignReports'
import Reports from '@/views/Reports'

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
      component: Main,
      children: [
        {
          path: '/',
          name: 'Dashboard',
          meta: {
            isAuthenticated: true
          },
          component: DashBoard
        },
        {
          path: '/',
          name: 'Company',
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          component: Company
        },
        {
          path: '/threat-sharing',
          name: 'Threat Sharing',
          component: ThreatSharing,
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
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          props: true,
          params: true
        },
        {
          path: '/services',
          name: 'DNS and Domains',
          component: DnsServices,
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
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard'
          },
          props: true,
          params: true
        },
        {
          path: '/campaign-report/:id',
          name: 'Campaign Report',
          component: CampaignManagerReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Campaign Manager'
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder',
          name: 'Incident Responder',
          component: IncidentResponder,
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
          meta: {
            isAuthenticated: true,
            parentName: 'Company'
          },
          props: true,
          params: true
        },
        {
          path: '/system-users',
          name: 'System Users',
          component: SystemUsers,
          meta: {
            isAuthenticated: true,
            parentName: 'Company'
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder/reported-emails/email-details/:id',
          name: 'Analysis Details',
          component: EmailDetails,
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
          }
        },
        {
          path: '/audit',
          name: 'Audit',
          component: Audit,
          meta: {
            isAuthenticated: true,
            parentName: 'Company'
          },
          props: true,
          params: true
        },
        {
          path: '/mailConfiguration',
          name: 'Mail Configurations',
          component: MailConfiguration,
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
          meta: {
            isAuthenticated: true,
            parentName: 'Investigations'
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
          path: '/reports',
          name: 'Reports',
          component: Reports,
          meta: {
            isAuthenticated: true
          },
          children: [
            {
              path: '/campaign-reports',
              name: 'Campaign Reports',
              component: CampaignReports,
              meta: {
                isAuthenticated: true,
                parentName: 'Reports'
              }
            }
          ]
        }
      ]
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

export default router
