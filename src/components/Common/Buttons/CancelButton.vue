<template>
  <v-btn v-bind="$attrs" v-on="$listeners" class="fw-600" outlined rounded color="error">{{
    labels.Cancel
  }}</v-btn>
</template>

<script>
import labels from '@/model/constants/labels'
export default {
  name: 'CancelButton',
  data() {
    return {
      labels
    }
  }
}
</script>
