<template>
  <div class="incident-responder-parent">
    <div class="incident-responder pa-0 ma-0">
      <div class="double-table mt-0">
        <div class="column ma-0" style="width: 100%;">
          <v-card style="padding-bottom: 0 !important;">
            <div class="header mb-2">
              <div class="title">
                <h2>Top Rules</h2>
                <p>Most triggered Playbook rules</p>
              </div>
              <div class="action">
                <v-btn
                  class="btn-action btn-playbook"
                  block
                  rounded
                  @click="$router.push('/playbook')"
                >
                  Playbook
                  <v-icon class="pl-2">mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="table">
              <data-table
                :refName="'topRules'"
                ref="refTopRules"
                :columns="topRules.columns"
                :table="topRules.table"
                :countRow="5"
                :pageSizes="[]"
                :defaultSort="'status'"
                :selectable="false"
                :filterable="false"
                :rowActions="[]"
                :addUsers="topRules.addMenu"
                :empty="topRules.iEmpty"
                :selectEvent="topRules.selectEvent"
                :border="false"
                :showHeader="false"
                @onEmptyBtnClicked="onTopRulesEmptyBtnClicked"
                class="no-sub-border-datatable"
              >
                <template v-slot:datatable-column-popup="{ scope, col }">
                  <span v-if="scope.row[col.property] === 0">
                    No Matches
                  </span>
                  <span v-else class="popup-link">
                    {{ scope.row[col.property] === 0 ? 'No' : scope.row[col.property] }} Matches
                  </span>
                </template>
                <template v-slot:datatable-custom-column="{ scope }">
                  <span class="datatable-link" v-if="scope.row.ruleName">
                    {{ scope.row.ruleName }}
                  </span>
                  <span v-else> </span>
                </template>
              </data-table>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { getTopRules } from '@/api/incidentResponder'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  name: 'TopRules',
  components: {
    DataTable
  },
  data() {
    return {
      topRules: {
        table: [],
        columns: [
          {
            property: 'ruleName',
            align: 'left',
            editable: false,
            label: 'Rule Name',
            fixed: false,
            sortable: false,
            show: true,
            type: 'slot',
            minWidth: '40'
          },
          {
            property: 'matchCount',
            align: 'left',
            editable: false,
            label: 'Matching Incidents',
            fixed: false,
            sortable: false,
            show: true,
            type: 'popup',
            minWidth: '30',
            emptyText: 'No Match'
          },
          {
            property: 'status',
            align: 'center',
            editable: false,
            label: 'Status',
            fixed: false,
            sortable: false,
            show: true,
            type: 'status',
            minWidth: '30',
            hasTooltip: true
          }
        ],
        iEmpty: {
          message: 'No rules configured',
          btn: 'CREATE NEW RULE',
          icon: 'mdi-plus'
        },
        addUsers: {
          show: false,
          popUp: false
        },
        addMenu: {
          show: false,
          popUp: false
        },
        selectEvent: {}
      }
    }
  },
  created() {
    getTopRules()
      .then((response) => {
        const {
          data: { data, status }
        } = response

        this.$refs.refTopRules.loadWithDataArray(data || [])
      })
      .catch((error) => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Error when getting the top rules!'
        })
      })
  },
  methods: {
    onTopRulesEmptyBtnClicked() {}
  }
}
</script>

<style lang="scss"></style>
