<template>
  <div class="communities-wrapper">
    <new-community
      v-if="isWantToAddNewCommunity"
      ref="newCommunityModal"
      :status="isWantToAddNewCommunity"
      :community-item="communityItem"
      :resource-id="resourceId"
      :style="{ 'z-index': '999999' }"
      @closeAdd="onAddClose"
    />
    <delete-community-dialog
      v-if="isWantToDelete"
      :status="isWantToDelete"
      :delete-community-name="deleteCommunityName"
      @on-close="isWantToDelete = false"
      @on-confirm="deleteCommunityConfirm()"
    />
    <leave-community-dialog
      v-if="isWantToToLeaveFromCommunity"
      :status="isWantToToLeaveFromCommunity"
      :leave-community-name="leaveCommunityName"
      :is-action-button-disabled="isLeaveFromCommunityButtonDisabled"
      @on-close="isWantToToLeaveFromCommunity = false"
      @on-confirm="leaveFromCommunityConfirm"
    />
    <CommunitiesNotificationDialog
      v-if="openNotificationModal"
      :status="openNotificationModal"
      :community-resource-id="selectedCommunityResourceId"
      @on-close="openNotificationModal = false"
    />
    <v-card flat color="basil">
      <v-card-text class="pt-2">
        <v-data-iterator
          hide-default-footer
          :items="selectedTab === 'tab-2' ? invitationData : listData"
          :page.sync="page"
          :items-per-page.sync="itemsPerPage"
          :footer-props="{ itemsPerPageOptions }"
          @change="$forceUpdate()"
        >
          <template v-slot:header>
            <v-tabs v-model="selectedTab" class="community-selector">
              <v-tab
                v-for="(tab, ind) in tabOptions"
                :key="ind"
                :id="`threat-sharing-communities-tab-${ind}`"
                :href="`#tab-${ind}`"
                class="text-decoration-none sub-tab__content"
                :disabled="communityLoading"
                @click="subTabSelected(tab)"
              >
                <template v-if="ind === 2">
                  {{ tab }}
                  <span
                    v-if="getMyInvitationsPermission && invitationsCount"
                    class="invitations-count"
                  >
                    {{ invitationsCount }}
                  </span>
                </template>
                <template v-else>
                  {{ tab }}
                </template>
              </v-tab>
            </v-tabs>
            <div class="search-wrapper">
              <div>
                <v-text-field
                  placeholder="Search"
                  outlined
                  class="filter-field search-wrapper__search-filter"
                  v-model.trim="filter"
                  id="incidents-search-textfield"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  :disabled="selectedTab === 'tab-2' || communityLoading"
                ></v-text-field>
              </div>
              <div>
                <v-combobox
                  :items="industryList"
                  item-text="name"
                  item-value="resourceId"
                  value="resourceId"
                  max-width="180"
                  outlined
                  class="edit-select search-wrapper__combobox"
                  v-model.trim="industryValue"
                  :placeholder="'Industry'"
                  hide-details
                  multiple
                  :disabled="selectedTab === 'tab-2' || communityLoading"
                  :slots="{ selection: true, item: false }"
                  @change="updateCommunities(true)"
                >
                  <template v-slot:selection="{ item, index }">
                    <span
                      v-if="index === 0"
                      style="
                        font-size: 13px;
                        line-height: 1.6;
                        letter-spacing: normal;
                        color: rgba(0, 0, 0, 0.72) !important;
                      "
                    >
                      {{ item.name }}
                    </span>
                    <span v-if="index === 1" class="caption pl-1">
                      (+{{ industryValue.length - 1 }})</span
                    >
                  </template>
                </v-combobox>
              </div>
              <div class="d-flex">
                <k-select
                  v-model="privacyValue"
                  :items="privacyList"
                  placeholder="Privacy"
                  outlined
                  multiple
                  hide-details
                  item-text="name"
                  item-value="id"
                  :menu-props="{ offsetY: true }"
                  :disabled="selectedTab === 'tab-2' || communityLoading"
                  :slots="{ selection: true, item: false }"
                  @change="updateCommunities(true)"
                >
                  <template #selection="{ item, index }">
                    <span
                      v-if="index === 0"
                      style="
                        font-size: 13px;
                        line-height: 1.6;
                        letter-spacing: normal;
                        color: rgba(0, 0, 0, 0.72) !important;
                      "
                    >
                      {{ item.name }}
                    </span>
                    <span v-if="index === 1" class="caption pl-1">
                      (+{{ privacyValue.length - 1 }})</span
                    >
                  </template>
                </k-select>
              </div>
            </div>
          </template>
          <template v-slot:default="props">
            <div v-if="selectedTab === 'tab-0' || selectedTab === 'tab-1'" id="tab-0">
              <div v-for="(item, ind) of props.items" :key="ind" class="threat-sharing-content">
                <community-card
                  :community="item"
                  :isOwnerOrMember="isOwnerOrMember(item)"
                  :isRequestToJoinDisabled="isRequestToJoinDisabled"
                  :canEditCommunity="getEditCommunityPermission && isOwner(item)"
                  :canLeaveCommunity="getLeaveCommunityPermission && isOwnerOrMember(item)"
                  :canDeleteCommunity="getDeleteCommunityPermission && isOwner(item)"
                  @detailsClick="communityDetails(item)"
                  @requestJoin="
                    requestJoin(item.communityResourceId, item.communityName, 'requestToJoin')
                  "
                  @join="requestJoin(item.communityResourceId, item.communityName, 'join')"
                  @invitedClick="subTabSelected"
                  @editCommunity="editCommunity(item)"
                  @notificationSettingsClick="setNotificationModal(item.communityResourceId)"
                  @leaveCommunity="leaveFromCommunity(item)"
                  @deleteCommunity="deleteCommunity(item)"
                  @cancelRequest="cancelRequest(item)"
                />
              </div>
            </div>
            <div v-if="selectedTab === 'tab-2' && getMyInvitationsPermission">
              <div v-for="(item, ind) of props.items" :key="ind" class="threat-sharing-content">
                <community-invitation-card
                  :community="item"
                  @communityNameClick="communityDetails(item)"
                  @refuseRequest="refuseRequest(item)"
                  @acceptRequest="acceptRequest(item)"
                />
              </div>
            </div>
          </template>
          <template v-if="communityLoading" slot="no-data">
            <v-skeleton-loader
              :loading="communityLoading"
              type="article, actions"
            ></v-skeleton-loader>
          </template>
          <template
            v-if="
              (!communityLoading && filter) ||
              (!communityLoading && industryValue.length) ||
              (!communityLoading && privacyValue.length)
            "
            slot="no-data"
          >
            <div
              v-if="selectedTab === 'tab-1' || selectedTab === 'tab-0'"
              class="empty-communities"
            >
              <div class="empty-communities-inline">
                <span class="no-community">
                  Sorry, that search and filter criteria has no results.
                </span>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-2'" id="tab-2">
              <div class="empty-communities-inline">
                <span class="no-community">
                  You don't have any invitations from communities
                </span>
                <v-btn
                  id="threat-sharing-communities-browse-communities-button"
                  class="create-com-btn mb-11"
                  @click="subTabSelected('All')"
                  rounded
                >
                  Browse Communities
                </v-btn>
              </div>
            </div>
          </template>
          <template
            v-else-if="!communityLoading && !industryValue.length && !filter"
            slot="no-data"
          >
            <div class="empty-communities" v-if="selectedTab === 'tab-1'">
              <div class="empty-communities-inline">
                <span class="no-community">
                  No community has been created
                </span>
                <v-btn
                  id="threat-sharing-communities-create-community-button"
                  class="create-com-btn mb-11"
                  rounded
                  @click="createNewCommunity()"
                >
                  Create Community
                </v-btn>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-0'">
              <div class="empty-communities-inline">
                <span class="no-community">
                  You haven’t joined any communities
                </span>
                <v-btn
                  id="threat-sharing-communities-browse-community-button-tab-0"
                  class="create-com-btn mb-11"
                  @click="subTabSelected('All')"
                  rounded
                >
                  Browse Communities
                </v-btn>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-2'" id="tab-2-2">
              <div class="empty-communities-inline">
                <span class="no-community">
                  You don't have any invitations from communities
                </span>
                <v-btn
                  id="threat-sharing-communities-browse-community-button-tab-2"
                  class="create-com-btn mb-11"
                  @click="subTabSelected('All')"
                  rounded
                >
                  Browse Communities
                </v-btn>
              </div>
            </div>
          </template>
          <template #footer>
            <v-row
              class="mt-2"
              justify="end"
              style="margin: 5px !important;"
              v-if="
                selectedTab && selectedTab === 'tab-2' ? invitationData.length : listData.length
              "
            >
              <el-pagination
                layout="sizes, prev, pager, next,slot"
                :current-page.sync="page"
                :page-sizes="itemsPerPageArray"
                :page-size="itemsPerPage"
                @size-change="handleSizeChange"
                @current-change="onChangePagination"
                :total="
                  selectedTab && selectedTab === 'tab-2'
                    ? invitationData.length
                    : totalNumberOfRecords
                "
              >
                <template>
                  <span class="el-pagination__total el-pagination__text--1">Rows per page:</span>
                  <span class="el-pagination__text el-pagination__text--2">
                    {{ page }}-{{ numberOfPages }}
                    of
                    {{
                      selectedTab && selectedTab === 'tab-2'
                        ? invitationData.length
                        : totalNumberOfRecords
                    }}
                  </span>
                </template>
              </el-pagination>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {
  acceptInvitation,
  cancelRequest,
  deleteCommunity,
  getAllCommunityList,
  getCommunityDetails,
  getInvitationCount,
  getInvitations,
  getMyCommunityList,
  joinCommunity,
  listBusinessCategories,
  refuseInvitation,
  removeFromCommunities
} from '@/api/threatSharing'
import { isOwner, isOwnerOrMember } from '@/utils/functions'
import NewCommunity from '@/components/ThreatSharing/NewCommunity/NewCommunity'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import CommunityCard from '@/components/ThreatSharing/Communities/CommunityCard'
import CommunityInvitationCard from '@/components/ThreatSharing/Communities/CommunityInvitationCard'
import { mapGetters } from 'vuex'
import DeleteCommunityDialog from '@/components/ThreatSharing/Communities/DeleteCommunityDialog'
import LeaveCommunityDialog from '@/components/ThreatSharing/Communities/LeaveCommunityDialog'
import CommunitiesNotificationDialog from '@/components/ThreatSharing/Communities/CommunitiesNotificationDialog'
import useDebounce from '@/hooks/useDebounce'
import { getAllCommunitiesFilter, privacyList } from '@/components/ThreatSharing/Communities/utils'

