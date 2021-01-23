<template>
  <div>
    <div class="v-overlay v-overlay--active theme--dark" style="z-index: 202;">
      <div
        class="v-overlay__scrim"
        style="opacity: 0.46; background-color: rgb(33, 33, 33); border-color: rgb(33, 33, 33);"
      ></div>
      <div class="v-overlay__content"></div>
    </div>
    <app-dialog
      :status="status"
      icon="mdi-timer-sand-full"
      :title="getTitle"
      :subtitle="getSubtitle"
      @changeStatus="handleCloseClick"
      :custom-size="'1200'"
      maxHeightSize="665"
      class-name="the-clustered-modal"
      hide-overlay
    >
      <template v-slot:app-dialog-body>
        <v-card light>
          <data-table
            disableExtendedViewTransition
            selectable
            filterable
            options
            :loading="isLoading"
            :extended-view-loading="extendedViewLoading"
            :is-column-filter-active="tableOptions.isColumnFilterActive"
            :refName="'clusteredReportedEmails'"
            :table="tableData"
            :columns="tableOptions.columns"
            :extended-view-options="tableOptions.extendedViewOptions"
            :extended-view-value="extendedViewValue"
            :select-event="tableOptions.selectEvent"
            :rowActions="tableOptions.rowActions"
            :empty="tableOptions.iEmpty"
            :count-row="5"
            :extendedViewDisableChanger="extendedViewDisableChanger"
            @onEditClick="onEditClick"
            @refreshAction="callForTableData(true)"
            @handleEdit="handleEdit"
            @columnFilterChanged="columnFilterChanged"
            @columnFilterCleared="columnFilterCleared"
            @downloadEvent="exportReportedListEmails"
            @irPreview="irPreviewOnClick"
            @handleDetails="irDetailsOnClick"
            @handleInvestigate="handleReportedEmailInvestigate"
          >
            <template v-slot:datatable-custom-column="{ scope, col }">
              <template v-if="scope.column.property === 'source'">
                <span
                  v-if="
                    scope.row &&
                    scope.row.matchingPlaybooks &&
                    scope.row.matchingPlaybooks.length === 0
                  "
                >
                  {{ scope.row.source === 'Auto' ? 'Auto Analysis' : scope.row.source }}
                </span>
                <span
                  v-else
                  v-for="item in scope.row.matchingPlaybooks"
                  :key="item.resourceId"
                  class="incident-responder-parent__link"
                  @click="togglePlaybookModalWithSelected(item.resourceId)"
                  >{{ item.name }}</span
                >
              </template>
              <template v-if="scope.column.property === 'status'">
                <template v-if="scope.row.status === 'BeingAnalyzed'">
                  <span class="analysis-link">
                    <div>{{ labels.InAnalysis }}...</div>
                    <div>
                      <img src="../../assets/img/spinner.png" class="add-in-settings__spinner" />
                    </div>
                  </span>
                </template>
                <template v-else>
                  <data-table-colorful-text
                    :col="col"
                    :scope="scope"
                    :text="getDataTableFieldLabel(scope.row.status)"
                  />
                </template>
              </template>
            </template>
            <template v-slot:extended-view-slot>
              <div class="row-edit-div">
                <v-checkbox
                  color="#2196f3"
                  label="Notify reporting user about this update"
                  v-model="extendedView.isNotify"
                  @change="$emit('handleIsNotify', $event)"
                  :disabled="selectedRowsOfReportedEmailsLength > 1"
                ></v-checkbox>
              </div>
              <div class="row-edit-div">
                <v-checkbox
                  color="#2196f3"
                  label="Add Custom Message"
                  v-model="extendedView.isMessage"
                  :disabled="!extendedView.isNotify || selectedRowsOfReportedEmailsLength > 1"
                ></v-checkbox>
              </div>
              <div
                class="row-edit-div"
                v-if="
                  extendedView.isMessage &&
                  extendedView.isNotify &&
                  selectedRowsOfReportedEmailsLength <= 1
                "
              >
                <v-textarea
                  outlined
                  dense
                  v-model="extendedView.customMessage"
                  rows="3"
                  placeholder="Write custom messages for recipients"
                  row-height="30"
                ></v-textarea>
              </div>
            </template>
          </data-table>
        </v-card>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleCloseClick"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import DataTableColorfulText from '@/components/DataTableComponents/DataTableColorfulText'
