<template>
  <div class="single-wrapper">
    <div class="single-post">
      <span class="single-post-header">Email Details - File Format Exploit</span>
      <v-expansion-panel-content eager class="expand-body member-company-body pa-0">
        <v-tabs v-model="tab" class="tab-bar">
          <v-tab id="expansion-details">Details</v-tab>
          <v-tab id="analysis-header">Header</v-tab>
          <v-tab id="expansion-preview">Email Preview</v-tab>
          <v-tab id="expansion-url">URLs</v-tab>
          <v-tab id="expansion-attachment">Attachments</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-if="mailDetails">
            <div class="details-content">
              <div class="details-content--item mb-12">
                <div class="details-content--item--key">
                  Analysis Date
                </div>
                <div class="details-content--item--value">
                  {{ mailDetails.analysisDate }}
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
                  From
                </div>
                <div class="details-content--item--value">
                  {{ mailDetails.from }}
                </div>
              </div>
              <div class="details-content--item">
                <div class="details-content--item--key">
                  Subject
                </div>
                <div class="details-content--item--value">
                  {{ mailDetails.subject }}
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
          </v-tab-item>
          <v-tab-item v-if="mailDetails">
            <el-table :data="mailDetails.headers" style="width: 100%;" :border="false">
              <el-table-column prop="key" width="200"> </el-table-column>
              <el-table-column prop="value"> </el-table-column>
            </el-table>
          </v-tab-item>
          <v-tab-item v-if="mailDetails">
            <k-shadow-frame id="sframe" v-bind:content="mailDetails.htmlBody" />
          </v-tab-item>
          <v-tab-item v-if="mailDetails">
            <div>
              <datatable
                id="urlAnalysisTable"
                ref="refUrlAnalysisTable"
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
                :isDownloadable="false"
              />
            </div>
          </v-tab-item>
          <v-tab-item v-if="mailDetails">
            <div
              class="attachment-analysis-item"
              v-for="(attachment, index) in mailDetails.attachments"
              :key="index"
            >
              <div class="ed-title">
                <div class="d-flex">
                  <p class="mr-6 attachment-name">Attachment Name</p>
                  <p class="mr-6 wrf">{{ attachment.name }}</p>
                  <a
                    :href="attachment.name"
                    v-if="attachment.downloadUrl"
                    class="mr-6 cursor-pointer download"
                  >
                    <v-icon color="#2196f3" class="selection-icons">mdi-download</v-icon>
                    Download file
                  </a>
                  <p
                    class="mr-6 cursor-pointer not-found"
                    v-if="isFileUploaded(mailDetails.attachments[index].analysisList)"
                  >
                    *This file was not uploaded to any integration
                  </p>
                </div>
              </div>
              <div class="flex-grow-1"></div>
              <div class="ed-header-btn-1 collapse-details">
                <v-expansion-panel-header
                  class="pa-0"
                  style="min-height: 36px;"
                  disable-icon-rotate
                >
                  <template v-slot:actions mandatory="true">
                    <v-btn
                      v-if="showSecondCollapse"
                      @click.native="showSecondCollapse = false"
                      outlined
                      rounded
                      medium
                      color="blue"
                      >COLLAPSE
                    </v-btn>
                    <v-btn
                      v-else
                      @click.native="showSecondCollapse = true"
                      outlined
                      rounded
                      medium
                      color="blue"
                      >EXPAND
                    </v-btn>
                  </template>
                </v-expansion-panel-header>
              </div>
              <v-expansion-panel-content
                v-if="showSecondCollapse"
                eager
                transition="scale-transition"
                class="pa-0 no-shadow"
              >
                <div class="details-content">
                  <div class="details-content--item mt-4">
                    <div class="details-content--item--key text-right">
                      SHA512
                    </div>
                    <div class="details-content--item--value">
                      {{ attachment.sha512 }}
                    </div>
                  </div>
                  <div class="details-content--item">
                    <div class="details-content--item--key text-right">
                      MD5
                    </div>
                    <div class="details-content--item--value">
                      {{ attachment.md5 }}
                    </div>
                  </div>
                  <div class="details-content--item">
                    <div class="details-content--item--key text-right">
                      Content Type
                    </div>
                    <div class="details-content--item--value">
                      {{ attachment.contentType }}
                    </div>
                  </div>
                  <div
                    class="details-content--item"
                    v-for="(analysis, ind) in attachment.analysisList"
                    :key="ind"
                  >
                    <div class="details-content--item--key text-right">
                      {{ analysis.analysisEngine }}
                    </div>
                    <div class="details-content--item--value">
                      <span
                        class="details-content--item--value--status"
                        :class="`details-content--item--value--status__${analysis.result}`"
                        >{{ analysis.result }}</span
                      >
                      <span class="details-content--item--value--icon">
                        <v-icon color="#757575" class="selection-icons" v-if="false"
                          >mdi-attachment</v-icon
                        >
                        <v-icon
                          :color="analysis.isSendFileHash ? '#757575' : '#e0e0e0'"
                          class="selection-icons"
                          >mdi-pound</v-icon
                        >
                        <v-icon
                          :color="analysis.isSendFile ? '#757575' : '#e0e0e0'"
                          class="selection-icons"
                          >mdi-file</v-icon
                        >
                      </span>
                      <a v-if="false">DETAILS</a>
                    </div>
                  </div>
                </div>
              </v-expansion-panel-content>
            </div>
            <div class="empty-attachment" v-if="!mailDetails.attachments.length">
              <h2>No Attachment</h2>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-expansion-panel-content>
    </div>
  </div>
