<template>
  <v-menu
    v-model="menuModel"
    bottom
    offset-y
    nudge-bottom="12"
    content-class="filter-options__menu-content"
    class="filter-options__menu"
    v-if="!hideActionOptions"
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
    <v-list>
      <v-list-item @click="handleListItemClick(item)" :key="item" v-for="item in listItems">
        <v-list-item-title>{{ item }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

export default {
  name: 'DataTableFilterOptions',
  props: {
    isActive: {
      type: Boolean
    },
    hideActionOptions: {
      type: Boolean
    }
  },
  emits: ['set-default-search', 'restore-default-search', 'clear-filters'],
  data() {
    return {
      menuModel: false,
      listItems: [...COMMON_CONSTANTS.FILTER_OPTIONS]
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
