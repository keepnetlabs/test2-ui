<template>
  <FormGroup :title="title" :sub-title="subtitle">
    <KFileUpload
      ref="refCoverImageUpload"
      :id="id"
      :class="[
        'training-library-cover-image-field__upload',
        'mb-2',
        { 'training-library-cover-image-field__upload--error': hasError }
      ]"
      show-image-preview
      :hint="displayHint"
      :extensions="['jpg', 'png']"
      :size="2"
      :show-file-size="false"
      :file-previews="filePreviews"
      :has-error="false"
      :error-text="''"
      @inputFile="handleInputFile"
      @on-clear="handleClear"
    />
  </FormGroup>
</template>

<script>
import FormGroup from "@/components/SmallComponents/FormGroup";
import KFileUpload from "@/components/Common/FileUpload/FileUpload";

const DEFAULT_ERROR = {
  min: "The image must be at least 320 x 320 px.",
  ratio: "The image must have a 1:1 (square) aspect ratio.",
  max: "The maximum allowed size is 1024 x 1024 px.",
  invalid: "The selected file could not be validated. Please try a different image."
};

export default {
  name: "TrainingLibraryCoverImageField",
  components: {
    FormGroup,
    KFileUpload
  },
  props: {
    id: {
      type: String,
      default: "input--training-library-cover-image"
    },
    title: {
      type: String,
      default: "Cover Image"
    },
    subtitle: {
      type: String,
      default: ""
    },
    hint: {
      type: String,
      default: "1:1 format - 320-1024 px - JPG or PNG - Max 2 MB"
    },
    coverImageUrl: {
      type: String,
      default: ""
    },
    coverImageName: {
      type: String,
      default: "Cover Image"
    },
    value: {
      type: [File, Object, String],
      default: null
    }
  },
  data() {
    return {
      hasError: false,
      errorText: "",
      keepErrorOnNextClear: false,
      suppressNextEmptyInputEvent: false
    };
  },
  computed: {
    displayHint() {
      return this.hasError ? this.errorText : this.hint;
    },
    filePreviews() {
      if (!this.coverImageUrl) return [];
      return [
        {
          url: this.coverImageUrl,
          name: this.coverImageName
        }
      ];
    }
  },
  methods: {
    setError(errorText) {
      this.hasError = true;
      this.errorText = errorText;
      this.$emit("validation-state-change", false);
    },
    clearError() {
      this.hasError = false;
      this.errorText = "";
      this.$emit("validation-state-change", true);
    },
    clearUploadField() {
      if (this.$refs.refCoverImageUpload) {
        this.keepErrorOnNextClear = true;
        this.suppressNextEmptyInputEvent = true;
        this.$refs.refCoverImageUpload.clear();
      }
    },
    handleClear() {
      if (this.keepErrorOnNextClear) {
        this.keepErrorOnNextClear = false;
      } else {
        this.clearError();
      }
      this.$emit("input", "");
      this.$emit("update:coverImageUrl", "");
    },
    async handleInputFile(file) {
      if (
        this.suppressNextEmptyInputEvent &&
        ((!file && file !== 0) || (Array.isArray(file) && file.length === 0))
      ) {
        this.suppressNextEmptyInputEvent = false;
        return;
      }
      if (Array.isArray(file) && file.length === 0) {
        this.handleClear();
        return;
      }
      if (!file) {
        this.handleClear();
        return;
      }

      try {
        const imageMeta = await this.getImageMeta(file);

        if (imageMeta.width < 320 || imageMeta.height < 320) {
          this.setError(DEFAULT_ERROR.min);
          this.clearUploadField();
          return;
        }
        if (imageMeta.width > 1024 || imageMeta.height > 1024) {
          this.setError(DEFAULT_ERROR.max);
          this.clearUploadField();
          return;
        }
        if (imageMeta.width !== imageMeta.height) {
          this.setError(DEFAULT_ERROR.ratio);
          this.clearUploadField();
          return;
        }

        this.clearError();
        this.$emit("input", file);
        this.$emit("update:coverImageUrl", "");
      } catch (error) {
        this.setError(DEFAULT_ERROR.invalid);
        this.clearUploadField();
      }
    },
    getImageMeta(file) {
      return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight
          });
          URL.revokeObjectURL(objectUrl);
        };
        image.onerror = () => {
          reject(new Error("Invalid image"));
          URL.revokeObjectURL(objectUrl);
        };
        image.src = objectUrl;
      });
    }
  }
};
</script>

