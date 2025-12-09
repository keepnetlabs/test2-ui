<template>
  <header class="users-dashboard-header">
    <div class="users-dashboard-header__content">
      <!-- Logo Section -->
      <div class="users-dashboard-header__logo">
        <template v-if="loginWhiteLabel.mainLogoUrl">
          <v-skeleton-loader v-if="!logoLoaded" type="image" width="120" height="40" />
          <img
            v-show="logoLoaded"
            id="img--users-dashboard-header-logo"
            :src="loginWhiteLabel.mainLogoUrl"
            alt="Keepnet Logo"
            class="users-dashboard-header__logo-img"
            @load="logoLoaded = true"
          />
        </template>
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
            :slots="{ selection: true, item: true }"
            class="users-dashboard-header__language-select"
            @input="handleLanguageChange"
          >
            <template #selection="{ item }">
              <div class="users-dashboard-header__language-selection">
                <span :class="`vti__flag ${item.countryCode}`"></span>
                <span class="users-dashboard-header__language-text">{{ item.text }}</span>
              </div>
            </template>
            <template #item="{ item }">
              <div class="users-dashboard-header__language-item">
                <span :class="`vti__flag ${item.countryCode}`"></span>
                <span class="users-dashboard-header__language-text">{{ item.text }}</span>
              </div>
            </template>
          </KSelect>
        </div>
      </div>
    </div>
    <!-- Hidden component to load vue-tel-input CSS for flag icons -->
    <InputPhone v-show="false" value="" />
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import KSelect from '@/components/Common/Inputs/KSelect'
import UsersDashboardUserMenu from './UsersDashboardUserMenu'
import InputPhone from '@/components/Common/Inputs/InputPhone'

export default {
  name: 'UsersDashboardHeader',
  components: {
    KSelect,
    UsersDashboardUserMenu,
    InputPhone
  },
  data() {
    return {
      logoLoaded: false,
      availableLanguages: [
        { text: 'English (United Kingdom)', value: 'en-GB', countryCode: 'gb' },
        { text: 'English (United States)', value: 'en-US', countryCode: 'us' },
        { text: 'Türkçe (Türkiye)', value: 'tr-TR', countryCode: 'tr' },
        { text: 'Deutsch (Deutschland)', value: 'de-DE', countryCode: 'de' },
        { text: 'Français (France)', value: 'fr-FR', countryCode: 'fr' },
        { text: 'Español (España)', value: 'es-ES', countryCode: 'es' }
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
      return lang ? lang.text : 'English (United Kingdom)'
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
