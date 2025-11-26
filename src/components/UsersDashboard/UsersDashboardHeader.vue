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
            :slots="{ selection: true, item: true }"
            class="users-dashboard-header__language-select"
            @input="handleLanguageChange"
          >
            <template #selection="{ item }">
              <div class="users-dashboard-header__language-selection">
                <span class="users-dashboard-header__language-flag">{{ item.flag }}</span>
                <span class="users-dashboard-header__language-text">{{ item.text }}</span>
              </div>
            </template>
            <template #item="{ item }">
              <div class="users-dashboard-header__language-item">
                <span class="users-dashboard-header__language-flag">{{ item.flag }}</span>
                <span class="users-dashboard-header__language-text">{{ item.text }}</span>
              </div>
            </template>
          </KSelect>
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
        { text: 'English (United Kingdom)', value: 'en-GB', flag: '🇬🇧' },
        { text: 'English (United States)', value: 'en-US', flag: '🇺🇸' },
        { text: 'Türkçe (Türkiye)', value: 'tr-TR', flag: '🇹🇷' },
        { text: 'Deutsch (Deutschland)', value: 'de-DE', flag: '🇩🇪' },
        { text: 'Français (France)', value: 'fr-FR', flag: '🇫🇷' },
        { text: 'Español (España)', value: 'es-ES', flag: '🇪🇸' }
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
