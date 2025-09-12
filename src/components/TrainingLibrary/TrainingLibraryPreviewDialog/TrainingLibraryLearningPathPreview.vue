<template>
  <div>
    <ElTabs v-model="tab" @tab-click="handleChangeTab">
      <ElTabPane
        :label="labels.LearningPathDetails"
        name="details"
        id="campaign-manager-info--training-details-content"
      >
        <template v-if="learningPathParams">
          <div class="training-library-preview__details-item d-flex justify-space-between">
            <div>
              <span class="training-library-preview__title">Learning Path Name: </span>
              <span class="training-library-preview__desc">{{ learningPathParams.name }}</span>
            </div>
            <div class="d-flex align-center gap-2">
              <TrainingLibraryNewBadge v-if="learningPathParams && learningPathParams.isNew" />
              <TrainingLibraryFavoriteButton
                v-if="learningPathParams"
                ref="refFavoriteButton"
                :is-default-favourite="learningPathParams.isFavourite"
                :training-id="trainingId"
              />
            </div>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Category Name: </span>
            <span class="training-library-preview__desc">{{
              learningPathParams.categoryName || learningPathParams.category
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Description: </span>
            <span class="training-library-preview__desc">{{
              learningPathParams.description || learningPathParams.trainingDescription
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Target Audience: </span>
            <span class="training-library-preview__desc">{{
              learningPathParams.targetAudienceName || learningPathParams.targetAudience
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Created By: </span>
            <span class="training-library-preview__desc">{{ learningPathParams.createdBy }}</span>
          </div>
          <div class="training-library-preview__details-item align-baseline">
            <div>
              <span class="training-library-preview__title">Compliance: </span>
            </div>
            <div class="d-flex flex-wrap gap-2 ml-2">
              <span
                v-for="(compliance, tIndex) in learningPathParams.complianceNames"
                :key="tIndex"
                class="training-library-preview__tag"
                >{{ compliance }}</span
              >
            </div>
          </div>
          <div class="training-library-preview__details-item align-baseline">
            <div>
              <span class="training-library-preview__title">Tags: </span>
            </div>
            <div class="d-flex flex-wrap gap-2 ml-2">
              <span
                v-for="(tag, tIndex) in learningPathParams.tagNames"
                :key="tIndex"
                class="training-library-preview__tag"
                >{{ tag }}</span
              >
            </div>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Behaviours: </span>
            <ul>
              <li
                v-for="(behaviour, bIndex) in learningPathParams.behaviourNames"
                :key="bIndex"
                class="training-library-preview__desc"
              >
                {{ behaviour }}
              </li>
            </ul>
          </div>
        </template>
      </ElTabPane>
      <ElTabPane
        v-for="(training, index) in getTrainingGroups"
        id="campaign-manager-info--training-preview-content"
        :name="`${index + 1}`"
        :key="index"
        :label="`Step ${index + 1}: ${training.name}`"
      >
      </ElTabPane>
      <ElTabs
        v-show="tab !== 'details'"
        v-model="selectedTrainingTab"
        v-if="!isLoading"
        class="k-sub-tab mt-4"
      >
        <ElTabPane name="preview" :label="labels.Preview">
          <div class="training-library-preview mt-4 training-library-training-preview">
            <div class="d-flex justify-space-between align-center">
              <div>
                <span class="training-library-preview__title"
                  >{{ getActiveMaterialNameLabel }}
                </span>
                <span class="training-library-preview__desc">{{
                  activeTrainingContentParams.name
                }}</span>
              </div>
              <div :key="activeTrainingContentButtonKey" class="d-flex align-center gap-2">
                <TrainingLibraryNewBadge
                  v-if="activeTrainingContentParams && activeTrainingContentParams.isNew"
                />
                <TrainingLibraryFavoriteButton
                  v-if="activeTrainingContentParams"
                  ref="refFavoriteButtonActiveContent"
                  :is-default-favourite="activeTrainingContentParams.isFavourite"
                  :training-id="activeTrainingContentId"
                />
              </div>
            </div>
            <FormGroupHorizontalContent
              class="mt-4 justify-start"
              style="max-width: 500px;"
              :label="getActiveMaterialNameLanguageLabel"
            >
              <KSelect
                v-model="activeTrainingLanguageId"
                dense
                outlined
                class="max-width-200"
                placeholder="Select Option"
                :items="activeTrainingContentLanguages"
                @input="callForTemplatePreview(true)"
              />
            </FormGroupHorizontalContent>
            <DatatableLoading v-if="isTemplateLoading" :loading="isTemplateLoading" />
            <div v-if="isTrainingTypeTraining">
              <iframe
                v-if="activeTemplate && !isTemplateLoading"
                :key="iframeKey"
                :class="['training-library-preview__player', iframeClass]"
                allowfullscreen
                title="Training Preview"
                :src="activeTemplate"
              ></iframe>
            </div>
            <div v-else>
              <div v-if="!isTemplateLoading">
                <hr class="my-4" />
                <div class="d-flex justify-space-between align-center mb-4">
                  <div>
                    <span class="template-preview__text--title text-preview-gray">File Name: </span>
                    <span class="template-preview__text--body">{{ fileName }}</span>
                  </div>

                  <VBtn
                    id="btn-preview-indiviual-printout"
                    class="white--text btn-util btn-download-add-in"
                    style="text-transform: none;"
                    color="#2196F3"
                    rounded
                    :style="getDownloadActiveTrainingContentStyle"
                    @click="handleDownloadActiveTrainingContent"
                  >
                    <v-icon left>mdi-download</v-icon>
                    {{
                      activeTrainingContentType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
                        ? labels.DownloadPoster
                        : labels.DownloadInfographic
                    }}
                  </VBtn>
                </div>
                <div class="max-w-100 d-flex justify-center w-100">
                  <img
                    v-if="!isPdf"
                    class="max-w-100"
                    :key="activeTrainingContentSrc"
                    :src="activeTrainingContentSrc"
                    alt="Preview"
                  />
                  <pdf
                    v-else
                    ref="refPdf"
                    class="w-100"
                    :key="activeTrainingContentPdfSrc"
                    :src="activeTrainingContentPdfSrc"
                    @error="handleError"
                  />
                </div>
              </div>
            </div>
          </div>
        </ElTabPane>
        <ElTabPane
          :label="labels.Details"
          name="details"
          id="campaign-manager-info--training-details-content"
        >
          <template v-if="activeTrainingContentParams">
            <div class="training-library-preview__details-item">
              <span class="training-library-preview__title">{{ getActiveMaterialNameLabel }} </span>
              <span class="training-library-preview__desc">{{
                activeTrainingContentParams.name
              }}</span>
            </div>
            <div v-if="isTrainingTypeTraining" class="training-library-preview__details-item">
              <span class="training-library-preview__title">Vendor Name: </span>
              <span class="training-library-preview__desc">{{
                activeTrainingContentParams.vendor
              }}</span>
            </div>
            <div class="training-library-preview__details-item">
              <span class="training-library-preview__title">Category Name: </span>
              <span class="training-library-preview__desc">{{
                activeTrainingContentParams.categoryName || activeTrainingContentParams.category
              }}</span>
            </div>
            <div class="training-library-preview__details-item">
              <span class="training-library-preview__title">Description: </span>
              <span class="training-library-preview__desc">{{
                activeTrainingContentParams.description ||
                activeTrainingContentParams.trainingDescription
              }}</span>
            </div>
            <div class="training-library-preview__details-item">
              <span class="training-library-preview__title">Target Audience: </span>
              <span class="training-library-preview__desc">{{
                activeTrainingContentParams.targetAudienceName ||
                activeTrainingContentParams.targetAudience
              }}</span>
            </div>
            <div class="training-library-preview__details-item align-baseline">
              <div>
                <span class="training-library-preview__title">Languages: </span>
              </div>
              <div class="d-flex flex-wrap gap-2 ml-2">
                <span
                  v-for="(lang, langIndex) in activeTrainingContentLanguageCodes"
                  :key="langIndex"
                  class="training-library-preview__tag"
                  >{{ lang }}</span
                >
              </div>
            </div>
            <div class="training-library-preview__details-item">
              <span class="training-library-preview__title">Created By: </span>
              <span class="training-library-preview__desc">{{
                activeTrainingContentParams.createdBy
              }}</span>
            </div>
            <div class="training-library-preview__details-item align-baseline">
              <div>
                <span class="training-library-preview__title">Compliance: </span>
              </div>
              <div class="d-flex flex-wrap gap-2 ml-2">
                <span
                  v-for="(compliance, tIndex) in activeTrainingContentParams.complianceNames"
                  :key="tIndex"
                  class="training-library-preview__tag"
                  >{{ compliance }}</span
                >
              </div>
            </div>
            <div class="training-library-preview__details-item align-baseline">
              <div>
                <span class="training-library-preview__title">Tags: </span>
              </div>
              <div class="d-flex flex-wrap gap-2 ml-2">
                <span
                  v-for="(tag, tagIndex) in activeTrainingContentParams.tagNames"
                  :key="tagIndex"
                  class="training-library-preview__tag"
                  >{{ tag }}</span
                >
              </div>
            </div>

            <div class="training-library-preview__details-item">
              <span class="training-library-preview__title">Behaviours: </span>
              <ul>
                <li
                  v-for="(behaviour, bIndex) in activeTrainingContentParams.behaviourNames"
                  :key="bIndex"
                  class="training-library-preview__desc"
                >
                  {{ behaviour }}
                </li>
              </ul>
            </div>
          </template>
        </ElTabPane>
      </ElTabs>
    </ElTabs>
  </div>
</template>
<script>
import { createRandomCryptStringNumber } from '@/utils/functions'
import AwarenessEducatorService from '@/api/awarenessEducator'
import labels from '@/model/constants/labels'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import TrainingLibraryNewBadge from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryNewBadge.vue'
import TrainingLibraryFavoriteButton from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryFavoriteButton.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'TrainingLibraryLearningPathPreview',
  components: {
    TrainingLibraryFavoriteButton,
    TrainingLibraryNewBadge,
    DatatableLoading,
    FormGroupHorizontalContent,
    KSelect,
    pdf: () => import('vue-pdf')
  },
  props: {
    name: {
      type: String
    },
    trainingId: {
      type: String
    },
    isLoading: {
      type: Boolean
    },
    learningPathParams: {
      type: Object
    },
    iframeClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labels,
      TRAINING_LIBRARY_PAYLOAD_TYPES,
      tab: 'details',
      isPdf: true,
      isDownloadButtonDisabled: false,
      selectedTrainingTab: 'preview',
      activeTrainingLanguageId: '',
      isTemplateLoading: false,
      activeTemplate: null,
      iframeKey: `key-${createRandomCryptStringNumber()}`,
      activeTrainingContentId: '',
      activeTrainingContentType: '',
      activeTrainingContentSrc: '',
      activeTrainingContentButtonKey: `key-${createRandomCryptStringNumber()}`,
      fileName: '',
      activeTrainingContentPdfSrc: null,
      activeTrainingContentLanguages: [],
      activeTrainingContentLanguageCodes: [],
      activeTrainingContentParams: {}
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages'
    }),
    getTrainingGroups() {
      return this.learningPathParams?.trainingGroups || []
    },
    isTrainingTypeTraining() {
      return (
        this.activeTrainingContentType === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING ||
        this.activeTrainingContentType.startsWith('SCORM')
      )
    },
    getDownloadActiveTrainingContentStyle() {
      const style = {
        textTransform: 'none'
      }
      if (this.isDownloadButtonDisabled) {
        style.opacity = '.7'
        style.pointerEvents = 'none'
      }
      return style
    },
    getActiveMaterialNameLabel() {
      if (this.activeTrainingContentType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        return labels.PosterName + ':'
      } else if (this.activeTrainingContentType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        return labels.InfoGraphicName + ':'
      } else if (this.activeTrainingContentType === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) {
        return labels.ScreensaverName + ':'
      }
      return labels.TrainingName + ':'
    },
    getActiveMaterialNameLanguageLabel() {
      if (this.activeTrainingContentType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        return labels.PosterLanguage + ':'
      } else if (this.activeTrainingContentType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        return labels.InfographicLanguage + ':'
      } else if (this.activeTrainingContentType === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) {
        return labels.ScreensaverLanguage + ':'
      }
      return labels.TrainingLanguage + ':'
    }
  },
  methods: {
    handleChangeTab(training) {
      if (!training.label.startsWith('Step')) return
      const trainingGroupIndex = parseInt(training.index, 10) - 1
      if (trainingGroupIndex < 0) return
      const trainingGroup = this.getTrainingGroups?.[trainingGroupIndex] || {}
      this.activeTrainingContentId = trainingGroup.detailTrainingId
      this.activeTrainingContentType = trainingGroup.type
      this.activeTrainingContentLanguageCodes = trainingGroup.languages
      this.callForActiveTrainingDetail()
    },
    callForActiveTrainingDetail() {
      this.isTemplateLoading = true
      AwarenessEducatorService.getTraining(this.activeTrainingContentId).then((response) => {
        this.activeTrainingContentParams = response?.data?.data
        this.activeTrainingContentButtonKey = `key-${createRandomCryptStringNumber()}`
        this.activeTrainingContentLanguages = this.activeTrainingContentLanguageCodes
          .reduce((acc, lang) => {
            const selectedLanguage = this.languages.find((language) => language.code === lang)
            if (selectedLanguage) acc.push(selectedLanguage)
            return acc
          }, [])
          .map((item) => ({ text: item.name, value: item.id }))
        if (this.activeTrainingContentLanguages.length) {
          this.activeTrainingLanguageId = this.activeTrainingContentLanguages[0].value
          this.callForTemplatePreview(true)
        }
      })
    },
    callForTemplatePreview(isTemplateLoading = false) {
      if (isTemplateLoading) this.isTemplateLoading = true
      else this.$emit('update:isLoading', true)
      AwarenessEducatorService.getTrainingUrlForPreview(
        this.activeTrainingContentId,
        this.activeTrainingLanguageId
      )
        .then((response) => {
          const {
            data: { data }
          } = response
          if (this.isTrainingTypeTraining) {
            this.activeTemplate = `${data.scormPlayerUrl}?isPreview=true&scoAddress=${data.trainingUrl}`
            this.iframeKey = `key-${createRandomCryptStringNumber()}`
          } else {
            const splittedUrl = data?.trainingUrl.split('/')
            this.fileName = splittedUrl[splittedUrl.length - 1]
            this.isPdf = this.fileName.includes('.pdf')
            this.activeTrainingContentSrc = data?.trainingUrl
            if (this.isPdf) this.handleDownloadActiveTrainingContent()
          }
        })
        .finally(() => {
          if (isTemplateLoading) this.isTemplateLoading = false
          else setTimeout(() => this.$emit('update:isLoading', false), 200)
        })
    },
    handleDownloadActiveTrainingContent() {
      if (this.isPdf && this.activeTrainingContentPdfSrc) {
        return this.downloadPDFObject(this.activeTrainingContentPdfSrc)
      }
      this.isDownloadButtonDisabled = true
      AwarenessEducatorService.downloadPoster({
        trainingId: this.activeTrainingContentId,
        languageId: this.activeTrainingLanguageId
      })
        .then((response) => {
          if (this.isPdf) {
            this.activeTrainingContentPdfSrc = window.URL.createObjectURL(response.data)
            return
          }
          this.downloadPDFObject(window.URL.createObjectURL(response.data))
        })
        .finally(() => {
          if (this.isPdf) this.isLoading = false
          this.isDownloadButtonDisabled = false
        })
    },
    downloadPDFObject(data) {
      const link = document.createElement('a')
      link.href = data
      link.download = `${this.fileName}`
      link.click()
    },
    handleError(e) {}
  }
}
</script>
