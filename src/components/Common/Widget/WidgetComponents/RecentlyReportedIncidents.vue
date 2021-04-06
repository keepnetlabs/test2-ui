<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <v-btn style="display: none;" />
      <widget-container>
        <widget-header
          button-id="btn-link--recently-reported-incidents"
          :title="getTitle"
          :link="{ href: '/incident-responder', text: 'All' }"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template v-slot:subject="{ value, row }">
              <router-link
                class="k-widget-list__item"
                :to="`/incident-responder/${row['resourceId']}`"
                >{{ value }}</router-link
              >
              <div class="k-widget-list__sub-item">
                {{ getDataTableFieldLabel(row['status']) }}
              </div>
            </template>
            <template v-slot:result="{ value }">
              <badge
                size="small"
                class-name="widget-badge"
                :color="getBtnStatusColor(value)"
                :text="getDataTableFieldLabel(value)"
              />
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
import { searchNotifiedMail } from '@/api/incidentResponder'
import { getBtnStatusColor, getDataTableFieldLabel } from '@/utils/functions'
import Badge from '@/components/Badge'
import labels from '@/model/constants/labels'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
export default {
  name: 'RecentlyReportedIncidents',
  components: {
    Badge,
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

  data() {
    return {
      isLoading: true,
      columns: [
        {
          property: PROPERTY_STORE.SUBJECT,
          label: labels.Subject,
          thStyle: {
            width: '60%'
          },
          tdStyle: {
            width: '60%'
          }
        },
        {
          property: PROPERTY_STORE.RESULT,
          label: labels.Result,
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
        message: labels.EmptyRecentlyReportedIncidents
      }
    }
  },
  created() {
    this.callForRecentlyReportedIncidents()
  },
  computed: {
    getTitle() {
      return labels.RecentlyReportedIncidents
    }
  },
  methods: {
    callForRecentlyReportedIncidents() {
      const payload = {
        pageNumber: 1,
        clusteredBy: '',
        pageSize: 5,
        orderBy: 'createTime',
        ascending: false
      }
      searchNotifiedMail(payload)
        .then((response) => {
          const {
            data: {
              data: { results = [] }
            }
          } = response
          this.tableData = results
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    getDataTableFieldLabel(label) {
      return getDataTableFieldLabel(label)
    },
    getBtnStatusColor(color) {
      return getBtnStatusColor(color)
    }
  }
}
</script>

<style lang="scss">
.right-side-like-comment-wrapper {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #4a4a4a;
}
.right-side-like {
  display: flex;
  align-items: center;
}
.right-side-message {
  display: flex;
  align-items: center;
  padding-top: 2px;
}
.like-count {
  margin-left: 2px;
}
.comment-count {
  margin-left: 2px;
  margin-top: -2px;
}
.widget-badge {
  max-width: 90px !important;
}
</style>
