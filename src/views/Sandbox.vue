<template>
  <div style="min-height: 90vh;" class="sandbox mt-2">
    <div class="incident-responder-parent">
      <div class="incident-responder">
        <div class="pa-2">
          <div class="search-wrapper">
            <div class="w-100">
              <k-select
                v-infinite-scroll="{
                  target: '#sandbox-company-select .k-select__menu',
                  callback: callForCompanies
                }"
                v-select-search-handler="{
                  callback: callForSearchCompanies,
                  isLoadingKey: 'isCompaniesLoading'
                }"
                v-model="companyValue"
                :items="companyItems"
                :placeholder="'Select a company'"
                outlined
                class="edit-select"
                max-width="100"
                multiple
                hide-details
                clearable
                item-text="clientName"
                :menu-props="{ offsetY: true }"
                item-value="resourceId"
                :disabled="incidentLoading"
                :no-data-text="isCompaniesLoading ? 'Loading...' : 'No company available'"
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
                no-data-text="No integration available"
                persistent-hint
                clearable
                @change="changeEngineType"
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
                return-object
                @input="changeDateValueSelect('constant')"
                @click:clear="filteredDateValueSelect = { name: 'All Time', value: '' }"
              ></k-select>
              <div
                v-if="filteredDateValueSelect.value === 'custom' && menuOpen"
                class="absolute-date-filter"
                id="input--date-picker-select-main-div"
                :style="filteredSelectValueDate === 'between' ? 'width: 400px' : ''"
                @blur="changeBlurValue($event)"
              >
                <v-select
                  :items="dateFilterItems"
                  id="focus-date"
                  dense
                  height="40"
                  outlined
                  v-model="filteredSelectValueDate"
                  :menu-props="{ offsetY: true }"
                  placeholder="Select an option"
                  :key="getDateKey"
                  @blur="changeBlurValue($event)"
                ></v-select>
                <InputDate
                  v-show="filteredSelectValueDate === 'between'"
                  popper-class="sandbox__date-picker"
                  v-model="filteredDateValueRange"
                  ref="refPicker2"
                  type="datetimerange"
                />
                <InputDate
                  v-show="filteredSelectValueDate !== 'between'"
                  v-model="filteredDateValue"
                  popper-class="sandbox__date-picker"
                  type="datetime"
                  ref="refPicker"
                  style="width: 100%; max-width: 260px; margin-bottom: 14px;"
                  @change="changeDateValue"
                  @blur="changeBlurValue($event)"
                />

                <div class="filter__footer" @blur="changeBlurValue($event)">
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
                absolute
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
                    v-for="item in listItems"
                    :key="item"
                    @click="handleListItemClick(item)"
                  >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
        <SandboxCards :incident-loading="incidentLoading" :summary-data="summaryData" />
        <v-tabs id="tab-sandbox" v-model="tab" background-color="white" color="basil">
          <v-tab v-if="isStatsRender" id="tab-stats">Stats</v-tab>
          <v-tab v-if="isLogsRender" id="tab-logs">Logs</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="component-threat-sharing__tabs">
          <v-tab-item v-if="isStatsRender">
            <SandboxStats ref="sandboxStats" />
          </v-tab-item>
          <v-tab-item v-if="isLogsRender">
            <SandboxLog ref="sandboxLog" />
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDefaultAxiosPayload,
  getSelectSearchPayload,
  getTimeZoneForMoment
} from '@/utils/functions'
import labels from '@/model/constants/labels'
import { getSandboxSummaryData } from '@/api/sandbox'
import SandboxLog from '@/components/Sandbox/SandboxLog'
import SandboxStats from '@/components/Sandbox/SandboxStats'
import InputDate from '@/components/Common/Inputs/InputDate'
import KSelect from '@/components/Common/Inputs/KSelect'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { searchRestApi } from '@/api/restApi'
import { searchTargetGroups } from '@/api/targetUsers'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'
import { mapGetters } from 'vuex'
import SandboxCards from '@/components/Sandbox/SandboxCards'
export default {
  name: 'Sandbox',
  components: {
    SandboxCards,
    SandboxLog,
    SandboxStats,
    InputDate,
    KSelect
  },
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
  data() {
    return {
      getFilterButtonDisabled: false,
      incidentLoading: true,
      isCompaniesLoading: false,
      labels,
      search: null,
      tab: 0,
      companyAxiosPayload: getDefaultAxiosPayload(),
      totalPageOfCompanies: 1,
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
      companyItems: [],
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
  computed: {
    ...mapGetters({
      permissions: 'permissions/getCrossCompanyPagePermissions'
    }),
    isStatsRender() {
      return this?.permissions?.SEARCH_STATS?.hasPermission
    },
    isLogsRender() {
      return this?.permissions?.SEARCH_LOG?.hasPermission
    },
    getDateKey() {
      return this.$store?.state?.auth?.user?.userCompany?.timeZone
    }
  },
  created() {
    if (localStorage.getItem('sandboxCompany'))
      this.companyValue = localStorage.getItem('sandboxCompany')?.split(',') || ''
    if (localStorage.getItem('sandboxIntegration'))
      this.analysisEngineTypeResourceId =
        localStorage.getItem('sandboxIntegration')?.split(',') || ''
    if (localStorage.getItem('sandboxDateValue'))
      this.filteredSelectValueDate = localStorage.getItem('sandboxDateFormat')
    if (localStorage.getItem('sandboxDateValue'))
      this.filteredDateValueSelect = {
        name: localStorage.getItem('sandboxDateOption'),
        value: 'custom'
      }
    let dateValue = localStorage.getItem('sandboxDateOption')
    if (this.filteredSelectValueDate === 'between') {
      this.filteredDateValueRange = dateValue?.split(',')
    } else {
      this.filteredDateValue = dateValue
    }
    this.getSummaryData()
    this.callForCompanies()
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
    callForCompanies(addPage) {
      if (addPage) {
        this.companyAxiosPayload.pageNumber += 1
        if (this.companyAxiosPayload.pageNumber > this.totalPageOfCompanies) return
      }
      searchRestApi(this.companyAxiosPayload)
        .then((response) => {
          this.setCompanies(response)
          this.totalPageOfCompanies = response.data.data.totalNumberOfPages
        })
        .finally(() => {
          this.isCompaniesLoading = false
        })
    },
    callForSearchCompanies(search = '') {
      if (search) {
        searchTargetGroups(getSelectSearchPayload(this.companyAxiosPayload, search))
          .then(this.setCompanies)
          .finally(() => {
            this.isCompaniesLoading = false
          })
      } else {
        this.callForTargetGroups()
      }
    },
    setCompanies(response) {
      this.companyItems = [...this.companyItems, ...(response?.data?.data?.results || [])]
    },
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
      if (value === 'Set as default filter') {
        this.setFilterOptions()
      } else if (value === 'Restore default filter') {
        if (localStorage.getItem('sandboxCompany'))
          this.companyValue = localStorage.getItem('sandboxCompany')?.split(',') || ''
        if (localStorage.getItem('sandboxIntegration'))
          this.analysisEngineTypeResourceId =
            localStorage.getItem('sandboxIntegration').split(',') || ''
        if (localStorage.getItem('sandboxDateValue')) {
          this.filteredSelectValueDate = localStorage.getItem('sandboxDateFormat')
          this.filteredDateValueSelect = {
            name: localStorage.getItem('sandboxDateOption'),
            value: 'custom'
          }
        }
        let dateValue = localStorage.getItem('sandboxDateOption')
        if (this.filteredSelectValueDate === 'between') {
          this.filteredDateValueRange = dateValue?.split(',')
        } else {
          this.filteredDateValue = dateValue
        }
        this.handleFilter()
      } else if (value === 'Clear filters') {
        this.companyValue = ''
        this.analysisEngineTypeResourceId = null
        this.filteredDateValue = null
        this.filteredDateValueRange = null
        this.filteredDateValueSelect = { name: 'All Time', value: '' }
        this.handleFilter()
      }
    },
    clearFilter() {
      this.menuOpen = false
      this.filteredDateValueSelect = { name: 'All Time', value: '' }
    },
    getFilteredDateValue() {
      return this.filteredSelectValueDate !== 'between'
        ? this.filteredDateValue || this.filteredDateValueSelect.value
        : [this.filteredDateValueRange[0], this.filteredDateValueRange[1]]
    },
    handleFilter() {
      let value = this.getFilteredDateValue()
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

      const dateFilterValueForTables = this.getDateFilterForTable(value)

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
    getDateFilterForTable(value) {
      return this.filteredSelectValueDate === 'between'
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
    },
    changeBlurValue(e) {
      if (e.currentPlacement !== 'bottom-start') this.menuOpen = !!e.relatedTarget
    },
    changeDateValueSelect(isConstant) {
      if (isConstant) {
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
    changeDateValue() {
      if (this.menuOpen) return false
      this.$set(
        this.summaryOptions.filter.FilterGroups[0].FilterItems[2],
        'Value',
        this.filteredDateValue || ''
      )
      this.getSummaryData()
    },
    getAnalysisEngineTypeResourceId() {
      return this.analysisEngineTypeResourceId
        ? this.analysisEngineTypeResourceId
            .map((engineTypeValue) => {
              return this.integrationTypesEnum.find((item) => item.name === engineTypeValue).value
            })
            .toString()
        : ''
    },
    getDateFilter() {
      return this.filteredSelectValueDate !== 'between'
        ? this.filteredDateValue || this.filteredDateValueSelect.value
        : [this.filteredDateValueRange[0], this.filteredDateValueRange[1]]
    },
    changeCompanyData() {
      this.$set(
        this.summaryOptions.filter.FilterGroups[0].FilterItems[1],
        'Value',
        this.companyValue.toString() || ''
      )
      const analysisEngineTypeResourceId = this.getAnalysisEngineTypeResourceId()
      const dateFilter = this.getDateFilter()
      this.$refs?.sandboxLog?.getDatatableListWhenFilterChange(
        this.companyValue.toString(),
        analysisEngineTypeResourceId,
        dateFilter
      )
      this.$refs?.sandboxStats?.getDatatableListWhenFilterChange(
        this.companyValue.toString(),
        analysisEngineTypeResourceId,
        dateFilter
      )
      this.getSummaryData()
    },
    changeEngineType() {
      this.$set(
        this.summaryOptions.filter.FilterGroups[0].FilterItems[0],
        'Value',
        this.analysisEngineTypeResourceId.toString() || ''
      )
      const analysisEngineTypeResourceId = this.getAnalysisEngineTypeResourceId()
      const dateFilter = this.getDateFilter()
      this.$refs?.sandboxLog?.getDatatableListWhenFilterChange(
        this.companyValue.toString(),
        analysisEngineTypeResourceId,
        dateFilter
      )
      this.$refs?.sandboxStats?.getDatatableListWhenFilterChange(
        this.companyValue.toString(),
        analysisEngineTypeResourceId,
        dateFilter
      )
      this.getSummaryData()
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
    }
  }
}
</script>
