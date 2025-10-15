<template>
  <VMenu offset-y bottom left nudge-right="32" nudge-top="-4" min-width="160">
    <template #activator="{ on: menu }">
      <VTooltip bottom opacity="1">
        <template #activator="{ on: tooltip }">
          <VBtn
            v-on="{ ...tooltip, ...menu }"
            id="btn-add--training-library"
            class="training-library-new-btn"
            rounded
            color="#2196f3"
          >
            <v-icon color="#fff">mdi-plus</v-icon>
            <span class="training-library-new-btn__text">NEW</span>
          </VBtn>
        </template>
        <span class="tooltip-span">Add Training Library Content</span>
      </VTooltip>
    </template>
    <VList>
      <VListItem
        v-for="item in getFilteredTrainingItems"
        :key="item.id"
        :id="item.id"
        @click="handleAddTrainingLibraryContent(item.text)"
      >
        <VListItemTitle class="add-users__title">{{ item.text }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<script>
import { addTrainingItems } from '@/components/TrainingLibrary/utils'
import useAddTrainingLibraryContent from '@/hooks/useAddTrainingLibraryContent'

export default {
  name: 'TrainingLibraryFirstCardNewButton',
  mixins: [useAddTrainingLibraryContent],
  data() {
    return {
      addTrainingItems
    }
  },
  computed: {
    isRootUser() {
      return this.$store.getters['auth/userGetter']?.role?.name === 'Root'
    },
    getFilteredTrainingItems() {
      if (this.isRootUser) {
        return this.addTrainingItems
      }
      return this.addTrainingItems.filter((item) => item.text !== 'Survey')
    }
  }
}
</script>
