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
              <div v-if="showInfographicName">
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <span class="template-preview__text--title text-preview-gray"
                      >Infographic Name:
                    </span>
                    <span class="template-preview__text--body ml-2">{{
                      selectedRow && selectedRow.trainingName
                    }}</span>
                  </div>
                  <div v-if="showFavoriteButton" class="d-flex align-center gap-2">
                    <TrainingLibraryNewBadge
                      v-if="isShowInfographicParams && infographicParams.isNew"
                    />
                    <TrainingLibraryFavoriteButton
                      v-if="isShowInfographicParams"
                      ref="refFavoriteButton"
                      :is-default-favourite="infographicParams.isFavourite"
                      :training-id="selectedRow.trainingId"
                    />
                  </div>
                </div>
              </div>
              <FormGroupHorizontalContent
                class="mt-4 poster-preview-specification text-preview-gray"
                label="Infographic Language:"
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
              <hr class="mb-2" />
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
                  :style="getDownloadInfographicStyle"
                  @click="handleDownloadInfographic"
                >
                  <v-icon left>mdi-download</v-icon>
                  {{ labels.DownloadInfographic }}
                </VBtn>
              </div>
            </div>
            <div class="max-w-100 d-flex justify-center w-100">
              <img
                v-if="!isPdf"
                class="max-w-100"
                :src="infographicPreviewSrc"
                alt="Infographic Preview"
              />
              <pdf v-else class="w-100" :src="pdfSrc" />
            </div>
          </div>
        </ElTabPane>
        <ElTabPane
          v-if="showDetails"
          :label="labels.Details"
          name="details"
          id="infographic-preview-details"
        >
          <div class="training-library-preview__details-item">
            <div>
              <span class="training-library-preview__title">Infographic Name: </span>
              <span class="training-library-preview__desc">{{ infographicParams.name }}</span>
            </div>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Vendor Name: </span>
            <span class="training-library-preview__desc">{{ infographicParams.vendorName }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Category Name: </span>
            <span class="training-library-preview__desc">{{
              infographicParams.categoryName || infographicParams.category
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Description: </span>
            <span class="training-library-preview__desc">{{
              infographicParams.description || infographicParams.trainingDescription
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Target Audience: </span>
            <span class="training-library-preview__desc">{{
              infographicParams.targetAudienceName || infographicParams.targetAudience
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
            <span class="training-library-preview__desc">{{ infographicParams.createdBy }}</span>
          </div>
          <div class="training-library-preview__details-item align-baseline">
            <div>
              <span class="training-library-preview__title">Compliances: </span>
            </div>
            <div class="d-flex flex-wrap gap-2 ml-2">
              <span
                v-for="(tag, tIndex) in infographicParams.complianceNames"
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
                v-for="tag in infographicParams.tagNames"
                :key="tag"
                class="training-library-preview__tag"
                >{{ tag }}</span
              >
            </div>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Behaviours: </span>
            <ul>
              <li v-for="(behaviour, bIndex) in infographicParams.behaviourNames" :key="bIndex">
                {{ behaviour }}
              </li>
            </ul>
          </div>
        </ElTabPane>
      </ElTabs>
      <div v-if="!isLoading && !showTabs" class="template-preview pt-1">
        <div class="template-preview__text">
          <div v-if="showInfographicName">
            <div>
              <span class="training-library-preview__title">Infographic Name: </span>
              <span class="training-library-preview__desc">{{ selectedRow.trainingName }}</span>
            </div>
          </div>
          <FormGroupHorizontalContent
            class="poster-preview-specification mt-2"
            label="Infographic Language:"
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
          <hr class="mb-4" />
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <span class="template-preview__text--title text-preview-gray">File Name: </span>
              <span class="template-preview__text--body">{{ fileName }}</span>
            </div>
            <VBtn
              id="btn-preview-indiviual-printout"
              class="white--text btn-util btn-download-add-in"
              color="#2196F3"
              rounded
              :style="getDownloadInfographicStyle"
              @click="handleDownloadInfographic"
            >
              <v-icon left>mdi-download</v-icon>
              {{ labels.DownloadInfographic }}
            </VBtn>
          </div>
        </div>
        <div class="max-w-100 d-flex justify-center">
          <img
            v-if="!isPdf"
            class="max-w-100"
            :src="infographicPreviewSrc"
            alt="Infographic Preview"
          />
          <pdf v-else class="w-100" :src="pdfSrc" />
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <TrainingLibraryPreviewDialogFooter
        :show-send-button="getInfographicPreviewDialog.showSendButton"
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
import { emptyInfographicPreviewDialogObj } from '../utils'
import TrainingLibraryNewBadge from '../TrainingLibraryCommonComponents/TrainingLibraryNewBadge.vue'
import TrainingLibraryFavoriteButton from '../TrainingLibraryCommonComponents/TrainingLibraryFavoriteButton.vue'
import TrainingLibraryPreviewDialogFooter from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryPreviewDialogFooter.vue'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'TrainingLibraryInfographicPreviewDialog',
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
    title: {
      type: String,
      default: labels.InfographicPreview
    },
    subtitle: {
      type: String,
      default: ''
    },
    showInfographicName: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'infographic'
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
      infographicParams: {},
      infographicPreviewSrc: '',
      fileName: '',
      isPdf: true,
      pdfSrc: null,
      isDownloadButtonDisabled: false
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages',
      getInfographicPreviewDialog: 'trainingLibrary/getInfographicPreviewDialog',
      getSelectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent'
    }),
    isShowInfographicParams() {
      return Object.keys(this.infographicParams).length > 0
    },
    getDownloadInfographicStyle() {
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
    console.log('this.languages', this.languages)
    this.selectedLanguages = this.selectedRow.languages.reduce((acc, lang) => {
      const selectedLanguage = this.languages.find((language) => language.code === lang)
      if (selectedLanguage) acc.push(selectedLanguage)
      return acc
    }, [])
    this.specification = this.selectedLanguages[0].id
    this.callForData()
    this.callForInfographic()
  },
  methods: {
    ...mapActions({
      setInfographicPreviewDialog: 'trainingLibrary/setInfographicPreviewDialog',
      setInfographicSendModal: 'trainingLibrary/setInfographicSendModal',
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary'
    }),
    callForData() {
      this.isLoading = true
      this.pdfSrc = ''
      AwarenessEducatorService.getTrainingUrlForPreview(
        this.selectedRow.trainingId,
        this.specification
      )
        .then((response) => {
          const splittedUrl = response?.data?.data?.trainingUrl.split('/')
          this.fileName = splittedUrl[splittedUrl.length - 1]
          this.isPdf = this.fileName.includes('.pdf')
          this.infographicPreviewSrc = response?.data?.data?.trainingUrl
          if (this.isPdf) this.handleDownloadInfographic()
        })
        .finally(() => {
          if (this.isPdf) return
          this.isLoading = false
        })
    },
    callForInfographic() {
      AwarenessEducatorService.getTraining(this.selectedRow.trainingId).then((response) => {
        this.infographicParams = response?.data?.data
      })
    },
    handleClose() {
      if (
        this?.$refs?.refFavoriteButton?.isFavourite !== this?.infographicParams?.isFavourite &&
        this.showFavoriteButton
      ) {
        this.callForTrainingLibrary()
      }
      this.setInfographicPreviewDialog(emptyInfographicPreviewDialogObj)
    },
    handleSend() {
      this.setInfographicSendModal({
        selectedRow: this.selectedRow,
        status: true
      })
      this.handleClose()
    },
    handleDownloadInfographic() {
      if (this.isPdf && this.pdfSrc) {
        return this.downloadPDFObject(this.pdfSrc)
      }
      this.isDownloadButtonDisabled = true
      AwarenessEducatorService.downloadPoster({
        trainingId: this.selectedRow.trainingId,
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
    }
  }
}
</script>
