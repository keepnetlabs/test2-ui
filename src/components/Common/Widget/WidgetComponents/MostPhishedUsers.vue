<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          button-id="btn-link--most-phished-users"
          close-button-id="btn-close--most-phished-users"
          :editMode="editMode"
          :title="getTitle"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template #email="{ row, value, rowIndex }">
              <span
                v-if="value"
                :id="`text--most-phished-users-email-${rowIndex}`"
                class="k-widget-list__item"
                style="color: #212121 !important; opacity: 0.7;"
              >
                {{ value }}
              </span>
            </template>
            <template #count="{ row, value, rowIndex }">
              <span
                v-if="value"
                :id="`text--most-phished-users-count-${rowIndex}`"
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
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'

export default {
  name: 'MostPhishedUsers',
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
          property: PROPERTY_STORE.EMAIL,
          label: 'Email Address',
          thStyle: {
            width: '60%'
          },
          tdStyle: {
            width: '60%'
          }
        },
        {
          property: PROPERTY_STORE.COUNT,
          align: 'left',
          label: labels.Phished,
          thStyle: {
            textAlign: 'right'
          },
          tdStyle: {
            textAlign: 'right'
          }
        }
      ],
      empty: {
        message: labels.EmptyMostPhishedUsersWidget
      }
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'widgets/getIsLoading',
      tableData: 'widgets/getMostPhishedUsersCard'
    }),
    getTitle() {
      return labels.MostPhishedUsers
    }
  }
}
</script>
