<template>
  <div class="k-widget-header">
    <v-icon
      v-if="editMode"
      style="position: absolute; font-size: 16px;"
      small
      @click="$emit('deleteWidget')"
      class="widget__header-icon ml-1"
      >mdi-close-circle</v-icon
    >
    <div class="k-widget-header__title">{{ title }}</div>
    <router-link class="k-widget-header__link" v-if="link" :to="link['href']"
      ><span>{{ link['text'] }}</span> <v-icon color="#2196f3" small>mdi-arrow-right</v-icon>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'WidgetHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    link: {
      type: Object,
      default: null
    },
    editMode: {
      type: Boolean
    }
  },
  updated() {
  }
}
</script>

<style lang="scss">
.k-widget-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  margin: 0 -24px;
  padding: 0 36px 16px 24px;
  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    color: #2196f3;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 16px;
  }
  &__link {
    font-size: 12px;
    font-weight: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: #2196f3;
    text-decoration: none;
    display: flex;
    align-items: center;
    i {
      margin-left: 4px;
    }
  }
}
</style>
