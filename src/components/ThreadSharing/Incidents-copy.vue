<template>
  <v-card id="component-incidents" flat color="basil">
    <v-overlay
      id="share-incident-overlay"
      fixed
      :opacity="0.46"
      :value="isWantToShareIncident"
      :z-index="999"
    >
      <v-card light class="pb-4 pa-6" style="width: 600px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">
              mdi-send
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Share Incidents</v-list-item-title>
            <v-list-item-subtitle class="invite-sub-header v-card-sub-header"
              >Share this incident via email
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="share-inline-wrapper pl-0 pr-0 pt-10">
          <p class="share-combo-label">Recipients</p>
          <v-form v-model="validEmail" ref="emails">
            <v-combobox
              id="share-incident-combobox"
              v-model="emailsModel"
              label="Enter email addresses of the companies to be invited"
              :search-input.sync="emailSearch"
              multiple
              :clearable="true"
              append-icon
              chips
              deletable-chips
              class="invite-input"
              solo
              @blur="validateEmailArea"
              :rules="[emailData.required, emailData.email, emailData.maxFive]"
            ></v-combobox>
          </v-form>
          <div style="width: 100%;" v-if="shareInvites && shareInvites.length">
            <div style="width: 100%;" v-for="(mail, ind) of shareInvites" :key="ind">
              <p
                v-if="!mail.IsSuccess"
                class="v-messages v-messages__message mail-errors error--text"
              >
                {{ mail.Data }} - {{ mail.Message }}
              </p>
            </div>
          </div>
          <div style="width: 100%;" v-if="maxCharForEmail">
            <p class="v-messages v-messages__message mail-errors error--text">
              Email address cannot exceed 254 characters
            </p>
          </div>
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end">
          <v-btn text color="#f56c6c" @click="isWantToShareIncident = false">CANCEL</v-btn>
          <v-btn text class="send-incident" color="#2196f3" @click="onSendIncident">SEND</v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay
      fixed
      :opacity="0.46"
      :value="isWantToInvestigate"
      :z-index="999"
      color="white"
      class="investigate-overlay"
      id="investigate-overlay"
    >
      <investigate
        :selectedPostTitle="selectedPostTitle"
        @closeInvestigate="isWantToInvestigate = false"
      />
    </v-overlay>
    <v-overlay
      fixed
      :opacity="0.46"
      :value="isWantToPostIncident"
      :z-index="999"
      color="white"
      class="post-incident-overlay"
      id="post-incident-overlay"
    >
      <postIncident
        @closePostIncident="closePost()"
        :updatePost="postId"
        :communityName="communityName || incidentsCommunityName"
        :isEditMode="editIncident"
      />
    </v-overlay>
    <app-dialog
      :status="deleteIncidentModal"
      icon="mdi-delete"
      title="Delete Incident?"
      :subtitle="postName"
      body="This post will be deleted"
    >
      <template v-slot:app-dialog-footer>
        <v-spacer></v-spacer>
        <v-btn text color="#2196f3" class="pa-0" @click="deleteIncidentModal = false">
          CANCEL
        </v-btn>
        <v-btn text color="#f56c6c" class="pa-0" @click="deleteTheIncident()">
          DELETE
        </v-btn>
      </template>
    </app-dialog>
    <v-card-text id="incidents-component-card" class="pt-0">
      <v-data-iterator
        :items="postList"
        :items-per-page.sync="itemsPerPage"
        :footer-props="{ itemsPerPageOptions }"
        :search="search"
        :page.sync="page"
        :no-results-text="'Sorry, we couldn\'t find any results matching your criteria'"
      >
        <template v-slot:header>
          <div class="search-wrapper">
            <v-text-field
              @mouseover.native="hover = true"
              label="Filter by attributes or keywords"
              outlined
              class="filter-field pt-6"
              v-model="search"
              id="incidents-search-textfield"
            ></v-text-field>
            <v-icon class="filter-icon">mdi-filter-variant</v-icon>
          </div>
        </template>
        <template v-slot:default="items" v-if="items">
          <v-expansion-panels :multiple="false">
            <v-expansion-panel
              v-for="(post, ind) of items.items"
              :key="ind + post.CommunityPostId"
              style="border-image: none !important;"
              class="mb-4 mt-0"
              id="edit-incident-post"
              popout
            >
              <singlePost
                :post="post"
                :postIndex="ind"
                :totalPostCount="items.items.length"
                @edit-incident="editTheIncident"
                @delete-incident="deleteIncidentAct"
                @openInvestigateModal="openInvestigateModal"
              />
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
        <template slot="no-data">
          <div v-if="$route.name == 'Community'" class="empty-communities">
            <div class="empty-communities-inline">
              <span class="no-community">
                No incident has been shared, yet
              </span>
              <v-btn class="create-com-btn mb-11" @click="isWantToPostIncident = true" rounded>
                Post The First Incident
              </v-btn>
            </div>
          </div>
          <div v-else class="empty-communities">
            <div v-if="!communsLength" class="empty-communities-inline">
              <span class="no-community">
                You haven’t joined any communities, yet
              </span>
              <v-btn class="create-com-btn mb-11" @click="browseCommunities" rounded>
                Browse Communities
              </v-btn>
            </div>
            <div v-else class="empty-communities-inline">
              <span class="no-community pt-4">
                No incident has been posted in your communities, yet
              </span>
            </div>
          </div>
        </template>
      </v-data-iterator>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Investigate from '../ThreadSharing/Investigate'
