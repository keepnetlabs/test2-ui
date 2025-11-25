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
        <div v-if="userInfo.name" class="UsersDashboardUserMenu__item">
          <span class="UsersDashboardUserMenu__label">Name:</span>
          <span class="UsersDashboardUserMenu__value">{{ userInfo.name }}</span>
        </div>
        <div v-if="userInfo.department" class="UsersDashboardUserMenu__item">
          <span class="UsersDashboardUserMenu__label">Department:</span>
          <span class="UsersDashboardUserMenu__value">{{ userInfo.department }}</span>
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
      userInfo: 'usersDashboard/getUserInfo'
    })
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
    }
  }
}
</script>
