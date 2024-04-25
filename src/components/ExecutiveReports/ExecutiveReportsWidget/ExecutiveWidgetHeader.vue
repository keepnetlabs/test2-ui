<template>
  <div class="executive-widget-header">
    <div class="executive-widget-header__left">
      <div class="executive-widget-header__left-title">{{ title }}</div>
      <div class="executive-widget-header__left-text">{{ subtitle }}</div>
    </div>
    <div v-if="editMode" class="executive-widget-header__right">
      <VIcon class="executive-widget-header__right-icon" color="#757575" @click="handleEdit"
        >mdi-cog</VIcon
      >
      <VIcon class="executive-widget-header__right-icon ml-2" color="#757575" @click="handleDelete"
        >mdi-close</VIcon
      >
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
