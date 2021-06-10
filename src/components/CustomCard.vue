<template>
  <div>
    <v-btn>
      {{ title }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
