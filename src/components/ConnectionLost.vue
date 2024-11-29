<template>
  <div>
    <v-list-item class="pl-0">
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
  </div>
</template>

<script>
export default {
  name: 'ConnectionLost'
}
</script>
