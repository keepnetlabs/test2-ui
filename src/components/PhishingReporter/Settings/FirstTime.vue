<template>
  <div>
    <add-in-configuration
      ref="addInConfiguration"
      v-if="showAddInConfiguration"
      :status="showAddInConfiguration"
      @changeAddInConfigurationStatus="changeAddInConfigurationStatus"
      @getPhishingReport="getReport"
      @closeOverlay="showAddInConfiguration = false"
    />

    <v-container tag="div" id="first-time" fluid style="padding-bottom: 48px !important;">
      <v-list-item class="first-time__list-item">
        <v-list-item-content>
          <div class="first-time__header">Phishing Reporter Add-in</div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="first-time__list-item">
        <v-list-item-content>
          <div class="first-time__sub-header">Available for</div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="first-time__list-item">
        <v-list-item-content>
          <logos wrapperClasses="first-time__icon-container" hasMidMargin />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="first-time__list-item">
        <v-list-item-content>
          <div class="first-time__button-container">
            <v-btn
              @click="changeAddInConfigurationStatus(true)"
              rounded
              id="btn--phishing-reporter-settings-configure-add-in"
              class="white--text first-time__btn-util"
              color="#2196f3"
            >
              <v-icon medium left>mdi-plus</v-icon>
              Configure Add-in
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="first-time__list-item"> </v-list-item>
    </v-container>
  </div>
</template>

<script>
import AddInConfiguration from '../AddInConfiguration'
import Logos from '../Logos'
export default {
  components: {
    AddInConfiguration,
    Logos
  },
  name: 'FirstTime',
  data() {
    return {
      showAddInConfiguration: false
    }
  },
  methods: {
    changeAddInConfigurationStatus(flag = true) {
      this.showAddInConfiguration = flag
    },
    submit() {},
    getReport() {
      this.$emit('getPhishingReport')
    },
    checkIfCanCloseOverlay() {
      if (this.$refs.addInConfiguration) {
        this.$refs.addInConfiguration.closeOverlay()
      }
    }
  }
}
</script>
