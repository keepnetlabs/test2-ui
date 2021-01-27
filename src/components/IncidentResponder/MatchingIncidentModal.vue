<template>
  <app-dialog
    :status="status"
    icon="mdi-email"
    title="Matching Incidents"
    :subtitle="getSelectedMatchingIncidentsSubtitle"
    @changeStatus="closeOverlay"
    size="maximum"
    class-name="matching-modal"
    maxHeightSize="665"
  >
    <template v-slot:app-dialog-body>
      <v-card light>
        <v-list-item class="matching-modal__list-item">
          <v-list-item-content>
            <data-table
              ref="refMatchingInvestigation"
              id="matching-incident-data-table"
              :refName="'matchingInvestigation'"
              :count-row="5"
              :table="tableData"
              :columns="columns"
              :loading="isMatchingModalLoading"
              :pageSizes="[5, 10, 25]"
              :showHeader="true"
              :defaultSort="'subject'"
              :selectable="false"
              :filterable="true"
              :options="true"
              :rowActions="[]"
              :cell-padding="15"
              :empty="empty"
              @refreshAction="callForMatchingIncident"
            />
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex justify-end">
        <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="closeOverlay"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import { getStoreValue } from '@/model/constants/commonConstants'
import { getMatchingIncidents } from '@/api/incidentResponder'
export default {
  name: 'MatchingIncidentModal',
  components: {
    AppDialog,
    DataTable
  },
  props: {
    status: {
      type: Boolean
    },
    selectedMatch: {
      type: Object
    }
  },
  data() {
    return {
      columns: [
        {
          property: 'subject',
          align: 'left',
          editable: false,
          label: 'Subject',
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          minWidth: '33'
        },
        {
          property: 'createDate',
          align: 'left',
          editable: false,
          label: getStoreValue('createDate'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          minWidth: '33'
        },
        {
          property: 'reportedBy',
          align: 'left',
          editable: false,
          label: getStoreValue('reportedBy'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'text',
          minWidth: '34'
        }
      ],
      empty: { message: "There isn't any matching Incidents, yet", btn: '', icon: 'mdi-plus' },
      tableData: [],
      isMatchingModalLoading: true
    }
  },
  computed: {
    getSelectedMatchingIncidentsSubtitle() {
      return this.selectedMatch && `Incidents matching Rule: ${this.selectedMatch['ruleName']}`
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    callForMatchingIncident() {
      const payload = {
        pageNumber: 1,
        pageSize: 50000,
        orderBy: 'createDate',
        ascending: true
      }
      this.isMatchingModalLoading = true
      getMatchingIncidents(payload, this.selectedMatch.resourceId)
        .then((response) => {
          this.$refs.refMatchingInvestigation.loadWithDataArray(response.data.data.results || [])
        })
        .finally(() => (this.isMatchingModalLoading = false))
    }
  },
  created() {
    if (this.selectedMatch) {
      this.callForMatchingIncident()
    }
  }
}
</script>

<style lang="scss"></style>
