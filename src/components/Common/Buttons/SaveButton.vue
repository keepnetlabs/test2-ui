<template>
  <v-btn v-bind="$attrs" v-on="$listeners" color="#2196f3" class="fw-600 white--text" rounded>
    {{ label }}
  </v-btn>
</template>

<script>
import labels from '@/model/constants/labels'
export default {
  name: 'SaveButton',
  props: {
    label: {
      type: String,
      default: labels.Save
    }
  },
  data() {
    return {
      labels
    }
  }
}
</script>
