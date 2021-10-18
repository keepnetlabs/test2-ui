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
        :rules="rules.targetGroups"
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
    <CampaignManagerTargetGroups />
  </v-form>
</template>

<script>
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import { getTargetGroups } from '@/api/targetUsers'
import * as validations from '@/utils/validations'
import KSelectLoading from '@/components/KSelectLoading'
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerTargetGroups'
export default {
  name: 'CampaignManagerCampaignInfo',
  components: { CampaignManagerTargetGroups, KSelectLoading, KSelect, FormGroup },
  data() {
    return {
      isTargetGroupLoading: false,
      isShowAdvancedSearch: true,
      labels,
      formData: {
        name: '',
        targetGroups: []
      },
      targetGroupItems: [],
      rules: {
        name: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' '),
          (v) => validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.CampaignName))
        ],
        targetGroups: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' ')
        ]
      }
    }
  },
  created() {
    this.callForTargetGroups()
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
    toggleShowAdvancedSearch() {
      this.isShowAdvancedSearch = !this.isShowAdvancedSearch
    }
  }
}
</script>
