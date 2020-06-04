<template>
  <div>
    <v-card class="pa-6">
      <v-list-item class=" pl-0">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">
            mdi-wifi-strength-off
          </v-icon>
        </div>
        <v-list-item-content>
          <v-list-item-title class="v-card-headline">Connection Is Lost</v-list-item-title>
          <v-list-item-subtitle class="connection-lost-title"
            >Cannot connect to the web</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <div class="connection-lost-sub-title mt-3">You may lose your unsaved progress</div>
      <div class="connection-lost-button d-flex flex-row flex-wrap justify-end">
        <v-btn text color="#2196f3" v-on:click="onIUnderstand">I UNDERSTAND</v-btn>
      </div>
      <v-card-actions> </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ConnectionLost',
  components: {},
  methods: {
    onIUnderstand() {
      this.$emit('onIUnderstand', true)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .v-card {
  border-radius: 12px !important;
}
.connection-lost-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: rgba(0, 0, 0, 0.87);
}
.connection-lost-sub-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54) !important;
}
.connection-lost-button {
}
.v-list-item__subtitle {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2 !important;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.72) !important;
  margin-left: 2px;
}

.v-sheet {
  border-radius: 20px;
  background-color: white;
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: #2196f3;
}

.v-cart-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  margin-right: 24px;
  box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  border: solid 1px rgba(100, 181, 246, 0.5);
  background-color: #e3f2fd;
}

::v-deep .v-card__actions {
  display: none !important;
}
</style>
