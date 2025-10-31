<template>
  <div class="navigation-drawer-footer">
    <v-list dense>
      <v-list-item
        v-if="isDocumentationLinkEnabled"
        id="btn--navigation-drawer-documentation"
        class="navigation-drawer-footer__item"
        @click="handleDocumentationClick"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiHelpCircleOutline }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title data-content="https://doc.keepnetlabs.com"
          >Documentation</v-list-item-title
        >
      </v-list-item>
      <v-list-item
        id="btn--navigation-drawer-feedback"
        class="navigation-drawer-footer__item"
        @click="handleFeedbackClick"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiMessageAlertOutline }}</v-icon>
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
        :data-content="getReleaseNotesUrl"
        :href="getReleaseNotesUrl"
      >
        Release Notes</a
      >
    </div>
  </div>
</template>

<script>
import { mdiHelpCircleOutline, mdiMessageAlertOutline } from '@mdi/js'
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
  data() {
    return {
      mdiHelpCircleOutline,
      mdiMessageAlertOutline
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
      return this.navigatorMenuProps?.systemVersion || '0'
    },
    getReleaseNotesUrl() {
      const { releaseNotesUrl = '' } = this.navigatorMenuProps
      return releaseNotesUrl
    },
    isDocumentationLinkEnabled() {
      const { isDocumentationLinkEnabled = true } = this.navigatorMenuProps
      return isDocumentationLinkEnabled
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
