<template>
  <v-container fill-height fluid tag="div">
    <div class="diagnostic-tool" id="diagnostic-tool">
      <v-list-item class="px-0 list__item">
        <v-list-item-content>
          <div class="list__item__header" v-if="showHeader">Optional Features</div>
          <v-checkbox
            class="checkbox-text"
            color="#2196f3"
            label="Check and enable all disabled add-ins automatically"
            v-model="formValues.enableAllAddIns"
          ></v-checkbox>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :class="[isInModal && 'mt-n3', isInModal && 'p-0']">
        <v-list-item-content>
          <div :style="getDiagnosticToolFormStyle" class="diagnostic-tool__form-container">
            <div>
              <v-select
                :items="intervalItems"
                class="diagnostic-tool__select"
                dense
                height="40"
                outlined
                placeholder="Weekly"
                required
                v-model="formValues.interval"
              ></v-select>
            </div>
            <div class="items__text items__text--1">
              on
            </div>
            <div>
              <v-select
                :items="dayItems"
                class="diagnostic-tool__select"
                dense
                height="40"
                outlined
                placeholder="Monday"
                required
                v-model="formValues.day"
              ></v-select>
            </div>
            <div class="items__text items__text--2">
              at
            </div>
            <v-menu
              ref="menu"
              v-model="menu2"
              :close-on-content-click="false"
              :close-on-click="true"
              :return-value="formValues.time"
              value="isOpe"
              transition="scale-transition"
              offset-y
              max-width="210px"
              min-width="210px"
            >
              <template v-slot:activator="{ on }">
                <div class="list__item__textfield">
                  <v-text-field
                    append-icon="mdi-clock-outline"
                    class="list__item__text"
                    dense
                    height="40"
                    outlined
                    placeholder="01:00 PM"
                    required
                    v-on="on"
                    v-model="formValues.time2"
                  ></v-text-field>
                </div>
              </template>
              <v-time-picker
                v-model="formValues.time"
                full-width
                ref="refTimePicker"
                @click:minute="handleTimePickerChange"
                format="ampm"
              ></v-time-picker>
            </v-menu>

            <div :class="['items__text items__text-timezone', isInModal && 'timezone-in-modal']">
              Timezone
            </div>

            <div>
              <v-select
                :class="[isInModal && 'select-in-modal']"
                :items="[]"
                class="diagnostic-tool__select diagnostic-tool__select--timezone"
                dense
                height="40"
                outlined
                placeholder="GMT +3"
                required
                v-model="formValues.day"
              ></v-select>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </div>
    <div class="diagnostic-tool__footer" v-if="showFooter">
      <v-btn @click="submit" class="white--text btn-util btn-save-changes" color="#2196f3" rounded>
        SAVE CHANGES
      </v-btn>
      <v-btn class="white--text btn-util ml-3" color="#00bcd4" rounded>
        <v-icon left>mdi-download</v-icon>
        Download diagnostic tool
      </v-btn>
      <a
        class="diagnostic-tool__link"
        href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
        target="_blank"
      >
        Installation and configuration guide
      </a>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'DiagnosticTool',
  props: {
    isInModal: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formValues: {
        enableAllAddIns: true,
        interval: '',
        day: '',
        time: '',
        menu2: false,
        time2: ''
      },
      showTimePicker: false,
      intervalItems: ['Daily', 'Weekly', 'Monthly'],
      dayItems: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  },
  computed: {
    getDiagnosticToolFormStyle() {
      return this.isInModal && { flexWrap: 'wrap', marginLeft: '16px' }
    }
  },
  watch: {},
  methods: {
    submit() {
      return this.formValues
    },
    handleTimePickerChange(value) {
      const period = this.$refs.refTimePicker.period
      this.formValues.time2 = `${
        period === 'pm'
          ? Number(this.formValues.time.slice(0, 2)) - 12 + this.formValues.time.slice(2)
          : this.formValues.time
      } ${period.toUpperCase()}`
      //this.$refs.menu.save(this.formValues.time)
    }
  }
}
</script>

<style lang="scss" scoped>
.list__item {
  font-family: 'Open Sans', sans-serif !important;

  &__text {
    font-family: 'Open Sans', sans-serif !important;
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
    @media (max-width: 768px) {
      max-width: 104% !important;
      //width: 100% !important;
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
  margin-top: 0 !important;
  @media (min-width: 768px) {
    margin-top: 16px !important;
  }

  ::v-deep .v-label {
    font-family: 'Open Sans', sans-serif !important;
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
  overflow: visible;
}

::v-deep .v-label {
  color: rgba(0, 0, 0, 0.87) !important;
}

.diagnostic-tool {
  width: 100%;

  &__form-container {
    display: flex;
    margin-left: 16px !important;
    @media (max-width: 768px) {
      flex-direction: column;
      margin-left: 0 !important;
    }
  }

  ::v-deep .mdi-clock-outline {
    margin-top: 3.5px !important;
    margin-right: -8px;
  }

  &__select {
    max-width: 125px;
    @media (max-width: 768px) {
      max-width: 100% !important;
      width: 100% !important;
    }
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
    font-family: 'Open Sans', sans-serif !important;
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
    margin: 0 !important;
  }

  &--1 {
    @media (max-width: 768px) {
      // margin: 10px 18px !important;
    }
  }

  &--2 {
    @media (max-width: 768px) {
      //margin: 12px 18px 18px 0px !important;
    }
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
  font-family: 'Open Sans', sans-serif !important;
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

.p-0 {
  padding: 0 !important;
}

.timezone-in-modal {
  width: 104px !important;
  margin-top: -1px !important;
  margin-left: 0 !important;
  @media (max-width: 768px) {
    width: 100% !important;
  }
}

.select-in-modal {
  margin-top: -15px;
  margin-left: -44px;
  @media (max-width: 768px) {
    margin: 0 !important;
  }
}

.at-in-timezone {
  //margin: 12px 18px 18px 0px !important;
}
</style>
