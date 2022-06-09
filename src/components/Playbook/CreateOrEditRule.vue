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
            <!-- STEP 1 -->
            <v-stepper-content step="1">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="v-card-form-title">
                    {{ labels.RuleInformation }}
                  </v-list-item-title>
                  <v-list-item-title class="v-card-sub-header">
                    {{ labels.EnterRuleInformation }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-form ref="refStep1Form" lazy-validation>
                <v-list-item class="mt-6" style="margin-bottom: 17px;">
                  <v-list-item-content>
                    <label class="bottom-margin">{{ labels.RuleName }}</label>
                    <InputEntityName
                      v-model.trim="name"
                      id="input--playbook-rule-name"
                      initialPlaceholder="Enter rule name"
                      :entityName="labels.RuleName"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="margin-top">
                  <v-list-item-content class="pt-0">
                    <label class="bottom-margin">{{ labels.Description }}</label>
                    <InputDescription
                      v-model.trim="description"
                      initialPlaceholder="Enter description"
                      entityName="Description"
                      id="input--playbook-description"
                      :maxLength="300"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="margin-top">
                  <v-list-item-content>
                    <label>{{ labels.Priority }}</label>
                    <v-list-item-title class="v-card-sub-header bottom-margin">
                      Rules with higher priority override lower priority rules
                    </v-list-item-title>
                    <div class="playbook-rule-form__radio-group mb-6">
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
                        <v-radio
                          :ripple="false"
                          color="#2196f3"
                          value="VeryHigh"
                          label="Very High"
                        />
                      </v-radio-group>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label>{{ labels.Tags }}</label>
                    <v-list-item-title class="v-card-sub-header bottom-margin">
                      {{ labels.DefineTags }}
                    </v-list-item-title>
                    <k-select
                      v-model.trim="tags"
                      id="input--playbook-tags"
                      type="combobox"
                      :items="[]"
                      chips
                      deletable-chips
                      :search-input.sync="tagsearch"
                      @keyup.tab="updateTags"
                      @paste="updateTags"
                      outlined
                      class="hide-caret playbook_tag-select"
                      multiple
                      dense
                      placeholder="Enter tag and press enter key"
                      persistent-hint
                      small-chips
                      :return-object="false"
                      @input="handleTagItemChange"
                      hide-details="auto"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="mt-5">
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
              <v-list-item-content>
                <v-list-item-title class="v-card-form-title">
                  {{ labels.Conditions }}
                </v-list-item-title>
                <v-list-item-title class="v-card-sub-header" style="white-space: normal;">
                  {{ labels.ConditionsSubHeader }}
                </v-list-item-title>
              </v-list-item-content>
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
                  :actionData.sync="actionData"
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
        :ids="{
          cancelButton: 'btn-cancel--playbook-rules-modal',
          backButton: 'btn-back--playbook-rules-modal',
          nextButton: 'btn-next--playbook-rules-modal',
          saveButton: 'btn-next--add-or-edit-company-manager-modal'
        }"
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
import { maxLength, required } from '@/utils/validations'
import { createPlaybook, getPlaybook, updatePlaybook } from '@/api/playbook'
import { scrollToComponent } from '@/utils/functions'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import { isDifferent } from '@/utils/functions'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import StepperFooter from '@/components/Stepper/StepperFooter'

export default {
  name: 'CreateOrEditRule',
  components: {
    StepperFooter,
    KSelect,
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
      saveDisable: false,
      labels,
      actionData: {},
      actionList: [{ id: 0 }],
      isValid: true,
      playbookAction: {},
      totalStep: 3,
      activeStep: 1,
      tagsearch: '',
      name: '',
      description: '',
      priority: 'Medium',
      tags: [],
      isActive: true,
      newQuery: null,
      playbookActionAnalyzers: null,
      editedNotifications: [],
      editedPlaybookActionInvestigations: [],
      validations: {
        required,
        maxLength
      },
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
    handleTagItemChange(value) {
      const lastValue = value[value.length - 1].trim()
      if (!lastValue) {
        value.splice(value.length - 1, 1)
      } else {
        value[value.length - 1] = value[value.length - 1].substring(0, 20)
      }
    },
    addAction() {
      this.actionList.push({ id: this.idCounter })
      this.idCounter = this.idCounter + 1
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
        keys.map((key) => {
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
          playbookActionInvestigations.push(ref.playbookActionInvestigationAnalyzeData)
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
            emailTemplateId: this.$refs.refActionItem.notifyTemplate
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
        playbookActionInvestigations: playbookActionInvestigations.filter((item) => item),
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
        keys.map((key) => {
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
          playbookActionInvestigations.push(ref.playbookActionInvestigationAnalyzeData)
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
            emailTemplateId: this.$refs.refActionItem.notifyTemplate
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
        playbookActionInvestigations: playbookActionInvestigations.filter((item) => item),
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
            children.map((item) => {
              item.map((i) => {
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
      children.map((obj) => {
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
      keys.map((key) => {
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
    updateTags() {
      this.$nextTick(() => {
        if (this.tagsearch) {
          this.tags.push(...this.tagsearch.split(','))
        }
        this.$nextTick(() => {
          this.tagsearch = ''
        })
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
            this.$refs.refActionItem.addAction('analyze')
          }
          this.$refs.refActionItem.analyzeCheckbox = true
        } else {
          if (this.playbookActionAnalyzers.length > 0) {
            this.$refs.refActionItem.addAction('analyze')
          }
        }
        if (
          data.playbookActionStatus &&
          data.playbookActionStatus.actionStatusType &&
          data.playbookActionStatus.actionStatusType !== 'Unknown'
        ) {
          this.$refs.refActionItem.playbookActionStatus.actionStatusType =
            data.playbookActionStatus.actionStatusType
          this.$refs.refActionItem.addAction('status')
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
  },
  created() {
    if (this.playbookId) {
      this.callForGetPlaybook()
    }
  }
}
</script>
