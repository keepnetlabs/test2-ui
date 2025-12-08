<template>
  <div class="UsersDashboardUserMenu">
    <v-btn
      id="btn--users-dashboard-header-user"
      class="UsersDashboardUserMenu__btn"
      icon
      @click="toggleMenu"
    >
      <v-icon>mdi-account-outline</v-icon>
    </v-btn>

    <div v-if="isMenuOpen" class="UsersDashboardUserMenu__dropdown">
      <div class="UsersDashboardUserMenu__content">
        <div v-if="userInfo.name" class="UsersDashboardUserMenu__name">
          {{ userInfo.name }}
        </div>
        <div v-if="userInfo.email" class="UsersDashboardUserMenu__item">
          <span class="UsersDashboardUserMenu__label">{{ labels.userMenuEmail }}</span>
          <span class="UsersDashboardUserMenu__value">{{ userInfo.email }}</span>
        </div>
        <div v-if="userInfo.department" class="UsersDashboardUserMenu__item">
          <span class="UsersDashboardUserMenu__label">{{ labels.userMenuDepartment }}</span>
          <span class="UsersDashboardUserMenu__value">{{ userInfo.department }}</span>
        </div>
        <div v-if="userInfo.phoneNumber" class="UsersDashboardUserMenu__item">
          <span class="UsersDashboardUserMenu__label">{{ labels.userMenuPhoneNumber }}</span>
          <span class="UsersDashboardUserMenu__value">{{ userInfo.phoneNumber }}</span>
        </div>
        <div class="UsersDashboardUserMenu__item">
          <span class="UsersDashboardUserMenu__label">{{ labels.userMenuPreferredLanguage }}</span>
          <span class="UsersDashboardUserMenu__value">{{ preferredLanguageText }}</span>
        </div>

        <!-- Logout Button -->
        <div class="UsersDashboardUserMenu__logout">
          <v-btn
            id="btn--users-dashboard-logout"
            class="UsersDashboardUserMenu__logout-btn"
            outlined
            block
            color="error"
            @click="handleLogout"
          >
            <v-icon left>mdi-logout</v-icon>
            {{ labels.userMenuLogout }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UsersDashboardUserMenu',
  data() {
    return {
      isMenuOpen: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'usersDashboard/getUserInfo',
      language: 'usersDashboard/getLanguage',
      labels: 'usersDashboard/getLabels'
    }),
    preferredLanguageText() {
      if (!this.userInfo.preferredLanguage) {
        // Get language text from available languages
        const languages = [
          { text: 'English (United Kingdom)', value: 'en-GB' },
          { text: 'English (United States)', value: 'en-US' },
          { text: 'Türkçe (Türkiye)', value: 'tr-TR' },
          { text: 'Deutsch (Deutschland)', value: 'de-DE' },
          { text: 'Français (France)', value: 'fr-FR' },
          { text: 'Español (España)', value: 'es-ES' }
        ]
        const lang = languages.find((l) => l.value === this.language)
        return lang ? lang.text : 'English (United Kingdom)'
      }
      return this.userInfo.preferredLanguage
    }
  },
  mounted() {
    // Close menu when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isMenuOpen = false
      }
    },
    handleLogout() {
      // Close menu
      this.isMenuOpen = false

      // Dispatch logout action
      this.$store.dispatch('usersDashboard/logout')

      // Redirect to login page
      this.$router.push('/users-dashboard-login')
    }
  }
}
</script>
