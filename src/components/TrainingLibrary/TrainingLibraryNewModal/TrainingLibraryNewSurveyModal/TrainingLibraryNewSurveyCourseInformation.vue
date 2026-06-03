<template>
  <v-form ref="refForm">
    <FormGroup has-hint :title="labels.SurveyName">
      <InputEntityName
        v-model.trim="formData.name"
        id="input--new-training-survey-name"
        entity-name="Survey name"
        initial-placeholder="Enter a name"
      />
    </FormGroup>
    <InputSelectCategories v-model="formData.category" :items="getCategories" />
    <InputTrainingLevel
      v-model="formData.level"
      :items="getLevels"
      :required="false"
      sub-title="Select the level of knowledge required for this survey"
      placeholder="Select survey level"
    />
    <InputTrainingDuration
      v-model="formData.duration"
      :items="getDurations"
      :required="false"
      sub-title="Select the estimated time it takes to complete the survey"
      placeholder="Select survey duration"
    />
    <InputCompliance v-model="formData.compliances" />
    <InputBehaviour v-model="formData.behaviours" />
    <InputSelectRoles
      v-model="formData.roleIds"
      :items="getTargetAudiences"
      @blur="handleRolesBlur"
      item-text="text"
      item-value="value"
      sub-title="Select intended role for this survey"
    />
    <FormGroup
      has-hint
      :title="labels.Description"
      :sub-title="labels.DescriptionSurveySub"
    >
      <InputAIDescription
        v-model.trim="formData.description"
        id="input--new-training-survey-description"
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
        tooltip-message="To generate an AI-powered description, complete key fields like Survey Name, Category, and Role."
        @generate="handleGenerate"
        @generating-changed="$emit('generating-changed', $event)"
      />
    </FormGroup>
    <FormGroup :title="labels.Tags" :sub-title="labels.TagSurveySub">
      <InputTag
        v-model="formData.tags"
        ref="refTags"
        id="input--action-tags-new-training-survey-course-information"
        :items="[]"
      />
    </FormGroup>
    <TrainingLibraryCoverImageField
      id="input--new-training-survey-image"
      :title="labels.CoverImage"
      :subtitle="labels.UploadCoverImageForTheSurvey"
      v-model="formData.coverImage"
      :cover-image-url="formData.coverImageUrl"
      @update:cover-image-url="formData.coverImageUrl = $event"
    />
    <MakeAvailableFor
      v-model="formData.availableForRequests"
      ref="refMakeAvailableFor"
      open-direction="above"
      sub-title="Companies that will see this survey in their libraries"
      :selectedCompaniesAndGroups="selectedCompaniesAndGroups"
    />
  </v-form>
</template>

