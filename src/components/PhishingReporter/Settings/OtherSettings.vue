<template>
  <v-container fluid id="other-settings" class="other-settings">
    <v-form ref="refForm">
      <v-list-group
        no-action
        :class="{'mb-5':marginStatusOptional}"
      >
        <template v-slot:activator>
          <v-list-item-content class="list__item" @click="handleMarginStatusForOptional">
            <div class="list__item__header"> Optional Features</div>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content style="padding:12px 0 !important;">
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
              <v-checkbox v-model="formValues.isOnPremise" color="#2196f3" class="checkbox-text"
                          label="On-premise settings"></v-checkbox>
            </div>
            <div class="site-url__container">
              <span class="site-url__message site-url__message--1">Site URL</span>
              <v-text-field
                placeholder="https://dashboard.abc.com/"
                outlined
                dense
                :disabled="!formValues.isOnPremise"
                class="list__item__text other-settings__textfield list__item__text--special list__item__text--special-1 mt-2"
                v-model="formValues.siteURL"
                id="site-url"
                height="40"
                color="rgba(0, 0, 0, 0.72)"
              ></v-text-field>
            </div>
            <div class="site-url__container">
              <span class="site-url__message site-url__message--2">Company ID</span>
              <v-text-field
                placeholder="Company ID"
                :disabled="!formValues.isOnPremise"
                outlined
                dense
                class="list__item__text other-settings__textfield list__item__text--special list__item__text--special-2"
                v-model="formValues.companyId"
                id="company-id"
                height="40"
                color="rgba(0, 0, 0, 0.72)"
              ></v-text-field>
            </div>
          </v-list-item-content>
        </v-list-item>

      </v-list-group>
      <v-list-item class="px-0 list__item ">
        <v-list-item-content>
          <label class="list__item__header" for="extra-message-text">Extra Message</label>
          <v-text-field
            placeholder="Extra message in the dialog boxes"
            outlined
            dense
            class="other-settings__textfield mt-2"
            v-model="formValues.extraMessage"
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
            class="other-settings__textfield mt-2"
            v-model="formValues.screenTip"
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
            class="other-settings__textfield mt-2"
            v-model="formValues.superTip"
            id="super-tip-text"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-group
        no-action
        :class="{'mb-5':marginStatusOptional}"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <label class="list__item__header" for="alertbox-text">Enterprise Vault</label>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content style="padding:12px 0 !important;">
            <v-checkbox v-model="formValues.enableEnterpriseVault" class="checkbox-text mt-2"
                        @change="handleEnterpriseVaultChange"
                        color="#2196f3"
                        label="Enable enterprise vault"></v-checkbox>
            <div class="site-url__container">
              <span class="site-url__message site-url__message--3">Enterprise vault URL</span>
              <v-text-field
                placeholder="www.bc.com"
                outlined
                :disabled="enterpriseVaultDisabled"
                dense
                class="list__item__text  other-settings__textfield list__item__text--special  mt-2"
                v-model="formValues.enterpriseVault"

                height="40"
              ></v-text-field>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <div class="other-settings__footer" v-if="showFooter">
        <div class="d-flex justify-center">
          <v-btn @click="submit" rounded class="white--text btn-util" color="#2196f3">
            SAVE CHANGES
          </v-btn>
        </div>
        <div>
          <a
            href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
            class="other-settings__link"
            target="_blank"
          >
            Installation and configuration guide
          </a>
        </div>
      </div>
    </v-form>
  </v-container>
</template>

<script>
  export default {
    name: "OtherSettings",
    props: {
      showFooter: {
        type: Boolean,
        value: true
      }
    },
    data() {
      return {
        formValues: {
          deleteOriginalMail: true,
          enableProxy: false,
          isOnPremise: false,
          siteURL: "",
          companyId: "",
          extraMessage: "",
          screenTip: "",
          enableEnterpriseVault: false,
          enterpriseVault: "",
          superTip: "",
        },
        marginStatusOptional: true,
        enterpriseVaultDisabled: true
      }
    },
    methods: {
      submit() {
        return this.$refs.refForm.validate() && this.formValues
      },
      handleEnterpriseVaultChange(value) {
        this.enterpriseVaultDisabled = !value
      },
      handleMarginStatusForOptional() {

        this.marginStatusOptional = !this.marginStatusOptional
      }
    },
    created() {
      this.formValues.companyId = localStorage.getItem("companyId")
    }
  }
</script>

<style scoped lang="scss">
  .list__item {
    font-family: "Open Sans", sans-serif !important;

    &__text {
      font-family: "Open Sans", sans-serif !important;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-stretch: normal;
      font-style: normal;

      &__special {
        max-width: 365px !important;

        &-1 {
          margin-left: 25px;
          margin-right: 47px;
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
      text-align: center;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      @media (max-width: 768px) {
        margin-top: 10px;
        justify-content: center;
      }
    }

    &__textfield {
      max-width: 554px;
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      @media (max-width: 768px) {
        flex-direction: column;
      }
    }
  }

  .site-url__container {
    margin-left: 32px;
    display: flex;
    @media (max-width: 768px) {
      flex-direction: column;
      margin-left: 0;
    }
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

    &--1 {
      margin-top: 18px !important;
      margin-right: 47px;
    }

    &--2 {
      margin-top: 10px !important;
      @media (max-width: 768px) {
        margin-bottom: 10px;
      }
    }

    &--3 {
      margin-top: 17px !important;
    }

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

  ::v-deep {
    .v-list-item {
      padding: 0 !important;

      &--active {
        border-left: none !important;
      }
    }

    .v-list-group__header {
      max-width: 554px;
    }

  }


</style>
