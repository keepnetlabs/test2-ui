<template>
  <div></div>
</template>

<script>
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
export default {
  name: 'TrainingLibraryNewLearningPathContent',
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
      formData: {}
    }
  }
}
</script>
