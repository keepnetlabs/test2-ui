<template>
  <v-card class="double-table">
    <div class="header recent-investigations__header">
      <div class="title">
        <h2>Recent Investigations</h2>
        <p>Most recent investigations</p>
      </div>
      <div class="action">
        <v-btn
          class="btn-action btn-investigations"
          style="padding: 0 13px !important;"
          block
          rounded
          @click.native="$router.push('/investigations')"
        >
          Investigations
          <v-icon class="pl-2">mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="table investigations">
      <data-table
        :refName="'recentInv'"
        ref="refRecentInv"
        :columns="recentInv.columns"
        :countRow="5"
        :pageSizes="[]"
        :defaultSort="'priority'"
        :selectable="false"
        :filterable="false"
        :rowActions="[]"
        :addUsers="recentInv.addMenu"
        :empty="recentInv.iEmpty"
        :selectEvent="recentInv.selectEvent"
        :border="false"
        :showHeader="false"
        class="no-sub-border-datatable"
      />
    </div>
  </v-card>
</template>

<script>
import DataTable from '@/components/DataTable'
import { COMMON_CONSTANTS, getStoreValue } from '@/model/constants/commonConstants'
import { getRunningInvestigations } from '@/api/incidentResponder'
export default {
  name: 'RecentInvestigations',
  components: {
    DataTable
  },
  data() {
    return {
      recentInv: {
        table: [],
        columns: [
          {
            property: 'name',
            align: 'left',
            editable: false,
            label: 'Investigation Name',
            fixed: false,
            sortable: false,
            show: true,
            type: 'link',
            href: '/investigation-details',
            hrefKey: 'resourceId',
            minWidth: '40'
          },
          {
            property: 'progress',
            align: 'center',
            editable: false,
            label: getStoreValue('progress'),
            fixed: false,
            sortable: false,
            show: true,
            type: 'progress',
            minWidth: '30'
          },
          {
            property: 'status',
            align: 'center',
            editable: false,
            label: getStoreValue('status'),
            fixed: false,
            sortable: false,
            show: true,
            type: 'status',
            minWidth: '30'
          }
        ],
        addUsers: {
          show: false,
          popUp: false
        },
        addMenu: {
          show: false,
          popUp: false
        },
        iEmpty: {
          message: 'No investigations',
          btn: 'START A NEW INVESTIGATION',
          icon: 'mdi-plus'
        }
      }
    }
  },
  created() {
    getRunningInvestigations()
      .then((response) => {
        const {
          data: { data, status }
        } = response
        this.investigationListData = data
        this.$refs.refRecentInv.loadWithDataArray(data || [])
      })
      .catch((error) => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Error when getting the recent investigations! '
        })
      })
  }
}
</script>

<style lang="scss">
.recent-investigations__header {
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 24px;
  padding-bottom: 0;
  .btn-action {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    background-color: #ffffff !important;
    border-radius: 18px;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: solid 1px #2196f3;
  }
}
</style>
