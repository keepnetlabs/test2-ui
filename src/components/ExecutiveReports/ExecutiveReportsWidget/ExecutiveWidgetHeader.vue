<template>
  <div class="executive-widget-header">
    <div class="executive-widget-header__left">
      <div class="d-flex justify-space-between items-center">
        <div class="executive-widget-header__left-title">{{ title }}</div>
      </div>
      <div class="executive-widget-header__left-text">{{ subtitle }}</div>
    </div>
    <div v-if="editMode" class="executive-widget-header__right">
      <VIcon
        v-if="false"
        class="executive-widget-header__right-icon"
        color="#757575"
        @click="handleEdit"
        >mdi-cog</VIcon
      >
      <VIcon
        v-if="!isDashboardWidget"
        class="executive-widget-header__right-icon ml-2"
        color="#757575"
        @click="handleDelete"
        >mdi-close</VIcon
      >
      <VIcon
        v-else
        class="widget__header-icon ml-1"
        style="position: absolute; font-size: 16px;"
        small
        @click="handleDelete"
        >mdi-close-circle</VIcon
      >
    </div>
    <div v-else-if="!editMode && lastUpdated" class="executive-widget-header__right-date">
      Last Updated: {{ lastUpdated }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExecutiveWidgetHeader',
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    editMode: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: String,
      default: ''
    },
    isDashboardWidget: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleDelete() {
      this.$emit('on-delete')
    },
    handleEdit() {
      this.$emit('on-edit')
    }
  }
}
</script>
