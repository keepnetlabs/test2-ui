<template>
  <div>
    <app-dialog
      :status="closeTargetUserImport"
      @changeStatus="closeTargetUserImport = false"
      icon="mdi-close-circle"
      :title="labels.CancelUserImport"
      :subtitle="labels.CancelUserImportSubtitle"
      :body="labels.CancelUserImportBody"
    >
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          :cancel-button-text="labels.KeepEditing"
          :action-button-text="labels.CancelImport"
          cancel-button-color="#2196f3"
          action-button-color="#f56c6c"
          @handleClose="closeTargetUserImport = false"
          @handleConfirm="closeOverlay"
        />
      </template>
    </app-dialog>
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
                      :is-loading="step1Loading"
                    />
                    <p
                      class="target-user-import-file__total-excel-score"
                      v-if="!step1Loading && excelInfo"
                    >
                      {{
                        `This xls file contains ${excelInfo.rowCount} rows and ${excelInfo.columnCount} columns`
                      }}
                    </p>
                    <p class="target-user-import-file__total-excel-score" v-if="step1Loading">
                      {{ `The xls file is loading` }}
                      <v-icon
                        class="ml-1 loading-spin"
                        color="#2196f3"
                        style="font-size: 18px;"
                        left
                        medium
                        >mdi-rotate-left
                      </v-icon>
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
                <div v-if="step2Loading">
                  <ListItemLoading :loading="step2Loading" />
                  <DatatableLoading :loading="step2Loading" />
                </div>
                <div v-else>
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
                          placeholder="- All Users -"
                          :rules="[(v) => !!v || 'Required']"
                          :disabled="stepLock"
                          multiple
                          persistent-hint
                          hide-details
                        >
                          <template v-slot:selection="data" v-if="groups.length > 0">
                            <v-chip
                              :key="JSON.stringify(data.item)"
                              v-bind="data.attrs"
                              :input-value="data.selected"
                              small
                            >
                              {{ data.item.name }}
                              <v-icon
                                right
                                @click="data.parent.selectItem(data.item)"
                                style="font-size: 18px;"
                                >mdi-close-circle</v-icon
                              >
                            </v-chip>
                          </template>
                        </v-select>
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
                    <v-list-item class="target-user-import-file__list-item table-box-shadow mb-10">
                      <v-list-item-content class="mb-6 target-user-import-file__list-item__content">
                        <MapTable
                          v-if="activeStep === 2"
                          ref="refMapTable"
                          :mapTableData="mappingData"
                          @get-map-table-data="getMapTableData" /></v-list-item-content
                    ></v-list-item>
                  </v-form>
                </div>
              </v-stepper-content>
              <!-- STEP 3 -->
              <v-stepper-content step="3">
                <div class="stepper__title">Validate Information</div>
                <div class="stepper__subtitle">
                  Select users to import or import all listed users. Invalid entries will not be
                  imported.
                </div>
                <div class="mb-10" v-if="step3Loading">
                  <DatatableLoading :loading="step3Loading" />
                </div>
                <div class="mb-10" v-else>
                  <data-table
                    v-if="mappingStatus && showDatatable"
                    :loading="loading"
                    :is-column-filter-active="tableOptions.isColumnFilterActive"
                    :table="tableData"
                    id="validate-data-table"
                    ref="refValidateList"
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
                    :server-side-events="{ search: false, sort: false, pagination: false }"
                    :downloadButton="{
                      show: false
                    }"
                    @handleSelectionChange="handleSelectionChange"
                  >
                    <template v-slot:table-notification>
                      <div class="target-user-import-file__header-detail">
                        <v-btn
                          class="target-user-import-file__button target-user-import-file__button--table-notification"
                          outlined
                          rounded
                          @click="filterStatusChange()"
                        >
                          {{ setTableOption() }}
                        </v-btn>
                      </div>
                    </template>
                  </data-table>
                  <div
                    v-else-if="mappingStatus && !showDatatable"
                    class="target-user-import-file__progression"
                  >
                    <div class="target-user-import-file__progression--text">
                      Please wait while we are processing the file
                    </div>
                    <div class="target-user-import-file__progression--progress">
                      <div>{{ setProgressValue }}%</div>
                      <div>
                        <v-progress-linear :value="setProgressValue"></v-progress-linear>
                      </div>
                      <div>
                        {{
                          mappingStatus.newUserCount +
                          mappingStatus.existingUserCount +
                          mappingStatus.invalidUserCount +
                          '/' +
                          mappingStatus.totalRowCount
                        }}
                        users processed
                      </div>
                    </div>
                  </div>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-col>
      </template>
      <template v-slot:overlay-footer>
        <div class="text-left">
          <v-btn
            class="target-user-import-file__button"
            outlined
            rounded
            color="error"
            @click="cancelButtonClick"
            >{{ labels.Cancel }}</v-btn
          >
        </div>
        <div>
          <v-btn
            v-if="canPrev"
            class="target-user-import-file__button mr-4"
            outlined
            rounded
            color="cyan"
            @click="prevStep"
          >
            {{ labels.Back }}
          </v-btn>

          <v-btn
            v-if="canNext"
            class="target-user-import-file__button"
            style="color: white;"
            rounded
            color="#2196f3"
            @click="nextStep"
            :disabled="step1Loading || step2Loading"
          >
            {{ labels.Next }}
          </v-btn>

          <v-btn
            v-if="!canNext"
            class="target-user-import-file__button target-user-import-file__button--import-selected"
            rounded
            color="#2196f3"
            @click="save(labels.ImportSelected)"
            :disabled="!showDatatable || !tableData.length || selectedTableData"
          >
            {{ labels.ImportSelected }}
          </v-btn>
          <v-btn
            v-if="!canNext"
            class="target-user-import-file__button target-user-import-file__button--import-all"
            rounded
            color="#2196f3"
            @click="save(labels.ImportAll)"
            :disabled="
              !showDatatable ||
              !tableData.length ||
              mappingStatus.invalidUserCount === mappingStatus.totalRowCount
            "
          >
            {{ labels.ImportAll }}
          </v-btn>
          <v-menu
            v-if="!canNext"
            offset-y
            transition="scale-transition"
            :disabled="
              !showDatatable ||
              !tableData.length ||
              mappingStatus.invalidUserCount === mappingStatus.totalRowCount
            "
          >
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                color="white"
                v-on="on"
                class="target-user-import-file__button--menu"
                :disabled="!showDatatable"
              >
                <v-icon
                  :disabled="
                    !showDatatable ||
                    !tableData.length ||
                    mappingStatus.invalidUserCount === mappingStatus.totalRowCount
                  "
                  >mdi-dots-vertical</v-icon
                >
              </v-btn>
            </template>
            <div>
              <v-list dense flat class="notification-wrapper__v-list">
                <v-list-item-group color="primary">
                  <v-list-item @click="save('onlyImportNewUsers')">
                    <v-list-item-content>
                      <v-list-item-title> Only Import New Users</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="save('onlyUpdateExistingUsers')">
                    <v-list-item-content>
                      <v-list-item-title>Only Update Existing Users</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </v-menu>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import AppModal from '../AppModal'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import FormGroup from '../SmallComponents/FormGroup'
