<template>
  <div class="navigation-drawer-footer">
    <v-list dense>
      <v-list-item
        id="btn--navigation-drawer-documentation"
        class="navigation-drawer-footer__item"
        @click="handleDocumentationClick"
      >
        <v-list-item-icon>
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Documentation</v-list-item-title>
      </v-list-item>
      <v-list-item
        id="btn--navigation-drawer-feedback"
        class="navigation-drawer-footer__item"
        @click="handleFeedbackClick"
      >
        <v-list-item-icon>
          <v-icon>mdi-message-alert-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Give Feedback!</v-list-item-title>
      </v-list-item>
    </v-list>
    <div
      v-if="isRelaseInformation"
      class="navigation-drawer-footer__bottom"
      :style="isMini && { marginLeft: '21px' }"
    >
      <span v-if="isReleaseVersion" class="navigation-drawer-footer__version"
        >Version {{ getReleaseVersion }} {{ isReleaseNotes ? '-' : '' }}</span
      >
      <span v-else-if="isMiniReleaseVersion" class="navigation-drawer-footer__version"
        >{{ getReleaseVersion.substring(0, 3) }}
      </span>
      <a
        v-if="isReleaseNotes"
        id="btn--navigation-drawer-release-notes"
        class="navigation-drawer-footer__release-notes"
        target="_blank"
        :href="getReleaseNotesUrl"
      >
        Release Notes</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationDrawerFooter',
  props: {
    isMini: {
      type: Boolean
    },
    navigatorMenuProps: {
      type: Object
    }
  },
  computed: {
    isRelaseInformation() {
      const {
        isShowReleaseNotes = false,
        isShowReleaseVersionNumber = false
      } = this.navigatorMenuProps
      return isShowReleaseNotes || isShowReleaseVersionNumber
    },
    isReleaseNotes() {
      const { isShowReleaseNotes = false } = this.navigatorMenuProps
      return !this.isMini && isShowReleaseNotes
    },
    isReleaseVersion() {
      const { isShowReleaseVersionNumber = false } = this.navigatorMenuProps
      return isShowReleaseVersionNumber && !this.isMini
    },
    isMiniReleaseVersion() {
      const { isShowReleaseVersionNumber = false } = this.navigatorMenuProps
      return isShowReleaseVersionNumber && this.isMini
    },
    getReleaseVersion() {
      const { systemVersion = '0' } = this.navigatorMenuProps
      return systemVersion
    },
    getReleaseNotesUrl() {
      const { releaseNotesUrl = '' } = this.navigatorMenuProps
      return releaseNotesUrl
    }
  },
  methods: {
    handleDocumentationClick() {
      const domElem = document.createElement('a')
      domElem.href = 'https://doc.keepnetlabs.com'
      domElem.target = '_blank'
      domElem.click()
    },
    handleFeedbackClick() {
      this.$store.dispatch('dashboard/changeFeedbackPopup', true)
    }
  }
}
</script>

<style lang="scss">
.navigation-drawer-footer {
  &__item {
    min-height: 36px !important;
    max-height: 36px !important;
    .v-list-item {
      &__title {
        font-size: 14px !important;
        color: #383b41 !important;
        line-height: normal !important;
        letter-spacing: normal !important;
        font-weight: normal !important;
      }
      &__icon {
        margin-top: 7px !important;
        margin-right: 16px !important;
      }
    }
  }
  &__bottom {
    margin-left: 24px;
    margin-bottom: 8px;
  }
  &__version {
    font-size: 12px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
  }
  &__release-notes {
    font-size: 12px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    color: #2196f3 !important;
  }
  a {
    text-decoration: none;
  }
}
.v-navigation-drawer--mini-variant {
  .navigation-drawer-footer {
    &__item {
      padding-left: 12px !important;
    }
  }
}
</style>
