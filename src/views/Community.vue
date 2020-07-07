<template>
  <div id="community-page-wrapper" class="page-wrapper">
    <v-layout wrap>
      <v-col class="main-column pr-0" cols="12" md="8">
        <v-card id="community-tabs" class="pl-1 pt-2 pr-1">
          <v-tabs v-model="tab" background-color="transparent" color="basil">
            <v-tab id="incidents-tab">Incidents</v-tab>
            <v-tab id="members-tab" @click="getMembers">Members</v-tab>
            <div class="tablet-info-btn">
              <v-btn id="info-btn" class="create-com-btn" @click="mobileInfoClicked" block rounded>
                <v-icon class="pr-1">mdi-information</v-icon>
                INFO
              </v-btn>
            </div>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <incidents ref="refIncidents" :posts="[]" :incidentsCommunityName="''" />
            </v-tab-item>
            <v-tab-item>
              <members />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col class="right-column" cols="12" md="4">
        <right-column class="right-col-desktop" />
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthenticationService from '../services/authentication'
import Incidents from '../components/ThreadSharing/Incidents'
import Members from '../components/ThreadSharing/Members'
import EditCommunity from '../components/ThreadSharing/EditCommunity'
import PostIncident from '../components/ThreadSharing/PostIncident'
import RightColumn from '../components/ThreadSharing/RightColumn'

export default {
  name: 'ThreatSharing',
  components: {
    Incidents,
    Members,
    RightColumn
  },
  data: () => ({
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    tab: null,
    items2: ['Incidents', 'Members'],
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
    isMobileInfo: false,
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
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    openCreateCommunityModal() {
      this.isWantToAddNewCommunity = true
    },
    getMembers() {},
    onAddClose() {
      this.isWantToAddNewCommunity = false
    },
    onResize() {
      this.windowWidth = window.outerWidth
    },
    onEditClose() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToEditCommunity = false
    },
    onCancelDelete() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToDeleteCommunity = false
    },
    onCancelLeave() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToLeaveFromCommunity = false
    },
    mobileInfoClicked() {
      this.isMobileInfo = true
      this.$store.commit('threadSharing/SET_MOBILE_INFO', true)
    },
    beforeRouteLeave(to, from, next) {
      if (this.isWantToAddNewCommunity) {
        this.isWantToAddNewCommunity = false
        next(false)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  position: relative;
}

.container {
  max-width: 100%;
}

::v-deep .suggested-card > .row {
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

::v-deep .main-column > .v-card {
  border-radius: 20px !important;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
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
  min-width: min-content !important;
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

.community-notification__container {
  max-width: 364px !important;
  padding: 32px 24px 0px 24px !important;
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
    font-weight: 400;
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

::v-deep .v-application--is-ltr .v-data-footer__select .v-select {
  margin: 0 !important;
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
  min-height: 76px;
  margin-bottom: 8px;
  border-radius: 4px !important;
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12);

  .suggested-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-top: 6px;
    padding-bottom: 4px;
    text-overflow: ellipsis;
    overflow: hidden;
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

  .suggested-right-action {
    align-items: center;
    display: flex;

    .suggested-btn {
      align-items: center;
      background-color: #2196f3 !important;
      color: #fff !important;
      text-transform: capitalize;
      display: flex;
      justify-content: center;

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
  padding-bottom: 30px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
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
  width: 100%;
  margin-right: 10px;

  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;

  .community-notification-switch {
    align-items: center;
    display: flex;
    height: 25px !important;
    margin-top: 10px !important;
  }
}
::v-deep .v-input--switch__thumb {
  top: calc(50% - 13px);
  height: 26.7px;
  width: 24.8px;
}

::v-deep .v-input--switch__track {
  opacity: 0.4;
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

::v-deep .invite-input {
  width: 100% !important;
}

::v-deep .invite-input > .v-input__control > .v-input__slot {
  align-items: center;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  box-shadow: unset !important;
  display: flex;
  width: 100% !important;

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

::v-deep .investigate-overlay,
::v-deep .post-incident-overlay,
::v-deep .right-col-overlay {
  .v-overlay__content {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: scroll;
  }
}

::v-deep .v-form {
  width: 100%;
}

::v-deep .v-chip {
  border: 1px solid transparent;
}

::v-deep .v-messages__message {
  font-weight: 400 !important;
  font-size: 10px !important;
}

.mail-errors {
  text-align: left;
  font-size: 10px;
  margin-left: 12px;
  width: 100%;
  margin-bottom: 4px;
}

.right-col-wrapper {
  align-items: center;
  display: flex;
  padding: 78px;
  position: relative;
  width: 100%;

  @media only screen and (max-width: 500px) {
    padding: 16px !important;
    margin-right: -5px;
    width: 97%;
  }
}

::v-deep .v-slide-group__wrapper {
  contain: unset !important;
  overflow: visible !important;
}

::v-deep .v-data-footer {
  margin-top: 24px !important;
  justify-content: flex-end !important;
}

::v-deep .v-data-footer__select {
  .v-select {
    margin: 0 !important;
    margin-top: 3px !important;
    margin-left: 32px !important;
    height: 30px !important;
  }

  .v-text-field > .v-input__control > .v-input__slot:after {
    border: none !important;
    display: none !important;
  }

  .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
    border: none !important;
  }

  .v-input__append-inner {
    margin-left: 0 !important;
    margin-top: 3px !important;
    margin-right: 5px !important;
    padding-left: 0 !important;
  }

  .v-select__slot {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 27px !important;
    background-color: #f2f2f2 !important;

    .v-select__selections {
      margin-left: 10px;
    }
  }

  .v-input__icon {
    width: 20px !important;
    min-width: 20px !important;
    height: 20px !important;
  }
}

.tablet-info-btn {
  display: none;
  position: absolute;
  right: -24px;
  top: -16px;
  z-index: 13;

  @media only screen and (max-width: 769px) {
    display: block;
  }
}

@media only screen and (max-width: 769px) {
  .v-application .main-column {
    padding: 0 16px !important;
  }
  .right-col-desktop {
    display: none !important;
  }
}
::v-deep .text-decoration-none {
  text-decoration: none !important;
  text-decoration-line: none !important;
}
</style>
