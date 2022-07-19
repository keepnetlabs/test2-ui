<template>
  <v-footer class="k-footer d-flex">
    <div id="btn--dashboard-footer-brand-name" class="footer-item__primary">
      {{ brandName }} &#169; {{ new Date().getFullYear() }}
    </div>
    <div class="footer-item__secondary footer-links">
      <a
        id="btn--dashboard-footer-privacy-policy"
        class="footer-item__secondary--1"
        :href="footerLinks.footerPrivacyPolicyUrl"
        target="_blank"
        >Privacy Policy</a
      >
      <div>&#8226;</div>
      <a
        id="btn--dashboard-footer-terms-and-conditions"
        class="footer-item__secondary--2"
        target="_blank"
        :href="footerLinks.footerTermsAndConditionsUrl"
        >Terms and Conditions</a
      >
      <div class="footer-item__secondary--3">&#8226;</div>
      <a
        id="btn--dashboard-footer-cookie-policy"
        class="footer-item__third--1"
        target="_blank"
        :href="footerLinks.footerCookiePolicyUrl"
        >Cookie Policy</a
      >
      <div>&#8226;</div>
      <a
        id="btn--dashboard-footer-eula"
        class="footer-item__third--2"
        target="_blank"
        :href="footerLinks.footerEulaUrl"
        >EULA</a
      >
    </div>
  </v-footer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppFooter',
  props: {
    brandName: {
      type: String,
      default: 'Keepnet Labs'
    }
  },
  computed: {
    ...mapGetters({ footerLinks: 'whitelabel/getFooterLinks' })
  }
}
</script>
