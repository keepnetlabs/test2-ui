<template>
  <v-overlay
    fixed
    :opacity="1"
    :value="status"
    :z-index="999"
    color="white"
    class="import-users-file__overlay"
  >
    <div class="import-users-file__container">
      <v-list-item class="pl-0 pr-0 add-in-configuration__list-item">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon class="ml-2" color="blue" left medium>mdi-file-excel</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="v-card-headline">Import Users From a File </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Upload File</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Map Fields</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :step="3">Overview</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <div class="upload-file-stepper">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="import-users-file__title">
                    Upload File</v-list-item-title
                  >
                  <v-list-item-subtitle class="import-users-file__sub-title"
                    >Select and upload an XLS or CSV file with user list</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  asas
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2"> </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3"> </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </div>
    <div class="import-users-file__footer">
      <v-btn @click="closeOverlay" class="import-users-file__footer-btn-cancel" rounded>
        CANCEL
      </v-btn>
      <div class="import-users-file__right-col">
        <v-btn
          @click="changeStep(-1)"
          class="import-users-file__footer-btn-back mr-4"
          rounded
          v-if="step > 1"
        >
          BACK
        </v-btn>
        <v-btn
          @click="changeStep(+1)"
          class="import-users-file__footer-btn-next"
          color="#2196f3"
          rounded
          v-if="step < 3"
        >
          NEXT
        </v-btn>
        <v-btn
          @click="submit"
          class="import-users-file__footer-btn-next"
          color="#2196f3"
          rounded
          v-if="step === 3"
        >
          SAVE
        </v-btn>
      </div>
    </div>
  </v-overlay>
</template>

<script>
export default {
  name: 'ImportUsersFromFileModal',
  data() {
    return {
      step: 1
    }
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeImportUsersFromFileModal')
    },
    changeStep(flag) {
      this.step += flag
    },
    submit() {}
  }
}
</script>

<style lang="scss">
.import-users-file {
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
  &__container {
    padding: 32px 96px 0 96px;
    box-shadow: none;
    .v-list-item {
      padding: 0;
      &__content {
        padding: 0;
      }
    }
  }
  &__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #f5f7fa;
    padding: 16px 96px !important;
    display: flex;
    justify-content: space-between;
    z-index: 10;

    @media (max-width: 768px) {
      padding-left: 0 !important;
      padding-right: 0 !important;
      justify-content: space-around;
    }

    &-btn-cancel {
      color: #f56c6c !important;
      border: 1px solid #f56c6c !important;

      box-shadow: none !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      width: 86px;
      height: 36px !important;
    }

    &-btn-next {
      color: #ffffff !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      width: 72px;
      height: 36px !important;
      border-radius: 18px;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
      background-color: #2196f3;
    }

    &-btn-back {
      width: 68px;
      height: 36px !important;
      border-radius: 18px;
      border: solid 1px #00bcd4;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #00bcd4 !important;
      box-shadow: none !important;
    }
  }
  &__title {
    font-size: 24px;
    font-weight: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  &__sub-title {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
}
</style>
