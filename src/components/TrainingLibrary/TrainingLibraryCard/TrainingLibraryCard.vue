<template>
  <div class="training-library-card">
    <div :class="['training-library-card__type', getBgColor]">
      {{ item.type }}
    </div>
    <div class="training-library-card__img">
      <img v-if="item.coverImageUrl" :src="item.coverImageUrl" :alt="item.title" />
      <div class="training-library-card__img--no-img" v-else>
        <VIcon size="82" color="#fff">mdi-image</VIcon>
        <div class="training-library-card__img--no-img-text">No Cover Image</div>
      </div>
    </div>
    <div class="training-library-card__body">
      <div class="training-library-card__body-title">{{ item.trainingName }}</div>
      <div class="training-library-card__body-sub">
        <div>{{ item.createdBy }}</div>
        <div class="training-library-card__body-sub-bull"></div>
        <div>{{ item.category }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryCard',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getBgColor() {
      return 'training-library-card__type--training'
      return `training-library-card__type--${this.item.type}`
    }
  }
}
</script>
