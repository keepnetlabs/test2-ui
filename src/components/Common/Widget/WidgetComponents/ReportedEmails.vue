<template>
  <div class="incident-responder-parent">
    <div class="table-row">
      <v-card>
        <div class="header">
          <div class="title">
            <h2>Reported Emails</h2>
            <p class="mb-10">
              Summary of emails reported for analysis
            </p>
          </div>
        </div>
        <data-table
          :refName="'reportedEmails'"
          ref="refReportedEmails"
          :columns="emails.columns"
          :countRow="5"
          :extended-view-options="emails.extendedViewOptions"
          :pageSizes="emails.pageSizes"
          :defaultSort="'createDate'"
          :selectable="true"
          :filterable="true"
          :options="true"
          :rowActions="emails.rowActions"
          :addUsers="emails.addUsers"
          :empty="emails.iEmpty"
          :groupable="true"
          :selectEvent="emails.selectEvent"
        >
        </data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import { searchNotifiedMail } from '@/api/incidentResponder'
export default {
  name: 'ReportedEmails',
  components: {
    DataTable
  },
  data() {
    return {
      emails: {
        table: [],
        extendedViewOptions: {
          titleKey: 'subject',
          footer: [
            {
              label: 'Date Created',
              key: 'createDate'
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
                  items: ['Phishing', 'Malicious', { text: 'Non Malicious', value: 'NonMalicious' }]
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
                    { text: 'In Progress', value: 'InProgress' },
                    { text: 'False Positive', value: 'FalsePositive' }
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
            width: '300',
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
            filterableItems: ['NonMalicious', 'Malicious', 'Phishing'],
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
                items: ['Phishing', 'Malicious', { text: 'Non Malicious', value: 'NonMalicious' }]
              }
            },
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
            filterableItems: ['BeingAnalyzed', 'Open', 'Closed', 'InProgress', 'FalsePositive'],
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
                  { text: 'In Progress', value: 'InProgress' },
                  { text: 'False Positive', value: 'FalsePositive' }
                ]
              }
            },
            props: {
              style: { maxWidth: '110px' }
            }
          },
          {
            property: PROPERTY_STORE.CREATEDATE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            editOptions: {
              component: 'datepicker'
            },
            width: '230',
            filterableType: 'date'
          },
          {
            property: PROPERTY_STORE.RESULTTAG,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.RESULTTAG),
            fixed: false,
            sortable: false,
            show: true,
            type: 'smallBadge',
            isEditable: true,
            editOptions: {
              component: 'combobox',
              props: {
                placeholder: 'Enter Tags'
              }
            },
            width: '150'
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'edit',
            isNotShow: true
          },
          {
            name: 'Preview Email',
            icon: 'mdi-eye',
            action: 'irPreview'
          },
          {
            name: 'Details',
            icon: 'mdi-text-box-multiple',
            action: 'handleDetails'
          },
          {
            name: 'Investigate',
            icon: 'mdi-magnify',
            action: 'handleInvestigate'
          }
        ],
        addMenu: {
          show: true,
          popUp: false
        },
        iEmpty: {
          message: "There isn't any reported mail, yet",
          subMes:
            'Emails that are reported by your users via Phishing Reporter add-in analysed and listed here',
          btn: 'PHISHING REPORTER SETTINGS',
          icon: 'mdi-arrow-right'
        },
        selectEvent: {
          clipboard: true,
          edit: true,
          download: true
        },
        chartOptions: {
          chart: {
            width: 60,
            height: 60,
            type: 'pie',
            offsetX: -1,
            offsetY: 1
          },
          labels: ['Team A', 'Team B', 'Team C', 'Team D'],
          colors: ['#67c23a', '#409eff', '#f56c6c', '#ffcc33'],
          legend: {
            show: false
          },
          tooltip: {
            enabled: false
          },
          dataLabels: {
            enabled: false
          }
        }
      },
      requestBodyReportedEmails: {
        pageNumber: 1,
        pageSize: 500000,
        orderBy: 'createDate',
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
      }
    }
  },
  created() {
    searchNotifiedMail(this.requestBodyReportedEmails).then((response) => {
      const {
        data: {
          data: { results },
          status
        }
      } = response
      const tableData = results
      this.$refs.refReportedEmails.loadWithDataArray(tableData || [])
    })
  }
}
</script>

<style></style>
