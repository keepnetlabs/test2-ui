<template>
  <v-menu
    bottom
    offset-y
    nudge-bottom="12"
    content-class="filter-options__menu-content"
    class="filter-options__menu"
  >
    <template #activator="{ on }">
      <div v-on="on" text class="filter-options">
        <v-icon class="filter-options__icon">mdi-filter-variant</v-icon>
        <span class="filter-options__text">Filter Options</span>
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
  emits: ['set-default-search', 'restore-default-search', 'clear-filters'],
  data() {
    return {
      listItems: [...COMMON_CONSTANTS.FILTER_OPTIONS]
    }
  },
  methods: {
    handleListItemClick(item = '') {
      switch (item) {
        case COMMON_CONSTANTS.FILTER_OPTIONS[0]:
          this.$emit('set-default-search')
          break
        case COMMON_CONSTANTS.FILTER_OPTIONS[1]:
          this.$emit('restore-default-search')
          break
        case COMMON_CONSTANTS.FILTER_OPTIONS[2]:
          this.$emit('clear-filters')
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
.filter-options {
  margin-left: 16px;
  cursor: pointer;
  &__icon {
    font-size: 20px !important;
  }

  &__text {
    margin-left: 4px !important;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.8;
    letter-spacing: normal;
    color: #757575;
  }
  &__menu {
    &-content {
      box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important ;

      .v-list-item__title {
        font-size: 14px;
        font-weight: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: #383b41;
      }
    }
  }
}
</style>
