<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          :editMode="editMode"
          :title="getTitle"
          @deleteWidget="$emit('deleteWidget')"
          :link="{ href: '/phishing-reporter', text: 'All' }"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template v-slot:reporterEmail="{ row, value }">
              <span
                class="k-widget-list__item"
                v-if="value"
                style="color: #212121 !important; opacity: 0.7;"
              >
                {{ value }}
              </span>
            </template>
            <template v-slot:reliabilityPoint="{ row, value }">
              <span
                class="k-widget-list__item"
                v-if="value"
                style="color: #212121 !important; opacity: 0.7;"
              >
                {{ value }}
              </span>
            </template>
            <template v-slot:reliability="{ value }">
              <div
                class="k-widget-list__item"
                :style="{
                  color: `${getTextColor(value)} !important`,
                  overflow: 'hidden',
                  textOverflow: 'hidden'
                }"
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
        message: "There isn't any reporters, yet"
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
          console.log('data', data)
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
