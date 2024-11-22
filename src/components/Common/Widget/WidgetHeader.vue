<template>
  <div class="k-widget-header">
    <v-icon
      v-if="editMode"
      class="widget__header-icon ml-1"
      style="position: absolute; font-size: 16px;"
      small
      :id="closeButtonId"
      @click="$emit('deleteWidget')"
      >mdi-close-circle</v-icon
    >
    <div>
      <div class="k-widget-header__title">{{ title }}</div>
      <div v-if="subtitle" class="k-widget-header__subtitle">{{ subtitle }}</div>
    </div>
    <router-link class="k-widget-header__link" v-if="link" :id="buttonId" :to="link['href']"
      ><span>{{ link['text'] }}</span> <v-icon color="#2196f3" small>mdi-arrow-right</v-icon>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'WidgetHeader',
  props: {
    buttonId: {
      type: String
    },
    closeButtonId: {
      type: String
    },
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
    },
    subtitle: {
      type: String
    }
  }
}
</script>
