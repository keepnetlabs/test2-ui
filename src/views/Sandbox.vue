<template>
  <div class="sandbox">
    <div class="incident-responder-parent">
      <div class="incident-responder">
        <div class="pa-2">
          <div class="search-wrapper">
            <div class="w-100">
              <v-select
                :items="companyItem"
                :placeholder="'Select a company'"
                outlined
                class="edit-select"
                max-width="100"
                v-model="companyValue"
                multiple
                hide-details
                clearable
                item-text="clientName"
                :menu-props="{ offsetY: true }"
                item-value="resourceId"
                :disabled="incidentLoading"
                id="sandbox-company-select"
                @change="changeCompanyData"
              />
            </div>
            <div class="w-100">
              <k-select
                v-model.trim="analysisEngineTypeResourceId"
                id="input--integration-type"
                class="edit-select"
                :items="integrationTypesEnum"
                multiple
                dense
                item-text="name"
                item-value="name"
                outlined
                placeholder="Select integration type"
                persistent-hint
                @change="changeEngineType"
                clearable
              ></k-select>
            </div>
            <div class="d-flex p-relative w-100">
              <k-select
                v-model.trim="filteredDateValueSelect"
                id="input--date-picker-select-integration-type"
                class="edit-select"
                :items="filteredDateValueSelectValues"
                dense
                item-text="name"
                item-value="value"
                outlined
                placeholder="Select a date"
                persistent-hint
                @input="changeDateValueSelect('constant')"
                return-object
                @click:clear="filteredDateValueSelect = { name: 'All Time', value: '' }"
              ></k-select>
              <div
                v-if="filteredDateValueSelect.value === 'custom' && menuOpen"
                class="absolute-date-filter"
                id="input--date-picker-select-main-div"
                @blur="changeBlurValue($event)"
                tabindex="1"
                :style="filteredSelectValueDate === 'between' ? 'width: 400px' : ''"
              >
                <v-select
                  :items="dateFilterItems"
                  id="focus-date"
                  dense
                  height="40"
                  outlined
                  required
                  v-model="filteredSelectValueDate"
                  :menu-props="{ offsetY: true }"
                  placeholder="Select an option"
                  :key="$store.state.auth.user.userCompany.timeZone"
                  @blur="changeBlurValue($event)"
                ></v-select>
                <InputDate
                  v-if="filteredSelectValueDate === 'between'"
                  popper-class="sandbox__date-picker"
                  v-model="filteredDateValueRange"
                  ref="refPicker2"
                  type="datetimerange"
                  @change="handleChangeBetweenDatepicker"
                />
                <InputDate
                  v-if="filteredSelectValueDate !== 'between'"
                  v-model="filteredDateValue"
                  popper-class="sandbox__date-picker"
                  type="datetime"
                  ref="refPicker"
                  style="width: 100%; max-width: 260px; margin-bottom: 14px;"
                  @change="changeDateValue"
                  @blur="changeBlurValue($event)"
                />

                <div class="filter__footer" tabindex="2" @blur="changeBlurValue($event)">
                  <v-btn text class="filter__footer-button" color="#f56c6c" @click="clearFilter">
                    Clear
                  </v-btn>
                  <v-btn
                    :disabled="getFilterButtonDisabled"
                    text
                    class="filter__footer-button"
                    color="#2196f3"
                    @click="handleFilter"
                  >
                    Filter
                  </v-btn>
                </div>
              </div>
            </div>
            <div>
              <v-menu
                v-model="menuModel"
                bottom
                offset-y
                nudge-bottom="12"
                content-class="filter-options__menu-content"
                class="filter-options__menu"
              >
                <template #activator="{ on }">
                  <div
                    v-on="on"
                    :class="['filter-options', { 'filter-options--menu-active': menuModel }]"
                  >
                    <v-icon
                      :class="[
                        'filter-options__icon',
                        {
                          'filter-options--active-filter':
                            (companyValue && companyValue.length) ||
                            (analysisEngineTypeResourceId && analysisEngineTypeResourceId.length) ||
                            (filteredDateValueSelect && filteredDateValueSelect.value)
                        }
                      ]"
                      >mdi-filter-variant</v-icon
                    >
                    <span
                      :class="[
                        'filter-options__text',
                        {
                          'filter-options--active':
                            (companyValue && companyValue.length) ||
                            (analysisEngineTypeResourceId && analysisEngineTypeResourceId.length) ||
                            (filteredDateValueSelect && filteredDateValueSelect.value)
                        }
                      ]"
                      >Filtering Options</span
                    >
                  </div>
                </template>
                <v-list>
                  <v-list-item
                    @click="handleListItemClick(item)"
                    :key="item"
                    v-for="item in listItems"
                  >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
        <div class="columns-row">
          <CardLoading
            :loading="incidentLoading"
            class="dashboard-cards__skeleton-loading"
            :class="[incidentLoading && 'dashboard-cards-loading']"
          >
            <template v-slot:skeleton-content>
              <div
                id="card--incident-responder-phishing-reporter"
                class="dashboard-cards phishing-reporter mr-2"
              >
                <div class="card-header">
                  <span class="head">Total Analysis Request</span>
                </div>
                <div class="columns-row__body">
                  <div class="card-body">
                    <div
                      class="biggest"
                      id="card--incident-responder-phishing-reporter-online-users-count"
                    >
                      {{ summaryData.totalAnalysisRequest || 0 }}
                    </div>
                  </div>
                  <div
                    class="card-footer"
                    id="card--incident-responder-phishing-reporter-total-users-count"
                  >
                    from
                    {{ summaryData.clientCount || 0 }}
                    clients
                  </div>
                </div>
                <div class="bg-image" style="bottom: 10px; right: -11px;">
                  <img src="../assets/img/ic_warning.png" />
                </div>
              </div>
            </template>
          </CardLoading>
          <CardLoading
            :loading="incidentLoading"
            class="dashboard-cards__skeleton-loading"
            :class="[incidentLoading && 'dashboard-cards-loading']"
          >
            <template v-slot:skeleton-content>
              <div
                id="card--incident-responder-incident-analysis"
                class="dashboard-cards incident-analysis mr-2"
              >
                <div class="card-header">
                  <span class="head">Found Phishing</span>
                </div>
                <div class="columns-row__body">
                  <div class="card-body">
                    <div
                      class="biggest"
                      id="card--incident-responder-incident-analysis-notified-harmful-count"
                    >
                      {{ summaryData.totalHarmfulUrl || 0 }}
                    </div>
                  </div>
                  <div
                    class="card-footer"
                    id="card--incident-responder-incident-analysis-reported-mail-count"
                  >
                    of
                    {{ summaryData.totalAnalyzedUrl || 0 }}
                    analysed URLs
                  </div>
                </div>
                <div class="bg-image">
                  <img src="../assets/img/hook.png" />
                </div>
              </div>
            </template>
          </CardLoading>
          <CardLoading
            :loading="incidentLoading"
            class="dashboard-cards__skeleton-loading"
            :class="[incidentLoading && 'dashboard-cards-loading']"
          >
            <template v-slot:skeleton-content>
              <div
                id="card--incident-responder-investigations"
                class="dashboard-cards investigations mr-2"
              >
                <div class="card-header">
                  <span class="head">Found Malicious</span>
                </div>
                <div class="columns-row__body">
                  <div class="card-body">
                    <div
                      class="biggest"
                      id="card--incident-responder-incident-analysis-notified-harmful-count2"
                    >
                      {{ summaryData.totalHarmfulAttachment || 0 }}
                    </div>
                  </div>
                  <div
                    class="card-footer"
                    id="card--incident-responder-incident-analysis-reported-mail-count3"
                  >
                    of
                    {{ summaryData.totalAnalyzedAttachment || 0 }}
                    analysed files
                  </div>
                </div>
                <div class="bg-image">
                  <img src="../assets/img/bug.png" />
                </div>
              </div>
            </template>
          </CardLoading>
          <CardLoading
            :loading="incidentLoading"
            class="dashboard-cards__skeleton-loading"
            :class="[incidentLoading && 'dashboard-cards-loading']"
          >
            <template v-slot:skeleton-content>
              <div id="card--incident-responder-roi-summary" class="dashboard-cards roi-summary">
                <div class="card-header">
                  <span class="head">Undetected</span>
                </div>
                <div class="columns-row__body">
                  <div class="card-body">
                    <div
                      class="biggest"
                      id="card--incident-responder-incident-analysis-notified-harmful-count11"
                    >
                      {{ summaryData.totalUndetected || 0 }}
                    </div>
                  </div>
                  <div
                    class="card-footer"
                    id="card--incident-responder-incident-analysis-reported-mail-count12"
                  >
                    of
                    {{ summaryData.totalAnalysisRequest || 0 }}
                    analysed emails
                  </div>
                </div>
                <div class="bg-image">
                  <img src="../assets/img/circle.png" />
                </div>
              </div>
            </template>
          </CardLoading>
        </div>
        <v-tabs id="tab-sandbox" v-model="tab" background-color="white" color="basil">
          <v-tab id="tab-stats">Stats</v-tab>
          <v-tab id="tab-logs">Logs</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="component-threat-sharing__tabs">
          <v-tab-item>
            <div class="mt-4 pa-2">
              <v-card>
                <div class="header">
                  <div class="title">
                    <h2>
                      Stats
                    </h2>
                    <p class="">
                      Generic statistics for client and service providers
                    </p>
                  </div>
                </div>
                <SandboxStats ref="sandboxStats" />
              </v-card>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="mt-4 pa-2">
              <v-card>
                <div class="header">
                  <div class="title">
                    <h2>
                      Logs
                    </h2>
                    <p class="">
                      All actions and results from client requests
                    </p>
                  </div>
                </div>
                <SandboxLog ref="sandboxLog" />
              </v-card>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import { checkPermission, getTimeZoneForMoment } from '@/utils/functions'
