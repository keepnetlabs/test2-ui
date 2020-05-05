<template>
  <div id="other-settings" class="other-settings">
    <v-list-item class="px-0 list__item">
      <v-list-item-content>
        <div class="list__item__header"> Optional Features</div>
        <div>
          <v-checkbox v-model="formValues.deleteOriginalMail" class="checkbox-text mt-4"
                      color="#2196f3"
                      label="Delete Original Email"></v-checkbox>
        </div>
        <div>
          <v-checkbox v-model="formValues.enableProxy" class="checkbox-text" color="#2196f3"
                      label="Enable proxy"></v-checkbox>
        </div>
        <div>
          <v-checkbox v-model="formValues.onPremiseSettings" color="#2196f3" class="checkbox-text"
                      label="On-premise settings"></v-checkbox>
        </div>
      </v-list-item-content>
    </v-list-item>
    <div class="site-url__container">
      <span class="site-url__message">Site URL</span>
      <v-text-field
        placeholder="https://dashboard.abc.com/"
        outlined
        dense
        disabled
        class="list__item__text list__item__text--special list__item__text--special-1 mt-2"
        v-model="formValues.siteURL"
        required
        id="site-url"
        height="40"
        color="rgba(0, 0, 0, 0.72)"
      ></v-text-field>
    </div>
    <div class="site-url__container">
      <span class="site-url__message">Company ID</span>
      <v-text-field
        placeholder="httpasd785764asd-76acg-87sa-jkfhgsya765s"
        outlined
        dense
        disabled
        class="list__item__text list__item__text--special list__item__text--special-2"
        v-model="formValues.companyId"
        required
        id="company-id"
        height="40"
        color="rgba(0, 0, 0, 0.72)"
      ></v-text-field>
    </div>
    <v-list-item class="px-0 list__item ">
      <v-list-item-content>
        <label class="list__item__header" for="extra-message-text">Extra Message</label>
        <v-text-field
          placeholder="Extra message in the dialog boxes"
          outlined
          dense
          class="add-in-settings__textfield mt-2"
          v-model="formValues.extraMessage"
          required
          id="extra-message-text"
          height="40"
        ></v-text-field>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="px-0 list__item ">
      <v-list-item-content>
        <label class="list__item__header" for="screen-tip-text">Screen Tip</label>
        <v-text-field
          placeholder="Popup tooltip text"
          outlined
          dense
          class="add-in-settings__textfield mt-2"
          v-model="formValues.screenTip"
          required
          id="screen-tip-text"
          height="40"
        ></v-text-field>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="px-0 list__item ">
      <v-list-item-content>
        <label class="list__item__header" for="super-tip-text">Super Tip</label>
        <v-text-field
          placeholder="Text under the screen tip"
          outlined
          dense
          class="add-in-settings__textfield mt-2"
          v-model="formValues.superTip"
          required
          id="super-tip-text"
          height="40"
        ></v-text-field>
      </v-list-item-content>
    </v-list-item>

    <v-list-item class="px-0 list__item">
      <v-list-item-content>
        <label class="list__item__header" for="alertbox-text">Enterprise Vault</label>
        <v-checkbox v-model="formValues.enableEnterpriseVault" class="checkbox-text mt-2"
                    label="Enable enterprise vault"></v-checkbox>
      </v-list-item-content>
    </v-list-item>
    <template>
      <div class="site-url__container">
        <span class="site-url__message">Enterprise vault URL</span>
        <v-text-field
          placeholder="www.bc.com"
          outlined
          disabled
          dense
          class="list__item__text list__item__text--special  mt-2"
          v-model="formValues.enterpriseVault"
          required
          height="40"
        ></v-text-field>
      </div>
    </template>
    <div class="other-settings__footer">
      <v-btn @click="submit" rounded class="white--text btn-util" color="#2196f3">
        SAVE CHANGES
      </v-btn>
      <a
        href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
        class="other-settings__link"
        target="_blank"
      >
        Installation and configuration guide
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OtherSettings",
    data() {
      return {
        formValues: {
          deleteOriginalMail: true,
          enableProxy: false,
          onPremiseSettings: false,
          siteURL: "",
          companyId: "",
          extraMessage: "",
          screenTip: "",
          enableEnterpriseVault: false,
          enterpriseVault: "",
          superTip: "",
        }
      }
    },
    methods: {
      submit() {

      }
    }
  }
</script>

<style scoped lang="scss">
  .list__item {
    width: 554px;
    font-family: "Open Sans", sans-serif !important;

    &__text {
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-stretch: normal;
      font-style: normal;

      &--special {
        width: 365px;
        display: inline-block;

        &-1 {
          margin-left: 25px;
        }

        &-2 {
          margin-top: -9px !important;
        }
      }
    }


    &__header {
      @extend .list__item__text;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
    }

    &__sub-header {
      @extend .list__item__text;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
    }
  }

  .checkbox-text {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;

    ::v-deep .v-label {
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }

  .other-settings {
    &__link {
      font-family: "Open Sans", sans-serif !important;
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: #2196f3;
      flex-basis: 100%;
      text-align: right;
    }

    &__footer {
      display: flex;
      justify-content: space-between;
    }
  }

  .site-url__container {
    margin-left: 32px;
  }

  .site-url__message {
    opacity: 0.7;
    font-family: "Open Sans", sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    display: inline-block;
    margin-right: 21px;
  }

  ::v-deep .v-list-item__content {
    padding: 0 !important;
  }

  .checkbox-text ::v-deep .v-input__slot {
    margin-bottom: 0 !important;
    margin-top: -5px;
  }

  ::v-deep .v-input--selection-controls {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  ::v-deep .v-input--is-disabled .v-input__slot {
    background-color: #f2f2f2 !important;
  }

  ::v-deep .v-list-item__content > *:not(:last-child) {
    margin-bottom: 6px;
  }

  .btn-util {
    font-family: "Open Sans", sans-serif !important;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    max-height: 36px;
  }


</style>
