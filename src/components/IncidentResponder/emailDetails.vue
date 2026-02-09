<template>
  <div class="single-wrapper" :class="[tab === 'third' && 'show-overflow-tab-content']">
    <div class="single-post">
      <span class="single-post-header"
        >Email Details -
        {{ mailDetails && mailDetails.subject ? mailDetails.subject : 'File Format Exploit' }}</span
      >
      <div class="single-post__container">
        <el-tabs v-model="tab" class="email-details__tabs" id="email-details-tabs">
          <el-tab-pane label="Details" name="first" id="email-details-summary-content">
            <DatatableLoading :loading="isLoading" v-if="isLoading"> </DatatableLoading>
            <template v-else>
              <download-modal
                v-if="downloadModalStatus"
                :status="downloadModalStatus"
                :id="$attrs.id"
                @changeDownloadModalStatus="downloadModalStatus = $event"
              />
              <email-details-content-details
                :mail-details="mailDetails"
                :loading="isLoading"
                @handleDownloadEmail="handleDownloadEmail"
                @on-re-analyze-click="getPostDetails"
              />
            </template>
          </el-tab-pane>
          <el-tab-pane label="Header" name="second" id="email-details-header-content">
            <DatatableLoading :loading="isLoading" v-if="isLoading"> </DatatableLoading>
            <template v-if="mailDetails">
              <div class="email-details__header">
                <v-card light class="email-details__header-card">
                  <v-card-title
                    id="text--email-details-header-relay-information"
                    class="email-details__header-title"
                    >Relay Information</v-card-title
                  >
                  <div style="margin-top: 40px;">
                    <datatable
                      ref="refRelayTable"
                      id="relay-data-table"
                      filterable
                      options
                      :loading="isLoading"
                      :table="relayTable.data"
                      :columns="relayTable.columns"
                      :selectable="false"
                      :empty="relayTable.iEmpty"
                      :selectEvent="selectEvent"
                      :download-button="{ show: false }"
                      @refreshAction="getPostDetails"
                    />
                  </div>
                </v-card>
                <v-card light class="email-details__header-card" id="email-details--header">
                  <v-card-title
                    id="text--email-details-header-headers-found"
                    class="email-details__header-title"
                    >Headers Found</v-card-title
                  >
                  <div class="email-details__datatable-container">
                    <datatable
                      ref="refHeadersTable"
                      id="headers-data-table"
                      filterable
                      options
                      :loading="isLoading"
                      :table="headersTable.data"
                      :columns="headersTable.columns"
                      :countRow="25"
                      :defaultSort="'date'"
                      :selectable="false"
                      :empty="headersTable.iEmpty"
                      :selectEvent="selectEvent"
                      :download-button="{ show: false }"
                      @refreshAction="getPostDetails"
                      @onPageChanged="adjustScroll"
                      @onSizeChanged="adjustScroll"
                    />
                  </div>
                </v-card>

                <v-card light class="email-details__header-card">
                  <v-card-title
                    id="text--email-details-header-received-header"
                    class="email-details__header-title"
                    >Received Header</v-card-title
                  >
                  <div
                    id="container--email-details-received-header"
                    class="email-details__received-header"
                  >
                    <div :key="JSON.stringify(item)" v-for="item in headersTable.data">
                      {{ getKeyValue(item) }}:
                      {{ item.value }}
                    </div>
                  </div>
                </v-card>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane label="Email Preview" name="third" id="email-details-preview-content">
            <DatatableLoading :loading="isLoading" v-if="isLoading && !mailDetails">
            </DatatableLoading>
            <template v-else>
              <PreviewHeaderForSinglePost
                v-if="mailDetails"
                style="word-break: break-all;"
                :uploadRespond="mailDetails"
              />
              <div class="border-for-header"></div>
              <KEmailPreview
                v-if="!!mailDetails && !!mailDetails.htmlBody"
                id="sframe"
                ref="refPreview"
                :html="mailDetails.htmlBody"
              />
              <div class="border-for-header mt-8 mb-3"></div>
              <email-details-preview-footer
                v-if="isMailDetailsHaveAttachments"
                :mail-details="mailDetails"
                @on-attachment-click="handleAttachmentClick"
              />
            </template>
          </el-tab-pane>
          <el-tab-pane label="URLs" name="fourth" id="email-details-urls-content">
            <DatatableLoading :loading="isLoading" v-if="isLoading"> </DatatableLoading>
            <template v-if="mailDetails">
              <email-details-url
                :mailDetails="mailDetails"
                :is-loading="isLoading"
                @get-post-details="getPostDetails"
              />
            </template>
          </el-tab-pane>
          <el-tab-pane label="Attachments" name="fifth" id="email-details-attachment-content">
            <DatatableLoading :loading="isLoading" v-if="isLoading"> </DatatableLoading>
            <template v-if="mailDetails">
              <DownloadAttachmentModal
                v-if="downloadAttachmentModalStatus"
                :status="downloadAttachmentModalStatus"
                :id="selectedAttachment.resourceId"
                :attachment="selectedAttachment"
                @changeDownloadModalStatus="handleCloseDownloadAttachmentModal"
              />
              <v-expansion-panels :multiple="true" v-model="panel">
                <v-expansion-panel
                  v-for="(attachment, index) in mailDetails.attachments"
                  :key="attachment.resourceId"
                  :id="`email-details-attachment-expansion-panel-${index}`"
                  class="attachment-analysis-item"
                >
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="ed-title">
                      <div
                        :id="`text--incident-responder-email-details-attachment-${index}`"
                        class="d-flex"
                        style="align-items: center;"
                      >
                        <div class="left-side d-flex align-center">
                          <p class="attachment-name">{{ attachment.name }}</p>
                          <p
                            v-if="isFileUploaded(mailDetails.attachments[index].analysisList)"
                            class="ml-6 not-found"
                          >
                            *This file was not uploaded to any integration
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="ed-header-btn-1 collapse-details d-flex align-center">
                      <badge
                        :text="mailDetails.attachments[index].result"
                        :color="getBtnStatusColor(mailDetails.attachments[index].result)"
                        size="small"
                        :outline="false"
                        class-name="mr-4 badge"
                        :id="`badge--incident-responder-email-details-attachment-${index}`"
                      />
                      <div
                        :id="`btn-download--incident-responder-email-details-attachment-${index}`"
                        class="cursor-pointer download"
                        style="min-width: 167px;"
                        @click="handleDownloadAttachment(attachment)"
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
                            :id="`btn-details--email-details-attachment-${index}`"
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
                    :id="`expansion-panel-content-email-details-attachment-${index}`"
                    transition="scale-transition"
                    class="pa-0 no-shadow"
                  >
                    <div class="details-content">
                      <div
                        :id="`email-details-attachment-item-sha512-${index}`"
                        class="details-content--item mt-4"
                      >
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
                      <div
                        :id="`email-details-attachment-item-md5-${index}`"
                        class="details-content--item"
                      >
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
                      <div
                        :id="`email-details-attachment-item-content-type-${index}`"
                        class="details-content--item"
                      >
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
                        id="attachmentsTable"
                        ref="refAttachmentsTable"
                        :loading="isLoading"
                        :columns="attachmentTableOptions.columns"
                        :table="attachmentTableOptions.tableData[index].analysisList"
                        :options="false"
                        :empty="attachmentTableOptions.iEmpty"
                        :download-button="{ show: false }"
                        @refreshAction="getPostDetails"
                      >
                        <template #datatable-custom-column="{ scope }">
                          <span class="cursor-poineter">
                            <a
                              v-if="
                                scope.row.analysisEnginePermalink &&
                                scope.row.result !== 'Excluded' &&
                                scope.row.analysisEngineType !== INTEGRATION_TYPES.VIRUSTOTAL &&
                                scope.row.analysisEngineType !== INTEGRATION_TYPES.OPSWAT &&
                                scope.row.analysisEngineType !== INTEGRATION_TYPES.FORTINET &&
                                scope.row.analysisEngineType !== INTEGRATION_TYPES.USTA
                              "
                              :id="`btn-see-details--email-details-attachment-${index}`"
                              class="attachments-table__link"
                              target="_blank"
                              rel="noopener"
                              :href="scope.row.analysisEnginePermalink"
                              >See Details</a
                            >
                            <span v-else></span>
                          </span>
                        </template>
                      </datatable>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <div class="empty-attachment" v-if="!isMailDetailsHaveAttachments">
                <h2>No Attachment to display</h2>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="sixth" id="email-details-ai-analyze-content">
            <template #label>
              <v-icon class="mr-2" style="font-size: 18px; color: #1e88e5;"
                >mdi-brain</v-icon
              >
              AI Analysis
            </template>
            <DatatableLoading :loading="isLoading" v-if="isLoading"> </DatatableLoading>
            <template v-if="mailDetails">
              <EmailDetailsAIAnalyze
                :id="mailDetails && mailDetails.resourceId ? mailDetails.resourceId : id"
                @update:loading="aiAnalyzeLoading = $event"
              />
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Badge from '@/components/Badge'
import Datatable from '@/components/DataTable'
import DownloadModal from '@/components/IncidentResponder/DownloadModal'
import DownloadAttachmentModal from '@/components/IncidentResponder/DownloadAttachmentModal'
import { getNotifiedEmail } from '@/api/notifiedEmail'
import { getStoreValue, PROPERTY_STORE, INTEGRATION_TYPES } from '@/model/constants/commonConstants'
import PreviewHeaderForSinglePost from '@/components/ThreatSharing/PreviewHeaderForSinglePost'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import EmailDetailsContentDetails from '@/components/IncidentResponder/EmailDetails/EmailDetailsContentDetails'
import EmailDetailsPreviewFooter from '@/components/IncidentResponder/EmailDetails/EmailDetailsPreviewFooter'
import EmailDetailsAIAnalyze from '@/components/IncidentResponder/EmailDetails/EmailDetailsAIAnalyze'
import { getBtnStatusColor, scrollToComponent, copyToClipboard } from '@/utils/functions'
import EmailDetailsUrl from '@/components/IncidentResponder/EmailDetails/EmailDetailsUrl'
import labels from '@/model/constants/labels'
import KEmailPreview from '@/components/KEmailPreview'
export default {
  components: {
    KEmailPreview,
    EmailDetailsUrl,
    EmailDetailsPreviewFooter,
    EmailDetailsAIAnalyze,
    EmailDetailsContentDetails,
    DatatableLoading,
    PreviewHeaderForSinglePost,
    Datatable,
    DownloadModal,
    DownloadAttachmentModal,
    Badge
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data: () => ({
    INTEGRATION_TYPES,
    isPreviewRender: false,
    isLoading: true,
    aiAnalyzeLoading: false,
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
          props: {
            style: {
              maxWidth: '100px'
            }
          },
          width: 170
        },
        {
          property: PROPERTY_STORE.REASON,
          editable: false,
          label: labels.Reason,
          fixed: false,
          show: true,
          width: 200,
          type: 'text'
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
          label: getStoreValue(PROPERTY_STORE.FILEUPLOADED),
          show: true,
          type: 'text',
          fixed: false,
          emptyText: 'false',
          width: 150
        },
        {
          property: PROPERTY_STORE.DETAILS,
          align: 'left',
          label: getStoreValue(PROPERTY_STORE.DETAILS),
          show: true,
          fixed: false,
          type: 'slot',
          hideSort: true,
          minWidth: 150
        }
      ]
    },
    downloadModalStatus: false,
    downloadAttachmentModalStatus: false,
    selectedAttachment: null,
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
    tab: 'first',
    details: {},
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
        type: 'badge',
        props: {
          style: {
            maxWidth: '100px'
          }
        },
        hasTooltip: true
      }
    ],
    title: {
      icon: 'mdi-tab-unselected',
      title: 'Url Analysis',
      subTitle: ''
    },
    selectEvent: {
      clipboard: true,
      download: false
    }
  }),
  mounted() {
    this.getPostDetails()
  },
  methods: {
    getKeyValue(item) {
      const { key = '' } = item || { key: '' }
      return typeof key === 'string'
        ? key.substring(0, 1).toUpperCase() + key.substring(1, key.length)
        : ''
    },
    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    adjustScroll() {
      this.$nextTick(() => {
        scrollToComponent(document.getElementById('email-details--header'), {
          behavior: 'auto',
          block: 'start',
          inline: 'start'
        })
      })
    },
    isFileUploaded(attachments) {
      if (attachments) {
        const data = attachments.filter((item) => item.isSendFile)
        return !data.length
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
    handleAttachmentClick(index, id) {
      this.tab = 'fifth'
      this.panel.push(index)
      this.showSecondCollapse.push(index)
      this.$nextTick(() => {
        scrollToComponent(document.getElementById(id))
      })
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
      copyToClipboard(value).catch(() => {})
    },
    handleDownloadEmail() {
      this.downloadModalStatus = true
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
      this.selectedAttachment = attachment
      this.downloadAttachmentModalStatus = true
    },
    handleCloseDownloadAttachmentModal() {
      this.selectedAttachment = null
      this.downloadAttachmentModalStatus = false
    },
    getPostDetails() {
      this.isLoading = true
      getNotifiedEmail(this.id)
        .then((response) => {
          this.mailDetails = response.data.data
          this.attachmentTableOptions.tableData = this.mailDetails.attachments
          this.headersTable.data = this.mailDetails.headers
          this.relayTable.data = this.mailDetails.emailRelays
        })
        .finally(() => (this.isLoading = false))
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
              .contentWindow.document.querySelectorAll('[href="' + a.url + '"]')
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
    } else if (this.$route.query && this.$route.query.tab) {
      this.tab = this.$route.query.tab
    }
  },
  computed: {
    isMailDetailsHaveAttachments() {
      return this.mailDetails?.attachments?.length
    }
  },
  watch: {
    panel(val) {},
    tab(val) {
      val === 2 && this.setEmailPreview()
      if (val === 'third') {
        this.$nextTick(() => {
          const heightOfParent = getComputedStyle(
            document.querySelector('.single-post__container .el-tabs__content')
          ).height
          const heightOfItem = getComputedStyle(
            document.querySelector('#email-details-preview-content')
          ).height
          const heightOfParentNumber = Math.floor(Number(heightOfParent.replace('px', '')))
          const heightOfItemNumber = Math.floor(Number(heightOfItem.replace('px', '')))
          if (heightOfParentNumber - heightOfItemNumber > 300) {
            document.querySelector('#email-details-preview-content').style.height = `${
              heightOfParentNumber + 75
            }px`
            this.$nextTick(() => {
              const footer = document.querySelector('.single-post__container .preview-footer')
              if (footer) {
                footer.style.position = 'absolute'
                footer.style.bottom = '-8px'
              }
            })
          }
        })
      }
    }
  }
}
</script>
