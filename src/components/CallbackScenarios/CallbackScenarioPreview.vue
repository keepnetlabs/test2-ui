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
        <div
          class="d-flex align-center justify-space-between mt-4 mb-1"
          style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;"
        >
          <div>
            <span class="text-primary-color fs-5 fw-600">{{
              selectedRow.name
            }}</span>
          </div>
          <div class="d-flex align-center gap-2">
            <VTooltip v-if="showEditButton" bottom>
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn icon outlined color="#2196F3" small @click="handleEdit">
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
        <ElTabs v-show="!isLoading" v-model="tab">
          <ElTabPane
            id="callback-scenario-info--email-content"
            name="email"
            :label="labels.JustEmail"
          >
            <div class="text-primary-color fs-4 fw-600 mb-2 mt-n4">
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
              <div class="common-simulator-preview__text" v-if="!!emailTemplate">
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
              <hr class="mt-4 ml-n4 mr-n4 mb-2" v-if="!!emailTemplate" />
              <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
            </div>
          </ElTabPane>
          <ElTabPane label="Callback Template" name="callbackTemplate">
            <div class="text-primary-color fs-4 fw-600 mb-2 mt-n4">
              {{ callbackTemplateParams.name }}
            </div>
            <CallbackTemplatePreviewSteps
              :template="callbackTemplateParams"
              :isTextToSpeechCompatible="isTextToSpeechCompatible"
              :voiceResourceId="callbackTemplateParams.vishingLanguageResourceId"
            />
          </ElTabPane>
        </ElTabs>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import CallbackService from '@/api/callback'
import labels from '@/model/constants/labels'
import { difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import KEmailPreview from '@/components/KEmailPreview'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
export default {
  name: 'CallbackScenarioPreview',
  components: {
    KEmailPreview,
    DatatableLoading,
    AttachmentsPreview,
    CallbackTemplatePreviewSteps
  },
  mixins: [useDrawerAnimation],
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    languages: {
      type: Array,
      default: () => []
    },
    isNested: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isTextToSpeechCompatible: false,
      emailTemplate: null,
      landingPageTemplates: [],
      isMethodMfa: false,
      selectedLandingPageIndex: 0,
      emailTemplateParams: {},
      callbackTemplateParams: {},
      tab: 'email',
      isLoading: false,
      labels,
      timeoutId: ''
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
      return 'Callback Scenario Preview'
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    },
    showEditButton() {
      return !!this.selectedRow
    },
    showDuplicateButton() {
      return !!this.selectedRow
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
      this.setLoading(true)
      CallbackService.getCallbackScenarioPreview(this.selectedRow.resourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          const { emailTemplate, callbackTemplate } = data
          const {
            template,
            fromName,
            fromAddress,
            name,
            difficultyResourceId,
            phishingFileName,
            subject
          } = emailTemplate || {}

          this.emailTemplateParams = {
            fromName,
            fromAddress,
            name,
            subject,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            attachment: phishingFileName
              ? {
                  name: phishingFileName
                }
              : null
          }
          this.emailTemplate = template

          const languageIndex = this.languages.findIndex(
            (language) => language.resourceId === callbackTemplate.vishingLanguageResourceId
          )

          this.callbackTemplateParams = {
            ...callbackTemplate
          }

          this.callbackTemplateParams.invalidDialingNotice = {
            ...this.callbackTemplateParams.steps[0]
          }
          this.callbackTemplateParams.steps.splice(0, 1)
          this.callbackTemplateParams.callGreeting = { ...this.callbackTemplateParams.steps[0] }
          this.callbackTemplateParams.steps.splice(0, 1)
          this.callbackTemplateParams.language = this.languages[languageIndex].language
          this.callbackTemplateParams.voice = this.languages[languageIndex].name
          this.isTextToSpeechCompatible = [2, 3].includes(
            this.languages[languageIndex].voiceProviderTypeId
          )
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading()
          }, 500)
        })
    },
    setLoading(flag = false) {
      this.isLoading = flag
    },
    handleClose() {
      this.closeDrawer()
    },
    handleEdit() {
      this.$emit('on-edit-template')
    },
    handleDuplicate() {
      this.$emit('on-duplicate-template')
    },
    handlePreviousTemplate() {
      this.selectedLandingPageIndex--
    },
    handleNextTemplate() {
      this.selectedLandingPageIndex++
    }
  }
}
</script>
