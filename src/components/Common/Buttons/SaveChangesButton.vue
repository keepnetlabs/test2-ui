<template>
  <v-btn
    v-bind="$attrs"
    v-on="$listeners"
    class="white--text fw-600 no-box-shadow"
    color="#2196f3"
    rounded
  >
    {{ labels.SaveChanges }}
  </v-btn>
</template>

<script>
import labels from '@/model/constants/labels'
export default {
  name: 'SaveChangesButton',
  data() {
    return {
      labels
    }
  }
}
</script>