import PostIncident from '../ThreadSharing/PostIncident'
import SinglePost from '../ThreadSharing/SinglePost'
import AppDialog from '../AppDialog'

export default {
  components: {
    AppDialog,
    Investigate,
    PostIncident,
    SinglePost
  },
  props: {
    posts: {
      type: Array,
      required: false
    },
    incidentsCommunityName: {
      type: Boolean
    }
  },
  data: () => ({
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    page: 1,
    items2: ['Incidents', 'Communities', 'Members'],
    toggle: false,
    tab: null,
    expanded: false,
    commentOpened: false,
    inviteEmail: '',
    activator: null,
    attach: null,
    colors: ['#e0e0e0'],
    editing: null,
    index: -1,
    items: [],
    nonce: 1,
    communityName: '',
    menu: false,
    emailsModel: [],
    x: 0,
    inviteSearch: null,
    y: 0,
    isWantToPostIncident: false,
    editIncident: false,
    postList: [],
    postId: null,
    postName: null,
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
      required: (v) => (v && v.length >= 1) || 'You should type an email to share'
    },
    emailsForApi: [],
    isMailChanged: false,
    pageView: true,
    maxCharForEmail: false,
    emailSearch: null,
    validEmail: false,
    sharedPost: null,
    deleteIncidentModal: false,
    selectedPostTitle: ''
  }),
  computed: {
    ...mapGetters({
      postedIncident: 'threadSharing/incidentGetter',
      postsGetter: 'threadSharing/postsGetter',
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      userGetter: 'auth/userGetter',
      fetchedCommunity: 'threadSharing/fetchedCommunGetter',
      selectedCompany: 'dashboard/getSelectedCompany',
      communsLength: 'threadSharing/communLengthGetter',
      shareInvites: 'threadSharing/sharesGetter'
    }),
    isWantToPostFromParent: {
      get() {
        return this.$store.state.threadSharing.isWantToPostIncident
      },
      set(bool) {
        this.$store.state.threadSharing.isWantToPostIncident = bool
      }
    },
    isWantToInvestigate: {
      get() {
        return this.$store.state.threadSharing.isWantToInvestigate
      },
      set(bool) {
        this.$store.state.threadSharing.isWantToInvestigate = bool
      }
    },
    isWantToShareIncident: {
      get() {
        return this.$store.state.threadSharing.isWantToShareIncident
      },
      set(bool) {
        this.$store.state.threadSharing.isWantToShareIncident = bool
      }
    }
  },
  watch: {
    postsGetter(arr) {
      if (arr && arr.Data && arr.Data.length) {
        const propData = arr.Data.sort(function (a, b) {
          if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
            return -1
          }
          if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
            return 1
          }
          return 0
        })
        this.postList = propData
      } else if (this.posts && this.posts.Data && this.posts.Data.length) {
        const postsData = this.posts.Data.sort(function (a, b) {
          if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
            return -1
          }
          if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
            return 1
          }
          return 0
        })
        this.postList = postsData
      } else {
        this.postList = []
      }
    },
    emailsModel(val, prev) {
      if (val && val.length) {
        this.isMailChanged = true
        for (let a of val) {
          if ((a && a.startsWith(' ')) || a == ' ') {
            a.replace(/\s\s+/g, ' ')
            this.emailsModel.pop()
          }
        }
      }
      if (val != prev) {
        this.isMailChanged = true
      }
    },
    isWantToPostFromParent(bool) {
      this.isWantToPostIncident = bool
    },
    selectedCompany(val, prev) {
      if (val && val != prev) {
        if (this.$route.name === 'Threat Sharing') {
          this.$store.dispatch('threadSharing/fetchCommunityPosts', {
            companyId: val.companyId,
            communId: ''
          })
        } else {
          const communId = this.selectedCommunity.id || localStorage.getItem('communityId')
          this.$store.dispatch('threadSharing/fetchCommunityPosts', {
            companyId: val.companyId,
            communId: communId
          })
        }
      }
    },
    page(val, prev) {
      if (val != prev) {
        this.$store.commit('threadSharing/SET_COLLAPSES', [])
      }
    },
    emailSearch(val) {
      val && val.length > 254 ? (this.maxCharForEmail = true) : (this.maxCharForEmail = false)
      if ((val && val.startsWith(' ')) || val == ' ') {
        val.replace(/\s\s+/g, ' ')
        this.emailSearch = ''
      }
      if (!this.regexChar(val)) {
        this.emailSearch = ''
      }
    },
    isMailChanged() {
      if (this.shareInvites && this.shareInvites.length) {
        this.$store.commit('threadSharing/SET_SHARE_RESULTS', [])
      }
    }
  },
  methods: {
    editTheIncident({ postId, communityName }) {
      this.isWantToPostIncident = true
      this.editIncident = true
      this.postId = postId
      this.communityName = communityName
    },
    deleteIncidentAct(post) {
      this.postId = post.postId
      this.postName = post.name
      this.postCommunityId = post.postCommunityId
      this.deleteIncidentModal = true
    },
    deleteTheIncident() {
      const compId =
        (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
        localStorage.getItem('companyId')
      const communId = this.selectedCommunity.id || localStorage.getItem('communityId')
      const userId = localStorage.getItem('userId')
      const refThis = this
      this.$store
        .dispatch('threadSharing/deleteTheIncident', {
          CompanyId: compId,
          CommunityId: this.postCommunityId,
          CommunityPostId: this.postId,
          ModifyUserId: userId,
          PostName: this.postName
        })
        .then(() => {
          refThis.deleteIncidentModal = false
          refThis.$store.dispatch('threadSharing/getTopPosts', localStorage.getItem('companyId'))
          const yourPostsObj = {
            compId: localStorage.getItem('companyId'),
            userId: localStorage.getItem('userId')
          }
          refThis.$store.dispatch('threadSharing/getYourPosts', yourPostsObj)
        })
    },
    closePost() {
      this.isWantToPostIncident = false
      this.isWantToPostFromParent = false
    },
    openInvestigateModal({ status, title }) {
      this.selectedPostTitle = title
      this.$store.state.threadSharing.isWantToInvestigate = true
    },
    onSendIncident() {
      if (this.$refs.emails.validate()) {
        this.emailsForApi = []
        for (let [ind, mail] of this.emailsModel.entries()) {
          const postId = this.$store.state.threadSharing.sharedPost
          const postCreatorId = this.$store.state.threadSharing.postCreatorId
          const compId =
            (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
            localStorage.getItem('companyId')
          const emailObj = {
            CompanyId: compId,
            CommunityPostId: postId,
            Email: mail,
            CreateUserId: postCreatorId
          }
          this.emailsForApi.push(emailObj)
        }
        this.$store.dispatch('threadSharing/shareWithMails', this.emailsForApi)
        this.isMailChanged = false
        this.emailsModel = []
        this.isWantToShareIncident = false
      }
    },
    browseCommunities() {
      this.$emit('go-to-communities')
    },
    validateEmailArea() {
      const refThis = this
      setTimeout(function () {
        if (refThis.emailsModel) {
          let i = refThis.emailsModel.length
          while (i--) {
            if (!refThis.regexChar(refThis.emailsModel[i])) {
              refThis.emailsModel.splice(i, 1)
            }
          }
        }
      }, 300)
    },
    regexChar(val) {
      return /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/@\/,\/.\/\-\/_\s]*$/gi.test(val)
    },
    shareInvites(val) {
      if (val && !val.IsSuccess) {
        const elements = document.getElementsByClassName('v-chip--select')
        if (val && val[0] === 'success') {
          this.isWantToShareIncident = false
          this.emailsForApi = []
          this.emailsModel = []
          this.$store.dispatch('common/setSnackStatus', true)
          this.$store.dispatch('common/setErrorMessage', 'Members successfully invited.')
          this.$store.commit('common/SET_SNACKBAR_COLOR', 'green')
        }
        for (let ind = 0; ind < elements.length; ind++) {
          if (
            val &&
            val[ind] &&
            elements[ind].innerText === val[ind].Data &&
            val[ind].IsSuccess === false
          ) {
            elements[ind].style.color = '#ff5252'
            elements[ind].style.borderColor = '#ff5252'
          } else if (
            val &&
            val[ind] &&
            elements[ind].innerText === val[ind].Data &&
            val[ind].IsSuccess === true
          ) {
            elements[ind].style.color = '#43a047'
            elements[ind].style.borderColor = '#43a047'
          }
        }
      } else {
        this.isWantToShareIncident = false
        this.emailsForApi = []
      }
    }
  },
  mounted() {
    if (this.$route.name === 'Threat Sharing') {
      const compId =
        (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
        localStorage.getItem('companyId')
      const communId = ''
      this.$store.dispatch('threadSharing/fetchCommunityPosts', {
        companyId: compId,
        communId: ''
      })
    } else {
      const compId =
        (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
        localStorage.getItem('companyId')
      const communId = this.selectedCommunity.id || localStorage.getItem('communityId')
      this.$store.dispatch('threadSharing/fetchCommunityPosts', {
        companyId: compId,
        communId: communId
      })
    }
  }
}
</script>

<style lang="scss">
#component-incidents {
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

  .share-inline-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;

    .share-combo-label {
      width: 100%;
      text-align: left;
      margin-bottom: 8px;
      font-family: Helvetica;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .v-overlay__scrim {
    border-radius: 0 !important;
  }

  .v-card:not(.v-sheet--tile):not(.v-card--shaped) {
    border-radius: 12px !important;
  }

  .v-overlay__content {
    border-radius: 12px !important;
    box-shadow: 0 11px 15px -7px rgba(80, 80, 80, 0.2), 0 24px 38px 0 rgba(80, 80, 80, 0.14),
      0 9px 46px 8px rgba(201, 113, 113, 0.12) !important;
  }

  .send-incident {
    margin-right: -18px;
  }

  .investigate-overlay,
  .post-incident-overlay {
    .v-overlay__content {
      width: 100%;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: scroll;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s !important;
  }

  .fade-enter-active {
    transition: all 0.3s ease;
  }

  .fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0 !important;
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

  .post-inc-btn {
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

  .v-expansion-panel {
    border-radius: 20px !important;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    background-color: #fff;
    border: unset !important;
  }

  .v-expansion-panel::before {
    box-shadow: unset !important;
  }

  .v-expansion-panel::after {
    border: unset !important;
  }

  .v-expansion-panel-header {
    box-shadow: unset !important;
    border: unset !important;
  }

  .v-window {
    border-radius: 20px !important;
    margin: 0 24px !important;
  }

  .v-expansion-panel-content {
    border-radius: 20px !important;
    font-family: 'Open Sans', sans-serif !important;
  }

  .v-expansion-panel-content__wrap {
    padding: 0 !important;
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
    text-transform: capitalize !important;
    padding-bottom: 10px;
    width: 193px !important;
    max-width: 193px !important;
  }

  .v-form {
    width: 100%;
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
    margin-bottom: 4px;
  }
}
</style>
