<template>
  <div class="k-widget-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'WidgetContainer'
}
</script>

<style lang="scss">
.k-widget-container {
  border-radius: 12px;
  box-shadow: -10px 9px 21px 0 rgba(128, 152, 213, 0.08);
  background-color: #ffffff;
  padding: 24px 24px 16px 24px;
  height: 100%;
}
</style>
