<template>
  <div class="sender-ip-blacklist-check">
    <h3
      id="text--email-details-sender-ip-blacklist-check"
      class="sender-ip-blacklist-check__header mb-4"
    >
      Sender IP Blacklist Check
    </h3>
    <data-table
      id="email-details-sender-api-blacklist-check"
      ref="refEmailDetailsSenderIpBlacklistCheck"
      filterable
      options
      sizeable
      selectable
      :loading="loading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :download-button="tableOptions.downloadButton"
      :addButton="tableOptions.addButton"
      :pageSizes="tableOptions.pageSizes"
      :select-event="tableOptions.selectEvent"
      @refreshAction="callForEmailDetails"
    >
      <template v-slot:datatable-custom-column="{ scope, col }">
        <span v-if="col.property === PROPERTY_STORE.ANALYSISENGINEPERMALINK">
          <a
            v-if="
              scope.row.analysisEnginePermalink &&
              scope.row.result !== 'Excluded' &&
              scope.row.analysisEngineType !== INTEGRATION_TYPES.VIRUSTOTAL &&
              scope.row.analysisEngineType !== INTEGRATION_TYPES.OPSWAT
            "
            :href="scope.row.analysisEnginePermalink"
            target="_blank"
            class="attachments-table__link"
            >See Details</a
          >
          <span v-else></span>
        </span>
        <span v-if="col.property === PROPERTY_STORE.REASON">
          <v-tooltip bottom v-if="scope.row.reasonDescription">
            <template #activator="{ on }">
              <span v-on="on">{{ scope.row.reason }}</span>
            </template>
            <span>{{ scope.row.reasonDescription }}</span>
          </v-tooltip>
          <span v-else>
            <span>{{ scope.row.reason }}</span></span
          >
        </span>
        <span v-if="col.property === PROPERTY_STORE.SCANTIME">
          <span v-if="scope.row.scanTime">{{
            scope.row.scanTime.includes('01/0001') || scope.row.scanTime.includes('01/0000')
              ? 'In Progress'
              : scope.row.scanTime
          }}</span>
          <span v-else></span>
        </span>
      </template>
    </data-table>
  </div>
</template>
<script>
import DataTable from '@/components/DataTable'
import { getStoreValue, PROPERTY_STORE, INTEGRATION_TYPES } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
export default {
  name: 'EmailDetailsSenderIpBlacklistCheck',
  components: { DataTable },
  props: {
    loading: {
      type: Boolean
    },
    mailDetails: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [],
      PROPERTY_STORE,
      INTEGRATION_TYPES,
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.ANALYSISENGINE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.NAME),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.RESULT,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.RESULT),
            sortable: true,
            show: true,
            type: 'badge',
            width: 150
          },
          {
            property: PROPERTY_STORE.SCANTIME,
            align: 'left',
            editable: false,
            label: labels.AnalysisDate,
            sortable: true,
            show: true,
            fixed: false,
            width: 160,
            type: 'slot'
          },
          {
            property: PROPERTY_STORE.REASON,
            align: 'left',
            editable: false,
            label: labels.Reason,
            sortable: true,
            show: true,
            fixed: false,
            width: 190,
            type: 'slot'
          },
          {
            property: PROPERTY_STORE.ANALYSISENGINEPERMALINK,
            align: 'left',
            label: getStoreValue(PROPERTY_STORE.DETAILS),
            show: true,
            fixed: false,
            type: 'slot',
            hideSort: true
          }
        ],
        downloadButton: {
          show: false,
          disable: false
        },
        empty: {
          message: 'No analysis result to display'
        }
      }
    }
  },
  created() {
    this.tableData = this?.mailDetails?.ips[0]?.analysisList || []
  },
  methods: {
    callForEmailDetails() {
      this.$emit('on-refresh-click')
    }
  }
}
</script>
