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
      <div
        class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body"
      >
        <div class="callback-template-preview__header mt-4 mb-1">
          <div class="callback-template-preview__header-left">
            <span class="text-primary-color fs-5 fw-600">{{
              getSubtitle
            }}</span>
          </div>
          <div v-if="!isCampaign" class="callback-template-preview__header-right d-flex align-center gap-2">
            <VTooltip bottom>
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn icon outlined color="#2196F3" small @click="handleEdit">
                    <VIcon small>mdi-pencil</VIcon>
                  </VBtn>
                </div>
              </template>
              <span>Edit</span>
            </VTooltip>
            <VTooltip bottom>
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn icon outlined color="#2196F3" small @click="handleDuplicate">
                    <VIcon small>mdi-content-copy</VIcon>
                  </VBtn>
                </div>
              </template>
              <span>Duplicate</span>
            </VTooltip>
          </div>
        </div>
        <DatatableLoading v-if="isLoading" :loading="isLoading" />
        <div v-show="!isLoading" class="mt-4">
          <CallbackTemplatePreviewSteps
            v-if="templateData"
            :template="templateData"
            :isTextToSpeechCompatible="isTextToSpeechCompatible"
            :voiceResourceId="templateData.vishingLanguageResourceId"
          />
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import { getVishingCampaignPreview } from '@/api/vishing'
import CallbackService from '@/api/callback'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'

export default {
  name: 'CallbackTemplatePreview',
  components: {
    DatatableLoading,
    CallbackTemplatePreviewSteps
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
    languageItems: {
      type: Array
    },
    isNested: {
      type: Boolean,
      default: false
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
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
        'nested-drawer': this.isNested
      }
    },
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
          this.isTextToSpeechCompatible = [2, 3].includes(
            this.languageItems[languageIndex].voiceProviderTypeId
          )
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleClose() {
      this.closeDrawer()
    },
    handleEdit() {
      this.$emit('on-edit', this.selectedRow)
    },
    handleDuplicate() {
      this.$emit('on-duplicate', this.selectedRow)
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
