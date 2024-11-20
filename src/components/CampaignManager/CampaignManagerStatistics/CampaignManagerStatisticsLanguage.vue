<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <widget-container class="campaign-manager-scenario-statistics-widget">
        <widget-header
          button-id="btn-link--recently-posted-threats"
          close-button-id="btn-close--recently-posted-threats"
          :title="getTitle"
          :subtitle="getSubtitle"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template #title="{ value }">
              <span v-if="value" class="campaign-manager-scenario-statistics-widget__column">
                {{ value }}
              </span>
            </template>
            <template #communityName="{ value }">
              <span>
                <span class="campaign-manager-scenario-statistics-widget__column">
                  {{ '150' }}
                </span>
                <span
                  class="campaign-manager-scenario-statistics-widget__bar"
                  style="width: 45%;"
                ></span>
                <span class="campaign-manager-scenario-statistics-widget__percentage">45%</span>
              </span>
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
import { getIncidentList } from '@/api/threatSharing'
import labels from '@/model/constants/labels'
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
export default {
  name: 'CampaignManagerStatisticsLanguage',
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
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLoading: !this.data.length,
      columns: [
        {
          property: PROPERTY_STORE.TITLE,
          label: LABEL_STORE.NAME,
          thStyle: {
            width: '30%'
          },
          tdStyle: {
            width: '30%'
          }
        },
        {
          property: PROPERTY_STORE.COMMUNITYNAME,
          label: labels.NumberOfTemplates
        }
      ],
      tableData: [],
      empty: {
        message: labels.EmptyData
      }
    }
  },
  computed: {
    getTitle() {
      return 'Language'
    },
    getSubtitle() {
      return 'Number of phishing templates by language'
    }
  },
  watch: {
    data(data) {
      this.tableData = data
      this.isLoading = false
    }
  }
}
</script>
