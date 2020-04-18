<template>
  <div>
    <div class="v-cart-content-wrapper mt-10">
      <div class="d-flex v-cart-company-information-wrapper">
        <v-avatar class="company-information-avatar" max-height="40" max-width="40">
          <img src="../assets/img/logo-kep.png" alt="John" />
        </v-avatar>
        <div class="heading company-information-title">
          {{ company.name }}
        </div>
      </div>
      <v-divider class="mt-6 company-information-divider"></v-divider>
      <div class="company-information-details">
        <div class="d-flex company-awareness-score-wrapper">
          <div class="company-awareness-font">
            Awareness Score
          </div>
          <div class="company-awareness-desc">
            <div v-if="getCompLenght > 0">
              <v-avatar :color="company.awarenessColor" size="24">
                <span class="white--text headline">{{ company.awarenessScore }}</span>
              </v-avatar>
            </div>
            <div v-else>
              <span>Baseline not set</span>
              <v-tooltip max-width="200" top class="tooltip-wrapper ml-2">
                <template v-slot:activator="{ on }">
                  <v-icon class="pl-2" small color="grey" dark v-on="on">mdi-information</v-icon>
                </template>
                <span>
                  First few campaigns and trainings will determine your Baseline Awareness Score.
                  This will help to identify your starting point.
                </span>
              </v-tooltip>
            </div>
          </div>
        </div>
        <div class="d-flex company-license-status-wrapper">
          <div class="company-license-status-title">
            Licence Status
          </div>
          <div class="company-licence-status-desc">
            <div v-if="company.isLicenceStatusValid">
              {{ company.licenceStatus }}
            </div>
            <div v-else>
              <span class="red--text">{{ company.licenceStatus }}</span>
              <v-tooltip max-width="200" top class="tooltip-wrapper ml-2">
                <template v-slot:activator="{ on }">
                  <v-icon class="pl-2" small color="grey" dark v-on="on">mdi-information</v-icon>
                </template>
                <span>{{ company.licenseStatusMessage }}</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex company-ends-at-wrapper">
        <div class="company-ends-at-title">
          Ends at
        </div>
        <div class="company-ends-at-desc">
          {{ company.endsAt }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'company-information',
  data: () => ({}),
  created() {
    this.company = this.companyInformation
  },
  computed: {
    getCompLenght() {
      return this.company.awarenessScore.length
    }
  },
  props: {
    companyInformation: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.company-ends-at-wrapper {
  margin-top: 6px;
  margin-left: 24px;
  padding-bottom: 24px;
}
.company-ends-at-title {
  width: 142px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #2196f3;
}
.company-ends-at-desc {
  align-self: center;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
.company-license-status-wrapper {
  margin-top: 21px;
  margin-left: 24px;
}
.company-license-status-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #2196f3;
  width: 142px;
}
.company-licence-status-desc {
  align-self: center;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
.company-awareness-score-wrapper {
  margin-top: 25px;
  margin-left: 24px;
}
.company-awareness-font {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: inherit;
  letter-spacing: normal;
  color: #2196f3;
  width: 142px;
}
.company-awareness-desc {
  align-self: center;
}
.company-information-divider {
  margin-left: 24px;
  margin-right: 24px;
}
.company-information-title {
  align-self: center;
  padding-left: 18px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
.company-information-avatar {
  border-radius: unset !important;
  box-shadow: unset !important;
  max-height: 50px !important;
  max-width: 100px !important;
}
.v-cart-company-information-wrapper {
  padding-top: 24px;
  padding-left: 24px;
}
.v-cart-content-wrapper {
  min-height: 231px;
  background-color: #fafafa;
  border-radius: 20px !important;
}
.v-avatar img {
  width: 100%;
  height: auto;
}
.v-tooltip__content {
  background: rgba(97, 97, 97, 1) !important;
  opacity: 1 !important;
}
@media only screen and (max-width: 500px) {
  .v-cart-content-wrapper {
    height: 290px !important;
  }
  .company-license-status-wrapper,
  .company-ends-at-wrapper {
    flex-direction: column !important;
    justify-content: flex-start;

    > div {
      width: 100% !important;
    }
  }

  .company-ends-at-wrapper {
    margin-top: 13px;
  }
}
@media only screen and (max-width: 360px) {
  .company-awareness-score-wrapper,
  .company-license-status-wrapper,
  .company-ends-at-wrapper {
    margin-left: 10px;
  }
}
</style>
