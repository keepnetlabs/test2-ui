<template>
  <v-form ref="refForm">
    <FormGroup has-hint :title="labels.ScreensaverName">
      <InputEntityName
        v-model.trim="formData.name"
        id="input--new-training-training-name"
        entity-name="screensaver name"
        initial-placeholder="Enter a name"
      />
    </FormGroup>
    <FormGroup :title="labels.Description" :sub-title="labels.DescriptionScreensaverSub">
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
        :items="getCategories"
      ></KSelect>
    </FormGroup>
    <InputCompliance v-model="formData.compliances" />
    <InputBehaviour v-model="formData.behaviours" />
    <FormGroup
      has-hint
      :title="labels.TargetAudience"
      :sub-title="labels.TargetAudienceScreensaverSub"
    >
      <KSelect
        v-model.trim="formData.targetAudience"
        persistent-hint
        dense
        outlined
        autocomplete="off"
        item-text="text"
        item-value="value"
        hint="*Required"
        placeholder="Select target audience"
        :rules="[(v) => Validations.required(v, labels.Required)]"
        :items="getTargetAudiences"
      ></KSelect>
    </FormGroup>
    <FormGroup :title="labels.Tags" :sub-title="labels.TagScreensaverSub">
      <InputTag
        v-model="formData.tags"
        ref="refTags"
        id="input--action-tags-new-training-course-information"
        :items="[]"
      />
    </FormGroup>
    <FormGroup :title="labels.CoverImage" :sub-title="labels.UploadCoverImageForTheScreensaver">
      <KFileUpload
        ref="refCoverImageFileUpload"
        id="input--new-training-image"
        show-image-preview
        class="mb-6"
        hint="Only jpg, png files. Max. file size 2MB"
        :extensions="['jpg', 'png']"
        :size="2"
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
export default {
  name: 'TrainingLibraryNewScreensaverInformation',
  components: {
    InputBehaviour,
    InputCompliance,
    MakeAvailableFor,
    KFileUpload,
    InputTag,
    KSelect,
    InputDescription,
    InputEntityName,
    FormGroup
  },
  data() {
    return {
      Validations,
      labels,
      coverImageFilePreview: [],
      formData: {
        coverImage: null,
        name: '',
        description: '',
        category: '',
        targetAudience: '',
        tags: [],
        compliances: [],
        behaviours: [],
        availableForRequests: [],
        coverImageUrl: null
      }
    }
  },
  computed: {
    ...mapGetters({
      getCategories: 'trainingLibraryHelpers/getCategories',
      getTargetAudiences: 'trainingLibraryHelpers/getTargetAudiences'
    })
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
      if (formData.coverImageUrl) {
        this.coverImageFilePreview = [
          {
            url: formData.coverImageUrl,
            name: formData.coverImageName || 'Cover Image',
            size: formData.coverImageSize || 0
          }
        ]
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
    }
  }
}
</script>
