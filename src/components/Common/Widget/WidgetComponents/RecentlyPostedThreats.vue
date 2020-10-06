<template>
  <DatatableLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          title="Recently Posted Threats"
          :link="{ href: '/threat-sharing', text: 'All' }"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData">
            <template v-slot:title="{ value, row }">
              <span class="k-widget-list__item" v-if="value">
                {{ value }}
              </span>
              <span v-else class="k-widget-list__no-match">{{ '' }}</span>
              <div class="k-widget-list__sub-item" v-if="row['harmfulItemCount']">
                {{
                  row['harmfulItemCount'] > 1
                    ? `${row['harmfulItemCount']} harmful items`
                    : `${row['harmfulItemCount']} harmful item`
                }}
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
import { getIncidentList, getMyTopPosts } from '@/api/threadSharing'
export default {
  name: 'RecentlyPostedThreats',
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
          property: 'title',
          label: 'Post Title'
        },
        {
          property: 'communityName',
          label: 'Community'
        }
      ],
      tableData: []
    }
  },
  created() {
    this.callForRecentlyPostedThreats()
  },
  methods: {
    callForRecentlyPostedThreats() {
      const payload = {
        postedCompanyResourceId: localStorage.getItem('companyResourceId'),
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'PostedTime',
        ascending: false
      }
      getIncidentList(payload)
        .then((response) => {
          const {
            data: {
              data: { results = [] }
            }
          } = response
          console.log('results', results)
          this.tableData = results
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
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
</style>
