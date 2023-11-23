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
// TODO: Changep endpoints
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
          this.templateData.callGreeting = { ...this.templateData.steps[0] }
          this.templateData.invalidDialingNotice = { ...this.templateData.steps[1] }
          this.templateData.steps.splice(0, 1)
          this.templateData.steps.splice(0, 1)
          const languageIndex = this.languageItems.findIndex(
            (language) => language.resourceId === this.templateData.vishingLanguageResourceId
          )
          this.templateData.language = this.languageItems[languageIndex].language
          this.templateData.voice = this.languageItems[languageIndex].name
          this.isTextToSpeechCompatible =
            this.languageItems[languageIndex].voiceProviderTypeId === 2
          console.log(this.isTextToSpeechCompatible)
          console.log(this.templateData)
          // this.templateData = {
          //   language: this.languageItems[languageIndex].language,
          //   voice: this.languageItems[languageIndex].name,
          //   steps: [
          //     {
          //       inputType: 'TextToSpeech',
          //       inputText:
          //         'Lorem ipsum dolor sit amet consectetur. Integer cras nisi fermentum ullamcorper cursus risus id risus consequat. Et sollicitudin est eu in. Consequat ultrices quis malesuada auctor etiam sagittis et amet. Purus sed suspendisse diam donec. Ornare odio tempor sollicitudin aliquet tempus facilisis arcu.',
          //       inputDigit: 6,
          //       duration: 0,
          //       isVishingstep: true,
          //       content: null,
          //       inputUrl: null,
          //       isExpanded: true
          //     },
          //     {
          //       inputType: 'FileUpload',
          //       inputText: '',
          //       inputDigit: 5,
          //       content: null,
          //       duration: 0,
          //       isVishingstep: false,
          //       inputUrl: `https://keepnetlabsvishing.s3.eu-west-2.amazonaws.com/VishingTEST/X7AE3NtBgV1B-2.mp3`,
          //       isExpanded: true
          //     },
          //     {
          //       inputType: 'Pause',
          //       inputText: '',
          //       inputDigit: 0,
          //       content: null,
          //       duration: 3,
          //       isVishingstep: false,
          //       inputUrl: null,
          //       isExpanded: true
          //     }
          //   ],
          //   callGreeting: {
          //     inputType: 'TextToSpeech',
          //     inputText:
          //       'Lorem ipsum dolor sit amet consectetur. Integer cras nisi fermentum ullamcorper cursus risus id risus consequat. Et sollicitudin est eu in. Consequat ultrices quis malesuada auctor etiam sagittis et amet. Purus sed suspendisse diam donec. Ornare odio tempor sollicitudin aliquet tempus facilisis arcu.',
          //     content: null,
          //     duration: 0,
          //     phishingCodeDigits: 6,
          //     isVishingstep: false,
          //     inputUrl: null
          //   },
          //   invalidDialingNotice: {
          //     inputType: 'TextToSpeech',
          //     inputText:
          //       'Lorem ipsum dolor sit amet consectetur. Integer cras nisi fermentum ullamcorper cursus risus id risus consequat. Et sollicitudin est eu in. Consequat ultrices quis malesuada auctor etiam sagittis et amet. Purus sed suspendisse diam donec. Ornare odio tempor sollicitudin aliquet tempus facilisis arcu.',
          //     inputDigit: 0,
          //     content: null,
          //     duration: 0,
          //     isVishingstep: false,
          //     inputUrl: null
          //   }
          // }
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
