<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          button-id="btn-link--reporters"
          close-button-id="btn-close--reporters"
          :editMode="editMode"
          :title="getTitle"
          :link="{ href: '/phishing-reporter', text: 'All' }"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template v-slot:reporterEmail="{ row, value, rowIndex }">
              <span
                v-if="value"
                class="k-widget-list__item"
                style="color: #212121 !important; opacity: 0.7;"
                :id="`text--reporters-name-${rowIndex}`"
              >
                {{ value }}
              </span>
            </template>
            <template v-slot:reliabilityPoint="{ row, value, rowIndex }">
              <span
                v-if="value"
                class="k-widget-list__item"
                style="color: #212121 !important; opacity: 0.7;"
                :id="`text--reporters-reliability-point-${rowIndex}`"
              >
                {{ value }}
              </span>
            </template>
            <template v-slot:reliability="{ value, rowIndex }">
              <div
                class="k-widget-list__item"
                :style="{
                  color: `${getTextColor(value)} !important`,
                  overflow: 'hidden',
                  textOverflow: 'hidden'
                }"
                :id="`text--reporters-reliability-${rowIndex}`"
              >
                {{ value }}
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
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetList from '@/components/Common/Widget/WidgetList'
import { getTextColor } from '@/utils/functions'
import labels from '@/model/constants/labels'
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
import { getReporters } from '@/api/phishingReporter'
export default {
  name: 'Reporters',
  components: {
    WidgetLoading,
    WidgetContainer,
    WidgetBody,
    WidgetHeader,
    WidgetList
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: false,
      columns: [
        {
          property: PROPERTY_STORE.REPORTEREMAIL,
          label: LABEL_STORE.USERNAME,
          thStyle: {
            width: '40%'
          },
          tdStyle: {
            width: '40%'
          }
        },
        {
          property: PROPERTY_STORE.RELIABILITYPOINT,
          label: LABEL_STORE.RELIABILITYPOINT,
          thStyle: {
            textAlign: 'center',
            width: '20%'
          },
          tdStyle: {
            textAlign: 'center',
            width: '20%'
          }
        },
        {
          property: PROPERTY_STORE.RELIABILITY,
          label: LABEL_STORE.RELIABILITY,
          thStyle: {
            textAlign: 'center'
          },
          tdStyle: {
            textAlign: 'center'
          }
        }
      ],
      tableData: [],
      empty: {
        message: 'You do not have any reporters'
      }
    }
  },
  computed: {
    getTitle() {
      return labels.Reporters
    }
  },
  created() {
    this.callForGetReporters()
  },
  methods: {
    callForGetReporters() {
      this.isLoading = true
      getReporters()
        .then((response) => {
          const {
            data: { data = [] }
          } = response
          this.tableData = data
        })
        .finally(() => (this.isLoading = false))
    },
    getTextColor(value) {
      return getTextColor(value)
    }
  }
}
</script>

<style lang="scss"></style>
