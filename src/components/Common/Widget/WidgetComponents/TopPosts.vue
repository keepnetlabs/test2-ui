<template>
  <DatatableLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          title="Top Posts"
          :link="{ href: '/threat-sharing', text: 'All' }"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list :columns="columns" :data="tableData" auto>
            <template v-slot:commentCount="{ row }">
              <div class="right-side-like-comment-wrapper">
                <div class="right-side-like">
                  <v-icon style="opacity: 0.7;" small>mdi-thumb-up</v-icon>
                  <span class="like-count">{{ row.likeCount }}</span>
                </div>
                <div class="right-side-message pl-2">
                  <v-icon style="opacity: 0.7;" small>mdi-message-reply-text</v-icon>
                  <span class="comment-count">{{ row.commentCount }}</span>
                </div>
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
import { getMyTopPosts } from '@/api/threadSharing'
export default {
  name: 'TopPosts',
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
          property: 'postTitle',
          label: 'Post Title',
          subItem: 'communityName'
        },
        {
          property: 'commentCount',
          label: 'Engagement'
        }
      ],
      tableData: []
    }
  },
  created() {
    this.callForTopPosts()
  },
  methods: {
    callForTopPosts() {
      getMyTopPosts()
        .then((response) => {
          const {
            data: { data = [] }
          } = response
          this.tableData = data.slice(0, 5)
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
