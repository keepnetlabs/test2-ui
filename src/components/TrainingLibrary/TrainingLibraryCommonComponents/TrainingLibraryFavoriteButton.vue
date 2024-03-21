<template>
  <div
    :class="['training-library-favorite-button', isLoading && 'pointer-none cursor-default']"
    @click="handleFavorite"
  >
    <VIcon class="cursor-pointer" x-small color="#fff">{{
      isFavourite ? 'mdi-bookmark' : 'mdi-bookmark-outline'
    }}</VIcon>
  </div>
</template>

<script>
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'TrainingLibraryFavoriteButton',
  props: {
    isDefaultFavourite: {
      type: Boolean,
      default: false
    },
    trainingId: {
      type: String
    }
  },
  data() {
    return {
      isFavourite: this.isDefaultFavourite,
      isLoading: false
    }
  },
  methods: {
    handleFavorite() {
      if (!this.trainingId) return
      this.isLoading = true
      if (this.isFavourite) {
        AwarenessEducatorService.removeFromFavorite(this.trainingId)
          .then(() => {
            this.isFavourite = !this.isFavourite
            this.$emit('on-favorite-remove')
          })
          .finally(() => {
            this.isLoading = false
          })
      } else {
        AwarenessEducatorService.addToFavorite(this.trainingId)
          .then(() => {
            this.isFavourite = !this.isFavourite
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>
