<template>
  <div>
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :body-training-type="bodyTrainingType"
      :title="resendDialogTitle"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <DataTable
      :id="CONSTANTS.id"
      ref="refTable"
      rowKey="targetUserResourceId"
      selectable
      filterable
      options
      is-server-side-selection
      is-server-side
      :loading="isLoading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :server-side-props="serverSideProps"
      :server-side-events="tableOptions.serverSideEvents"
      :row-actions="tableOptions.rowActions"
      :add-button="tableOptions.addButton"
      :select-event="tableOptions.selectEvent"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @downloadEvent="exportTrainingReportSendingReportTable"
      @refreshAction="callForData"
      @on-resend="handleOnResend"
      @on-selection-text-change="handleSelectionChange"
    >
      <template #datatable-custom-column="{ scope, col }">
        <v-btn style="display: none;" />
        <v-tooltip
          v-if="col.property === 'lastSendingStatus'"
          bottom
          nudgeLeft="40"
          :disabled="!scope.row.errorMessage"
        >
          <template #activator="{ on }">
            <Badge
              v-if="scope.row && scope.row[col.property]"
              :listeners="on"
              :color="getBtnStatusColor(scope.row[col.property])"
              :text="scope.row[col.property]"
              :col="col"
              size="medium"
            />
          </template>
          <span>{{ scope.row.errorMessage }}</span>
        </v-tooltip>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { useLoading } from "@/hooks/useLoading";
