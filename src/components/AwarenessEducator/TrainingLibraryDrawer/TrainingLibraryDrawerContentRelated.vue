<template>
  <div class="training-library-drawer-content-related">
    <h3 class="training-library-drawer-content-related__title">
      Related Training
    </h3>
    <div class="training-library-drawer-content-related__grid">
      <!-- Buraya related training kartları gelecek -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryDrawerContentRelated',
  props: {
    trainingData: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
