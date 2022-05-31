<template>
  <v-btn v-bind="$attrs" v-on="$listeners" class="fw-600" outlined rounded color="cyan">
    {{ labels.Back }}
  </v-btn>
</template>

<script>
import labels from '@/model/constants/labels'
export default {
  name: 'BackButton',
  data() {
    return {
      labels
    }
  }
}
</script>
