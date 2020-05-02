<template>
  <v-card flat color="basil">
    <v-dialog v-model="confirmDialog" max-width="444" :opacity="0.23">
      <v-card light class="confirm-dialog pb-4 pa-6" style="width: 444px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">
              mdi-delete
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Delete Community?</v-list-item-title>
            <v-list-item-subtitle class="invite-sub-header v-card-sub-header"
            >{{ selectedCommunName }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <div class="delete-dialog-body">
          All incidents and data will be lost
        </div>
        <v-card-actions class="pa-0">
          <v-spacer></v-spacer>
          <v-btn text color="#2196f3" class="pa-0" @click="confirmDialog = false">
            Cancel
          </v-btn>
          <v-btn text color="#f56c6c" class="pa-0" @click="deleteCommunity()">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="leaveDialog" max-width="444" :opacity="0.23">
      <v-card light class="confirm-dialog pb-4 pa-6" style="width: 444px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">
              mdi-exit-to-app
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Leave Community?</v-list-item-title>
            <v-list-item-subtitle class="invite-sub-header v-card-sub-header"
            >{{ selectedCommunName }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <div class="delete-dialog-body">
          <span v-if="selectedCommunPrivacy" class="delete-info">
            You are leaving "{{ selectedCommunName }}". You won’t be able to access this community
          </span>
          <span v-else class="delete-info">
            You are leaving "{{ selectedCommunName }}". You won’t be able to post incidents to this
            community
          </span>
        </div>
        <v-card-actions class="pa-0 pt-4">
          <v-spacer></v-spacer>
          <v-btn text color="#2196f3" class="pa-0" @click="leaveDialog = false">
            Cancel
          </v-btn>
          <v-btn text color="#f56c6c" class="pa-0" @click="leaveCommunity()">
            Leave
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-text class="pt-2">
      <v-data-iterator
        :items="listCommunities"
        :page="page"
        :items-per-page.sync="itemsPerPage"
        :footer-props="{ itemsPerPageOptions }"
        :search="filter"
        :no-data-text="'Sorry, we couldn\'t find any results matching your criteria'"
      >
        <template v-slot:header>
          <v-tabs v-model="yoursOrAll" class="community-selector">
            <v-tab
              v-for="(tab, ind) in tabOptions"
              :key="ind"
              @click="subTabSelected(tab)"
              :href="`#tab-${ind}`"
            >
              {{ tab }}
            </v-tab>
          </v-tabs>
          <div class="search-wrapper">
            <v-text-field
              @mouseover.native="hover = true"
              label="Filter by attributes or keywords"
              outlined
              dense
              class="filter-field pt-6"
              v-model="filter"
              @input="updateCommunities()"
            ></v-text-field>
            <v-icon class="filter-icon" @click.native="updateCommunities()"
            >mdi-filter-variant
            </v-icon>
          </div>
        </template>
        <template v-slot:default="items">
          <div v-if="yoursOrAll === 'tab-0' || yoursOrAll === 'tab-1'">
            <div v-for="(comp, ind) of items.items" :key="ind" class="threat-sharing-content">
              <div class="ts-header">
                <div
                  class="ts-title"
                  @click="
                    goToCommunity(
                      comp.Name,
                      comp.CommunityId,
                      comp.Description,
                      comp.BusinessCategoryText,
                      comp.IsPrivate,
                      comp.CreateUserId,
                      comp.CommunityCompany[0].CompanyId
                    )
                  "
                >
                  {{ comp.Name }}
                </div>
                <div class="flex-grow-1"></div>
                <div class="ts-header-btn-1">
                  <v-btn
                    v-if="isOwnerOfTheCommunity(comp.CommunityCompany[0].CompanyId)"
                    outlined
                    rounded
                    medium
                    color="blue"
                  >
                    OWNER
                  </v-btn>
                  <v-btn
                    v-else-if="
                      isRequestSent(comp.CommunityId) &&
                        !isJoined(comp.CommunityId) &&
                        comp.IsPrivate
                    "
                    outlined
                    rounded
                    medium
                    class="join-button"
                  >
                    <v-icon style="font-size: 20px; margin-right: 8px;">mdi-account-clock </v-icon>
                    REQUEST SENT
                  </v-btn>
                  <v-btn
                    v-else-if="isJoined(comp.CommunityId)"
                    outlined
                    rounded
                    medium
                    color="blue"
                  >
                    MEMBER
                  </v-btn>
                  <v-btn
                    v-else-if="!isJoined(comp.CommunityId) && comp.IsPrivate"
                    outlined
                    rounded
                    medium
                    class="join-button"
                    @click="requestJoin(comp.CommunityId, comp.IsPrivate, comp.Name)"
                  >
                    <v-icon style="font-size: 20px; margin-right: 8px;">mdi-account-plus </v-icon>
                    REQUEST TO JOIN
                  </v-btn>
                  <v-btn
                    v-else
                    outlined
                    rounded
                    medium
                    class="join-button"
                    @click="requestJoin(comp.CommunityId, comp.IsPrivate, comp.Name)"
                  >
                    <v-icon style="font-size: 20px; margin-right: 8px;">mdi-account-plus </v-icon>
                    JOIN
                  </v-btn>
                </div>
                <v-menu
                  v-if="
                    isOwnerOfTheCommunity(comp.CommunityCompany[0].CompanyId) ||
                      isJoined(comp.CommunityId)
                  "
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn icon color="blue" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <div class="notification-wrapper">
                    <v-list dense flat>
                      <v-list-item-group color="primary">
                        <v-list-item
                          v-if="isOwnerOfTheCommunity(comp.CommunityCompany[0].CompanyId)"
                          @click="
                            editCommunity(
                              comp.Name,
                              comp.CommunityId,
                              comp.Description,
                              comp.BusinessCategoryText,
                              comp.IsPrivate,
                              comp.CreateUserId
                            )
                          "
                        >
                          <v-list-item-icon>
                            <v-icon>mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Edit Community</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click="openNotificationSettings(comp.CommunityId)">
                          <v-list-item-icon>
                            <v-icon>mdi-bell</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Notification Settings</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          v-if="
                            isJoined(comp.CommunityId) &&
                              !isOwnerOfTheCommunity(comp.CommunityCompany[0].CompanyId)
                          "
                          @click="
                            openLeaveDialog(
                              comp.CommunityId,
                              comp.CreateUserId,
                              comp.Name,
                              comp.IsPrivate
                            )
                          "
                        >
                          <v-list-item-icon>
                            <v-icon>mdi-exit-to-app</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Leave</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          @click="openConfirmDialog(comp.CommunityId, comp.ModifyUserId, comp.Name)"
                          v-if="isOwnerOfTheCommunity(comp.CommunityCompany[0].CompanyId)"
                        >
                          <v-list-item-icon>
                            <v-icon>mdi-delete</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Delete</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </div>
                </v-menu>
                <div v-else style="width: 40px; display: block;"></div>
              </div>
              <div class="ts-user-comp">
                <div class="ts-user-comp-detail">
                  <v-icon class="ts-people-icon pr-1">mdi-account-multiple</v-icon>
                  <span class="pr-2">{{ comp.MemberCount }}</span>
                  &bull;
                  <span class="ts-community-industry pl-2 pr-2">
                    {{ comp.BusinessCategoryText || 'Industry' }}
                  </span>
                  &bull;
                  <span class="ts-community-industry pl-2" v-if="comp.IsPrivate === true"
                  >Private</span
                  >
                  <span class="ts-community-industry pl-2" v-else-if="comp.IsPrivate === false"
                  >Public</span
                  >
                </div>
                <div v-if="comp && comp.ModifyDate" class="ts-community-date pt-1">
                  Last update: {{ comp.ModifyDate.substring(0, 10).replace(/-/g, '.') }}
                </div>
              </div>
              <div class="ts-body">
                <v-clamp autoresize :max-lines="3">
                  {{ comp.Description }}
                </v-clamp>
              </div>
            </div>
          </div>
          <div v-if="yoursOrAll === 'tab-2'">
            <div v-for="(comp, ind) of items.items" :key="ind" class="threat-sharing-content">
              <div class="ts-header">
                <div class="ts-title">
                  {{ comp.Name }}
                </div>
                <div class="flex-grow-1"></div>
                <div class="ts-header-btn-1">
                  <v-btn
                    @click="
                      cancelInvitation(comp.CommunityId, comp.CreateUserId, comp.CommunityRequestId)
                    "
                    outlined
                    rounded
                    medium
                    class="invitation-cancel"
                  >
                    CANCEL
                  </v-btn>
                  <v-btn
                    @click="
                      acceptInvitation(comp.CommunityId, comp.CreateUserId, comp.CommunityRequestId)
                    "
                    outlined
                    rounded
                    medium
                    class="join-button invitation-accept ml-1"
                  >
                    JOIN
                  </v-btn>
                </div>
              </div>
              <div class="ts-user-comp">
                <div class="ts-user-comp-detail">
                  <v-icon class="ts-people-icon pr-1">mdi-account-multiple</v-icon>
                  {{ comp.MemberCount }}
                  <span class="ts-community-industry pl-2">
                    {{ comp.BusinessCategoryText || 'Industry' }}
                  </span>
                </div>
                <div v-if="comp && comp.ModifyDate" class="ts-community-date pt-1">
                  Last update: {{ comp.ModifyDate.substring(0, 10).replace(/-/g, '.') }}
                </div>
              </div>
              <div class="ts-body">
                <v-clamp autoresize :max-lines="3">
                  {{ comp.Description }}
                </v-clamp>
              </div>
            </div>
          </div>
        </template>
        <template v-if="!filter || filter.length < 1" slot="no-data">
          <div class="empty-communities" v-if="yoursOrAll === 'tab-1'">
            <div class="empty-communities-inline">
              <span class="no-community">
                No community has been created, yet
              </span>
              <v-btn class="create-com-btn mb-11" @click="createNewCommunity()" block rounded>
                Create Community
              </v-btn>
            </div>
          </div>
          <div class="empty-communities" v-if="yoursOrAll === 'tab-0'">
            <div class="empty-communities-inline">
              <span class="no-community">
                You haven’t joined any communities, yet
              </span>
              <v-btn class="create-com-btn mb-11" @click="subTabSelected('All')" rounded>
                Browse Communities
              </v-btn>
            </div>
          </div>
          <div class="empty-communities" v-if="yoursOrAll === 'tab-2'">
            <div class="empty-communities-inline">
              <span class="no-community">
                You don't have any invitations from communities
              </span>
              <v-btn class="create-com-btn mb-11" @click="subTabSelected('All')" rounded>
                Browse Communities
              </v-btn>
            </div>
          </div>
        </template>
      </v-data-iterator>
    </v-card-text>
  </v-card>
</template>
<script>
  import VClamp from 'vue-clamp'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      VClamp
    },
    data: () => ({
      yoursOrAll: 'tab-1',
      tabOptions: ['Your Communities', 'All', 'Invitations'],
      communities: ['keepnet'],
      search: '',
      page: 1,
      itemsPerPageOptions: [5, 10, 20],
      itemsPerPage: 5,
      filter: '',
      filteredBefore: false,
      filteredValue: '',
      confirmDialog: false,
      leaveDialog: false,
      communityId: '',
      deleteId: '',
      creatorOfCommun: '',
      selectedCommunName: '',
      selectedSubTab: null,
      debounce: null,
      mountedCommunities: [],
      invitedCommunities: [],
      selectedCommunPrivacy: null
    }),
    computed: {
      ...mapGetters({
        communityList: 'threadSharing/communityGetter',
        myCommunities: 'threadSharing/myCommunitiesGetter',
        selectedCommunity: 'threadSharing/selectedCommunityGetter',
        requests: 'threadSharing/requestsGetter',
        getSelectedCompany: 'dashboard/getSelectedCompany',
        invitations: 'threadSharing/invitationsGetter'
      }),
      listCommunities: {
        get() {
          if (this.yoursOrAll === 'tab-1') {
            return this.communityList.Results.sort(function(a, b) {
              if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
                return -1
              }
              if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
                return 1
              }
              return 0
            })
          } else if (this.yoursOrAll === 'tab-0') {
            return this.myCommunities.sort(function(a, b) {
              if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
                return -1
              }
              if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
                return 1
              }
              return 0
            })
          } else if (this.yoursOrAll === 'tab-2') {
            return this.invitations
          }
        },
        set(filtered) {
          this.communityList.Results = filtered
        }
      },
      userId() {
        return localStorage.getItem('userId')
      },
      companyId() {
        return localStorage.getItem('companyId')
      }
    },
    watch: {
      yoursOrAll(val) {
        if (val && val == 'tab-0') {
          let myCommuns = []
          for (let a of this.listCommunities) {
            let match = this.myCommunities.find(c => c.CommunityId == a.CommunityId)
            if (match) myCommuns.push(match)
          }
          this.listCommunities = myCommuns
        }
      }
    },
    mounted() {
      this.yoursOrAll = 'tab-1'
      this.mountedCommunities = this.communityList.Results
      this.$store.dispatch('threadSharing/getInvitions')
    },
    methods: {
      updateCommunities() {
        clearTimeout(this.debounce)
        const refThis = this
        this.debounce = setTimeout(function() {
          if (refThis.filteredValue != refThis.filter) {
            if (refThis.filter.length) {
              if (refThis.yoursOrAll === 'tab-1') {
                refThis.listCommunities = refThis.mountedCommunities.filter(
                  f => f.Name.toLowerCase().indexOf(refThis.filter.toLowerCase()) !== -1
                )
              } else if (refThis.yoursOrAll === 'tab-0') {
                refThis.listCommunities = refThis.myCommunities.filter(
                  f => f.Name.toLowerCase().indexOf(refThis.filter.toLowerCase()) !== -1
                )
              }
              refThis.filteredBefore = true
              refThis.filteredValue = refThis.filter
            } else if (refThis.filteredBefore) {
              if (refThis.yoursOrAll === 'tab-1') {
                refThis.$store.dispatch('threadSharing/getCommunities').then(() => {
                  refThis.listCommunities = refThis.mountedCommunities.filter(
                    f => f.Name.toLowerCase().indexOf(refThis.filter.toLowerCase()) !== -1
                  )
                })
              } else if (refThis.yoursOrAll === 'tab-0') {
                refThis.$store.dispatch('threadSharing/getCommunities').then(() => {
                  refThis.listCommunities = refThis.myCommunities.filter(
                    f => f.Name.toLowerCase().indexOf(refThis.filter.toLowerCase()) !== -1
                  )
                })
              }
              refThis.filteredBefore = true
              refThis.filteredValue = refThis.filter
            } else {
              refThis.$store.dispatch('threadSharing/getCommunities')
              refThis.filteredBefore = true
              refThis.filteredValue = refThis.filter
            }
          } else {
            if (refThis.yoursOrAll === 'tab-1') {
              return refThis.listCommunities
            }
          }
        }, 300)
      },
      openNotificationSettings(id) {
        this.selectedCommunity.id = id
        this.$emit('open-notification', id)
      },
      createNewCommunity() {
        this.$emit('create-community')
      },
      refreshCommunities() {
        this.$store.dispatch('threadSharing/getCommunities')
      },
      refreshRequests() {
        this.$store.dispatch('threadSharing/getRequestsCompany', localStorage.getItem('companyId'))
      },
      editCommunity(name, communityId, description, category, privacy, creator) {
        this.$store.dispatch('threadSharing/setSelectedCommunity', {
          id: communityId,
          name: name,
          description: description,
          industry: category,
          privacy: privacy
        })
        localStorage.setItem('creatorId', creator)
        this.$emit('edit-community')
      },
      goToCommunity(name, communityId, description, category, privacy, creator, communCompId) {
        if (!this.isJoined(communityId) && privacy) {
          return
        }
        localStorage.setItem('companyId', this.getSelectedCompany.companyId)
        localStorage.setItem('communityName', name)
        localStorage.setItem('communityDesc', description)
        localStorage.setItem('communityCat', category)
        localStorage.setItem('communityPrivacy', privacy)
        localStorage.setItem('creatorId', creator)
        localStorage.setItem('communityId', communityId)
        localStorage.setItem('communityCompanyId', communCompId)
        this.$store.dispatch('common/activateLoader', true)
        const refThis = this
        setTimeout(() => {
          refThis.$store.dispatch('common/activateLoader', false)
        }, 700)
        this.$router.push({ path: `/Community/${name}` })
        this.$store.dispatch('threadSharing/setSelectedCommunity', {
          id: communityId,
          name: name,
          description: description,
          industry: category,
          privacy: privacy,
          communityCompanyId: communCompId
        })
      },
      isJoined(id) {
        if (this.myCommunities && this.myCommunities.length) {
          return this.myCommunities.some(cId => cId.CommunityId == id)
        }
      },
      isOwnerOfTheCommunity(communityCompId) {
        if (this.getSelectedCompany.companyId === communityCompId) {
          return true
        } else {
          return false
        }
      },
      subTabSelected(name) {
        if (name == 'Your Communities') {
          this.yoursOrAll = 'tab-0'
          let myCommuns = []
          for (let a of this.listCommunities) {
            let match = this.myCommunities.find(c => c.CommunityId == a.CommunityId)
            if (match) myCommuns.push(match)
          }
          this.listCommunities = myCommuns
        } else if (name == 'All') {
          this.yoursOrAll = 'tab-1'
          this.$store.dispatch('threadSharing/getCommunities')
        } else {
          this.yoursOrAll = 'tab-2'
          return
        }
      },
      openLeaveDialog(communityId, creatorOfCommun, name, privacy) {
        this.leaveDialog = true
        this.communityId = communityId
        this.creatorId = creatorOfCommun
        this.selectedCommunName = name
        this.selectedCommunPrivacy = privacy
      },
      leaveCommunity() {
        this.$store.dispatch('threadSharing/leaveCommunity', {
          communityId: this.communityId,
          creatorId: this.creatorId
        })
        this.leaveDialog = false
      },
      openConfirmDialog(communityId, deleteId, name) {
        this.confirmDialog = true
        this.communityId = communityId
        this.deleteId = deleteId
        this.selectedCommunName = name
      },
      deleteCommunity() {
        this.$store.dispatch('threadSharing/deleteCommunity', {
          communityId: this.communityId,
          userId: this.deleteId
        })
        this.confirmDialog = false
      },
      requestJoin(communId, privacy, name) {
        this.$store
          .dispatch('threadSharing/joinCommunity', {
            CommunityId: communId,
            CompanyId: localStorage.getItem('companyId'),
            CreateUserId: localStorage.getItem('userId'),
            IsPrivate: privacy,
            CommunityName: name
          })
          .then(() => {
            this.refreshRequests()
            this.refreshCommunities()
          })
      },
      isRequestSent(communId) {
        return this.requests.some(cId => cId.CommunityId === communId)
      },
      cancelInvitation(communId, createUserId, communReqId) {
        const refuseObj = {
          CommunityId: communId,
          InvitedCompanyId: localStorage.getItem('companyId'),
          CreateUserId: createUserId,
          CommunityRequestId: communReqId
        }
        this.$store.dispatch('threadSharing/setRefuseInvitation', refuseObj)
      },
      acceptInvitation(communId, createUserId, communReqId) {
        const refuseObj = {
          CommunityId: communId,
          InvitedCompanyId: localStorage.getItem('companyId'),
          CreateUserId: createUserId,
          CommunityRequestId: communReqId
        }
        this.$store.dispatch('threadSharing/setAcceptInvitation', refuseObj)
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .community-selector {
    .v-tabs-bar {
      height: 44px !important;
    }
  }

  ::v-deep .community-selector .v-slide-group__wrapper {
    background-color: #f5f7fa !important;
    height: 44px !important;
    padding-left: 0 !important;

    .v-tab {
      font-weight: 400;
      font-size: 14px !important;
      margin-top: 6px;
      margin-right: 32px !important;
    }
  }

  ::v-deep .community-selector .v-slide-group__wrapper > div {
    height: 100%;
    margin-right: 0 !important;
  }

  .v-tab {
    padding: 0 3px !important;
    font-size: 20px;
    font-weight: 400;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    text-transform: none;
    color: rgba(0, 0, 0, 0.87);
    min-width: min-content !important;
    text-align: left !important;
  }

  .search-wrapper {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      padding-right: 10px;
    }

    .filter-icon {
      color: rgba(0, 0, 0, 0.34) !important;
      cursor: pointer;
    }
  }

  .threat-sharing-content {
    min-height: 150px;
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12);
    background-color: #ffffff;
    padding: 24px;
    margin-bottom: 16px;
  }

  .ts-header {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .ts-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.87);
    max-height: 70px;
    max-width: 60%;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .ts-body {
    margin-top: 8px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .ts-user-comp {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);

    a {
      text-decoration: none;
    }

    .ts-user-date {
      font-weight: bold;
    }
  }

  .ts-user-comp-detail {
    align-items: center;
    display: flex;
  }

  .ts-community-industry {
    font-family: 'Open Sans', sans-serif !important;
    color: rgba(0, 0, 0, 0.87) !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
  }

  .ts-people-icon {
    font-size: 16px;
  }

  .notification-wrapper {
    background-color: #fff;
  }

  .v-menu__content {
    border-radius: 8px !important;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;

    .v-list-item {
      padding-left: 29px !important;
      padding-right: 16px !important;
    }

    .v-list-item__title {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .v-application--is-ltr .v-list-item__icon:first-child {
    margin-right: 10px !important;
  }

  .empty-communities {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    min-height: 171px;
    width: 100%;

    .empty-communities-inline {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 420px;

      span {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #000;
        text-align: center;
        width: 100%;
        padding-top: 50px;
        padding-bottom: 16px;
      }
    }
  }

  .create-com-btn {
    align-items: center;
    background-color: #2196f3 !important;
    color: #fff;
    display: flex;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    height: 36px !important;
    text-transform: unset !important;
  }

  .v-cart-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    margin-right: 24px;
    box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
    border: solid 1px rgba(100, 181, 246, 0.5);
    background-color: #e3f2fd;
  }

  .delete-info {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px !important;
    font-weight: normal !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: normal !important;
    letter-spacing: normal !important;
    color: rgba(0, 0, 0, 0.72) !important;
  }

  .invite-sub-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px !important;
    font-weight: normal !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: 1.5 !important;
    letter-spacing: normal !important;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  .v-card-headline {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    color: #2196f3;
  }

  .v-card-sub-header {
    font-family: Helvetica;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000 !important;
  }

  .edit-name-textfield,
  .edit-description,
  .edit-select {
    font-size: 13px !important;
  }

  .delete-dialog-body {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72);
    margin-top: 38px;
    margin-bottom: 24px;
  }

  .join-button {
    color: #fff !important;
    background-color: #2196f3 !important;
    font-family: 'Open Sans', sans-serif !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
    border: none !important;
  }
  .invitation-cancel {
    color: #fff;
    background-color: #f56c6c;
  }
  .invitation-accept {
    color: #fff;
    background-color: #2196f3;
  }
</style>
