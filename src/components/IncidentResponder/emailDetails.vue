<template>
  <div class="single-wrapper">
    <div class="single-post">
      <span class="single-post-header">Email Details - File Format Exploit</span>
      <div class="single-post__container">
        <el-tabs v-model="tab" class="email-details__tabs">
          <el-tab-pane label="Details" name="first">
            <DatatableLoading :loading="isLoading" v-if="isLoading && !mailDetails">
            </DatatableLoading>
            <template v-else>
              <download-modal
                :status="downloadModalStatus"
                v-if="downloadModalStatus"
                @changeDownloadModalStatus="downloadModalStatus = $event"
                :id="$attrs.id"
              />
              <div class="details-content">
                <div class="details-content--item mb-6" style="justify-content: space-between;">
                  <div style="display: flex; align-items: center;">
                    <div class="details-content--item--key">
                      Analysis Date
                    </div>
                    <div class="details-content--item--value">
                      {{ mailDetails.analysisDate }}
                    </div>
                  </div>
                  <div>
                    <div @click="handleDownloadEmail()" class="cursor-pointer download">
                      <v-icon color="#2196f3" class="selection-icons">mdi-download</v-icon>
                      DOWNLOAD EMAIL
                    </div>
                  </div>
                </div>
                <div class="details-content--item">
                  <div class="details-content--item--key">
                    From
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails.from }}
                  </div>
                </div>
                <div class="details-content--item">
                  <div class="details-content--item--key">
                    From Name
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails.senderName }}
                  </div>
                </div>
                <div class="details-content--item">
                  <div class="details-content--item--key">
                    To
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails && mailDetails.to && mailDetails.to.toString() }}
                  </div>
                </div>

                <div class="details-content--item">
                  <div class="details-content--item--key">
                    CC
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails && mailDetails.to && mailDetails.cc.toString() }}
                  </div>
                </div>
                <div class="details-content--item">
                  <div class="details-content--item--key">
                    BCC
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails && mailDetails.to && mailDetails.bcc.toString() }}
                  </div>
                </div>
                <div class="details-content--item">
                  <div class="details-content--item--key">
                    Date Received
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails.receivedDate }}
                  </div>
                </div>

                <div class="details-content--item">
                  <div class="details-content--item--key">
                    Sender IP
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails.senderIp }}
                  </div>
                </div>

                <div class="details-content--item">
                  <div class="details-content--item--key">
                    Folder Name
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails.folderName }}
                  </div>
                </div>

                <div class="details-content--item">
                  <div class="details-content--item--key">
                    Attachment Count
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails && mailDetails.attachments.length }}
                  </div>
                </div>
                <div class="details-content--item">
                  <div class="details-content--item--key">
                    Url Count
                  </div>
                  <div class="details-content--item--value">
                    {{ mailDetails && mailDetails.urls.length }}
                  </div>
                </div>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="Header" name="second">
            <template v-if="mailDetails">
              <div class="email-details__header">
                <v-card light class="email-details__header-card">
                  <v-card-title class="email-details__header-title">Relay Information</v-card-title>
                  <div style="margin-top: 40px;">
                    <datatable
                      ref="refRelayTable"
                      :loading="isLoading"
                      :table="relayTable.data"
                      :refName="'relayTable'"
                      :columns="relayTable.columns"
                      :countRow="5"
                      :pageSizes="pageSizes"
                      :selectable="false"
                      :filterable="true"
                      :options="true"
                      :empty="relayTable.iEmpty"
                      :selectEvent="selectEvent"
                      :sizeable="true"
                      :isDownloadable="true"
                      @refreshAction="getPostDetails"
                    />
                  </div>
                </v-card>
                <v-card light class="email-details__header-card">
                  <v-card-title class="email-details__header-title">Headers Found</v-card-title>
                  <div class="email-details__datatable-container">
                    <datatable
                      ref="refHeadersTable"
                      :loading="isLoading"
                      :table="headersTable.data"
                      :refName="'headersTable'"
                      :columns="headersTable.columns"
                      :countRow="25"
                      :pageSizes="pageSizes"
                      :defaultSort="'date'"
                      :selectable="false"
                      :filterable="true"
                      :options="true"
                      :empty="headersTable.iEmpty"
                      :selectEvent="selectEvent"
                      :sizeable="true"
                      :isDownloadable="true"
                      @refreshAction="getPostDetails"
                    />
                  </div>
                </v-card>

                <v-card light class="email-details__header-card">
                  <v-card-title class="email-details__header-title">Received Header</v-card-title>
                  <div class="email-details__received-header">
                    <div :key="JSON.stringify(item)" v-for="item in headersTable.data">
                      {{
                        item.key.substring(0, 1).toUpperCase() +
                        item.key.substring(1, item.key.length)
                      }}:
                      {{ item.value }}
                    </div>
                  </div>
                </v-card>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="Email Preview" name="third">
            <DatatableLoading :loading="isLoading" v-if="isLoading && !mailDetails">
            </DatatableLoading>
            <template v-else>
              <PreviewHeaderForSinglePost :uploadRespond="mailDetails" />
              <div class="border-for-header"></div>
              <k-shadow-frame id="sframe" v-bind:content="mailDetails.htmlBody" />
              <div class="border-for-header mt-8 mb-3"></div>
              <div
                id="preview-footer-container"
                class="preview-footer"
                v-if="!!mailDetails.attachments.length"
              >
                <h2>Attachments</h2>
                <div class="attachment-wrapper">
                  <div
                    v-for="(att, ind) of mailDetails.attachments"
                    :key="att.resourceId"
                    :id="'attachment-' + att.name"
                    class="attachment red-attach"
                    :class="[
                      att.isFlagged ? 'red-attach' : '',
                      !att.isFlagged ? 'blue-attach' : '',
                      !att.isHidden ? 'clean-attach' : ''
                    ]"
                  >
                    <div v-if="att.isFlagged" class="attach-icon red-icon">
                      <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
                    </div>
                    <div v-else class="attach-icon blue-icon">
                      <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
                    </div>
                    <v-menu
                      content-class="email-preview__attachment-container-menu"
                      bottom
                      right
                      offset-y
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on }">
                        <div v-on="on" class="pl-2 email-preview__attachment-container">
                          <span> {{ att.name }} </span>
                          <v-icon style="padding-left: 6px;">mdi-chevron-down</v-icon>
                        </div>
                      </template>
                      <v-list class="v-cart-dropdown-list el-table__action-buttons">
                        <v-list-item @click="handleAttachmentClick(ind, att.sha512)">
                          <v-icon>mdi-text-box-multiple</v-icon>
                          <span class="ml-4"> Attachment Details</span>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="URLs" name="fourth">
            <template v-if="mailDetails">
              <div>
                <datatable
                  id="urlAnalysisTable"
                  ref="refUrlAnalysisTable"
                  :loading="isLoading"
                  :table="tableData"
                  :refName="'urlAnalysisTable'"
                  :columns="columns"
                  :countRow="5"
                  :pageSizes="pageSizes"
                  :defaultSort="'date'"
                  :selectable="false"
                  :filterable="true"
                  :options="true"
                  :empty="iEmpty"
                  :selectEvent="selectEvent"
                  :sizeable="true"
                  :download-button="{ show: false, disabled: false }"
                  @refreshAction="getPostDetails"
                />
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="Attachments" name="fifth">
            <template v-if="mailDetails">
              <v-expansion-panels :multiple="true" v-model="panel">
                <v-expansion-panel
                  class="attachment-analysis-item"
                  v-for="(attachment, index) in mailDetails.attachments"
                  :key="attachment.resourceId"
                  :id="attachment.sha512"
                >
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="ed-title">
                      <div class="d-flex" style="align-items: center;">
                        <div class="left-side d-flex align-center">
                          <p class="attachment-name">{{ attachment.name }}</p>
                          <p
                            class="ml-6 not-found"
                            v-if="isFileUploaded(mailDetails.attachments[index].analysisList)"
                          >
                            *This file was not uploaded to any integration
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="ed-header-btn-1 collapse-details d-flex align-center">
                      <badge
                        :text="getTextOfType(mailDetails.attachments[index].analysisList)"
                        :color="getColorOfType(mailDetails.attachments[index].analysisList)"
                        size="small"
                        class-name="mr-4 badge"
                      />
                      <div
                        @click="handleDownloadAttachment(attachment)"
                        class="cursor-pointer download"
                        style="min-width: 167px;"
                      >
                        <v-icon color="#2196f3" class="selection-icons">mdi-download</v-icon>
                        DOWNLOAD FILE
                      </div>

                      <v-expansion-panel-header
                        class="pa-0"
                        style="min-height: 36px;"
                        disable-icon-rotate
                      >
                        <template v-slot:actions>
                          <v-btn
                            @click.native="setSecondCollapse($event, index)"
                            outlined
                            rounded
                            class="panel-header-btn"
                            medium
                            color="blue"
                            >{{
                              showSecondCollapse.findIndex((item) => item === index) > -1
                                ? 'COLLAPSE'
                                : 'DETAILS'
                            }}
                          </v-btn>
                        </template>
                      </v-expansion-panel-header>
                    </div>
                  </div>
                  <v-expansion-panel-content
                    v-if="showSecondCollapse.findIndex((item) => item === index) > -1"
                    transition="scale-transition"
                    class="pa-0 no-shadow"
                  >
                    <div class="details-content">
                      <div class="details-content--item mt-4">
                        <div class="details-content--item--key attachment-item">
                          SHA512
                        </div>
                        <div class="details-content--item--value">
                          {{ attachment.sha512 }}
                        </div>
                        <v-btn
                          @click="handleIsSha512Copied(index, attachment)"
                          text
                          color="#2196f3"
                          class="details-content--item--clipboard"
                        >
                          {{ getSha512Text(index) }}
                        </v-btn>
                      </div>
                      <div class="details-content--item">
                        <div
                          class="details-content--item--key details-content--item--key--md5 attachment-item"
                        >
                          MD5
                        </div>
                        <div class="details-content--item--value">
                          {{ attachment.md5 }}
                        </div>
                        <v-btn
                          @click="handleIsMd5Copied(index, attachment)"
                          text
                          color="#2196f3"
                          class="details-content--item--clipboard"
                        >
                          {{ getMd5Text(index) }}
                        </v-btn>
                      </div>
                      <div class="details-content--item">
                        <div class="details-content--item--key attachment-item">
                          Content Type
                        </div>
                        <div class="details-content--item--value">
                          {{ attachment.contentType }}
                        </div>
                      </div>
                    </div>
                    <div class="attachments-table">
                      <datatable
                        ref="refAttachmentsTable"
                        :loading="isLoading"
                        :refName="'attachmentsTable'"
                        :columns="attachmentTableOptions.columns"
                        :countRow="5"
                        :table="attachmentTableOptions.tableData[index].analysisList"
                        :pageSizes="pageSizes"
                        :options="false"
                        :empty="attachmentTableOptions.iEmpty"
                        @refreshAction="getPostDetails"
                      >
                        <template v-slot:datatable-custom-column="{ scope }">
                          <span @click="showPopupModal = true" style="cursor: pointer;">
                            <a
                              :href="scope.row.analysisEnginePermalink"
                              target="_blank"
                              class="attachments-table__link"
                              >See Details</a
                            >
                          </span>
                        </template>
                      </datatable>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <div class="empty-attachment" v-if="!mailDetails.attachments.length">
                <h2>No Attachment to display</h2>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import KShadowFrame from '../KShadowFrame'
