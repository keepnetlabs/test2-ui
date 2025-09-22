<template>
  <div>
    <FormGroup
      v-if="canSaveVendor"
      has-hint
      :title="labels.TrainingVendor"
      :sub-title="labels.TrainingVendorSub"
    >
      <KSelect
        v-model.trim="formData.vendorId"
        persistent-hint
        dense
        outlined
        autocomplete="off"
        item-text="text"
        item-value="value"
        hint="*Required"
        placeholder="Select training vendor"
        :rules="[(v) => Validations.required(v, labels.Required)]"
        :items="getTrainingVendors"
      />
    </FormGroup>
    <FormGroup :title="labels.Content" :sub-title="labels.SurveyContentSub">
      <div v-for="index in formData.contentByLanguage.length" :key="index">
        <NewTrainingContentByLanguage
          v-model="formData.contentByLanguage[index - 1]"
          :class="['mb-4', index > 0 && 'mt-6']"
          :language-items="languages"
          :training-resource-id="resourceId"
          :is-removable="formData.contentByLanguage.length > 1"
          :is-uploading="isUploading"
          :file-previews="formData.contentByLanguage[index - 1].filePreviews"
          :type-with-display-name="formData.contentByLanguage[index - 1].typeWithDisplayName"
          :vendor-id="formData.vendorId"
          :can-save-vendor="canSaveVendor"
          @on-remove="handleRemove(index - 1)"
        />
      </div>
      <div
        v-if="isRenderAddLanguage"
        class="d-flex mt-2 ml-4 cursor-pointer"
        @click="handleAddLanguage"
      >
        <v-icon color="#2196f3">mdi-plus</v-icon>
        <div class="ml-2 new-integration__api-key__text" style="width: 150px;">
          ADD LANGUAGE
        </div>
      </div>
    </FormGroup>
  </div>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import NewTrainingContentByLanguage from '@/components/AwarenessEducator/NewTraining/NewTrainingContentByLanguage'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { mapGetters } from 'vuex'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
export default {
  name: 'TrainingLibraryNewSurveyContent',
  components: { KSelect, NewTrainingContentByLanguage, FormGroup },
  props: {
    isActionButtonDisabled: {
      type: Boolean
    },
    resourceId: {
      type: String
    },
    step: {
      type: Number
    },
    isEdit: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      Validations,
      formData: {
        type: 'SCORM12',
        hasQuiz: false,
        contentByLanguage: [],
        vendorId: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      getLanguages: 'trainingLibraryHelpers/getLanguages',
      getScormTypes: 'trainingLibraryHelpers/getScormTypes',
      getTrainingVendors: 'trainingLibraryHelpers/getTrainingVendors',
      canSaveVendor: 'trainingLibraryHelpers/getCanSaveVendor'
    }),
    isRenderAddLanguage() {
      return this?.languages?.length !== this?.formData?.contentByLanguage?.length
    },
    languages() {
      return (
        this?.getLanguages?.map((language) => ({
          text: language.name,
          value: language.id,
          isDisabled: this.formData.contentByLanguage.some(
            (content) => content.languageId === language.id
          )
        })) || []
      )
    },
    isUploading() {
      return this.formData.contentByLanguage.some((content) => content.isUploading)
    }
  },
  watch: {
    'formData.contentByLanguage': {
      immediate: true,
      handler(val) {
        if (this.step === 2) {
          if (
            val.every(
              (content) => (content.file || content?.filePreviews?.length) && content.languageId
            )
          ) {
            this.$emit('update:isActionButtonDisabled', false)
          } else {
            this.$emit('update:isActionButtonDisabled', true)
          }
        }
      }
    }
  },
  created() {
    if (!this.isEdit) this.handleAddLanguage()
  },
  methods: {
    handleAddLanguage() {
      this.formData.contentByLanguage.push({
        file: null,
        languageId: this?.languages?.find((language) => !language.isDisabled)?.value || ''
      })
    },
    setFormData(formData = {}) {
      this.formData = {
        ...this.formData,
        ...formData
      }
    },
    setTrainingContents(trainingContents = []) {
      this.formData.contentByLanguage = trainingContents.map((content) => ({
        languageId: content.languageId,
        file: null,
        filePreviews: [{ name: content.name, size: content.size }],
        typeWithDisplayName: content.typeWithDisplayName,
        isDeleteable: !content.isDeleteable,
        warningMessage: content.warningMessage
      }))
    },
    handleRemove(index) {
      if (
        this?.formData.contentByLanguage[index]?.file ||
        this?.formData?.contentByLanguage[index]?.filePreviews?.length
      ) {
        AwarenessEducatorService.deleteTrainingFile(
          this.resourceId,
          this.formData.contentByLanguage[index].languageId
        ).then(() => {
          this.formData.contentByLanguage.splice(index, 1)
        })
      } else {
        this.formData.contentByLanguage.splice(index, 1)
      }
    }
  }
}
</script>