import AppDialog from '../AppDialog'
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
  getMappingStatus,
  getTargetGroups,
  getTargetUserCustomFieldsByCompanyId,
  getUploadedFileData,
  importTmpUsers,
  searchTmp,
  uploadExcelOrCsvForTargetUsers
} from '../../api/targetUsers'
import MapTable from '../TargetUsers/subcomponents/MapTable'
import labels from '@/model/constants/labels'
import DataTable from '../DataTable'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { scrollToComponent } from '@/utils/functions'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import ListItemLoading from '@/components/SkeletonLoading/ListItemLoading'

export default {
  name: 'TargetUserImportFromAFile',
  components: {
    ListItemLoading,
    AppDialogFooter,
    AppModal,
    KFileUpload,
    FormGroup,
    MapTable,
    DataTable,
    AppDialog,
    DatatableLoading
  },
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
    setProgressValue() {
      let users =
        this.mappingStatus.newUserCount +
        this.mappingStatus.existingUserCount +
        this.mappingStatus.invalidUserCount
      let number = (users * 100) / this.mappingStatus.totalRowCount
      return Math.round(number)
    },
    canNext() {
      return this.activeStep < this.totalStep
    },
    canPrev() {
      return this.activeStep > 1
    }
  },
  data() {
    return {
      selectedTableData: true,
      isLeaveAccepted: false,
      saveSuccess: false,
      step1Loading: false,
      step2Loading: false,
      step3Loading: false,
      responsNumbers: false,
      isShowInvalid: false,
      showDatatable: false,
      mappingStatus: null,
      isExcelUploaded: false,
      closeTargetUserImport: false,
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
      formData: { groups: [], file: null },
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
            property: PROPERTY_STORE.FIRSTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            dbName: 'FirstName',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.LASTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LASTNAME),
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'text',
            dbName: 'LastName',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
            sortable: true,
            show: true,
            type: 'text',
            width: 275,
            filterableType: 'text',
            dbName: 'Email',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.DEPARTMENT,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DEPARTMENT),
            sortable: true,
            show: true,
            type: 'text',
            width: 300,
            filterableType: 'text',
            dbName: 'Department',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            width: 180,
            fullWidth: true,
            dbName: 'Priority',
            emptyText: 'No Data'
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            dbName: 'CreateTime',
            emptyText: 'No Data'
          }
        ],
        backupColumns: [
          {
            property: PROPERTY_STORE.FIRSTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            dbName: 'FirstName',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.LASTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LASTNAME),
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'text',
            dbName: 'LastName',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
            sortable: true,
            show: true,
            type: 'text',
            width: 275,
            filterableType: 'text',
            dbName: 'Email',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.DEPARTMENT,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DEPARTMENT),
            sortable: true,
            show: true,
            type: 'text',
            width: 300,
            filterableType: 'text',
            dbName: 'Department',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            width: 180,
            fullWidth: true,
            dbName: 'Priority',
            emptyText: 'No Data'
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            dbName: 'CreateTime',
            emptyText: 'No Data'
          }
        ],
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
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'FirstName',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'LastName',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'Email',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'Department',
                  Operator: 'Contains',
                  Value: ''
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'Status',
                  Operator: 'Include',
                  Value: 'New,Exists,Error'
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  methods: {
    handleSelectionChange(selectedValues) {
      this.selectedTableData = !selectedValues.length
    },
    getLabelCount(label, data) {
      switch (label) {
        case labels.ImportSelected:
          let selectedValues = this.$refs.refValidateList
            .getSelectedMultipleValues()
            .map((item) => item.resourceId)
          return selectedValues.length
          break
        case labels.ImportAll:
          return this.tableData.length
        case 'onlyImportNewUsers':
          return this.responsNumbers.newUserCount
        case 'onlyUpdateExistingUsers':
          return this.responsNumbers.existingUserCount
        default:
          return ''
      }
    },
    filterStatusChange() {
      this.isShowInvalid = !this.isShowInvalid
      this.bodyData.filter.FilterGroups[1]['FilterItems'].find(
        (item) => item.FieldName === 'Status'
      ).Value = this.isShowInvalid ? 'Error' : 'New,Exists,Error'
      this.step3Loading = true
      this.getDatatableList()
    },
    setTableOption() {
      let val = !this.isShowInvalid
        ? `ONLY SHOW INVALID (${this.mappingStatus.invalidUserCount})`
        : `SHOW ALL ${this.mappingStatus.totalRowCount}`
      return val
    },
    onlyImportNewUsers() {},
    onlyUpdateExistingUsers() {},
    getMappingStatus() {
      let _this = this
      getMappingStatus(this.mappindgId)
        .then((response) => {
          _this.mappingStatus = response.data.data
          if (_this.mappingStatus.status === 'FinishedWithError' && _this.isExcelUploaded) {
            this.$store.dispatch('common/createSnackBar', {
              message: 'Something went wrong',
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
            this.getDatatableList()
          } else if (_this.mappingStatus.status !== 'Finished' && _this.isExcelUploaded) {
            setTimeout(() => {
              this.getMappingStatus()
            }, 2500)
          } else {
            this.getDatatableList()
          }
        })
        .catch((response) => {})
    },
    getTargetUsers() {
      getTargetGroups().then((response) => {
        this.groups = response.data.data
      })
    },
    cancelButtonClick() {
      if (this.isExcelUploaded) {
        this.closeTargetUserImport = true
      } else {
        this.isLeaveAccepted = true
        this.closeOverlay()
      }
    },
    getDatatableList() {
      let _this = this
      this.bodyData.pageSize = this.mappingStatus.totalRowCount
      searchTmp(this.bodyData, this.excelInfo.transactionId)
        .then((response) => {
          this.responsNumbers = response.data.data
          _this.tableOptions.columns = JSON.parse(JSON.stringify(_this.tableOptions.backupColumns))
          let data = ({ data, status } = response.data.data.items.results)
          if (data.length) {
            let customFields = data[0].customFields.map((item) => {
              let itemObj = {
                property: item.name,
                align: 'left',
                editable: false,
                label: item.name,
                fixed: false,
                sortable: false,
                show: true,
                type: 'text',
                dbName: 'item.name',
                width: 250,
                emptyText: 'No Data'
              }
              return itemObj
            })
            data = data.map((item) => {
              let fieldObj = item.customFields.map((i) => {
                return { [i.name]: i.value }
              })
              fieldObj.map((iItem) => {
                for (let key in iItem) {
                  if (iItem.hasOwnProperty(key)) {
                    item[key] = iItem[key]
                  }
                }
              })
              return item
            })
            _this.tableData = data || []
            _this.tableOptions.columns.push(...customFields)
            _this.tableOptions.columns.push({
              property: PROPERTY_STORE.STATUS,
              align: 'center',
              label: getStoreValue(PROPERTY_STORE.STATUS),
              fixed: false,
              sortable: true,
              show: true,
              type: 'status',
              isEditable: true,
              hasTooltip: true,
              fullWidth: true,
              dbName: 'Status',
              minWidth: 170,
              emptyText: 'No Data'
            })
          } else {
            _this.tableData = data || []
          }
          _this.loading = false
          _this.showDatatable = true
        })
        .catch((error) => {
          this.tableData = []
          this.loading = false
          this.$store.dispatch('common/createSnackBar', {
            message: 'Something went wrong',
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        })
        .finally(() => {
          this.step3Loading = false
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
      this.isLeaveAccepted = true
      this.$emit('closeOverlay')
    },
    onFileChanged(file) {
      this.formData.file = file
      this.isExcelUploaded = true
      this.step1Loading = true
      uploadExcelOrCsvForTargetUsers(file, (e) => {
        this.onUploadProgress = e
      })
        .then((response) => {
          this.excelInfo = response.data.data
        })
        .finally(() => {
          this.step1Loading = false
        })
    },
    getUploadedExcelData() {
      this.step2Loading = true
      getUploadedFileData(this.excelInfo.transactionId)
        .then((response) => {
          this.mappingData.tableData = response.data.data.data
          this.mappingData.headers = response.data.data['fileFieldNames'].map((item) => {
            let aItem = {
              name: item,
              selectedValue: null,
              required:
                this.mappingData.columns.find((mapItem) => {
                  let name = mapItem.dbName || mapItem.name
                  return (
                    name.toLowerCase().replace(/ +/g, '') === item.toLowerCase().replace(/ +/g, '')
                  )
                }) &&
                this.mappingData.columns.find((mapItem) => {
                  let name = mapItem.dbName || mapItem.name
                  return (
                    name.toLowerCase().replace(/ +/g, '') === item.toLowerCase().replace(/ +/g, '')
                  )
                }).required
            }
            return aItem
          })
          //this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
          this.resetDisabledValuesFromColumns()
        })
        .finally(() => {
          this.step2Loading = false
        })
    },
    resetDisabledValuesFromColumns() {
      setTimeout(() => {
        return this.$refs.refMapTable.setSelectDisableItemsToFalse()
      }, 200)
    },
    submit() {},
    createMapFields() {
      this.step3Loading = true
      let fieldMappingData = this.getMapTableData().headers.map((item) => {
        let val = {
          excelColumnName: item.name,
          fieldName:
            (item.selectedValue && item.selectedValue.dbName) ||
            (item.selectedValue && item.selectedValue.name) ||
            item.name
        }
        return val
      })
      let payload = {
        transactionId: this.excelInfo.transactionId,
        fieldMappings: fieldMappingData,
        targetGroupResourceIds: this.formData.groups
      }

      createMapping(payload)
        .then((response) => {
          this.showDatatable = false
          this.mappindgId = response.data.data.resourceId
          this.getMappingStatus()
        })
        .finally(() => {
          this.step3Loading = false
        })
    },
    nextStep() {
      let isFormValid = true
      if (this.activeStep === 1) {
        isFormValid = !!this.formData.file
      } else if (this.activeStep === 2) {
        isFormValid =
          this.$refs.refMapForm.validate() && this.$refs.refMapTable.getMapTableDataValidation()
        if (!isFormValid) {
          this.$refs.refMapTable.showErrorSelect()
        }
      }
      if (isFormValid) {
        if (this.activeStep === 1) {
          this.step2Loading = true
          this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
          this.getUploadedExcelData()
        } else if (this.activeStep === 2) {
          this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
          this.step3Loading = true
          this.createMapFields()
        } else {
          this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
        }
      }
      return isFormValid
    },
    prevStep() {
      this.activeStep = this.activeStep <= 1 ? 1 : this.activeStep - 1
      if (this.activeStep === 3) {
        this.tableData = []
        this.resetDisabledValuesFromColumns()
      }
      if (this.activeStep === 2) {
      }
    },
    save(label) {
      let payload
      switch (label) {
        case labels.ImportSelected:
          let selectedValues = this.$refs.refValidateList
            .getSelectedMultipleValues()
            .map((item) => item.resourceId)
          if (!selectedValues.length) return false
          payload = { ImportType: 'ImportSelected', SelectedResourceIds: selectedValues }
          break
        case labels.ImportAll:
          payload = { ImportType: 'ImportAll' }
          break
        case 'onlyImportNewUsers':
          payload = { ImportType: 'OnlyNew' }
          break
        case 'onlyUpdateExistingUsers':
          payload = { ImportType: 'OnlyUpdateExisting' }
          break
        default:
          return ''
      }
      importTmpUsers(payload, this.excelInfo.transactionId).then(() => {
        this.saveSuccess = true
        this.closeOverlay()
        this.$store.dispatch('common/createSnackBar', {
          message: `${this.getLabelCount(label)} Import process has been started`,
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          icon: 'mdi-information'
        })
      })
    },
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
          _this.mappingData.columns = _this.columns
            .map((item) => {
              if (item.label !== 'Status' && item.label !== 'Date Created') {
                return {
                  name: item.label,
                  disabled: false,
                  selectedValue: null,
                  dbName: item.dbName,
                  required: item.dbName
                    ? true
                    : response.data.data.find((responseItem) => {
                        let name = item.dbName || item.label
                        return responseItem.name.toLowerCase() === name.toLowerCase()
                      }) &&
                      response.data.data.find((responseItem) => {
                        let name = item.dbName || item.label
                        return responseItem.name.toLowerCase() === name.toLowerCase()
                      }).isRequired
                }
              }
            })
            .filter((filteredItem) => !!filteredItem)
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
    this.getTargetUsers()
  },
  beforeRouteLeave(to, from, next) {
    if (this.isExcelUploaded) {
      next(false)
    } else if (this.isLeaveAccepted) {
      next()
    } else next()
  }
}
</script>

<style lang="scss">
.target-user-import-file {
  #validate-data-table {
    .selection-row {
      top: inherit !important;
    }
  }
  &__header-detail {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    background-color: #fafafa !important;
    height: 48px;
    display: flex;
    align-items: center;
    padding-left: 25px;
  }
  &__button {
    &--table-notification {
      font-size: 14px !important;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal !important;
      color: #2196f3 !important;
      border-radius: 18px;
      border: solid 1px #2196f3;
    }
    &--import-selected {
      border-radius: 18px;
      border: solid 1px #2196f3;
      font-size: 14px !important;
      font-weight: 600 !important;
      background-color: white !important;
      background: white !important;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal !important;
      color: #2196f3 !important;
      box-shadow: none !important;
      margin-right: 8px;
    }
    &--import-all {
      border-radius: 18px;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
      background-color: var(--primary);
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: right;
      color: white !important;
      margin-right: 4px;
    }
    &--menu {
      background: #2196f3;
    }
  }
  &__progression {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 340px;
    flex-flow: column;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
      0 1px 1px -1px rgba(204, 204, 204, 0.12);
    &--text {
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: #383b41;
      margin-bottom: 44px;
    }
    &--progress {
      font-size: 10px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.9;
      letter-spacing: normal;
      text-align: center;
      color: #383b41;
      display: flex;
      flex-flow: column;
      .v-progress-linear {
        width: 167px;
      }
    }
  }
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
