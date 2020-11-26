<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          :editMode="editMode"
          title="Reporters"
          @deleteWidget="$emit('deleteWidget')"
          :link="{ href: '/phishing-reporter', text: 'All' }"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template v-slot:threats="{ row, value }">
              <span
                class="k-widget-list__item"
                v-if="value"
                style="color: #212121 !important; opacity: 0.7;"
              >
                {{ value }}
              </span>
              <div
                class="k-widget-list__sub-item"
                v-if="row['email']"
                style="color: #474747; opacity: 0.64;"
              >
                {{ row['email'] }}
              </div>
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
      isLoading: true,
      columns: [
        {
          property: 'userName',
          label: 'User Name',
          thStyle: {
            width: '40%'
          },
          tdStyle: {
            width: '40%'
          }
        },
        {
          property: 'threats',
          label: 'Actual Threats',
          subItem: 'email',
          thStyle: {
            width: '25%'
          },
          tdStyle: {
            width: '25%'
          }
        },
        {
          property: 'reliability',
          label: 'Reliability',
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
  methods: {
    getTextColor(value) {
      return getTextColor(value)
    }
  },
  created() {
    setTimeout(() => {
      this.tableData = [
        {
          userName: 'Dwight Schrute',
          threats: '97%',
          email: '277/286 emails',
          reliability: 'Very High'
        },
        {
          userName: 'Oscar Martinez',
          threats: '83%',
          email: '99/120 emails',
          reliability: 'High'
        },
        {
          userName: 'Ryan Howard',
          threats: '61%',
          email: '61/100 emails',
          reliability: 'Medium'
        },
        {
          userName: 'Creed Bratton',
          threats: '75%',
          email: '3/4 emails',
          reliability: 'Low'
        },
        {
          userName: 'Andy Bernard',
          threats: '30%',
          email: '90/300 emails',
          reliability: 'Very Low'
        }
      ]
      this.isLoading = false
    }, 200)
  }
}
</script>

<style lang="scss"></style>
