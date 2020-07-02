<template>
  <app-modal :status="status" icon-name="mdi-file-excel" title="Import Users From a File">
    <template v-slot:overlay-body>
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
                <v-list-item-content> </v-list-item-content>
              </v-list-item>
            </div>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <div class="upload-file-stepper">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="import-users-file__title">
                    Map Fields</v-list-item-title
                  >
                  <v-list-item-subtitle class="import-users-file__sub-title"
                    >Match field names from your file to the system fields to import users
                    information correctly</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="map-fields__list-item map-fields__list-item--1">
                <p class="map-fields__title mr-7">Select Group</p>
                <v-select
                  class="map-fields__select"
                  :items="[]"
                  outlined
                  v-model="formValues.group"
                  placeholder="Delete Email"
                ></v-select>
              </v-list-item>
              <v-list-item class="map-fields__list-item map-fields__list-item--2">
                <p class="map-fields__title" style="margin-right: 34px;">Select Sheet</p>
                <v-select
                  class="map-fields__select"
                  :items="[]"
                  outlined
                  v-model="formValues.sheet"
                  placeholder="Sheet 1"
                ></v-select>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="map-fields__title" style="font-size: 20px;">
                    Mapping</v-list-item-title
                  >
                  <v-list-item-subtitle class="import-users-file__sub-title"
                    >Match field names with column header from your sheet to map
                    information</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </div>
            <v-list-item class="map-fields__list-item mt-2">
              <v-list-item-content>
                <mapper ref="refMapper" :columns="mapperColumns" />
              </v-list-item-content>
            </v-list-item>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3"> </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template v-slot:overlay-footer>
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
    </template>
  </app-modal>
</template>

<script>
import AppModal from '../AppModal'
import Mapper from '../Mapper'
export default {
  name: 'ImportUsersFromFileModal',
  components: {
    AppModal,
    Mapper
  },
  data() {
    return {
      step: 1,
      formValues: {
        sheet: '',
        group: ''
      },
      mapperColumns: [
        {
          property: 'firstName',
          width: 250,
          show: true,
          label: 'First Name'
        },
        {
          property: 'lastName',
          width: 250,
          show: true,
          label: 'Last Name'
        },
        {
          property: 'email',
          width: 250,
          show: true,
          label: 'Email'
        },
        {
          property: 'department',
          width: 250,
          show: true,
          label: 'Department',
          isCustom: true
        },
        {
          property: 'jobTitle',
          width: 250,
          show: true,
          label: 'Job Title',
          isCustom: true
        },
        {
          property: 'middleName',
          width: 250,
          show: true,
          label: 'Middle Name',
          isCustom: true
        }
      ]
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
  },
  mounted() {
    this.$refs.refMapper.loadWithDataArray([
      {
        firstName: 'Gürkan',
        lastName: 'Ugurlu',
        email: 'gurkan.ugurlu@keepnetlabs.com',
        department: 'Computer',
        jobTitle: 'Engineer',
        middleName: 'Nurkan'
      },
      {
        firstName: 'Gürkan',
        lastName: 'Ugurlu',
        email: 'gurkan.ugurlu@keepnetlabs.com',
        department: 'Computer',
        jobTitle: 'Engineer',
        middleName: 'Nurkan'
      },
      {
        firstName: 'Gürkan',
        lastName: 'Ugurlu',
        email: 'gurkan.ugurlu@keepnetlabs.com',
        department: 'Computer',
        jobTitle: 'Engineer',
        middleName: 'Nurkan'
      }
    ])
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
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      width: 86px;
      height: 36px !important;
    }

    &-btn-next {
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
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
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
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
    line-height: 1.3;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
}
.map-fields {
  &__list-item {
    .v-list-item__content {
      padding: 1px;
      overflow-x: auto;
    }
    &--1 {
      margin-top: 24px;
    }
    &--2 {
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    margin-top: -2px;
  }

  &__select {
    max-width: 205px;
  }
}
</style>
