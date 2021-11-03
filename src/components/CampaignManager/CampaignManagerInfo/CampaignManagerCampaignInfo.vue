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
        :items="targetGroupItems"
        :rules="rules.select"
        @input="handleTargetGroupsResourceIdsChange"
      >
        <template #progress>
          <KSelectLoading v-show="isTargetGroupLoading" />
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
        item-text="name"
        item-value="resourceId"
        :items="phishingScenarioItems"
        :rules="rules.select"
      >
        <template #progress>
          <KSelectLoading v-show="isPhishingScenariosLoading" />
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
      v-show="isShowAdvancedSearchPhishing"
      class="mb-6"
      ref="refCampaignManagerPhishingScenarios"
      :items="phishingScenarioItems"
      :value="formData.phishingScenarioResourceId"
      :is-phishing-scenarios-loading="isPhishingScenariosLoading"
      @on-item-change="handleOnPhishingScenarioChange"
    />
    <FormGroup :title="labels.Schedule" :sub-title="labels.ScheduleSub">
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
    <FormGroup class="mt-6" :title="labels.Duration" :sub-title="labels.DurationSub" has-hint>
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
  pageSize: 10000,
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
    }
  },
  data() {
    return {
      axiosPayloadOfPhishingScenarios,
      isTargetGroupLoading: false,
      isPhishingScenariosLoading: false,
      responseOfTargetGroupsItems: {},
      isShowAdvancedSearch: true,
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
      defaultTargetGroupResourceIds: [],
      targetGroupItems: [],
      phishingScenarioItems: [],
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
        if (key === 'targetGroupResourceIds') {
          this.defaultTargetGroupResourceIds = val[key]
          this.addDefaultTargetGroupItems(this.defaultTargetGroupResourceIds)
        } else {
          this.formData[key] = val[key]
        }
      }
    }
  },
  created() {
    this.callForTargetGroups()
    this.callForPhishingScenarios()
  },
  methods: {
    addDefaultTargetGroupItems(resourceIds = []) {
      if (
        this.formData.targetGroupResourceIds.length ||
        !this.targetGroupItems.length ||
        !resourceIds.length
      )
        return
      this.$nextTick(() => {
        this.formData.targetGroupResourceIds = resourceIds
          .map((id) => {
            return this.targetGroupItems.find((item) => item.value === id)
          })
          .filter((item) => item)
        this.handleTargetGroupsResourceIdsChange(this.formData.targetGroupResourceIds)
      })
    },
    handleTargetGroupsResourceIdsChange(items) {
      const { data: { data: { results = [] } = {} } = {} } = this.responseOfTargetGroupsItems
      const selectedTableItems = items
        .filter((item) => item)
        .map((item) => {
          return results.find((targetGroup) => targetGroup.resourceId === item.value)
        })
      this.$refs.refCampaignManagerTargetGroup.$refs.refGroupTable.$refs.refTable.getSelectedObjectAndSelectRows(
        selectedTableItems
      )
    },
    handleTableSelectionChange(items) {
      this.formData.targetGroupResourceIds = items
        .filter((item) => item)
        .map((item) => ({
          text: item.name,
          value: item.resourceId,
          userCount: item.userCount
        }))
    },
    callForTargetGroups() {
      this.setTargetGroupLoading(true)
      searchTargetGroups({
        pageNumber: 1,
        pageSize: 75000,
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
      })
        .then((response) => {
          const { data: { data: { results = [] } = {} } = {} } = response
          this.responseOfTargetGroupsItems = response
          this.targetGroupItems = results.map((item) => ({
            text: item.name,
            value: item.resourceId,
            userCount: item.userCount
          }))
          this.addDefaultTargetGroupItems(this.defaultTargetGroupResourceIds)
        })
        .finally(this.setTargetGroupLoading)
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
          this.phishingScenarioItems = data.results || []
          if (this.phishingScenarioItems.length && !this.isEdit) {
            this.formData.phishingScenarioResourceId = this.phishingScenarioItems[0].resourceId
          }
        })
        .finally(this.setPhishingScenarioLoading)
    },
    toggleShowAdvancedSearch() {
      this.isShowAdvancedSearch = !this.isShowAdvancedSearch
    },
    toggleShowAdvancedSearchPhishing() {
      this.isShowAdvancedSearchPhishing = !this.isShowAdvancedSearchPhishing
    },
    handleOnPhishingScenarioChange(item = {}) {
      this.formData.phishingScenarioResourceId = item.resourceId
    }
  }
}
</script>
