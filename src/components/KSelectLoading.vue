<template>
  <div class="k-select-loading">
    <div class="vue-treeselect__icon-container">
      <span class="vue-treeselect__icon-loader"></span>
    </div>
    <span class="vue-treeselect__tip-text vue-treeselect__loading-tip-text">Loading...</span>
  </div>
</template>
<script>
export default {
  name: 'KSelectLoading'
}
</script>

<style lang="scss">
.k-select-loading {
  position: absolute;
  left: 0;
  bottom: -40px;
  width: 100%;
  padding: 8px 8px 8px 10px;
  border-radius: 8px !important;
  -webkit-box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;
  box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;
  background: #fff;
  line-height: 180%;
  z-index: 999999999;
}
</style>
