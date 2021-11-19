<template>
  <v-form ref="refForm">
    <FormGroup :title="labels.CampaignName" has-hint>
      <v-text-field
        v-model.trim="formData.name"
        id="input--campaign-info-name"
        placeholder="Enter a name"
        outlined
        dense
        persistent-hint
        hint="*Required"
        :rules="rules.name"
      />
    </FormGroup>
    <FormGroup
      has-hint
      class-name="campaign-manager__target-groups"
      :title="labels.TargetGroups"
      :sub-title="labels.TargetGroupsSub"
    >
      <KSelect
        v-model.trim="formData.targetGroupResourceIds"
        type="combobox"
        id="input--campaign-target-user-groups"
        class="edit-select new-investigation__combo target-users-select-multi select-specific-users"
        outlined
        multiple
        dense
        auto-select-first
        small-chips
        deletable-chips
        persistent-hint
        hint="*Required"
        placeholder="Select groups"
        :loading="isTargetGroupSearchLoading"
        :items="targetGroupItems"
        :rules="rules.select"
        :slots="{ progress: true }"
        @input="handleTargetGroupsResourceIdsChange"
        @update:search-input="handleSearchInputChange"
        @focus="handleFocusOfTargetGroupsInput"
        @focusout="handleFocusOutOfTargetGroupsInput"
      >
        <template #progress>
          <KSelectLoading v-show="isTargetGroupSearchLoading && isTargetGroupFocused" />
        </template>
      </KSelect>
      <v-btn
        text
        class="campaign-manager__close-advanced-search"
        color="#2196F3"
        @click="toggleShowAdvancedSearch"
      >
        {{ isShowAdvancedSearch ? labels.CloseAdvancedSearch : labels.OpenAdvancedSearch }}
      </v-btn>
    </FormGroup>
    <CampaignManagerTargetGroups
      v-show="isShowAdvancedSearch"
      ref="refCampaignManagerTargetGroup"
      class="mb-6"
      :selected-target-groups="formData.targetGroupResourceIds"
      :response-of-target-groups-items="responseOfTargetGroupsItems"
      @handle-selection-change="handleTableSelectionChange"
    />
    <FormGroup
      v-if="showPhishingScenarios"
      has-hint
      class-name="campaign-manager__target-groups"
      :title="labels.PhishingScenarios"
      :sub-title="labels.PhishingScenariosSub"
    >
      <KSelect
        v-model.trim="formData.phishingScenarioResourceId"
        id="input--campaign-phishing-scenarios"
        outlined
        dense
        persistent-hint
        hint="*Required"
        placeholder="Select phishing scenario"
        :slots="{ progress: true }"
        :loading="isPhishingScenariosLoading"
        :items="phishingScenarioSelectItems"
        :rules="rules.select"
        @focus="handleFocusOfPhishingScenarioInput"
        @focusout="handleFocusOutOfPhishingScenarioInput"
      >
        <template #progress>
          <KSelectLoading v-show="isPhishingScenariosLoading && isPhishingScenarioFocused" />
        </template>
      </KSelect>
      <v-btn
        text
        class="campaign-manager__close-advanced-search"
        color="#2196F3"
        @click="toggleShowAdvancedSearchPhishing"
      >
        {{ isShowAdvancedSearchPhishing ? labels.CloseAdvancedSearch : labels.OpenAdvancedSearch }}
      </v-btn>
    </FormGroup>
    <CampaignManagerPhishingScenarios
      v-if="showPhishingScenarios"
      v-show="isShowAdvancedSearchPhishing"
      ref="refCampaignManagerPhishingScenarios"
      :items="phishingScenarioItems"
      :value="formData.phishingScenarioResourceId"
      :is-phishing-scenarios-loading="isPhishingScenariosLoading"
      @on-item-change="handleOnPhishingScenarioChange"
    />
    <FormGroup v-if="showSchedule" :title="labels.Schedule" :sub-title="labels.ScheduleSub">
      <v-radio-group
        v-model="formData.scheduleTypeId"
        class="mt-0 campaign-manager-target-groups-radio"
        hide-details
      >
        <v-radio
          v-for="item in radioItems"
          color="#2196f3"
          :key="item.text"
          :id="`input--campaign-manager-radio-${item.text}`"
          :value="item.value"
          :label="item.text"
        ></v-radio>
      </v-radio-group>
    </FormGroup>
    <FormGroup
      v-if="showDuration"
      class="mt-6"
      :title="labels.Duration"
      :sub-title="labels.DurationSub"
      has-hint
    >
      <v-text-field
        v-model="formData.duration"
        v-mask="'###'"
        id="input--campaign-manager-days"
        outlined
        hide-details
        placeholder="Enter"
        class="edit-name-textfield edit-select standard-height"
        style="max-width: 48px;"
        :rules="rules.days"
      ></v-text-field>
      <span style="position: absolute; top: 66px; left: 56px; font-size: 13px; color: #000;"
        >Day(s)</span
      >
    </FormGroup>
  </v-form>