<script>
import FormGroup from "@/components/SmallComponents/FormGroup";
import InputEntityName from "@/components/Common/Inputs/InputEntityName";
import labels from "@/model/constants/labels";
import InputTag from "@/components/Common/Inputs/InputTag";
import MakeAvailableFor from "@/components/Common/MakeAvailableFor/MakeAvailableFor";
import * as Validations from "@/utils/validations";
import { scrollToComponent } from "@/utils/functions";
import { mapGetters } from "vuex";
import InputCompliance from "@/components/Common/Inputs/InputCompliance.vue";
import InputBehaviour from "@/components/Common/Inputs/InputBehaviour.vue";
import InputAIDescription from "@/components/Common/Inputs/InputAIDescription";
import useAIDescriptionGeneration from "@/hooks/useAIDescriptionGeneration";
import InputSelectRoles from "@/components/Common/Inputs/InputSelectRoles.vue";
import InputSelectCategories from "@/components/Common/Inputs/InputSelectCategories.vue";
import InputTrainingLevel from "@/components/Common/Inputs/InputTrainingLevel.vue";
import InputTrainingDuration from "@/components/Common/Inputs/InputTrainingDuration.vue";
import TrainingLibraryCoverImageField from "@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryCoverImageField.vue";
import {
  getTrainingCategoryDisplayText,
  getTrainingCategoryValues
} from "@/components/TrainingLibrary/trainingCategoryUtils";
export default {
  name: "TrainingLibraryNewSurveyCourseInformation",
  mixins: [useAIDescriptionGeneration],
  components: {
    TrainingLibraryCoverImageField,
    InputTrainingDuration,
    InputTrainingLevel,
    InputBehaviour,
    InputCompliance,
    MakeAvailableFor,
    InputTag,
    InputAIDescription,
    InputEntityName,
    FormGroup,
    InputSelectRoles,
    InputSelectCategories
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
      isGenerateLoading: false,
      hasGenerated: false,
      hasGenerationError: false,
      formData: {
        coverImage: null,
        compliances: [],
        level: "",
        duration: "",
        name: "",
        description: "",
        category: [],
        roleIds: [],
        behaviours: [],
        tags: [],
        availableForRequests: [],
        coverImageUrl: null
      }
    };
  },
  computed: {
    ...mapGetters({
      getCategories: "trainingLibraryHelpers/getCategories",
      getTargetAudiences: "trainingLibraryHelpers/getTargetAudiences",
      getLevels: "trainingLibraryHelpers/getLevels",
      getDurations: "trainingLibraryHelpers/getDurations"
    }),
    selectedCategoryText() {
      return getTrainingCategoryDisplayText(
        this.formData.category,
        this.getCategories
      );
    },
    // Auto-generation now fires on the Roles select blur (see handleRolesBlur) so every
    // selected role is captured and we don't trigger on the first selected role. Returning
    // false disables the mixin's reactive watcher.
    canAutoGenerateDescription() {
      return false;
    },
    isGenerateDisabled() {
      // If description has more than 5 characters, enable button
      if (
        this.formData.description &&
        this.formData.description.trim().length > 5
      ) {
        return this.isGenerateLoading;
      }
      // Otherwise check required fields
      return (
        !this.formData.name ||
        !this.formData.category?.length ||
        !this.formData.roleIds?.length ||
        this.isGenerateLoading
      );
    }
  },
  methods: {
    validateForm() {
      const { refForm } = this.$refs;
      if (refForm.validate()) {
        return true;
      } else {
        this.$nextTick(() => {
          const el = refForm.$el.querySelector(".error--text");
          scrollToComponent(el);
        });
      }
      return false;
    },
    setFormData(formData = {}) {
      if (formData.coverImage) {
        this.formData.coverImageUrl = formData.coverImage.imageUrl;
      }
      this.formData = {
        ...this.formData,
        ...formData,
        category: getTrainingCategoryValues(formData, this.getCategories)
      };
    },
    setMakeAvailableForData(availableForList = []) {
      if (this?.$refs?.refMakeAvailableFor && availableForList?.length) {
        const availableForListFromBackend = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
          availableForList
        );
        if (availableForListFromBackend.length) {
          this.formData.availableForRequests = availableForListFromBackend;
        } else {
          this.formData.availableForRequests = [
            {
              id: "MyCompanyOnly",
              label: "My company only",
              type: "MyCompanyOnly",
              resourceId: null
            }
          ];
        }
      } else {
        this.formData.availableForRequests = [
          {
            id: "MyCompanyOnly",
            label: "My company only",
            type: "MyCompanyOnly",
            resourceId: null
          }
        ];
      }
    },
    handleRolesBlur() {
      // Trigger auto-generation once the user has finished selecting roles
      if (
        this.formData?.name &&
        this.formData?.category?.length &&
        this.formData?.roleIds?.length &&
        !this.formData?.description &&
        !this.isGenerateLoading &&
        !this.hasGenerated &&
        !this.hasGenerationError
      ) {
        this.handleGenerate();
      }
    },
    async handleGenerate() {
      if (this.isGenerateDisabled || this.isGenerateLoading) {
        return;
      }
      this.isGenerateLoading = true;
      this.hasGenerationError = false;

      try {
        const generatedDescription = await this.generateAIDescription({
          name: this.formData.name,
          category: this.selectedCategoryText,
          roleIds: this.formData.roleIds,
          description: this.formData.description
        });

        if (generatedDescription) {
          this.formData.description = generatedDescription;
          this.hasGenerated = true;
        } else {
          this.formData.description = `This survey is designed for ${
            this.formData.roleIds?.length ? "selected roles" : "users"
          }.`;
          this.hasGenerated = false;
        }
      } catch (error) {
        console.error("Failed to generate AI description:", error);
        this.hasGenerationError = true;
        this.formData.description = `This survey is designed for ${
          this.formData.roleIds?.length ? "selected roles" : "users"
        }.`;
      } finally {
        this.isGenerateLoading = false;
      }
    }
  }
};
</script>
