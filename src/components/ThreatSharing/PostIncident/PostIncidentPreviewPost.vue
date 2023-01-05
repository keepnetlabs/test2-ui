<template>
  <div id="last-preview-post" style="max-width: 696px;">
    <v-expansion-panels :multiple="false" v-model="panel" class="mb-4">
      <v-expansion-panel>
        <div class="threat-sharing-content">
          <div class="ts-header">
            <div id="last-preview-title" class="ts-title">
              <span v-if="uploadRespond.subject">{{ uploadRespond.Title }}</span>
              <span v-else>Post Title</span>
            </div>
            <div class="flex-grow-1"></div>
            <div class="ts-header-btn-1">
              <v-expansion-panel-header
                id="last-preview-collapse-container"
                class="pa-0"
                style="min-height: 36px;"
                disable-icon-rotate
                ref="expandIncident"
                @click="toggle = !toggle"
              >
                <template #actions>
                  <v-btn
                    v-if="!toggle"
                    id="threat-sharing-post-incident-last-preview-collapse"
                    outlined
                    rounded
                    medium
                    color="blue"
                    >COLLAPSE
                  </v-btn>
                  <v-btn
                    id="threat-sharing-post-incident-last-preview-details"
                    v-else
                    outlined
                    rounded
                    medium
                    color="blue"
                    >DETAILS
                  </v-btn>
                </template>
              </v-expansion-panel-header>
            </div>
          </div>

          <div class="ts-user-comp">
            <div id="last-prev-user-comp" class="ts-user-comp-detail">
              by
              <b v-if="uploadRespond.from" class="pl-1 pr-1">
                <span v-if="!isAnonym">{{ getByValue() }}</span>
                <span v-else>Anonymous</span>
              </b>
              <a v-else href="#" class="pl-1 pr-1">{{ getFromValue() }}</a>
              from
              <b v-if="currentCompany" :id="currentCompany" class="pl-1 pr-1">
                <span v-if="!isAnonym">{{ currentCompany }}</span>
                <span v-else>Anonymous</span>
              </b>
              <a id="text--threat-sharing-incident-step-five-company-name" v-else class="pl-1 pr-1"
                >Company Name</a
              >
              on
              <a id="text--threat-sharing-incident-step-five-community-name" class="pl-1 pr-1">
                {{ currentCommunityName }}
              </a>
            </div>
            <div class="ts-user-date">
              <span>{{ uploadRespond.sentTime }}</span>
            </div>
          </div>
          <div class="ts-body">
            <v-clamp
              v-if="uploadRespond.Description"
              :id="uploadRespond.Description"
              autoresize
              :max-lines="3"
              >{{ uploadRespond.Description }}
            </v-clamp>
          </div>
          <div id="post-inc-preview-footer" class="ts-footer d-flex row wrap">
            <div class="ts-like mt-1">
              <v-btn id="threat-sharing-post-incident-like-button" text x-small icon color="grey">
                <v-icon>mdi-thumb-up</v-icon>
              </v-btn>
              <span class="ts-action-counter">0</span>
            </div>
            <div class="ts-message mt-1">
              <v-btn id="threat-sharing-post-incident-reply-button" text x-small icon color="grey">
                <v-icon>mdi-message-reply-text</v-icon>
              </v-btn>
              <span class="ts-action-counter">0</span>
            </div>
            <div class="ts-harmful mt-1">
              <v-btn
                v-if="maliciousCount"
                id="threat-sharing-post-incident-malicious-count"
                text
                x-small
                icon
                color="red"
              >
                <v-icon style="font-size: 14px;">mdi-alert-circle</v-icon>
              </v-btn>
              <span id="text--threat-sharing-incident-step-five-malicious-count" class="ts-actions"
                >{{ maliciousCount }} harmful item(s)</span
              >
            </div>
            <div class="flex-grow-1"></div>
            <div class="ts-tags">
              <v-btn
                v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                text
                small
                rounded
                outlined
                class="tag-btn text-none"
                id="threat-sharing-post-incident-last-prev-attach"
              >
                <span
                  id="text--threat-sharing-incident-step-five-attachment"
                  v-if="uploadRespond.attachments.length === 1"
                  >Attachment</span
                >
                <span
                  id="text--threat-sharing-incident-step-five-attachments"
                  v-else-if="uploadRespond.attachments.length > 1"
                  >Attachments</span
                >
              </v-btn>
              <v-btn
                v-if="
                  uploadRespond.CategoryResourceIdArray &&
                  uploadRespond.CategoryResourceIdArray.length
                "
                text
                small
                rounded
                outlined
                class="tag-btn ml-1 text-none"
                id="threat-sharing-post-incident-badge"
                >{{ findCategory(uploadRespond.CategoryResourceIdArray[0]) }}
              </v-btn>
              <v-btn
                v-if="
                  uploadRespond.CategoryResourceIdArray &&
                  uploadRespond.CategoryResourceIdArray.length > 1 &&
                  uploadRespond.attachments &&
                  !uploadRespond.attachments.length
                "
                text
                small
                rounded
                outlined
                class="tag-btn ml-1 text-none"
                id="threat-sharing-post-incident-badge-attach"
                >{{ findCategory(uploadRespond.CategoryResourceIdArray[1]) }}
              </v-btn>
              <div style="position: relative;">
                <v-btn
                  v-if="
                    (uploadRespond.attachments &&
                      uploadRespond.attachments.length &&
                      uploadRespond.CategoryResourceIdArray &&
                      uploadRespond.CategoryResourceIdArray.length > 1) ||
                    (uploadRespond.CategoryResourceIdArray &&
                      uploadRespond.CategoryResourceIdArray.length > 2)
                  "
                  text
                  small
                  rounded
                  outlined
                  class="tag-btn ml-1 text-none"
                  @mouseover="hoverTool = true"
                  @mouseleave="hoverTool = false"
                  id="threat-sharing-post-incident-last-prev-with-tooltip"
                >
                  <span v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                    >+{{ uploadRespond.CategoryResourceIdArray.length - 1 }}</span
                  >
                  <span v-else>+{{ uploadRespond.CategoryResourceIdArray.length - 2 }}</span>
                </v-btn>
                <div
                  v-if="
                    hoverTool &&
                    uploadRespond.CategoryResourceIdArray &&
                    uploadRespond.CategoryResourceIdArray.length >= 1
                  "
                  class="tooltip-wrapper"
                >
                  <div
                    v-if="
                      uploadRespond.attachments.length &&
                      uploadRespond.CategoryResourceIdArray &&
                      uploadRespond.CategoryResourceIdArray.length === 4
                    "
                  >
                    <span>{{ findCategory(uploadRespond.CategoryResourceIdArray[1]) }}</span>
                    <span>{{ findCategory(uploadRespond.CategoryResourceIdArray[2]) }}</span>
                    <span>{{ findCategory(uploadRespond.CategoryResourceIdArray[3]) }}</span>
                  </div>
                  <div v-else-if="uploadRespond.attachments.length">
                    <span>{{ findCategory(uploadRespond.CategoryResourceIdArray[1]) }}</span>
                    <span>{{ findCategory(uploadRespond.CategoryResourceIdArray[2]) }}</span>
                  </div>
                  <div
                    v-else-if="
                      uploadRespond.attachments.length &&
                      uploadRespond.CategoryResourceIdArray &&
                      uploadRespond.CategoryResourceIdArray.length === 1
                    "
                  >
                    <span>{{ findCategory(uploadRespond.CategoryResourceIdArray[1]) }}</span>
                    <span>{{ findCategory(uploadRespond.CategoryResourceIdArray[2]) }}</span>
                  </div>
                  <div v-else-if="!uploadRespond.attachments.length">
                    <span>{{ findCategory(uploadRespond.CategoryResourceIdArray[2]) }}</span>
                    <span>{{ findCategory(uploadRespond.CategoryResourceIdArray[3]) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-expansion-panel-content eager class="expand-body member-company-body pb-3 pa-0">
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="basil"
            class="tab-bar v-tabs-bar__details-tab"
          >
            <v-tab id="tab--threat-sharing-incident-email-preview">Email Preview</v-tab>
            <v-tab id="tab--threat-sharing-incident-details">Details</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <div class="mail-preview">
                <PreviewHeaderForSinglePost :uploadRespond="uploadRespond" />
                <div class="preview-body">
                  <k-shadow-frame
                    id="last-preview-body-shadow-root-review"
                    :content="uploadRespond.editableBody || uploadRespond.initialBody"
                  />
                </div>
                <div
                  class="preview-footer"
                  v-if="!!uploadRespond.attachments && uploadRespond.attachments.length"
                >
                  <h2>Attachments</h2>
                  <div class="attachment-wrapper">
                    <div
                      v-for="(att, ind) of uploadRespond.attachments"
                      :key="ind + att.id"
                      :id="'attachment-' + att.name"
                      class="attachment red-attach"
                      :class="[
                        att.isFlagged ? 'red-attach' : '',
                        !att.isFlagged ? 'blue-attach' : '',
                        !att.isHidden ? 'clean-attach' : ''
                      ]"
                    >
                      <AttachmentsPreview :att="att" />
                    </div>
                  </div>
                </div>
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="single-post__details">
                <div id="last-detail-parts" class="detail-parts">
                  <p
                    v-if="
                      (uploadRespond.subject && uploadRespond.isSubjectFlagged) ||
                      (!!uploadRespond.from && uploadRespond.isFromFlagged) ||
                      (uploadRespond.to &&
                        !!uploadRespond.to.length &&
                        uploadRespond.isToFlagged) ||
                      (uploadRespond.cc &&
                        !!uploadRespond.cc.length &&
                        uploadRespond.isCcFlagged) ||
                      (uploadRespond.bcc &&
                        !!uploadRespond.bcc.length &&
                        uploadRespond.isBccFlagged)
                    "
                    class="detail-black disc-header single-post__details__section-header"
                  >
                    Header
                  </p>
                  <div>
                    <p
                      v-if="uploadRespond.subject && uploadRespond.isSubjectFlagged"
                      :id="uploadRespond.subject"
                      class="detail-black detail-red single-post__details__section-header--sub"
                    >
                      Subject:
                      {{
                        !uploadRespond.isSubjectHidden ? uploadRespond.subject : 'Hidden by Owner'
                      }}
                    </p>
                    <p
                      v-if="
                        uploadRespond && uploadRespond.subject && uploadRespond.isSubjectFlagged
                      "
                      id="harmful-Subject"
                      class="detail-black single-post__details__section-header--result"
                    >
                      Emails with this subject may include harmful content
                    </p>
                  </div>
                  <div>
                    <p
                      v-if="uploadRespond.from && uploadRespond.isFromFlagged"
                      :id="uploadRespond.from"
                      class="detail-black detail-red single-post__details__section-header--sub"
                    >
                      From:
                      {{ !uploadRespond.isFromHidden ? uploadRespond.from : 'Hidden by Owner' }}
                    </p>
                    <p
                      v-if="uploadRespond && uploadRespond.from && uploadRespond.isFromFlagged"
                      id="harmful-sender"
                      class="detail-black single-post__details__section-header--result"
                    >
                      Emails from this sender may include harmful content
                    </p>
                  </div>
                  <div>
                    <p
                      v-if="uploadRespond.to && uploadRespond.isToFlagged"
                      class="detail-black detail-red single-post__details__section-header--sub"
                    >
                      To:
                      {{
                        !uploadRespond.isToHidden ? uploadRespond.to.toString() : 'Hidden by Owner'
                      }}
                    </p>
                    <p
                      v-if="uploadRespond && uploadRespond.to && uploadRespond.isToFlagged"
                      id="harmful-to"
                      class="detail-black single-post__details__section-header--result"
                    >
                      This email address may be targeted by emails include harmful content
                    </p>
                  </div>
                  <div>
                    <p
                      v-if="
                        uploadRespond.cc && uploadRespond.cc.length && uploadRespond.isCcFlagged
                      "
                      class="detail-black detail-red single-post__details__section-header--sub"
                    >
                      CC:
                      {{
                        !uploadRespond.isCcHidden ? uploadRespond.cc.toString() : 'Hidden by Owner'
                      }}
                    </p>
                    <p
                      v-if="
                        uploadRespond &&
                        uploadRespond.cc &&
                        uploadRespond.cc.length &&
                        uploadRespond.isCcFlagged
                      "
                      id="harmful-cc"
                      class="detail-black single-post__details__section-header--result"
                    >
                      This email address may be targeted by emails include harmful content
                    </p>
                  </div>
                  <div>
                    <p
                      v-if="
                        uploadRespond.bcc && uploadRespond.bcc.length && uploadRespond.isBccFlagged
                      "
                      class="detail-black detail-red single-post__details__section-header--sub"
                    >
                      CC:
                      {{
                        !uploadRespond.isBccHidden
                          ? uploadRespond.bcc.toString()
                          : 'Hidden by Owner'
                      }}
                    </p>
                    <p
                      v-if="
                        uploadRespond &&
                        uploadRespond.bcc &&
                        uploadRespond.bcc.length &&
                        uploadRespond.isBccFlagged
                      "
                      id="harmful-bcc"
                      class="detail-black single-post__details__section-header--result"
                    >
                      This email address may be targeted by emails include harmful content
                    </p>
                  </div>
                </div>
                <div
                  v-if="uploadRespond && uploadRespond.urls && uploadRespond.urls.length"
                  class="preview-attch-wrapper detail-parts"
                >
                  <p
                    v-if="
                      uploadRespond &&
                      uploadRespond.urls &&
                      uploadRespond.urls.some((a) => !a.isHidden && a.isFlagged)
                    "
                    class="detail-black single-post__details__section-header"
                  >
                    Body
                  </p>
                  <p
                    v-for="(el, ind) of uploadRespond.urls"
                    :key="ind + el.url"
                    v-if="el && !el.isHidden && el.isFlagged"
                    :id="'detail-links-' + el.name"
                    class="detail-black detail-red single-post__details__section-header--sub"
                  >
                    Link: {{ el.name }} ({{ el.url }})
                    <span
                      class="attach-found-malicious single-post__details__section-header--result d-block"
                    >
                      This link has been reported as phishing
                    </span>
                  </p>
                </div>
                <div
                  class="details-attchments-wrapper preview-footer"
                  v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                >
                  <div
                    v-for="(att, ind) of uploadRespond.attachments"
                    :key="ind + att.name"
                    v-if="att.isFlagged"
                    class="preview-attch-wrapper details-attachments"
                  >
                    <p class="single-post__details__section-header">
                      Attachments
                    </p>
                    <div>
                      <div :id="'detail-attachs-' + att.name" class="attachment">
                        <div
                          :id="'detail-name-' + att.name"
                          v-if="!att.isHidden"
                          class="file-name max-char safari-hide-tooltip single-post__details__section-header--sub"
                        >
                          {{ att.name }}
                        </div>
                        <div
                          :id="'detail-name-' + att.name"
                          v-if="att.isHidden"
                          class="file-name max-char single-post__details__section-header--sub"
                        >
                          Hidden by Owner
                        </div>
                      </div>
                    </div>
                    <div v-if="att.isFlagged">
                      <p
                        class="attach-found-malicious detail-black single-post__details__section-header--result"
                      >
                        This file has been reported as malicious content
                      </p>
                    </div>
                  </div>
                </div>
                <div class="detail-discovery pb-4">
                  <div
                    :id="'detail-discovery-empty'"
                    v-if="uploadRespond && uploadRespond.DiscoveryAndDetection"
                    class="disc-header"
                  >
                    Discovery and Detection
                  </div>
                  <p
                    :id="'detail-discovery'"
                    v-if="uploadRespond && uploadRespond.DiscoveryAndDetection"
                    class="discovery-p"
                  >
                    {{ uploadRespond && uploadRespond.DiscoveryAndDetection }}
                  </p>
                  <div v-if="uploadRespond && uploadRespond.AffectArea" class="disc-header mb-1">
                    Impact Range
                  </div>
                  <div
                    :id="'detail-effect-area'"
                    v-if="uploadRespond && uploadRespond.AffectArea"
                    class="impact-row"
                  >
                    <div class="impact-left">Effect area:</div>
                    <div style="width: max-content; padding-right: 13px;" class="impact-right">
                      {{ uploadRespond && uploadRespond.AffectArea.toString() }}
                    </div>
                  </div>
                  <div
                    :id="'detail-scope' + uploadRespond"
                    v-if="uploadRespond && uploadRespond.Scope"
                    class="impact-row"
                  >
                    <div class="impact-left">Scope:</div>
                    <div class="impact-right">
                      {{ uploadRespond && uploadRespond.Scope }}
                    </div>
                  </div>
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import VClamp from 'vue-clamp'
import PreviewHeaderForSinglePost from '@/components/ThreatSharing/PreviewHeaderForSinglePost'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
export default {
  name: 'PostIncidentPreviewPost',
  components: {
    VClamp,
    PreviewHeaderForSinglePost,
    AttachmentsPreview
  },
  props: {
    uploadRespond: {
      type: Object
    },
    currentCompany: {
      type: String
    },
    isAnonym: {
      type: Boolean
    },
    currentCommunityName: {
      type: String
    }
  },
  data() {
    return {
      tab: 0,
      panel: 0,
      toggle: false,
      hoverTool: false
    }
  },
  computed: {
    maliciousCount() {
      let count = 0
      if (this.uploadRespond.isFromFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isSubjectFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isToFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isCcFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isBccFlagged) {
        count = count + 1
      }
      count =
        count +
        this.uploadRespond.urls.reduce((acc, item) => {
          if (item.isFlagged) acc = acc + 1
          return acc
        }, 0)
      count =
        count +
        this.uploadRespond.attachments.reduce((acc, item) => {
          if (item.isFlagged) acc = acc + 1
          return acc
        }, 0)
      return count
    }
  },
  methods: {
    findCategory(id) {
      if (id === 'Ps0SSyl7rVNe') return 'Malicious'
      if (id === 'bEuAD1pdbRXF') return 'Non-Malicious'
      if (id === 'NGLCc9UCxJvw') return 'Phishing'
      if (id === 'Gwt67E1ftYtr') return 'Spam'
      return ''
    },
    getByValue() {
      return this.uploadRespond.PostedUserFullName || localStorage.getItem('userName')
    },
    getFromValue() {
      return this.uploadRespond.PostedUserCompanyName || localStorage.getItem('companyName')
    }
  }
}
</script>
