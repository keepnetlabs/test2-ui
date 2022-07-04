<template>
  <div id="community-page-wrapper" class="page-wrapper mt-1">
    <div id="" class="component-threat-sharing page-wrapper">
      <v-overlay
        :value="isWantToAddNewCommunity"
        :class="{ newCommunityOverlay: isWantToAddNewCommunity }"
        :opacity="1"
        :z-index="9"
        color="white"
      >
        <new-community ref="refNewCommunity" @closeAdd="onAddClose" />
      </v-overlay>
      <v-overlay
        id="new-community-overlay"
        :value="showPostIncident"
        :class="{ newCommunityOverlay: showPostIncident }"
        :opacity="1"
        :z-index="9"
        color="white"
      >
        <post-incident
          ref="refPostIncident"
          @closeIncidentModal="closeIncidentModal"
          @refreshData="refreshDataFunc"
        />
      </v-overlay>
      <v-layout wrap>
        <v-col class="main-column pr-0" cols="12" md="8">
          <v-card id="community-tabs" class="pl-1 pt-2 pr-1">
            <v-tabs v-model="tab" background-color="transparent" color="basil">
              <v-tab
                id="incidents-tab"
                @click="getIncidents"
                v-if="getThreatSharingGetIncidentsPermission"
                >Incidents</v-tab
              >
              <v-tab
                id="members-tab"
                @click="getMembers"
                v-if="getThreatSharingGetMembersPermission"
                >Members</v-tab
              >
              <div class="tablet-info-btn" style="display: none !important;">
                <v-btn
                  id="info-btn"
                  class="create-com-btn"
                  @click="mobileInfoClicked"
                  block
                  rounded
                >
                  <v-icon class="pr-1">mdi-information</v-icon>
                  INFO
                </v-btn>
              </div>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item
                :transition="false"
                :reverse-transition="false"
                v-if="getThreatSharingGetIncidentsPermission"
              >
                <incidents
                  ref="refIncidents"
                  :posts="[]"
                  :incidentsCommunityName="''"
                  :refreshIncidents="refreshIncidentsData"
                />
              </v-tab-item>
              <v-tab-item
                :transition="false"
                :reverse-transition="false"
                v-if="getThreatSharingGetMembersPermission"
              >
                <members ref="refMembers" @selectedMemberPost="selectedMemberPostFunc" />
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
        <v-col class="right-column" cols="12" md="4">
          <right-column
            @postIncident="showPostIncidentFunc"
            @createCommunityAction="openCreateCommunityModal()"
            @refreshData="refreshDataFunc"
            class="right-col-desktop"
          />
        </v-col>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Incidents from '@/components/ThreatSharing/Incidents/Incidents'
