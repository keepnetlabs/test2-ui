<template>
  <div class="datatable-tooltip" :style="tooltipStyle">
    {{ content }}
  </div>
</template>

<script>
export default {
  name: 'DataTableTooltip',
  props: {
    tooltipStyle: {
      type: Object
    },
    content: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.datatable-tooltip {
  background-color: #6d6d6d;
  position: fixed;
  color: rgba(255, 255, 255, 0.87) !important;
  font-size: 12px;
  line-height: 1.33;
  min-height: 24px;
  letter-spacing: normal;
  word-break: break-all;
  padding: 4px 8px;
  z-index: 12;
  border-radius: 4px;

  @media (min-width: 1260px) {
    max-width: 600px !important;
  }
  @media (max-height: 600px) {
    max-height: 200px;
    overflow: hidden;
  }
  @media (min-width: 896px) {
    max-width: 450px;
  }
  max-width: 300px;
}
</style>
