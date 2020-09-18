<template>
  <div class="incident-responder-parent">
    <v-skeleton-loader :loading="isLoading" type="table-heading,table-tbody">
      <div class="incident-responder pa-0 ma-0">
        <div class="double-table mt-0">
          <div class="column ma-0" style="width: 100%;">
            <v-card style="padding-bottom: 0 !important;">
              <div class="header mb-2">
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
                  :table="recentInv.table"
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
          </div>
        </div>
      </div>
    </v-skeleton-loader>
  </div>
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
      isLoading: true,
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
          data: { data }
        } = response
        this.investigationListData = data
        this.recentInv.table = data
        this.isLoading = false
      })
      .catch(() => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Error when getting the recent investigations! '
        })
        this.isLoading = false
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
  padding: 24px 24px 0 24px;
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
  .title {
    font-size: 1.25rem !important;
    font-weight: 500;
    line-height: 2rem;
    letter-spacing: 0.0125em !important;
    font-family: 'Roboto', sans-serif !important;
    h2 {
      font-family: 'Open Sans', sans-serif;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: #2196f3;
    }
    p {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }
}
</style>
