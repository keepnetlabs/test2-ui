<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container v-resize="onResize">
        <widget-header
          title="Top Posts"
          :link="{ href: '/threat-sharing', text: 'All' }"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <widget-list
            class-name="top-posts-widget"
            :columns="columns"
            :data="tableData"
            :empty="empty"
          >
            <template v-slot:postTitle="{ value, row }">
              <span
                class="k-widget-list__item cursor-pointer"
                @click="handlePostTitleSelection(row)"
              >
                {{ value }}
              </span>
              <div class="k-widget-list__sub-item" v-if="row['communityName']">
                {{ row['communityName'] }}
              </div>
            </template>
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
  </WidgetLoading>
</template>

<script>
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import WidgetList from '@/components/Common/Widget/WidgetList'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import { getMyTopPosts } from '@/api/threadSharing'
export default {
  name: 'TopPosts',
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
          property: 'postTitle',
          label: 'Post Title',
          subItem: 'communityName',
          thStyle: {
            width: '70%'
          },
          tdStyle: {
            width: '70%'
          }
        },
        {
          property: 'commentCount',
          label: 'Engagement'
        }
      ],
      tableData: [],
      empty: {
        message: "There isn't any top posts, yet"
      }
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
    },
    onResize(e) {
      const listContainer = document.querySelector('.top-posts-widget')
      if (listContainer) {
        const { width: listWidth } = listContainer && listContainer.getBoundingClientRect()
        const th = document.querySelector('.k-widget-list__th-engagement')
        if (th && Math.floor(listWidth) < 250) {
          th.classList.add('top-posts-title')
          document
            .querySelectorAll('.right-side-like-comment-wrapper')
            .forEach((item) => item.classList.add('right-side-like-comment-wrapper-low-res'))
        } else {
          th.classList.remove('top-posts-title')
          document
            .querySelectorAll('.right-side-like-comment-wrapper')
            .forEach((item) => item.classList.remove('right-side-like-comment-wrapper-low-res'))
        }
      }
    },
    handlePostTitleSelection(row) {
      localStorage.setItem('communityName', row.communityName)
      localStorage.setItem('communityResourceIdForRedirect', row.communityResourceId)
      this.$router.push({
        path: `/community/${row.communityResourceId}`,
        query: { postId: row.communityPostResourceId }
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
.top-posts-title {
  text-align: center;
}
.right-side-like-comment-wrapper-low-res {
  display: flex;
  flex-direction: column;
  .right-side-message.pl-2 {
    padding-left: 0 !important;
  }
}
</style>
