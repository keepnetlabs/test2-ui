<template>
  <div class="training-library-drawer-info-card">
    <VTooltip v-if="tooltip" bottom>
      <template #activator="{ on }">
        <div class="training-library-drawer-info-card__content" v-on="on">
          <VIcon color="#757575">{{ icon }}</VIcon>
          <span>{{ text }}</span>
        </div>
      </template>
      <span>{{ tooltip }}</span>
    </VTooltip>
    <div v-else class="training-library-drawer-info-card__content">
      <VIcon color="#757575">{{ icon }}</VIcon>
      <span>{{ text }}</span>
    </div>
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
    },
    tooltip: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>
