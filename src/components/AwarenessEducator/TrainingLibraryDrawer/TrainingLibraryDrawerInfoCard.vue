<template>
  <div class="training-library-drawer-info-card">
    <VIcon color="#757575">{{ icon }}</VIcon>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryDrawerInfoCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    text: {
      type: [String, Number],
      required: true
    }
  }
}
</script>
