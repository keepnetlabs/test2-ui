<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="900"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    max-height
    max-height-size="900"
    class-name="vishing-template-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <div v-else :class="['template-preview']">
        <div v-if="showTemplateInfo" class="template-preview__text mb-4">
          <div>
            <span class="template-preview__text--body">Template Name: {{ templateData.name }}</span>
          </div>
          <div v-if="templateData.senderPhoneNumber">
            <span class="template-preview__text--body"
              >Sender Phone Number: {{ templateData.senderPhoneNumber }}</span
            >
          </div>
        </div>
        <VishingTemplatePreviewSteps
          :template="templateData"
          :isTextToSpeechCompatible="isTextToSpeechCompatible || campaignTextToSpeechCompatible"
          :voiceResourceId="voiceResourceId || campaignVoiceResourceId"
        />
      </div>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getVishingCampaignPreview, getVishingTemplatePreview } from '@/api/vishing'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import VishingTemplatePreviewSteps from '@/components/VishingTemplates/VishingTemplatePreviewSteps'
export default {
  name: 'VishingTemplatePreview',
  components: {
    DatatableLoading,
    AppDialog,
    VishingTemplatePreviewSteps
  },
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
      return this.selectedRow.name
    },
    isRenderSteps() {
      return this.templateData?.steps?.length > 0
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
          if (!this.isCampaign) {
            this.templateData = {
              ...this.templateData,
              language: this.language,
              voice: this.voice
            }
          } else {
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
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleClose() {
      this.$emit('on-close')
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
