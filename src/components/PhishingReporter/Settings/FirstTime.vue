<template>
  <div>
    <v-overlay
      id="first-time__overlay"
      fixed
      :opacity="0.46"
      :value="showAddInConfiguration"
      :z-index="999"
      color="white"
      class="first-time__overlay"
    >
      <add-in-configuration
        @changeAddInConfigurationStatus="changeAddInConfigurationStatus"
        @getPhishingReport="getReport"
      />
    </v-overlay>
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
              @click="changeAddInConfigurationStatus"
              rounded
              class="white--text first-time__btn-util"
              color="#2196f3"
            >
              <v-icon left>mdi-plus</v-icon>
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
        <v-btn rounded class="white--text btn-util ml-3" disabled>
          <v-icon left color="#fff">mdi-download</v-icon>
          Download diagnostic tool
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
    margin-top: 66px;

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
      margin: 0 48px;
    }
  }

  &__button-container {
    text-align: center;
    margin-top: 40px;
  }

  &__guide-container {
    text-align: center;

    > a {
      font-family: 'Open Sans', sans-serif !important;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: #2196f3;
      text-transform: uppercase;
      text-decoration: none;
    }
  }

  &__footer {
    margin-top: 92px;
    display: flex;
    @media (max-width: 768px) {
      margin-top: 10px;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .first-time__btn-util:last-child {
        margin-top: 8px;
      }
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
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: right;
    color: #ffffff;
  }
}
</style>
