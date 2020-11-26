<template>
  <div class="k-widget-body">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'WidgetBody'
}
</script>

<style lang="scss">
.k-widget-body {
  margin-top: 16px;
  height: 100%;
  position: relative;
  > div {
    height: 80%;
    position: relative;
  }
}
</style>
