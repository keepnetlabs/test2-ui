<template>
  <div class="training-library-favorite-button" @click="handleFavorite">
    <VIcon class="cursor-pointer" x-small color="#fff">{{
      isFavorite ? 'mdi-bookmark' : 'mdi-bookmark-outline'
    }}</VIcon>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryFavoriteButton',
  props: {
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleFavorite() {
      this.$emit('on-favorite')
    }
  }
}
</script>
