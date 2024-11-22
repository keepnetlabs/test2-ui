<template>
  <router-view />
</template>
<script>
import { getSystemUserSettings } from '@/api/settings'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  created() {
    this.$store.dispatch('login/getWhiteLabelByUrl')
    this.$store.dispatch('login/getCurrentCompany')
  },
  computed: {
    ...mapGetters({
      user: 'auth/userGetter'
    })
  },
  watch: {
    user: {
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0) {
          this.getSystemUserSettings()
        }
      }
    }
  },
  methods: {
    getSystemUserSettings() {
      getSystemUserSettings().then((response) => {
        if (response?.data?.data?.dateFormat) {
          localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
        }
        if (response?.data?.data?.timeFormat) {
          localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
        }
        const payload = {
          dateFormat: response?.data?.data?.dateFormat || null,
          timeFormat: response?.data?.data?.timeFormat || null
        }
        this.$store.commit('auth/SET_FORMATS', payload)
        this.$store.commit('common/SET_SELECTED_TIME_ZONE', response.data.data.timeZoneId)
        this.$store.commit('common/SET_SELECTED_TIME_ZONE_NAME', response.data.data.timeZoneName)
      })
    }
  }
}
</script>
