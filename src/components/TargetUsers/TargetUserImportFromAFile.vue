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
            <v-divider />
            <v-stepper-step :complete="activeStep > 3" step="3">Validate</v-stepper-step>
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
                    ref="refFileUpload"
                    :extensions="['.xlsx', '.xls', '.csv']"
                    :is-stand-alone="true"
                    @inputFile="onFileChanged"
                    hint="Only XLS or CSV files. Max. file size 30MB"
                    :on-upload-progress="onUploadProgress"
                  />
                  <p class="target-user-import-file__total-excel-score" v-if="excelInfo">
                    {{
                      `This xls file contains ${excelInfo.rowCount} rows and ${excelInfo.columnCount} columns`
                    }}
                  </p>
                  <div class="d-flex mt-8">
                    <v-btn
                      @click="downloadExampleFile()"
                      class="download-excel"
                      rounded
                      :disabled="excelLoading"
                    >
                      <v-icon class="close-icon">mdi-download</v-icon> Download Example Sheet
                      <v-icon
                        class="ml-2 loading-spin"
                        color="#2196f3"
                        left
                        medium
                        v-if="excelLoading"
                        >mdi-rotate-left
                      </v-icon>
                    </v-btn>
                  </div>
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
            <!-- STEP 3 -->
            <v-stepper-content step="3">
              <div class="stepper__title">Validate Information</div>
              <div class="stepper__subtitle">
                Select users to import or import all listed users. Invalid entries will not be
                imported.
              </div>
              <data-table
                :loading="loading"
                :is-column-filter-active="tableOptions.isColumnFilterActive"
                :table="tableData"
                id="validate-data-table"
                ref="refValideateList"
                :empty="tableOptions.empty"
                :refName="'validateList'"
                :columns="tableOptions.columns"
                :countRow="5"
                :selectable="true"
                :filterable="true"
                :options="true"
                :sizeable="true"
                :pageSizes="tableOptions.pageSizes"
                :select-event="tableOptions.selectEvent"
                :row-actions="tableOptions.rowActions"
                :addButton="tableOptions.addButton"
                @downloadEvent="exportIntegrationList"
                @sortChangedEvent="sortChangedEvent($event)"
                @paginationChangedEvent="paginationChangedEvent($event)"
                @searchChangedEvent="searchChangedEvent($event)"
                :dataLength="tableData && tableData.totalNumberOfRecords"
                :requestParams="bodyData"
                :isServerSide="true"
                @columnFilterChanged="columnFilterChanged"
                @columnFilterCleared="columnFilterCleared"
                :server-side-events="{ search: true, sort: false, pagination: false }"
              ></data-table>
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
import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'
import {
  createMapping,
  createTargetUserCustomField,
  downloadExampleTargetUserFile,
  getTargetUserCustomFieldsByCompanyId,
  getUploadedFileData,
  searchTmp,
  uploadExcelOrCsvForTargetUsers
} from '../../api/targetUsers'
import MapTable from '../TargetUsers/subcomponents/MapTable'
import labels from '@/model/constants/labels'
import DataTable from '../DataTable'

