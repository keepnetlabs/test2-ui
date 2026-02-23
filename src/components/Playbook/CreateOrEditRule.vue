<template>
  <div class="playbook-rule-form">
    <div class="flex-grow-1 no-gutters">
      <v-col>
        <v-stepper light v-model="activeStep" class="wizard">
          <v-stepper-header class="wizard__header">
            <v-stepper-step
              id="step--create-playbook-modal-rule-info"
              :complete="activeStep > 1"
              step="1"
              >Rule Info</v-stepper-step
            >
            <v-divider />
            <v-stepper-step
              id="step--create-playbook-modal-conditions"
              :complete="activeStep > 2"
              step="2"
              >Conditions</v-stepper-step
            >
            <v-divider />
            <v-stepper-step id="step--create-playbook-modal-actions" step="3">{{
              labels.Actions
            }}</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <ConfigureCompanyStepHeader
                class="mb-8"
                :title="labels.RuleInformation"
                :subtitle="labels.EnterRuleInformation"
              />
              <v-form ref="refStep1Form" lazy-validation>
                <FormGroup :title="labels.RuleName" has-hint>
                  <InputEntityName
                    v-model.trim="name"
                    id="input--playbook-rule-name"
                    initial-placeholder="Enter a name for the rule"
                    :entityName="labels.RuleName"
                  />
                </FormGroup>
                <FormGroup :title="labels.Description">
                  <InputDescription
                    v-model.trim="description"
                    id="input--playbook-description"
                    initial-placeholder="Describe the rule"
                    entity-name="Description"
                    :maxLength="300"
                  />
                </FormGroup>
                <FormGroup
                  :title="labels.Priority"
                  sub-title="Rules with higher priority override lower priority rules"
                >
                  <div class="playbook-rule-form__radio-group mb-6 mt-4">
                    <v-radio-group
                      v-model.trim="priority"
                      id="input--playbook-priority"
                      row
                      hide-details
                      dense
                    >
                      <v-radio :ripple="false" color="#2196f3" value="VeryLow" label="Very Low" />
                      <v-radio :ripple="false" color="#2196f3" value="Low" label="Low" />
                      <v-radio :ripple="false" color="#2196f3" value="Medium" label="Medium" />
                      <v-radio :ripple="false" color="#2196f3" value="High" label="High" />
                      <v-radio :ripple="false" color="#2196f3" value="VeryHigh" label="Very High" />
                    </v-radio-group>
                  </div>
                </FormGroup>
                <FormGroup :title="labels.Tags" :sub-title="labels.DefineTags">
                  <InputTag
                    v-model.trim="tags"
                    ref="refTags"
                    id="input--playbook-tags"
                    class="hide-caret"
                    :items="[]"
                  />
                </FormGroup>
                <v-list-item>
                  <v-list-item-content>
                    <v-switch
                      v-model="isActive"
                      id="input--playbook-status"
                      :label="isActive ? 'Active' : 'Inactive'"
                      class="playbook-rule-form__switch"
                      color="#2196f3"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-form>
            </v-stepper-content>
            <!-- STEP 2 -->
            <v-stepper-content step="2">
              <ConfigureCompanyStepHeader
                class="mb-8"
                :title="labels.Conditions"
                :subtitle="labels.ConditionsSubHeader"
              />
              <vue-query-builder
                v-model="query"
                id="playbook-query-builder"
                class="w-100"
                :max-depth="4"
                :labels="label"
                :rules="rules"
              >
                <template v-slot:default="slotProps">
                  <v-form ref="refStep2Form" lazy-validation>
                    <query-builder-group
                      ref="queryBuilderGroup"
                      v-bind="slotProps"
                      :query.sync="query"
                    />
                  </v-form>
                </template>
              </vue-query-builder>
            </v-stepper-content>
            <!-- STEP 3 -->
            <v-stepper-content step="3">
              <v-list-item-content>
                <v-list-item-title class="v-card-form-title">
                  {{ labels.Actions }}
                </v-list-item-title>
                <v-list-item-title class="v-card-sub-header">
                  Define action for instances that match the conditions
                </v-list-item-title>
              </v-list-item-content>
              <v-container fluid class="playbook-actions">
                <ActionItem
                  ref="refActionItem"
                  :playbookId="playbookId"
                  :editedActions="playbookAction"
                  :has-keyword="hasKeyword"
                  :editedPlaybookActionAnalyzers="playbookActionAnalyzers"
                  :editedNotifications="editedNotifications"
                  :editedPlaybookActionInvestigations="editedPlaybookActionInvestigations"
                />
              </v-container>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </div>

    <div class="wizard__footer">
      <StepperFooter
        max-step="3"
        :step="activeStep"
        :ids="stepperIds"
        :disabled-statuses="{
          nextButton: false,
          submitButton: saveDisable
        }"
        @on-cancel="cancelForm"
        @on-back="prevStep"
        @on-next="nextStep"
        @on-submit="handleSave"
      />
    </div>
  </div>
