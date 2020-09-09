<template>
  <div class="available-widget">
    <div class="available-widget__header">
      <span>Available Widgets</span>
      <v-icon class="available-widget__icon" small>mdi-window-minimize</v-icon>
    </div>
    <div class="available-widget__body">
      <span @click="handleAddWidget(widget)" :key="widget.key" v-for="widget in availableWidgets">
        {{ widget.name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AvailableWidgets',
  props: {
    availableWidgets: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleAddWidget(widget) {
      this.$emit('addWidget', widget)
    }
  }
}
</script>

<style lang="scss">
.available-widget {
  background: white;
  box-shadow: 0 0 10px 0 #e9e9e9;
  width: 100%;
  border-radius: 2px;
  &__header {
    border-bottom: 1px solid #ebeef5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
  }
  &__body {
    span {
      margin: 5px;
    }
  }
  &__icon {
    cursor: pointer;
  }
}
</style>
