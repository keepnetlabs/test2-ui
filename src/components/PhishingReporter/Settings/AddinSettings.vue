<template>
  <v-container tag="div" fluid id="add-in-settings" class="add-in-settings">
    <v-form ref="refForm" v-model="isValid" lazy-validation>
      <v-row no-gutters>
        <v-col xl="4" lg="4" md="12">
          <v-list-item class="px-0 list__item">
            <v-list-item-content>
              <label class="add-in-settings__label" for="add-in-text">Add-in Name</label>
              <v-text-field
                placeholder="Suspicious E-Mail Reporter"
                outlined
                dense
                class="add-in-settings__textfield mt-2"
                v-model="formValues.addInName"
                required
                id="add-in-text"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col xl="4" lg="4" md="12">
          <v-list-item class="px-0 list__item">
            <v-list-item-content>
              <label class="add-in-settings__label" for="company-text">Brand Name</label>
              <v-text-field
                placeholder="Company Name"
                outlined
                dense
                class="add-in-settings__textfield mt-2"
                v-model="formValues.brandName"
                required
                id="company-text"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col xl="4" lg="4" md="12">
          <v-list-item class="px-0 list__item">
            <v-list-item-content>
              <label class="add-in-settings__label">Add-in Logo</label>
              <div class="add-in-settings__subtitle mt-2">JPEG, PNG or GIF. Recommended size is
                60x60px
              </div>
              <v-btn class="btn-select-file mt-2" rounded @click="onBtnSelectFileClick">
                SELECT FILE
                <input
                  ref="uploader"
                  class="d-none"
                  type="file"
                  :value="formValues.logoFile"
                  accept="image/gif, image/jpeg, image/png"
                  @change="onFileChanged"
                >
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col xl="4" lg="4" md="12">
          <v-list-item class="px-0 list__item mt-4">
            <v-list-item-content>
              <label class="add-in-settings__label" for="alertbox-text">AlertBox Heading</label>
              <v-text-field
                placeholder="Keepnet Labs Phishing Reporter"
                outlined
                dense
                class="add-in-settings__textfield mt-2"
                v-model="formValues.alertboxHeading"
                required
                id="alertbox-text"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col xl="4" lg="4" md="12">
          <v-list-item class="px-0 list__item">
            <v-list-item-content>
              <label class="add-in-settings__label" for="alertbox-text">Report Warning</label>
              <v-checkbox v-model="formValues.showWarning" class="checkbox-text"
                          label="Show Warning" color="#2196f3"></v-checkbox>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col xl="5" lg="5" md="12">
          <template v-if="formValues.showWarning">
            <transition name="fade" appear>
              <div class="report-warning__container">
                <span class="report-warning__message mt-4">Report Warning Message</span>
                <v-text-field
                  placeholder="Report this email?"
                  outlined
                  dense
                  class="add-in-settings__textfield add-in-settings__textfield-report mt-2"
                  v-model="formValues.reportWarningMessage"
                  required
                  id="alertbox-text"
                  height="40"
                ></v-text-field>
              </div>
            </transition>
          </template>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col xl="4" lg="4" md="12">
          <v-list-item class="px-0 list__item">
            <v-list-item-content>
              <label class="add-in-settings__label" for="reported-text">Reported Message</label>
              <v-text-field
                placeholder="Thank you for reporting this email. Our organisation is more secure thanks to you."
                outlined
                dense
                class="add-in-settings__textfield mt-2"
                v-model="formValues.reportedMessage"
                required
                id="reported-text"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col xl="4" lg="4" md="12">
          <v-list-item class="px-0 list__item ">
            <v-list-item-content>
              <label class="add-in-settings__label" for="delete-text">Delete Warning</label>
              <v-text-field
                placeholder="Do you wish to delete original email?"
                outlined
                dense
                class="add-in-settings__textfield mt-2"
                v-model="formValues.deleteText"
                required
                id="delete-text"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col xl="4" lg="4" md="12">
          <v-list-item class="px-0 list__item">
            <v-list-item-content>
              <label class="add-in-settings__label" for="deleted-text">Deleted Message</label>
              <v-text-field
                placeholder="The mail has been deleted"
                outlined
                dense
                class="add-in-settings__textfield mt-2"
                v-model="formValues.alertboxHeading"
                required
                id="deleted-text"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col xl="4" lg="4" md="12">
          <v-list-item class="px-0 list__item ">
            <v-list-item-content>
              <label class="add-in-settings__label" for="warning-text">Warning Label</label>
              <v-text-field
                placeholder="Suspicious E-Mail"
                outlined
                dense
                class="add-in-settings__textfield mt-2"
                v-model="formValues.alertboxHeading"
                required
                id="alertbox-text"
                height="40"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <div class="add-in-settings__footer mt-2 mb-2" v-if="showFooter">
        <v-btn @click="submit" rounded class="white--text btn-util" color="#2196f3">
          SAVE CHANGES
        </v-btn>
        <v-btn rounded class="white--text btn-util ml-3" color="#00bcd4">
          <v-icon left>mdi-download</v-icon>
          Save and Download Add-in
        </v-btn>
        <a
          href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
          class="add-in-settings__link"
          target="_blank"
        >
          Installation and configuration guide
        </a>
      </div>
    </v-form>
  </v-container>
</template>

<script>
  export default {
    name: "AddinSettings",
    props: {
      showFooter: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isValid: false,
        formValues: {
          addInName: "",
          brandName: "",
          logoFile: "",
          alertboxHeading: "",
          showWarning: true,
          reportWarningMessage: "",
          reportedMessage: "",
          deleteText: "",
        },
      }
    },
    methods: {
      onBtnSelectFileClick(e) {
        this.$refs.uploader.click()
      },
      onFileChanged(e) {
        this.formValues.logoFile = e.target.files
      },
      submit() {
        console.log("this.$refs.refForm.validate()", this.$refs.refForm.validate())
      }
    }
  }
</script>

<style scoped lang="scss">
  .add-in {
    &-settings {
      font-family: "Open Sans", sans-serif !important;

      &__label {
        font-size: 20px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.2;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }

      &__subtitle {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }

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
      }

      &__textfield {
        font-family: "Open Sans", sans-serif !important;
        border-radius: 8px;
        background-color: #ffffff;
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        max-width: 554px !important;

        ::v-deep fieldset:not(focus) {
          // border: 1px solid #dcdfe6;
        }

        &-report {
        }
      }

      &__footer {
        display: flex;
        align-items: center;
        @media (max-width: 768px) {
          flex-direction: column;
        }
      }
    }


  }

  ::v-deep .v-list-item__content {
    padding: 0 !important;
  }

  .btn-select-file {
    max-width: 111px;
    max-height: 36px;
    border-radius: 18px;
    font-family: "Open Sans", sans-serif !important;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
    background-color: #2196f3 !important;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
  }

  .list__item {

  }

  .checkbox-text ::v-deep .v-label {
    font-family: "Open Sans", sans-serif !important;
    position: relative;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .report-warning__container {
    margin-top: -20px;
    margin-left: 32px;
    display: flex;
    @media (max-width: 768px) {
      flex-direction: column;
      margin-left: 0;
    }
  }

  .report-warning__message {
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


  ::v-deep .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s !important;
  }

  ::v-deep .fade-enter-active {
    transition: all 0.3s ease;
  }

  ::v-deep .fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  ::v-deep .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0 !important;
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

    @media (max-width: 768px) {
      margin: 8px 0;
    }

    .v-icon {
      font-size: 19px;
    }
  }

  ::v-deep .v-list-item__content > *:not(:last-child) {
    margin-bottom: 6px;
  }

</style>
