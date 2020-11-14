<template>
  <div class="component-single-post" :key="$route.query.postId || '1'">
    <div style="z-index: 999999;">
      <new-investigation
        @closeAdd="closeNewInvestigationModal($event)"
        ref="refNewInvestigation"
        :status="isWantToAddNewInvestigation"
        v-if="isWantToAddNewInvestigation"
        :selectedMail="selectedEmail"
        style="z-index: 999999;"
      />
    </div>
    <app-dialog
      :status="isWantToDelete"
      @changeStatus="isWantToDelete = false"
      icon="mdi-delete"
      title="Delete Incident?"
      :subtitle="deleteIncidentName"
      :body="`This post will be deleted from ${deleteIncidentCommunityName}`"
    >
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          @handleClose="isWantToDelete = false"
          @handleConfirm="deleteIncidentConfirm()"
          actionButtonText="DELETE"
        />
      </template>
    </app-dialog>
    <app-dialog
      :status="isWantToDeleteComment"
      @changeStatus="isWantToDeleteComment = false"
      icon="mdi-delete"
      title="Delete Comment?"
      body="This comment will be deleted from the post"
    >
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          @handleClose="isWantToDeleteComment = false"
          @handleConfirm="deleteCommentConfirm()"
        />
      </template>
    </app-dialog>
    <app-dialog
      :status="openShareModal"
      subtitle="Share this incident via email"
      icon="mdi-send"
      title="Share incident"
      size="big"
    >
      <template v-slot:app-dialog-body>
        <v-form ref="shareModal">
          <span
            style="
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.87);
            "
            >Recipients</span
          >
          <v-combobox
            :items="[]"
            placeholder="Enter emails (max. 10)"
            multiple
            dense
            deletable-chips
            autocomplete="disabled"
            small-chips
            outlined
            :no-data-text="'Enter emails (max. 10)'"
            v-model.trim="shareEmail"
            :rules="[shareEmailRules.limit, shareEmailRules.email, shareEmailRules.required]"
            class="pop-up-card__invite-member"
            hint="Press enter to separate email adresses"
          ></v-combobox>
        </v-form>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <v-btn text color="#f56c6c" class="k-dialog__button" @click="openShareModal = false"
            >CANCEL</v-btn
          >
          <v-btn text color="#2196f3" class="k-dialog__button" @click="shareIncident">Send</v-btn>
        </div>
      </template>
    </app-dialog>
    <div id="" class="single-post">
      <div class="threat-sharing-content">
        <div class="ts-header">
          <div class="ts-title">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-clamp autoresize :max-lines="2" v-if="post.title" v-on="on">
                  {{ post.title }}
                </v-clamp>
                <v-clamp autoresize :max-lines="2" v-else v-on="on">Post Title</v-clamp>
              </template>
              <span class="tooltip-span">{{ post.title }}</span>
            </v-tooltip>
          </div>
          <div class="flex-grow-1"></div>
          <div class="ts-header-btn-1">
            <v-expansion-panel-header
              class="pa-0"
              style="min-height: 36px;"
              disable-icon-rotate
              id="single-post-expansion-header"
            >
              <template v-slot:actions mandatory="true">
                <v-btn
                  v-if="post.isToggle"
                  @click.native="getPostDetails(post.communityPostResourceId, postIndex, false)"
                  :id="'single-post-collapse' + post.communityPostResourceId"
                  :key="'single-post-collapse' + post.communityPostResourceId"
                  outlined
                  rounded
                  medium
                  color="blue"
                  >COLLAPSE
                </v-btn>
                <v-btn
                  v-else
                  @click.native="
                    getPostDetails(post.communityPostResourceId, postIndex, true, post)
                  "
                  :id="'single-post-details' + post.communityPostResourceId"
                  :key="'single-post-details' + post.communityPostResourceId"
                  outlined
                  rounded
                  medium
                  color="blue"
                  >DETAILS
                </v-btn>
              </template>
            </v-expansion-panel-header>
          </div>
          <v-menu offset-y transition="scale-transition">
            <template v-slot:activator="{ on }">
              <v-btn
                :id="'single-post-dots' + post.communityPostResourceId"
                icon
                color="blue"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <div
              :id="'notifications' + post.communityPostResourceId"
              class="notification-wrapper-single-post"
            >
              <v-list dense flat class="notification-wrapper__v-list">
                <v-list-item-group color="primary">
                  <v-list-item
                    :id="'edit-btn' + post.communityPostResourceId"
                    v-if="canEdit(post)"
                    @click="editIncident(post, post.communityPostResourceId, post.communityName)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    :id="'investigate-btn' + post.communityPostResourceId"
                    @click="openInvestigate(post)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-magnify</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Investigate</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    style="cursor: not-allowed; opacity: 0.3;"
                    v-if="post.communityPrivacyStatusId !== 1"
                    :id="'share-btn' + post.communityPostResourceId"
                  >
                    <v-tooltip bottom opacity="1">
                      <template v-slot:activator="{ on }">
                        <v-list-item-icon v-on="on">
                          <v-icon>mdi-send</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content v-on="on">
                          <v-list-item-title>
                            Share
                          </v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <span class="tooltip-span">
                        You cannot share incident from private or hidden communities
                      </span>
                    </v-tooltip>
                  </v-list-item>
                  <v-list-item
                    v-else
                    :id="'share-btn' + post.communityPostResourceId"
                    @click="openShareModalFunc(post)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-send</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Share
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    :id="'delete-btn' + post.communityPostResourceId"
                    v-if="canDelete(post)"
                    @click="deleteIncident(post)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </v-menu>
        </div>
        <div class="ts-user-comp">
          <div :id="'post-details' + post.communityPostResourceId" class="ts-user-comp-detail">
            by
            <b
              :id="post.postedUserFullName"
              v-if="post.postedUserFullName"
              href="#"
              class="pl-1 pr-1"
              >{{ post.postedUserFullName }}</b
            >
            <b v-else href="#" class="pl-1 pr-1">User Name</b> from
            <b
              :id="post.postedUserCompanyName"
              v-if="post.postedUserCompanyName"
              href="#"
              class="pl-1 pr-1"
              >{{ post.postedUserCompanyName }}</b
            >
            <b v-else class="pl-1 pr-1">Company Name</b> on
            <a
              :id="post.communityName"
              v-if="post.communityName"
              @click="goToCommunityDetails(post)"
              class="pl-1"
              >{{ post.communityName }}</a
            >
            <a v-else class="pl-1 pr-1">Community Name</a>
          </div>
          <div class="ts-user-date font-weight-medium">
            <span :id="'date' + post.postedTime" v-if="post.postedTime">{{ post.postedTime }}</span>
            <span v-else>04.05.2019</span>
          </div>
          <div
            v-if="post.securityLabelResourceIdArray && post.securityLabelResourceIdArray.length"
            class="ts-user-tlc"
          >
            <div
              class="ts-user-tlc__item"
              v-for="(tlc, index) of post.securityLabelResourceIdArray"
              :key="index"
            >
              <v-tooltip bottom opacity="1">
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="ts-user-tlc__item-item" :class="getTlcClass(tlc)">
                    {{ getTlcName(tlc) }}
                  </div>
                </template>
                <span class="tooltip-span">{{ getTlcTooltip(tlc) }}</span>
              </v-tooltip>
            </div>
          </div>
        </div>
        <div class="ts-body">
          <v-clamp
            :id="'single-post-description-body' + post.communityPostResourceId"
            v-if="post.description"
            autoresize
            :max-lines="3"
            >{{ post.description }}
          </v-clamp>
          <v-clamp v-else autoresize :max-lines="3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </v-clamp>
        </div>
        <div
          :id="'single-post-footer' + post.communityPostResourceId"
          class="ts-footer d-flex row wrap"
        >
          <div class="ts-like mt-1">
            <v-btn
              :id="'single-post-like' + post.communityPostResourceId"
              disabled
              text
              x-small
              icon
              color="grey"
            >
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
            <v-btn
              :id="'single-post-unlike' + post.communityPostResourceId"
              v-if="false"
              disabled
              text
              x-small
              icon
              color="grey"
            >
              <v-icon>mdi-thumb-down</v-icon>
            </v-btn>
            <span class="ts-action-counter">{{
              (postDetails && postDetails.likeCount) || post.likeCount
            }}</span>
          </div>
          <div class="ts-message mt-1">
            <v-btn
              :id="'single-post-reply' + post.communityPostResourceId"
              text
              x-small
              icon
              color="grey"
              disabled
            >
              <v-icon>mdi-message-reply-text</v-icon>
            </v-btn>
            <span class="ts-action-counter">{{
              (comments && comments.length) || post.commentCount
            }}</span>
          </div>
          <div :id="'single-post-harmful' + post.communityPostResourceId" class="ts-harmful mt-1">
            <v-btn readonly v-if="post.harmfulItemCount" text x-small icon color="red">
              <v-icon style="font-size: 14px;">mdi-alert-circle</v-icon>
            </v-btn>
            <span class="ts-actions">{{ post.harmfulItemCount }} harmful item(s)</span>
          </div>
          <!-- solution field missing for now
          <div class="ts-success mt-1">
            <v-btn text x-small icon color="grey">
              <v-icon style="font-size: 14px" color="#43a047">mdi-check-circle</v-icon>
            </v-btn>
            <span class="ts-actions">Solution</span>
          </div>
          -->
          <div class="flex-grow-1"></div>
          <div class="ts-tags">
            <v-btn
              v-if="post.hasAttachment"
              text
              small
              rounded
              outlined
              class="tag-btn text-none"
              id="incident-badge-att"
            >
              <span v-if="post.categoryResourceIdArray.length === 1">Attachment</span>
              <span v-else-if="post.categoryResourceIdArray.length > 1">Attachments</span>
            </v-btn>
            <v-btn
              v-if="post.categoryResourceIdArray && post.categoryResourceIdArray.length"
              text
              small
              rounded
              outlined
              class="tag-btn ml-1 text-none"
              id="incident-badge--cat"
              >{{
                categories.find((item) => item.resourceId === post.categoryResourceIdArray[0]) &&
                categories.find((item) => item.resourceId === post.categoryResourceIdArray[0]).name
              }}
            </v-btn>
            <v-btn
              v-if="
                post.categoryResourceIdArray &&
                post.categoryResourceIdArray.length > 1 &&
                !post.hasAttachment
              "
              text
              small
              rounded
              outlined
              class="tag-btn ml-1 text-none"
              id="incident-badge"
              >{{
                categories.find((item) => item.resourceId === post.categoryResourceIdArray[1]) &&
                categories.find((item) => item.resourceId === post.categoryResourceIdArray[1]).name
              }}
            </v-btn>
            <div style="position: relative;">
              <v-btn
                v-if="
                  (post.hasAttachment &&
                    post.categoryResourceIdArray &&
                    post.categoryResourceIdArray.length > 1) ||
                  (post.categoryResourceIdArray && post.categoryResourceIdArray.length > 2)
                "
                text
                small
                rounded
                outlined
                class="tag-btn ml-1 text-none"
                :id="
                  'tooltip-btn' + post.categoryResourceIdArray && post.categoryResourceIdArray[0]
                "
                @mouseover="hoverTool = true"
                @mouseleave="hoverTool = false"
              >
                <span
                  >+{{
                    getAttachmentLength(post.hasAttachment, post.categoryResourceIdArray)
                  }}</span
                >
              </v-btn>
              <div
                v-if="
                  hoverTool &&
                  post.categoryResourceIdArray &&
                  post.categoryResourceIdArray.length >= 1
                "
                class="tooltip-wrapper"
              >
                <div
                  v-if="
                    post.hasAttachment &&
                    post.categoryResourceIdArray &&
                    post.categoryResourceIdArray.length === 4
                  "
                >
                  <span>{{ findCategory(post.categoryResourceIdArray[1]) }}</span>
                  <span>{{ findCategory(post.categoryResourceIdArray[2]) }}</span>
                  <span>{{ findCategory(post.categoryResourceIdArray[3]) }}</span>
                </div>
                <div v-else-if="post.hasAttachment">
                  <span>{{ findCategory(post.categoryResourceIdArray[1]) }}</span>
                  <span>{{ findCategory(post.categoryResourceIdArray[2]) }}</span>
                </div>
                <div
                  v-else-if="
                    post.hasAttachment &&
                    post.categoryResourceIdArray &&
                    post.categoryResourceIdArray.length === 1
                  "
                >
                  <span>{{ findCategory(post.categoryResourceIdArray[1]) }}</span>
                  <span>{{ findCategory(post.categoryResourceIdArray[2]) }}</span>
                </div>
                <div v-else-if="!post.hasAttachment">
                  <span>{{ findCategory(post.categoryResourceIdArray[2]) }}</span>
                  <span>{{ findCategory(post.categoryResourceIdArray[3]) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-expansion-panel-content
        v-if="emailData && post.isToggle"
        eager
        class="expand-body member-company-body pa-0"
      >
        <v-tabs
          v-model="tab"
          background-color="transparent"
          color="basil"
          class="v-tabs-bar__details-tab"
        >
          <v-tab id="expansion-preview">Email Preview</v-tab>
          <v-tab id="expansion-details">Details</v-tab>
        </v-tabs>
        <v-tabs-items v-show="emailData && post.isToggle" v-model="tab">
          <v-tab-item>
            <PreviewHeaderForSinglePost :uploadRespond="emailData" />

            <div id="single-post-body" class="preview-body">
              <k-shadow-frame
                :id="`sframe${post.communityPostResourceId}`"
                v-bind:content="emailData.body"
              />
            </div>
            <div
              class="preview-footer"
              v-if="emailData.attachments && emailData.attachments.length"
            >
              <h2>Attachments</h2>
              <div
                v-for="(att, ind) of emailData.attachments"
                :key="ind + att.name"
                class="preview-attch-wrapper"
              >
                <div class="attachment-wrapper">
                  <div
                    class="attachment red-attach"
                    :id="'single-post-attachments-' + att.name"
                    :class="[
                      att.isFlagged ? 'red-attach malicious-style' : '',
                      !att.isFlagged ? 'blue-attach' : ''
                    ]"
                  >
                    <AttachmentsPreview :att="att" />
                  </div>
                </div>
              </div>
            </div>
            <div class="preview-buttons">
              <v-btn
                v-if="postDetails && !postDetails.isLikedByUser"
                @click="userLikePost(post.communityPostResourceId, post.communityResourceId)"
                :class="{ 'active-act': postDetails && postDetails.isLikedByUser }"
                :id="'like-btn' + post.communityPostResourceId"
              >
                <v-icon :class="{ 'active-act': postDetails && postDetails.isLikedByUser }"
                  >mdi-thumb-up</v-icon
                >
                Useful ({{ (postDetails && postDetails.likeCount) || post.likeCount }})
              </v-btn>
              <v-btn
                v-else-if="postDetails && postDetails.isLikedByUser"
                @click="userUnlikePost(post.communityPostResourceId, post.communityResourceId)"
                :class="{ 'active-act': postDetails.isLikedByUser }"
                :id="'unlike-btn' + post.communityPostResourceId"
              >
                <v-icon class="active-act">mdi-thumb-up</v-icon>
                Useful ({{ (postDetails && postDetails.likeCount) || post.likeCount }})
              </v-btn>
              <v-btn
                :id="'comments-btn' + post.communityPostResourceId"
                :class="{ 'active-act': commentOpened }"
                @click="commentOpened = !commentOpened"
              >
                <v-icon :class="{ 'active-act': commentOpened }">mdi-comment</v-icon>
                Comments ({{ (comments && comments.length) || post.commentCount }})
              </v-btn>
            </div>
            <div class="preview-comments" :class="{ 'open-comments': commentOpened }">
              <v-form ref="refCommentForm" class="add-comment-row" onSubmit="return false;">
                <v-text-field
                  :id="'single-post-comment-' + post.communityPostResourceId"
                  class="comment-input"
                  placeholder="Write your comment here"
                  outlined
                  v-model.trim="addCommentValue"
                  validate-on-blur
                  :rules="[rules.required]"
                />
                <v-btn
                  :id="'single-post-send-comment' + post.communityPostResourceId"
                  @click="addPostComment(post.communityPostResourceId, post.communityResourceId)"
                  class="send-btn"
                  type="button"
                >
                  <v-icon>mdi-send</v-icon>
                  SEND
                </v-btn>
              </v-form>

              <div v-if="comments && comments.length" class="hidden-comments">
                <div
                  v-for="(com, ind) of seeComments ? comments : comments.slice(0, 1)"
                  :key="ind + com.resourceId"
                  class="comment-row"
                >
                  <div class="user-wrapper w-100" v-if="!com.isEdit">
                    <div class="d-flex align-center w-100">
                      <div style="width: 80%;">
                        <b class="username">{{ com.commenterFullName }}</b>
                        from
                        <b class="company-name">{{ com.commenterCompanyName }}</b>
                        <p class="the-comment">{{ com.comment }}</p>
                      </div>
                      <div
                        style="width: 20%; text-align: right;"
                        v-if="canDeleteOrEditComment(com, post)"
                      >
                        <button @click="editRelativeComment(com)" class="pr-4">
                          <v-icon class="close-icon">mdi-pencil</v-icon>
                        </button>
                        <button @click="deleteComment(com)" icon>
                          <v-icon class="close-icon">mdi-delete</v-icon>
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
                        <v-btn @click="updateComments(com)" class="send-btn">
                          <v-icon>mdi-send</v-icon>
                          Edit
                        </v-btn>
                      </div>
                      <div style="width: 20%; text-align: right;">
                        <button @click="editRelativeComment(com)">
                          <v-icon class="close-icon">mdi-close</v-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="!seeComments && comments && comments.length > 1"
                id="single-post-see-all-comments"
                class="see-all-comments"
                @click="seeComments = true"
              >
                <span>See all {{ comments.length }} comments</span>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="single-post__details">
              <h1 class="detected-items" v-if="emailData && emailData.subject">
                <span> Subject: {{ emailData.subject }} </span>
              </h1>
              <div id="last-detail-parts" class="detail-parts">
                <p
                  v-if="
                    (emailData.subject && emailData.isSubjectFlagged) ||
                    (!!emailData.from && emailData.isFromFlagged) ||
                    (emailData.to && !!emailData.to.length && emailData.isToFlagged) ||
                    (emailData.cc && !!emailData.cc.length && emailData.isCcFlagged) ||
                    (emailData.bcc && !!emailData.bcc.length && emailData.isBccFlagged)
                  "
                  class="detail-black disc-header single-post__details__section-header"
                >
                  Header
                </p>
                {{ /* Subject  */  }}
                <div
                  class="detail-part-item"
                  v-if="emailData && emailData.subject && emailData.isSubjectFlagged"
                >
                  <div class="detail-part-item__col--wrapper">
                    <div class="detail-part-item__col--major">
                      <div class="detail-part-item__text">
                        Subject:
                        <span class="detail-part-item__hide-overflow">
                          {{ emailData.subject }}
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--slight">
                      <span class="copy-link" @click="contentCopy(emailData.subject)">
                        <v-icon>mdi-content-copy</v-icon>Copy Subject
                      </span>
                    </div>
                  </div>

                  <div class="detail-part-item__col--warning">
                    Subject from this sender may include harmful content
                  </div>
                </div>
                {{ /* From  */  }}
                <div
                  class="detail-part-item"
                  v-if="emailData && emailData.from && emailData.isFromFlagged"
                >
                  <div class="detail-part-item__col--wrapper">
                    <div class="detail-part-item__col--major">
                      <div class="detail-part-item__text">
                        From:
                        <span class="detail-part-item__hide-overflow">
                          {{ emailData.from }}
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--slight">
                      <span class="copy-link" @click="contentCopy(emailData.from)">
                        <v-icon>mdi-content-copy</v-icon>Copy Email Address
                      </span>
                    </div>
                  </div>
                  <div class="detail-part-item__col--warning">
                    Emails from this sender may include harmful content
                  </div>
                </div>
                {{ /* To  */  }}
                <div
                  class="detail-part-item"
                  v-if="emailData && emailData.to && emailData.isToFlagged"
                >
                  <div class="detail-part-item__col--wrapper">
                    <div class="detail-part-item__col--major">
                      <div class="detail-part-item__text">
                        To:
                        <span class="detail-part-item__hide-overflow">
                          {{ emailData.to.toString() }}
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--slight">
                      <span class="copy-link" @click="contentCopy(emailData.to.toString())">
                        <v-icon>mdi-content-copy</v-icon>Copy Email Address
                      </span>
                    </div>
                  </div>
                  <div class="detail-part-item__col--warning">
                    This email address may be targeted by emails include harmful content
                  </div>
                </div>
                {{ /* Cc  */  }}
                <div
                  class="detail-part-item"
                  v-if="emailData && emailData.cc && !emailData.isCcHidden && emailData.isCcFlagged"
                >
                  <div class="detail-part-item__col--wrapper">
                    <div class="detail-part-item__col--major">
                      <div class="detail-part-item__text">
                        CC:
                        <span class="detail-part-item__hide-overflow">
                          {{ emailData.cc.toString() }}
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--slight">
                      <span class="copy-link" @click="contentCopy(emailData.cc.toString())">
                        <v-icon>mdi-content-copy</v-icon>Copy Email Address
                      </span>
                    </div>
                  </div>
                  <div class="detail-part-item__col--warning">
                    This email address may be targeted by emails include harmful content
                  </div>
                </div>
                {{ /* Bcc  */  }}
                <div
                  class="detail-part-item"
                  v-if="
                    emailData && emailData.bcc && !emailData.isBccHidden && emailData.isBccFlagged
                  "
                >
                  <div class="detail-part-item__col--wrapper">
                    <div class="detail-part-item__col--major">
                      <div class="detail-part-item__text">
                        BCC:
                        <span class="detail-part-item__hide-overflow">
                          {{ emailData.bcc.toString() }}
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--slight">
                      <span class="copy-link" @click="contentCopy(emailData.bcc.toString())">
                        <v-icon>mdi-content-copy</v-icon>Copy Email Address
                      </span>
                    </div>
                  </div>
                  <div class="detail-part-item__col--warning">
                    This email address may be targeted by emails include harmful content
                  </div>
                </div>
              </div>
              <div
                v-if="emailData && emailData.urls && emailData.urls.length"
                class="preview-attch-wrapper detail-parts"
              >
                <p
                  v-if="
                    emailData &&
                    emailData.urls &&
                    emailData.urls.some((a) => !a.isHidden && a.isFlagged)
                  "
                  class="detail-black single-post__details__section-header"
                >
                  Body
                </p>

                {{ /* Links  */  }}
                <div
                  class="detail-part-item"
                  v-for="(el, ind) of emailData.urls"
                  :key="ind + el.url"
                  v-if="el && !el.isHidden && el.isFlagged"
                  :id="'detail-links-' + el.name"
                >
                  <div class="detail-part-item__col--wrapper">
                    <div class="detail-part-item__col--major">
                      <div class="detail-part-item__text">
                        Link:
                        <span class="detail-part-item__hide-overflow">
                          {{ el.name }} {{ el.url }}
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--slight">
                      <span class="copy-link" @click="contentCopy(el.url)">
                        <v-icon>mdi-content-copy</v-icon>Copy Url
                      </span>
                    </div>
                  </div>
                  <div class="detail-part-item__col--warning">
                    This link has been reported as phishing
                  </div>
                </div>
              </div>
              <div
                class="preview-attch-wrapper detail-parts"
                v-if="
                  emailData.attachments &&
                  emailData.attachments.length &&
                  emailData.attachments.some((a) => !a.isHidden && a.isFlagged)
                "
              >
                <p class="detail-black single-post__details__section-header">
                  Attachments
                </p>
                {{ /* Attachments  */  }}
                <div
                  class="detail-part-item"
                  v-for="(att, ind) of emailData.attachments"
                  :key="ind + att.name"
                  v-if="att.isFlagged"
                >
                  <div class="detail-part-item__col--wrapper">
                    <div class="detail-part-item__col--major">
                      <div class="detail-part-item__text">
                        <span class="detail-part-item__hide-overflow pl-0">
                          {{ !att.isHidden ? att.name : 'hidden by owner' }}
                        </span>
                      </div>
                    </div>
                    <div class="detail-part-item__col--slight">
                      <span class="copy-link" @click="contentCopy(att.sha512)">
                        <v-icon>mdi-content-copy</v-icon>Copy SHA 512 Hash
                      </span>
                    </div>
                  </div>
                  <div class="detail-part-item__col--warning">
                    This file has been reported as malicious content
                  </div>
                </div>
              </div>
              <div class="detail-discovery pb-4">
                <div
                  :id="'detail-discovery-empty'"
                  v-if="postDetails && postDetails.discoveryAndDetection"
                  class="disc-header"
                >
                  Discovery and Detection
                </div>
                <p
                  :id="'detail-discovery'"
                  v-if="postDetails && postDetails.discoveryAndDetection"
                  class="discovery-p"
                >
                  {{ postDetails && postDetails.discoveryAndDetection }}
                </p>
                <div v-if="postDetails && postDetails.affectArea" class="disc-header mb-1">
                  Impact Range
                </div>
                <div
                  :id="'detail-effect-area'"
                  v-if="postDetails && postDetails.affectArea"
                  class="impact-row"
                >
                  <div class="impact-left">Effect area:</div>
                  <div style="width: max-content; padding-right: 13px;" class="impact-right">
                    {{ postDetails && postDetails.affectArea.toString() }}
                  </div>
                </div>
                <div
                  :id="'detail-scope' + postDetails"
                  v-if="postDetails && postDetails.scope"
                  class="impact-row"
                >
                  <div class="impact-left">Scope:</div>
                  <div class="impact-right">{{ postDetails && postDetails.scope }}</div>
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-expansion-panel-content>
    </div>
  </div>
</template>

<script>
import VClamp from 'vue-clamp'
import NewInvestigation from '../Investigation/NewInvestigation'
import { mapGetters } from 'vuex'
import vueCustomElement from 'vue-custom-element'
import KShadowFrame from '../KShadowFrame'
import AppDialog from '../AppDialog'
import {
  createComments,
  deleteComments,
  deleteCommunityPost,
  getComments,
  getCommunityPost,
  likePost,
  shareAPost,
  updateComments
} from '../../api/threadSharing'
import PreviewHeader from './PreviewHeader'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import { getNotifiedEmail } from '../../api/notifiedEmail'
import {
  copyToClipboard,
  incidenPostReviewElementBind,
  isOwner,
  isPostedByMe,
  reviewElementBind
} from '../../utils/functions'
import PreviewHeaderForSinglePost from './PreviewHeaderForSinglePost'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import AttachmentsPreview from './AttachmentsPreview'
Vue.customElement('k-shadow-frame', KShadowFrame, {
  shadow: true,
  shadowCss: `
 @import url('https://fonts.googleapis.com/css?family=Material+Icons');
 @import url('https://cdn.materialdesignicons.com/5.2.45/css/materialdesignicons.min.css');
 @import url('https://cdn.jsdelivr.net/npm/vuetify@2.2.29/dist/vuetify.min.css');
.hidden-icon-link {
  background-color: #757575;
  color: #ffffff;
}
.malicious-style,
.malicious-link {
     color: #f56c6d !important;
    border-color: #f56c6d !important;
    background-color: #f3e1e5 !important;
    text-decoration: none !important;

    position: relative;
  text-decoration: none !important;
  border-bottom: 0 solid;
  position:relative;
  .share-setting-text {
    text-decoration: none !important;
    text-decoration-color: transparent !important;
    text-decoration-style: unset !important;
    border: none !important;
    border-bottom: transparent !important;
    border-bottom-color: transparent !important;
    border-image: none !important;
    border-image-width: 0 !important;
  }
}
[data-title]:hover:after {
    opacity: 1;

    visibility: visible;
}
[data-title]:after {
     content: attr(data-title);
    position: absolute;
    padding: 4px 8px;
    bottom: -40px;
    left: 0;
    white-space: nowrap;
    opacity: 0;
    z-index: 99999;
    visibility: hidden;
  border-radius: 4px;
    line-height: 1.33;
    min-height: 24px;
    background: #6d6d6d !important;
    color: rgba(255, 255, 255, 0.87) !important;
    font-family: "Open Sans", sans-serif !important;
    font-size: 12px;
    text-decoration:none;
        font-weight: normal;

}
[data-title] {
    position: relative;
}
.malicious-style {
   color: #bb2a45 !important;
    border-color: #bb2a45 !important;
    background-color: #f3e1e5 !important;

  text-decoration: none !important;
  border-bottom: 1px solid;
  position:relative;
      text-indent: 0;
}

.malicious-icon {
 top: 0px;
  background: transparent;
  color: #f56c6c;
  font-size: inherit !important;
  padding: 0;
}

.red-malicious-alert {
   color: #f56c6c !important;
    caret-color: #f56c6c !important;
    text-decoration: unset !important;
    text-decoration-color: transparent !important;
    font-size: inherit !important;
    overflow: hidden;
}

.red-malicious-alert::before {
  border: unset !important;
}

.hidden-icon-link {
  background-color: #757575;
  color: #ffffff;
}

.url-badge{
  font-family: "Open Sans", sans-serif;
    position: absolute;
    top: -8px;
    right: -8px;
    color: white;
    background-color: #757575c2;
    height: 10px;
    width: 10px;
    text-align: center;
    border-radius: 30px;
    font-size: 8px;
    font-weight: 900;
    line-height: 1.2 !important;
}
a{position:relative}
 `
})
export default {
  components: {
    AppDialogFooter,
    PreviewHeaderForSinglePost,
    VClamp,
    NewInvestigation,
    AppDialog,
    AttachmentsPreview
  },
  props: {
    openEditPopupItem: {
      type: Object,
      required: false
    },
    post: {
      type: Object,
      required: false,
      default: () => ({})
    },
    postIndex: {
      type: Number,
      required: true
    },
    totalPostCount: {
      type: Number,
      required: true
    },
    refreshData: {
      required: false
    }
  },
  data: () => ({
    openShareModal: false,
    shareEmail: [],
    shareEmailRules: {
      limit: (v) => (v && v.length <= 10) || 'You have reached to max limit',
      required: (v) => (v && v.length >= 1) || 'Required',
      email: (v) => {
        if (v.length > 0) {
          let booReturn = true
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          for (let i = 0; i < v.length; i++) {
            if (!pattern.test(v[i])) {
              booReturn = false
              document.getElementsByClassName('v-chip--select')[i].style.borderColor = '#ff5252'
              document.getElementsByClassName('v-chip--select')[i].style.color = '#ff5252'
              return v[i] + ' address is not valid'
            } else if (v.length === i) {
              return booReturn
            } else {
              booReturn = true
            }
          }
          return booReturn
        } else {
          return true
        }
      }
    },
    deleteCommentId: null,
    isWantToDeleteComment: false,
    deleteIncidentId: null,
    deleteIncidentName: null,
    deleteIncidentCommunityName: null,
    isWantToDelete: false,
    isWantToAddNewInvestigation: false,
    postDetails: {},
    comments: [],
    emailData: null,
    categories: [
      {
        resourceId: 'Ps0SSyl7rVNe',
        name: 'Malicious'
      },
      {
        resourceId: 'bEuAD1pdbRXF',
        name: 'Non-Malicious'
      },
      {
        resourceId: 'NGLCc9UCxJvw',
        name: 'Phishing'
      },
      {
        resourceId: 'Gwt67E1ftYtr',
        name: 'Spam'
      }
    ],
    userIdFromStorage: null,
    expanded: false,
    commentOpened: false,
    isWantToShareIncident: false,
    isWantToInvestigate: false,
    isWantToPostIncident: false,
    tab: 0,
    showAllTags: false,
    seeComments: false,
    rules: {
      required: (v) =>
        (!!v && v.length >= 5 && v.length <= 300) || 'Minimum 5 characters - Maximum 300 character',
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen'
    },
    likeCount: 15,
    userLiked: false,
    hasPermission: false,
    valid: false,
    userComment: '',
    hoverTool: false,
    details: {},
    shareSettings: {},
    addCommentValue: ''
  }),

  watch: {
    '$route.query.postId'(val) {
      this.getPostDetails(this.$route.query.postId, 0, true)
    }
  },
  mounted() {
    this.userIdFromStorage = localStorage.getItem('userId')
    if (this.$route.query.postId) {
      this.getPostDetails(this.$route.query.postId, 0, true)
    }
  },
  methods: {
    getAttachmentLength(hasAttachment, categories) {
      if (hasAttachment) {
        return categories.length - 1
      } else {
        return categories.length - 2
      }
    },
    getTlcClass(item) {
      switch (item) {
        case 'wKBhLuFZ46y9':
          return 'TLP-GREEN'
          break
        case 'RhHwRcLlZxek':
          return 'TLP-AMBER'
          break
        case 'YpUZxVhYJlKg':
          return 'TLP-RED'
          break
        case 'wFlYRDMW946M':
          return 'TLP-WHITE'
          break
        default:
          break
      }
    },
    getTlcTooltip(item) {
      switch (item) {
        case 'wKBhLuFZ46y9':
          return 'Limited disclosure, restricted to the community.'
          break
        case 'RhHwRcLlZxek':
          return 'Limited disclosure, restricted to participants’ organizations.'
          break
        case 'YpUZxVhYJlKg':
          return 'Not for disclosure, restricted to participants only.'
          break
        case 'wFlYRDMW946M':
          return 'Disclosure is not limited.'
          break
        default:
          break
      }
    },
    getTlcName(item) {
      switch (item) {
        case 'wKBhLuFZ46y9':
          return 'TLP: GREEN'
          break
        case 'RhHwRcLlZxek':
          return 'TLP: AMBER'
          break
        case 'YpUZxVhYJlKg':
          return 'TLP: RED'
          break
        case 'wFlYRDMW946M':
          return 'TLP: WHITE'
          break
        default:
          break
      }
    },
    contentCopy(contentBody) {
      navigator.clipboard.writeText(contentBody)
      this.$store.dispatch('common/createSnackBar', {
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        message: 'Copied Successfully!'
      })
    },
    openShareModalFunc(post) {
      this.sharedIncitedId = post.communityPostResourceId
      this.openShareModal = true
    },
    shareIncident() {
      let id = this.sharedIncitedId
      setTimeout(() => {
        if (this.$refs.shareModal.validate()) {
          const payload = {
            emailarray: this.shareEmail
          }
          shareAPost(id, payload).then((response) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Post has been shared successfully'
            })
            setTimeout(() => {
              this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
            }, 500)
            this.openShareModal = false
          })
        }
      }, 200)
    },
    goToCommunityDetails(post) {
      if (post.communityResourceId) {
        localStorage.setItem('communityName', post.communityName)
        localStorage.setItem('communityResourceIdForRedirect', post.communityResourceId)
        this.$router.push(`/community/${post.communityResourceId}`)
      }
    },
    closeNewInvestigationModal(value) {
      this.$emit('refreshData')
      this.isWantToAddNewInvestigation = false
    },
    editRelativeComment(comment) {
      comment.isEdit = !comment.isEdit
      comment.commentValue = comment.comment
      this.$forceUpdate()
    },
    updateComments(comment) {
      const payload = { comment: comment.commentValue }
      updateComments(comment.resourceId, payload)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Comment has been updated successfully.'
          })
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
          }, 500)
          this.getComments(this.post.communityPostResourceId)
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when update a comment'
          })
        })
    },
    deleteComment(comment) {
      this.deleteCommentId = comment.resourceId
      this.isWantToDeleteComment = true
    },
    deleteCommentConfirm() {
      deleteComments(this.deleteCommentId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Comment has been deleted successfully'
          })
          this.isWantToDeleteComment = false
          this.getComments(this.post.communityPostResourceId)
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
          }, 500)
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when delete a comment'
          })
        })
    },
    deleteIncidentConfirm() {
      deleteCommunityPost(this.deleteIncidentId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Community post has been deleted successfuly'
          })
          this.$emit('refreshData')
          this.isWantToDelete = false
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
          }, 500)
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when delete community post'
          })
        })
    },
    findCategory(id) {
      switch (id) {
        case 'Ps0SSyl7rVNe':
          return 'Malicious'
        case 'bEuAD1pdbRXF':
          return 'Non-Malicious'
        case 'NGLCc9UCxJvw':
          return 'Phishing'
        case 'Gwt67E1ftYtr':
          return 'Spam'
        default:
          return ''
      }
    },
    openInvestigate(post) {
      getCommunityPost(post.communityPostResourceId).then((response) => {
        this.selectedEmail = response.data.data.communityPostEmail
        this.isWantToAddNewInvestigation = true
      })
    },
    getPostDetails(postId, ind, bool) {
      this.post.isToggle = bool
      //postId = '4pDtxLYSG0mb'
      if (bool) {
        this.getComments(this.post.communityPostResourceId)
        //getSelectedEmailPreview('4pDtxLYSG0mb')
        getCommunityPost(this.post.communityPostResourceId).then((response) => {
          const comId = this.post.communityPostResourceId
          this.postDetails = response.data.data
          this.emailData = response.data.data.communityPostEmail
          this.emailData.urls = this.emailData.urls.map((item) => {
            return {
              ...item,
              url: item.url.replace('&amp;', '&')
            }
          })
          setTimeout(() => {
            let recrusiveFunctionForDom = () =>
              document.getElementById(`sframe${comId}`) &&
              document.getElementById(`sframe${comId}`).shadowRoot
            if (!recrusiveFunctionForDom) recrusiveFunctionForDom()
            for (let url of response.data.data.communityPostEmail.urls) {
              let recrusiveFunctionForDom = () => document.getElementById(`sframe${comId}`)
              if (!recrusiveFunctionForDom) recrusiveFunctionForDom()
              let els = document
                .getElementById(`sframe${comId}`)
                .shadowRoot.querySelectorAll('[href="' + url.url + '"]')
              incidenPostReviewElementBind(url, null, `sframe${comId}`, true)
              this.$forceUpdate()
            }
          }, 500)
        })
      }
    },
    userLikePost(postId) {
      let _this = this
      likePost(postId).then((response) => {
        getCommunityPost(this.post.communityPostResourceId).then((response) => {
          this.postDetails = response.data.data
          this.post.likeCount = response.data.data.likeCount
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
          }, 500)
        })
      })
      /*.catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when like a comment'
          })
        })*/
    },
    userUnlikePost(postId) {
      likePost(postId).then((response) => {
        getCommunityPost(this.post.communityPostResourceId).then((response) => {
          this.postDetails = response.data.data
          this.post.likeCount = response.data.data.likeCount

          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
          }, 500)
        })
      })
      /*
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when unlike a comments'
          })
        })*/
    },
    getComments(id) {
      getComments(id)
        .then((response) => {
          const { data } = response
          this.comments = data.data
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.comments = []
          }
        })
    },
    addPostComment(postId, communId) {
      if (this.$refs.refCommentForm.validate()) {
        const payload = {
          comment: this.addCommentValue
        }
        createComments(postId, payload)
          .then((response) => {
            this.addCommentValue = ''
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Comment added has been successfully'
            })
            this.getComments(this.post.communityPostResourceId)
            setTimeout(() => {
              this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
            }, 500)
          })
          .catch((error) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when creating a comment'
            })
          })
      }
    },
    editIncident(post, communityName) {
      this.$emit('openEditPopupItem', post)
    },
    deleteIncident(post) {
      this.deleteIncidentId = post.communityPostResourceId
      this.deleteIncidentName = post.title
      this.deleteIncidentCommunityName = post.communityName
      this.isWantToDelete = true
    },
    regexChar(val) {
      return /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(val)
    },
    canDelete(post) {
      return isOwner(post.myMembershipStatusId) || isPostedByMe(post.isPostedByMe)
    },
    canEdit(post) {
      return isOwner(post.myMembershipStatusId) || isPostedByMe(post.isPostedByMe)
    },
    canDeleteOrEditComment(comment, post) {
      return (
        comment.commenterFullName == localStorage.getItem('userName') ||
        isPostedByMe(post.isPostedByMe)
      )
    }
  }
}
</script>

<style lang="scss" src="./SinglePost.scss"></style>
