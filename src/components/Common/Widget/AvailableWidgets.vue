<template>
  <div class="available-widget">
    <div class="available-widget__header">
      <div class="available-widget__header-left">
        <v-icon color="#2196f3">mdi-widgets</v-icon>
        <span class="ml-2">Available Widgets</span>
      </div>

      <v-icon class="available-widget__icon" small>mdi-window-minimize</v-icon>
    </div>
    <div class="available-widget__body">
      <span
        class="available-widget__item"
        @click="handleAddWidget(widget)"
        :key="widget.key"
        v-for="widget in availableWidgets"
      >
        <v-btn :ripple="false" color="#00bcd4" text>
          <v-icon>mdi-plus</v-icon>
          {{ widget.name }}
        </v-btn>
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
    &-left {
      display: flex;
      align-items: center;
      font-weight: 600;
      color: #2196f3;
    }
  }
  &__body {
    display: flex;
    flex-wrap: wrap;
    span {
      margin: 5px;
    }
  }
  &__item {
    display: flex;
    align-items: center;
    .v-btn__content {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: center;
    }
  }
  &__icon {
    cursor: pointer;
  }
}
</style>
