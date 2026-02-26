<template>
  <div id="container--threat-sharing" class="component-threat-sharing page-wrapper mt-1">
    <new-community
      v-if="isWantToAddNewCommunity"
      ref="refNewCommunity"
      :status="isWantToAddNewCommunity"
      :style="{ 'z-index': '999999' }"
      @closeAdd="onAddClose"
    />
    <v-layout id="ts-layout" wrap style="min-height: 79vh;">
      <v-col class="main-column pr-4 pl-4" cols="12" md="8">
        <v-card id="ts-card" class="pl-1 pt-2 pr-1">
          <v-tabs id="ts-tabs" v-model="tab" background-color="transparent" color="basil">
            <v-tab
              v-if="getCommunityPostsPermission"
              id="ts-tab-incident"
              :disabled="isStepDisabled"
              >Incidents</v-tab
            >
            <v-tab
              v-if="getAllCommunitiesPermission"
              :disabled="isStepDisabled"
              id="ts-tab-community"
              >Communities</v-tab
            >
          </v-tabs>
          <v-tabs-items v-model="tab" class="component-threat-sharing__tabs">
            <v-tab-item v-if="getCommunityPostsPermission" :disabled="isStepDisabled">
              <incidents
                ref="tsIncidents"
                :isLoadState="isLoadState"
                :isTableReload="isTableReload"
                @setLoadState="setLoadState"
                @setThreatSharingStepLoading="setThreatSharingStepLoading"
              />
            </v-tab-item>
            <v-tab-item v-if="getAllCommunitiesPermission" :disabled="isStepDisabled">
              <communities
                ref="tsCommunities"
                :refresh="refreshMemberTable"
                :isLoadState="isLoadState"
                :isTableReload="isTableReload"
                :page="page"
                @setLoadState="setLoadState"
                @setThreatSharingStepLoading="setThreatSharingStepLoading"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col id="ts-right-column" class="right-column pl-2" cols="12" md="4">
        <right-column
          class="right-col-desktop"
          :selectedTab="tab"
          @createCommunityAction="openCreateCommunityModal()"
          @joinRequestSuccess="joinRequestSuccess()"
        />
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import Incidents from '@/components/ThreatSharing/Incidents/Incidents'
import Communities from '@/components/ThreatSharing/Communities/Communities'
import RightColumn from '@/components/ThreatSharing/RightColumn/RightColumn'
import NewCommunity from '@/components/ThreatSharing/NewCommunity/NewCommunity'
import { mapGetters } from 'vuex'

export default {
  name: 'ThreatSharing',
  components: {
    Incidents,
    Communities,
    RightColumn,
    NewCommunity
  },
  watch: {
    tab() {
      this.getSelectedTabData()
    }
  },
  data: () => ({
    tab: 0,
    isWantToAddNewCommunity: false,
    refreshMemberTable: false,
    isLoadState: false,
    isTableReload: false,
    page: 1,
    isStepDisabled: false
  }),
  computed: {
    ...mapGetters({
      getAllCommunitiesPermission: 'permissions/getThreatSharingAllCommunitiesPermission',
      getMyCommunitiesPermission: 'permissions/getThreatSharingMyCommunitiesPermission',
      getCommunityPostsPermission: 'permissions/getThreatSharingCommunityPostsPermission'
    })
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$route.query.detailsId || vm.$route.params.isCommunity) {
        vm.tab = 1
      } else if (vm.$route.query.showInvitation && !vm.isLoadState) {
        vm.tab = 1
        setTimeout(() => {
          if (vm?.$refs?.tsCommunities) vm.$refs.tsCommunities.subTabSelected('tab-2')
        }, 1250)
      }
      if (!vm.getCommunityPostsPermission && !vm.getAllCommunitiesPermission) vm.$router.push('/')
      if (from.name !== 'Community') return
      const incidentsData = vm.$store.state['incidents'].incidents
      const communitiesData = vm.$store.state['communities'].communities
      const isTableReload = vm.$store.state['tableReload'].tableReload
      if (incidentsData.incidentsData || communitiesData.communitiesData) {
        vm.tab = incidentsData.incidentsData ? 0 : 1
        vm.isLoadState = true
        vm.isTableReload = isTableReload
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    const { refNewCommunity, tsCommunities, tsIncidents } = this.$refs
    if (this.isWantToAddNewCommunity && !refNewCommunity.isSubmitted) {
      refNewCommunity.onCancelClicked()
      next(false)
    } else if (tsCommunities && tsCommunities.isWantToAddNewCommunity) {
      tsCommunities.checkIfCanCloseCommunityModal()
      next(false)
    } else if (tsIncidents && tsIncidents.showPostIncident) {
      tsIncidents.checkIfCanCloseIncidentModal()
      next(false)
    } else {
      next()
    }
  },
  created() {
    if (!this.getCommunityPostsPermission) {
      this.tab = 1
    }
  },
  methods: {
    setThreatSharingStepLoading(val) {
      this.isStepDisabled = val
    },
    setLoadState() {
      this.isLoadState = false
      this.isTableReload = false
    },
    joinRequestSuccess() {
      this.getSelectedTabData()
    },
    getSelectedTabData() {
      setTimeout(() => {
        if (this.tab === 0 && this.getCommunityPostsPermission) {
          if (this.isLoadState || !this?.$refs?.tsIncidents) return
          this.$refs.tsIncidents.getIncidentList()
          this.$refs.tsIncidents.page = 1
          this.$refs.tsIncidents.itemsPerPage = 5
        } else {
          if (!this.getAllCommunitiesPermission) return
          const communitiesDataGlobal =
            this.$store.state['communities'].communities &&
            this.$store.state['communities'].communities.communitiesData
          this.page =
            (communitiesDataGlobal &&
              communitiesDataGlobal.searchValues &&
              communitiesDataGlobal.searchValues.page) ||
            1
          if (this.isLoadState || !this?.$refs?.tsCommunities) return
          this.$refs.tsCommunities.getAllCommunitiesListData()
          this.$refs.tsCommunities.getInvitationCount()
          this.$refs.tsCommunities.setInitialCommunityValues()
          this.$refs.tsCommunities.isCommunity = false
        }
      }, 50)
      setTimeout(() => {
        this.setLoadState()
      }, 100)
    },
    openCreateCommunityModal() {
      this.isWantToAddNewCommunity = true
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
      this.refreshMemberTable = !this.refreshMemberTable
    }
  }
}
</script>
