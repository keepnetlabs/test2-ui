<template>
  <div class="test-connection">
    <v-btn
      @click="handleTestConnection"
      outlined
      rounded
      medium
      color="#2196f3"
      class="ldap-info__btn"
      >Test Connection
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'TestConnection',
  methods: {
    handleTestConnection() {}
  }
}
</script>

<style scoped></style>
