<template>
  <AppDialog
    custom-size="1600"
    :status="status"
    :title="title"
    :subtitle="subtitle"
    max-height
    max-height-size="900"
    class-name="campaign-manager-preview-dialog"
    :icon="icon"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <ElTabs v-if="!isLoading && showTabs" v-model="tab">
        <ElTabPane id="poster-info--preview-content" name="preview" :label="labels.Preview">
          <div class="template-preview pt-4">
            <div class="template-preview__text">
              <div v-if="showPosterName">
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <span class="template-preview__text--title text-preview-gray"
                      >Poster Name:
                    </span>
                    <span class="template-preview__text--body ml-2">{{
                      selectedRow && selectedRow.trainingName
                    }}</span>
                  </div>
                  <div v-if="showFavoriteButton" class="d-flex align-center gap-2">
                    <TrainingLibraryNewBadge v-if="isShowPosterParams && posterParams.isNew" />
                    <TrainingLibraryFavoriteButton
                      v-if="isShowPosterParams"
                      ref="refFavoriteButton"
                      :is-default-favourite="posterParams && posterParams.isFavourite"
                      :training-id="selectedRow.trainingId"
                    />
                  </div>
                </div>
              </div>
              <FormGroupHorizontalContent
                class="mt-4 poster-preview-specification text-preview-gray"
                label="Poster Language:"
              >
                <KSelect
                  v-model="specification"
                  dense
                  outlined
                  placeholder="Select language"
                  item-text="name"
                  item-value="id"
                  :items="selectedLanguages"
                  @input="callForData(true)"
                />
              </FormGroupHorizontalContent>
              <hr class="mb-2" />
              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <span class="template-preview__text--title text-preview-gray">File Name: </span>
                  <span class="template-preview__text--body">{{ fileName }}</span>
                </div>

                <VBtn
                  id="btn-preview-poster-printout-tabs"
                  class="white--text btn-util btn-download-add-in"
                  style="text-transform: none;"
                  color="#2196F3"
                  rounded
                  :style="getDownloadPosterStyle"
                  @click="handleDownloadPoster"
                >
                  <v-icon left>mdi-download</v-icon>
                  {{ labels.DownloadPoster }}
                </VBtn>
              </div>
            </div>
            <div class="max-w-100 d-flex justify-center w-100">
              <img v-if="!isPdf" class="max-w-100" :src="posterPreviewSrc" alt="Poster Preview" />
              <pdf v-else class="w-100" :src="pdfSrc" />
            </div>
          </div>
        </ElTabPane>
        <ElTabPane
          v-if="showDetails"
          :label="labels.Details"
          name="details"
          id="poster-preview-details"
        >
          <div class="training-library-preview__details-item">
            <div>
              <span class="training-library-preview__title">Poster Name: </span>
              <span class="training-library-preview__desc">{{ posterParams.name }}</span>
            </div>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Category Name: </span>
            <span class="training-library-preview__desc">{{
              posterParams.categoryName || posterParams.category
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Description: </span>
            <span class="training-library-preview__desc">{{
              posterParams.description || posterParams.trainingDescription
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Target Audience: </span>
            <span class="training-library-preview__desc">{{
              posterParams.targetAudienceName || posterParams.targetAudience
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <div>
              <span class="training-library-preview__title">Languages: </span>
            </div>
            <div class="d-flex flex-wrap gap-2 ml-2">
              <span
                v-for="lang in getLanguages"
                :key="lang"
                class="training-library-preview__tag"
                >{{ lang }}</span
              >
            </div>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Created By: </span>
            <span class="training-library-preview__desc">{{ posterParams.createdBy }}</span>
          </div>
          <div class="training-library-preview__details-item align-baseline">
            <div>
              <span class="training-library-preview__title">Compliance: </span>
            </div>
            <div class="d-flex flex-wrap gap-2 ml-2">
              <span
                v-for="(tag, tIndex) in posterParams.complianceNames"
                :key="tIndex"
                class="training-library-preview__tag"
                >{{ tag }}</span
              >
            </div>
          </div>
          <div class="training-library-preview__details-item align-baseline">
            <div>
              <span class="training-library-preview__title">Tags: </span>
            </div>
            <div class="d-flex flex-wrap gap-2 ml-2">
              <span
                v-for="tag in posterParams.tagNames"
                :key="tag"
                class="training-library-preview__tag"
                >{{ tag }}</span
              >
            </div>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Behaviours: </span>
            <ul>
              <li
                v-for="(behaviour, bIndex) in posterParams.behaviourNames"
                :key="bIndex"
                class="training-library-preview__desc"
              >
                {{ behaviour }}
              </li>
            </ul>
          </div>
        </ElTabPane>
      </ElTabs>
      <div v-if="!isLoading && !showTabs" class="template-preview pt-1">
        <div class="template-preview__text">
          <div v-if="showPosterName">
            <div>
              <span class="training-library-preview__title">Poster Name: </span>
              <span class="training-library-preview__desc">{{ selectedRow.trainingName }}</span>
            </div>
          </div>
          <FormGroupHorizontalContent
            class="poster-preview-specification mt-2"
            label="Poster Language:"
          >
            <KSelect
              v-model="specification"
              dense
              outlined
              placeholder="Select specification"
              item-text="name"
              item-value="id"
              :items="selectedLanguages"
              @input="callForData(true)"
            />
          </FormGroupHorizontalContent>
          <hr class="mb-4" />
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <span class="template-preview__text--title text-preview-gray">File Name: </span>
              <span class="template-preview__text--body">{{ fileName }}</span>
            </div>
            <VBtn
              id="btn-preview-poster-printout-simple"
              class="white--text btn-util btn-download-add-in"
              color="#2196F3"
              rounded
              :style="getDownloadPosterStyle"
              @click="handleDownloadPoster"
            >
              <v-icon left>mdi-download</v-icon>
              {{ labels.DownloadPoster }}
            </VBtn>
          </div>
        </div>
        <div class="max-w-100 d-flex justify-center">
          <img v-if="!isPdf" class="max-w-100" :src="posterPreviewSrc" alt="Poster Preview" />
          <pdf v-else class="w-100" :src="pdfSrc" />
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <TrainingLibraryPreviewDialogFooter
        :show-send-button="showSendButton"
        @on-close="handleClose"
        @on-send="handleSend"
      />
    </template>
  </AppDialog>
</template>
<script>
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import AppDialog from '@/components/AppDialog.vue'
import labels from '@/model/constants/labels'
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { mapActions, mapGetters } from 'vuex'
import { emptyPosterPreviewDialogObj } from '../utils'
import TrainingLibraryNewBadge from '../TrainingLibraryCommonComponents/TrainingLibraryNewBadge.vue'
import TrainingLibraryFavoriteButton from '../TrainingLibraryCommonComponents/TrainingLibraryFavoriteButton.vue'
import TrainingLibraryPreviewDialogFooter from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryPreviewDialogFooter.vue'
export default {
  name: 'TrainingLibraryPosterPreviewDialog',
  components: {
    TrainingLibraryPreviewDialogFooter,
    TrainingLibraryFavoriteButton,
    TrainingLibraryNewBadge,
    KSelect,
    FormGroupHorizontalContent,
    AppDialog,
    DatatableLoading,
    pdf: () => import('vue-pdf')
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    showSendButton: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: labels.PosterPreview
    },
    subtitle: {
      type: String,
      default: ''
    },
    showPosterName: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'poster'
    },
    showDetails: {
      type: Boolean,
      default: true
    },
    showTabs: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: 'mdi-eye'
    },
    showFavoriteButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tab: 'preview',
      specification: '',
      selectedLanguages: [],
      isLoading: false,
      labels,
      posterParams: {},
      posterPreviewSrc: '',
      fileName: '',
      isPdf: true,
      pdfSrc: null,
      isDownloadButtonDisabled: false
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages',
      getPosterPreviewDialog: 'trainingLibrary/getPosterPreviewDialog',
      getSelectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent'
    }),
    isShowPosterParams() {
      return Object.keys(this.posterParams).length > 0
    },
    getDownloadPosterStyle() {
      const style = {
        textTransform: 'none'
      }
      if (this.isDownloadButtonDisabled) {
        style.opacity = '.7'
        style.pointerEvents = 'none'
      }
      return style
    },
    getLanguages() {
      return this.selectedLanguages.map((language) => language.code)
    }
  },
  created() {
    this.selectedLanguages = this.selectedRow.languages.reduce((acc, lang) => {
      const selectedLanguage = this.languages.find((language) => language.code === lang)
      if (selectedLanguage) acc.push(selectedLanguage)
      return acc
    }, [])
    this.specification = this.selectedLanguages[0].id
    this.callForData()
    this.callForPoster()
  },
  methods: {
    ...mapActions({
      setPosterPreviewDialog: 'trainingLibrary/setPosterPreviewDialog',
      setPosterSendModal: 'trainingLibrary/setPosterSendModal',
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary'
    }),
    callForData() {
      this.isLoading = true
      this.pdfSrc = ''
      AwarenessEducatorService.getTrainingUrlForPreview(
        this.selectedRow?.trainingId || this.selectedRow?.detailTrainingId,
        this.specification
      )
        .then((response) => {
          const splittedUrl = response?.data?.data?.trainingUrl.split('/')
          this.fileName = splittedUrl[splittedUrl.length - 1]
          this.isPdf = this.fileName.includes('.pdf')
          this.posterPreviewSrc = response?.data?.data?.trainingUrl
          if (this.isPdf) this.handleDownloadPoster()
        })
        .finally(() => {
          if (this.isPdf) return
          this.isLoading = false
        })
    },
    callForPoster() {
      AwarenessEducatorService.getTraining(
        this.selectedRow?.trainingId || this.selectedRow?.detailTrainingId
      ).then((response) => {
        this.posterParams = response?.data?.data
      })
    },
    handleClose() {
      if (
        this?.$refs?.refFavoriteButton?.isFavourite !== this?.posterParams?.isFavourite &&
        this.showFavoriteButton
      ) {
        this.callForTrainingLibrary()
      }
      this.setPosterPreviewDialog(emptyPosterPreviewDialogObj)
      this.$emit('close')
    },
    handleDownloadPoster() {
      if (this.isPdf && this.pdfSrc) {
        return this.downloadPDFObject(this.pdfSrc)
      }
      this.isDownloadButtonDisabled = true
      AwarenessEducatorService.downloadPoster({
        trainingId: this.selectedRow?.trainingId || this.selectedRow?.detailTrainingId,
        languageId: this.specification
      })
        .then((response) => {
          if (this.isPdf) {
            this.pdfSrc = window.URL.createObjectURL(response.data)
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
    handleSend() {
      this.setPosterSendModal({
        selectedRow: this.selectedRow,
        status: true
      })
      this.handleClose()
    }
  }
}
</script>
