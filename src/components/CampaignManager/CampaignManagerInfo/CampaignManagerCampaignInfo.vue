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
        v-model.trim="formData.targetGroups"
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
    <CampaignManagerTargetGroups v-show="isShowAdvancedSearch" class="mb-6" />
    <FormGroup
      has-hint
      class-name="campaign-manager__target-groups"
      :title="labels.PhishingScenarios"
      :sub-title="labels.PhishingScenariosSub"
    >
      <KSelect
        v-model.trim="formData.phishingScenario"
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
      :items="phishingScenarioItems"
      :value="formData.phishingScenario"
      :is-phishing-scenarios-loading="isPhishingScenariosLoading"
      @on-item-change="handleOnPhishingScenarioChange"
    />
  </v-form>
</template>

<script>
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import { getTargetGroups } from '@/api/targetUsers'
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
  data() {
    return {
      axiosPayloadOfPhishingScenarios,
      isTargetGroupLoading: false,
      isPhishingScenariosLoading: false,
      isShowAdvancedSearch: true,
      isShowAdvancedSearchPhishing: true,
      labels,
      formData: {
        name: '',
        targetGroups: [],
        phishingScenario: ''
      },
      targetGroupItems: [],
      phishingScenarioItems: [],
      rules: {
        name: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' '),
          (v) => validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.CampaignName))
        ],
        select: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' ')
        ]
      }
    }
  },
  created() {
    this.callForTargetGroups()
    this.callForPhishingScenarios()
  },
  methods: {
    callForTargetGroups() {
      this.setTargetGroupLoading(true)
      getTargetGroups()
        .then((response) => {
          const {
            data: { data }
          } = response
          this.targetGroupItems = data.map((item) => ({ text: item.name, value: item.resourceId }))
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
          if (this.phishingScenarioItems.length && !this.isEdit)
            this.formData.phishingScenario = this.phishingScenarioItems[0].resourceId
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
      this.formData.phishingScenario = item.resourceId
    }
  }
}
</script>