import useDefaultTableFunctions from "@/hooks/useDefaultTableFunctions";
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS,
} from "@/model/constants/commonConstants";
import ServerSideProps from "@/helper-classes/server-side-table-props";
import labels from "@/model/constants/labels";
import { getDefaultAxiosPayload, getBtnStatusColor } from "@/utils/functions";
import AwarenessEducatorService from "@/api/awarenessEducator";
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from "@/components/TrainingLibrary/TrainingLibraryFirstCard/utils";
import { createCustomFieldColumns } from "@/utils/helperFunctions";
import TrainingReportResendDialog from "@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog";
export default {
  name: "TrainingReportMicrosoftTeamsTable",
  components: {
    DataTable,
    Badge,
    TrainingReportResendDialog,
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String,
    },
    lastSendingStatusItems: {
      type: Array,
    },
    isScormProxy: {
      type: Boolean,
    },
    formDetails: {
      type: Object,
    },
    trainingSummary: {
      type: Object,
    },
    customFields: {
      type: Array,
      default: () => [],
    },
    isSurvey: {
      type: Boolean,
    },
    resendDialogTitle: {
      type: String,
    },
    bodyTrainingType: {
      type: String,
    },
  },
  data() {
    return {
      isShowResendDialog: false,
      isResendActionButtonDisabled: false,
      selectedRow: null,
      isShowInteractionsModal: false,
      CONSTANTS: {
        id: "training-report-users-data-table",
        ascending: "ascending",
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: "email" }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_SENDING_REPORT_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_SENDING_REPORT_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: true,
          clipboard: true,
        },
        columns: [
          {
            property: "firstName",
            align: "left",
            editable: false,
            label: "First Name",
            fixed: "left",
            sortable: true,
            show: true,
            type: "text",
            filterableType: "text",
            width: 150,
          },
          {
            property: "lastName",
            align: "left",
            editable: false,
            label: "Last Name",
            fixed: false,
            sortable: true,
            show: true,
            type: "text",
            filterableType: "text",
            width: 150,
          },
          {
            property: "email",
            align: "left",
            editable: false,
            label: "Email",
            fixed: false,
            sortable: true,
            show: true,
            type: "text",
            filterableType: "text",
            width: 150,
          },
          {
            property: "department",
            align: "left",
            editable: false,
            label: "Department",
            sortable: true,
            show: true,
            type: "text",
            filterableType: "text",
            width: 150,
          },
          {
            property: "firstSendDate",
            align: "left",
            editable: false,
            label: "Date First Sent",
            fixed: false,
            sortable: true,
            show: true,
            type: "text",
            filterableType: "date",
            width: 160,
          },
          {
            property: "lastSendDate",
            align: "left",
            editable: false,
            label: "Date Last Sent",
            fixed: false,
            sortable: true,
            show: true,
            type: "text",
            filterableType: "date",
            width: 180,
          },
          {
            property: "lastSendingStatus",
            align: "center",
            editable: false,
            fixed: false,
            label: "Last Sending Status",
            sortable: true,
            show: true,
            type: "slot",
            minWidth: 220,
            props: {
              style: {
                maxWidth: "110px !important",
              },
            },
            overrideWidth: true,
            filterableType: "select",
            filterableItems:
              this?.formDetails?.emailStatusEnum.map((status) => ({
                text: status.displayName || status.name,
                value: status.name,
              })) || [],
          },
        ],
        addButton: {
          show: false,
        },
        iEmpty: {
          message: this.getEmptyTableTextMessage(),
        },
        rowActions: [
          {
            name: `Resend ${this.bodyTrainingType}`,
            id: "btn-interactions--row-actions-training-report-sending-report",
            icon: "$custom-resend",
            action: "on-resend",
          },
        ],
      },
      tableData: [],
    };
  },
  watch: {
    customFields: {
      deep: true,
      immediate: true,
      handler(val) {
        const fields = createCustomFieldColumns(val, false);
        const departmentIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === "department"
        );
        if (departmentIndex) {
          this.tableOptions.columns.splice(departmentIndex + 1, 0, ...fields);
        }
      },
    },
    isScormProxy: {
      immediate: true,
      handler(val) {
        if (val) {
          const resendActionIndex = this.tableOptions.rowActions.findIndex(
            (action) => action.name === `Resend ${this.bodyTrainingType}`
          );
          if (resendActionIndex !== -1) {
            this.tableOptions.rowActions.splice(resendActionIndex, 1);
          }
        }
      },
    },
  },
  created() {
    this.callForData();
  },
  methods: {
    handleSelectionChange(selectionCount) {
      this.$emit("on-selection-text-change", selectionCount);
    },
    handleSearchChange(searchFilter = {}) {
      const customFieldNames = this.customFields?.map?.((field) => field.name);
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems.filter(
          (field) => !customFieldNames.includes(field.FieldName)
        ),
      ];
      this.resetPageNumber();
      this.callForData();
    },
    getEmptyTableTextMessage() {
      if (this.isSurvey) {
        return labels.EmptyTrainingReportSurveyUsers;
      }
      if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.EmptyTrainingSendingReportPoster;
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
        return labels.EmptyTrainingSendingReportInfographic;
      return labels.EmptyTrainingReportUsers;
    },
    handleOnResend(row) {
      this.selectedRow = row;
      this.toggleIsShowResendDialog();
    },
    resendItem() {
      this.isResendActionButtonDisabled = true;
      AwarenessEducatorService.resendMicrosoftTeamsSendingReportEmails({
        notificationActivityLogId: this.selectedRow.id,
      })
        .then(() => {
          this.$refs.refTable.resetSelectableParams();
          this.callForData();
        })
        .finally(() => {
          this.isResendActionButtonDisabled = false;
          this.isShowResendDialog = false;
          this.selectedRow = null;
        });
    },
    getBtnStatusColor(type) {
      return getBtnStatusColor(type);
    },
    callForData() {
      this.setLoading(true);
      AwarenessEducatorService.searchMicrosoftTeamsSendingReportEmails(this.axiosPayload, this.id)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber },
            },
          } = response;
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords;
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages;
          this.serverSideProps.pageNumber = pageNumber;
          this.tableData = results.map((row) => {
            let customFields = {};
            row?.customFieldValues?.forEach?.((field) => {
              customFields[`${field.name}`] = field?.value;
            });
            return { ...row, ...customFields };
          });
        })
        .finally(this.setLoading);
    },
    exportTrainingReportSendingReportTable(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === "XLS" ? "Excel" : item,
          filter: this.axiosPayload.filter,
        };
        AwarenessEducatorService.exportSendingReport(payload, this.id).then((response) => {
          const { data } = response;
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(data);
          link.download = `${
            this.bodyTrainingType
          }-Sending-Report-Enrollment-Emails.${
            item.toLocaleLowerCase() === "xls" ? "xlsx" : item.toLocaleLowerCase()
          }`;
          link.click();
        });
      });
    },
    toggleIsShowResendDialog() {
      if (this.isShowResendDialog) {
        this.selectedRow = null
      }
      this.isShowResendDialog = !this.isShowResendDialog;
    },
  },
};
</script>