export default {
  name: 'TargetUserImportFromAFile',
  components: { AppModal, KFileUpload, FormGroup, MapTable, DataTable },
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
      excelLoading: false,
      mappindgId: null,
      excelInfo: null,
      onUploadProgress: null,
      unActiveCustomFields: null,
      copyOfCustomFields: null,
      labels,
      excelFile: null,
      activeStep: 1,
      step: 1,
      groups: ['All Users'],
      formData: { groups: 'All Users', file: null },
      stepLock: null,
      totalStep: 3,
      mappingData: {
        columns: [],
        headers: [],
        tableData: []
      },
      tableData: [],
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Integration Name',
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 250,
            filterableType: 'text',
            filterableCustomFieldName: 'Name'
          },
          {
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DESCRIPTION),
            sortable: true,
            show: true,
            type: 'text',
            width: 350,
            filterableType: 'text',
            filterableCustomFieldName: 'Description'
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 160,
            hasTooltip: true,
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            filterableItems: ['Active', { text: 'Inactive', value: 'InActive' }]
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 185,
            filterableType: 'date',
            filterableCustomFieldName: 'createTime'
            //minWidth: 80
          }
        ],
        downloadButton: {
          show: true
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        pageSizes: [5, 10, 25],
        empty: {
          message: LABEL_STORE.NO_DATA
        }
      },
      bodyData: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  methods: {
    getDatatableList() {
      searchTmp(this.bodyData, this.excelInfo.transactionId)
        .then((response) => {
          if (!response.data.data.items.results.length) {
            setTimeout(() => {
              this.getDatatableList()
            }, 10000)
          } else {
            this.activeStep =
              this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
            const {
              data: { data, status }
            } = response.data.data.items.results
            this.tableData = data || []
            this.loading = false
          }
        })
        .catch((error) => {
          this.tableData = []
          this.loading = false
        })
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.bodyData.filter.FilterGroups[0].FilterItems
      requestBody.map((x, i, t) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        const { FieldName, Value } = filter
        if (FieldName === 'Status' && Value === '') {
        } else {
          requestBody.push(elem)
        }
      }

      this.bodyData.filter.FilterGroups[0].FilterItems = requestBody
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.bodyData.filter.FilterGroups[0].FilterItems

      filterPayload.map((x, i, t) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.bodyData.filter.FilterGroups[0].FilterItems = filterPayload
      this.getDatatableList()

      this.tableOptions.isColumnFilterActive =
        this.bodyData.filter.FilterGroups[0].FilterItems.length >= 1
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }
      this.getDatatableList()
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      this.getDatatableList()
    },
    sortChangedEvent({ prop, order }) {
      this.bodyData = { ...this.bodyData, orderBy: prop, ascending: order === 'ascending' }
      this.getDatatableList()
    },
    exportIntegrationList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyData.filter
        }
        exportReportedEmails(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `integrations.${exportType.toLocaleLowerCase()}`
            link.click()
          })
          .catch((error) => {})
      })
    },
    downloadExampleFile() {
      let payload = { exportType: 'Excel' }
      this.excelLoading = true
      downloadExampleTargetUserFile(payload)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'target_user_sample_file.xlsx') //or any other extension
          document.body.appendChild(link)
          link.click()
        })
        .finally((response) => {
          this.excelLoading = false
        })
    },
    getMapTableData(data) {
      return this.$refs.refMapTable.getMapTableData()
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    onFileChanged(file) {
      this.formData.file = file
      uploadExcelOrCsvForTargetUsers(file, (e) => {
        this.onUploadProgress = e
      })
        .then((response) => {
          this.excelInfo = response.data.data
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            message: error.data.message,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        })
    },
    getUploadedExcelData() {
      getUploadedFileData(this.excelInfo.transactionId)
        .then((response) => {
          this.mappingData.tableData = response.data.data.data
          this.mappingData.headers = response.data.data['fileFieldNames'].map((item) => {
            let aItem = {
              name: item,
              selectedValue: null
            }
            return aItem
          })
          this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            message: error.data.message,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        })
    },
    submit() {},
    createMapFields() {
      let fieldMappingData = this.getMapTableData().headers.map((item) => {
        let val = {
          excelColumnName: item.name,
          fieldName: (item.selectedValue && item.selectedValue.dbName) || item.selectedValue.name
        }
        return val
      })
      let payload = {
        transactionId: this.excelInfo.transactionId,
        fieldMappings: fieldMappingData
      }

      createMapping(payload)
        .then((response) => {
          this.mappindgId = response.data.data.resourceId
          this.getDatatableList()
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            message: error.data.message,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        })
    },
    nextStep() {
      let isFormValid = true
      if (this.activeStep === 1) {
        isFormValid = !!this.formData.file
      } else if (this.activeStep === 2) {
        isFormValid =
          this.$refs.refMapForm.validate() && this.$refs.refMapTable.getMapTableDataValidation()
      }
      if (isFormValid) {
        if (this.activeStep === 1) {
          this.getUploadedExcelData()
        } else if (this.activeStep === 2) {
          this.createMapFields()
        } else {
          this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
        }
      }
      return isFormValid
    },
    prevStep() {
      this.activeStep = this.activeStep <= 1 ? 1 : this.activeStep - 1
    },
    save() {},
    callForGetTargetUserCustomFieldsByCompanyId() {
      let _this = this
      this.loading = true
      getTargetUserCustomFieldsByCompanyId()
        .then((response) => {
          /*const { data } = response
          _this.customFields = data.data.filter((item) => {
            return item.isActive
          })
          _this.unActiveCustomFields = data.data.filter((item) => {
            return !item.isActive
          })
          //this.sortCustomFields(this.customFields)
          this.sortCustomFields(this.unActiveCustomFields)
          this.copyOfCustomFields = JSON.parse(JSON.stringify(this.customFields))*/
          _this.mappingData.columns = _this.columns.map((item) => {
            return { name: item.label, disabled: false, selectedValue: null, dbName: item.dbName }
          })
        })
        .finally(() => (this.loading = false))
    },
    sortCustomFields(data = []) {
      const sortProp = 'sortOrder'
      data.sort((a, b) => {
        if (a[sortProp] > b[sortProp]) {
          return 1
        } else if (a[sortProp] === b[sortProp]) {
          return 0
        }
        return -1
      })
    }
  },
  created() {
    this.callForGetTargetUserCustomFieldsByCompanyId()
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
  .download-excel {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #00bcd4;
    box-shadow: none;
    padding: 0 !important;
    background-color: white !important;
    i {
      font-size: 20px;
      margin-top: 4px;
    }
    &:hover,
    &:focus,
    &:focus-within {
      outline: 0 !important;
    }
    &:before {
      outline: 0 !important;
      background-color: white !important;
    }
  }

  &__total-excel-score {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    margin-top: 16px;
    color: #2196f3;
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