import Badge from '@/components/Badge'
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

import Datatable from '../../components/DataTable'
import DownloadModal from './DownloadModal'
import {
  getNotifiedEmail,
  getAnalysisEngineTypes,
  downloadAttachment
} from '../../api/notifiedEmail'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'
import PreviewHeaderForSinglePost from '../ThreadSharing/PreviewHeaderForSinglePost'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'

export default {
  components: {
    DatatableLoading,
    PreviewHeaderForSinglePost,
    Datatable,
    DownloadModal,
    Badge
  },
  props: {},
  data: () => ({
    isPreviewRender: false,
    isLoading: true,
    panel: [],
    isCopiedShaClipboard: [],
    isCopiedMd5Clipboard: [],
    attachmentTableOptions: {
      iEmpty: {
        message: 'The attachment is not analyzed'
      },
      tableData: [],
      columns: [
        {
          property: PROPERTY_STORE.ANALYSISENGINE,
          align: 'left',
          label: getStoreValue(PROPERTY_STORE.ANALYSISENGINE),
          show: true,
          fixed: 'left',
          type: 'text',
          width: 200
        },
        {
          property: PROPERTY_STORE.RESULT,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.RESULT),
          show: true,
          fixed: false,
          type: 'badge',
          width: 170
        },
        {
          property: PROPERTY_STORE.ISSENDFILEHASH,
          align: 'left',
          label: getStoreValue(PROPERTY_STORE.ISSENDFILEHASH),
          show: true,
          fixed: false,
          type: 'text',
          width: 130
        },
        {
          property: PROPERTY_STORE.ISSENDFILE,
          align: 'left',
          label: getStoreValue(PROPERTY_STORE.ISSENDFILE),
          show: true,
          type: 'text',
          fixed: false,
          emptyText: 'false',
          width: 130
        },
        {
          property: PROPERTY_STORE.DETAILS,
          align: 'left',
          label: getStoreValue(PROPERTY_STORE.DETAILS),
          show: true,
          fixed: false,
          type: 'slot',
          hideSort: true
        }
      ]
    },
    downloadModalStatus: false,
    headersTable: {
      data: [],
      iEmpty: {
        message: 'No Header to display'
      },
      columns: [
        {
          property: 'key',
          align: 'left',
          editable: false,
          label: 'Header Key',
          sortable: true,
          show: true,
          type: 'text',
          width: 400
        },
        {
          property: 'value',
          align: 'left',
          editable: false,
          label: 'Header Value',
          sortable: true,
          show: true,
          type: 'text'
        }
      ]
    },
    relayTable: {
      data: [],
      iEmpty: {
        message: 'No Relay Information to display'
      },
      columns: [
        {
          property: 'hop',
          align: 'left',
          editable: false,
          fixed: 'left',
          label: 'Hop',
          sortable: true,
          show: true,
          type: 'text',
          width: 120
        },
        {
          property: 'delay',
          align: 'left',
          editable: false,
          label: 'Delay',
          sortable: true,
          show: true,
          type: 'text',
          width: 150
        },
        {
          property: 'from',
          align: 'left',
          editable: false,
          label: 'From',
          sortable: true,
          show: true,
          type: 'text',
          width: 375
        },
        {
          property: 'by',
          align: 'left',
          editable: false,
          label: 'By',
          sortable: true,
          show: true,
          type: 'text',
          width: 375
        },
        {
          property: 'utcTime',
          align: 'left',
          editable: false,
          label: 'Time',
          sortable: true,
          show: true,
          type: 'text',
          width: 200
        },
        {
          property: 'with',
          align: 'left',
          editable: false,
          fixed: false,
          label: 'With',
          sortable: true,
          show: true,
          type: 'text',
          minWidth: 150
        }
      ]
    },
    mailDetails: null,
    showFirstCollapse: false,
    showSecondCollapse: [],
    expanded: false,
    commentOpened: false,
    isWantToShareIncident: false,
    isWantToInvestigate: false,
    isWantToPostIncident: false,
    tab: 'first',
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
    comments: [],
    hoverTool: false,
    details: {},
    shareSettings: {},
    addCommentValue: '',
    showDatatable: true,
    columns: [
      // Should be defined to show the table
      {
        property: 'url',
        align: 'left',
        editable: false,
        label: 'Url',
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        width: 400
      },
      {
        property: 'status',
        align: 'center',
        editable: false,
        label: 'Status',
        fixed: false,
        sortable: false,
        show: true,
        maxWidth: 170,
        type: 'detected',
        hasTooltip: true
      }
    ],
    title: {
      icon: 'mdi-tab-unselected',
      title: 'Url Analysis',
      subTitle: ''
    },
    pageSizes: [5, 10, 25],
    iEmpty: {
      message: 'No URL to display'
    },
    selectEvent: {
      clipboard: true,
      download: false
    },
    tableData: []
  }),
  mounted() {
    this.getEngineDetails()
    this.getPostDetails()
  },
  methods: {
    isFileUploaded(attachments) {
      if (attachments) {
        const data = attachments.filter((item) => item.isSendFile || item.isSendFileHash)
        return !!data.length
      }
    },
    handleIsSha512Copied(index, attachment) {
      this.isCopiedShaClipboard.findIndex((item) => item === index) === -1 &&
        this.writeToNavigator(attachment.sha512, index, 'sha')
    },
    handleIsMd5Copied(index, attachment) {
      this.isCopiedMd5Clipboard.findIndex((item) => item === index) === -1 &&
        this.writeToNavigator(attachment.md5, index, 'md5')
    },
    getTextOfType(list) {
      return this.getResultOfAttachmentList(list)
    },
    getColorOfType(list) {
      let result = this.getResultOfAttachmentList(list)
      switch (result) {
        case 'Clean':
          return '#00bcd4'
        case 'Malicious':
          return '#e6a23c'
        case 'Phishing':
          return '#f56c6c'
        default:
          return '#00bcd4'
      }
      return result
    },
    handleAttachmentClick(index, id) {
      this.tab = 'fifth'
      this.panel.push(index)
      this.showSecondCollapse.push(index)
      setTimeout(() => {
        const anchor = document.createElement('a')
        anchor.href = `#${id}`
        anchor.click()
      }, 800)
    },
    getResultOfAttachmentList(list) {
      let result = 'N/A'
      for (let item of list) {
        if (item.result === 'Malicious') {
          result = 'Malicious'
          break
        }
        if (item.result === 'Phishing') {
          result = 'Phishing'
          continue
        }
        if (item.result === 'Clean' && result !== 'Phishing' && result !== 'Malicious') {
          result = 'Clean'
        }
      }
      return result
    },
    writeToNavigator(value, index, type) {
      if (type === 'sha') {
        const pushedIndex = this.isCopiedShaClipboard.push(index) - 1
        setTimeout(() => {
          this.isCopiedShaClipboard.splice(pushedIndex, 1)
        }, 5000)
      } else if (type === 'md5') {
        const pushedIndex = this.isCopiedMd5Clipboard.push(index) - 1
        setTimeout(() => {
          this.isCopiedMd5Clipboard.splice(pushedIndex, 1)
        }, 5000)
      }
      navigator.clipboard.writeText(value)
    },
    handleDownloadEmail() {
      this.downloadModalStatus = true
    },
    getHeaderRow(key, value) {
      let outputValue = ''
      if (value.includes(',')) {
        outputValue = value.split(',')
      }
    },

    setSecondCollapse(event, index) {
      if (event.target.textContent.startsWith('COLLAPSE')) {
        this.showSecondCollapse.splice(
          this.showSecondCollapse.findIndex((item) => item === index),
          1
        )
        const shaIndex = this.isCopiedShaClipboard.findIndex((item) => item === index)
        if (shaIndex > -1) {
          this.isCopiedShaClipboard.splice(shaIndex, 1)
        }
        const md5Index = this.isCopiedMd5Clipboard.findIndex((item) => item === index)
        if (md5Index > -1) {
          this.isCopiedMd5Clipboard.splice(md5Index, 1)
        }
      } else {
        this.showSecondCollapse.push(index)
      }
    },
    handleDownloadAttachment(attachment) {
      downloadAttachment(attachment.resourceId)
        .then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = attachment.name
          link.click()
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.message) {
            this.$store.dispatch('common/createSnackBar', {
              message: 'File can not downloaded',
              icon: 'mdi-alert-circle',
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR
            })
          }
        })
    },
    getPostDetails() {
      this.isLoading = true
      getNotifiedEmail(this.$attrs.id)
        .then((response) => {
          this.mailDetails = response.data.data
          const urlTableColumns = new Set()
          const tableData = this.mailDetails.urls.map((item, index) => {
            const returnObj = {}
            let result
            for (let engine of item.analysisList) {
              returnObj[engine.analysisEngine] = engine.result
              urlTableColumns.add(engine.analysisEngine)
              if (result !== 'Malicious') {
                if (
                  (result === 'Phishing' || result === 'Clean') &&
                  engine.result === 'Malicious'
                ) {
                  result = 'Malicious'
                } else if (result === 'Phishing' && engine.result === 'Clean') {
                  result = 'Phishing'
                } else {
                  result = engine.result
                }
              }
            }
            returnObj['status'] = result
            returnObj['url'] = item.url
            return returnObj
          })
          let colObj = []
          urlTableColumns.forEach((item) => {
            colObj.push({
              property: item,
              align: 'left',
              editable: false,
              label: item,
              sortable: true,
              show: true,
              minWidth: 60 + item.length * 7,
              type: 'text',
              emptyText: 'None'
            })
          })
          if (colObj.length) {
            this.columns[1]['width'] = 170
          }
          this.columns = [...this.columns, ...colObj]
          this.tableData = tableData
          this.attachmentTableOptions.tableData = this.mailDetails.attachments
          const urls = this.mailDetails.urls
          this.headersTable.data = this.mailDetails.headers
          this.relayTable.data = this.mailDetails.emailRelays
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Details can not be reached'
          })
        })
        .finally(() => (this.isLoading = false))
    },
    getEngineDetails() {
      getAnalysisEngineTypes()
        .then((response) => {
          const engineTypes = response.data.data
          /*
          engineTypes.map((item) => {
            this.columns.push({
              property: 'analysisEngine',
              align: 'left',
              editable: false,
              label: item.name,
              fixed: false,
              sortable: true,
              show: true,
              type: 'text'
            })
          })

           */
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Analysis engine types can not be reached'
          })
        })
    },
    getMd5Text(index) {
      return this.isCopiedMd5Clipboard.findIndex((item) => item === index) > -1
        ? 'COPIED!'
        : 'COPY TO CLIPBOARD'
    },
    getSha512Text(index) {
      return this.isCopiedShaClipboard.findIndex((item) => item === index) > -1
        ? 'COPIED!'
        : 'COPY TO CLIPBOARD'
    },
    setEmailPreview() {
      let _this = this
      if (!this.isPreviewRender) {
        this.isPreviewRender = true
        setTimeout(function () {
          for (let a of _this.mailDetails.urls) {
            const els = document
              .getElementById('sframe')
              .shadowRoot.querySelectorAll('[href="' + a.url + '"]')
            for (let i = 0, l = els.length; i < l; i++) {
              const el = els[i]
              el.setAttribute('target', '_blank')
              el.setAttribute('data-title', 'This link has been reported as a phishing')
              el.style.backgroundColor = '#f3e1e5'
              el.style.color = '#bb2a45'
              el.innerHTML = el.innerHTML + `<span class="malicious-link mdi mdi-alert"></span>`
              // }
            }
          }
        }, 400)
      }
    }
  },
  created() {
    if (this.$route.params && this.$route.params.tab) {
      this.tab = this.$route.params.tab
    }
  },
  watch: {
    panel(val) {},
    tab(val) {
      val === 2 && this.setEmailPreview()
    }
  }
}
</script>