</template>

<script>
import VueQueryBuilder from 'vue-query-builder'
import QueryBuilderGroup from '../Common/QueryBuilder/CustomGroup'
import ActionItem from './ActionItem'
import { createPlaybook, getPlaybook, updatePlaybook } from '@/api/playbook'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import labels from '@/model/constants/labels'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import StepperFooter from '@/components/Stepper/StepperFooter'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputTag from '@/components/Common/Inputs/InputTag'

export default {
  name: 'CreateOrEditRule',
  components: {
    InputTag,
    FormGroup,
    ConfigureCompanyStepHeader,
    StepperFooter,
    ActionItem,
    VueQueryBuilder,
    QueryBuilderGroup,
    InputEntityName,
    InputDescription
  },
  props: {
    playbookId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      initialFormValues: {
        name: '',
        description: '',
        priority: 'Medium',
        tags: [],
        isActive: true,
        query: {
          logicalOperator: 'AND',
          children: [
            {
              type: 'query-builder-group',
              query: {
                logicalOperator: 'AND',
                children: []
              }
            }
          ]
        },
        actions: []
      },
      stepperIds: {
        cancelButton: 'btn-cancel--playbook-rules-modal',
        backButton: 'btn-back--playbook-rules-modal',
        nextButton: 'btn-next--playbook-rules-modal',
        saveButton: 'btn-next--add-or-edit-company-manager-modal'
      },
      saveDisable: false,
      labels,
      isValid: true,
      playbookAction: {},
      totalStep: 3,
      activeStep: 1,
      name: '',
      description: '',
      priority: 'Medium',
      tags: [],
      isActive: true,
      newQuery: null,
      playbookActionAnalyzers: null,
      editedNotifications: [],
      editedPlaybookActionInvestigations: [],
      condition: {},
      label: {
        matchType: 'Match Type',
        matchTypes: [
          { id: 'OR', label: 'OR' },
          { id: 'AND', label: 'AND' }
        ],
        addRule: 'ADD CONDITION',
        addGroup: 'ADD ANOTHER CONDITION SET',
        textInputPlaceholder: 'value'
      },
      rules: [
        {
          type: 'conditions',
          id: 'conditions',
          label: 'Conditions',
          operands: [
            'From',
            'To',
            'CC',
            { text: 'Sender IP', value: 'SenderIp' },
            'Subject',
            'Keyword',
            { text: 'Attachment name', value: 'AttachmentName' },
            { text: 'Attachment hash', value: 'AttachmentHash' },
            { text: 'Attachment extension', value: 'AttachmentExtension' }
          ],
          operandsFrom: ['Email', 'Domain', 'Regex'],
          operandsTo: ['Email', 'Domain', 'Regex'],
          operandsCC: ['Email', 'Domain', 'Regex'],
          operandsAnalysisResult: ['Phishing', 'Malicious', 'Non-malicious'],
          operandsSenderIP: [
            { text: 'is equal to', value: 'Equal' },
            { text: 'is not equal to', value: 'IsNotEqual' },
            { text: 'exists', value: 'Exists' },
            { text: 'does not exist', value: 'DoesNotExist' }
          ],
          operatorSenderIP: [{ text: 'IP Address', value: 'Ip' }, 'Regex'],
          operandsAttachmentHash: [
            { text: 'is equal to', value: 'Equal' },
            { text: 'is not equal to', value: 'IsNotEqual' }
          ],
          operators: [
            { text: 'contains', value: 'Contains' },
            { text: 'does not contain', value: 'DoesNotContain' },
            { text: 'is equal to', value: 'Equal' },
            { text: 'is not equal to', value: 'IsNotEqual' },
            { text: 'exists', value: 'Exists' },
            { text: 'does not exist', value: 'DoesNotExist' }
          ],
          keywordOperators: [
            { text: 'contains', value: 'Contains' },
            { text: 'does not contain', value: 'DoesNotContain' }
          ]
        }
      ],
      query: {
        logicalOperator: 'AND',
        children: [
          {
            type: 'query-builder-group',
            query: {
              logicalOperator: 'AND',
              children: []
            }
          }
        ]
      },
      hasKeyword: false
    }
  },
  computed: {
    canNext() {
      return this.activeStep < this.totalStep
    },
    canPrev() {
      return this.activeStep > 1
    }
  },
  watch: {
    activeStep(newVal) {
      if (newVal === 3) {
        this.hasKeyword = this.query.children.some((item) => {
          return this.findHasKeyword(item.query.children)
        })
      }
    }
  },
  created() {
    if (this.playbookId) {
      this.callForGetPlaybook()
    }
  },
  methods: {
    findHasKeyword(arr, retArr = []) {
      if (arr.children) {
        this.findHasKeyword(arr)
      }
      arr.forEach((item) => {
        if (item.query.operand === 'Keyword') {
          retArr.push(true)
        }
      })
      return !!retArr.length
    },
    handleSave() {
      if (this.playbookId) {
        this.callForUpdatePlaybook()
      } else {
        this.callForCreatePlaybook()
      }
    },
    callForCreatePlaybook() {
      const ref = this.$refs.refActionItem
      const keys = Object.keys(ref.$refs)
      const playbookActionInvestigations = []
      let playbookActionAnalyzers = []
      if (keys.length > 0) {
        let valueIndex = 0
        keys.forEach((key) => {
          if (ref.$refs[key].length > 0 && key !== 'refForm') {
            if (ref?.$refs[key][0].investigateData) {
              playbookActionInvestigations[valueIndex] = ref.$refs[key][0].investigateData
            }
            valueIndex++
          }
        })
      }
      if (
        ref.actions.some((item) => {
          return item.val === 'analyze'
        })
      ) {
        if (ref.analyzeCheckbox) {
          playbookActionInvestigations.push(ref?.playbookActionInvestigationAnalyzeData)
        }
        playbookActionAnalyzers = ref.analysisEngines.filter((item) => {
          const { isSendFile, isSendFileHash, isSendUrl, isSendIp } = item.analysisEngineType
          if (!isSendFile) {
            item.isCheckFile = false
          }
          if (!isSendFileHash) {
            item.isCheckHash = false
          }
          if (!isSendUrl) {
            item.isCheckUrl = false
          }
          if (!isSendIp) {
            item.isCheckSenderIP = false
          }
          return item.selected === true
        })
      }

      const playbookAction = ref.playbookAction
      const targetUserType = ref.targetUserType
      const targetUsers = ref.tarUsers
      const playbookActionNotifications = []
      let index = 0
      for (let i = 0; i < targetUserType.length; i++) {
        if ((targetUsers[i] && targetUsers[i] !== null) || targetUserType[i] === 'Reporter') {
          playbookActionNotifications[index] = {
            targetUserType: targetUserType[i],
            targetUsers: targetUserType[i] === 'Reporter' ? [] : targetUsers[i],
            emailTemplateId: this.$refs.refActionItem.notifyTemplates[i],
            analysisResultFilters: this.$refs.refActionItem.analysisResults[i]
          }
          index++
        }
      }
      const playbookActionStatus = ref.playbookActionStatus
      const payload = {
        name: this.name,
        description: this.description,
        priority: this.priority,
        tags: this.tags,
        isActive: this.isActive,
        playbookAction,
        playbookActionAnalyzers,
        playbookActionNotifications,
        playbookActionInvestigations: playbookActionInvestigations.filter(Boolean),
        playbookActionStatus,
        condition: this.condition
      }

      if (!playbookActionStatus.actionStatusType) {
        delete payload.playbookActionStatus
      }

      if (ref.$refs.refForm.validate()) {
        this.saveDisable = true
        createPlaybook(payload)
          .then(() => {
            this.$emit('closeFormWithUpdate')
          })
          .finally(() => (this.saveDisable = false))
      } else {
        return this.$nextTick(() => {
          const el = ref.$refs.refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    callForUpdatePlaybook() {
      const ref = this.$refs.refActionItem
      const keys = Object.keys(ref.$refs)
      const playbookActionInvestigations = []
      let playbookActionAnalyzers = []
      if (keys.length > 0) {
        let valueIndex = 0
        keys.forEach((key) => {
          if (ref.$refs[key].length > 0 && key !== 'refForm') {
            if (ref?.$refs[key][0].investigateData) {
              playbookActionInvestigations[valueIndex] = ref.$refs[key][0].investigateData
            }
            valueIndex++
          }
        })
      }
      const playbookAction = ref.playbookAction
      if (
        ref.actions.some((item) => {
          return item.val === 'analyze'
        })
      ) {
        if (ref.analyzeCheckbox) {
          playbookActionInvestigations.push(ref?.playbookActionInvestigationAnalyzeData)
        }
        playbookActionAnalyzers = ref.analysisEngines.filter((item) => {
          if (item && item.analysisEngineType && item.analysisEngineType) {
            const { isSendFile, isSendFileHash, isSendUrl, isSendIp } = item.analysisEngineType
            if (!isSendFile) {
              item.isCheckFile = false
            }
            if (!isSendFileHash) {
              item.isCheckHash = false
            }
            if (!isSendUrl) {
              item.isCheckUrl = false
            }
            if (!isSendIp) {
              item.isCheckSenderIP = false
            }
          }
          return item.selected === true
        })
      }

      const targetUserType = ref.targetUserType
      const targetUsers = ref.tarUsers
      const playbookActionNotifications = []
      let index = 0
      const playbookActionStatus = ref.playbookActionStatus

      for (let i = 0; i < targetUserType.length; i++) {
        if ((targetUsers[i] && targetUsers[i] !== null) || targetUserType[i] === 'Reporter') {
          playbookActionNotifications[index] = {
            targetUserType: targetUserType[i],
            targetUsers: targetUserType[i] === 'Reporter' ? [] : targetUsers[i],
            emailTemplateId: this.$refs.refActionItem.notifyTemplates[i],
            analysisResultFilters: this.$refs.refActionItem.analysisResults[i]
          }
          index++
        }
      }
      const payload = {
        name: this.name,
        description: this.description,
        priority: this.priority,
        tags: this.tags,
        isActive: this.isActive,
        resourceId: this.playbookId,
        playbookAction,
        playbookActionStatus,
        playbookActionNotifications,
        playbookActionAnalyzers,
        playbookActionInvestigations: playbookActionInvestigations.filter(Boolean),
        condition: this.condition
      }

      if (!playbookActionStatus.actionStatusType) {
        delete payload.playbookActionStatus
      }

      if (ref.$refs.refForm.validate()) {
        this.saveDisable = true
        updatePlaybook(payload)
          .then(() => {
            this.$emit('closeFormWithUpdate')
          })
          .finally(() => (this.saveDisable = false))
      } else {
        return this.$nextTick(() => {
          const el = ref.$refs.refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    nextStep() {
      if (this.findHasError(this.query)) {
        let isFormValid = true
        if (this.activeStep === 2) {
          isFormValid = this.$refs.refStep2Form.validate()
        } else if (this.activeStep === 1) {
          isFormValid = this.$refs.refStep1Form.validate()
        }
        const ref = this.$refs.refStep1Form
        const ref2 = this.$refs.refStep2Form
        if (this.activeStep === 1 && !ref.validate()) {
          return this.$nextTick(() => {
            const el = ref.$el.querySelector('.error--text')
            scrollToComponent(el)
          })
        } else if (this.activeStep === 2 && !ref2.validate()) {
          return this.$nextTick(() => {
            const el = ref2.$el.querySelector('.error--text')
            scrollToComponent(el)
          })
        }
        if (isFormValid) {
          this.transformQuery()
          this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
        }
      } else {
        this.isValid = true
      }
    },
    transformQuery() {
      this.condition = {
        operator: this.query.logicalOperator,
        ...this.getQuery(this.query.children)
      }
      const a = this.condition
      this.newQuery = {
        logicalOperator: a.operator,
        children: [...this.refGetQuery(a.conditionGroups, 'conditionGroups')]
      }
    },
    refGetQuery(children, key) {
      return children.map((item) => {
        if (key === 'conditionGroups') {
          let children = []
          if (item.conditionItems) {
            children.push(this.refGetQuery(item.conditionItems, 'conditionItems'))
          }
          if (item.conditionGroups) {
            children.push(this.refGetQuery(item.conditionGroups, 'conditionGroups'))
          }
          let temp = []
          if (children.length > 1) {
            children.forEach((item) => {
              item.forEach((i) => {
                temp.push(i)
              })
            })
          }
          return {
            type: 'query-builder-group',
            query: {
              logicalOperator: item.operator.toUpperCase(),
              children: children.length > 1 ? temp : children[0]
            }
          }
        } else {
          return {
            type: 'query-builder-rule',
            query: {
              ...item,
              operand: item.FieldName || item.fieldName,
              rule: 'conditions'
            }
          }
        }
      })
    },

    getQuery(children) {
      const conditionItems = []
      const conditionGroups = []
      children.forEach((obj) => {
        if (obj.type === 'query-builder-group') {
          conditionGroups.push({
            operator: obj.query.logicalOperator,
            ...this.getQuery(obj.query.children)
          })
        } else {
          conditionItems.push({
            ...obj.query,
            fieldName: obj.query.operand,
            FieldName: obj.query.operand
          })
        }
      })
      const obj = {}
      if (conditionGroups.length > 0) {
        obj['conditionGroups'] = conditionGroups
      }
      if (conditionItems.length > 0) {
        obj['conditionItems'] = conditionItems
      }
      return obj
    },
    findHasError(object) {
      const keys = Object.keys(object)
      keys.forEach((key) => {
        if (object.hasOwnProperty(key)) {
          if (
            key === 'children' &&
            object[key].constructor.name === 'Array' &&
            object[key].length === 0
          ) {
            this.isValid = false
            return this.isValid
          } else if (
            object[key] !== null &&
            object[key] !== undefined &&
            object[key].constructor &&
            (object[key].constructor.name === 'Object' || object[key].constructor.name === 'Array')
          ) {
            this.isValid = this.findHasError(object[key])
          }
        }
      })
      return this.isValid
    },
    prevStep() {
      this.activeStep = this.activeStep <= 1 ? 1 : this.activeStep - 1
    },
    cancelForm() {
      const currentFormValues = {
        name: this.name,
        description: this.description,
        priority: this.priority,
        tags: this.tags,
        isActive: this.isActive,
        query: this.query,
        actions: [...this.$refs.refActionItem.getCurrentActions()]
      }
      const isChanged = isDifferent(currentFormValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('cancelForm')
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('cancelForm')
        }
      })
    },
    callForGetPlaybook() {
      getPlaybook(this.playbookId).then((response) => {
        const { data } = response.data
        this.name = data.name
        this.isActive = data.isActive
        this.description = data.description
        this.priority = data.priority
        this.tags = data.tags
        this.query = {
          logicalOperator: data.condition.operator.toUpperCase(),
          children: [...this.refGetQuery(data.condition.conditionGroups, 'conditionGroups')]
        }

        data.playbookActionInvestigations.forEach((item) => {
          item.scanTypes = item?.scanConfigurationDetails?.map((scan) => {
            if (scan.type.toLowerCase() === 'outlook') {
              scan['mailConfigurationName'] = 'Outlook'
            }
            return scan
          })
        })
        this.playbookAction = data.playbookAction
        this.playbookActionAnalyzers = data.playbookActionAnalyzers
        this.editedNotifications = data.playbookActionNotifications
        this.editedPlaybookActionInvestigations = data.playbookActionInvestigations.filter(
          (item) => {
            return item.isCreatedByAnalyzer !== true
          }
        )

        const indexOfAnalyzeItem = data.playbookActionInvestigations.findIndex((item) => {
          return item.isCreatedByAnalyzer
        })
        if (indexOfAnalyzeItem !== -1) {
          this.$refs.refActionItem.playbookActionInvestigationAnalyzeData =
            data.playbookActionInvestigations[indexOfAnalyzeItem]
          const hasAnalyze = this.$refs.refActionItem.actions.some((item) => {
            return item.val === 'analyze'
          })
          if (!hasAnalyze) {
            this?.$refs?.refActionItem?.addAction('analyze')
          }
          this.$refs.refActionItem.analyzeCheckbox = true
        } else if (this.playbookActionAnalyzers.length > 0) {
          this?.$refs?.refActionItem?.addAction('analyze')
        }
        if (
          data.playbookActionStatus &&
          data.playbookActionStatus.actionStatusType &&
          data.playbookActionStatus.actionStatusType !== 'Unknown'
        ) {
          this.$refs.refActionItem.playbookActionStatus.actionStatusType =
            data.playbookActionStatus.actionStatusType
          this?.$refs?.refActionItem?.addAction('status')
        }
        this.initialFormValues = {
          ...this.initialFormValues,
          name: this.name,
          description: this.description,
          priority: this.priority,
          tags: this.tags,
          isActive: this.isActive,
          query: this.query,
          actions: [...this.$refs.refActionItem.getCurrentActions()]
        }
      })
    }
  }
}
</script>
