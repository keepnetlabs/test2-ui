<template>
  <v-footer class="k-footer d-flex">
    <div id="btn--dashboard-footer-brand-name" class="footer-item__primary">
      {{ brandName }} &copy; {{ new Date().getFullYear() }}
    </div>
    <div class="footer-item__secondary footer-links">
      <a
        id="btn--dashboard-footer-privacy-policy"
        class="footer-item__secondary--1"
        :href="footerLinks.footerPrivacyPolicyUrl"
        target="_blank"
        >Privacy Policy</a
      >
      <div>&bull;</div>
      <a
        id="btn--dashboard-footer-terms-and-conditions"
        class="footer-item__secondary--2"
        target="_blank"
        :href="footerLinks.footerTermsAndConditionsUrl"
        >Terms and Conditions</a
      >
      <div class="footer-item__secondary--3">&bull;</div>
      <a
        id="btn--dashboard-footer-cookie-policy"
        class="footer-item__third--1"
        target="_blank"
        :href="footerLinks.footerCookiePolicyUrl"
        >Cookie Policy</a
      >
      <div>&bull;</div>
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

<style lang="scss">
.k-footer {
  background-color: white !important;
  box-shadow: 0 2px 20px 0 rgba(205, 205, 205, 0.5) !important;
  flex-wrap: wrap;
  @media only screen and (max-width: 1025px) {
    justify-content: center;
    padding-bottom: 16px;
  }
  &.v-footer {
    align-items: center;
    display: flex;
    height: 47px;
    position: absolute;
    width: 100%;
    bottom: 0;
    @media (max-width: 719px) {
      padding-bottom: 5px;
    }
    @media (max-width: 1025px) and (min-width: 719px) {
      padding-bottom: 5px;
    }
  }
}

.footer-links {
  align-items: center;
  display: flex;

  a {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.58;
    letter-spacing: normal;
    text-decoration: none;
    color: #383b41 !important;
    padding: 0 16px;
    @media only screen and (min-width: 719px) and (max-width: 1025px) {
      padding: 0 8px;
    }
  }
}

.footer-item {
  flex: 1;
  &__primary {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: normal;
    color: #000000;
    flex-grow: 1;
    @media (max-width: 719px) {
      text-align: center;
    }
  }

  &__secondary {
  }

  &__third {
    flex-grow: 1;

    &--1 {
    }

    &--2 {
    }
  }

  &__fourth {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: normal;
    color: #000000 !important;
  }
}
</style>
