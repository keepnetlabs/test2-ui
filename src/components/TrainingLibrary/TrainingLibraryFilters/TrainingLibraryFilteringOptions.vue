<template>
  <VMenu
    v-model="menuModel"
    bottom
    offset-y
    nudge-bottom="12"
    content-class="filter-options__menu-content"
    class="filter-options__menu training-library-filtering-options"
  >
    <template #activator="{ on }">
      <div v-on="on" :class="['filter-options', { 'filter-options--menu-active': menuModel }]">
        <v-icon :class="['filter-options__icon', { 'filter-options--active-filter': isActive }]"
          >mdi-filter-variant</v-icon
        >
        <span :class="['filter-options__text', { 'filter-options--active': isActive }]"
          >Filtering Options</span
        >
      </div>
    </template>
    <div :key="item.text" v-for="item in TRAINING_LIBRARY_FILTER_OPTIONS">
      <!--
      <VMenu
        v-if="item.hasMenu"
        right
        open-on-hover
      >
        <template #activator="{ on }">
          <v-list-item v-on="on" @click="handleListItemClick(item.text)">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </template>
        <v-list>
          <v-list-item @click="handleListItemClick(item.text)">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </VMenu>
      -->
      <VListItem
        class="training-library-filtering-options-parent-list-item"
        @click="handleListItemClick(item.text)"
      >
        <VListItemTitle class="training-library-filtering-options-parent-list-item-title"
          >{{ item.text }} <VIcon>{{ item.icon }}</VIcon></VListItemTitle
        >
      </VListItem>
    </div>
  </VMenu>
</template>
<script>
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { TRAINING_LIBRARY_FILTER_OPTIONS } from '@/components/TrainingLibrary/TrainingLibraryFilters/utils'

export default {
  name: 'TrainingLibraryFilteringOptions',
  props: {
    isActive: {
      type: Boolean
    }
  },
  data() {
    return {
      menuModel: false,
      TRAINING_LIBRARY_FILTER_OPTIONS
    }
  },
  methods: {
    handleListItemClick(item = '') {
      if (item === COMMON_CONSTANTS.FILTER_OPTIONS[0]) {
        this.$emit('set-default-search')
        return
      }
      if (item === COMMON_CONSTANTS.FILTER_OPTIONS[1]) {
        this.$emit('restore-default-search')
        return
      }
      if (item === COMMON_CONSTANTS.FILTER_OPTIONS[2]) {
        this.$emit('clear-filters')
      }
    }
  }
}
</script>
