<template>
  <div class="companies">
    <v-layout wrap class="companies__container">
      <v-card class="companies__container-card">
        <company-group-details :groupId="$route.params.groupId" />
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import CompanyGroupDetails from '@/components/CompanyGroups/CompanyGroupDetails'

export default {
  name: 'CompanyGroupDetails',
  props: {},
  components: { CompanyGroupDetails },
  data() {
    return {
      tab: 0
    }
  },
  mounted() {},
  methods: {
    changeTabStatus(status) {
      this.tab = status
    }
  }
}
</script>

<style lang="scss">
.companies {
  min-height: 80vh !important;
  &__container {
    padding: 0px 16px 24px 16px !important;
    width: 100%;
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 5px 18px 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
}
</style>
