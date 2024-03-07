<template>
  <div>
    <ElTabs v-model="tab">
      <ElTabPane
        id="campaign-manager-info--training-preview-content"
        name="preview"
        :label="labels.Preview"
      >
        <div class="training-library-preview mt-4 training-library-training-preview">
          <div class="d-flex justify-space-between align-center">
            <div>
              <span class="training-library-preview__title">Training Name: </span>
              <span class="training-library-preview__desc">{{ name }}</span>
            </div>
            <div class="d-flex align-center gap-2">
              <TrainingLibraryNewBadge />
              <TrainingLibraryFavoriteButton />
            </div>
          </div>
          <FormGroupHorizontalContent
            class="mt-4 justify-start"
            style="max-width: 500px;"
            label="Training Language:"
          >
            <KSelect
              v-model="activeLanguage"
              dense
              outlined
              class="max-width-200"
              placeholder="Select Option"
              :items="languages"
              @input="callForData(true)"
            />
          </FormGroupHorizontalContent>
          <DatatableLoading v-if="isTemplateLoading" :loading="isTemplateLoading" />
          <iframe
            v-if="activeTemplate && !isTemplateLoading"
            :key="iframeKey"
            :class="['training-library-preview__player', iframeClass]"
            allowfullscreen
            title="Training Preview"
            :src="activeTemplate"
          ></iframe>
        </div>
      </ElTabPane>
      <ElTabPane
        :label="labels.Details"
        name="details"
        id="campaign-manager-info--training-details-content"
      >
        <template v-if="trainingParams">
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Training Name: </span>
            <span class="training-library-preview__desc">{{ trainingParams.name }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Vendor Name: </span>
            <span class="training-library-preview__desc">{{ trainingParams.vendor }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Category Name: </span>
            <span class="training-library-preview__desc">{{
              trainingParams.categoryName || trainingParams.category
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Description: </span>
            <span class="training-library-preview__desc">{{
              trainingParams.description || trainingParams.trainingDescription
            }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Target Audience: </span>
            <span class="training-library-preview__desc">{{
              trainingParams.targetAudienceName || trainingParams.targetAudience
            }}</span>
          </div>
          <div class="training-library-preview__details-item align-baseline">
            <div>
              <span class="training-library-preview__title">Languages: </span>
            </div>
            <div class="d-flex flex-wrap gap-2 ml-2">
              <span v-for="lang in languages" :key="lang" class="training-library-preview__tag">{{
                lang.code
              }}</span>
            </div>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Created By: </span>
            <span class="training-library-preview__desc">{{ trainingParams.createdBy }}</span>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Compliance: </span>
            <span class="training-library-preview__desc">{{ trainingParams.compliance }}</span>
          </div>
          <div class="training-library-preview__details-item align-baseline">
            <div>
              <span class="training-library-preview__title">Tags: </span>
            </div>
            <div class="d-flex flex-wrap gap-2 ml-2">
              <span
                v-for="tag in trainingParams.tagNames"
                :key="tag"
                class="training-library-preview__tag"
                >{{ tag }}</span
              >
            </div>
          </div>
          <div class="training-library-preview__details-item">
            <span class="training-library-preview__title">Behaviours: </span>
            <span class="training-library-preview__desc">{{ trainingParams.behaviours }}</span>
          </div>
        </template>
      </ElTabPane>
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
export default {
  name: 'TrainingLibraryTrainingPreview',
  components: {
    TrainingLibraryFavoriteButton,
    TrainingLibraryNewBadge,
    DatatableLoading,
    FormGroupHorizontalContent,
    KSelect
  },
  props: {
    name: {
      type: String
    },
    languages: {
      type: Array
    },
    trainingId: {
      type: String
    },
    isLoading: {
      type: Boolean
    },
    trainingParams: {
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
      tab: 'preview',
      activeLanguage: '',
      isTemplateLoading: false,
      activeTemplate: null,
      iframeKey: `key-${createRandomCryptStringNumber()}`
    }
  },
  created() {
    this.activeLanguage = this.languages?.[0]?.value
    this.callForData()
  },
  methods: {
    callForData(isTemplateLoading = false) {
      if (isTemplateLoading) this.isTemplateLoading = true
      else this.$emit('update:isLoading', true)

      AwarenessEducatorService.getTrainingUrlForPreview(this.trainingId, this.activeLanguage)
        .then((response) => {
          const {
            data: { data }
          } = response
          this.activeTemplate = `${data.scormPlayerUrl}?isPreview=true&scoAddress=${data.trainingUrl}`
          this.iframeKey = `key-${createRandomCryptStringNumber()}`
        })
        .finally(() => {
          if (isTemplateLoading) this.isTemplateLoading = false
          else this.$emit('update:isLoading', false)
        })
    }
  }
}
</script>
