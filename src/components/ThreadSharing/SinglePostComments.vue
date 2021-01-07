<template>
  <div class="w-100">
    <app-dialog
      :status="isWantToDeleteComment"
      @changeStatus="isWantToDeleteComment = false"
      icon="mdi-delete"
      title="Delete Comment?"
      body="This comment will be deleted from the post"
    >
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          :confirm-button-disabled="isConfirmButtonDisabled"
          @handleClose="isWantToDeleteComment = false"
          @handleConfirm="deleteCommentConfirm()"
        />
      </template>
    </app-dialog>
    <PostCardLoading v-if="commentsLoading" :loading="commentsLoading" id="your-post-skeleton">
      <template v-slot:skeleton-content> </template>
    </PostCardLoading>
    <div
      class="preview-comments"
      :class="{ 'open-comments': commentOpened }"
      v-if="!commentsLoading"
    >
      <v-form ref="refCommentForm" class="add-comment-row" onSubmit="return false;">
        <v-text-field
          :id="'single-post-comment-' + post.communityPostResourceId"
          class="comment-input"
          placeholder="Write your comment here"
          outlined
          v-model.trim="addCommentValue"
          validate-on-blur
          :rules="[rules.required, rules.maxLength, rules.minLength]"
        />
        <v-btn
          :id="'single-post-send-comment' + post.communityPostResourceId"
          @click="addPostComment(post.communityPostResourceId, post.communityResourceId)"
          class="send-btn"
          type="button"
          :disabled="
            !checkPermissions('community-posts/{communityPostResourceId}/comments', 'POST') ||
            isPostButtonDisabled
          "
        >
          <v-icon>mdi-send</v-icon>
          SEND
        </v-btn>
      </v-form>

      <div v-if="postComments && postComments.length" class="hidden-comments">
        <div
          v-for="(com, ind) of seeComments ? postComments : postComments.slice(0, 1)"
          :key="ind + com.resourceId"
          class="comment-row"
        >
          <div class="user-wrapper w-100" v-if="!com.isEdit">
            <div class="d-flex align-center w-100">
              <div style="width: 80%;">
                <b class="username">{{ com.commenterFullName }}</b>
                from
                <b class="company-name">{{ com.commenterCompanyName }}</b>
                <p class="company-date mb-0">{{ com.commentTime }}</p>
                <p class="the-comment">{{ com.comment }}</p>
              </div>
              <div
                style="width: 20%; text-align: right;"
                v-if="canDeleteOrEditComment('update') || canDeleteOrEditComment('delete')"
              >
                <button
                  v-if="canDeleteOrEditComment('update')"
                  @click="editRelativeComment(com)"
                  class="pr-4"
                  :disabled="!com.canEdit"
                >
                  <v-icon class="close-icon" :disabled="!com.canEdit">mdi-pencil</v-icon>
                </button>
                <button
                  v-if="canDeleteOrEditComment('delete')"
                  @click="deleteComment(com)"
                  :disabled="!com.canDelete"
                  icon
                >
                  <v-icon class="close-icon" :disabled="!com.canDelete">mdi-delete</v-icon>
                </button>
              </div>
            </div>
          </div>
          <div class="add-comment-row w-100" v-else>
            <div class="d-flex align-center w-100">
              <div style="width: 80%;" class="d-flex">
                <v-text-field
                  :id="'single-post-comment-' + com.resourceId"
                  class="comment-input"
                  placeholder="Write your comment here"
                  outlined
                  v-model.trim="com.commentValue"
                  validate-on-blur
                  :rules="[rules.required]"
                  hide-details
                />
                <v-btn
                  @click="updateComments(com)"
                  class="send-btn"
                  :disabled="!com.canEdit || isEditCommentButtonDisabled"
                >
                  <v-icon :disabled="!com.canEdit">mdi-send</v-icon>
                  Edit
                </v-btn>
              </div>
              <div style="width: 20%; text-align: right;">
                <button @click="editRelativeComment(com)" :disabled="!com.canDelete">
                  <v-icon class="close-icon" :disabled="!com.canDelete">mdi-close</v-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!seeComments && postComments && postComments.length > 1"
        id="single-post-see-all-comments"
        class="see-all-comments"
        @click="seeComments = true"
      >
        <span>See all {{ postComments.length }} comments</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { createComments, deleteComments, getComments, updateComments } from '@/api/threadSharing'
