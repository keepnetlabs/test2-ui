<template>
  <div
    v-if="isVisible"
    :class="{
      'nested-drawer-wrapper': isNested,
      'deep-nested-drawer-wrapper': isDeepNested
    }"
  >
    <div
      class="training-library-drawer-overlay"
      :class="{
        'nested-overlay': isNested,
        'deep-nested-overlay': isDeepNested
      }"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="[
        getNavigationDrawerClass,
        { 'training-library-drawer--with-approval-footer': showApprovalFooter }
      ]"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      :width="width"
      height="100%"
    >
      <div class="training-library-drawer__header">
        <slot name="header">
          <span class="training-library-drawer__header-title">
            {{ getTitle }}
          </span>
        </slot>
        <VIcon
          class="training-library-drawer__header-close"
          style="font-size: 32px;"
          color="#757575"
          @click="handleClose"
        >
          mdi-close
        </VIcon>
      </div>
      <div class="training-library-drawer__content">
        <div v-if="reasoningText" class="training-library-drawer__reasoning">
          <p class="training-library-drawer__reasoning-title">WHY THIS RECOMMENDATION?</p>
          <p class="training-library-drawer__reasoning-text">{{ reasoningText }}</p>
        </div>
        <div v-if="declineReasonText" class="training-library-drawer__decline-reason">
          <p class="training-library-drawer__decline-reason-title">WHY THIS WAS DECLINED?</p>
          <p class="training-library-drawer__decline-reason-text">{{ declineReasonText }}</p>
        </div>
        <TrainingLibraryDrawerContent
          :training-data="trainingData"
          :type="type"
          :is-nested="isNested"
          :is-deep-nested="isDeepNested"
          :only-preview="onlyPreview"
          @delete-success="handleDeleteSuccess"
          @duplicate-success="handleDuplicateSuccess"
          @send-clicked="handleSendClicked"
          @edit-clicked="handleEditClicked"
        />
      </div>
      <div v-if="showApprovalFooter" class="training-library-drawer__approval-footer">
        <VBtn
          outlined
          rounded
          color="#757575"
          class="elevation-0 fw-600"
          @click="$emit('decline')"
        >
          <VIcon left>mdi-close-circle</VIcon>
          Decline {{ approvalTypeName }}
        </VBtn>
        <div style="display: flex; gap: 8px;">
          <VTooltip
            top
            max-width="280"
            :z-index="10000"
            content-class="k-v-tooltip-content--over-drawer"
            :open-delay="150"
            :disabled="approvalFooterTooltipDisabled"
          >
            <template #activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="approval-footer-tooltip-activator">
                <VBtn
                  outlined
                  rounded
                  :class="approvalFooterRetryBtnClass"
                  style="background-color: #fff7e8; border-color: #f4c84f !important; color: #a45716 !important;"
                  @click="$emit('retry')"
                >
                  <VIcon left>mdi-refresh</VIcon>
                  Retry
                </VBtn>
              </div>
            </template>
            <span>{{ approvalFooterTooltipText }}</span>
          </VTooltip>
          <VTooltip
            top
            max-width="280"
            :z-index="10000"
            content-class="k-v-tooltip-content--over-drawer"
            :open-delay="150"
            :disabled="approvalFooterTooltipDisabled"
          >
            <template #activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="approval-footer-tooltip-activator">
                <VBtn
                  rounded
                  color="#2196f3"
                  :class="approvalFooterApproveBtnClass"
                  @click="$emit('approve')"
                >
                  <VIcon left>mdi-check-circle</VIcon>
                  Approve {{ approvalTypeName }}
                </VBtn>
              </div>
            </template>
            <span>{{ approvalFooterTooltipText }}</span>
          </VTooltip>
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import labels from '@/model/constants/labels'
import { createRandomCryptStringNumber } from '@/utils/functions'
import { approvalFooterActionsComputed } from '@/mixins/approvalFooterActionsComputed'
import TrainingLibraryDrawerContent from './TrainingLibraryDrawerContent.vue'

