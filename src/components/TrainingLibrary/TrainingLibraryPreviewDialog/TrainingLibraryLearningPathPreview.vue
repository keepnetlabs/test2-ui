<template>
  <div>
    <ElTabs v-model="tab">
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
              <li v-for="(behaviour, bIndex) in trainingParams.behaviourNames" :key="bIndex">
                {{ behaviour }}
              </li>
            </ul>
          </div>
        </template>
      </ElTabPane>
      <ElTabPane
        v-for="(training, index) in 1"
        id="campaign-manager-info--training-preview-content"
        name="step 1"
        :key="index"
        :label="`Step ${index + 1} ${name}`"
      >
        <ElTabs v-model="selectedTrainingTab" v-if="!isLoading" class="k-sub-tab mt-4">
          <ElTabPane name="preview" :label="labels.Preview">
            <div class="training-library-preview mt-4 training-library-training-preview">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <span class="training-library-preview__title">Training Name: </span>
                  <span class="training-library-preview__desc">{{ name }}</span>
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
            <template v-if="learningPathParams">
              <div class="training-library-preview__details-item">
                <span class="training-library-preview__title">Training Name: </span>
                <span class="training-library-preview__desc">{{ learningPathParams.name }}</span>
              </div>
              <div class="training-library-preview__details-item">
                <span class="training-library-preview__title">Vendor Name: </span>
                <span class="training-library-preview__desc">{{ learningPathParams.vendor }}</span>
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
              <div class="training-library-preview__details-item align-baseline">
                <div>
                  <span class="training-library-preview__title">Languages: </span>
                </div>
                <div class="d-flex flex-wrap gap-2 ml-2">
                  <span
                    v-for="(lang, langIndex) in languages"
                    :key="langIndex"
                    class="training-library-preview__tag"
                    >{{ lang.code }}</span
                  >
                </div>
              </div>
              <div class="training-library-preview__details-item">
                <span class="training-library-preview__title">Created By: </span>
                <span class="training-library-preview__desc">{{
                  learningPathParams.createdBy
                }}</span>
              </div>
              <div class="training-library-preview__details-item align-baseline">
                <div>
                  <span class="training-library-preview__title">Compliances: </span>
                </div>
                <div class="d-flex flex-wrap gap-2 ml-2">
                  <span
                    v-for="(tag, tIndex) in learningPathParams.complianceNames"
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
                    v-for="(tag, tagIndex) in learningPathParams.tagNames"
                    :key="tagIndex"
                    class="training-library-preview__tag"
                    >{{ tag }}</span
                  >
                </div>
              </div>
              <div class="training-library-preview__details-item">
                <span class="training-library-preview__title">Behaviours: </span>
                <span class="training-library-preview__desc">{{
                  learningPathParams.behaviours
                }}</span>
              </div>
            </template>
          </ElTabPane>
        </ElTabs>
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
  name: 'TrainingLibraryLearningPathPreview',
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
      tab: 'details',
      selectedTrainingTab: 'preview',
      activeLanguage: '',
      isTemplateLoading: false,
      activeTemplate: null,
      languages: [],
      iframeKey: `key-${createRandomCryptStringNumber()}`
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData(isTemplateLoading = false) {
      this.$emit('update:isLoading', false)
      /*
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
        else setTimeout(() => this.$emit('update:isLoading', false), 200)
      })

     */
    }
  }
}
</script>