</template>

<script>
import KShadowFrame from '../KShadowFrame'

Vue.customElement('k-shadow-frame', KShadowFrame, {
  shadow: true,
  shadowCss: `
 @import url('https://fonts.googleapis.com/css?family=Material+Icons');
 @import url('https://cdn.materialdesignicons.com/5.2.45/css/materialdesignicons.min.css');
 @import url('https://cdn.jsdelivr.net/npm/vuetify@2.2.29/dist/vuetify.min.css');
[data-title]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.5s;
    visibility: visible;
}
[data-title]:after {
    content: attr(data-title);
    position: absolute;
    padding: 5px 16px 5px 36px;
    bottom: -1.6em;
    left: 100%;
    white-space: nowrap;
    opacity: 0;
    z-index: 99999;
    visibility: hidden;
    border-radius: 4px;
    background: #6d6d6d !important;
    color: rgba(255, 255, 255, 0.87) !important;
    font-family: "Open Sans", sans-serif !important;
    font-size: 12px;
    text-decoration:none;
}
[data-title] {
    position: relative;
}
.malicious-style {

  color: #bb2a45 !important;
  text-decoration: underline !important;
}

.malicious-icon {
  margin: 4px;
  font-size: 18px !important;
  color: #bb2a45 !important;
  caret-color: #bb2a45 !important;
}

.red-malicious-alert {
  border: unset !important;
  border-color: transparent !important;
  border-bottom-color: transparent !important;
  border-image: none !important;
  border-image-width: 0 !important;
  color: #bb2a45 !important;
  caret-color: #bb2a45 !important;
  text-decoration: unset !important;
  text-decoration-color: transparent !important;
  font-size: 18px !important;
  margin-top: -2px;
  padding-right: 3px;
  height: 16px !important;
  overflow: hidden;
}

.red-malicious-alert::before {
  border: unset !important;
}
 `
})
import Datatable from '../../components/DataTable'
import { getNotifiedEmail, getAnalysisEngineTypes } from '../../api/notifiedEmail'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'

