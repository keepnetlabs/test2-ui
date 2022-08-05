<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          button-id="btn-link--top-phishing-simulation-reporters"
          close-button-id="btn-close--top-phishing-simulation-reporters"
          :editMode="editMode"
          :title="getTitle"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template #email="{ row, value, rowIndex }">
              <span
                v-if="value"
                :id="`text--top-phishing-simulation-reporters-email-${rowIndex}`"
                class="k-widget-list__item"
                style="color: #212121 !important; opacity: 0.7;"
              >
                {{ value }}
              </span>
            </template>
            <template #count="{ row, value, rowIndex }">
              <span
                v-if="value"
                :id="`text--top-phishing-simulation-reporters-reported-count-${rowIndex}`"
                class="k-widget-list__item"
                style="color: #212121 !important; opacity: 0.7;"
              >
                {{ value }}
              </span>
            </template>
          </widget-list>
        </widget-body>
      </widget-container>
    </template>
  </WidgetLoading>
</template>

<script>
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetList from '@/components/Common/Widget/WidgetList'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'

export default {
  name: 'MostEngagedCampaigns',
  components: {
    WidgetBody,
    WidgetLoading,
    WidgetHeader,
    WidgetList,
    WidgetContainer
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      columns: [
        {
          property: 'email',
          label: 'Email Address',
          thStyle: {
            width: '60%'
          },
          tdStyle: {
            width: '60%'
          }
        },
        {
          property: 'count',
          align: 'left',
          label: 'Reported',
          thStyle: {
            textAlign: 'right'
          },
          tdStyle: {
            textAlign: 'right'
          }
        }
      ],
      empty: {
        message: labels.EmptyTopPhishingSimulationReporters
      }
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'widgets/getIsLoading',
      tableData: 'widgets/getTopPhishingSimulationReportersCard'
    }),
    getTitle() {
      return labels.TopPhishingSimulationReporters
    }
  }
}
</script>
