<template>
  <div v-if="isVisible">
    <VNavigationDrawer
      v-click-outside="handleClickOutside"
      :value="isVisible"
      class="select-click-only-drawer"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="select-click-only-drawer__content-wrapper">
        <div class="select-click-only-drawer__header">
          <VListItem>
            <VListItemContent>
              <VListItemTitle class="k-overlay__title">Add Landing Page Template</VListItemTitle>
            </VListItemContent>
          </VListItem>
          <VIcon
            class="cursor-pointer"
            color="#757575"
            style="font-size: 32px;"
            @click="handleClose"
          >
            mdi-close
          </VIcon>
        </div>

        <VDivider />

        <div class="select-click-only-drawer__body">
          <LandingPageTemplateListPreview
            :scenario-details-lookup="scenarioDetailsLookup"
            :method="method"
            :languages="languages"
            :type="type"
            @selectedLandingPageTemplateResourceId="selectedResourceId = $event"
          />
        </div>

        <VDivider />

        <div class="select-click-only-drawer__footer">
          <VBtn text color="#f56c6c" @click="handleClose">CANCEL</VBtn>
          <VSpacer />
          <VBtn
            color="#2196f3"
            dark
            depressed
            :disabled="!selectedResourceId"
            @click="handleAddTemplate"
          >
            ADD TEMPLATE
          </VBtn>
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import LandingPageTemplateListPreview from '@/components/workshop/LandingPageTemplateListPreview.vue'
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'SelectClickOnlyPageModal',
  components: { LandingPageTemplateListPreview },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    method: {
      type: String,
      default: ''
    },
    scenarioDetailsLookup: {
      type: Object,
      default: () => ({})
    },
    languages: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isVisible: false,
      drawerId: `drawer-${createRandomCryptStringNumber()}`,
      selectedResourceId: null,
      isJustOpened: false
    }
  },
  watch: {
    status(newVal) {
      if (newVal && !this.isVisible) {
        this.isVisible = true
        this.isJustOpened = true
        this.$nextTick(() => {
          this.openDrawer()
          setTimeout(() => {
            this.isJustOpened = false
          }, 300)
        })
      } else if (!newVal && this.isVisible) {
        this.closeDrawer()
      }
    }
  },
  methods: {
    openDrawer() {
      const el = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (el) {
        el.style.right = '-100%'
        setTimeout(() => {
          el.style.right = '0'
        }, 10)
      }
    },
    closeDrawer() {
      const el = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (el) el.style.right = '-100%'
      setTimeout(() => {
        this.isVisible = false
        this.selectedResourceId = null
        this.$emit('close')
      }, 250)
    },
    handleClose() {
      this.closeDrawer()
    },
    handleClickOutside(event) {
      if (this.isJustOpened) return
      const target = event?.target
      if (
        target &&
        (target.closest('.el-select-dropdown') ||
          target.closest('.el-picker-panel') ||
          target.closest('.el-popper') ||
          target.closest('.v-menu__content'))
      ) {
        return
      }
      this.handleClose()
    },
    handleAddTemplate() {
      if (!this.selectedResourceId) return
      this.$emit('add', this.selectedResourceId)
    }
  }
}
</script>

<style>
.select-click-only-drawer {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
  background: #fff !important;
  box-shadow: -25px 0 75px 20px rgba(0, 0, 0, 0.1) !important;
  animation: drawerRight 0.25s ease-in-out;
  transition: right 0.25s ease-in-out !important;
  z-index: 10012 !important;
}
</style>

<style scoped>
.select-click-only-drawer__content-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.select-click-only-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 24px 4px 48px;
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
}
.select-click-only-drawer__body {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
.select-click-only-drawer__footer {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  flex-shrink: 0;
}
</style>
