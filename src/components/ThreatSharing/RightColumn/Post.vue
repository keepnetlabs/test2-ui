<template>
  <div class="post">
    <div
      :id="`text--threat-sharing-right-column-post-title-${index}`"
      class="right-side-sub-title pb-1"
    >
      <a
        id="threat-sharing-right-column-go-to-post-details-your-posts-button"
        @click="onClickPostDetails"
        >{{ post.postTitle || post.title }}</a
      >
    </div>
    <div
      :id="`text--threat-sharing-right-column-post-community-name-${index}`"
      class="right-side-desc pb-1"
    >
      in
      <a
        id="threat-sharing-right-column-go-to-community-details-your-posts-button"
        @click="onClickCommunityDetails"
        >{{ post.communityName }}</a
      >
    </div>
    <div class="right-side-like-comment-wrapper">
      <div class="right-side-like">
        <v-btn disabled text x-small icon color="grey">
          <v-icon>mdi-thumb-up</v-icon>
        </v-btn>
        <span
          :id="`text--threat-sharing-right-column-post-like-count-${index}`"
          class="like-count"
          >{{ post.likeCount }}</span
        >
      </div>
      <div class="right-side-message pl-2">
        <v-btn disabled text x-small icon color="grey">
          <v-icon>mdi-message-reply-text</v-icon>
        </v-btn>
        <span
          :id="`text--threat-sharing-right-column-post-comment-count-${index}`"
          class="comment-count"
          >{{ post.commentCount }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Post',
  props: {
    index: {
      type: Number,
      required: true
    },
    post: {
      type: Object,
      required: true
    }
  },
  emits: ['goToPostDetails', 'goToCommunityDetails'],
  methods: {
    onClickPostDetails() {
      this.$emit('goToPostDetails')
    },
    onClickCommunityDetails() {
      this.$emit('goToCommunityDetails')
    }
  }
}
</script>
