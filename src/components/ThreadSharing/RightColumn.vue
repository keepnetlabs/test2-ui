<template>
  <v-card class="pop-up-card pt-4 pl-6 pr-6" light min-height="300">
    <div v-if="pageView">
      <div class="right-column-header">
        <p v-if="$route.name == 'Community'" id="right-col-commun-name" class="header-p">
          {{ fetchedCommunity.Name || 'Community Name' }}
        </p>
        <p v-if="$route.name == 'Threat Sharing'" class="header-p">Threat Sharing</p>
        <v-icon @click="closeCommunityInfo">mdi-close</v-icon>
      </div>
      <p class="right-col-sub-header">General stats and suggestions</p>
    </div>
    <v-btn
      v-if="$route.path == '/threat-sharing'"
      class="create-com-btn"
      @click="createNewCommunity()"
      block
      rounded
      id="create-community-btn"
      >CREATE COMMUNITY
    </v-btn>
    <v-btn
      v-if="
        $route.name == 'Community' &&
        (isJoined(fetchedCommunity.CommunityId) || isOwnerOfTheCommunity())
      "
      class="create-com-btn"
      @click="postIncident()"
      block
      rounded
      id="post-inc-btn"
      >POST INCIDENT
    </v-btn>
    <v-btn
      v-else-if="$route.name == 'Community' && !isJoined(fetchedCommunity.CommunityId)"
      class="create-com-btn"
      @click="joinCommunity()"
      block
      rounded
      id="join-community-btn"
      >JOIN
    </v-btn>
    <div class="right-side-content wrapper pt-8 pb-4">
      <div v-if="$route.name == 'Community'">
        <div class="about-community right-side-title">
          About Community
          <v-menu
            content-class="right-col-commun-settings"
            v-if="isJoined(fetchedCommunity.CommunityId) || isOwnerOfTheCommunity()"
            offset-y
            transition="scale-transition"
          >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">mdi-cog</v-icon>
            </template>
            <div class="notification-wrapper">
              <v-list dense flat>
                <v-list-item-group v-if="isOwnerOfTheCommunity()" color="primary">
                  <v-list-item id="right-col-edit-commun" @click="editCommunity()">
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Edit Community</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item-group color="primary">
                  <v-list-item
                    id="right-col-notification-settings"
                    v-if="isJoined(fetchedCommunity.CommunityId)"
                    @click="openNotifications()"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-bell</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Notification Settings</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item-group
                  v-if="!isOwnerOfTheCommunity() && isJoined(fetchedCommunity.CommunityId)"
                  color="primary"
                >
                  <v-list-item id="right-col-leave-commun" @click="leaveCommunity()">
                    <v-list-item-icon>
                      <v-icon>mdi-exit-to-app</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Leave</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item-group v-if="isOwnerOfTheCommunity()" color="primary">
                  <v-list-item id="right-col-delete-commun" @click="deleteCommunity()">
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
        </div>
        <div class="right-side-post-container pt-2 pb-9">
          <span class="about-community-statement">{{ communityDescription }}</span>
          <v-row>
            <v-col cols="12" sm="6" class="about-community-table-td pb-0">
              <span class="right-col-semibold-label">Owner</span>
            </v-col>
            <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">
              {{ fetchedCommunity.CommunityCompany[0].CompanyName }}
            </v-col>
          </v-row>
          <div class="about-community-table pt-8">
            <v-row>
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">
                <span class="right-col-semibold-label">Members</span>
              </v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">
                {{ fetchedCommunity.MemberCount }}
                <a
                  v-if="isJoined(fetchedCommunity.CommunityId) || isOwnerOfTheCommunity()"
                  href="#"
                  class="pl-4"
                  @click="isWantToAddMembers()"
                  >+Invite</a
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">
                <span class="right-col-semibold-label">Industry</span>
              </v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">
                {{ fetchedCommunity.BusinessCategoryText || communityIndustry }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">
                <span class="right-col-semibold-label">Total Incidents</span>
              </v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0"
                >{{ fetchedCommunity.IncidentCount }}
              </v-col>
            </v-row>
            <v-row v-if="false">
              <!-- Made by Burak Turan Ülker -->
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">You investigated</v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">21</v-col>
            </v-row>
            <v-row v-if="false">
              <v-col cols="12" sm="6" class="about-community-table-td pb-0">Eliminated</v-col>
              <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">48 threats</v-col>
            </v-row>
          </div>
        </div>
      </div>
      <div v-if="$route.name !== 'Community'" class="right-side-title pt-1">Your Posts</div>
      <div
        class="pb-4"
        v-if="
          $route.name !== 'Community' &&
          yourPosts.IsSuccess &&
          yourPosts.Data &&
          yourPosts.Data.length > 0
        "
      >
        <div v-for="(post, ind) of yourPosts.Data" :key="ind + Math.floor(Math.random() * 10000)">
          <div class="pt-2">
            <div class="right-side-sub-title pb-1">
              <a href="#">{{ post.Title }}</a>
            </div>
            <div class="right-side-desc pb-1">
              by
              <a href="#">{{ post.CompanyName }}</a>
            </div>
            <div class="right-side-like-comment-wrapper">
              <div class="right-side-like">
                <v-btn disabled text x-small icon color="grey">
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <span class="like-count">{{ post.LikeCount }}</span>
              </div>
              <div class="right-side-message pl-2">
                <v-btn disabled text x-small icon color="grey">
                  <v-icon>mdi-message-reply-text</v-icon>
                </v-btn>
                <span class="comment-count">{{ post.CommentCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="$route.name !== 'Community'" class="empty-posts pt-1 pb-4">
        You haven’t post any incidents,yet
      </div>

      <div class="right-side-title pt-4">Top Posts from your communities</div>
      <div v-if="topPosts.IsSuccess && topPosts.Data && topPosts.Data.length">
        <div v-for="(post, ind) of topPosts.Data" :key="ind + Math.floor(Math.random() * 10000)">
          <div class="right-side-post-container pt-2">
            <div class="right-side-sub-title pb-1">
              <a href="#">{{ post.Title }}</a>
            </div>
            <div class="right-side-desc pb-1">
              by
              <a href="#">{{ post.CompanyName }}</a>
            </div>
            <div class="right-side-like-comment-wrapper">
              <div class="right-side-like">
                <v-btn disabled text x-small icon color="grey">
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <span class="like-count">{{ post.LikeCount }}</span>
              </div>
              <div class="right-side-message pl-2">
                <v-btn disabled text x-small icon color="grey">
                  <v-icon>mdi-message-reply-text</v-icon>
                </v-btn>
                <span class="comment-count">{{ post.CommentCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-posts pt-1">
        No incident has been posted in your communities, yet
      </div>

      <div class="right-side-title pb-3 pt-8">Suggested Communities</div>
      <div v-if="suggestedCommunities && suggestedCommunities.length">
        <v-card
          v-for="(commun, ind) of suggestedCommunities"
          :key="ind + commun.Name"
          class="suggested-card"
        >
          <div class="suggested-row">
            <div class="suggested-com-name" cols="12">
              <div class="suggested-title">{{ commun.Name }}</div>
              <div class="suggested-com-detail">
                <v-icon class="suggested-people-icon pr-1">mdi-account-multiple</v-icon>
                {{ commun.MemberCount }}
                <span class="suggested-industry pl-2">Industry -&nbsp;</span>
                <span class="suggested-company">{{ commun.BusinessCategoryText }}</span>
              </div>
            </div>
            <div class="suggested-right-action">
              <v-btn class="suggested-btn" rounded v-if="isJoined(commun.CommunityId)">
                <v-icon class="pl-2 pr-1">mdi-account-circle</v-icon>
                <span class="pr-2">Member</span>
              </v-btn>
              <v-btn
                @click="
                  joinCommunity(
                    commun.CommunityId,
                    commun.CreateUserId,
                    commun.Name,
                    commun.IsPrivate
                  )
                "
                class="suggested-btn"
                block
                rounded
                v-else
                :disabled="isRequestSent(commun.CommunityId)"
                style="background-color: #2196f3 !important;"
              >
                <v-icon v-if="!isRequestSent(commun.CommunityId)" class="pr-2"
                  >mdi-account-circle
                </v-icon>
                <v-icon
                  v-if="isRequestSent(commun.CommunityId)"
                  class="pr-2"
                  style="color: #fff !important;"
                  >mdi-account-clock
                </v-icon>
                <div v-if="!commun.IsPrivate" :key="commun.CommunityId">Join</div>
                <div v-else-if="isRequestSent(commun.CommunityId)" :key="commun.CommunityId">
                  Request Sent
                </div>
                <div v-else :key="commun.CommunityId">Request to join</div>
              </v-btn>
            </div>
          </div>
        </v-card>
      </div>
      <div class="pb-2" v-else-if="communityGetter && !communityGetter.length">
        There is no suggested community available, yet
      </div>
      <div class="empty-suggested" v-else>
        <v-btn
          class="create-first-btn create-com-btn mt-3 mb-6"
          @click="createNewCommunity()"
          block
          rounded
          >{{ myCommunities.length > 0 ? 'Create A New Community' : 'Create Your First Community' }}
        </v-btn>
      </div>
    </div>
  </v-card>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    pageView: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      suggestedCommunities: 'threadSharing/suggestedCommunGetter',
      fetchedCommunity: 'threadSharing/fetchedCommunGetter',
      myCommunities: 'threadSharing/myCommunitiesGetter',
      communityGetter: 'threadSharing/communityGetter',
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      getSelectedCompany: 'dashboard/getSelectedCompany',
      userGetter: 'auth/userGetter',
      topPosts: 'threadSharing/topPostsGetter',
      yourPosts: 'threadSharing/yourPostsGetter',
      requests: 'threadSharing/requestsGetter'
    }),
    ...mapState({
      companyInformation: (state) => state.dashboard.companyInformation
    }),
    communityDescription() {
      return this.selectedCommunity.description || localStorage.getItem('communityDesc')
    },
    communityIndustry() {
      return this.selectedCommunity.industry || localStorage.getItem('communityCat')
    }
  },
  methods: {
    closeCommunityInfo() {
      this.$emit('closeCommunity')
    },
    createNewCommunity() {
      this.$emit('createCommunity')
      this.closeCommunityInfo()
    },
    isWantToAddMembers() {
      this.$emit('addMembers')
      this.closeCommunityInfo()
    },
    editCommunity() {
      this.$emit('editCommunity')
      this.closeCommunityInfo()
    },
    postIncident() {
      this.$emit('postIncident')
      this.closeCommunityInfo()
    },
    joinCommunity(communityId, creatorId, name, isPrivate) {
      if (!communityId && !creatorId) {
        this.$store
          .dispatch('threadSharing/joinCommunity', {
            CommunityId: localStorage.getItem('communityId'),
            CreatorId: localStorage.getItem('creatorId')
          })
          .then(() => {
            this.refreshCommunities()
            this.refreshRequests()
          })
      } else {
        this.$store
          .dispatch('threadSharing/joinCommunity', {
            CommunityId: communityId,
            CreatorId: creatorId,
            Name: name,
            IsPrivate: isPrivate
          })
          .then(() => {
            this.refreshCommunities()
            this.refreshRequests()
          })
      }
    },
    isOwnerOfTheCommunity() {
      const creator = localStorage.getItem('communityCompanyId')
      const user = localStorage.getItem('companyId')
      if (
        user == creator ||
        this.getSelectedCompany.companyId === this.selectedCommunity.communityCompanyId
      ) {
        return true
      } else {
        return false
      }
    },
    openNotifications() {
      this.$emit('openNotifications')
      this.$store.dispatch('threadSharing/getNotifications', localStorage.getItem('communityId'))
      this.closeCommunityInfo()
    },
    isJoined(id) {
      if (id && id != null && this.myCommunities && this.myCommunities.length) {
        return this.myCommunities.some((cId) => cId.CommunityId == id)
      }
    },
    leaveCommunity() {
      this.$emit('leaveCommunity')
      this.closeCommunityInfo()
    },
    deleteCommunity() {
      this.$emit('deleteCommunity')
      this.closeCommunityInfo()
    },
    isRequestSent(communId) {
      return this.requests.some((cId) => cId.CommunityId == communId)
    },
    refreshCommunities() {
      this.$store.dispatch('threadSharing/getCommunities')
    },
    refreshRequests() {
      this.$store.dispatch('threadSharing/getRequestsCompany', localStorage.getItem('companyId'))
    }
  }
}
</script>
<style lang="scss" scoped>
.right-column-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px 0 !important;

  .header-p {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: #2196f3 !important;
    margin-bottom: 0 !important;
  }
}