</template>

<script>
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import { searchTargetGroups } from '@/api/targetUsers'
import * as validations from '@/utils/validations'
import KSelectLoading from '@/components/KSelectLoading'
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups'
import { getScenariosList } from '@/api/scenarios'
import CampaignManagerPhishingScenarios from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerPhishingScenarios'

const axiosPayloadOfPhishingScenarios = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'createTime',
  ascending: false,
  filter: {
    Condition: 'AND',
    FilterGroups: [
      {
        Condition: 'AND',
        FilterItems: [],
        FilterGroups: []
      },
      {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
    ]
  }
}

export default {
  name: 'CampaignManagerCampaignInfo',
  components: {
    CampaignManagerPhishingScenarios,
    CampaignManagerTargetGroups,
    KSelectLoading,
    KSelect,
    FormGroup
  },
  props: {
    defaultValues: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    showPhishingScenarios: {
      type: Boolean,
      default: true
    },
    showSchedule: {
      type: Boolean,
      default: true
    },
    showDuration: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      axiosPayloadOfPhishingScenarios,
      initial: true,
      phishingInitial: true,
      isTargetGroupLoading: false,
      isTargetGroupSearchLoading: false,
      isPhishingScenariosLoading: false,
      isTargetGroupFocused: false,
      isPhishingScenarioFocused: false,
      responseOfTargetGroupsItems: {},
      isShowAdvancedSearch: true,
      axiosPayloadOfTargetGroups: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      isShowAdvancedSearchPhishing: true,
      radioItems: [
        { text: 'Send now', value: '1' },
        { text: 'Save for later', value: '2' }
      ],
      labels,
      formData: {
        name: '',
        targetGroupResourceIds: [],
        phishingScenarioResourceId: '',
        scheduleTypeId: '1',
        duration: 3
      },
      defaultTargetGroups: [],
      targetGroupItems: [],
      phishingScenarioItems: [],
      phishingScenarioSelectItems: [],

      rules: {
        name: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' '),
          (v) => validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.CampaignName))
        ],
        select: [
          (v) => !!v.length || labels.Required,
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' ')
        ],
        days: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, 'Cannot start with 0', 0)
        ]
      }
    }
  },
  watch: {
    defaultValues(val) {
      for (const key of Object.keys(val)) {
        if (key === 'targetGroups') {
          this.defaultTargetGroups = val[key]
          this.addDefaultTargetGroupItems(this.defaultTargetGroups)
        } else if (key === 'phishingScenario') {
          this.formData.phishingScenario = val[key]
          this.formData.phishingScenarioResourceId = val[key].value
        } else {
          this.formData[key] = val[key]
        }
      }
    }
  },
  created() {
    this.callForTargetGroups()
    if (this.showPhishingScenarios) {
      this.callForPhishingScenarios()
    }
  },
  methods: {
    addDefaultTargetGroupItems(targetGroups = []) {
      if (this.formData.targetGroupResourceIds.length || !targetGroups.length) return
      this.$nextTick(() => {
        this.handleTargetGroupsResourceIdsChange(targetGroups)
      })
    },
    handleTargetGroupsResourceIdsChange(items) {
      const selectedTableItems = items
        .filter((item) => item)
        .map((item) => ({ ...item, resourceId: item.value }))
      if (
        this.$refs.refCampaignManagerTargetGroup.$refs.refGroupTable.$refs.refTable.$refs.elTableRef
      ) {
        this.$refs.refCampaignManagerTargetGroup.$refs.refGroupTable.$refs.refTable.getSelectedObjectAndSelectRowsByRowKey(
          selectedTableItems
        )
      }
    },
    handleTableSelectionChange(items) {
      this.formData.targetGroupResourceIds = items
        .filter((item) => item)
        .map((item) => ({
          text: item.text || item.name,
          value: item.value || item.resourceId,
          extraDatas: null
        }))
    },
    handleScroll(
      e,
      callback = this.callForTargetGroups,
      axiosPayload = this.axiosPayloadOfTargetGroups
    ) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target
      if (
        scrollTop - (scrollHeight - offsetHeight) < 10 &&
        scrollTop - (scrollHeight - offsetHeight) > -10
      ) {
        axiosPayload.pageSize += 10
        this.debounce(() => {
          callback()
        }, 500)
      }
    },
    callForTargetGroups() {
      this.isTargetGroupSearchLoading = true
      this.setTargetGroupLoading(true)
      searchTargetGroups(this.axiosPayloadOfTargetGroups)
        .then((response) => {
          const { data: { data: { results = [] } = {} } = {} } = response
          if (this.initial) {
            this.responseOfTargetGroupsItems = response
          }

          this.initial = false
          this.targetGroupItems = results.map((item) => ({
            text: item.name,
            value: item.resourceId,
            extraDatas: null
          }))
        })
        .finally(() => {
          this.isTargetGroupSearchLoading = false
          this.setTargetGroupLoading()
          this.addDefaultTargetGroupItems(this.defaultTargetGroups)
          this.targetGroupItems.push(...this.defaultTargetGroups)
        })
    },
    setTargetGroupLoading(val = false) {
      this.isTargetGroupLoading = val
    },
    setPhishingScenarioLoading(val = false) {
      this.isPhishingScenariosLoading = val
    },
    callForPhishingScenarios() {
      this.setPhishingScenarioLoading(true)
      getScenariosList(this.axiosPayloadOfPhishingScenarios)
        .then((response) => {
          const {
            data: { data }
          } = response
          if (this.phishingInitial) {
            this.phishingScenarioItems = JSON.parse(JSON.stringify(data.results)) || []
          }
          this.phishingInitial = false
          this.phishingScenarioSelectItems = this.phishingScenarioItems.map((item) => ({
            text: item.name,
            value: item.resourceId,
            extraDatas: null
          }))

          if (
            this.phishingScenarioSelectItems.length &&
            !this.isEdit &&
            !this.formData.phishingScenarioResourceId
          ) {
            this.formData.phishingScenarioResourceId = this.phishingScenarioItems[0].resourceId
          }
        })
        .finally(() => {
          if (
            this.formData.phishingScenario &&
            !this.phishingScenarioSelectItems.find(
              (item) => item.value === this.formData.phishingScenarioResourceId
            )
          ) {
            this.phishingScenarioSelectItems.push(this.formData.phishingScenario)
          }
          this.setPhishingScenarioLoading()
        })
    },
    toggleShowAdvancedSearch() {
      this.isShowAdvancedSearch = !this.isShowAdvancedSearch
    },
    toggleShowAdvancedSearchPhishing() {
      this.isShowAdvancedSearchPhishing = !this.isShowAdvancedSearchPhishing
    },
    handleOnPhishingScenarioChange(item = {}) {
      this.formData.phishingScenario = {
        text: item.name,
        value: item.resourceId,
        extraDatas: null
      }
      if (
        !this.phishingScenarioSelectItems.find((selectItem) => selectItem.value === item.resourceId)
      ) {
        this.phishingScenarioSelectItems.push(this.formData.phishingScenario)
      }
      this.formData.phishingScenarioResourceId = item.resourceId
    },
    handleSearchInputChange(val) {
      this.debounce(() => {
        if (
          (!this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems[0] &&
            val === null) ||
          (this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems[0] &&
            this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems[0].Value === val)
        )
          return
        this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems = [
          { FieldName: 'Name', Operator: 'Contains', Value: val }
        ]
        this.callForTargetGroups()
      }, 500)
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    handleFocusOfTargetGroupsInput() {
      this.isTargetGroupFocused = true
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          document
            .querySelector('#input--campaign-target-user-groups .k-select__menu')
            .addEventListener('scroll', this.handleScroll)
        })
      }, 250)
    },
    handleFocusOutOfTargetGroupsInput() {
      this.isTargetGroupFocused = false
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          document
            .querySelector('#input--campaign-target-user-groups .k-select__menu')
            .removeEventListener('scroll', this.handleScroll)
        })
      }, 250)
    },
    handleFocusOfPhishingScenarioInput() {
      this.isPhishingScenarioFocused = true
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          document
            .querySelector('#input--campaign-phishing-scenarios .k-select__menu')
            .addEventListener('scroll', this.handleScrollOfPhishingScenarios)
        })
      }, 250)
    },
    handleScrollOfPhishingScenarios(e) {
      this.handleScroll(e, this.callForPhishingScenarios, this.axiosPayloadOfPhishingScenarios)
    },
    handleFocusOutOfPhishingScenarioInput() {
      this.isPhishingScenarioFocused = false
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          document
            .querySelector('#input--campaign-phishing-scenarios .k-select__menu')
            .removeEventListener('scroll', this.handleScrollOfPhishingScenarios)
        })
      }, 250)
    }
  }
}
</script>
