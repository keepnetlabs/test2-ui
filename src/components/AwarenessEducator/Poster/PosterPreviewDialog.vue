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
                <div>
                  <span class="template-preview__text--title">Poster Name: </span>
                  <span class="template-preview__text--body">{{ selectedRow.trainingName }}</span>
                </div>
              </div>
              <FormGroupHorizontalContent
                class="mt-4 poster-preview-specification"
                label="Specifications:"
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
              <div class="d-flex justify-space-between align-center">
                <div>
                  <span class="template-preview__text--title">File Name: </span>
                  <span class="template-preview__text--body">{{ posterParams.fileName }}</span>
                </div>

                <VBtn
                  id="btn-preview-indiviual-printout"
                  class="white--text btn-util btn-download-add-in"
                  color="#2196F3"
                  rounded
                  @click="handleDownloadPoster"
                >
                  <v-icon left>mdi-download</v-icon>
                  {{ labels.DownloadPoster }}
                </VBtn>
              </div>
            </div>
            <hr class="mt-4" />
            <div class="max-w-100 d-flex justify-center">
              <img class="max-w-100" :src="posterPreviewSrc" alt="Poster Preview" />
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
            <span class="training-library-preview__title">Poster Name: </span>
            <span class="training-library-preview__desc">{{ posterParams.name }}</span>
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
            <span class="training-library-preview__title">Languages: </span>
            <span class="training-library-preview__desc">{{ getLanguages }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Created By: </span>
            <span class="training-library-preview__desc">{{ posterParams.createdBy }}</span>
          </div>
          <div class="training-library-preview__details-item align-baseline">
            <div>
              <span class="training-library-preview__title">Tags: </span>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="tag in posterParams.tagNames"
                :key="tag"
                class="training-library-preview__tag"
                >{{ tag }}</span
              >
            </div>
          </div>
        </ElTabPane>
      </ElTabs>
      <div v-if="!isLoading && !showTabs" class="template-preview pt-1">
        <div class="template-preview__text">
          <div v-if="showPosterName">
            <div>
              <span class="template-preview__text--title">Poster Name: </span>
              <span class="template-preview__text--body">{{ selectedRow.trainingName }}</span>
            </div>
          </div>
          <FormGroupHorizontalContent class="poster-preview-specification" label="Specifications:">
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
          <div class="d-flex justify-space-between align-center">
            <div>
              <span class="template-preview__text--title">File Name: </span>
              <span class="template-preview__text--body">{{ posterParams.fileName }}</span>
            </div>

            <VBtn
              id="btn-preview-indiviual-printout"
              class="white--text btn-util btn-download-add-in"
              color="#2196F3"
              rounded
              @click="handleDownloadPoster"
            >
              <v-icon left>mdi-download</v-icon>
              {{ labels.DownloadPoster }}
            </VBtn>
          </div>
        </div>
        <hr class="mt-4" />
        <div class="max-w-100 d-flex justify-center">
          <img class="max-w-100" :src="posterPreviewSrc" alt="Poster Preview" />
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose id="btn-close--scenario-preview" @on-close="handleClose" />
    </template>
  </AppDialog>
</template>
<script>
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import AppDialog from '@/components/AppDialog.vue'
import labels from '@/model/constants/labels'
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'PosterPreviewDialog',
  components: {
    KSelect,
    FormGroupHorizontalContent,
    AppDialog,
    DatatableLoading,
    AppDialogFooterWithClose
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
    languages: {
      type: Array
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
      posterPreviewSrc: ''
    }
  },
  computed: {
    getTitle() {
      return labels.PosterPreview
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    },
    getLanguages() {
      return this.selectedLanguages.map((language) => language.name).join(', ')
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
    callForData() {
      AwarenessEducatorService.getTrainingUrlForPreview(
        this.selectedRow.trainingId,
        this.specification
      )
        .then((response) => {
          this.posterPreviewSrc = response?.data?.data?.trainingUrl
        })
        .finally(() => {
          this.$emit('update:isLoading', false)
        })
    },
    callForPoster() {
      AwarenessEducatorService.getTraining(this.selectedRow.trainingId).then((response) => {
        this.posterParams = response?.data?.data
      })
    },
    handleClose() {
      this.$emit('on-close')
    },
    handleDownloadPoster() {}
  }
}
</script>
