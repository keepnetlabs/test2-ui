<template>
  <v-container tag="div" fill-height fluid>
    <div id="diagnostic-tool" class="diagnostic-tool">
      <v-list-item class="px-0 list__item">
        <v-list-item-content>
          <div class="list__item__header"> Optional Features</div>
          <v-checkbox v-model="formValues.enableAllAddIns" class="checkbox-text mt-4"
                      color="#2196f3"
                      label="Check and enable all disabled add-ins automatically"></v-checkbox>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <div class="diagnostic-tool__form-container ml-4">
            <div>
              <v-select
                :items="[]"
                v-model="formValues.interval"
                outlined
                class="diagnostic-tool__select"
                required
                dense
                height="40"
              ></v-select>
            </div>
            <div class="items__text">
              on
            </div>
            <div>
              <v-select
                :items="[]"
                v-model="formValues.day"
                outlined
                class="diagnostic-tool__select"
                required
                dense
                height="40"
              ></v-select>
            </div>
            <div class="items__text">
              at
            </div>

            <div class="list__item__textfield">
              <v-text-field
                outlined
                dense
                class="list__item__text"
                v-model="formValues.time"
                prepend-inner-icon="mdi-clock-outline"
                required
                height="40"
                readonly
              ></v-text-field>
            </div>

            <div class="items__text items__text-timezone">
              Timezone
            </div>

            <div>
              <v-select
                :items="[]"
                v-model="formValues.day"
                outlined
                class="diagnostic-tool__select"
                required
                dense
                height="40"
              ></v-select>
            </div>

          </div>

        </v-list-item-content>
      </v-list-item>
    </div>
    <div class="diagnostic-tool__footer">
      <v-btn @click="submit" rounded class="white--text btn-util btn-save-changes" color="#2196f3">
        SAVE CHANGES
      </v-btn>
      <v-btn rounded class="white--text btn-util ml-3" color="#00bcd4">
        <v-icon left>mdi-download</v-icon>
        Download diagnostic tool
      </v-btn>
      <a
        href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
        class="diagnostic-tool__link"
        target="_blank"
      >
        Installation and configuration guide
      </a>
    </div>
  </v-container>
</template>

<script>
  export default {
    name: "DiagnosticTool",
    data() {
      return {
        formValues: {
          enableAllAddIns: true,
          interval: "",
          day: "",
          time: "",
          menu2: false,
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
    font-family: "Open Sans", sans-serif !important;

    &__text {
      font-family: "Open Sans", sans-serif !important;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-stretch: normal;
      font-style: normal;

      &--special {
        &-1 {
          margin-left: 25px;
        }

        &-2 {
          margin-top: -8px !important;
        }
      }
    }

    &__textfield {
      max-width: 123px;
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

    ::v-deep .v-label {
      font-family: "Open Sans", sans-serif !important;
      color: rgba(0, 0, 0, 0.87) !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;

    }
  }

  ::v-deep .v-list-item__content {
    padding: 0 !important;

  }

  ::v-deep .v-label {
    color: rgba(0, 0, 0, 0.87) !important;
  }

  .diagnostic-tool {

    width: 100%;

    &__form-container {
      display: flex;
      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    ::v-deep .mdi-clock-outline {
      margin-top: 3px !important;
      margin-left: -9px !important;
    }

    &__select {
      max-width: 125px;
    }

    &__footer {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 80px;
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        margin-top: 0;

      }
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
  }

  .items__text {
    margin: 12px 8px !important;
    @media (max-width: 768px) {
      margin-left: 0 !important;
      margin-top: 0 !important;
    }

    &-timezone {
      margin-left: 32px !important;
      margin-right: 16px !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      //line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      @media (max-width: 768px) {
        margin-left: 0 !important;
        margin-top: 0 !important;
      }
    }

  }

  .btn-util {
    font-family: "Open Sans", sans-serif !important;
    font-size: 14px;
    font-weight: 600;
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

  .btn-save-changes {
    @media (max-width: 768px) {
      margin-left: 12px !important;
    }
  }

</style>