.right-col-sub-header {
  font-family: Helvetica;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #000;
  padding-bottom: 20px !important;
}

.pop-up-card {
  width: 100%;
  border-radius: 20px !important;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
  background-color: #fff;
}

@media only screen and (max-width: 1023px) {
  ::-webkit-scrollbar {
    -webkit-overflow-scrolling: auto;
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
}

.create-com-btn {
  background-color: #2196f3 !important;
  color: #fff;
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

::v-deep .suggested-card > .suggested-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.right-side- {
  &title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}

.ts-tags {
  align-items: center;
}

.ts-footer {
  display: flex;
  margin-top: 10px;
  margin-left: 0px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.ts-like {
  margin-right: 10px;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}

.ts-message {
  margin-right: 40px;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}

.ts-harmful {
  margin-right: 15px;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}

.ts-success {
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
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

// Threat sharing Content
.threat-sharing-content {
  min-height: 200px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12);
  background-color: #ffffff;
  padding: 29px 32px 16px 32px;
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
  color: rgba(0, 0, 0, 0.87);
}

// Threat sharing Content End

.v-tab {
  padding: 0 !important;
  font-size: 20px;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-transform: none;
  color: rgba(0, 0, 0, 0.87);
  text-align: left !important;
}

::v-deep .v-slide-group__wrapper {
  padding-left: 20px !important;
}

.v-card.v-sheet.theme--light {
  padding-top: 0;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 20px;
}

//search Input css
::v-deep .v-label--active {
  transform: translateY(-15px) scale(0.75);
}

::v-deep .v-text-field--outlined .v-label {
  top: 11px;
}

::v-deep .v-input__slot {
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  min-height: 40px !important;
}

::v-deep label.v-label.theme--light {
  font-size: 12px;
}

.v-input {
  font-size: 13px !important;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54);
}

// end search input

::v-deep .v-slide-group__content {
  border-bottom: 2px solid #e4e7ed;
  margin-right: 20px;
}

::v-deep .v-tabs-slider-wrapper {
  bottom: -1px !important;
  color: #0486fe !important;
}

::v-deep .v-tabs-bar {
  height: 60px !important;

  .v-tab {
    font-family: 'Open Sans', sans-serif !important;
    font-weight: 400;
    font-weight: 600;
    margin-right: 48px;
  }
}

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

::v-deep .v-text-field--outlined fieldset {
  border-radius: 6px !important;
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

.filter-field {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54);
}

.create-com-btn {
  background-color: #2196f3 !important;
  color: #fff;
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

.ts-community-industry {
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
    color: var(--black-87);
  }
}

.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 10px !important;
}

.ts-user-comp-detail {
  align-items: center;
  display: flex;
}

::v-deep .v-btn:not(.v-btn--round).v-size--default,
::v-deep .v-btn--icon.v-size--default {
  height: 36px !important;
}

::v-deep .v-btn--icon.v-size--default {
  margin-left: 4px;
  width: 36px !important;
}

// Right Column
.right-side-content {
  a {
    text-decoration: none !important;
  }

  a:hover {
    text-decoration: underline !important;
  }
}

.right-side-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.right-side-sub-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #2196f3;
}

