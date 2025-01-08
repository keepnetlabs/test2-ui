<template>
  <section
    :style="
      !insideURL
        ? { padding: '8px', marginLeft: '-8px', overflowY: 'hidden', overflowX: 'auto' }
        : ''
    "
  >
    <v-expansion-panels multiple v-model="panel" class="email-details-inside-url-expansions">
      <div v-if="insideURL" :class="getVerticalLineClasses"></div>
      <div v-for="(url, index) in mailDetails.urls" :key="url.resourceId" class="mr-1">
        <v-expansion-panel
          :id="`email-details-url-expansion-panel-${index}`"
          :class="['attachment-analysis-item', insideURL ? 'email-details-inside-url' : '']"
        >
          <div
            :class="[
              'email-details-inside-url__vertical-line',
              index === mailDetails.urls.length - 1
                ? 'email-details-inside-url__vertical-short-line'
                : ''
            ]"
          />
          <div
            v-if="insideURL"
            class="email-details-inside-url__badge"
            :style="recursiveIndex ? { left: '-120px' } : ''"
          >
            <badge
              :id="`badge--incident-responder-email-details-url-${index}`"
              class="email-details-inside-url__badge"
              outline
              :text="isMainItem ? `Main URL` : `Redirect URL #${recursiveIndex}`"
              size="small"
              class-name="mr-4 badge"
              color="#757575"
            />
          </div>
          <div
            v-if="insideURL && isLastItem"
            class="email-details-inside-url__removal-white"
            style=""
          ></div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="ed-title">
              <div class="d-flex" style="align-items: center;">
                <div
                  :id="`text--incident-responder-email-details-url-${index}`"
                  class="left-side d-flex align-center"
                >
                  <p class="attachment-name mr-2" style="word-break: break-word; min-width: 250px;">
                    {{ url.url }}
                  </p>
                  <p class="ml-6 not-found" v-if="isFileUploaded(url['analysisList'])">
                    *This file was not uploaded to any integration
                  </p>
                </div>
              </div>
            </div>
            <div class="ed-header-btn-1 collapse-details d-flex align-center">
              <badge
                v-if="isRedirectUrl(url)"
                outline
                size="small"
                class-name="mr-4 badge"
                color="#1173C1"
                text="Redirect URL"
                :id="`badge--incident-responder-email-details-url-${index}`"
              />
              <badge
                v-else
                size="small"
                class-name="mr-4 badge"
                :id="`badge--incident-responder-email-details-url-${index}`"
                :outline="false"
                :text="url.result"
                :color="getBtnStatusColor(url.result)"
              />
              <div
                @click="handleCopyUrl(url.url)"
                :id="`btn-copy--email-details-url-${index}`"
                class="cursor-pointer download"
                style="min-width: 120px; text-transform: uppercase; line-height: 1.2;"
              >
                <v-icon color="#2196f3" class="selection-icons">mdi-content-copy</v-icon>
                <span class="ml-2">Copy URL </span>
              </div>

              <v-expansion-panel-header class="pa-0" style="min-height: 36px;" disable-icon-rotate>
                <template #actions>
                  <v-btn
                    :id="`btn-details--email-details-url-${index}`"
                    outlined
                    rounded
                    class="panel-header-btn"
                    medium
                    color="blue"
                    @click.native="setSecondCollapse($event, index)"
                    >{{ getExpansionPanelHeaderText(url, index) }}
                  </v-btn>
                </template>
              </v-expansion-panel-header>
            </div>
          </div>
          <v-expansion-panel-content
            v-if="
              showSecondCollapse.findIndex((item) => item === index) > -1 && !isRedirectUrl(url)
            "
            :id="`expansion-panel-content-email-details-url-${index}`"
            transition="scale-transition"
            class="pa-0 no-shadow"
          >
            <div class="attachments-table">
              <data-table
                id="urlAnalysisTable"
                ref="refUrlAnalysisTable"
                filterable
                options
                :loading="isLoading"
                :table="url['analysisList']"
                :columns="columns"
                :empty="iEmpty"
                :selectEvent="selectEvent"
                :download-button="downloadButton"
                @refreshAction="$emit('get-post-details')"
              >
                <template v-slot:datatable-custom-column="{ scope, col }">
                  <span style="cursor: pointer;" v-if="col.property === 'analysisEnginePermalink'">
                    <a
                      v-if="
                        scope.row.analysisEnginePermalink &&
                        scope.row.result !== 'Excluded' &&
                        scope.row.analysisEngineType !== INTEGRATION_TYPES.VIRUSTOTAL &&
                        scope.row.analysisEngineType !== INTEGRATION_TYPES.OPSWAT
                      "
                      :id="`btn-see-details--email-details-url-${index}`"
                      :href="scope.row['analysisEnginePermalink']"
                      target="_blank"
                      class="attachments-table__link"
                      rel="noopener"
                      >See Details</a
                    >
                    <span v-else></span>
                  </span>
                  <span v-if="col.property === 'reason'">
                    <v-tooltip bottom v-if="scope.row['reasonDescription']">
                      <template #activator="{ on }">
                        <span v-on="on">{{ scope.row.reason }}</span>
                      </template>
                      <span>{{ scope.row['reasonDescription'] }}</span>
                    </v-tooltip>
                    <span v-else>
                      <span>{{ scope.row.reason }}</span></span
                    >
                  </span>
                </template>
              </data-table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <div
          v-if="showSecondCollapse.findIndex((item) => item === index) > -1 && isRedirectUrl(url)"
          class="email-details-url__content-recursive"
        >
          <email-details-url
            inside-u-r-l
            is-main-item
            :mailDetails="{ urls: getFirstItemURL(url) }"
            :is-loading="isLoading"
            @get-post-details="$emit('get-post-details')"
          />
          <div
            v-for="(redirectUrl, redirectURLIndex) in url.redirectUrls"
            :key="redirectUrl.resourceId"
          >
            <email-details-url
              inside-u-r-l
              :mailDetails="{ urls: [redirectUrl] }"
              :is-last-item="redirectUrl === url.redirectUrls[url.redirectUrls.length - 1]"
              :is-loading="isLoading"
              :recursiveIndex="redirectURLIndex + 1"
              @get-post-details="$emit('get-post-details')"
            />
          </div>
        </div>
      </div>
    </v-expansion-panels>
    <div class="empty-attachment" v-if="!mailDetails.urls.length">
      <h2>No URL to display</h2>
    </div>
  </section>
