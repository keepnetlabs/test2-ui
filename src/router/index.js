import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import DashBoard from '@/views/DashBoard'
import Main from '@/layout/Main'
import ThreatSharing from '@/views/ThreatSharing'
import Community from '@/views/Community'
import ShowAllJobs from '@/views/ShowAllJobs'
import TargetUsers from '@/views/TargetUsers'
import IncidentResponder from '@/views/IncidentResponder'
import EmailDetails from '@/components/IncidentResponder/emailDetails'
import AuthenticationService from '@/services/authentication'
import AuthenticationStatus from '@/model/constants/authenticationStatus'
import InvestigationComponent from '@/views/Investigations.vue'
import InvestigationDetailsComponent from '@/views/InvestigationDetails.vue'
import PhishingReporter from '@/views/PhishingReporter'
import Integrations from '@/views/Integrations'
import Playbook from '@/views/Playbook'
import Audit from '@/views/Audit'
import MailConfiguration from '@/components/MailConfiguration/MailConfiguration'
import store from '@/store'
import Companies from '@/views/Companies'
import Company from '@/views/Company'
import CompanySettings from '@/views/CompanySettings'
import SystemUsers from '@/views/SystemUsers'
import TargetGroupUsers from '@/components/TargetUsers/GroupUsers/TargetGroupUsers'
import PhishingSimulator from '@/views/PhishingSimulator'
import Sandbox from '@/views/Sandbox'
import Settings from '@/views/Settings'
import CampaignManager from '@/views/CampaignManager'
import CampaignManagerReport from '@/views/CampaignManagerReport'
import CampaignReports from '@/views/CampaignReports'
import Reports from '@/views/Reports'
import PhishingSimulatorRoute from '@/views/PhishingSimulatorRoute'
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
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getCompanyLeftMenuPermissions'
          },
          component: Company
        },
        {
          path: '/phishing-simulator',
          name: 'Phishing Simulator',
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getPhishingSimulatorLeftMenuPermissions'
          },
          component: PhishingSimulatorRoute
        },
        {
          path: '/threat-sharing',
          name: 'Threat Sharing',
          component: ThreatSharing,
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getThreatSharingLeftMenuPermissions'
          },
          params: true,
          props: true
        },
        {
          path: '/threat-sharing/community/:id',
          name: 'Community',
          component: Community,
          meta: {
            isAuthenticated: true,
            parentName: 'Threat Sharing',
            permissionStoreKey: 'permissions/getThreatSharingLeftMenuPermissions'
          },
          props: true,
          params: true,
          force: true
        },
        {
          path: '/company/job-log',
          name: 'Job Log',
          component: ShowAllJobs,
          meta: {
            isAuthenticated: true,
            parentName: 'Company',
            permissionStoreKey: 'permissions/getAuditLogSearchPermission'
          }
        },
        {
          path: '/company/target-users',
          name: 'Target Users',
          component: TargetUsers,
          meta: {
            isAuthenticated: true,
            parentName: 'Company',
            permissionStoreKey: 'permissions/getTargetUsersLeftMenuPermissions'
          }
        },
        {
          path: '/company/target-users/:id',
          name: 'Target Group Users',
          component: TargetGroupUsers,
          meta: {
            isAuthenticated: true,
            parentName: 'Target Users',
            permissionStoreKey: 'permissions/getTargetUsersLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/company/companies',
          name: 'Companies',
          component: Companies,
          meta: {
            isAuthenticated: true,
            parentName: 'Company',
            permissionStoreKey: 'permissions/getCompaniesLeftMenuPermissions'
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
            parentName: 'Companies',
            permissionStoreKey: 'permissions/getCompaniesLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/phishing-simulator/phishing-scenarios',
          name: 'Phishing Scenarios',
          component: PhishingSimulator,
          meta: {
            isAuthenticated: true,
            parentName: 'Phishing Simulator',
            permissionStoreKey: 'permissions/getPhishingScenarioLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/phishing-simulator/settings',
          name: 'Settings',
          component: Settings,
          meta: {
            isAuthenticated: true,
            parentName: 'Phishing Simulator',
            permissionStoreKey: 'permissions/getSettingsLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/phishing-simulator/campaign-manager',
          name: 'Campaign Manager',
          component: CampaignManager,
          meta: {
            isAuthenticated: true,
            parentName: 'Phishing Simulator',
            permissionStoreKey: 'permissions/getCampaignManagerLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/reports/campaign-reports/campaign-report/:id',
          name: 'Campaign Report',
          component: CampaignManagerReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Campaign Reports',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
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
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getIncidentResponderLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/company/company-settings',
          name: 'Company Settings',
          component: CompanySettings,
          meta: {
            isAuthenticated: true,
            parentName: 'Company',
            permissionStoreKey: 'permissions/getCompanySettingsLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/company/system-users',
          name: 'System Users',
          component: SystemUsers,
          meta: {
            isAuthenticated: true,
            parentName: 'Company',
            permissionStoreKey: 'permissions/getSystemUserSearchPermission'
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
            parentName: 'Incident Responder',
            permissionStoreKey: 'permissions/getIncidentResponderNotifiedEmailPermission'
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
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getPhishingReporterLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder/integrations',
          name: 'Integrations',
          component: Integrations,
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder',
            permissionStoreKey: 'permissions/getIntegrationsSearchPermission'
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder/playbook',
          name: 'Playbook',
          component: Playbook,
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder',
            permissionStoreKey: 'permissions/getPlaybookSearchPermission'
          }
        },
        {
          path: '/company/audit',
          name: 'Audit',
          component: Audit,
          meta: {
            isAuthenticated: true,
            parentName: 'Company',
            permissionStoreKey: 'permissions/getAuditLogSearchPermission'
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder/mailConfiguration',
          name: 'Mail Configurations',
          component: MailConfiguration,
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder',
            permissionStoreKey: 'permissions/getMailConfigurationSearchPermission'
          },
          beforeEnter(to, from, next) {
            to.params.PERMISSIONS =
              store?.getters['permissions/getMailConfigurationPermissions'] || {}
            next()
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder/sandbox',
          name: 'Cross Company Integration',
          component: Sandbox,
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder',
            permissionStoreKey: 'permissions/getCrossCompanyPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/incident-responder/investigations',
          name: 'Investigations',
          component: InvestigationComponent,
          meta: {
            isAuthenticated: true,
            parentName: 'Incident Responder',
            permissionStoreKey: 'permissions/getInvestigationsSearchPermission'
          },
          beforeEnter(to, from, next) {
            to.params.PERMISSIONS = store?.getters['permissions/getInvestigationPermissions'] || {}
            next()
          },
          props: true
        },
        {
          path: '/incident-responder/investigation-details/:id',
          name: 'Investigation Details',
          component: InvestigationDetailsComponent,
          meta: {
            isAuthenticated: true,
            parentName: 'Investigations',
            permissionStoreKey: 'permissions/getInvestigationsSearchPermission'
          },
          props: true,
          params: true
        },
        {
          path: '/reports/campaign-reports',
          name: 'Campaign Reports',
          component: CampaignReports,
          meta: {
            isAuthenticated: true,
            parentName: 'Reports',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
          }
        }
        // {
        //   path: '/reports',
        //   name: 'Reports',
        //   component: Reports,
        //   meta: {
        //     isAuthenticated: true,
        //     permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
        //   },
        //   children: [
        //     {
        //       path: '/campaign-reports',
        //       name: 'Campaign Reports',
        //       component: CampaignReports,
        //       meta: {
        //         isAuthenticated: true,
        //         parentName: 'Reports',
        //         permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
        //       }
        //     }
        //     /*
        //     {
        //       path: '/simple-reports',
        //       name: 'Simple Reports',
        //       component: SimpleReports,
        //       meta: {
        //         isAuthenticated: true,
        //         parentName: 'Reports'
        //       }
        //     },
        //     {
        //       path: `/simple-reports/:id`,
        //       name: 'Simple Report Details',
        //       component: SimpleReportDetails,
        //       meta: {
        //         isAuthenticated: true,
        //         parentName: 'Reports'
        //       }
        //     }

        //      */
        //   ]
        // }
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
        if (to.name === 'Dashboard' || storeRef.getters[to.meta.permissionStoreKey]) next()
        else next(from.name ? false : '/')
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
