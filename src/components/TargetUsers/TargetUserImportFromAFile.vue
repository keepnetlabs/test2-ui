<template>
  <app-modal
    :status="status"
    @closeOverlay="closeOverlay"
    :icon-name="'mdi-microsoft-excel'"
    :title="'Import Users From a File'"
    className="target-user-import-file"
  >
    <template v-slot:overlay-body>
      <v-col>
        <v-stepper light v-model="activeStep" class="wizard">
          <v-stepper-header class="wizard__header">
            <v-stepper-step :complete="activeStep > 1" step="1">Upload File</v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="activeStep > 2" step="2">Map Fields</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <!-- STEP 1 -->
            <v-stepper-content step="1">
              <div class="stepper__title">Upload File</div>
              <div class="stepper__subtitle">
                Select and upload an XLS or CSV file with user list
              </div>
              <v-list-item>
                <v-list-item-content>
                  <k-file-upload
                    @inputFile="onFileChanged"
                    hint="Only XLS or CSV files. Max. file size 30MB"
                    :extensions="['.xlsx', '.xls', '.csv']"
                    :is-stand-alone="true"
                  />
                  <p class="target-user-import-file__total-excel-score">
                    This xls file contains 81 rows and 8 columns
                  </p>
                </v-list-item-content>
              </v-list-item>
            </v-stepper-content>
            <!-- STEP 2 -->
            <v-stepper-content step="2">
              <div class="stepper__title">Map Fields</div>
              <div class="stepper__subtitle">
                Match field names from your file to the system fields to import users information
                correctly
              </div>
              <v-form ref="refMapForm" lazy-validation>
                <v-list-item class="mt-6">
                  <v-list-item-content class="mb-2 target-user-import-file__list-item">
                    <label class="bottom-margin">Select Group</label>
                    <v-select
                      :items="groups"
                      v-model="formData.groups"
                      item-text="name"
                      item-value="resourceId"
                      outlined
                      placeholder="Select an option"
                      :rules="[(v) => !!v || 'Required']"
                      :disabled="stepLock"
                      persistent-hint
                      hide-details
                    ></v-select>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="mt-6">
                  <v-list-item-content class="target-user-import-file__list-item">
                    <form-group
                      title="Mapping"
                      subTitle="Match field names with column header from your sheet to map information"
                    >
                    </form-group> </v-list-item-content
                ></v-list-item>
                <v-list-item class="target-user-import-file__list-item table-box-shadow">
                  <v-list-item-content class="mb-6 target-user-import-file__list-item__content">
                    <MapTable
                      ref="refMapTable"
                      :mapTableData="mappingData"
                      @get-map-table-data="getMapTableData" /></v-list-item-content
                ></v-list-item>
              </v-form>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </template>
    <template v-slot:overlay-footer>
      <div class="text-left">
        <v-btn
          class="playbook-rule-form__button"
          outlined
          rounded
          color="error"
          @click="closeOverlay"
          >{{ labels.Cancel }}</v-btn
        >
      </div>
      <div>
        <v-btn
          v-if="canPrev"
          class="playbook-rule-form__button mr-4"
          outlined
          rounded
          color="cyan"
          @click="prevStep"
        >
          {{ labels.Back }}
        </v-btn>

        <v-btn
          v-if="canNext"
          class="playbook-rule-form__button"
          style="color: white;"
          rounded
          color="#2196f3"
          @click="nextStep"
        >
          {{ labels.Next }}
        </v-btn>

        <v-btn
          v-if="!canNext"
          class="playbook-rule-form__button white--text"
          rounded
          color="#2196f3"
          @click="save"
        >
          {{ labels.Save }}
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '../AppModal'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import FormGroup from '../SmallComponents/FormGroup'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import { uploadExcelOrCsvForTargetUsers } from '../../api/targetUsers'
import MapTable from '../TargetUsers/subcomponents/MapTable'
import labels from '@/model/constants/labels'