export default {
  components: {
    Datatable
  },
  props: {},
  data: () => ({
    mailDetails: null,
    showFirstCollapse: false,
    showSecondCollapse: false,
    expanded: false,
    commentOpened: false,
    isWantToShareIncident: false,
    isWantToInvestigate: false,
    isWantToPostIncident: false,
    tab: 2,
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
        type: 'text'
      },
      {
        property: 'result',
        align: 'center',
        editable: false,
        label: 'Status',
        fixed: false,
        sortable: false,
        show: true,
        type: 'detected',
        hasTooltip: true
      }
    ],
    title: {
      icon: 'mdi-tab-unselected',
      title: 'Url Analysis',
      subTitle: ''
    },
    pageSizes: [5, 10, 25, 50, 100],
    iEmpty: {
      message: 'No Data'
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
    getPostDetails() {
      getNotifiedEmail(this.$attrs.id)
        .then((response) => {
          this.mailDetails = response.data.data
          this.tableData = this.mailDetails.urls
          const urls = this.mailDetails.urls
          setTimeout(function () {
            for (let a of urls) {
              const els = document
                .getElementById('sframe')
                .shadowRoot.querySelectorAll('[href="' + a.url + '"]')
              for (let i = 0, l = els.length; i < l; i++) {
                const el = els[i]
                el.setAttribute('target', '_blank')
                el.setAttribute('data-title', 'This link has been reported as a phishing')
                /*if (!a.IsShow) {
                  if (!el.hasChildNodes()) {
                    el.innerHTML = 'hidden by owner'
                  } else {
                    el.lastChild.innerHTML = 'hidden by owner'
                  }
                  el.setAttribute('href', '#')
                }*/
                //if (a) {
                el.classList.add('malicious-style')
                const iEl = document.createElement('i')
                iEl.className +=
                  'red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light'
                el.appendChild(iEl)
                // }
              }
            }
          })
        }, 100)
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when gettin details!'
          })
        })
    },
    getEngineDetails() {
      getAnalysisEngineTypes()
        .then((response) => {
          const engineTypes = response.data.data
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
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting analysis engine types!'
          })
        })
    }
  }
}
</script>

<style lang="scss">
.single-wrapper {
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
    border-radius: 12px;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
    background-color: #ffffff;
    padding: 24px;
  }

  .single-post-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.6;
    letter-spacing: normal;
    color: #2196f3;
    margin-bottom: 40px;
    display: block;
  }
  .tab-bar {
    width: 100%;
    padding: 0;
    border-radius: 0 !important;
    margin-top: 24px;
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
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    background-color: #ffffff;
    padding: 26px;
    position: relative;
    &:first-child {
      margin-bottom: 16px;
    }
    p {
      margin-bottom: 0 !important;
    }
  }

  .v-application p {
    margin-bottom: 0;
  }

  .wrap-padding {
    padding: 28px !important;
  }

  .collapse-details {
    position: absolute;
    top: 19px;
    right: 24px;
  }

  .attachment-name {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-left: 24px;
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
        margin-bottom: 18px;
      }
      &--value {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
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
        height: 24px;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        min-width: 104px;
        margin-right: 24px;
        min-width: 125px;
        max-width: 125px;
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
    margin-top: 24px;
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
  }

  .v-btn--contained {
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
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

  .attach-found-malicious {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-top: 4px;
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
        width: 182px;
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

    .detail-black {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 4px !important;
    }

    .detail-red {
      color: rgba(219, 37, 37, 0.87) !important;
    }
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
      margin-top: 2px;
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
      font-family: 'Open Sans', sans-serif !important;
      font-weight: 400;
    }

    span:nth-child(2) {
      padding-top: 4px;
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

  .file-name {
    padding-left: 7px;
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
    color: #bb2a45 !important;
    text-decoration: underline !important;
  }

  .malicious-icon {
    font-size: 18px !important;
    color: #bb2a45 !important;
    caret-color: #bb2a45 !important;
  }

  .red-malicious-alert {
    border: unset !important;
    border-color: transparent !important;
    border-bottom-color: transparent !important;
    border-image: none !important;
    border-image-width: 0 !important;
    color: #bb2a45 !important;
    caret-color: #bb2a45 !important;
    text-decoration: unset !important;
    text-decoration-color: transparent !important;
    font-size: 18px !important;
    margin-top: -2px;
    padding-right: 3px;
    height: 16px !important;
    overflow: hidden;
  }

  .red-malicious-alert::before {
    border: unset !important;
  }

  .malicious-style {
    .red-malicious-alert:not(:first-child) {
      display: block !important;
    }
  }
}
</style>
