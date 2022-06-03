<template>
  <v-btn
    v-bind="$attrs"
    v-on="$listeners"
    class="fw-600"
    style="color: white;"
    rounded
    color="#2196f3"
  >
    {{ labels.Next }}
  </v-btn>
</template>

<script>
import labels from '@/model/constants/labels'
export default {
  name: 'NextButton',
  data() {
    return {
      labels
    }
  }
}
</script>