import CardLoading from '../components/SkeletonLoading/CardLoading'
import labels from '@/model/constants/labels'
import { getSandboxSummaryData } from '@/api/sandbox'
import SandboxLog from '@/components/Sandbox/SandboxLog'
import SandboxStats from '@/components/Sandbox/SandboxStats'
import { getCompanyListForThreatSharing, getMyCompanies } from '@/api/company'
import InputDate from '@/components/Common/Inputs/InputDate'
import KSelect from '@/components/Common/Inputs/KSelect'
import { getIntegrationTypes } from '@/api/integrations'
import {
  COMMON_CONSTANTS,
  INTEGRATION_LABELS,
  INTEGRATION_TYPES
} from '@/model/constants/commonConstants'
import { searchRestApi } from '@/api/restApi'

export default {
  name: 'Sandbox',
  components: {
    CardLoading,
    SandboxLog,
    SandboxStats,
    InputDate,
    KSelect
  },
  data() {
    return {
      getFilterButtonDisabled: false,
      incidentLoading: true,
      labels,
      search: null,
      tab: 0,
      summaryOptions: {
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  Value: '',
                  FieldName: 'AnalysisEngineTypeId',
                  Operator: 'Include'
                },
                {
                  Value: '',
                  FieldName: 'ClientResourceId',
                  Operator: 'Include'
                },
                {
                  FieldName: 'CreateTime',
                  Operator: '>=',
                  Value: ''
                }
              ],
              FilterGroups: []
            }
          ]
        }
      },
      summaryData: {},
      companyValue: '',
      companyItem: [],
      filteredDateValue: null,
      filteredDateValueRange: null,
      filteredDateValueSelect: { name: 'All Time', value: '' },
      menuOpen: false,
      filteredDateValueSelectValues: [
        { name: 'All time', value: '' },
        {
          name: 'Yesterday',
          value: this.$moment(Date.now()).subtract(1, 'day').format(getTimeZoneForMoment())
        },
        {
          name: 'Last Week',
          value: this.$moment(Date.now()).subtract(7, 'days').format(getTimeZoneForMoment())
        },
        {
          name: 'Last Month',
          value: this.$moment(Date.now()).subtract(1, 'month').format(getTimeZoneForMoment())
        },
        {
          name: 'Last 30 days',
          value: this.$moment(Date.now()).subtract(29, 'days').format(getTimeZoneForMoment())
        },
        { name: 'Custom', value: 'custom' }
      ],
      analysisEngineTypeResourceId: null,
      integrationTypes: [],
      menuModel: false,
      listItems: [...COMMON_CONSTANTS.FILTER_OPTIONS],
      isActive: false,

      filterableOptions: {
        default() {
          return { exactDate: true, after: true, before: true, between: true, showSelect: true }
        }
      },
      dateFilterItems: [
        { text: 'After', value: '>=' },
        { text: 'Before', value: '<=' },
        { text: 'Between', value: 'between' }
      ],
      filteredSelectValueDate: '>=',
      integrationTypesEnum: [
        { name: 'VirusTotal', value: 1 },
        { name: 'FortiNet', value: 2 },
        { name: 'Vmray', value: 3 },
        { name: 'Ibm X-Force', value: 4 },
        { name: 'SpamHouseZen', value: 5 },
        { name: 'GoogleSafeBrowser', value: 6 },
        { name: 'Cross Company Integration', value: 7 }
      ],
      scanTypesEnum: [
        { name: 'Url', value: 1 },
        { name: 'Attachment', value: 2 },
        { name: 'Ip', value: 3 },
        { name: 'Hash', value: 4 }
      ]
    }
  },
  created() {
    if (localStorage.getItem('sandboxCompany'))
      this.companyValue = localStorage.getItem('sandboxCompany').split(',') || ''
    if (localStorage.getItem('sandboxIntegration'))
      this.analysisEngineTypeResourceId =
        localStorage.getItem('sandboxIntegration').split(',') || ''
    //this.filteredDateValueSelect = localStorage.getItem('sandboxDate') //select
    if (localStorage.getItem('sandboxDateValue'))
      this.filteredSelectValueDate = localStorage.getItem('sandboxDateFormat')
    if (localStorage.getItem('sandboxDateValue'))
      this.filteredDateValueSelect = {
        name: localStorage.getItem('sandboxDateOption'),
        value: 'custom'
      }
    let dateValue = localStorage.getItem('sandboxDateOption')
    //localStorage.setItem('sandboxFilteredSelectValueDate', this.filteredSelectValueDate) //between
    if (this.filteredSelectValueDate === 'between') {
      this.filteredDateValueRange = dateValue.split(',')
    } else {
      this.filteredDateValue = dateValue
    }

    this.getSummaryData()
    const payload = {
      pageNumber: 1,
      pageSize: 1000000,
      orderBy: 'CreateTime',
      ascending: false,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          { Condition: 'AND', FilterItems: [], FilterGroups: [] },
          { Condition: 'OR', FilterItems: [], FilterGroups: [] }
        ]
      }
    }
    searchRestApi(payload).then((response) => (this.companyItem = response.data.data.results))
    if (
      this.companyValue ||
      this.analysisEngineTypeResourceId ||
      this.filteredDateValueSelect.value
    ) {
      setTimeout(() => {
        this.handleFilter()
      }, 250)
    }
  },
  methods: {
    setFilterOptions() {
      if (this.companyValue) localStorage.setItem('sandboxCompany', this.companyValue.toString())
      if (this.analysisEngineTypeResourceId)
        localStorage.setItem('sandboxIntegration', this.analysisEngineTypeResourceId.toString())
      if (this.filteredDateValueSelect.value)
        localStorage.setItem('sandboxDateValue', this.filteredDateValueSelect.value)
      if (this.filteredDateValueSelect.value)
        localStorage.setItem('sandboxDateFormat', this.filteredSelectValueDate)
      if (this.filteredDateValueSelect.value) {
        localStorage.setItem(
          'sandboxDateOption',
          this.filteredSelectValueDate !== 'between'
            ? this.filteredDateValue || this.filteredDateValueSelect.value
            : [this.filteredDateValueRange[0], this.filteredDateValueRange[1]]
        )
      }
    },
    handleListItemClick(value) {
      switch (value) {
        case 'Set as default filter':
          this.setFilterOptions()
          break
        case 'Restore default filter':
          if (localStorage.getItem('sandboxCompany'))
            this.companyValue = localStorage.getItem('sandboxCompany').split(',') || ''
          if (localStorage.getItem('sandboxIntegration'))
            this.analysisEngineTypeResourceId =
              localStorage.getItem('sandboxIntegration').split(',') || ''
          //this.filteredDateValueSelect = localStorage.getItem('sandboxDate') //select
          if (localStorage.getItem('sandboxDateValue'))
            this.filteredSelectValueDate = localStorage.getItem('sandboxDateFormat')
          if (localStorage.getItem('sandboxDateValue'))
            this.filteredDateValueSelect = {
              name: localStorage.getItem('sandboxDateOption'),
              value: 'custom'
            }
          let dateValue = localStorage.getItem('sandboxDateOption')
          //localStorage.setItem('sandboxFilteredSelectValueDate', this.filteredSelectValueDate) //between
          if (this.filteredSelectValueDate === 'between') {
            this.filteredDateValueRange = dateValue.split(',')
          } else {
            this.filteredDateValue = dateValue
          }
          this.handleFilter()
          break
        case 'Clear filters':
          localStorage.removeItem('sandboxCompany')
          localStorage.removeItem('sandboxIntegration')
          localStorage.removeItem('sandboxDate')
          localStorage.removeItem('sandboxDateOption')
          localStorage.removeItem('sandboxCompany')
          localStorage.removeItem('sandboxIntegration')
          localStorage.removeItem('sandboxDateFormat')
          localStorage.removeItem('sandboxDateOption')
          localStorage.removeItem('sandboxFilteredSelectValueDate')
          break
      }
    },
    clearFilter() {
      this.menuOpen = false
      this.filteredDateValueSelect = { name: 'All Time', value: '' }
    },
    handleFilter() {
      let value =
        this.filteredSelectValueDate !== 'between'
          ? this.filteredDateValue || this.filteredDateValueSelect.value
          : [this.filteredDateValueRange[0], this.filteredDateValueRange[1]]
      if (this.filteredDateValueSelect.value === 'custom')
        this.filteredDateValueSelectValues[5].name = value
      this.menuOpen = false
      if (this.filteredSelectValueDate === 'between') {
        this.summaryOptions = {
          filter: {
            Condition: 'AND',
            FilterGroups: [
              {
                Condition: 'AND',
                FilterItems: [
                  {
                    Value: this.analysisEngineTypeResourceId
                      ? this.analysisEngineTypeResourceId.toString()
                      : '',
                    FieldName: 'AnalysisEngineTypeId',
                    Operator: 'Include'
                  },
                  {
                    Value: this.companyValue ? this.companyValue.toString() : '',
                    FieldName: 'ClientResourceId',
                    Operator: 'Include'
                  },
                  {
                    FieldName: 'CreateTime',
                    Operator: '>=',
                    Value: value[0]
                  },
                  {
                    FieldName: 'CreateTime',
                    Operator: '<=',
                    Value: value[1]
                  }
                ],
                FilterGroups: []
              }
            ]
          }
        }
      } else {
        this.summaryOptions = {
          filter: {
            Condition: 'AND',
            FilterGroups: [
              {
                Condition: 'AND',
                FilterItems: [
                  {
                    Value: this.analysisEngineTypeResourceId
                      ? this.analysisEngineTypeResourceId.toString()
                      : '',
                    FieldName: 'AnalysisEngineTypeId',
                    Operator: 'Include'
                  },
                  {
                    Value: this.companyValue ? this.companyValue.toString() : '',
                    FieldName: 'ClientResourceId',
                    Operator: 'Include'
                  },
                  {
                    FieldName: 'CreateTime',
                    Operator: this.filteredSelectValueDate,
                    Value: value
                  }
                ],
                FilterGroups: []
              }
            ]
          }
        }
      }

      const dateFilterValueForTables =
        this.filteredSelectValueDate === 'between'
          ? [
              {
                FieldName: 'CreateTime',
                Operator: '>=',
                Value: value[0]
              },
              {
                FieldName: 'CreateTime',
                Operator: '<=',
                Value: value[1]
              }
            ]
          : {
              FieldName: 'CreateTime',
              Operator: this.filteredSelectValueDate,
              Value: value
            }

      this.$refs?.sandboxLog?.getDatatableListWhenFilterChange(
        this.companyValue ? this.companyValue.toString() : '',
        this.analysisEngineTypeResourceId
          ? this.analysisEngineTypeResourceId
              .map((engineTypeValue) => {
                return this.integrationTypesEnum.find((item) => item.name === engineTypeValue).value
              })
              .toString()
          : '',
        dateFilterValueForTables
      )
      this.$refs?.sandboxStats?.getDatatableListWhenFilterChange(
        this.companyValue ? this.companyValue.toString() : '',
        this.analysisEngineTypeResourceId
          ? this.analysisEngineTypeResourceId
              .map((engineTypeValue) => {
                return this.integrationTypesEnum.find((item) => item.name === engineTypeValue).value
              })
              .toString()
          : '',
        dateFilterValueForTables
      )

      this.getSummaryData()
    },
    changeBlurValue(e) {
      if (e.currentPlacement !== 'bottom-start') this.menuOpen = !!e.relatedTarget
    },
    changeDateValueSelect(isConstant) {
      if (!!isConstant) {
        this.filteredDateValue = null
        this.filteredDateValueRange = []
      }
      if (this.filteredDateValueSelect.value === 'custom') {
        this.menuOpen = true
        setTimeout(() => {
          document.getElementById('focus-date').focus()
        }, 200)
        return false
      } else {
        this.filteredSelectValueDate = '>='
        this.filteredDateValueSelectValues[5].name = 'Custom'
      }

      this.$set(
        this.summaryOptions.filter.FilterGroups[0].FilterItems[2],
        'Value',
        this.filteredDateValueSelect.value || ''
      )

      this.handleFilter()
    },
    handleChangeBetweenDatepicker() {},
    changeDateValue() {
      if (this.menuOpen) return false
      this.$set(
        this.summaryOptions.filter.FilterGroups[0].FilterItems[2],
        'Value',
        this.filteredDateValue || ''
      )
      this.getSummaryData()
    },
    changeCompanyData() {
      this.$set(
        this.summaryOptions.filter.FilterGroups[0].FilterItems[1],
        'Value',
        this.companyValue.toString() || ''
      )
      this.$refs?.sandboxLog?.getDatatableListWhenFilterChange(
        this.companyValue.toString(),
        this.analysisEngineTypeResourceId
          ? this.analysisEngineTypeResourceId
              .map((engineTypeValue) => {
                return this.integrationTypesEnum.find((item) => item.name === engineTypeValue).value
              })
              .toString()
          : '',
        this.filteredSelectValueDate !== 'between'
          ? this.filteredDateValue || this.filteredDateValueSelect.value
          : [this.filteredDateValueRange[0], this.filteredDateValueRange[1]]
      )
      this.$refs?.sandboxStats?.getDatatableListWhenFilterChange(
        this.companyValue.toString(),
        this.analysisEngineTypeResourceId
          ? this.analysisEngineTypeResourceId
              .map((engineTypeValue) => {
                return this.integrationTypesEnum.find((item) => item.name === engineTypeValue).value
              })
              .toString()
          : '',
        this.filteredSelectValueDate !== 'between'
          ? this.filteredDateValue || this.filteredDateValueSelect.value
          : [this.filteredDateValueRange[0], this.filteredDateValueRange[1]]
      )
      this.getSummaryData()
    },
    changeEngineType() {
      this.$set(
        this.summaryOptions.filter.FilterGroups[0].FilterItems[0],
        'Value',
        this.analysisEngineTypeResourceId.toString() || ''
      )
      this.$refs?.sandboxLog?.getDatatableListWhenFilterChange(
        this.companyValue.toString(),
        this.analysisEngineTypeResourceId
          ? this.analysisEngineTypeResourceId
              .map((engineTypeValue) => {
                return this.integrationTypesEnum.find((item) => item.name === engineTypeValue).value
              })
              .toString()
          : '',
        this.filteredSelectValueDate !== 'between'
          ? this.filteredDateValue || this.filteredDateValueSelect.value
          : [this.filteredDateValueRange[0], this.filteredDateValueRange[1]]
      )
      this.$refs?.sandboxStats?.getDatatableListWhenFilterChange(
        this.companyValue.toString(),
        this.analysisEngineTypeResourceId
          ? this.analysisEngineTypeResourceId
              .map((engineTypeValue) => {
                return this.integrationTypesEnum.find((item) => item.name === engineTypeValue).value
              })
              .toString()
          : '',
        this.filteredSelectValueDate !== 'between'
          ? this.filteredDateValue || this.filteredDateValueSelect.value
          : [this.filteredDateValueRange[0], this.filteredDateValueRange[1]]
      )
      this.getSummaryData()
    },
    getFriendlyName(name) {
      let label
      switch (name) {
        case INTEGRATION_TYPES.FORTINET:
          label = INTEGRATION_LABELS.FORTINET
          break
        case INTEGRATION_TYPES.VIRUSTOTAL:
          label = INTEGRATION_LABELS.VIRUSTOTAL
          break
        case INTEGRATION_TYPES.VMRAY:
          label = INTEGRATION_LABELS.VMRAY
          break
        case INTEGRATION_TYPES.IBMXFORCE:
          label = INTEGRATION_LABELS.IBMXFORCE
          break
        default:
          return
      }
      return label
    },
    getSummaryData() {
      this.incidentLoading = true
      getSandboxSummaryData(this.summaryOptions)
        .then((response) => {
          this.summaryData = response.data.data[0]
        })
        .finally(() => {
          this.incidentLoading = false
        })
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    }
  }
}
</script>

