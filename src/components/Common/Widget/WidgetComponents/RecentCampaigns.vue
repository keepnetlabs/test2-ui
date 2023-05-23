<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          button-id="btn-link--recent-campaigns"
          close-button-id="btn-close--recent-campaigns"
          :editMode="editMode"
          :title="getTitle"
          :link="{ href: '/phishing-simulator/campaign-manager', text: 'All' }"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template #name="{ row, value, rowIndex }">
              <span
                v-if="value"
                :id="`text--recent-campaigns-name-${rowIndex}`"
                class="k-widget-list__item cursor-pointer"
                @click="
                  $router.push(
                    `/reports/campaign-reports/campaign-report/${row.resourceId}/${row.instanceGroup}`
                  )
                "
              >
                {{ value }}
              </span>
            </template>
            <template #startDate="{ row, value, rowIndex }">
              <span
                v-if="value"
                :id="`text--recent-campaigns-launch-date-${rowIndex}`"
                class="k-widget-list__item"
                style="color: #212121 !important; opacity: 0.7;"
              >
                {{ value }}
              </span>
            </template>
            <template #campaignStatus="{ row, rowIndex }">
              <DataTableChart
                :scope="{ row }"
                :id="`text--recent-campaigns-stats-${rowIndex}`"
                style="display: flex; justify-content: center;"
                :col="{ property: 'campaignStatus' }"
                :chart-options="getChartOptionsForRow(row)"
              />
            </template>
          </widget-list>
        </widget-body>
      </widget-container>
    </template>
  </WidgetLoading>
</template>

<script>
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetList from '@/components/Common/Widget/WidgetList'
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
import DataTableChart from '@/components/DataTableComponents/DataTableChart'
export default {
  name: 'RecentCampaigns',
  components: {
    DataTableChart,
    WidgetLoading,
    WidgetContainer,
    WidgetBody,
    WidgetHeader,
    WidgetList
  },
  props: {
    editMode: {
      type: Boolean,
      default: false,
      labels
    }
  },
  data() {
    return {
      columns: [
        {
          property: PROPERTY_STORE.NAME,
          label: LABEL_STORE.NAME,
          thStyle: {
            width: '40%'
          },
          tdStyle: {
            width: '40%'
          }
        },
        {
          property: PROPERTY_STORE.STARTDATE,
          label: LABEL_STORE.LAUNCH_DATE,
          thStyle: {
            width: '40%'
          },
          tdStyle: {
            width: '40%'
          }
        },
        {
          property: PROPERTY_STORE.CAMPAIGN_STATUS,
          label: LABEL_STORE.STATS,
          thStyle: {
            textAlign: 'center'
          }
        }
      ],
      empty: {
        message: 'You do not have any campaigns'
      }
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'widgets/getIsLoading',
      tableData: 'widgets/getRecentCampaignsCard'
    }),
    getTitle() {
      return labels.RecentCampaigns
    }
  },
  methods: {
    getChartOptionsForRow(row) {
      if (row.method === 'Click-Only') {
        return {
          backgroundColor: ['#67C23A', '#E6A23C', '#FBF280'],
          labels: [labels.NoResponse, labels.Clicked, labels.Opened],
          showTooltipLine: true
        }
      }
      if (row.method === 'Attachment') {
        return {
          backgroundColor: ['#67C23A', '#FBF280', '#F56C6C'],
          labels: [labels.NoResponse, labels.Opened, labels.OpenedAttachment],
          showTooltipLine: true
        }
      }

      if (row.method === 'Data Submission') {
        return {
          backgroundColor: ['#67C23A', '#E6A23C', '#FBF280', '#F56C6C'],
          labels: [labels.NoResponse, labels.Clicked, labels.Opened, labels.Submitted],
          showTooltipLine: true
        }
      }
      if (row.method === 'Multiple Method') {
        return {
          backgroundColor: ['#67C23A', '#E6A23C', '#FBF280', '#F56C6C', '#F56C6C'],
          labels: [
            labels.NoResponse,
            labels.Clicked,
            labels.Opened,
            labels.Submitted,
            labels.OpenedAttachment
          ],
          showTooltipLine: true
        }
      }
    }
  }
}
</script>