import { checkPermission } from '@/utils/functions'
import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import PostCardLoading from '../SkeletonLoading/PostCardLoading'

export default {
  name: 'SinglePostComments',
  props: {
    commentOpened: {
      required: false
    },
    post: {
      required: false
    },
    comments: {
      required: false
    },
    seeComments: {
      required: false
    },
    changeCommentsValue: {
      required: false
    }
  },
  components: {
    AppDialog,
    AppDialogFooter,
    PostCardLoading
  },
  data() {
    return {
      addCommentValue: null,
      rules: {
        required: (v) => Validations.required(v),
        maxLength: (v) => Validations.maxLength(v, 300, labels.getMaxLengthMessage('Comment', 300)),
        minLength: (v) => Validations.minLength(v, 5, labels.getMinLengthMessage('Comment', 5)),
        regex: (v) =>
          /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen'
      },
      isPostButtonDisabled: false,
      isEditCommentButtonDisabled: false,
      getCommentDetails: false,
      isConfirmButtonDisabled: false,
      isWantToDeleteComment: false,
      postComments: [],
      commentsLoading: true
    }
  },
  mounted() {
    this.getComments(this.post.communityPostResourceId)
  },
  methods: {
    getComments(id) {
      this.isEditCommentButtonDisabled = true
      this.commentsLoading = true
      getComments(id)
        .then((response) => {
          const { data } = response
          this.getCommentDetails = true
          this.postComments = data.data
          this.$emit('changeCommentsValue', this.postComments)
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.postComments = []
          }
        })
        .finally(() => ((this.isEditCommentButtonDisabled = false), (this.commentsLoading = false)))
    },
    addPostComment(postId, communId) {
      this.isPostButtonDisabled = true
      if (this.$refs.refCommentForm.validate()) {
        const payload = {
          comment: this.addCommentValue
        }
        createComments(postId, payload)
          .then(() => {
            this.addCommentValue = ''
            this.getComments(this.post.communityPostResourceId)
            setTimeout(() => {
              this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
            }, 500)
          })
          .finally(() => {
            this.isPostButtonDisabled = false
          })
      } else {
        this.isPostButtonDisabled = false
      }
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    canDeleteOrEditComment(type) {
      if (type === 'update') {
        return this.checkPermissions('community-posts/comments/{resourceId}', 'PUT')
      } else {
        return this.checkPermissions('community-posts/comments/{resourceId}', 'DELETE')
      }
    },
    editRelativeComment(comment) {
      comment.isEdit = !comment.isEdit
      comment.commentValue = comment.comment
      this.$forceUpdate()
    },

    deleteComment(comment) {
      this.deleteCommentId = comment.resourceId
      this.isWantToDeleteComment = true
    },
    deleteCommentConfirm() {
      this.isConfirmButtonDisabled = true
      deleteComments(this.deleteCommentId)
        .then(() => {
          this.isWantToDeleteComment = false
          this.getComments(this.post.communityPostResourceId)
          setTimeout(() => {
            this.$store
              .dispatch('rightColumn/changeReloadRightColumnData', true)
              .finally(() => (this.isConfirmButtonDisabled = false))
          }, 500)
        })
        .catch(() => {
          this.isConfirmButtonDisabled = false
        })
    },
    updateComments(comment) {
      const payload = { comment: comment.commentValue }
      this.isEditCommentButtonDisabled = true
      updateComments(comment.resourceId, payload)
        .then(() => {
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
          }, 500)
          this.getComments(this.post.communityPostResourceId)
        })
        .catch(() => {
          this.isEditCommentButtonDisabled = false
        })
    }
  }
}
</script>

<style scoped></style>
