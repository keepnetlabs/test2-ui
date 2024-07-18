<template>
  <div id="community-page-wrapper" class="page-wrapper mt-1">
    <div class="component-threat-sharing page-wrapper">
      <new-community
        v-if="isWantToAddNewCommunity"
        ref="refNewCommunity"
        :status="isWantToAddNewCommunity"
        :style="{ 'z-index': '999999' }"
        @closeAdd="onAddClose"
      />
      <v-overlay
        v-if="showPostIncident"
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
                v-if="getThreatSharingGetIncidentsPermission"
                id="incidents-tab"
                @click="getIncidents"
                >Incidents</v-tab
              >
              <v-tab
                v-if="getThreatSharingGetMembersPermission"
                id="members-tab"
                @click="getMembers"
                >Members</v-tab
              >
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item
                v-if="getThreatSharingGetIncidentsPermission"
                :transition="false"
                :reverse-transition="false"
              >
                <incidents ref="refIncidents" :refreshIncidents="refreshIncidentsData" />
              </v-tab-item>
              <v-tab-item
                v-if="getThreatSharingGetMembersPermission"
                :transition="false"
                :reverse-transition="false"
              >
                <members ref="refMembers" @selectedMemberPost="selectedMemberPostFunc" />
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
        <v-col class="right-column" cols="12" md="4">
          <right-column
            class="right-col-desktop"
            @postIncident="showPostIncidentFunc"
            @createCommunityAction="openCreateCommunityModal()"
            @refreshData="refreshDataFunc"
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
    tab: 0,
    isWantToAddNewCommunity: false
  }),
  computed: {
    ...mapGetters({
      getThreatSharingEditCommunityPermission:
        'permissions/getThreatSharingEditCommunityPermission',
      getThreatSharingGetIncidentsPermission: 'permissions/getThreatSharingGetIncidentsPermission',
      getThreatSharingGetMembersPermission: 'permissions/getThreatSharingGetMembersPermission'
    })
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
  },
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
    }
  }
}
</script>