export default {
  components: {
    CommunitiesNotificationDialog,
    LeaveCommunityDialog,
    DeleteCommunityDialog,
    KSelect,
    NewCommunity,
    CommunityCard,
    CommunityInvitationCard
  },
  mixins: [useDebounce],
  computed: {
    ...mapGetters({
      getMyInvitationsPermission: 'permissions/getThreatSharingMyInvitationsPermission',
      getEditCommunityPermission: 'permissions/getThreatSharingEditCommunityPermission',
      getLeaveCommunityPermission: 'permissions/getThreatSharingLeaveCommunityPermission',
      getDeleteCommunityPermission: 'permissions/getThreatSharingDeleteCommunityPermission'
    }),
    numberOfPages() {
      const communitiesData =
        this.$store.state['communities'].communities ||
        this.$store.state['communities'].communities.communitiesData
      return Math.ceil(
        this.selectedTab && this.selectedTab === 'tab-2'
          ? this.invitationData && this.invitationData.length / this.itemsPerPage
          : (this.listData && communitiesData.totalNumberOfRecords) ||
              this.totalNumberOfRecords / this.itemsPerPage
      )
    }
  },
  data: () => ({
    totalNumberOfRecords: null,
    totalNumberOfPages: null,
    itemsPerPageArray: [5, 10, 20],
    page: 1,
    itemsPerPage: 5,
    isRequestToJoinDisabled: false,
    selectedCommunityResourceId: null,
    isLeaveFromCommunityButtonDisabled: false,
    labels,
    industryList: [],
    industryValue: [],
    privacyList,
    privacyValue: [],
    openNotificationModal: false,
    leaveCommunityName: null,
    isWantToToLeaveFromCommunity: false,
    isWantToDelete: false,
    deleteCommunityName: null,
    deleteCommunityId: null,
    invitationsCount: 0,
    resourceId: null,
    communityItem: null,
    isWantToAddNewCommunity: false,
    selectedTab: 'tab-1',
    tabOptions: ['Your Communities', 'All', 'Invitations'],
    communities: [],
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    filter: '',
    listData: [{}],
    invitationData: [],
    communityLoading: true
  }),
  props: {
    refresh: {
      type: Boolean
    },
    isLoadState: {
      type: Boolean
    },
    setLoadState: {
      required: false
    },
    isTableReload: {
      required: false
    },
    setThreatSharingStepLoading: {
      required: false
    }
  },
  watch: {
    communityLoading(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.$emit('setThreatSharingStepLoading', newVal)
      }
    },
    refresh(newVal, oldVal) {
      if (oldVal !== newVal && !this.isLoadState) {
        this.selectedTab = 'tab-1'
        this.getAllCommunitiesListData()
        this.getMyCommunitiesListData()
      }
    },
    filter(newVal, oldVal) {
      if (newVal !== oldVal && !this.isLoadState) {
        if (!newVal) {
          this.updateCommunities()
        } else {
          this.debounce(() => {
            this.updateCommunities()
          }, 1000)
        }
      }
    }
  },
  created() {
    this.getIndustryList()
    if (this.isLoadState) {
      const communitiesData =
        this.$store.state['communities'].communities &&
        this.$store.state['communities'].communities.communitiesData
      if (communitiesData) {
        this.filter = communitiesData.searchValues.filter
        this.industryValue = communitiesData.searchValues.industryValue
        this.privacyValue = communitiesData.searchValues.privacyValue
        this.selectedTab = communitiesData.searchValues.selectedTab
        this.page = communitiesData.searchValues.page
        this.totalNumberOfRecords = communitiesData.searchValues.totalNumberOfRecords
        this.totalNumberOfPages = communitiesData.searchValues.totalNumberOfPages
        this.selectedTab = communitiesData.searchValues.selectedTab
        this.communityLoading = false
        this.itemsPerPage = communitiesData.searchValues.itemsPerPage
        if (communitiesData.searchValues.selectedTab === 'tab-2') {
          this.invitationData = communitiesData.tableData
        } else {
          this.listData = communitiesData.tableData
        }
      } else {
        this.page = 1
        this.itemsPerPage = 5
        this.getAllCommunitiesListData()
        this.getInvitationCount()
        this.setInitialCommunityValues()
        this.$route.params.isCommunity = false
      }
      if (this.isTableReload) {
        this.page = 1
        this.filter = null
        this.industryValue = []
        this.privacyValue = []
        if (this.selectedTab === 'tab-0') {
          this.getMyCommunitiesListData(true)
        } else if (this.selectedTab === 'tab-1') {
          if (!this.$route.params.isCommunity) this.getAllCommunitiesListData(true)
        } else if (this.selectedTab === 'tab-2') {
          this.getInvitions()
        } else {
          return false
        }
        this.$store.dispatch('tableReload/setTableReload', false)
      }
      setTimeout(() => {
        this.$emit('setLoadState')
      }, 100)
    }

    if (this.$route.params.isCommunity) {
      if (this.$route.params.communityName === 'empty') {
        this.$parent.$parent.$parent.$parent.communityName = 'Loading...'
        getCommunityDetails(this.$route.params.communityId).then((response) => {
          this.communityDetails = response.data.data
          this.filter = response.data.data.name
          setTimeout(() => {
            this.$parent.$parent.$parent.$parent.communityName = response.data.data.name
          }, 250)
        })
        this.$route.params.isCommunity = false
      } else {
        this.filter = this.$route.params.communityName
        setTimeout(() => {
          this.$route.params.isCommunity = false
        }, 2000)
      }
    }
    if (!this.isLoadState) this.selectedTab = 'tab-1'
    setTimeout(() => {
      this.$emit('setLoadState')
    }, 100)
  },
  methods: {
    handleSizeChange(val) {
      this.itemsPerPage = val
      if (!this.isLoadState) {
        if (this.selectedTab === 'tab-0') {
          this.getMyCommunitiesListData(true)
        }
        if (this.selectedTab === 'tab-1') {
          if (!this.$route.params.isCommunity) this.getAllCommunitiesListData(true)
        } else {
          return false
        }
      }
    },
    onChangePagination() {
      if (!this.isLoadState) {
        if (this.selectedTab === 'tab-0') {
          this.getMyCommunitiesListData()
        }
        if (this.selectedTab === 'tab-1') {
          if (!this.$route.params.isCommunity) this.getAllCommunitiesListData()
        }
      }
    },
    setNotificationModal(communityResourceId) {
      this.selectedCommunityResourceId = communityResourceId
      this.openNotificationModal = true
    },
    getIndustryList() {
      listBusinessCategories().then((response) => {
        this.industryList = response.data.data
      })
    },
    isOwner(community) {
      return isOwner(community.membershipStatusId)
    },
    isOwnerOrMember(community) {
      return community.membershipStatusId === 2 || community.membershipStatusId === 1
    },
    cancelRequest(item) {
      cancelRequest(item.membershipResourceId).then(() => {
        this.getAllCommunitiesListData()
        this.getInvitationCount()
        this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
      })
    },
    deleteCommunity(item) {
      this.deleteCommunityName = item.communityName
      this.deleteCommunityId = item.communityResourceId
      this.isWantToDelete = true
    },
    deleteCommunityConfirm() {
      deleteCommunity(this.deleteCommunityId).then(() => {
        this.isWantToDelete = false
        if (this.selectedTab === 'tab-0') {
          this.getMyCommunitiesListData()
        }
        if (this.selectedTab === 'tab-1') {
          if (!this.$route.params.isCommunity) this.getAllCommunitiesListData()
        }
        if (this.selectedTab === 'tab-2') {
          this.getInvitions()
          this.getInvitationCount()
        } else {
          return false
        }
        setTimeout(() => {
          this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
        }, 500)
      })
    },
    setInitialCommunityValues() {
      if (!this.isLoadState) this.selectedTab = 'tab-1'
    },
    getInvitationCount() {
      if (this.getMyInvitationsPermission) {
        getInvitationCount()
          .then((response) => {
            this.invitationsCount = response.data.data.count
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.code === 'RESOURCE_NOT_FOUND'
            ) {
              this.invitationsCount = []
            }
          })
      }
    },
    refuseRequest(item) {
      refuseInvitation(item.resourceId).then(() => {
        this.getInvitions()
        this.getInvitationCount()
      })
    },
    acceptRequest(item) {
      item['disabled'] = true
      this.$forceUpdate()
      acceptInvitation(item.resourceId)
        .then(() => {
          this.getInvitions()
          this.getInvitationCount()
        })
        .finally(() => {
          item['disabled'] = false
        })
    },
    leaveFromCommunity(item) {
      this.leaveCommunityId = item.communityResourceId
      this.leaveCommunityName = item.communityName
      this.isWantToToLeaveFromCommunity = true
    },
    leaveFromCommunityConfirm() {
      this.isLeaveFromCommunityButtonDisabled = true
      removeFromCommunities(this.leaveCommunityId)
        .then(() => {
          this.isWantToToLeaveFromCommunity = false
          if (this.selectedTab === 'tab-0') {
            this.getMyCommunitiesListData(true)
          } else {
            this.getAllCommunitiesListData()
          }
          this.getInvitationCount()
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true).finally(() => {
              this.isLeaveFromCommunityButtonDisabled = false
            })
          }, 500)
        })
        .catch(() => {
          this.isLeaveFromCommunityButtonDisabled = false
        })
    },
    editCommunity(item) {
      this.resourceId = item.communityResourceId
      this.communityItem = item
      this.isWantToAddNewCommunity = true
    },
    checkIfCanCloseCommunityModal() {
      if (this.$refs.newCommunityModal) {
        this.$refs.newCommunityModal.onCancelClicked()
      }
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
      this.selectedTab = 'tab-1'
      this.getAllCommunitiesListData()
    },
    getInvitions() {
      if (this.getMyInvitationsPermission) {
        this.invitationData = []
        this.communityLoading = true
        getInvitations()
          .then((response) => {
            const { data } = response
            this.invitationData = data.data
            this.communityLoading = false
            this.totalNumberOfRecords = data.data.totalNumberOfRecords
            this.totalNumberOfPages = data.data.totalNumberOfPages
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.code === 'RESOURCE_NOT_FOUND'
            ) {
              this.invitationData = []
            }
          })
          .finally(() => {
            this.communityLoading = false
          })
      }
    },
    getCommunityPayload(isSearch) {
      return {
        pageNumber: isSearch ? 1 : this.page,
        pageSize: this.itemsPerPage,
        orderBy: 'createTime',
        ascending: false,
        filter: getAllCommunitiesFilter(
          this.filter,
          this.industryValue.map((item) => item.resourceId).toString() || '',
          this.privacyValue.toString() || ''
        )
      }
    },
    getAllCommunitiesListData(isSearch) {
      this.listData = []
      this.communityLoading = true
      getAllCommunityList(this.getCommunityPayload(isSearch))
        .then((response) => {
          const { data } = response
          if (isSearch) {
            this.page = 1
          }
          if (this.$route.params.isCommunity) {
            this.listData = data.data.results.filter(
              (item) => item.communityResourceId === this.$route.params.communityId
            )
            this.totalNumberOfRecords = data.data.totalNumberOfRecords
            this.totalNumberOfPages = data.data.totalNumberOfPages
          } else {
            this.listData = data.data.results
            this.totalNumberOfRecords = data.data.totalNumberOfRecords
            this.totalNumberOfPages = data.data.totalNumberOfPages
          }
        })

        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.listData = []
          }
        })
        .finally(() => {
          this.communityLoading = false
        })
    },
    getMyCommunitiesListData(isSearch) {
      this.listData = []
      this.communityLoading = true
      getMyCommunityList(this.getCommunityPayload(isSearch))
        .then((response) => {
          if (isSearch) {
            this.page = 1
          }
          const { data } = response
          this.listData = data.data.results
          this.totalNumberOfRecords = data.data.totalNumberOfRecords
          this.totalNumberOfPages = data.data.totalNumberOfPages
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.listData = []
          }
        })
        .finally(() => (this.communityLoading = false))
    },
    communityDetails(item) {
      if (isOwnerOrMember(item.membershipStatusId)) {
        localStorage.setItem('communityName', item.communityName)
        localStorage.setItem('communityResourceIdForRedirect', item.communityResourceId)
        localStorage.setItem('isCommunityOwner', item.membershipStatusId === 1 ? 'owner' : 'member')
        let communitiesData = {
          tableData: this.selectedTab === 'tab-2' ? this.invitationData : this.listData,
          searchValues: {
            filter: this.filter,
            industryValue: this.industryValue,
            privacyValue: this.privacyValue,
            selectedTab: this.selectedTab,
            page: this.page,
            totalNumberOfRecords: this.totalNumberOfRecords,
            totalNumberOfPages: this.totalNumberOfPages,
            itemsPerPage: this.itemsPerPage
          },
          type: 'community'
        }
        this.setCommunitiesAndIncidentsToStore(communitiesData)
        this.$router.push({
          name: `Community`,
          params: {
            id: item.communityResourceId,
            item: item,
            communityName: item.communityName
          }
        })
      } else {
        localStorage.setItem('isCommunityOwner', item.membershipStatusId === 1 ? 'owner' : 'member')
      }
    },
    setCommunitiesAndIncidentsToStore(communitiesData = null, incidentsData = null) {
      this.$store.dispatch('communities/setCommunities', {
        key: 'communities',
        communitiesData
      })
      this.$store.dispatch('incidents/setIncidents', {
        key: 'incidents',
        incidentsData
      })
    },
    updateCommunities() {
      this.$route.params.isCommunity = false
      if (!this.isLoadState) {
        if (this.selectedTab === 'tab-0') {
          this.getMyCommunitiesListData(true)
        } else if (this.selectedTab === 'tab-1') {
          if (!this.$route.params.isCommunity) this.getAllCommunitiesListData(true)
        } else if (this.selectedTab === 'tab-2') {
          this.getInvitions()
        } else {
          return false
        }
      }
    },
    requestJoin(communityId, communityName, type) {
      this.communityLoading = true
      this.isRequestToJoinDisabled = true
      joinCommunity(communityId)
        .then(() => {
          if (type === 'join') {
            this.listData.find(
              (item) => item.communityResourceId === communityId
            ).membershipStatusId = 2
            this.listData.find((item) => item.communityResourceId === communityId).memberCount =
              this.listData.find((item) => item.communityResourceId === communityId).memberCount + 1
            localStorage.setItem('communityName', communityName)
            localStorage.setItem('communityResourceIdForRedirect', communityId)
            let communitiesData = {
              tableData: this.selectedTab === 'tab-2' ? this.invitationData : this.listData,
              searchValues: {
                filter: this.filter,
                industryValue: this.industryValue,
                privacyValue: this.privacyValue,
                selectedTab: this.selectedTab,
                page: this.page,
                totalNumberOfRecords: this.totalNumberOfRecords,
                totalNumberOfPages: this.totalNumberOfPages,
                itemsPerPage: this.itemsPerPage
              },
              type: 'community'
            }
            this.setCommunitiesAndIncidentsToStore(communitiesData)
            this.$router.push({
              path: `/threat-sharing/community/${communityId}`,
              params: { communityName: communityName }
            })
          } else {
            this.listData.find(
              (item) => item.communityResourceId === communityId
            ).membershipStatusId = 3
            if (this.selectedTab === 'tab-1') {
              this.getAllCommunitiesListData()
            } else {
              this.getMyCommunitiesListData()
            }
          }

          setTimeout(() => {
            this.$store
              .dispatch('rightColumn/changeReloadRightColumnData', true)
              .finally(() => (this.isRequestToJoinDisabled = false))
          }, 500)
        })
        .catch(() => {
          this.isRequestToJoinDisabled = false
        })
        .finally(() => {
          this.communityLoading = false
        })
    },
    createNewCommunity() {
      this.isWantToAddNewCommunity = true
    },
    subTabSelected(name) {
      this.$route.params.isCommunity = false
      if (name === 'Your Communities' && !this.isLoadState) {
        this.selectedTab = 'tab-0'
        this.page = 1
        this.getMyCommunitiesListData()
      } else if (name === 'All' && !this.isLoadState) {
        this.selectedTab = 'tab-1'
        this.page = 1
        this.getAllCommunitiesListData()
      } else if (!this.isLoadState) {
        this.selectedTab = 'tab-2'
        this.page = 1
        this.filter = ''
        this.industryValue = []
        this.privacyValue = []
        this.getInvitions()
        this.getInvitationCount()
      }
    }
  }
}
</script>
