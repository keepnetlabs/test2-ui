<template>
  <div class="phishingSimulator" id="phishingSimulator">
    <v-layout id="ts-layout" wrap style="min-height: 80vh;">
      <v-col class="pl-0 phishingSimulator__tab-container" cols="12">
        <v-card id="pr-card" class="pr-card pr-6 pb-0">
          <el-tabs v-model="tab">
            <el-tab-pane
              v-if="checkPermission('phishing-simulator/phishing-scenario/search', 'POST')"
              label="Scenarios"
              name="scenarios"
              id="emailTemplates-scenarios"
            >
              <Scenarios v-if="tab === 'scenarios'" />
            </el-tab-pane>
            <el-tab-pane
              v-if="checkPermission('phishing-simulator/email-templates', 'POST')"
              label="Email Templates"
              name="emailTemplates"
              id="emailTemplates-content"
            >
              <EmailTemplates v-if="tab === 'emailTemplates'" />
            </el-tab-pane>
            <el-tab-pane
              v-if="checkPermission('phishing-simulator/landing-page-template', 'POST')"
              label="Landing Page Templates"
              name="landingPage"
              id="landing-page-content"
            >
              <LandingPageList v-if="tab === 'landingPage'" />
            </el-tab-pane>
          </el-tabs>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import EmailTemplates from '../components/PhishingScenarios/EmailTemplates'
import LandingPageList from '../components/LandingPage/LandingPageList'
import Scenarios from '../components/PhishingScenarios/Scenarios'
import { checkPermission } from '@/utils/functions'
export default {
  name: 'PhishingSimulator',
  components: {
    EmailTemplates,
    LandingPageList,
    Scenarios
  },
  data() {
    return {
      tab: 'scenarios'
    }
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    },
    checkPermission(permission, type) {
      return checkPermission(permission, type)
    }
  }
}
</script>

<style lang="scss">
.phishingSimulator {
  padding: 0 16px 16px 16px;

  .el-tabs__content {
    margin-top: 24px;
  }

  &__tab-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 11px !important;
  }

  .v-slide-group__content {
    border-bottom: 2px solid #e4e7ed;
  }

  .v-window__container {
    margin-top: 24px !important;
  }

  .v-card:not(.v-sheet--tile):not(.v-card--shaped) {
    border-radius: 20px;
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
    background-color: #ffffff;
    padding: 0;
  }

  .v-tabs-slider-wrapper {
    bottom: 0 !important;
    color: #0486fe !important;
  }
}

.pr-tab {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-transform: capitalize;
  color: rgba(0, 0, 0, 0.87) !important;

  &-users {
    margin-right: 35px !important;
  }

  &-active {
    color: #2196f3 !important;
  }
}

.pr-card {
  box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
    0 1px 1px -1px rgba(204, 204, 204, 0.12);
  padding: 10px 5px 18px 24px !important;
  border-radius: 20px;
}
</style>