.about-community {
  display: flex;
  justify-content: space-between;
}

.about-community-statement {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.about-community-table-td {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.about-community-table-td-sec {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

::v-deep .right-side-like .v-icon,
::v-deep .right-side-message .v-icon {
  height: 14px !important;
  width: 14px !important;
  font-size: 14px !important;
}

.right-side-like-comment-wrapper {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.like-count,
.comment-count {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  padding-left: 2px;
}

.suggested-card {
  display: flex;
  flex-direction: row;
  position: relative;
  min-height: 76px;
  margin-bottom: 8px;
  border-radius: 4px !important;
  border: none !important;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;

  .suggested-row {
    align-items: stretch;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: wrap;
    height: auto;
    max-height: 220px;
    width: 100%;
    padding: 16px;
    padding-bottom: 4px;
  }

  .suggested-com-name {
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 100%;

    .suggested-title {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-top: 0;
      padding-bottom: 8px;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: block;
      max-width: 100%;
    }

    .suggested-com-detail {
      font-size: 12px;

      .suggested-people-icon {
        font-size: 14px !important;
      }

      .suggested-industry {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.58;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87) !important;
      }
    }
  }

  .suggested-right-action {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin: 13px 0;
    width: min-content;

    .suggested-btn {
      align-items: center;
      background-color: #2196f3 !important;
      color: #fff !important;
      text-transform: capitalize;
      width: min-content;

      @media only screen and (max-width: 500px) {
        padding: 0 3px !important;
      }
    }
  }
}

.community-notification-header {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: #000;
}

.community-notification-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px !important;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);

  .community-notification-switch {
    align-items: center;
    display: flex;
    height: 25px !important;
    margin-top: 10px !important;
  }
}

.community-notification-row:first-child {
  border-bottom: 1px solid gray !important;
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
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.72);
}

.invite-sub-header {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

::v-deep .invite-input > .v-input__control > .v-input__slot {
  align-items: center;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  box-shadow: unset !important;
  display: flex;

  .v-label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.54);
    display: flex;
    align-items: center;
  }

  .invite-chip {
    border-radius: 18px !important;

    > span > span {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #000000;
    }
  }

  .mdi-menu-down {
    display: none !important;
  }
}

.newCommunityOverlay {
  background-color: #fff !important;
  overflow: auto !important;
  height: 100% !important;
  max-width: 100vw !important;
  width: 100% !important;
  display: block !important;
  justify-content: center !important;
  align-items: center !important;

  > ::v-deep .v-overlay__content {
    height: auto;
    width: 100%;
  }
}

.empty-posts {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #212121;
  display: block;
}

.empty-suggested-span {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
}

.create-first-btn {
  min-width: 70% !important;
  width: 221px !important;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  font-stretch: normal !important;
  font-style: normal !important;
  line-height: 1.71 !important;
  letter-spacing: normal !important;
}

.right-col-semibold-label {
  color: rgba(0, 0, 0, 0.87);
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: 600;
}

@media only screen and (max-width: 1023px) {
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
}
</style>