<style lang="scss">
.single-wrapper {
  .border-for-header {
    border-bottom: 1px solid #b3d4fc;
    max-width: 632px;
  }
  .incident-wrapper .preview-body,
  .incident-wrapper .preview-header .header-info {
    font-family: Open Sans, sans-serif !important;
    font-size: 14px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
  min-height: 80vh;
  .empty-attachment {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    h2 {
      font-size: 24px;
      font-weight: normal;
      line-height: 1.29;
      letter-spacing: normal;
      padding-bottom: 6px;
    }
  }
  .single-post {
    margin: 15px !important;
    border-radius: 12px;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
    background-color: #ffffff;
    padding: 24px;
    &__container {
      margin-top: 40px;
      border-radius: 20px;
      box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
        0 3px 1px -2px rgba(80, 80, 80, 0.12);
      padding: 10px 24px 24px;
    }
  }

  .single-post-header {
    font-size: 24px;
    font-weight: normal;
    line-height: 1.6;
    letter-spacing: normal;
    color: #2196f3;
    display: block;
  }
  .tab-bar {
    width: 100%;
    padding: 0;
    border-radius: 0 !important;
    display: inline-block;

    .v-slide-group__wrapper {
      padding-left: 0 !important;
      height: 55px;
    }

    .v-slide-group__content {
      margin-right: 0 !important;
    }

    .v-tab--active {
      color: #2196f3 !important;
    }
    .v-tab:not(:last-child) {
      margin-right: 40px;
    }

    .v-tab {
      width: auto;
    }

    .v-tab--active {
      color: #2196f3 !important;
    }

    .v-tabs-bar {
      height: 48px !important;
      border-radius: 0 !important;
    }
  }
  .mdi-attachment {
    transform: rotate(90deg);
  }
  .attachment-analysis-item {
    border-radius: 20px;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    background-color: #ffffff;
    padding: 24px 24px 24px 24px;
    position: relative;
    margin-bottom: 16px;
    p {
      margin-bottom: 0 !important;
    }
    .badge.v-btn:not(.v-btn--round).v-size--default,
    .badge.v-btn--icon.v-size--default {
      height: 28px !important;
    }

    &::after {
      display: none;
    }
  }

  .v-application p {
    margin-bottom: 0;
  }

  .wrap-padding {
    padding: 28px !important;
  }

  .attachment-name {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  .wrf {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .not-found {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(219, 37, 37, 0.87);
  }

  .download {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    text-decoration: none;
  }

  .details-content {
    &--item {
      display: flex;
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      &--value {
        font-size: 14px;
        font-weight: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);

        a {
          font-size: 14px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          color: #2196f3;
        }

        &--status {
          min-width: 80px;
          display: inline-block;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
          &__Phishing {
            color: rgba(219, 37, 37, 0.87);
          }
          &__Malicious {
            color: #b06000;
          }
        }

        &--icon {
          min-width: 100px;
          display: inline-block;
          margin-right: 28px;
          .v-icon {
            font-size: 12px;
            object-fit: contain;
          }
        }
      }

      &--key {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.71;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        margin-right: 24px;
        min-width: 125px;
        max-width: 150px;
      }
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }

  // Threat sharing Content
  .v-slide-group__content.v-tabs-bar__content:after {
    content: '';
    height: 2px;
    width: 100%;
    background-color: #e4e7ed;
    bottom: 0px;
    left: 0;
    position: absolute;
  }
  .v-window-item {
    margin-top: 19px;
  }

  .threat-sharing-content {
    min-height: 200px;
    width: 100%;
    padding: 24px !important;
    background-color: #ffffff;
    border-radius: 20px !important;

    @media only screen and (max-width: 500px) {
      padding: 16px !important;
    }
  }

  .ts-header {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .ts-header-btn-1 {
    display: flex;
  }

  .ts-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    max-width: 79%;
    position: relative;
    display: flex;

    @media only screen and (max-width: 1450px) {
      max-width: 70%;
    }
  }

  // Threat sharing Content End

  .notification-wrapper {
    background-color: #fff;
    padding: 0;
  }

  .v-menu__content {
    border-radius: 8px !important;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;

    .v-list-item {
      padding-left: 29px !important;
      padding-right: 16px !important;
    }

    .v-list-item__title {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--black-87);
    }
  }

  .v-application--is-ltr .v-list-item__icon:first-child {
    margin-right: 10px !important;
  }

  .ts-user-comp-detail {
    align-items: center;
    display: flex;
    margin-top: 8px;
    flex-wrap: wrap;
  }

  .v-btn--contained {
    border-radius: 18px !important;
  }

  .v-data-footer {
    margin-top: 24px !important;
  }

  .v-data-footer__select {
    .v-select {
      margin: 0 !important;
      margin-top: 3px !important;
      margin-left: 32px !important;
      height: 30px !important;
    }

    .v-text-field > .v-input__control > .v-input__slot:after {
      border: none !important;
      display: none !important;
    }

    .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
      border: none !important;
    }

    .v-input__append-inner {
      margin-left: 0 !important;
      margin-top: 3px !important;
      margin-right: 5px !important;
      padding-left: 0 !important;
    }

    .v-select__slot {
      align-items: center;
      display: flex;
      justify-content: center;
      height: 27px !important;
      background-color: #f2f2f2 !important;

      .v-select__selections {
        margin-left: 10px;
      }
    }

    .v-input__icon {
      width: 20px !important;
      min-width: 20px !important;
      height: 20px !important;
    }
  }

  .v-btn:not(.v-btn--round).v-size--default,
  .v-btn--icon.v-size--default {
    height: 36px !important;
  }

  .v-btn--icon.v-size--default {
    margin-left: 4px;
    width: 36px !important;
  }

  .ts-tags {
    align-items: center;
    display: flex;
    flex-direction: row;
    max-width: max-content;

    > .tag-btn,
    > div > .tag-btn {
      border-radius: 18px;
      border: solid 1.5px #c0c4cc;
      background-color: #fff;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #000000;
      height: 32px !important;
    }
  }

  .ts-footer {
    align-items: center;
    display: flex;
    margin-top: 22px;
    margin-left: 0;
    margin-right: 0;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .ts-like {
    margin-right: 10px;
    align-items: center;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
      margin-left: 4px;
    }
  }

  .ts-message {
    margin-right: 40px;
    align-items: center;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
      margin-left: 4px;
    }
  }

  .ts-harmful {
    margin-right: 15px;
    align-items: center;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
    }
  }

  .ts-success {
    display: flex;
    align-items: center;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
    }
  }

  .ts-body {
    margin-top: 10px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .ts-user-comp {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);

    a:not(:last-child) {
      text-decoration: none;
      display: block;
      width: max-content;
      min-width: max-content;
    }

    a:last-child {
      width: unset !important;
      max-width: 100%;
      display: block;
      overflow: hidden;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ts-user-date {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.58;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .ts-action-counter {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #4a4a4a;
  }

  .ts-actions {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-left: 3px;
  }

  .v-expansion-panel {
    border-radius: 20px !important;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    background-color: #fff;
    border: unset !important;
    .k-table__wrapper {
      padding-bottom: 0;
    }
  }

  .v-expansion-panel::before {
    box-shadow: unset !important;
  }

  .v-expansion-panel-header {
    box-shadow: unset !important;
    border: unset !important;
  }

  .v-window {
    border-radius: 20px !important;
  }

  .v-expansion-panel-content {
    border-radius: 20px !important;
    display: block !important;
    font-family: 'Open Sans', sans-serif !important;
  }

  .v-expansion-panel-content__wrap {
    padding: 0 !important;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
    background-color: #ffffff;
  }

  .no-shadow .v-expansion-panel-content__wrap {
    border-radius: 0;
    box-shadow: none;
    background-color: #ffffff;
  }

  // Email Preview css
  .preview-header {
    margin-top: 32px;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }

    .header-info {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .preview-body {
    margin-top: 4px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    position: relative;
    min-height: auto;
    max-height: 500px;
    overflow: auto;

    .company-img {
      display: flex;
      position: absolute;
      right: 0;
      top: 20px;
      width: 84px;
      height: 84px;

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .bodyExpanded {
    height: 100% !important;
    max-height: 100% !important;
    padding-bottom: 56px;
  }

  .details-attchments-wrapper {
    display: flex;
    flex-direction: column;

    .details-attachments {
      width: auto !important;

      h2 {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        padding-bottom: 4px !important;
      }

      .file-name {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(219, 37, 37, 0.87);
      }
    }
  }

  .preview-footer {
    display: flex;
    flex-direction: row;
    max-width: 100%;
    flex-wrap: wrap;

    .preview-attch-wrapper {
      width: max-content;
    }

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 16px;
      width: 100%;
      padding-top: 13px;
    }

    .attachment-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      max-width: max-content;
      min-height: auto;

      .attachment {
        min-width: 182px;
        height: 32px;
        align-items: center;
        display: flex;
        flex-direction: row;
        margin: 16px;
        margin-left: 0;
        margin-top: 0;

        .attach-icon {
          min-width: 40px;
          height: 32px;
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .red-icon {
          background-color: #bb2a45 !important;
        }

        .blue-icon {
          background-color: #2196f3 !important;
        }

        span {
          width: 100%;
          text-align: center;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.58;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
        }
      }

      .red-attach {
        background-color: #f3e1e5;
      }

      .blue-attach {
        background-color: #f1f8fe;
      }

      .file-name {
        display: block;
        max-width: 93%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .preview-buttons {
    margin-top: 24px;
    padding-bottom: 13px;
    display: flex;
    flex-direction: row;
    border-top: 1px solid #b3d4fc;
    padding-top: 24px;

    .v-btn {
      border-radius: 18px !important;
      border: solid 1px #909399;
      box-shadow: unset !important;
      background-color: #fff !important;
      margin-right: 16px;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, 0.87);
      padding-left: 16px !important;

      .v-icon {
        color: #909399;
        font-size: 19px !important;
        margin-right: 8px;
        margin-top: 1px;
        border: unset !important;
      }
    }

    .active-act {
      color: #2196f3 !important;
      border: solid 1px #2196f3 !important;
    }
  }

  .preview-border {
    border-top: 1px solid #b3d4fc;
    padding-top: 24px;
  }

  // Details css
  .detail-parts:first-child {
    margin-top: 24px !important;
  }

  .detail-parts {
    margin-top: 16px;
  }

  .detail-discovery {
    margin-top: 24px;

    .disc-header {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 8px;
    }

    .discovery-p {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .impact-row {
    display: flex;
    flex-direction: row;
    padding-bottom: 8px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);

    .impact-left {
      min-width: 100px;
      font-weight: 600 !important;
    }

    .impact-right {
      max-width: 80%;
    }
  }

  .border-padding {
    padding-bottom: 8px;
    border-bottom: 1px solid #b3d4fc;
  }

  .member-company-body {
    .v-slide-group__content {
      border-bottom: unset !important;
    }
  }

  .expand-contaniner {
    width: 100%;
    height: 50px;
    position: absolute;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    bottom: 0;
    background-image: linear-gradient(to bottom, transparent, #fff 50%);

    button,
    .v-btn:not(.v-btn--round).v-size--default {
      width: auto !important;
      height: 24px !important;
      border-radius: 12px !important;
      background-color: #409eff !important;
      box-shadow: unset !important;
      color: #fff;
      text-transform: capitalize !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      padding-left: 13px !important;

      i {
        width: 18px !important;
      }
    }
  }

  .opacityExpanded {
    background-image: none !important;
  }

  .preview-comments {
    height: 0;
    opacity: 0;
    transition: max-height 0.25s ease-in;
    overflow: hidden;

    .comment-row {
      display: flex;
      flex-direction: row;
      padding-top: 6px;

      .comment-input {
        margin-top: 3px;
        margin-right: 16px;

        .v-input__slot {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 13px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.54);
          padding-left: 24px !important;
          max-height: 70px;
          min-height: 40px;

          textarea {
            max-height: 70px;
            overflow: auto;
            margin-bottom: 5px;
            margin-top: 2px;
            margin-right: 2px;
          }

          label {
            top: 10px;
          }

          fieldset {
            padding-left: 18px !important;
          }
        }
      }

      .send-btn {
        border-radius: 18px !important;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
        background-color: #2196f3 !important;
        color: #fff !important;
        height: 36px !important;
        margin: 3px;

        i {
          font-size: 18px !important;
          padding-right: 8px;
        }
      }
    }

    .comment-row {
      border-radius: 4px;
      background-color: #f5f7fa;
      display: flex;
      padding: 16px;
      margin-bottom: 8px;

      .user-wrapper {
        display: block;
        max-width: 100%;

        .username,
        .company-name {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 14px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #2196f3;
          padding-right: 4px;
          cursor: pointer;
        }

        .company-name {
          padding-left: 4px;
        }
      }

      .the-comment {
        margin-bottom: 0 !important;
        padding-top: 8px !important;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
        max-width: 100%;
      }
    }

    .see-all-comments {
      padding-top: 16px;
      padding-bottom: 24px;

      span {
        text-decoration: none;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #2196f3;
        cursor: pointer;
      }
    }
  }

  .open-comments {
    height: auto !important;
    transition: max-height 0.25s ease-in;
    padding-bottom: 24px;
    opacity: 1;
    z-index: -5;
  }

  .add-comment {
    background-color: #fff !important;
    height: 60px;
    padding: 0 !important;
  }

  .unselected-warn {
    border-bottom: 1px solid #bb2a45;
    color: #bb2a45;
    padding: 0 2px !important;
  }

  .hide-buttons {
    opacity: 0;
    padding: 0 !important;
    height: 20px !important;
  }

  .display-none {
    display: none !important;
  }

  .tooltip-wrapper {
    display: block;
    max-width: 250px;
    width: 130px;
    height: 50px;
    border-radius: 4px;
    background-color: #6d6d6d;
    position: absolute;
    top: -55px;
    left: -35px;
    border-radius: 4px;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;
    padding: 8px;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 34px;
    }

    span {
      color: rgba(255, 255, 255, 0.87) !important;
      font-size: 12px !important;
      line-height: 1.33 !important;
      font-weight: 400;
    }
  }

  .add-comment-row {
    display: flex;
    justify-content: space-between;
    flex-direction: row;

    .comment-input {
      max-width: 80%;
    }

    .send-btn {
      border-radius: 18px !important;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
      background-color: #2196f3 !important;
      color: #fff !important;
      height: 36px !important;

      i {
        font-size: 18px !important;
        padding-right: 8px;
      }
    }
  }

  #incident-badge {
    padding: 4px 12px;
  }

  .detected-items {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
    padding-top: 24px;
  }

  .malicious-style {
    //edit
    color: #bb2a45 !important;
    border-bottom: 1px solid #bb2a45 !important;
    border-color: #bb2a45 !important;
    background-color: #f3e1e5 !important;

    text-decoration: none !important;
    border-bottom: 1px solid;
    position: relative;
    text-indent: 0;
  }

  .red-malicious-alert::before {
    border: unset !important;
  }

  .malicious-style {
    .red-malicious-alert:not(:first-child) {
      display: block !important;
    }
  }
  .k-table__wrapper .card .table-wrapper .el-table th > .cell {
    padding-left: 24px !important;
  }
  .k-table__wrapper .card .table-wrapper .el-table td > .cell {
    padding-left: 24px !important;
  }
}

.attachments-table {
  margin-top: 24px;

  &__link {
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.29;
    letter-spacing: normal;
    color: #2196f3;
  }
}
.details-content--item--value {
  line-break: anywhere;
  max-width: 550px;
}
.details-content--item--clipboard {
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #2196f3;
  margin-left: 24px;
}
.email-details__header {
  &-card {
    padding: 36px 24px 0px 24px;

    &:not(:last-child) {
      margin-bottom: 24px;
    }
    &:last-child {
      padding-bottom: 24px;
    }
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    background-color: #ffffff !important;
    border-radius: 12px !important;
  }

  &-title {
    padding: 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: normal;
    color: #2196f3;
  }
}

.email-details__datatable-container {
  margin-top: 40px;
  .k-table__wrapper .card .table-wrapper .el-table td > .cell {
    white-space: inherit !important;
    padding-top: 15px;
    padding-bottom: 15px;
  }
}

.email-details__received-header {
  margin-top: 40px;
  border-radius: 8px;
  border: solid 1px #dcdfe6;
  padding: 10px 15px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.54);
}
.email-details__download-modal {
  .v-list-item__title,
  .v-list-item__subtitle {
    white-space: pre-wrap !important;
  }
  .k-dialog__body {
    padding-bottom: 0;
  }
}
.selection-icons {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.71;
  letter-spacing: normal;
  color: #2196f3;
  text-transform: uppercase !important;
}

.details-content--item {
  align-items: center;
}
.details-content--item--key--md5 {
  @media (max-width: 1300px) {
    margin-right: 43px !important;
  }
}

.attachment-item {
  @media (min-width: 1380px) {
    min-width: 125px !important;
    max-width: 150px !important;
  }

  @media (max-width: 1300px) {
    min-width: auto !important;
  }
}
.panel-header-btn {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: center;
  color: #2196f3 !important;
}
.email-preview__attachment-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  &-menu {
    border-radius: 20px !important;
    box-shadow: 0 8px 10px -3px rgba(80, 80, 80, 0.14), 0 2px 4px 0 rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(80, 80, 80, 0.12) !important;
    span {
      font-size: 14px;
    }
  }
  span {
    font-size: 12px;
    line-height: 1.58;
    letter-spacing: normal;
    text-align: left !important;
    color: rgba(0, 0, 0, 0.87);
  }
  i {
    visibility: hidden;
  }
  &:hover {
    i {
      cursor: pointer;
      visibility: visible;
    }
  }
}
#urlAnalysisTable.k-table__wrapper {
  padding-bottom: 0;
}
.email-details__tabs {
  .el-tabs__content {
    margin-top: 24px;
    .preview-header {
      margin-top: 0;
    }
  }
}
</style>
