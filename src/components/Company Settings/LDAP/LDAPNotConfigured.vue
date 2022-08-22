<template>
  <div class="ldap-not-configured">
    <h2 class="ldap-not-configured__header">
      LDAP Configuration
    </h2>
    <p class="ldap-not-configured__description">
      You haven’t integrated with LDAP
    </p>
    <v-btn class="ldap-not-configured__button" @click="onIntegrateClicked">
      <v-icon class="mr-1" style="margin-top: -1px;">mdi-plus</v-icon>
      <span>INTEGRATE WITH LDAP</span>
    </v-btn>
    <a
      class="ldap-not-configured__link"
      target="_blank"
      href="https://doc.keepnetlabs.com/Next-Generation-Product/modules/company/company-settings/ldap-integration"
      >Installation and configuration guide</a
    >
  </div>
</template>

<script>
export default {
  name: 'LDAPNotConfigured',
  methods: {
    onIntegrateClicked() {
      this.$emit('integrateClicked')
    }
  }
}
</script>
