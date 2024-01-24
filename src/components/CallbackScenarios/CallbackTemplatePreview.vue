<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="900"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    max-height
    max-height-size="900"
    class-name="callback-template-preview"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <div v-else :class="['template-preview']">
        <CallbackTemplatePreviewSteps
          :template="templateData"
          :isTextToSpeechCompatible="isTextToSpeechCompatible"
          :voiceResourceId="templateData.vishingLanguageResourceId"
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
import { getVishingCampaignPreview } from '@/api/vishing'
import CallbackService from '@/api/callback'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps'

export default {
  name: 'CallbackTemplatePreview',
  components: {
    DatatableLoading,
    AppDialog,
    CallbackTemplatePreviewSteps
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
    languageItems: {
      type: Array
    }
  },
  data() {
    return {
      isTextToSpeechCompatible: false,
      isLoading: false,
      labels,
      timeoutId: '',
      templateData: null
    }
  },
  computed: {
    getTitle() {
      if (this.isCampaign) {
        return 'Callback Campaign Preview'
      }
      return 'Callback Template Preview'
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
      const fn = this.isCampaign
        ? getVishingCampaignPreview
        : CallbackService.getCallbackTemplatePreview
      fn(this.selectedRow.resourceId)
        .then((response) => {
          this.templateData = response?.data?.data || {}
          this.templateData.invalidDialingNotice = { ...this.templateData.steps[0] }
          this.templateData.callGreeting = { ...this.templateData.steps[1] }
          this.templateData.steps.splice(0, 1)
          this.templateData.steps.splice(0, 1)
          const languageIndex = this.languageItems.findIndex(
            (language) => language.resourceId === this.templateData.vishingLanguageResourceId
          )
          this.templateData.language = this.languageItems[languageIndex].language
          this.templateData.voice = this.languageItems[languageIndex].name
          this.isTextToSpeechCompatible =
            this.languageItems[languageIndex].voiceProviderTypeId === 2
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
