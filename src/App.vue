<template>
  <v-app>
    <router-view />
  </v-app>
</template>
<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.layout.wrap {
  padding-bottom: 20px !important;
}
.container {
  padding: 0 !important;
}
.v-autocomplete__content.v-menu__content {
  border-radius: 20px !important;
}
.v-menu__content.select-company-dd {
  //margin-top: 40px !important;
  border-radius: 12px !important;
  box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;
}
.el-select-dropdown {
  font-family: 'Open Sans', sans-serif !important;
  .el-select-dropdown__item {
    font-size: 12px !important;
  }
}
</style>