export default {
  name: 'TrainingLibraryDrawer',
  components: {
    TrainingLibraryDrawerContent
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: 'calc(100% - 72px)'
    },
    type: {
      type: String,
      default: TRAINING_LIBRARY_TYPES.TRAINING
    },
    trainingData: {
      type: Object,
      default: () => ({})
    },
    isNested: {
      type: Boolean,
      default: false
    },
    isDeepNested: {
      type: Boolean,
      default: false
    },
    onlyPreview: {
      type: Boolean,
      default: false
    },
    shouldControlBodyScroll: {
      type: Boolean,
      default: false
    },
    showApprovalFooter: {
      type: Boolean,
      default: false
    },
    showRetryButton: {
      type: Boolean,
      default: false
    },
    approvalTypeName: {
      type: String,
      default: ''
    },
    reasoningText: {
      type: String,
      default: ''
    },
    declineReasonText: {
      type: String,
      default: ''
    },
    approvalActionsDisabled: {
      type: Boolean,
      default: false
    },
    approvalActionsDisabledTooltip: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isVisible: false,
      drawerId: `drawer-${createRandomCryptStringNumber()}`,
      skipBodyScrollOnClose: false
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer training-library-drawer': true,
        'nested-drawer': this.isNested,
        'deep-nested-drawer': this.isDeepNested,
        'drawer-right-nested-animation': this.isNested,
        'drawer-right-deep-nested-animation': this.isDeepNested
      }
    },
    ...approvalFooterActionsComputed,
    getTitle() {
      if (this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH) return labels.LearningPathPreview
      if (this.type === TRAINING_LIBRARY_TYPES.POSTER) return labels.PosterPreview
      if (this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) return labels.InfographicPreview
      if (this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER) return labels.ScreensaverPreview
      if (this.type === TRAINING_LIBRARY_TYPES.SURVEY || this.trainingData?.hasQuiz)
        return labels.SurveyPreview
      return labels.TrainingPreview
    }
  },
  mounted() {
    // Drawer açıldığında animasyon için
    if (this.value) {
      this.isVisible = true
      this.$nextTick(() => {
        this.openDrawer()
        if (
          !this.isNested &&
          !this.isDeepNested &&
          (!this.onlyPreview || this.shouldControlBodyScroll)
        ) {
          this.disableBodyScroll()
        }
      })
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal && !this.isVisible) {
          // Açılma
          this.isVisible = true
          this.$nextTick(() => {
            this.openDrawer()
            if (
              !this.isNested &&
              !this.isDeepNested &&
              (!this.onlyPreview || this.shouldControlBodyScroll)
            ) {
              this.disableBodyScroll()
            }
          })
        } else if (!newVal && this.isVisible) {
          // Kapanma (dışarıdan kapatılırsa)
          this.isVisible = false
          if (
            !this.isNested &&
            !this.isDeepNested &&
            !this.skipBodyScrollOnClose &&
            (!this.onlyPreview || this.shouldControlBodyScroll)
          ) {
            this.enableBodyScroll()
          }
        }
      },
      immediate: false
    }
  },
  beforeDestroy() {
    if (
      !this.isNested &&
      !this.isDeepNested &&
      !this.skipBodyScrollOnClose &&
      (!this.onlyPreview || this.shouldControlBodyScroll)
    ) {
      this.enableBodyScroll()
    }
    this.isVisible = false
  },
  methods: {
    handleOverlayClick() {
      this.closeDrawer()
    },
    handleClose() {
      this.closeDrawer()
    },
    handleDeleteSuccess() {
      this.$emit('delete-success')
      this.closeDrawer()
    },
    handleDuplicateSuccess() {
      this.$emit('duplicate-success')
      this.closeDrawer()
    },
    handleEditClicked() {
      // Edit modal açılırken drawer kapanır
      this.skipBodyScrollOnClose = true

      if (this.isDeepNested || this.isNested) {
        // Nested veya deep nested drawer'daysa tüm drawer'ları kapat
        this.isVisible = false
        this.$emit('input', false)
        this.$emit('close-parent', { skipBodyScroll: true })
      } else {
        // Parent drawer
        const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
        if (drawerElement) {
          drawerElement.style.right = '-100%'
        }
        setTimeout(() => {
          this.isVisible = false
          this.$emit('input', false)
        }, 250)
      }
    },
    handleSendClicked() {
      // Send modal açıldığında drawer'ı kapat ama store'u reset etme
      this.skipBodyScrollOnClose = true

      if (this.isDeepNested || this.isNested) {
        // Nested veya deep nested drawer'daysa tüm drawer'ları kapat
        this.isVisible = false
        this.$emit('input', false)
        this.$emit('close-parent', { skipBodyScroll: true })
      } else {
        // Parent drawer
        const drawerElement = document.querySelector('.training-library-drawer')
        if (drawerElement) {
          drawerElement.style.right = '-100%'
        }

        setTimeout(() => {
          this.isVisible = false
          this.$emit('input', false)
        }, 250)
      }
    },
    openDrawer() {
      // Drawer'ı başta ekranın dışında başlat
      const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (drawerElement) {
        drawerElement.style.right = '-100%'
        // Bir sonraki frame'de animasyonla içeri getir
        setTimeout(() => {
          drawerElement.style.right = '0'
        }, 10)
      }
    },
    closeDrawer() {
      // Drawer'ı animasyonla kaydır
      const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (drawerElement) {
        drawerElement.style.right = '-100%'
      }

      // Animasyon bitince drawer'ı kapat
      setTimeout(() => {
        this.isVisible = false
        this.$emit('input', false)
        this.$emit('close')
      }, 250)
    },
    disableBodyScroll() {
      if (document.querySelector('html')) {
        document.querySelector('html').style.overflowY = 'hidden'
      }
      if (document.querySelector('body')) {
        document.querySelector('body').style.overflowY = 'hidden'
      }
    },
    enableBodyScroll() {
      if (document.querySelector('html')) {
        document.querySelector('html').style.overflowY = ''
      }
      if (document.querySelector('body')) {
        document.querySelector('body').style.overflowY = ''
      }
    }
  }
}
</script>