</template>

<script>
import Badge from '@/components/Badge'
import DataTable from '@/components/DataTable'
import { getStoreValue, PROPERTY_STORE, INTEGRATION_TYPES } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { getBtnStatusColor, copyToClipboard } from '@/utils/functions'
export default {
  name: 'EmailDetailsUrl',
  components: {
    Badge,
    DataTable
  },
  props: {
    mailDetails: {
      type: Object
    },
    isLoading: {
      type: Boolean
    },
    insideURL: {
      type: Boolean,
      default: false
    },
    recursiveIndex: {
      type: Number,
      default: 0
    },
    parentHeight: {
      type: Number,
      default: 0
    },
    isMainItem: {
      type: Boolean,
      default: false
    },
    isLastItem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      INTEGRATION_TYPES,
      panel: [],
      redirectURLIndex: 0,
      showSecondCollapse: [],
      iEmpty: {
        message: labels.EmptyUrl
      },
      selectEvent: {
        clipboard: true,
        download: false
      },
      downloadButton: { show: false, disabled: false },
      columns: [
        // Should be defined to show the table
        {
          property: PROPERTY_STORE.ANALYSISENGINE,
          align: 'left',
          editable: false,
          label: labels.IntegrationName,
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          width: 400
        },
        {
          property: PROPERTY_STORE.RESULT,
          align: 'center',
          editable: false,
          label: labels.Result,
          fixed: false,
          sortable: false,
          show: true,
          maxWidth: 170,
          type: 'badge',
          props: {
            style: {
              maxWidth: '130px'
            }
          },
          hasTooltip: true
        },
        {
          property: PROPERTY_STORE.REASON,
          editable: false,
          label: labels.Reason,
          fixed: false,
          show: true,
          width: 200,
          type: 'slot'
        },
        {
          property: 'analysisEnginePermalink',
          align: 'left',
          label: getStoreValue(PROPERTY_STORE.DETAILS),
          show: true,
          fixed: false,
          type: 'slot',
          hideSort: true,
          unSearchable: true
        }
      ],
      tableData: []
    }
  },
  computed: {
    getVerticalLineClasses() {
      const isLastUrlOpen =
        this.showSecondCollapse.findIndex((item) => item === this.mailDetails.urls.length - 1) > -1
      return [
        'email-details-inside-url-vertical-line',
        isLastUrlOpen ? 'email-details-inside-url-vertical-line-last-index--open' : ''
      ]
    }
  },
  methods: {
    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    isFileUploaded(analysisList = []) {
      if (!analysisList) {
        return
      }
      return analysisList.some((item) => item.isSendFile || item.isSendFileHash)
    },
    handleCopyUrl(url = '') {
      copyToClipboard(url)
    },
    setSecondCollapse(event, index) {
      const { textContent } = event.target
      if (textContent.startsWith('COLLAPSE') || textContent.startsWith('HIDE')) {
        this.showSecondCollapse.splice(
          this.showSecondCollapse.findIndex((item) => item === index),
          1
        )
      } else {
        this.showSecondCollapse.push(index)
      }
    },
    isRedirectUrl(url) {
      return url?.redirectUrls?.length
    },
    getExpansionPanelHeaderText(url, index = 0) {
      const isRedirectUrl = this.isRedirectUrl(url)
      const defaultText = isRedirectUrl ? 'SHOW REDIRECT URL' : 'DETAILS'
      const collapseText = isRedirectUrl ? 'HIDE REDIRECT URL' : 'COLLAPSE'
      return this.showSecondCollapse.findIndex((item) => item === index) > -1
        ? collapseText
        : defaultText
    },
    getFirstItemURL(url) {
      const copyOfUrls = JSON.parse(JSON.stringify(url))
      copyOfUrls.redirectUrls = []
      return [copyOfUrls]
    }
  }
}
</script>
