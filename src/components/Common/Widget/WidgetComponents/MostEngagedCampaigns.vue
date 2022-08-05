<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          button-id="btn-link--most-engaged-campaigns"
          close-button-id="btn-close--most-engaged-campaigns"
          :editMode="editMode"
          :title="getTitle"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template #name="{ row, value, rowIndex }">
              <span
                v-if="value"
                :id="`text--most-engaged-campaigns-name-${rowIndex}`"
                class="k-widget-list__item"
                style="color: #212121 !important; opacity: 0.7;"
              >
                {{ value }}
              </span>
            </template>
            <template #phishedUsersCount="{ row, value, rowIndex }">
              <span
                v-if="value"
                :id="`text--most-engaged-campaigns-engaged-count-${rowIndex}`"
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
          property: 'name',
          label: 'Name',
          thStyle: {
            width: '60%'
          },
          tdStyle: {
            width: '60%'
          }
        },
        {
          property: 'phishedUsersCount',
          align: 'left',
          label: 'Phished Users',
          thStyle: {
            textAlign: 'right'
          },
          tdStyle: {
            textAlign: 'right'
          }
        }
      ],
      empty: {
        message: labels.EmptyMostEngagedCampaignsWidget
      }
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'widgets/getIsLoading',
      tableData: 'widgets/getMostEngagedCampaignsCard'
    }),
    getTitle() {
      return labels.MostEngagedCampaigns
    }
  }
}
</script>
