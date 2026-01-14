<template>
  <v-form ref="refForm">
    <FormGroup has-hint :title="labels.InfoGraphicName">
      <InputEntityName
        v-model.trim="formData.name"
        id="input--new-training-training-name"
        entity-name="Infographic name"
        initial-placeholder="Enter a name"
      />
    </FormGroup>
    <FormGroup has-hint :title="labels.Category">
      <KSelect
        v-model.trim="formData.category"
        persistent-hint
        dense
        outlined
        autocomplete="off"
        item-text="text"
        item-value="value"
        hint="*Required"
        placeholder="Select category"
        :rules="[(v) => Validations.required(v, labels.Required)]"
        :items="getCategories"
      ></KSelect>
    </FormGroup>
    <InputCompliance v-model="formData.compliances" />
    <InputBehaviour v-model="formData.behaviours" />
    <InputSelectRoles
      v-model="formData.roleIds"
      :items="getTargetAudiences"
      item-text="text"
      item-value="value"
      sub-title="Select intended role for this infographic"
    />
    <FormGroup has-hint :title="labels.Description" :sub-title="labels.DescriptionInfographicSub">
      <InputAIDescription
        v-model.trim="formData.description"
        id="input--new-training-training-description"
        rows="2"
        height="100"
        hint="AI needs a few words to create a meaningful description."
        required
        :max-length="300"
        :initial-placeholder="labels.Description"
        :rules="[(v) => Validations.required(v, labels.Required)]"
        :show-generated-by-ai="hasGenerated"
        :is-generating="isGenerateLoading"
        :show-generate-button="true"
        :has-generated="hasGenerated"
        :is-generate-disabled="isGenerateDisabled"
        tooltip-message="To generate an AI-powered description, complete key fields like Infographic Name, Category, and Role."
        @generate="handleGenerate"
        @generating-changed="$emit('generating-changed', $event)"
      />
    </FormGroup>
    <FormGroup :title="labels.Tags" :sub-title="labels.TagInfographicSub">
      <InputTag
        v-model="formData.tags"
        ref="refTags"
        id="input--action-tags-new-training-course-information"
        :items="[]"
      />
    </FormGroup>
    <FormGroup :title="labels.CoverImage" :sub-title="labels.UploadCoverImageForTheInfographic">
      <KFileUpload
        ref="refCoverImageFileUpload"
        id="input--new-training-image"
        class="mb-6"
        show-image-preview
        hint="Only jpg, png files. Max. file size 2MB"
        :extensions="['jpg', 'png']"
        :size="2"
        :show-file-size="false"
        :file-previews="coverImageFilePreview"
        @inputFile="handleCoverImageChange"
        @on-clear="handleCoverImageClear"
      />
    </FormGroup>
    <MakeAvailableFor
      v-model="formData.availableForRequests"
      ref="refMakeAvailableFor"
      open-direction="above"
      sub-title="Companies that will see this content in their libraries"
      :selectedCompaniesAndGroups="selectedCompaniesAndGroups"
    />
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import labels from '@/model/constants/labels'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputTag from '@/components/Common/Inputs/InputTag'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import * as Validations from '@/utils/validations'
import { scrollToComponent } from '@/utils/functions'
import { mapGetters } from 'vuex'
import InputCompliance from '@/components/Common/Inputs/InputCompliance.vue'
import InputBehaviour from '@/components/Common/Inputs/InputBehaviour.vue'
import InputAIDescription from '@/components/Common/Inputs/InputAIDescription'
import useAIDescriptionGeneration from '@/hooks/useAIDescriptionGeneration'
import InputSelectRoles from '@/components/Common/Inputs/InputSelectRoles.vue'
export default {
  name: 'TrainingLibraryNewInfographicInformation',
  mixins: [useAIDescriptionGeneration],
  components: {
    InputBehaviour,
    InputCompliance,
    MakeAvailableFor,
    KFileUpload,
    InputTag,
    KSelect,
    InputAIDescription,
    InputEntityName,
    FormGroup,
    InputSelectRoles
  },
  props: {
    selectedCompaniesAndGroups: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Validations,
      labels,
      coverImageFilePreview: [],
      isGenerateLoading: false,
      hasGenerated: false,
      hasGenerationError: false,
      formData: {
        coverImage: null,
        name: '',
        description: '',
        category: '',
        roleIds: [],
        compliances: [],
        behaviours: [],
        tags: [],
        availableForRequests: [],
        coverImageUrl: null
      }
    }
  },
  computed: {
    ...mapGetters({
      getCategories: 'trainingLibraryHelpers/getCategories',
      getTargetAudiences: 'trainingLibraryHelpers/getTargetAudiences'
    }),
    canAutoGenerateDescription() {
      return (
        this.formData?.name &&
        this.formData?.category &&
        this.formData?.roleIds?.length &&
        !this.formData?.description &&
        !this.isGenerateLoading &&
        !this.hasGenerated &&
        !this.hasGenerationError
      )
    },
    isGenerateDisabled() {
      // If description has more than 5 characters, enable button
      if (this.formData.description && this.formData.description.trim().length > 5) {
        return this.isGenerateLoading
      }
      // Otherwise check required fields
      return (
        !this.formData.name ||
        !this.formData.category ||
        !this.formData.roleIds?.length ||
        this.isGenerateLoading
      )
    }
  },
  methods: {
    handleCoverImageChange(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formData.coverImage = null
        return
      }
      this.formData.coverImage = file
    },
    validateForm() {
      const { refForm } = this.$refs
      if (refForm.validate()) {
        return true
      } else {
        this.$nextTick(() => {
          const el = refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
      return false
    },
    setFormData(formData = {}) {
      if (formData.coverImage) {
        this.coverImageFilePreview = [
          {
            url: formData.coverImage.imageUrl,
            name: formData.coverImage.name || 'Cover Image'
          }
        ]
        this.formData.coverImageUrl = formData.coverImage.imageUrl
      }
      this.formData = {
        ...this.formData,
        ...formData
      }
    },
    handleCoverImageClear() {
      this.coverImageFilePreview = []
      this.formData.coverImage = ''
      this.formData.coverImageUrl = ''
    },
    setMakeAvailableForData(availableForList = []) {
      if (this?.$refs?.refMakeAvailableFor && availableForList?.length) {
        const availableForListFromBackend = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
          availableForList
        )
        if (!availableForListFromBackend.length) {
          this.formData.availableForRequests = [
            {
              id: 'MyCompanyOnly',
              label: 'My company only',
              type: 'MyCompanyOnly',
              resourceId: null
            }
          ]
        } else {
          this.formData.availableForRequests = availableForListFromBackend
        }
      } else {
        this.formData.availableForRequests = [
          {
            id: 'MyCompanyOnly',
            label: 'My company only',
            type: 'MyCompanyOnly',
            resourceId: null
          }
        ]
      }
    },
    async handleGenerate() {
      if (this.isGenerateDisabled || this.isGenerateLoading) {
        return
      }
      this.isGenerateLoading = true
      this.hasGenerationError = false

      try {
        const generatedDescription = await this.generateAIDescription({
          name: this.formData.name,
          category: this.formData.category,
          roleIds: this.formData.roleIds,
          description: this.formData.description
        })

        if (generatedDescription) {
          this.formData.description = generatedDescription
          this.hasGenerated = true
        } else {
          this.formData.description = `This infographic content is designed for ${
            this.formData.roleIds?.length ? 'selected roles' : 'users'
          }.`
          this.hasGenerated = false
        }
      } catch (error) {
        console.error('Failed to generate AI description:', error)
        this.hasGenerationError = true
        this.formData.description = `This infographic content is designed for ${
          this.formData.roleIds?.length ? 'selected roles' : 'users'
        }.`
      } finally {
        this.isGenerateLoading = false
      }
    }
  }
}
</script>
