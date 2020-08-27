<template>
  <div>
    <add-in-configuration
      @changeAddInConfigurationStatus="changeAddInConfigurationStatus"
      @getPhishingReport="getReport"
      v-if="showAddInConfiguration"
      :status="showAddInConfiguration"
      @closeOverlay="showAddInConfiguration = false"
    />

    <v-container tag="div" id="first-time" fluid>
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
              class="white--text first-time__btn-util"
              color="#2196f3"
            >
              <v-icon medium left>mdi-plus</v-icon>
              Configure Add-in
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="first-time__list-item">
        <v-list-item-content>
          <div class="first-time__guide-container">
            <a
              href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
              target="_blank"
            >
              Installation and configuration guide
            </a>
          </div>
        </v-list-item-content>
      </v-list-item>
      <div class="first-time__footer">
        <v-btn
          @click="submit"
          disabled
          rounded
          class="white--text btn-util btn-save-changes"
          color="#2196f3"
        >
          SAVE CHANGES
        </v-btn>
        <v-btn style="padding-left: 20px;" rounded class="white--text btn-util ml-4" disabled>
          <v-icon left color="#fff">mdi-download</v-icon>
          Save and Download Add-in
        </v-btn>
      </div>
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
    }
  }
}
</script>

<style lang="scss">
.first-time {
  &__header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 34px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    text-align: center;
    margin-top: 88px;

    @media (max-width: 768px) {
      margin-top: 0;
      font-size: 30px;
    }
  }

  &__sub-header {
    font-family: 'Open Sans', sans-serif !important;
    text-align: center;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  &__icon-container {
    display: flex;
    justify-content: center;
    width: 100%;
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }

    > div:nth-child(2) {
    }
  }

  &__button-container {
    text-align: center;
    margin-top: 40px;
  }

  &__guide-container {
    text-align: center;
    @media (min-width: 1024px) {
      margin-top: -10px;
    }

    > a {
      font-family: 'Open Sans', sans-serif !important;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      color: #2196f3 !important;
      text-transform: uppercase;
      text-decoration: none;
    }
  }

  &__footer {
    margin-top: 78px;
    display: flex;
    padding-bottom: 24px;

    @media (max-width: 768px) {
      margin-top: 10px;
      padding-bottom: 12px;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .first-time__btn-util:last-child {
        margin-top: 8px;
      }
    }
    .v-btn {
      box-shadow: none !important;
    }
    .v-btn--disabled .v-btn__content {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: right;
      color: #ffffff !important;

      .mdi-download {
        color: #ffffff !important;
      }
    }
  }

  &__overlay {
  }

  &__list-item {
    .v-list-item__content {
      padding: 0 !important;
      overflow: visible;
    }
    &:nth-child(2) {
      margin-bottom: -3px;
      margin-top: 3px;
    }
  }

  &__overlay {
    .v-overlay__content {
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
    }
  }

  &__btn-util {
    font-size: 14px;
    padding-left: 20px !important;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
    .v-btn__content {
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: #fff;
    }
    &:focus {
      box-shadow: none;
    }
  }
}
</style>