import { searchNotifiedMail } from '@/api/incidentResponder'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import { checkPermission, getDataTableFieldLabel } from '@/utils/functions'
export default {
  name: 'TheClusteredModal',
  components: {
    AppDialog,
    DataTable,
    DataTableColorfulText
  },
  props: {
    extendedView: {
      type: Object
    },
    extendedViewLoading: {
      type: Boolean
    },
    hasMultipleNoteValue: {
      type: Boolean
    },
    defaultExtendedViewValues: {
      type: Object
    },
    extendedViewValue: {
      type: Array
    },
    status: {
      type: Boolean
    },
    selectedCluster: {
      type: String
    },
    selectedRowsOfReportedEmailsLength: {
      type: Number
    },
    row: {
      type: Object
    }
  },
  data() {
    return {
      tableOptions: {
        isColumnFilterActive: false,
        extendedViewOptions: {
          titleKey: 'subject',
          footer: [
            {
              label: 'Date Created',
              key: 'createTime'
            },
            {
              label: 'Last update',
              key: 'lastUpdateDate'
            }
          ],
          col: [
            {
              property: PROPERTY_STORE.SUBJECT,
              label: getStoreValue(PROPERTY_STORE.SUBJECT),
              isEditable: false,
              type: 'text',
              show: true
            },
            {
              property: PROPERTY_STORE.REPORTEDBY,
              label: getStoreValue(PROPERTY_STORE.REPORTEDBY),
              isEditable: false,
              type: 'text',
              show: true
            },
            {
              property: PROPERTY_STORE.RESOURCEID,
              label: 'Case Id',
              isEditable: false,
              type: 'text',
              show: true
            },
            {
              property: PROPERTY_STORE.ANALYSISSOURCE,
              label: 'Analysis Source',
              isEditable: false,
              type: 'analysisSource',
              show: true
            },
            {
              property: PROPERTY_STORE.RESULT,
              label: getStoreValue(PROPERTY_STORE.RESULT),
              isEditable: true,
              type: 'badge',
              editOptions: {
                component: 'select',
                getDisabledValue(row) {
                  if (row.status === 'BeingAnalyzed') {
                    return true
                  } else {
                    return false
                  }
                },
                props: {
                  items: ['Phishing', 'Malicious', { text: 'Clean', value: 'NonMalicious' }]
                }
              },
              show: true
            },
            {
              property: PROPERTY_STORE.STATUS,
              label: getStoreValue(PROPERTY_STORE.STATUS),
              isEditable: true,
              type: 'colorfulText',
              editOptions: {
                component: 'select',
                getDisabledValue(row) {
                  if (row.status === 'BeingAnalyzed') {
                    return true
                  } else {
                    return false
                  }
                },
                props: {
                  items: [
                    'Open',
                    'Closed',
                    { text: labels.InProgress, value: 'InProgress' },
                    { text: labels.FalsePositive, value: 'FalsePositive' }
                  ]
                }
              },
              show: true
            },
            {
              property: 'tags',
              label: 'Tags',
              isEditable: true,
              type: 'smallBadge',
              editOptions: {
                component: 'combobox',
                props: {
                  placeholder: 'Enter Tags'
                }
              },
              show: true
            },
            {
              property: 'note',
              label: labels.Notes,
              isEditable: true,
              type: 'text',
              editOptions: {
                component: 'textarea',
                getDisabledValue() {
                  return false
                },
                props: {
                  placeholder: 'Enter Notes',
                  rules: [
                    (v) =>
                      Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.Notes, 256))
                  ]
                }
              },
              show: true,
              showOnlyPreview: true
            }
          ]
        },
        columns: [
          {
            property: PROPERTY_STORE.SUBJECT,
            align: 'left',
            label: getStoreValue(PROPERTY_STORE.SUBJECT),
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: '300',
            isEditable: false,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.ATTACHMENTCOUNT,
            align: 'center',
            label: getStoreValue(PROPERTY_STORE.ATTACHMENTCOUNT),
            hideLabel: true,
            fixed: false,
            sortable: true,
            show: true,
            isEditable: false,
            type: 'attachment',
            width: 120
          },
          {
            property: PROPERTY_STORE.REPORTEDBY,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.REPORTEDBY),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: '260',
            isEditable: false,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.RESOURCEID,
            show: false,
            label: 'Case Id',
            type: 'text',
            isEditable: false,
            hideOnSettingsPopup: true
          },
          {
            property: PROPERTY_STORE.ANALYSISSOURCE,
            isEditable: false,
            align: 'center',
            label: 'Analysis Source',
            fixed: false,
            sortable: false,
            show: true,
            type: 'analysisSource',
            width: '200',
            fullWidth: true
          },
          {
            property: PROPERTY_STORE.RESULT,
            align: 'center',
            label: getStoreValue(PROPERTY_STORE.RESULT),
            fixed: false,
            sortable: false,
            show: true,
            type: 'badge',
            isEditable: true,
            filterableType: 'select',
            filterableItems: [{ text: 'Clean', value: 'NonMalicious' }, 'Malicious', 'Phishing'],
            props: {
              style: {
                maxWidth: '110px'
              }
            },
            width: '150'
          },
          {
            property: PROPERTY_STORE.STATUS,
            isEditable: true,
            align: 'center',
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'slot',
            width: '150',
            showColorfulText: true,
            fullWidth: true,
            filterableType: 'select',
            filterableItems: [
              { text: labels.InAnalysis, value: 'BeingAnalyzed' },
              labels.Open,
              labels.Closed,
              { text: labels.InProgress, value: 'InProgress' },
              { text: labels.FalsePositive, value: 'FalsePositive' }
            ],
            props: {
              style: { maxWidth: '110px' }
            }
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
            width: '230',
            filterableType: 'date'
          },
          {
            property: 'tags',
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.RESULTTAG),
            fixed: false,
            sortable: false,
            show: true,
            type: 'smallBadge',
            isEditable: true,
            width: '150'
          }
        ],
        pageSizes: [5, 10, 25],
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'edit',
            isNotShow: true
          },
          {
            name: labels.PreviewEmail,
            icon: 'mdi-eye',
            action: 'irPreview'
          },
          {
            name: labels.Details,
            icon: 'mdi-text-box-multiple',
            action: 'handleDetails'
          },
          {
            name: labels.Investigate,
            icon: 'mdi-magnify',
            action: 'handleInvestigate'
          }
        ],
        addMenu: {
          show: true,
          popUp: false
        },
        iEmpty: {
          message: labels.EmptyReportedEmailText,
          subMes: labels.EmptyReportedEmailSubText,
          btn: labels.PhishingReporterSettings,
          icon: 'mdi-arrow-right'
        },
        selectEvent: {
          clipboard: true,
          edit: true,
          download: false
        }
      },
      axiosPayload: {
        isClustered: false,
        pageNumber: 1,
        pageSize: 500000,
        orderBy: 'createTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      tableData: [],
      isLoading: false
    }
  },
  computed: {
    getSubtitle() {
      return `Reported emails clustered by ${this.selectedCluster}`
    },
    getTitle() {
      const { subject = '' } = this.row
      return subject
    }
  },
  created() {
    this.callForTableData(true)
  },
  methods: {
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.axiosPayload.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName.charAt(0).toUpperCase() + i.FieldName.slice(1)) {
              items.push(x)
            }
          })
        } else {
          if (
            x.FieldName !==
            filter.FieldName.charAt(0).toUpperCase() + filter.FieldName.slice(1)
          ) {
            items.push(x)
          }
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          const elem = filter[i]
          elem.FieldName =
            filter[i].FieldName.charAt(0).toUpperCase() + filter[i].FieldName.slice(1)
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName.charAt(0).toUpperCase() + filter.FieldName.slice(1)
        const { FieldName, Value } = filter
        if (FieldName === 'Result' && Value === '') {
        } else {
          requestBody.push(elem)
        }
      }

      this.axiosPayload.filter.FilterGroups[0].FilterItems = requestBody
      this.callForTableData(true)
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.axiosPayload.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName.charAt(0).toUpperCase() + fieldName.slice(1)) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.tableOptions.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForTableData(true)

      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    callForTableData(isSubjectFilter = false) {
      if (isSubjectFilter) this.setSubjectFilter()
      if (this.checkPermissions('notified-emails/search', 'POST')) {
        this.isLoading = true
        searchNotifiedMail(this.axiosPayload)
          .then((response) => {
            this.setTableData(response)
            if (isSubjectFilter) this.removeSubjectFilter()
          })
          .finally(() => (this.isLoading = false))
      }
    },
    exportReportedListEmails(obj = {}) {
      this.setSubjectFilter()
      this.$emit('downloadEvent', obj, this.axiosPayload)
      this.removeSubjectFilter()
    },
    irPreviewOnClick(row = {}) {
      this.$emit('irPreview', row)
    },
    irDetailsOnClick(row = {}) {
      this.$emit('handleDetails', row)
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    getDataTableFieldLabel(text) {
      return getDataTableFieldLabel(text)
    },
    extendedViewDisableChanger() {
      return JSON.stringify(this.defaultExtendedViewValues) === JSON.stringify(this.extendedView)
    },
    onEditClick(obj = {}) {
      this.$emit('onEditClick', obj)
    },
    handleEdit(rows = []) {
      this.$emit('handleEdit', rows)
    },
    handleReportedEmailInvestigate(row = {}) {
      this.$emit('handleInvestigate', row)
    },
    setSubjectFilter() {
      this.axiosPayload.filter.FilterGroups[0].FilterItems.unshift({
        FieldName: 'Subject',
        Operator: '=',
        Value: this.row.subject
      })
    },
    setTableData(response = {}) {
      const {
        data: {
          data: { results = [] }
        }
      } = response
      this.tableData = results
    },
    removeSubjectFilter() {
      this.axiosPayload.filter.FilterGroups[0].FilterItems.splice(0, 1)
    },
    handleCloseClick() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss">
.the-clustered-modal {
  .k-table__wrapper {
    padding-bottom: 0;
  }
}
</style>
