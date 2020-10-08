<template>
  <DatatableLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          title="Recent Investigations"
          :link="{ href: '/investigations', text: 'All' }"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template v-slot:name="{ value, row }">
              <router-link
                class="k-widget-list__item"
                :to="`/investigation-details/${row['resourceId']}}`"
                >{{ value }}</router-link
              >
              <div class="k-widget-list__sub-item">
                {{ row['status'] }}
              </div>
            </template>
            <template v-slot:progress="{ value }">
              <div class="datatable-progress">
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
  </DatatableLoading>
</template>

<script>
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import WidgetList from '@/components/Common/Widget/WidgetList'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import { getRunningInvestigations } from '@/api/incidentResponder'
export default {
  name: 'RecentInvestigations',
  components: {
    DatatableLoading,
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

  data() {
    return {
      isLoading: true,
      columns: [
        {
          property: 'name',
          label: 'Investigation Name',
          thStyle: {
            width: '60%'
          },
          tdStyle: {
            width: '60%'
          }
        },
        {
          property: 'progress',
          label: 'Progress',
          thStyle: {
            textAlign: 'center'
          }
        }
      ],
      tableData: [],
      empty: {
        message: "There isn't any recent investigations, yet"
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
          console.log('data', data)
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
