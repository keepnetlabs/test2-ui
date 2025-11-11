<template>
  <Fragment>
    <CreateNewUserGroupModal
      v-if="isTargetGroupModalVisible"
      :status="isTargetGroupModalVisible"
      :is-create-button-disabled="isCreateTargetGroupButtonDisabled"
      @changeNewUserGroupStatus="handleCloseTargetGroupModal"
      @handleSave="handleConfirmTargetGroupModal"
    />
    <div id="target-users-people-import-from-file">
      <app-dialog
        icon="mdi-close-circle"
        :status="closeTargetUserImport"
        :title="labels.CancelUserImport"
        :subtitle="labels.CancelUserImportSubtitle"
        :body="labels.CancelUserImportBody"
        title-id="text--target-users-people-import-from-file-cancel-popup-title"
        subtitle-id="text--target-users-people-import-from-file-cancel-popup-subtitle"
        @changeStatus="closeTargetUserImport = false"
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
      <target-users-required-area
        v-if="showRequiredAreaModal"
        :status="showRequiredAreaModal"
        :dialogBody="getDialogBody"
        @close-overlay="showRequiredAreaModal = false"
      />
      <target-users-check-license-dialog
        v-if="showLicenseExceededDialog"
        :status="showLicenseExceededDialog"
        :dialogBody="getDialogBodyForExceed"
        @close-overlay="showLicenseExceededDialog = false"
      >
        <template #footer>
          <app-dialog-footer
            @handleClose="showLicenseExceededDialog = false"
            @handleConfirm="save(selectedActionName)"
          />
        </template>
      </target-users-check-license-dialog>
      <app-modal
        className="target-user-import-file"
        title-id="text--target-users-people-import-user-from-file-modal-title"
        subtitle-id="text--target-users-people-import-user-from-file-modal-subtitle"
        :status="status"
        :icon-name="'mdi-microsoft-excel'"
        :title="'Import Users From a File'"
        @closeOverlay="closeOverlay"
      >
        <template v-slot:overlay-body>
          <v-col>
            <v-stepper light v-model="activeStep" class="wizard">
              <v-stepper-header class="wizard__header">
                <v-stepper-step
                  id="step--target-user-import-from-file-modal-upload-file"
                  :complete="activeStep > 1"
                  step="1"
                  >Upload File</v-stepper-step
                >
                <v-divider />
                <v-stepper-step
                  id="step--target-user-import-from-file-modal-map-fields"
                  :complete="activeStep > 2"
                  step="2"
                  >Map Fields</v-stepper-step
                >
                <v-divider />
                <v-stepper-step
                  id="step--target-user-import-from-file-modal-validate"
                  :complete="activeStep > 3"
                  step="3"
                  >Validate</v-stepper-step
                >
              </v-stepper-header>

              <v-stepper-items>
                <!-- STEP 1 -->
                <v-stepper-content step="1">
                  <div class="stepper__title">Upload File</div>
                  <div class="stepper__subtitle">
                    Select and upload an XLS, XLSX or CSV file with user list
                  </div>
                  <v-list-item>
                    <v-list-item-content>
                      <k-file-upload
                        ref="refFileUpload"
                        :extensions="['.xlsx', '.xls', '.csv']"
                        :is-stand-alone="true"
                        @inputFile="onFileChanged"
                        hint="Only XLS/XLSX or CSV files. Max. file size 200MB"
                        :on-upload-progress="onUploadProgress"
                        :is-loading="step1Loading"
                        :size="200"
                        :is-backend-parsed="isBackendParsed"
                      />
                      <p
                        class="target-user-import-file__total-excel-score"
                        v-if="!step1Loading && excelInfo && isValidUserFile"
                      >
                        {{
                          `This uploaded file contains ${excelInfo.rowCount} rows and ${
                            excelInfo.columnCount
                          } columns ${
                            excelInfo.duplicateCount
                              ? `(${excelInfo.duplicateCount} duplicate row)`
                              : ''
                          }`
                        }}
                      </p>
                      <p
                        class="target-user-import-file__total-excel-score target-user-import-file__total-excel-score--error"
                        v-if="formData.file && !isValidUserFile && !step1Loading"
                      >
                        This file does not contain enough records to continue this process.
                      </p>
                      <p class="target-user-import-file__total-excel-score" v-if="step1Loading">
                        {{ `The uploaded file is loading` }}
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
                          <v-icon class="close-icon">mdi-download</v-icon>
                          Download Example Sheet
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
                    Match field names from your file to the system fields to import users
                    information correctly
                  </div>
                  <div v-if="step2Loading">
                    <ListItemLoading :loading="step2Loading" />
                    <DatatableLoading :loading="step2Loading" />
                  </div>
                  <div v-else>
                    <v-form ref="refMapForm" lazy-validation>
                      <v-list-item class="mt-6">
                        <v-list-item-content class="mb-2">
                          <label for="input--target-user-groups-ldap" class="bottom-margin"
                            >Select Group</label
                          >
                          <KSelect
                            v-model="formData.groups"
                            ref="refTargetGroupSelect"
                            type="autocomplete"
                            id="input--target-user-groups-ldap"
                            custom-menu-class="target-user-ldap__target-groups"
                            outlined
                            clearable
                            multiple
                            item-text="name"
                            item-value="resourceId"
                            item-disabled="disabled"
                            autocomplete="disabled"
                            placeholder="- All Users -"
                            no-data-text="No user group available"
                            position="bottom"
                            :items="groups"
                            :menu-props="{
                              offsetY: true,
                              maxWidth: '554px'
                            }"
                            :rules="[(v) => !!v || 'Required']"
                            :disabled="stepLock"
                            :slots="{
                              selection: true,
                              prependItem: true,
                              item: true
                            }"
                          >
                            <template #prependItem>
                              <v-list-item ripple @mousedown.prevent @click="handleCreateGroup">
                                <v-list-item-action>
                                  <v-icon color="#757575">
                                    mdi-plus
                                  </v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                  <v-list-item-title>
                                    <span style="font-weight: 600;">Create new group</span>
                                  </v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </template>
                            <template #selection="data" v-if="groups.length > 0">
                              <v-chip
                                :key="JSON.stringify(data.item)"
                                v-bind="data.attrs"
                                small
                                :input-value="data.selected"
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
                            <template #item="{ item,parent,attrs,on }">
                              <VListItem>
                                <VListItemAction v-on="on">
                                  <VSimpleCheckbox
                                    v-on="on"
                                    :value="attrs.inputValue"
                                    color="#2196f3"
                                    :disabled="item.disabled"
                                  />
                                </VListItemAction>
                                <VListItemContent
                                  v-on="on"
                                  :class="item.disabled ? 'cursor-default' : 'cursor-pointer'"
                                >
                                  <VListItemTitle>
                                    <VTooltip v-if="item.disabled" bottom>
                                      <template #activator="{on}">
                                        <span v-on="on" style="color: rgba(0, 0, 0, 0.38);">
                                          {{ item.name }}
                                        </span>
                                      </template>
                                      <span>{{
                                        `${
                                          item.isScimGroup ? 'SCIM' : 'Google'
                                        } synced group cannot be selected`
                                      }}</span>
                                    </VTooltip>
                                    <span v-else>
                                      {{ item.name }}
                                    </span>
                                  </VListItemTitle>
                                </VListItemContent>
                              </VListItem>
                            </template>
                          </KSelect>
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
                      <div class="target-user-import-file__list-item pl-1 pr-1 pt-1 mb-10">
                        <div class="mb-6 target-user-import-file__list-item__content">
                          <MapTable
                            v-if="activeStep === 2"
                            ref="refMapTable"
                            :mapTableData="mappingData"
                            @get-map-table-data="getMapTableData"
                          />
                        </div>
                      </div>
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
                  <DatatableLoading :loading="step3InitialLoading" />
                  <div class="validate-data-table-wrapper">
                    <data-table
                      v-if="mappingStatus && showDatatable"
                      ref="refValidateList"
                      id="validate-data-table"
                      selectable
                      filterable
                      options
                      is-server-side
                      :loading="step3Loading"
                      :table="tableData"
                      :empty="tableOptions.empty"
                      :columns="tableOptions.columns"
                      :select-event="tableOptions.selectEvent"
                      :row-actions="tableOptions.rowActions"
                      :addButton="tableOptions.addButton"
                      :server-side-props="serverSideProps"
                      :server-side-events="{
                        pagination: true,
                        search: true,
                        sort: true
                      }"
                      :downloadButton="{
                        show: true
                      }"
                      :show-filter-options="false"
                      :add-row-class-name="addRowClassName"
                      @downloadEvent="exportIntegrationList"
                      @sortChangedEvent="sortChangedEvent($event)"
                      @searchChangedEvent="searchChangedEvent($event)"
                      @columnFilterChanged="columnFilterChanged"
                      @columnFilterCleared="columnFilterCleared"
                      @refreshAction="callForGetTargetUserCustomFieldsByCompanyId"
                      @server-side-page-number-changed="serverSidePageNumberChanged"
                      @server-side-size-changed="serverSideSizeChanged"
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
                      v-else-if="mappingStatus && !showDatatable && !showDatatableErrorState"
                      class="target-user-import-file__progression"
                    >
                      <div class="target-user-import-file__progression--text">
                        Please wait while we are processing the file
                      </div>
                      <v-alert dense outlined type="info" v-if="mappingStatus.status === 'Idle'">
                        Process is Queued
                      </v-alert>
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
                    <div
                      v-if="showDatatableErrorState && mappingStatus.status === 'FinishedWithError'"
                      class="target-user-import-file__error"
                    >
                      <div class="target-user-import-file__error--text">
                        <v-icon
                          class="target-user-import-file__error--text--icon"
                          small
                          color="error"
                          >mdi-alert-circle</v-icon
                        >
                        An error occured while processing the imported file
                      </div>
                      <div class="target-user-import-file__error__button">
                        <v-btn
                          class="target-user-import-file__error__button--primary"
                          outlined
                          rounded
                          color="white"
                          @click="getMappingStatus"
                        >
                          <v-icon
                            color="white"
                            class="target-user-import-file__error__button--icon"
                            small
                            >mdi-refresh</v-icon
                          >
                          {{ labels.Retry }}</v-btn
                        >
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
              id="btn-cancel--target-users-import-people-modal"
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
              id="btn-back--target-users-import-people-modal"
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
              id="btn-next--target-users-import-people-modal"
              class="target-user-import-file__button"
              style="color: white;"
              rounded
              color="#2196f3"
              :disabled="isNextStepDisabled"
              @click="nextStep"
            >
              {{ labels.Next }}
            </v-btn>

            <v-btn
              v-if="!canNext"
              id="btn-import-selected--target-users-import-people-modal"
              class="target-user-import-file__button target-user-import-file__button--import-selected"
              rounded
              color="#2196f3"
              @click="showConfirmModal(labels.ImportSelected)"
              :disabled="!showDatatable || !tableData.length || selectedTableData"
            >
              {{ labels.ImportSelected }}
            </v-btn>
            <v-btn
              v-if="!canNext"
              id="btn-import-all--target-users-import-people-modal"
              class="target-user-import-file__button target-user-import-file__button--import-all"
              rounded
              color="#2196f3"
              @click="showConfirmModal(labels.ImportAll)"
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
                    <v-list-item
                      id="btn-import-new-users--target-users-import-people-modal"
                      @click="showConfirmModal('onlyImportNewUsers')"
                    >
                      <v-list-item-content>
                        <v-list-item-title> Only Import New Users</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      id="btn-import-existing-users--target-users-import-people-modal"
                      @click="showConfirmModal('onlyUpdateExistingUsers')"
                    >
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
  </Fragment>
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
} from '@/model/constants/commonConstants'
import {
  createMapping,
  downloadExampleTargetUserFile,
  exportTargetUserBulk,
  getMappingStatus,
  getTargetGroups,
  getTargetUserCustomFieldsByCompanyId,
  getUploadedFileData,
  importTmpUsers,
  searchTmp,
  updateTransactionId,
  uploadExcelOrCsvForTargetUsers,
  createTargetGroup
} from '@/api/targetUsers'
import MapTable from '../TargetUsers/subcomponents/MapTable'
import labels from '@/model/constants/labels'
import DataTable from '../DataTable'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import ListItemLoading from '@/components/SkeletonLoading/ListItemLoading'
import TargetUsersRequiredArea from '@/components/TargetUsers/TargetUsersRequiredArea'
import TargetUsersCheckLicenseDialog from '@/components/TargetUsers/TargetUsersCheckLicenseDialog'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { mapGetters } from 'vuex'
import CreateNewUserGroupModal from '@/components/TargetUsers/CreateNewUserGroupModal'
import { Fragment } from 'vue-frag'
import KSelect from '@/components/Common/Inputs/KSelect'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import useCachableDialog from '@/mixins/useCachableDialog'
export default {
  name: 'TargetUserImportFromAFile',
  components: {
    Fragment,
    CreateNewUserGroupModal,
    TargetUsersRequiredArea,
    ListItemLoading,
    AppDialogFooter,
    AppModal,
    KFileUpload,
    FormGroup,
    MapTable,
    DataTable,
    AppDialog,
    DatatableLoading,
    TargetUsersCheckLicenseDialog,
    KSelect
  },
  mixins: [useCachableDialog],
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
    },
    companyLicense: {
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getTimezones: 'common/getTimezones',
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    getDialogBodyForExceed() {
      return this.companyLicense
        ? `Your license allows to use the system with ${this.companyLicense.licenseLimit} target users. Current target user count is ${this.companyLicense.totalUserCount}.`
        : ''
    },
    getDialogBody() {
      return this.showRequiredAreaModal
        ? `Please select the following required fields: ${this.requiredFields.toString()}`
        : ''
    },
    setProgressValue() {
      let users =
        this.mappingStatus.newUserCount +
        this.mappingStatus.existingUserCount +
        this.mappingStatus.invalidUserCount
      let number = (users * 100) / this.mappingStatus.totalRowCount
      return Math.round(number)
    },
    isValidUserFile() {
      return this.excelInfo && this.excelInfo.rowCount > 0 && this.excelInfo.transactionId
    },
    isNextStepDisabled() {
      if (this.step1Loading || this.step2Loading) {
        return true
      }

      if (this.activeStep === 1 && !this.isValidUserFile) {
        return true
      }

      return !(this.excelInfo && this.excelInfo.transactionId)
    },
    canNext() {
      return this.activeStep < this.totalStep
    },
    canPrev() {
      return this.activeStep > 1
    }
  },
  watch: {
    getTimezones: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val?.timeZoneList?.length) this.setTimeZoneFilterableItems()
      }
    }
  },
  data() {
    return {
      isTargetGroupModalVisible: false,
      isCreateTargetGroupButtonDisabled: false,
      isBackendParsed: false,
      allCustomColumns: null,
      serverSideProps: new ServerSideProps(),
      step3InitialLoading: false,
      selectedActionName: null,
      showLicenseExceededDialog: false,
      requiredFields: [],
      showRequiredAreaModal: false,
      selectedTableData: true,
      isLeaveAccepted: false,
      saveSuccess: false,
      step1Loading: false,
      step2Loading: false,
      step3Loading: false,
      responsNumbers: false,
      isShowInvalid: false,
      showDatatable: false,
      showDatatableErrorState: false,
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
      languageFilterOptions: [],
      tableData: [],
      tableOptions: {
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
            property: PROPERTY_STORE.PHONENUMBER,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PHONENUMBER),
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'text',
            dbName: 'PhoneNumber',
            emptyText: 'No Data'
          },
          {
            property: 'preferredLanguage',
            align: 'left',
            editable: false,
            label: labels.PreferredLanguage,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 200,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'preferredLanguageId'
          },
          {
            property: PROPERTY_STORE.TIME_ZONE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TIME_ZONE),
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'select',
            filterableItems: [],
            dbName: 'TimeZone',
            filterableCustomFieldName: 'TimeZoneId'
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
            minWidth: 200,
            overrideWidth: true,
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
            property: PROPERTY_STORE.PHONENUMBER,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PHONENUMBER),
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'text',
            dbName: 'PhoneNumber',
            emptyText: 'No Data'
          },
          {
            property: 'preferredLanguage',
            align: 'left',
            editable: false,
            label: labels.PreferredLanguage,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 200,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'preferredLanguageId'
          },
          {
            property: PROPERTY_STORE.TIME_ZONE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TIME_ZONE),
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'select',
            filterableItems: [],
            dbName: 'TimeZone',
            filterableCustomFieldName: 'TimeZoneId'
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
            minWidth: 200,
            overrideWidth: true,
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
                  FieldName: 'Status',
                  Operator: 'Include',
                  Value: 'New,Exists,Error,SCIM'
                }
              ],
              FilterGroups: []
            },
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
    handleCreateGroup() {
      this.isTargetGroupModalVisible = true
      if (this.$refs?.refTargetGroupSelect) this.$refs.refTargetGroupSelect.isMenuActive = false
    },
    handleCloseTargetGroupModal() {
      this.isTargetGroupModalVisible = false
    },
    handleConfirmTargetGroupModal(group) {
      this.isCreateTargetGroupButtonDisabled = true
      createTargetGroup(group)
        .then((response) => {
          this.isTargetGroupModalVisible = false
          this.groups.unshift({
            name: group.name,
            resourceId: response.data.data.resourceId
          })
          this.formData.groups.push(response.data.data.resourceId)
        })
        .finally(() => (this.isCreateTargetGroupButtonDisabled = false))
    },
    setTimeZoneFilterableItems() {
      const filterableItems = this.getTimezones?.timeZoneList?.map((item) => ({
        text: item.displayName,
        value: item.id
      }))
      filterableItems.unshift({ text: 'Blank', value: 'Blank' })
      this.$set(
        this.tableOptions.columns.find((col) => col.property === PROPERTY_STORE.TIME_ZONE),
        'filterableItems',
        filterableItems
      )
      this.$set(
        this.tableOptions.backupColumns.find((col) => col.property === PROPERTY_STORE.TIME_ZONE),
        'filterableItems',
        filterableItems
      )
      this?.$refs?.refValidateList?.reRenderFilters()
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageFilterOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            name: language.name,
            value: language.resourceId
          })) || []
        this.$set(
          this.tableOptions.columns.find((col) => col.property === 'preferredLanguage'),
          'filterableItems',
          this.languageFilterOptions
        )
        this.$set(
          this.tableOptions.backupColumns.find((col) => col.property === 'preferredLanguage'),
          'filterableItems',
          this.languageFilterOptions
        )
      })
    },
    addRowClassName({ row }) {
      return row?.validationDetail?.length > 0 ? ' target-user-import-file__error-row' : ''
    },
    handleSearchChange(searchFilter = {}) {
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.callForGetTargetUserCustomFieldsByCompanyId()
      this.getDatatableList()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber
      this.callForGetTargetUserCustomFieldsByCompanyId()
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForGetTargetUserCustomFieldsByCompanyId()
      this.getDatatableList()
    },
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    showConfirmModal(actionName) {
      this.selectedActionName = actionName
      let newMemberCount = this.getLabelCount(actionName)
      let currentMemberCount = this.companyLicense['totalUserCount']
      let totalMemberCount = newMemberCount + currentMemberCount
      let licenseLimit = this.companyLicense['licenseLimit']
      let isLimited = this.companyLicense['isLimited']
      if (
        isLimited &&
        (this.companyLicense['isLicenseExceeded'] || licenseLimit < totalMemberCount)
      ) {
        const companyId = this.getCurrentCompany?.resourceId
        const storageKey = `licenseExceededDialog_${companyId}`
        if (!this.canShowCachableDialog(storageKey)) {
          this.save(actionName)
        } else {
          this.showLicenseExceededDialog = true
          this.saveCachableDialogTimestamp(storageKey)
        }
      } else {
        this.save(actionName)
      }
    },
    handleSelectionChange(selectedValues) {
      this.selectedTableData = !selectedValues.length
    },
    getLabelCount(label) {
      if (label === labels.ImportSelected) {
        let selectedValues = this.$refs.refValidateList
          .getSelectedMultipleValues()
          .map((item) => item.resourceId)
        return selectedValues.length
      }
      if (label === labels.ImportAll) {
        return this.mappingStatus.newUserCount + this.mappingStatus.existingUserCount
      }
      if (label === 'onlyImportNewUsers') {
        return this.responsNumbers.newUserCount
      }
      if (label === 'onlyUpdateExistingUsers') {
        return this.responsNumbers.existingUserCount
      }
      return ''
    },
    filterStatusChange() {
      this.isShowInvalid = !this.isShowInvalid
      this.bodyData.filter.FilterGroups[0]['FilterItems'].find(
        (item) => item.FieldName === 'Status'
      ).Value = this.isShowInvalid ? 'Error' : 'New,Exists,Error,SCIM'
      this.step3Loading = true
      this.getDatatableList()
    },
    setTableOption() {
      return !this.isShowInvalid
        ? `ONLY SHOW INVALID (${this.mappingStatus.invalidUserCount})`
        : `SHOW ALL ${this.mappingStatus.totalRowCount}`
    },
    onlyImportNewUsers() {},
    onlyUpdateExistingUsers() {},
    getMappingStatus() {
      let _this = this
      getMappingStatus(this.mappindgId).then((response) => {
        _this.mappingStatus = response.data.data
        if (_this.mappingStatus.status === 'FinishedWithError' && _this.isExcelUploaded) {
          this.$store.dispatch('common/createSnackBar', {
            message: 'Something went wrong. Finished With Error',
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
          this.showDatatableErrorState = true
        } else if (_this.mappingStatus.status !== 'Finished' && _this.isExcelUploaded) {
          this.showDatatableErrorState = false
          if (this.activeStep === 3) {
            setTimeout(() => {
              this.getMappingStatus()
            }, 2500)
          }
        } else {
          this.showDatatableErrorState = false
          this.getDatatableList()
        }
      })
    },
    getTargetUsers() {
      getTargetGroups().then((response) => {
        const {
          data: { data }
        } = response
        this.groups = data?.map((group) => {
          return {
            ...group,
            disabled: group?.isScimGroup || group?.isGoogleGroup
          }
        })
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
      //this.bodyData.pageSize = this.mappingStatus.totalRowCount
      this.step3Loading = true

      let customFields = this.columns.filter((item) => item.isCustomField).map((item) => item.label)
      this.bodyData.filter.FilterGroups[1].FilterItems = this.bodyData.filter.FilterGroups[1].FilterItems.reduce(
        (acc, item) => {
          if (
            !customFields.includes(item.FieldName) &&
            item.FieldName !== PROPERTY_STORE.NONE_SELECTED
          )
            acc.push(item)
          return acc
        },
        []
      )
      searchTmp(this.bodyData, this.excelInfo.transactionId)
        .then((response) => {
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data.items
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.responsNumbers = response.data.data
          _this.tableOptions.columns = JSON.parse(JSON.stringify(_this.tableOptions.backupColumns))
          let data = ({ status } = response.data.data.items.results)
          let customFields
          if (data.length) {
            customFields = data[0].customFields.map((item) => {
              const filterableProps = {}
              if (item.dataType.toLowerCase() === 'string') {
                filterableProps['filterableType'] = 'text'
              }
              if (item.dataType.toLowerCase() === 'email') {
                filterableProps['filterableType'] = 'text'
              }
              if (item.dataType.toLowerCase() === 'number') {
                filterableProps['filterableType'] = 'text'
              }
              if (item.dataType.toLowerCase() === 'boolean') {
                filterableProps['filterableType'] = 'select'
                filterableProps['filterableItems'] = [
                  { text: 'Yes', value: 1 },
                  { text: 'No', value: 0 }
                ]
              }
              if (item.dataType.toLowerCase() === 'date') {
                filterableProps['filterableType'] = 'dateOnly'
              }
              if (item.dataType.toLowerCase() === 'datetime') {
                filterableProps['filterableType'] = 'date'
              }
              return {
                property: item.name,
                align: 'left',
                editable: false,
                label: item.name,
                fixed: false,
                show: true,
                type: 'text',
                dbName: 'item.name',
                width: 250,
                emptyText: 'No Data',
                sortable: false,
                hideSort: true,
                filterable: true,
                customFieldName: item.name,
                isCustom: true,
                isCustomField: true,
                ...filterableProps
              }
            })
          } else {
            customFields = this.mappingData.columns
              .filter((item) => item.isCustom)
              .map((item) => {
                return {
                  property: item.name,
                  align: 'left',
                  editable: false,
                  label: item.name,
                  fixed: false,
                  show: true,
                  type: 'text',
                  dbName: 'item.name',
                  width: 250,
                  emptyText: 'No Data',
                  sortable: false,
                  hideSort: true,
                  filterable: true,
                  customFieldName: item.name,
                  filterableType: 'text',
                  FilterableItems: 'Yes',
                  isCustom: true,
                  isCustomField: true
                }
              })
          }
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
            // Map preferredLanguage to friendly name
            if (item.preferredLanguage) {
              if (Array.isArray(item.preferredLanguage)) {
                item.preferredLanguage = item.preferredLanguage.map((lang) => {
                  const language = _this.languageFilterOptions.find((opt) => opt.name === lang)
                  return language?.text || lang
                })
              } else if (typeof item.preferredLanguage === 'string') {
                const language = _this.languageFilterOptions.find((opt) => opt.name === item.preferredLanguage)
                item.preferredLanguage = language?.text || item.preferredLanguage
              }
            }
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
          _this.loading = false
          _this.showDatatable = true
        })
        .catch(() => {
          this.tableData = []
          this.loading = false
        })
        .finally(() => {
          this.step3Loading = false
        })
    },
    columnFilterChanged(filter) {
      this.step3Loading = true
      let items = []
      let requestBody = this.bodyData.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        const { FieldName } = filter
        if (FieldName !== 'Status') {
          requestBody.push(elem)
        }
      }

      this.bodyData.filter.FilterGroups[0].FilterItems = requestBody
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.bodyData.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.bodyData.filter.FilterGroups[0].FilterItems = filterPayload
      this.getDatatableList()
    },
    searchChangedEvent(searchFilter = {}) {
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      const timeZoneIndex = this.bodyData.filter.FilterGroups[1].FilterItems.findIndex(
        (item) => item.FieldName === 'TimeZone'
      )
      if (timeZoneIndex !== -1) {
        this.bodyData.filter.FilterGroups[1].FilterItems.splice(timeZoneIndex, 1)
      }
      const languageIndex = this.bodyData.filter.FilterGroups[1].FilterItems.findIndex(
        (item) => item.FieldName === 'preferredLanguage'
      )
      if (languageIndex !== -1) {
        this.bodyData.filter.FilterGroups[1].FilterItems.splice(languageIndex, 1)
      }
      this.resetPageNumber()
      this.callForGetTargetUserCustomFieldsByCompanyId()
      this.getDatatableList()
    },
    sortChangedEvent({ prop, order }) {
      this.bodyData = {
        ...this.bodyData,
        orderBy: prop,
        ascending: order === 'ascending'
      }
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
        exportTargetUserBulk(this.excelInfo.transactionId, payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `target-users-import.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
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
        .finally(() => {
          this.excelLoading = false
        })
    },
    getMapTableData() {
      return this.$refs.refMapTable.getMapTableData()
    },
    closeOverlay() {
      this.isLeaveAccepted = true
      this.$emit('closeOverlay')
    },
    onFileChanged(file) {
      if (Array.isArray(file) && Array.from(file).length === 0) {
        this.isExcelUploaded = false
        this.step1Loading = false
        this.formData.file = null
        this.excelInfo = null
        return
      }
      this.formData.file = file
      this.isExcelUploaded = true
      this.step1Loading = true
      this.isBackendParsed = false
      uploadExcelOrCsvForTargetUsers(file, (e) => {
        this.onUploadProgress = e
      })
        .then((response) => {
          this.excelInfo = response.data.data
          this.step1Loading = false
        })
        .catch(() => {
          this.isExcelUploaded = false
          this.step1Loading = false
          this.formData.file = null
        })
        .finally(() => {
          this.isBackendParsed = true
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
              selectedValue:
                this.mappingData.columns.find(
                  (column) =>
                    column?.name?.replace(/\s+/g, '')?.toLowerCase() ===
                    item?.replace(/\s+/g, '')?.toLowerCase()
                ) || null,
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
          this.setExistItems()
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
    setExistItems() {
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs.refMapTable) {
            return this.$refs.refMapTable.setExistItems()
          }
        })
      }, 200)
    },
    submit() {},
    createMapFields() {
      this.step3InitialLoading = true
      let fieldMappingData = this.getMapTableData()
        .headers.map((item) => {
          let excelColumnName = item.name
          let fieldName =
            (item.selectedValue && item.selectedValue.dbName) ||
            (item.selectedValue && item.selectedValue.name) ||
            null
          if (fieldName === 'First Name') fieldName = 'FirstName'
          if (fieldName === 'Last Name') fieldName = 'LastName'
          return {
            excelColumnName: excelColumnName,
            fieldName: fieldName
          }
        })
        .filter((item) => item.fieldName)
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
          this.step3InitialLoading = false
        })
    },
    nextStep() {
      let isFormValid = true
      if (this.activeStep === 1) {
        isFormValid = !!this.formData.file
      } else if (this.activeStep === 2) {
        let selectedHeaderColumns = this.mappingData.headers.map(
          (item) => item.selectedValue && (item.selectedValue.dbName || item.selectedValue.name)
        )
        let requiredFields = this.mappingData.columns
          .filter((item) => item.required)
          .map((item) => item.dbName || item.name)
        this.requiredFields = requiredFields.filter((d) => !selectedHeaderColumns.includes(d))
        isFormValid = !this.requiredFields.length
        if (!isFormValid) {
          this.showRequiredAreaModal = true
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
        this.updateTransactionId()
        this.resetBodyData()
      }
    },
    updateTransactionId() {
      if (this.excelInfo.transactionId) {
        const tempTransactionId = this.excelInfo.transactionId
        this.excelInfo.transactionId = null
        updateTransactionId(tempTransactionId)
          .then((response) => {
            const transactionId = response.data.data?.transactionId
            if (transactionId) {
              this.excelInfo.transactionId = transactionId
            } else {
              this.excelInfo.transactionId = tempTransactionId
            }
          })
          .catch(() => {
            this.excelInfo.transactionId = tempTransactionId
          })
      }
    },
    resetBodyData() {
      this.bodyData = {
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
                  FieldName: 'Status',
                  Operator: 'Include',
                  Value: 'New,Exists,Error,SCIM'
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    },
    save(label) {
      let payload
      if (label === labels.ImportSelected) {
        let selectedValues = this.$refs.refValidateList
          .getSelectedMultipleValues()
          .map((item) => item.resourceId)
        if (!selectedValues.length) return ''
        payload = {
          ImportType: 'ImportSelected',
          SelectedResourceIds: selectedValues
        }
      } else if (label === labels.ImportAll) {
        payload = { ImportType: 'ImportAll' }
      } else if (label === 'onlyImportNewUsers') {
        payload = { ImportType: 'OnlyNew' }
      } else if (label === 'onlyUpdateExistingUsers') {
        payload = { ImportType: 'OnlyUpdateExisting' }
      } else {
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
        this.$router.push('/company/job-log')
      })
    },
    callForGetTargetUserCustomFieldsByCompanyId() {
      let _this = this
      this.loading = true
      getTargetUserCustomFieldsByCompanyId()
        .then((response) => {
          let allColumns = []
          let mainColumns = _this.columns.filter((item) => !item.isCustomField)
          let customColumns = _this.columns.filter((item) => item.isCustomField)
          allColumns = mainColumns
          if (customColumns) {
            allColumns = allColumns?.concat(customColumns)
          }
          this.allCustomColumns = customColumns
          _this.mappingData.columns = allColumns
            .map((item) => {
              if (item.label !== 'Status' && item.label !== 'Date Created') {
                return {
                  isCustomField: true,
                  name: item.label,
                  disabled: false,
                  selectedValue: null,
                  dbName: item.dbName,
                  isCustom: !item.dbName,
                  required: item.dbName
                    ? item.dbName === 'Email'
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
          _this.mappingData.columns.unshift({
            name: PROPERTY_STORE.NONE_SELECTED,
            disabled: false,
            selectedValue: null,
            dbName: PROPERTY_STORE.NONE_SELECTED,
            isCustom: true,
            required: false
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
    this.callForLanguages()
    this.getTargetUsers()
  },
  beforeRouteLeave(to, from, next) {
    if (this.isExcelUploaded) {
      next(false)
    } else if (this.isLeaveAccepted) {
      next()
    } else next()
  },
  beforeDestroy() {
    this.activeStep = 1
  }
}
</script>
