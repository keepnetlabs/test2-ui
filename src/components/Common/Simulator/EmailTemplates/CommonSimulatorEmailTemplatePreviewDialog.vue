<template>
  <div v-if="isVisible">
    <div
      class="email-template-preview-overlay"
      :class="{ 'nested-overlay': isNested }"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="getNavigationDrawerClass"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      :width="drawerWidth"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header">
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle class="k-overlay__title">
                  {{ getTitle }}
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
        <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
        <div v-if="!isPreviewLoading" class="pt-4">
          <div class="template-preview__text" v-if="!!templateHTML">
            <template v-if="!isIndividualPrintoutTemplate">
              <div>
                <span class="template-preview__text--title">Template Name: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.name }}</span>
                <VTooltip v-if="false" bottom>
                  <template #activator="{ on }">
                    <VIcon v-on="on" class="ml-1" style="margin-top: -2px;" color="#2196F3" small
                      >mdi-creation</VIcon
                    >
                  </template>
                  <span>This template was generated with AI</span>
                </VTooltip>
              </div>
              <div>
                <span class="template-preview__text--title">From Name: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.fromName }}</span>
              </div>
              <div>
                <span class="template-preview__text--title">From Email Address: </span>
                <span class="template-preview__text--body">{{
                  emailTemplateParams.fromAddress
                }}</span>
              </div>
              <div v-if="isPhishing && emailTemplateParams.ccAddresses.length > 0">
                <span class="template-preview__text--title">CC: </span>
                <span class="template-preview__text--body">{{
                  emailTemplateParams.ccAddresses.join(', ')
                }}</span>
              </div>
              <div>
                <span class="template-preview__text--subject">Subject: </span>
                <span class="template-preview__text--subject">{{
                  emailTemplateParams.subject
                }}</span>
              </div>
            </template>
            <div v-else class="d-flex justify-space-between align-center">
              <div class="text-primary-color fs-4">
                Example Individual Printout
              </div>
              <VBtn
                id="btn-preview-indiviual-printout"
                class="white--text btn-util btn-download-add-in"
                color="#2196F3"
                rounded
                :style="getIndividualPrintoutStyle"
                @click="handlePreviewIndividualPrintout"
              >
                <v-icon left>mdi-file-eye</v-icon>
                {{ labels.PrintPreview }}
              </VBtn>
            </div>
          </div>
          <div
            v-if="emailTemplateParams.attachment"
            class="attachment-wrapper position-relative mt-2"
          >
            <div class="attachment blue-attach mb-0">
              <AttachmentsPreview
                :deletable="false"
                :att="emailTemplateParams.attachment"
                :isEmailTemplate="true"
              />
            </div>
          </div>
          <hr class="mt-4" v-if="!!templateHTML" />
          <KEmailPreview v-if="!!templateHTML" ref="refPreview" :html="templateHTML" />
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import KEmailPreview from '@/components/KEmailPreview.vue'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview.vue'
import labels from '@/model/constants/labels'
import { getEmailTemplatePreviewContent } from '@/api/phishingsimulator'
import { difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import QuishingService from '@/api/quishing'
import { useLoading } from '@/hooks/useLoading'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
import useHtmlOverflowControl from '@/hooks/useHtmlOverflowControl'

export default {
  name: 'CommonSimulatorEmailTemplatePreviewDialog',
  components: {
    AttachmentsPreview,
    KEmailPreview,
    DatatableLoading
  },
  mixins: [useLoading, useDrawerAnimation, useHtmlOverflowControl],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: labels.EmailTemplatePreview
    },
    selectedRow: {
      type: Object,
      default: () => ({})
    },
    apiFunc: {
      type: Function,
      default: getEmailTemplatePreviewContent
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    },
    isIndividualPrintoutTemplate: {
      type: Boolean,
      default: false
    },
    isNested: {
      type: Boolean,
      default: false
    },
    languages: {
      type: Array,
      default: () => []
    },
    drawerWidth: {
      type: String,
      default: 'calc(100% - 72px)'
    },
    shouldControlHtmlOverflow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      labels,
      isPreviewLoading: false,
      emailTemplateParams: {},
      templateHTML: null,
      isIndividualPrintoutButtonDisabled: false,
      drawerId: `email-template-preview-drawer-${Math.random()}`
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--email-template-preview': true,
        'nested-drawer': this.isNested
      }
    },
    isPhishing() {
      return this.type === SCENARIO_TYPES.PHISHING
    },
    getIndividualPrintoutStyle() {
      const style = {
        textTransform: 'capitalize'
      }
      if (this.isIndividualPrintoutButtonDisabled) {
        style.cursor = 'default'
        style.opacity = 0.5
      }
      return style
    },
    getTitle() {
      return this?.isIndividualPrintoutTemplate
        ? labels.IndividualPrintoutTemplatePreview
        : this.title
    },
    subtitle() {
      return this?.selectedRow?.name || ''
    }
  },
  watch: {
    status(val) {
      this.isVisible = val
      if (val) {
        this.callForData()
      }
    }
  },
  created() {
    if (this.status) {
      this.callForData()
    }
  },
  methods: {
    handleOverlayClick(event) {
      event.stopPropagation()
      event.preventDefault()
      this.closeDrawer()
    },
    callForData() {
      this.isPreviewLoading = true
      this.apiFunc(this.selectedRow.resourceId)
        .then((response) => {
          const data = response.data.data
          const {
            fromName,
            fromAddress,
            ccAddresses,
            name,
            difficultyResourceId,
            phishingFileName,
            subject
          } = data
          this.emailTemplateParams = {
            fromName,
            fromAddress,
            ccAddresses,
            name,
            subject,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            attachment: phishingFileName
              ? {
                  name: phishingFileName
                }
              : null,
            isAssistedByAI: data.isAssistedByAI
          }
          if (this.type === SCENARIO_TYPES.QUISHING)
            data.template = data?.template?.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
          this.templateHTML = data.template
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.isPreviewLoading = false
          }, 500)
        })
    },
    handleClose() {
      this.closeDrawer()
    },
    handlePreviewIndividualPrintout() {
      this.isIndividualPrintoutButtonDisabled = true
      QuishingService.getQuishingPdfPreviewContent(this.selectedRow.resourceId)
        .then((response) => {
          const file = new File([response.data], 'Quishing PDF Preview', {
            type: 'application/pdf'
          })
          const fileURL = URL.createObjectURL(file)
          const newWindow = window.open(fileURL)
          newWindow.onload = function () {
            setTimeout(() => {
              newWindow.document.title = 'Quishing PDF Preview'
            }, 250)
          }
        })
        .finally(() => {
          this.isIndividualPrintoutButtonDisabled = false
        })
    }
  }
}
</script>
