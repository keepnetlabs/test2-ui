<template>
  <div v-if="isVisible">
    <div class="vishing-template-preview-overlay" @click="handleOverlayClick"></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="[getNavigationDrawerClass, 'vishing-template-preview-drawer']"
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
        <div class="vishing-template-preview-drawer__summary">
          <div>
            <span class="text-primary-color fs-5 fw-600">{{ getSubtitle }}</span>
          </div>
          <div class="vishing-template-preview-drawer__summary-actions">
            <VTooltip v-if="showEditButton" bottom>
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn icon outlined color="#2196F3" small :disabled="editDisabled" @click="handleEdit">
                    <VIcon small>mdi-pencil</VIcon>
                  </VBtn>
                </div>
              </template>
              <span>Edit</span>
            </VTooltip>
            <VTooltip v-if="showDuplicateButton" bottom>
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn
                    icon
                    outlined
                    color="#2196F3"
                    small
                    :disabled="duplicateDisabled"
                    @click="handleDuplicate"
                  >
                    <VIcon small>mdi-content-copy</VIcon>
                  </VBtn>
                </div>
              </template>
              <span>Duplicate</span>
            </VTooltip>
          </div>
        </div>
        <DatatableLoading v-if="isLoading" :loading="isLoading" />
        <div v-else class="template-preview">
          <div v-if="showTemplateInfo" class="template-preview__text mb-4">
            <div v-if="showTemplateName">
              <span class="template-preview__text--body">Template Name: {{ templateData.name }}</span>
            </div>
            <div v-if="templateData.senderPhoneNumber">
              <span class="template-preview__text--body">
                Sender Phone Number: {{ templateData.senderPhoneNumber }}
              </span>
            </div>
          </div>
          <VishingTemplatePreviewSteps
            :template="templateData"
            :isTextToSpeechCompatible="isTextToSpeechCompatible || campaignTextToSpeechCompatible"
            :voiceResourceId="voiceResourceId || campaignVoiceResourceId"
          />
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import { getVishingCampaignPreview, getVishingTemplatePreview } from '@/api/vishing'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import VishingTemplatePreviewSteps from '@/components/VishingTemplates/VishingTemplatePreviewSteps'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
export default {
  name: 'VishingTemplatePreview',
  components: {
    DatatableLoading,
    VishingTemplatePreviewSteps
  },
  mixins: [useDrawerAnimation],
  props: {
    isCampaign: {
      type: Boolean
    },
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    showTemplateInfo: {
      type: Boolean,
      default: true
    },
    isTextToSpeechCompatible: {
      type: Boolean,
      default: false
    },
    voiceResourceId: {
      type: String
    },
    language: {
      type: String
    },
    voice: {
      type: String
    },
    languages: {
      type: Array,
      default: () => []
    },
    isNested: {
      type: Boolean,
      default: false
    },
    showEditButton: {
      type: Boolean,
      default: false
    },
    showDuplicateButton: {
      type: Boolean,
      default: false
    },
    editDisabled: {
      type: Boolean,
      default: false
    },
    duplicateDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      campaignVoiceResourceId: '',
      campaignTextToSpeechCompatible: false,
      isLoading: false,
      labels,
      timeoutId: '',
      templateData: null
    }
  },
  computed: {
    getTitle() {
      if (this.isCampaign) {
        return 'Vishing Campaign Preview'
      }
      return 'Vishing Template Preview'
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    },
    isRenderSteps() {
      return this.templateData?.steps?.length > 0
    },
    showTemplateName() {
      return !this.isCampaign
    }
  },
  created() {
    this.callForData()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    callForData() {
      this.isLoading = true
      const fn = this.isCampaign ? getVishingCampaignPreview : getVishingTemplatePreview
      fn(this.selectedRow.resourceId)
        .then((response) => {
          this.templateData = response?.data?.data || {}
          const invalidDialingNoticeStepIndex = this?.templateData?.steps?.findIndex(
            (step) => step.order === 0
          )
          if (invalidDialingNoticeStepIndex !== -1) {
            this.templateData = {
              ...this.templateData,
              invalidDialingNotice: this?.templateData.steps[invalidDialingNoticeStepIndex]
            }
            this?.templateData?.steps?.splice(invalidDialingNoticeStepIndex, 1)
          }
          if (this.isCampaign) {
            const voiceIndex = this.languages.findIndex(
              (language) => language.resourceId === this.templateData.vishingLanguageResourceId
            )
            if (voiceIndex !== -1) {
              this.templateData = {
                ...this.templateData,
                language: this.languages[voiceIndex].language,
                voice: this.languages[voiceIndex].name
              }
              this.campaignVoiceResourceId = this.templateData.vishingLanguageResourceId
              this.campaignTextToSpeechCompatible = [2, 3].includes(
                this.languages[voiceIndex].voiceProviderTypeId
              )
            }
          } else {
            this.templateData = {
              ...this.templateData,
              language: this.language,
              voice: this.voice
            }
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleClose() {
      if (this.closeDrawer) {
        this.closeDrawer()
        return
      }
      this.$emit('on-close')
    },
    handleEdit() {
      if (this.editDisabled) return
      this.$emit('on-edit-template')
    },
    handleDuplicate() {
      if (this.duplicateDisabled) return
      this.$emit('on-duplicate-template')
    },
    handleAudioPlay(index) {
      for (let i = 0; i < this.templateData.steps.length; i++) {
        if (i === index || this.templateData.steps[i].inputType !== 'FileUpload') continue
        this.$refs?.[`refStep${i}`]?.[0]?.$refs?.refAudioPlayer?.onPauseAudio()
      }
    }
  }
}
</script>
