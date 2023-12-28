<template>
  <section>
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel
        v-for="(url, index) in mailDetails.urls"
        :key="url.resourceId"
        :id="`email-details-url-expansion-panel-${index}`"
        class="attachment-analysis-item"
      >
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="ed-title">
            <div class="d-flex" style="align-items: center;">
              <div
                :id="`text--incident-responder-email-details-url-${index}`"
                class="left-side d-flex align-center"
              >
                <p class="attachment-name mr-2" style="word-break: break-word;">{{ url.url }}</p>
                <p class="ml-6 not-found" v-if="isFileUploaded(url['analysisList'])">
                  *This file was not uploaded to any integration
                </p>
              </div>
            </div>
          </div>
          <div class="ed-header-btn-1 collapse-details d-flex align-center">
            <badge
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
              <template v-slot:actions>
                <v-btn
                  :id="`btn-details--email-details-url-${index}`"
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
                      scope.row.analysisEngineType !== INTEGRATION_TYPES.VIRUSTOTAL
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
    }
  },
  data() {
    return {
      INTEGRATION_TYPES,
      panel: [],
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
      if (event.target.textContent.startsWith('COLLAPSE')) {
        this.showSecondCollapse.splice(
          this.showSecondCollapse.findIndex((item) => item === index),
          1
        )
      } else {
        this.showSecondCollapse.push(index)
      }
    }
  }
}
</script>
