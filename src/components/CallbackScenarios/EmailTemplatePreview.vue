<template>
  <div v-if="isVisible">
    <div
      class="common-simulator-preview-overlay"
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
                  Email Template Preview
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
      <div
        class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body"
      >
        <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
        <div v-show="!isPreviewLoading">
          <div class="text-primary-color fs-4 fw-600 mt-4 mb-2">
            {{ emailTemplateParams.name }}
          </div>
          <div
            class="template-preview"
            style="
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 16px;
            "
          >
            <div
              class="d-flex align-center justify-end gap-2 mb-3"
            >
              <VTooltip bottom>
                <template #activator="{ on }">
                  <div v-on="on">
                    <VBtn icon outlined color="#2196F3" small @click="handleExternalLink">
                      <VIcon small>mdi-open-in-new</VIcon>
                    </VBtn>
                  </div>
                </template>
                <span>Open in New Tab</span>
              </VTooltip>
              <VTooltip v-if="!isNested && showEditButton" bottom>
                <template #activator="{ on }">
                  <div v-on="on">
                    <VBtn icon outlined color="#2196F3" small @click="handleEdit">
                      <VIcon small>mdi-pencil</VIcon>
                    </VBtn>
                  </div>
                </template>
                <span>Edit Template</span>
              </VTooltip>
              <VTooltip v-if="!isNested && showDuplicateButton" bottom>
                <template #activator="{ on }">
                  <div v-on="on">
                    <VBtn icon outlined color="#2196F3" small @click="handleDuplicate">
                      <VIcon small>mdi-content-copy</VIcon>
                    </VBtn>
                  </div>
                </template>
                <span>Duplicate Template</span>
              </VTooltip>
            </div>
            <hr class="ml-n4 mr-n4 mb-3" v-if="!!templateHTML" />
            <div class="common-simulator-preview__text" v-if="!!templateHTML">
              <div>
                <span class="template-preview__text--title text-primary-color">Subject: </span>
                <span class="template-preview__text--body text-primary-color">{{ emailTemplateParams.subject }}</span>
              </div>
              <div>
                <span class="template-preview__text--title text-primary-color">From Name: </span>
                <span class="template-preview__text--body text-primary-color">{{ emailTemplateParams.fromName }}</span>
              </div>
              <div>
                <span class="template-preview__text--title text-primary-color">From Email: </span>
                <span class="template-preview__text--body text-primary-color">{{ emailTemplateParams.fromAddress }}</span>
              </div>
            </div>
            <div
              v-if="emailTemplateParams.attachment"
              class="attachment-wrapper mt-2 position-relative"
            >
              <div class="attachment blue-attach mb-0">
                <AttachmentsPreview
                  :deletable="false"
                  :att="emailTemplateParams.attachment"
                  :isEmailTemplate="true"
                />
              </div>
            </div>
            <hr class="mt-4 ml-n4 mr-n4 mb-2" v-if="!!templateHTML" />
            <KEmailPreview v-if="!!templateHTML" ref="refPreview" :html="templateHTML" />
          </div>
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import KEmailPreview from '@/components/KEmailPreview'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
import { openHtmlInNewWindow } from '@/utils/functions'

export default {
  name: 'CallbackEmailTemplatePreview',
  components: { DatatableLoading, KEmailPreview, AttachmentsPreview },
  mixins: [useDrawerAnimation],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isPreviewLoading: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: () => ({})
    },
    templateHTML: {
      type: String
    },
    emailTemplateParams: {
      type: Object,
      default: () => ({})
    },
    isNested: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
        'nested-drawer': this.isNested
      }
    },
    showEditButton() {
      return !this.selectedRow || this.selectedRow.isOwner !== false
    },
    showDuplicateButton() {
      return !!this.selectedRow
    }
  },
  methods: {
    handleClose() {
      this.closeDrawer()
    },
    handleExternalLink() {
      openHtmlInNewWindow(this.templateHTML)
    },
    handleEdit() {
      this.$emit('on-edit', this.selectedRow)
    },
    handleDuplicate() {
      this.$emit('on-duplicate', this.selectedRow)
    }
  }
}
</script>
