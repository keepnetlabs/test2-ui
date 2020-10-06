<template>
  <DatatableLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          :editMode="editMode"
          title="Reporters"
          @deleteWidget="$emit('deleteWidget')"
          :link="{ href: '/phishing-reporter', text: 'All' }"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData">
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
          </widget-list>
        </widget-body>
      </widget-container>
    </template>
  </DatatableLoading>
</template>

<script>
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetList from '@/components/Common/Widget/WidgetList'
export default {
  name: 'Reporters',
  components: {
    DatatableLoading,
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
          label: 'User Name'
        },
        {
          property: 'threats',
          label: 'Actual Threats',
          subItem: 'email'
        },
        {
          property: 'reliability',
          label: 'Reliability'
        }
      ],
      tableData: []
    }
  },
  created() {
    setTimeout(() => {
      this.tableData = [
        {
          userName: 'Dwight Schrute',
          threats: '97%',
          email: '277/286 email',
          reliability: 'Very High'
        },
        {
          userName: 'Dwight Schrute',
          threats: '97%',
          email: '277/286 email',
          reliability: 'Very High'
        },
        {
          userName: 'Dwight Schrute',
          threats: '97%',
          email: '277/286 email',
          reliability: 'Very High'
        },
        {
          userName: 'Dwight Schrute',
          threats: '97%',
          email: '277/286 email',
          reliability: 'Very High'
        },
        {
          userName: 'Dwight Schrute',
          threats: '97%',
          email: '277/286 email',
          reliability: 'Very High'
        }
      ]
      this.isLoading = false
    }, 200)
  }
}
</script>

<style lang="scss"></style>
