<template>
  <div v-if="isVisible">
    <div
      class="common-simulator-preview-overlay"
      :class="{ 'nested-overlay': isNested }"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="[
        getNavigationDrawerClass,
        'common-simulator-preview-dialog'
      ]"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div
          class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header"
        >
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle class="k-overlay__title">
                  {{ title }}
                </VListItemTitle>
                <VListItemSubtitle v-if="subtitle" class="text-truncate">
                  {{ subtitle }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </div>
          <div>
            <VIcon class="cursor-pointer" color="#757575" @click="handleClose">
              mdi-close
            </VIcon>
          </div>
        </div>
      </div>
      <div
        class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body"
      >
        <slot />
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import useDrawerAnimation from "@/hooks/useDrawerAnimation";
import useHtmlOverflowControl from "@/hooks/useHtmlOverflowControl";

export default {
  name: "SmishingPreviewDrawer",
  mixins: [useDrawerAnimation, useHtmlOverflowControl],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ""
    },
    isNested: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        "k-navigation-drawer k-navigation-drawer--preview-dialog": true,
        "nested-drawer": this.isNested
      };
    }
  },
  methods: {
    handleClose() {
      this.closeDrawer();
    }
  }
};
</script>
