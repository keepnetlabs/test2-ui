<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          button-id="btn-link--recently-investigations"
          close-button-id="btn-close--recently-investigations"
          :title="getTitle"
          :link="{ href: '/investigations', text: 'All' }"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template v-slot:name="{ value, row, rowIndex }">
              <router-link
                class="k-widget-list__item"
                :id="`btn-link--recent-investigations-name-${rowIndex}`"
                :to="`/investigation-details/${row['resourceId']}`"
                >{{ value }}</router-link
              >
              <div
                class="k-widget-list__sub-item"
                :id="`text--recent-investigations-status--${rowIndex}`"
              >
                {{ row['status'] }}
              </div>
            </template>
            <template v-slot:progress="{ value, rowIndex }">
              <div
                class="datatable-progress"
                :id="`text--recent-investigations-progress--${rowIndex}`"
              >
                <template v-if="parseInt(value) >= 0">
                  <span :class="[value !== 100 && 'ml-1']" class="datatable-progress__per">{{
                    value === 100 ? 'Completed' : value + '%'
                  }}</span>
                  <v-progress-linear
                    :value="value"
                    background-color="#b3d4fc"
                    color="#2196f3"
                    height="4"
                    reactive
                    rounded
                  />
                </template>
                <span v-else>
                  <v-progress-linear
                    :value="0"
                    background-color="#e0e0e0"
                    color="#2196f3"
                    height="4"
                    reactive
                    rounded
                /></span>
              </div>
            </template>
          </widget-list>
        </widget-body>
      </widget-container>
    </template>
  </WidgetLoading>
</template>

<script>
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import WidgetList from '@/components/Common/Widget/WidgetList'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import { getRunningInvestigations } from '@/api/incidentResponder'
import labels from '@/model/constants/labels'
export default {
  name: 'RecentInvestigations',
  components: {
    WidgetLoading,
    WidgetContainer,
    WidgetList,
    WidgetBody,
    WidgetHeader
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  computed: {
    getTitle() {
      return labels.RecentInvestigations
    }
  },

  data() {
    return {
      isLoading: true,
      columns: [
        {
          property: labels.Name.toLowerCase(),
          label: labels.InvestigationName,
          thStyle: {
            width: '60%'
          },
          tdStyle: {
            width: '60%'
          }
        },
        {
          property: labels.Progress.toLowerCase(),
          label: labels.Progress,
          thStyle: {
            textAlign: 'center'
          }
        }
      ],
      tableData: [],
      empty: {
        message: 'You do not have any recent investigations'
      }
    }
  },
  created() {
    this.callForGetRunningInvestigations()
  },
  methods: {
    callForGetRunningInvestigations() {
      getRunningInvestigations()
        .then((response) => {
          const {
            data: { data }
          } = response
          this.tableData = data
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="scss"></style>
