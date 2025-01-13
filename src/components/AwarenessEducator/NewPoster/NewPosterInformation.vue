<template>
  <v-form ref="refForm">
    <FormGroup has-hint :title="labels.PosterName">
      <InputEntityName
        v-model.trim="formData.name"
        id="input--new-training-training-name"
        entity-name="poster name"
        initial-placeholder="Enter a name"
      />
    </FormGroup>
    <FormGroup has-hint :title="labels.Description" :sub-title="labels.DescriptionPosterSub">
      <InputDescription
        v-model.trim="formData.description"
        id="input--new-training-training-description"
        required
        rows="2"
        height="100"
        :max-length="300"
        :initial-placeholder="labels.Description"
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
        :items="categories"
      ></KSelect>
    </FormGroup>
    <FormGroup has-hint :title="labels.TargetAudience" :sub-title="labels.TargetAudiencePosterSub">
      <KSelect
        v-model.trim="formData.targetAudience"
        persistent-hint
        dense
        outlined
        autocomplete="off"
        item-text="text"
        item-value="value"
        hint="*Required"
        placeholder="Select role"
        :rules="[(v) => Validations.required(v, labels.Required)]"
        :items="targetAudiences"
      ></KSelect>
    </FormGroup>
    <FormGroup :title="labels.Tags" :sub-title="labels.TagPosterSub">
      <InputTag
        v-model="formData.tags"
        ref="refTags"
        id="input--action-tags-new-training-course-information"
        :items="[]"
      />
    </FormGroup>
    <FormGroup :title="labels.CoverImage" :sub-title="labels.UploadCoverImageForThePoster">
      <KFileUpload
        ref="refCoverImageFileUpload"
        id="input--new-training-image"
        :class="[getPreviewOfCoverImage ? 'mb-2' : 'mb-6']"
        hint="Only jpg, png files. Max. file size 2MB"
        :extensions="['jpg', 'png']"
        :size="2"
        style="max-width: 205px;"
        @inputFile="handleCoverImageChange"
      />
      <v-list-item v-if="getPreviewOfCoverImage" class="px-0 mb-6">
        <v-list-item-content>
          <img
            v-if="!!getCoverImagePreview"
            class="add-in-settings__image"
            :src="getCoverImagePreview"
            alt="logo-preview"
          />
        </v-list-item-content>
      </v-list-item>
    </FormGroup>
    <MakeAvailableFor
      v-model="formData.availableForRequests"
      ref="refMakeAvailableFor"
      open-direction="above"
      sub-title="Companies that will see this content in their libraries"
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
export default {
  name: 'NewPosterInformation',
  components: {
    MakeAvailableFor,
    KFileUpload,
    InputTag,
    KSelect,
    InputDescription,
    InputEntityName,
    FormGroup
  },
  inject: {
    getCategories: {
      type: Function
    },
    getTargetAudiences: {
      type: Function
    }
  },
  data() {
    return {
      Validations,
      labels,
      formData: {
        coverImage: null,
        name: '',
        description: '',
        category: '',
        targetAudience: '',
        tags: [],
        availableForRequests: [],
        coverImageUrl: null
      }
    }
  },
  computed: {
    categories() {
      return this.getCategories()
    },
    targetAudiences() {
      return this.getTargetAudiences()
    },
    getPreviewOfCoverImage() {
      return this.formData.coverImage || this.formData.coverImageUrl
    },
    getCoverImagePreview() {
      if (Array.isArray(this.getPreviewOfCoverImage) && this.getPreviewOfCoverImage.length > 0) {
        return this.getPreviewOfCoverImage[0]
      }

      if (Array.isArray(this.getPreviewOfCoverImage) && this.getPreviewOfCoverImage.length === 0) {
        return null
      }

      if (typeof this.getPreviewOfCoverImage === 'string') {
        return this.getPreviewOfCoverImage
      }

      return URL.createObjectURL(this.getPreviewOfCoverImage)
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
      this.formData = {
        ...this.formData,
        ...formData
      }
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
    }
  }
}
</script>
