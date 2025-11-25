<template>
  <header class="users-dashboard-header">
    <div class="users-dashboard-header__content">
      <!-- Logo Section -->
      <div class="users-dashboard-header__logo">
        <img
          v-if="loginWhiteLabel.mainLogoUrl"
          id="img--users-dashboard-header-logo"
          :src="loginWhiteLabel.mainLogoUrl"
          alt="Keepnet Logo"
          class="users-dashboard-header__logo-img"
        />
        <span v-else class="users-dashboard-header__logo-text">keepnet</span>
      </div>

      <!-- Right Section: User Menu & Language -->
      <div class="users-dashboard-header__actions">
        <!-- User Menu -->
        <UsersDashboardUserMenu />

        <!-- Language Selector -->
        <div class="users-dashboard-header__language-wrapper">
          <KSelect
            id="select--users-dashboard-header-language"
            :value="language"
            :items="availableLanguages"
            item-text="text"
            item-value="value"
            outlined
            dense
            hide-details
            :menu-props="{ offsetY: true }"
            class="users-dashboard-header__language-select"
            @input="handleLanguageChange"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import KSelect from '@/components/Common/Inputs/KSelect'
import UsersDashboardUserMenu from './UsersDashboardUserMenu'

export default {
  name: 'UsersDashboardHeader',
  components: {
    KSelect,
    UsersDashboardUserMenu
  },
  data() {
    return {
      availableLanguages: [
        { text: 'English (United States)', value: 'en-US' },
        { text: 'Turkish', value: 'tr-TR' },
        { text: 'German', value: 'de-DE' },
        { text: 'French', value: 'fr-FR' },
        { text: 'Spanish', value: 'es-ES' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      language: 'usersDashboard/getLanguage',
      loginWhiteLabel: 'login/loginWhiteLabel'
    }),
    currentLanguageLabel() {
      const lang = this.availableLanguages.find((l) => l.value === this.language)
      return lang ? lang.text : 'English (United States)'
    }
  },
  methods: {
    ...mapActions({
      setLanguage: 'usersDashboard/setLanguage'
    }),
    handleLanguageChange(langValue) {
      this.setLanguage(langValue)
    }
  }
}
</script>
