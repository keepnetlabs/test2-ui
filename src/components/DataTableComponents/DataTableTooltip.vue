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

<style>
.datatable-tooltip {
  background-color: #6d6d6d;
  position: fixed;
  color: #fff;
  letter-spacing: normal;
  padding: 4px 16px;
  z-index: 12;
  border-radius: 4px;
  font-size: 12px;
}
</style>
