<template>
  <div class="navigation-drawer-footer">
    <v-list dense>
      <a href="#">
        <v-list-item class="navigation-drawer-footer__item">
          <v-list-item-icon>
            <v-icon>mdi-crosshairs-question</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Documentation</v-list-item-title>
        </v-list-item>
      </a>
      <a href="#">
        <v-list-item class="navigation-drawer-footer__item">
          <v-list-item-icon>
            <v-icon>mdi-message-alert-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Give Feedback!</v-list-item-title>
        </v-list-item>
      </a>
    </v-list>
    <div class="navigation-drawer-footer__bottom" :style="isMini && { marginLeft: '21px' }">
      <span v-if="!isMini" class="navigation-drawer-footer__version">Version 2.8 -</span>
      <span v-else class="navigation-drawer-footer__version">
        2.8
      </span>
      <a v-if="!isMini" href="#" class="navigation-drawer-footer__release-notes"> Release Notes</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationDrawerFooter',
  props: {
    isMini: {
      type: Boolean
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