export default {
  name: 'TargetUserImportFromAFile',
  components: { AppModal, KFileUpload, FormGroup, MapTable },
  props: {
    status: {
      type: Boolean
    },
    editData: {
      type: Object
    },
    customFields: {
      type: Array
    },
    columns: {
      required: true
    }
  },
  computed: {
    canNext() {
      return this.activeStep < this.totalStep
    },
    canPrev() {
      return this.activeStep > 1
    }
  },
  data() {
    return {
      labels,
      excelFile: null,
      activeStep: 1,
      step: 1,
      groups: ['All Users'],
      formData: { groups: 'All Users', file: null },
      stepLock: null,
      totalStep: 2,
      mappingData: {
        customFields: [
          { name: 'First Name', disabled: false },
          { name: 'Last Name', disabled: false },
          { name: 'Email', disabled: false },
          { name: 'Department', disabled: false },
          { name: 'Job Title', disabled: false },
          { name: 'Company', disabled: false },
          { name: 'City', disabled: false },
          { name: 'Big Numeros', disabled: false },
          { name: 'Phone', disabled: false }
        ],
        headers: [
          { name: 'First Name', disabled: false },
          { name: 'Last Name', disabled: false },
          { name: 'Email', disabled: false },
          { name: 'Department', disabled: false },
          { name: 'Job Title', disabled: false },
          { name: 'Company', disabled: false },
          { name: 'City', disabled: false },
          { name: 'Big Numeros', disabled: false },
          { name: 'Phone', disabled: false }
        ],
        tableData: [
          {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            department: 'Department',
            jobTitle: 'Job Title',
            company: 'Company',
            city: 'City'
          },
          {
            firstName: 'First Name22',
            lastName: 'Last Name22',
            email: 'Email22',
            department: 'Department22',
            jobTitle: 'Job Title22',
            company: 'Company22',
            city: 'City'
          },
          {
            firstName: 'First Name2233',
            lastName: 'Last Name2233',
            email: 'Email2233',
            department: 'Department2233',
            jobTitle: 'Job Title2233',
            company: 'Company2233',
            city: 'City'
          }
        ]
      }
    }
  },
  methods: {
    getMapTableData(data) {
      this.$refs.refMapTable.exportMapTableData()
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    onFileChanged(file) {
      this.formData.file = file
      uploadExcelOrCsvForTargetUsers(file)
        .then((response) => {})
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting details of uploaded file'
          })
        })
        .finally((response) => {
          this.mappingData.tableData = [
            {
              firstName: 'First Name',
              lastName: 'Last Name',
              email: 'Email',
              department: 'Department',
              jobTitle: 'Job Title',
              company: 'Company',
              city: 'City',
              bigNumeros: 'Big_Numeros',
              Country: 'Country'
            },
            {
              firstName: 'First Name22',
              lastName: 'Last Name22',
              email: 'Email22',
              department: 'Department22',
              jobTitle: 'Job Title22',
              company: 'Company22',
              city: 'City',
              bigNumeros: 'Big_Numeros',
              Country: 'Country'
            },
            {
              firstName: 'First Name2233',
              lastName: 'Last Name2233',
              email: 'Email2233',
              department: 'Department2233',
              jobTitle: 'Job Title2233',
              company: 'Company2233',
              city: 'City',
              bigNumeros: 'Big_Numeros',
              Country: 'Country'
            }
          ]
        })
    },
    submit() {},
    nextStep() {
      let isFormValid = true
      if (this.activeStep === 1) {
        isFormValid = !!this.formData.file
      } else if (this.activeStep === 2) {
        isFormValid = this.$refs.refMapForm.validate()
      }
      if (isFormValid) {
        this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
      }
      return isFormValid
    },
    prevStep() {
      this.activeStep = this.activeStep <= 1 ? 1 : this.activeStep - 1
    },
    save() {}
  },
  created() {
    this.mappingData.customFields = this.columns.map((item) => {
      return { name: item.label, disabled: false }
    })
  }
}
</script>

<style lang="scss">
.target-user-import-file {
  .wizard {
    .target-user-import-file__list-item {
      max-width: 100% !important;
      position: relative;
      overflow: auto;
      .target-user-import-file__list-item__content {
        display: flex;
        flex-flow: row;
        align-items: baseline;
        max-width: 200px;
      }
    }
  }

  &__total-excel-score {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-top: 16px;
  }
  .stepper {
    &__title {
      opacity: 0.9;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
    &__subtitle {
      opacity: 0.9;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }
  }

  .k-overlay__header {
    padding: 0 6rem;
    margin-top: 32px;
  }

  .v-overlay__content {
    width: 100%;
    height: 100%;
    background-color: white;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: auto;
  }

  .k-overlay__container {
    padding: 0 6rem;
    padding: 0 !important;
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f5f7fa;
    padding: 16px 96px !important;
    display: flex;
    justify-content: space-between;
    z-index: 9;

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

    &-btn-save {
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      width: 72px;
      height: 36px !important;
      border-radius: 18px;
      background-color: #2196f3;
    }
  }

  &__main-title {
    font-size: 24px;
    font-weight: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__main-sub-title {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__label {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: normal;
    margin-bottom: 8px !important;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  .v-input--switch {
    margin-top: 0;
    label {
      font-size: 16px;
      font-weight: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      margin-left: 8px;
    }
    .v-messages {
      display: none;
    }
  }
}
</style>