<style lang="scss">
.sandbox {
  .k-table__wrapper .card {
    box-shadow: none !important;
    padding: 0px !important;
  }
  .v-card {
    border-radius: 12px;
    box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
    padding: 24px;
    padding-bottom: 0;
    width: 100%;

    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .title {
        width: 65%;

        h2 {
          font-family: 'Open Sans', sans-serif;
          font-size: 20px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.15;
          letter-spacing: normal;
          color: #2196f3;
        }

        p {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
        }
      }

      .action {
        display: flex;

        .btn-action {
          background-color: #2196f3 !important;
          color: #fff;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.71;
          letter-spacing: normal;
          padding: 0 !important;
          height: 36px !important;
          border-radius: 18px;
          box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);

          i {
            font-size: 19px !important;
          }
        }
      }
    }
  }
  .filter-options {
    width: 150px;
  }
  .absolute-date-filter {
    position: absolute;
    top: 68px;
    background: white;
    width: 251px;
    padding: 15px;
    z-index: 9;
    border-radius: 8px;
    box-shadow: 0px 1px 10px 0px rgb(0 0 0 / 20%), 0px 0px 0px 0px rgb(0 0 0 / 14%),
      0px 0px 0px 0px rgb(0 0 0 / 12%) !important;
  }
  .incident-analysis {
    background: #f56c6c;
  }
  .roi-summary {
    background: #1173c1;
  }
  .dashboard-cards-loading {
    height: 150px;
  }
  .search-wrapper {
    background: #ffffff;
    border-radius: 8px;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 4px 8px;
    margin-right: 0px;
    padding: 8px 12px;
    .edit-select {
      .v-text-field__details {
        display: none;
      }
    }
    .el-date-editor {
      margin-bottom: 0 !important;
    }

    > div {
      padding-right: 10px;
    }

    .filter-icon {
      color: rgba(0, 0, 0, 0.34) !important;
      cursor: pointer;
    }
  }
  .filter {
    &__icon {
      float: right;
      font-size: 20px;
      order: 1;
      margin-top: 7px;
    }
    &__body-container {
      background-color: white;
      padding: 20px 20px 0 20px;
      position: relative;
    }
    &__footer {
      display: flex;
      margin-right: -13px;
      justify-content: flex-end;
      position: sticky;
      bottom: 0;
      padding-bottom: 0 !important;

      &-button {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        letter-spacing: normal;
      }
    }

    &__text {
      margin-top: -13px;
    }

    &__textfield {
      border-radius: 8px;
      border: solid 1px rgba(0, 0, 0, 0.16);
      background-color: #ffffff;
    }

    &__footer {
      background: #fff;
      padding: 10px 0;
    }
  }
  .incident-responder-parent {
    .incident-responder {
      ::v-deep .edit-labels {
        font-size: 20px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.2;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }

      padding: 0 8px;
      margin-top: 3px;
      padding-bottom: 35px;

      .no-data {
        &__opacity-blue {
          background-color: #5c7f9b;
        }

        &__opacity-red {
          background-color: #9b7879 !important;
        }

        &__opacity-green {
          background-color: #668267 !important;
        }
      }

      .btn-playbook {
        &__no-data {
          border-radius: 18px;
          background-color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.71;
          letter-spacing: normal;
          color: #2196f3;
          height: 36px;
        }
      }
    }

    &__link {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.29;
      letter-spacing: normal;
      color: #2196f3;
      cursor: pointer;
    }

    .columns-row__body {
      margin-top: 16px;
    }

    .columns-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      @media only screen and (max-width: 1023px) {
        flex-wrap: wrap;

        .dashboard-cards__skeleton-loading {
          width: calc(50%) !important;
          max-width: calc(50%) !important;
        }
      }
      @media only screen and (max-width: 500px) {
        .dashboard-cards__skeleton-loading {
          width: calc(100%) !important;
          max-width: calc(100%) !important;
        }
      }

      .dashboard-cards {
        min-height: 150px;
        max-height: 150px;
        border-radius: 8px;
        margin: 8px;
        padding: 16px;
        position: relative;
        overflow: hidden;

        &__skeleton-loading {
          width: 25%;
          min-height: 150px;
          border-radius: 8px;
          position: relative;
        }

        .card-header {
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;

          .head {
            color: #fff;
            font-size: 20px;
            font-weight: 600;
            //line-height: 1.15;
            letter-spacing: normal;
          }

          a {
            text-decoration: none !important;
          }

          i {
            font-size: 24px !important;
          }
        }

        .card-body {
          //font-size: 48px;
          font-weight: normal;
          line-height: 1.13;
          letter-spacing: normal;
          color: #fff;

          span {
            font-size: 20px;
          }

          .biggest {
            font-size: 44px;
            line-height: 1;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
          }

          .body-row {
            display: flex;
            flex-direction: column;
          }

          .body-row:first-child {
            //width: 100%;
          }

          .body-row__number {
            font-size: 44px;
            line-height: 1;
            letter-spacing: normal;
            color: #ffffff;
          }

          .body-row__text {
            font-size: 20px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.25;
            letter-spacing: normal;
            color: #fff;
            opacity: 1;
          }

          .body-row:nth-child(2) {
          }
        }

        .card-footer {
          font-size: 20px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.25;
          color: #fff;
          opacity: 1;
          //padding-bottom: 16px;

          &.no-data-text {
            font-size: 16px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            opacity: 0.7;
            color: #fff;
            margin-top: 62px;
            max-width: 85%;
            white-space: normal !important;
          }
        }

        .card-status {
          font-size: 20px;
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: normal;
          color: #fff;
          bottom: 16px;
          position: absolute;
        }

        .bg-image {
          position: absolute;
          right: 0 !important;
          bottom: 55px !important;
          height: 20px !important;
        }
      }

      .phishing-reporter {
        background-color: #2196f3;
      }

      .investigations {
        background-color: #b83a3a;
      }

      .roi-summary {
        background-image: linear-gradient(to bottom, #b27fc2, #66257a 96%);

        &__settings-button {
          position: absolute;
          right: 10px;
          top: 10px;
        }
      }
    }

    .double-table {
      display: flex;
      margin-top: 8px;

      .k-table__wrapper .card {
        justify-content: unset;
        box-shadow: none !important;
        padding: 0px !important;
        border: none !important;
        border-radius: 0 !important;

        .table-wrapper {
          padding-top: 0;
          border: none !important;
          margin-top: 0 !important;
          border-radius: 0 !important;
        }
      }

      .k-table__wrapper {
        padding-bottom: 24px;
      }

      @media only screen and (max-width: 1023px) {
        flex-wrap: wrap;
        .column {
          width: calc(100% - 16px) !important;
        }
      }

      .column {
        margin: 8px;
        width: calc(50% - 16px);

        .v-card {
          border-radius: 12px;
          box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
          min-height: 236px;
          padding: 24px;
          padding-bottom: 0;
          height: 100%;

          .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 24px;

            .title {
              h2 {
                font-family: 'Open Sans', sans-serif;
                font-size: 20px;
                font-weight: 600;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.15;
                letter-spacing: normal;
                color: #2196f3;
              }

              p {
                font-family: 'Open Sans', sans-serif !important;
                font-size: 16px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: normal;
                color: rgba(0, 0, 0, 0.87);
              }
            }

            .action {
              display: flex;

              .btn-action {
                font-size: 14px;
                font-weight: 600;
                line-height: 1.71;
                letter-spacing: normal;
                color: #2196f3;
                background-color: #ffffff !important;
                border-radius: 18px;
                box-shadow: none !important;
                border: solid 1px #2196f3;

                i {
                  font-size: 19px !important;
                }
              }
            }
          }

          .table {
            .wrapper {
              padding-bottom: 0 !important;
            }

            ::v-deep .v-card {
              box-shadow: unset !important;
              padding: 0 !important;

              .table-wrapper {
                box-shadow: unset !important;

                .el-table td {
                  padding: 16px 0 !important;
                }

                .btn-status {
                  max-width: 100px !important;
                }

                .btn-inactive {
                  background-color: #f56c6c !important;
                }
              }
            }
          }

          .table.investigations {
            ::v-deep .v-card {
              .el-table td {
                padding: 13px 0 !important;
              }
            }
          }
        }
      }
    }

    .table-row {
      display: flex;
      padding-top: 8px;
      position: relative;
      margin: 8px;
      width: calc(100% - 16px);

      .wrapper {
        width: 100%;
      }

      .k-table__wrapper {
        .v-card {
          padding: 0;
        }
      }

      .v-card {
        border-radius: 12px;
        box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8);
        padding: 24px;
        padding-bottom: 0;
        width: 100%;

        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          .title {
            width: 65%;

            h2 {
              font-family: 'Open Sans', sans-serif;
              font-size: 20px;
              font-weight: 600;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.15;
              letter-spacing: normal;
              color: #2196f3;
            }

            p {
              font-family: 'Open Sans', sans-serif !important;
              font-size: 16px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.87);
            }
          }

          .action {
            display: flex;

            .btn-action {
              background-color: #2196f3 !important;
              color: #fff;
              font-size: 14px;
              font-weight: 400;
              line-height: 1.71;
              letter-spacing: normal;
              padding: 0 !important;
              height: 36px !important;
              border-radius: 18px;
              box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);

              i {
                font-size: 19px !important;
              }
            }
          }
        }
      }

      .wrapper {
        padding-top: 20px !important;
        padding-top: 40px !important;

        ::v-deep .v-card {
          box-shadow: unset !important;
          padding: 0 !important;

          .table-wrapper {
            border-radius: 12px;
            box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
              0 1px 1px -1px rgba(204, 204, 204, 0.12);

            .el-table td {
              padding: 12px 0;
            }

            .btn-status {
              max-width: 100px !important;
            }

            .btn-inactive {
              background-color: #f56c6c !important;
            }
          }
        }
      }

      .table.investigations {
        ::v-deep .v-card {
          .el-table td {
            padding: 13px 0 !important;
          }
        }
      }

      ::v-deep .el-table th > .cell {
        line-height: 2rem !important;
      }
    }

    @media only screen and (max-width: 500px) {
      ::v-deep .v-card {
        padding: 16px !important;
      }
    }

    @media only screen and (max-width: 1400px) and (min-width: 1025px) {
      .btn-investigations,
      .btn-playbook {
        font-size: 12px !important;
      }
    }

    ::v-deep .newInvestigationOverlay {
      background-color: #fff !important;
      overflow: auto !important;
      height: 100% !important;
      max-width: 100vw !important;
      width: 100% !important;
      display: block !important;
      justify-content: center !important;
      align-items: center !important;

      > ::v-deep .v-overlay__content {
        height: auto;
        width: 100%;
      }

      .v-overlay__content {
        height: 100%;
        position: absolute;
        left: 0;
        width: 100%;
      }
    }

    .table.investigations {
      padding: 0 !important;
    }
  }
  #tab-sandbox {
    .v-slide-group__content {
      border-bottom: 2px solid #e4e7ed;
      padding: 0 16px;
    }
    .v-tabs-slider-wrapper {
      color: #2196f3;
      bottom: -2px;
    }
  }
}
.sandbox__date-picker.el-picker-panel {
  z-index: 1000 !important;
}
</style>
