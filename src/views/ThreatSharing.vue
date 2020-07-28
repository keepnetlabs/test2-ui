<template>
  <div id="" class="component-threat-sharing page-wrapper">
    <v-overlay
      id="new-community-overlay"
      :value="isWantToAddNewCommunity"
      :class="{ newCommunityOverlay: isWantToAddNewCommunity }"
      :opacity="1"
      :z-index="999"
      color="white"
    >
      <new-community @closeAdd="onAddClose" />
    </v-overlay>
    <v-layout id="ts-layout" wrap style="min-height: 79vh;">
      <v-col class="main-column pr-0" cols="12" md="8">
        <v-card id="ts-card" class="pl-1 pt-2 pr-1">
          <v-tabs id="ts-tabs" v-model="tab" background-color="transparent" color="basil">
            <v-tab id="ts-tab-incident">Incidents</v-tab>
            <v-tab id="ts-tab-community">Communities</v-tab>
            <div class="tablet-info-btn">
              <v-btn id="ts-info-btn" class="create-com-btn" block rounded>
                <v-icon class="pr-1">mdi-information</v-icon>
                INFO
              </v-btn>
            </div>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <incidents />
            </v-tab-item>
            <v-tab-item>
              <communities :refresh="refreshMemberTable" />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col id="ts-right-column" class="right-column" cols="12" md="4">
        <right-column
          class="right-col-desktop"
          @createCommunityAction="openCreateCommunityModal()"
        />
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import Incidents from '../components/ThreadSharing/Incidents'
import Communities from '../components/ThreadSharing/Communities'
import RightColumn from '../components/ThreadSharing/RightColumn'
import NewCommunity from '../components/ThreadSharing/NewCommunity'

export default {
  name: 'ThreatSharing',
  components: {
    Incidents,
    Communities,
    RightColumn,
    NewCommunity
  },
  data: () => ({
    tab: null,
    isWantToAddNewCommunity: false,
    refreshMemberTable: false
  }),
  mounted() {
    if (this.$route.query.detailsId) {
      this.tab = 1
    }
  },
  methods: {
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

<style lang="scss">
.component-threat-sharing.page-wrapper {
  height: 100%;
  position: relative;

  .container {
    max-width: 100%;
  }

  .suggested-card > .row {
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

  .v-slide-group__wrapper {
    padding-left: 20px !important;
  }

  .v-card.v-sheet.theme--light {
    padding-top: 0;
    padding-left: 3px;
    padding-right: 3px;
    border-radius: 20px;
  }

  .main-column > .v-card,
  .right-column > .v-card {
    border-radius: 20px !important;
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
    background-color: #fff !important;
  }

  //search Input css
  .v-label--active {
    transform: translateY(-15px) scale(0.75);
  }

  .v-text-field--outlined .v-label {
    top: 11px;
  }

  .v-input__slot {
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    min-height: 40px !important;
  }

  label.v-label.theme--light {
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

  .v-slide-group__content {
    border-bottom: 2px solid #e4e7ed;
    margin-right: 20px;
  }

  .v-tabs-slider-wrapper {
    bottom: -1px !important;
    color: #0486fe !important;
  }

  .community-selector {
    .v-tabs-bar {
      height: 44px !important;
    }
  }

  .community-selector .v-slide-group__wrapper {
    background-color: #f5f7fa !important;
    height: 44px !important;
    padding-left: 0 !important;
  }

  .community-selector .v-slide-group__wrapper > div {
    height: 100%;
    margin-right: 0 !important;
    padding: 0 9px;
  }

  .v-text-field--outlined fieldset {
    border-radius: 8px !important;
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
    text-transform: capitalize !important;
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
    padding: 0;
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

  .v-btn--contained {
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
  }

  .v-data-footer {
    margin-top: 24px !important;
    justify-content: flex-end !important;
  }

  .v-data-footer__select {
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

  .v-btn:not(.v-btn--round).v-size--default,
  .v-btn--icon.v-size--default {
    height: 36px !important;
  }

  .v-btn--icon.v-size--default {
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

  .community-notification__text {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  .right-side-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
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

  .right-side-like .v-icon,
  .right-side-message .v-icon {
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
      width: min-content;

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
    color: rgba(0, 0, 0, 0.87);

    .community-notification-switch {
      align-items: center;
      display: flex;
      height: 25px !important;
      margin-top: 10px !important;
    }
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

  .invite-input > .v-input__control > .v-input__slot {
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

  .v-application--is-ltr .v-input--switch .v-input--selection-controls__ripple {
    left: -12px;
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

    > .v-overlay__content {
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
    text-transform: capitalize;
  }

  .v-overlay {
    max-width: 100vw;
  }

  .right-col-overlay > .v-overlay__content {
    display: flex;
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: scroll;
  }

  .right-col-overlay > .v-overlay__scrim {
    position: fixed !important;
  }

  .right-col-wrapper {
    align-items: stretch;
    display: flex;
    padding: 78px;
    position: relative;
    width: 100%;

    .pop-up-card {
      overflow: scroll;
      -webkit-overflow-scrolling: auto;
      -webkit-appearance: none;

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

    @media only screen and (max-width: 500px) {
      padding: 5px !important;
    }
  }

  .v-slide-group__wrapper {
    contain: unset !important;
    overflow: visible !important;
  }

  .community-notification__container {
    max-width: 364px !important;
    padding: 32px 24px 0px 24px !important;
  }

  .v-input--switch__thumb {
    top: calc(50% - 13px);
    height: 26.7px;
    width: 24.8px;
  }

  .v-input--switch__track {
    opacity: 0.4;
  }

  .tablet-info-btn {
    display: none;
    position: absolute;
    right: 0;
    top: 10px;
    z-index: 13;

    @media only screen and (max-width: 769px) {
      display: block;
    }
    @media only screen and (max-width: 500px) {
      right: -14px;
      top: -23px;
    }
  }

  @media only screen and (max-width: 769px) {
    .v-application .main-column {
      padding: 0 16px !important;
    }
    .right-col-desktop {
      display: none !important;
    }
    .v-data-footer {
      justify-content: center !important;
    }
  }
}
</style>
