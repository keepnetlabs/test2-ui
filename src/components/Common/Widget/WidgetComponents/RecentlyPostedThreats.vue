<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          :title="getTitle"
          :link="{ href: '/threat-sharing', text: 'All' }"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" :empty="empty">
            <template v-slot:title="{ value, row }">
              <span
                class="k-widget-list__item cursor-pointer"
                @click="handleTitleSelection(row)"
                v-if="value"
              >
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
            <template v-slot:communityName="{ value, row }">
              <span class="k-widget-list__item cursor-pointer">
                <span
                  class="k-widget-list__item cursor-pointer"
                  @click="handleCommunitySelection(row)"
                >
                  {{ value }}
                </span>
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
import { getIncidentList } from '@/api/threadSharing'
import labels from '@/model/constants/labels'
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
export default {
  name: 'RecentlyPostedThreats',
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
    }
  },

  data() {
    return {
      isLoading: true,
      columns: [
        {
          property: PROPERTY_STORE.TITLE,
          label: LABEL_STORE.POSTTITLE,
          thStyle: {
            width: '60%'
          },
          tdStyle: {
            width: '60%'
          }
        },
        {
          property: PROPERTY_STORE.COMMUNITYNAME,
          label: labels.Community
        }
      ],
      tableData: [],
      empty: {
        message: labels.EmptyRecentlyPostedThreats
      }
    }
  },
  created() {
    this.callForRecentlyPostedThreats()
  },
  computed: {
    getTitle() {
      return labels.RecentlyPostedThreats
    }
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
          this.tableData = results
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    handleTitleSelection(row) {
      localStorage.setItem('communityName', row.communityName)
      localStorage.setItem('communityResourceIdForRedirect', row.communityResourceId)
      this.$router.push({
        path: `/community/${row.communityResourceId}`,
        query: {
          postId: row.communityPostResourceId,
          communityName: localStorage.getItem('communityName'),
          communityId: localStorage.getItem('communityResourceIdForRedirect')
        }
      })
    },
    handleCommunitySelection(row) {
      localStorage.setItem('communityName', row.communityName)
      localStorage.setItem('communityResourceIdForRedirect', row.communityResourceId)
      this.$router.push({
        path: `/community/${row.communityResourceId}`
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
