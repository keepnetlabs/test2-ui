import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import DashBoard from '@/views/DashBoard'
import Main from '@/layout/Main'
import ThreatSharing from '@/views/ThreatSharing'
import Community from '@/views/Community'
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
import SmishingSettings from '@/views/SmishingSettings'
import CampaignManager from '@/views/CampaignManager'
import CampaignManagerReport from '@/views/CampaignManagerReport'
import CampaignReports from '@/views/CampaignReports'
import PhishingSimulatorRoute from '@/views/PhishingSimulatorRoute'
import SmishingSimulatorRoute from '@/views/SmishingSimulatorRoute'
import SmishingScenarios from '@/views/SmishingScenarios'
import SmishingCampaignManager from '@/views/SmishingCampaignManager'
import SmishingReport from '@/views/SmishingReport'
import CallbackSimulatorRoute from '@/views/CallbackSimulatorRoute'
import CallbackCampaignManager from '@/views/CallbackCampaignManager'
import CallbackScenarios from '@/views/CallbackScenarios'
import CallbackReport from '@/views/CallbackReport'
import CallbackSettings from '@/components/CallbackSettings/Settings'
import VishingRoute from '@/views/VishingRoute'
import VishingTemplates from '@/views/VishingTemplates'
import VishingCampaignManager from '@/views/VishingCampaignManager'
import TrainingReport from '@/views/TrainingReport'
import AwarenessEducator from '@/views/AwarenessEducator'
import Enrollments from '@/views/Enrollments'
import Certificates from '@/views/Certificates'
import Scorm from '@/views/Scorm'
import EmailThreatSimulator from '@/views/EmailThreatSimulator'
import EmailThreatSimulatorReports from '@/views/EmailThreatSimulatorReports'
import ThreatIntelligence from '@/views/ThreatIntelligence'
import JobLog from '@/views/JobLog'
import VishingReport from '@/views/VishingReport'
import AdvancedReports from '@/views/AdvancedReports'
import AdvancedReport from '@/views/AdvancedReport'
import Reports from '@/views/Reports'
import PhishedLandingPage from '@/views/PhishedLandingPage.vue'
import QuishingSimulatorRoute from '@/views/QuishingSimulatorRoute.vue'
import QuishingSimulator from '@/views/QuishingSimulator.vue'
import QuishingCampaignManager from '@/views/QuishingCampaignManager.vue'
import QuishingSettings from '@/views/QuishingSettings.vue'
import QuishingCampaignManagerReport from '@/views/QuishingCampaignManagerReport.vue'
import ScormProxyReport from '@/views/ScormProxyReport.vue'
import TrainingLibrary from '@/views/TrainingLibrary.vue'
import ExecutiveReports from '@/views/ExecutiveReports.vue'
import NewExecutiveReport from '@/views/NewExecutiveReport.vue'
import PreviewExecutiveReport from '@/views/PreviewExecutiveReport.vue'
import EditExecutiveReport from '@/views/EditExecutiveReport.vue'
import DuplicateExecutiveReport from '@/views/DuplicateExecutiveReport.vue'
import ScheduledExecutiveReport from '@/views/ScheduledExecutiveReport.vue'
import ScheduledReports from '@/views/ScheduledReports.vue'
import GamificationReport from '@/views/GamificationReport'
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
      path: '/training/scorm/watch',
      name: 'scorm',
      component: Scorm,
      meta: {
        isAuthenticated: false
      }
    },
    {
      path: '/training/scorm/phished-landing-page',
      name: 'scorm',
      component: PhishedLandingPage,
      meta: {
        isAuthenticated: false
      }
    },
    {
      path: '/reports/executive-reports/scheduled-executive-report/:id',
      name: 'Scheduled Executive Report',
      component: ScheduledExecutiveReport,
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
          path: '/company',
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
          path: '/smishing-simulator',
          name: 'Smishing Simulator',
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getSmishingSimulatorLeftMenuPermissions'
          },
          component: SmishingSimulatorRoute
        },
        {
          path: '/callback-simulator',
          name: 'Callback Simulator',
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getCallbackSimulatorLeftMenuPermissions'
          },
          component: CallbackSimulatorRoute
        },

        {
          path: '/quishing-simulator',
          name: 'Quishing Simulator',
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getQuishingSimulatorLeftMenuPermissions'
          },
          component: QuishingSimulatorRoute
        },
        {
          path: '/vishing',
          name: 'Vishing Simulator',
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getVishingLeftMenuPermissions'
          },
          component: VishingRoute
        },
        {
          path: '/vishing/vishing-templates',
          name: 'Vishing Templates',
          meta: {
            isAuthenticated: true,
            parentName: 'Vishing Simulator',
            permissionStoreKey: 'permissions/getVishingTemplatesLeftMenuPermissions'
          },
          component: VishingTemplates
        },
        {
          path: '/vishing/campaign-manager',
          name: 'Vishing Campaign Manager',
          meta: {
            isAuthenticated: true,
            parentName: 'Vishing Simulator',
            permissionStoreKey: 'permissions/getVishingCampaignManagerLeftMenuPermissions'
          },
          component: VishingCampaignManager
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
          path: '/awareness-educator',
          name: 'Awareness Educator',
          component: AwarenessEducator,
          meta: {
            parentName: 'Dashboard',
            isAuthenticated: true,
            permissionStoreKey: 'permissions/getAwarenessEducatorListGroupPermissions'
          },
          children: [
            {
              path: 'training-library',
              name: 'Training Library',
              meta: {
                isAuthenticated: true,
                parentName: 'Awareness Educator',
                permissionStoreKey: 'permissions/getTrainingSearchPermission'
              },
              component: TrainingLibrary
            },
            {
              path: 'enrollments',
              name: 'Enrollments',
              meta: {
                isAuthenticated: true,
                parentName: 'Awareness Educator',
                permissionStoreKey: 'permissions/getEnrollmentsSearchPermission'
              },
              component: Enrollments
            },
            {
              path: 'certificates',
              name: 'Certificates',
              meta: {
                isAuthenticated: true,
                parentName: 'Awareness Educator',
                permissionStoreKey: 'permissions/getCertificatesSearchPermission'
              },
              component: Certificates
            },
            {
              path: 'enrollments/training-report/:id',
              name: 'Training Report',
              meta: {
                isAuthenticated: true,
                parentName: 'Enrollments',
                permissionStoreKey: 'permissions/getTrainingReportsSearchPermissions'
              },
              props: true,
              params: true,
              component: TrainingReport
            },
            {
              path: 'enrollments/scorm-proxy-report/:id',
              name: 'Scorm Proxy Report',
              meta: {
                isAuthenticated: true,
                parentName: 'Enrollments',
                permissionStoreKey: 'permissions/getTrainingReportsSearchPermissions'
              },
              props: true,
              params: true,
              component: ScormProxyReport
            }
          ]
        },
        {
          path: '/company/job-log',
          name: 'Job Log',
          component: JobLog,
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
          path: '/company/companies/company-group-details/:groupId',
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
          path: '/smishing-simulator/smishing-scenarios',
          name: 'Smishing Scenarios',
          component: SmishingScenarios,
          meta: {
            isAuthenticated: true,
            parentName: 'Smishing Simulator',
            permissionStoreKey: 'permissions/getSmishingScenariosLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/smishing-simulator/campaign-manager',
          name: 'Smishing Campaign Manager',
          component: SmishingCampaignManager,
          meta: {
            isAuthenticated: true,
            parentName: 'Smishing Simulator',
            permissionStoreKey: 'permissions/getSmishingCampaignManagerLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/smishing-simulator/settings',
          name: 'Smishing Settings',
          component: SmishingSettings,
          meta: {
            isAuthenticated: true,
            parentName: 'Smishing Simulator',
            permissionStoreKey: 'permissions/getSmishingSettingsLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/smishing-report/:id/:instanceGroup',
          name: 'Smishing Report',
          component: SmishingReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Smishing Campaign Manager',
            permissionStoreKey: 'permissions/getSmishingReportSummaryPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/callback-simulator/callback-scenarios',
          name: 'Callback Scenarios',
          component: CallbackScenarios,
          meta: {
            isAuthenticated: true,
            parentName: 'Callback Simulator',
            permissionStoreKey: 'permissions/getCallbackScenarioLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/callback-simulator/campaign-manager',
          name: 'Callback Campaign Manager',
          component: CallbackCampaignManager,
          meta: {
            isAuthenticated: true,
            parentName: 'Callback Simulator',
            permissionStoreKey: 'permissions/getCallbackCampaignManagerLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/callback-simulator/settings',
          name: 'Callback Settings',
          component: CallbackSettings,
          meta: {
            isAuthenticated: true,
            parentName: 'Callback Simulator',
            permissionStoreKey: 'permissions/getCallbackSettingsLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/callback-report/:id/:instanceGroup',
          name: 'Callback Report',
          component: CallbackReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Callback Campaign Manager',
            permissionStoreKey: 'permissions/getCallbackReportSummaryPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/quishing-simulator/quishing-scenarios',
          name: 'Quishing Scenarios',
          component: QuishingSimulator,
          meta: {
            isAuthenticated: true,
            parentName: 'Quishing Simulator',
            permissionStoreKey: 'permissions/getQuishingScenarioLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/quishing-simulator/campaign-manager',
          name: 'Quishing Campaign Manager',
          component: QuishingCampaignManager,
          meta: {
            isAuthenticated: true,
            parentName: 'Quishing Simulator',
            permissionStoreKey: 'permissions/getQuishingCampaignManagerLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/quishing-simulator/settings',
          name: 'Quishing Settings',
          component: QuishingSettings,
          meta: {
            isAuthenticated: true,
            parentName: 'Quishing Simulator',
            permissionStoreKey: 'permissions/getQuishingSettingsLeftMenuPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/reports/quishing-campaign-reports/campaign-report/:id/:instanceGroup',
          name: 'Quishing Report',
          component: QuishingCampaignManagerReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Quishing Campaign Manager',
            permissionStoreKey: 'permissions/getQuishingCampaignReportsSearchPermissions'
          },
          props: true,
          params: true
        },
        {
          path: '/reports/campaign-reports/campaign-report/:id/:instanceGroup',
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
          path: '/reports/advanced-reports/advanced-report/:id',
          name: 'Advanced Report',
          component: AdvancedReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Advanced Reports',
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
          path: '/incident-responder/cross-company-integration',
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
          path: '/incident-responder/investigations/investigation-details/:id',
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
          path: '/reports',
          name: 'Reports',
          component: Reports,
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
          }
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
        },
        {
          path: '/reports/advanced-reports',
          name: 'Advanced Reports',
          component: AdvancedReports,
          meta: {
            isAuthenticated: true,
            parentName: 'Reports',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
          }
        },
        {
          path: '/reports/executive-reports',
          name: 'Executive Reports',
          component: ExecutiveReports,
          meta: {
            isAuthenticated: true,
            parentName: 'Reports',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
          }
        },
        {
          path: '/reports/scheduled-reports',
          name: 'Scheduled Reports',
          component: ScheduledReports,
          meta: {
            isAuthenticated: true,
            parentName: 'Reports',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
          }
        },
        {
          path: '/reports/gamification-report',
          name: 'Gamification Report',
          component: GamificationReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Reports',
            permissionStoreKey: 'permissions/getGamificationReportSearchPermissions'
          }
        },
        {
          path: '/reports/executive-reports/new',
          name: 'New Executive Report',
          component: NewExecutiveReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Executive Reports',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
          }
        },
        {
          path: '/reports/executive-reports/preview/:id',
          name: 'Preview Executive Report',
          component: PreviewExecutiveReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Executive Reports',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
          }
        },
        {
          path: '/reports/executive-reports/edit/:id',
          name: 'Edit Executive Report',
          component: EditExecutiveReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Executive Reports',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
          }
        },
        {
          path: '/reports/executive-reports/duplicate/:id',
          name: 'Duplicate Executive Report',
          component: DuplicateExecutiveReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Executive Reports',
            permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
          }
        },
        {
          path: '/email-threat-simulator',
          name: 'Email Threat Simulator',
          component: EmailThreatSimulator,
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getEtsQuickScanPermissionSearch'
          },
          params: true,
          props: true
        },
        {
          path: '/email-threat-simulator/report/:id',
          name: 'Scan Report',
          component: EmailThreatSimulatorReports,
          meta: {
            isAuthenticated: true,
            parentName: 'Email Threat Simulator',
            permissionStoreKey: 'permissions/getEtsQuickScanPermissionSearch'
          },
          params: true,
          props: true
        },
        {
          path: 'vishing-report/:id',
          name: 'Vishing Report',
          component: VishingReport,
          meta: {
            isAuthenticated: true,
            parentName: 'Vishing Campaign Manager',
            permissionStoreKey: 'permissions/getVishingReportsSummaryPermissions'
          },
          params: true
        },
        {
          path: '/threat-intelligence',
          name: 'Threat Intelligence',
          component: ThreatIntelligence,
          meta: {
            isAuthenticated: true,
            parentName: 'Dashboard',
            permissionStoreKey: 'permissions/getEtsQuickScanPermissionSearch'
          },
          params: true,
          props: true
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
  if (to.path === 'threat-sharing' && from.path === 'threat-sharing') {
    return false
  }
  try {
    const storeRef = store
    if (to.meta.isAuthenticated) {
      let authenticationStatus = AuthenticationService.getAuthenticationStatus()
      if (authenticationStatus === AuthenticationStatus.AUTHENTICATED) {
        if (storeRef.state.common.downloadModalStatus) {
          storeRef.dispatch('common/changeDownloadModalStatus', false)
          next(false)
        } else if (to.name === 'Dashboard' || storeRef.getters[to.meta.permissionStoreKey]) {
          next()
        } else next(from.name ? false : '/')
      } else {
        next('/login')
      }
    } else {
      next()
    }
  } catch (err) {}
})

export default router