import Members from '@/components/ThreatSharing/Members/Members'
import PostIncident from '@/components/ThreatSharing/PostIncident/PostIncident'
import RightColumn from '@/components/ThreatSharing/RightColumn/RightColumn'
import NewCommunity from '@/components/ThreatSharing/NewCommunity/NewCommunity'
import { mapGetters } from 'vuex'
export default {
  name: 'ThreatSharing',
  components: {
    PostIncident,
    Incidents,
    Members,
    RightColumn,
    NewCommunity
  },
  data: () => ({
    routerCount: 0,
    refreshIncidentsData: false,
    showPostIncident: false,
    communityDetails: {},
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    tab: 0,
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    notificationSettingsOpened: false,
    isWantToAddNewCommunity: false,
    isWantToEditCommunity: false,
    isWantToDeleteCommunity: false,
    isWantToAddMembers: false,
    isWantToPostIncident: false,
    isWantToLeaveFromCommunity: false,
    ex11: true,
    inviteEmail: '',
    activator: null,
    attach: null,
    colors: ['#e0e0e0'],
    editing: null,
    index: -1,
    items: [],
    nonce: 1,
    menu: false,
    model: [],
    x: 0,
    inviteSearch: null,
    y: 0,
    IsNotificationsEnabled: false,
    yourPosts: [],
    mails: null,
    emailData: {
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/@\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      email: (v) => {
        if (v.length > 0) {
          let booReturn = true
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          for (let i = 0; i < v.length; i++) {
            if (!pattern.test(v[i])) {
              booReturn = false
              document.getElementsByClassName('v-chip--select')[i].style.borderColor = '#ff5252'
              document.getElementsByClassName('v-chip--select')[i].style.color = '#ff5252'
              return v[i] + ' address is not valid'
            } else if (v.length === i) {
              return booReturn
            } else {
              booReturn = true
            }
          }
          return booReturn
        } else {
          return true
        }
      },
      maxFive: (v) => {
        if (v.length > 5) {
          return 'Maximum 5 email for each invite'
        } else {
          return true
        }
      },
      required: (v) => (v && v.length >= 1) || 'You should type an email to invite'
    },
    validEmail: false,
    emailSearch: null,
    emailsForApi: [],
    isMailChanged: false,
    windowWidth: 0,
    pageView: true,
    maxCharForEmail: false
  }),
  computed: {
    ...mapGetters({
      getThreatSharingEditCommunityPermission:
        'permissions/getThreatSharingEditCommunityPermission',
      getThreatSharingGetIncidentsPermission: 'permissions/getThreatSharingGetIncidentsPermission',
      getThreatSharingGetMembersPermission: 'permissions/getThreatSharingGetMembersPermission'
    })
  },
  created() {},
  mounted() {
    if (!this.getThreatSharingEditCommunityPermission) {
      this.$router.push('/threat-sharing')
    }
    if (!this.getThreatSharingGetIncidentsPermission) {
      this.tab = 1
      this.getMembers()
    }

    if (!this.getThreatSharingGetMembersPermission) {
      this.tab = 0
      this.getIncidents()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    selectedMemberPostFunc(item) {
      this.tab = 0
      setTimeout(() => {
        this.$refs.refIncidents.getIncidentList(item.communityResourceId, item.companyResourceId)
      }, 50)
    },
    refreshDataFunc() {
      this.$refs.refIncidents.getIncidentList()
      this.refreshIncidentsData = true
    },
    closeIncidentModal() {
      this.showPostIncident = false
    },
    showPostIncidentFunc() {
      this.showPostIncident = true
    },
    openCreateCommunityModal() {
      this.isWantToAddNewCommunity = true
    },
    getIncidents() {
      //this.$router.replace({ postId: null })
      setTimeout(() => {
        if (this.getThreatSharingGetIncidentsPermission) {
          this.$refs.refIncidents.getIncidentList()
        }
      }, 50)
    },
    getMembers() {
      setTimeout(() => {
        if (this.getThreatSharingGetMembersPermission) {
          this.$refs.refMembers.getCommunityDetails()
        }
      }, 50)
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
    },
    onResize() {
      this.windowWidth = window.outerWidth
    },
    onEditClose() {
      this.isWantToEditCommunity = false
    },
    onCancelLeave() {
      this.isWantToLeaveFromCommunity = false
    },
    mobileInfoClicked() {
      this.$store.commit('threatSharing/SET_MOBILE_INFO', true)
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refPostIncident, refIncidents, refNewCommunity } = this.$refs
    if (this.showPostIncident) {
      refPostIncident.onCancelClicked()
      next(false)
    } else if (refIncidents && refIncidents.showPostIncident) {
      refIncidents.checkIfCanCloseIncidentModal()
      next(false)
    } else if (this.isWantToAddNewCommunity && !refNewCommunity.isSubmitted) {
      this.isWantToAddNewCommunity = false
      next(false)
    } else {
      next()
    }
  },
  watch: {
    $route(to, from) {
      this.$nextTick(() => {
        if (to.name === from.name) {
          if (!this.getThreatSharingEditCommunityPermission) {
            this.$router.push('/threat-sharing')
          }
          if (!this.getThreatSharingGetIncidentsPermission) {
            this.tab = 1
            this.getMembers()
          }
          if (to.query.postId) {
            this.$refs.refIncidents.isSharedPost = true
            this.$refs.refIncidents.incidentList = []
            this.$refs.refIncidents.getSharedPost()
          } else {
            if (this.routerCount < 2) {
              this.tab = 0
              this.getIncidents()
              this.routerCount = this.routerCount + 1
              setTimeout(() => {
                this.routerCount = 0
              }, 250)
            }
          }
        }
      })
    }
  }
}
</script>
