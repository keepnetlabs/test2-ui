<template>
  <div v-if="isVisible">
    <div
      class="common-campaign-manager-preview-overlay"
      :class="{ 'nested-overlay': isNested }"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="navigationDrawerClass"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header">
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle class="k-overlay__title">
                  {{ title }}
                </VListItemTitle>
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
      <div class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body">
        <slot v-if="loading" name="loading" />
        <template v-else>
          <div
            class="d-flex align-center justify-space-between mt-4"
            style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;"
          >
            <div>
              <span class="text-primary-color fs-5 fw-600">{{ campaignName }}</span>
            </div>
            <div v-if="showEdit" class="d-flex align-center gap-2">
              <VTooltip bottom>
                <template #activator="{ on }">
                  <div v-on="on">
                    <VBtn icon outlined color="#2196F3" small @click="$emit('edit-campaign')">
                      <VIcon small>mdi-pencil</VIcon>
                    </VBtn>
                  </div>
                </template>
                <span>Edit</span>
              </VTooltip>
            </div>
          </div>
          <slot />
        </template>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
import useHtmlOverflowControl from '@/hooks/useHtmlOverflowControl'

export default {
  name: 'CommonCampaignManagerPreviewFrame',
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
    campaignName: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    isNested: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    navigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--campaign-manager-preview': true,
        'nested-drawer': this.isNested
      }
    }
  },
  methods: {
    handleClose() {
      this.closeDrawer()
    }
  }
}
</script>
