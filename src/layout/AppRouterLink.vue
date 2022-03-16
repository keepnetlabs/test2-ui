<template>
  <router-link :to="to" :id="id" :class="getClass">
    <v-list-item-title class="menu-item-wrapper">
      <span class="menu-item-span">{{ routeName }}</span>
    </v-list-item-title>
  </router-link>
</template>

<script>
export default {
  name: 'AppRouterLink',
  props: {
    to: {
      type: String
    },
    id: {
      type: String
    },
    routerName: {
      type: String
    },
    routeName: {
      type: String
    },
    activeClassComparator: {
      type: Function,
      default: null
    }
  },
  computed: {
    getClass() {
      return ['menu-link-default', this.comparator && 'active-link']
    },
    comparator() {
      return this.activeClassComparator
        ? this.activeClassComparator()
        : this.routerName === this.routeName
    }
  }
}
</script>
