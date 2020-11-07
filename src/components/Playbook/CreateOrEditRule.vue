<template>
  <div class="playbook-rule-form">
    <div class="flex-grow-1 no-gutters">
      <v-col>
        <v-stepper light v-model="activeStep" class="wizard">
          <v-stepper-header class="wizard__header">
            <v-stepper-step :complete="activeStep > 1" step="1">Rule Info</v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="activeStep > 2" step="2">Conditions</v-stepper-step>
            <v-divider />
            <v-stepper-step step="3">Actions</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <!-- STEP 1 -->
            <v-stepper-content step="1">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="v-card-form-title">
                    Rule Information
                  </v-list-item-title>
                  <v-list-item-title class="v-card-sub-header">
                    Enter rule information
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-form ref="refStep1Form" lazy-validation>
                <v-list-item class="mt-6" style="margin-bottom: 17px;">
                  <v-list-item-content>
                    <label class="bottom-margin">Rule Name</label>
                    <v-text-field
                      placeholder="Enter a name for the rule"
                      outlined
                      dense
                      hint="*Required"
                      persistent-hint
                      autocomplete="off"
                      v-model.trim="name"
                      :rules="[
                        (v) => validations.required(v, 'Required'),
                        (v) => validations.maxLength(v, 150, 'Max 150 characters')
                      ]"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="margin-top">
                  <v-list-item-content class="pt-0">
                    <label class="bottom-margin">Description</label>
                    <v-textarea
                      placeholder="Describe the rule"
                      outlined
                      dense
                      no-resize
                      v-model.trim="description"
                      :rules="[(v) => validations.maxLength(v, 1000, 'Max 1000 characters')]"
                      autocomplete="disabled"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="margin-top">
                  <v-list-item-content>
                    <label>Priority</label>
                    <v-list-item-title class="v-card-sub-header bottom-margin">
                      Rules with higher priority override lower priority rules
                    </v-list-item-title>
                    <div class="playbook-rule-form__radio-group mb-6">
                      <v-radio-group v-model.trim="priority" row hide-details dense>
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
                    <label>Tags</label>
                    <v-list-item-title class="v-card-sub-header bottom-margin">
                      Define tags for the rule
                    </v-list-item-title>
                    <v-combobox
                      v-model.trim="tags"
                      :items="[]"
                      chips
                      deletable-chips
                      :search-input.sync="tagsearch"
                      @keyup.tab="updateTags"
                      @paste="updateTags"
                      outlined
                      class="hide-caret"
                      multiple
                      dense
                      placeholder="Enter tag and press enter key"
                      persistent-hint
                      small-chips
                      :return-object="false"
                      hide-details="auto"
                    ></v-combobox>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="margin-top">
                  <v-list-item-content>
                    <v-switch
                      v-model="isActive"
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
                  Conditions
                </v-list-item-title>
                <v-list-item-title class="v-card-sub-header">
                  Define conditions to filter reported emails and take actions
                </v-list-item-title>
              </v-list-item-content>
              <vue-query-builder
                :max-depth="4"
                class="w-100"
                :labels="label"
                :rules="rules"
                v-model="query"
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
                  Actions
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
    <!-- TODO: Convert footer block to common component -->
    <div class="wizard__footer">
      <div class="text-left">
        <v-btn class="playbook-rule-form__button" outlined rounded color="error" @click="cancelForm"
          >CANCEL</v-btn
        >
      </div>

      <div>
        <v-btn
          v-if="canPrev"
          class="playbook-rule-form__button mr-4"
          outlined
          rounded
          color="cyan"
          @click="prevStep"
        >
          BACK
        </v-btn>

        <v-btn
          v-if="canNext"
          class="playbook-rule-form__button"
          style="color: white;"
          rounded
          color="#2196f3"
          @click="nextStep"
        >
          NEXT
        </v-btn>

        <v-btn
          v-if="!canNext"
          class="playbook-rule-form__button white--text"
          rounded
          color="#2196f3"
          @click="handleSave"
        >
          SAVE
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import VueQueryBuilder from 'vue-query-builder'
import QueryBuilderGroup from '../Common/QueryBuilder/CustomGroup'
import ActionItem from './ActionItem'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import { maxLength, required } from '../../utils/validations'
import { createPlaybook, getPlaybook, updatePlaybook } from '../../api/playbook'
import { scrollToComponent } from '@/utils/functions'

export default {
  name: 'CreateOrEditRule',
  components: { ActionItem, VueQueryBuilder, QueryBuilderGroup },
  props: {
    playbookId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      actionData: {},
      actionList: [{ id: 0 }],
      isValid: true,
      playbookAction: {},
      totalStep: 3,
      activeStep: 1,
      form1: false,
      form2: false,
      form3: false,
      tagsearch: '',
      name: '',
      description: '',
      priority: 'Medium',
      tags: [],
      isActive: true,
      newQuery: null,
      playbookActionAnalyzers: null,
      addedQuery: null,
      editedNotifications: [],
      editedPlaybookActionInvestigations: [],
      validations: {
        required,
        maxLength
      },
      frontendObj: {},
      condition: {},
      nameRules: {
        required: (v) => (v && v.length <= 150) || 'Name must between 1-150 characters',
        empty: (v) => (v && !v.startsWith(' ')) || 'Name cannot start with space'
      },
      generalRules: {
        ip: {
          required: (v) => {
            return (v && v.length <= 255) || 'IP must between 1 - 255 characters'
          },
          format: (v) => {
            return (
              /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/gi.test(
                v
              ) || 'Invalid ip'
            )
          }
        },
        from: {
          required: (v) => (v && v.length <= 255) || 'From must between 1 - 255 characters',
          format: (v) => /\S+@\S+\.\S+/gi.test(v) || 'Invalid from address'
        },
        to: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => /\S+@\S+\.\S+/gi.test(v) || 'Invalid to address'
        },
        cc: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => /\S+@\S+\.\S+/gi.test(v) || 'Invalid cc address'
        },
        bcc: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => /\S+@\S+\.\S+/gi.test(v) || 'Invalid bcc address'
        },
        subject: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // string kontrolü
        },
        from_name: {
          required: (v) => (v && v.length <= 1000) || 'It must between 1 - 1000 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // string kontrolü
        },
        url: {
          required: (v) => (v && v.length <= 1000) || 'It must between 1 - 1000 characters',
          format: (v) =>
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(
              v
            ) || 'invalid url'
        },
        keyword: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => {
            return (v && !v.startsWith(' ')) || 'Cannot start with space'
          } // format ekle
        },
        size: {
          required: (v) => false,
          format: (v) => false
        },
        name: {
          required: (v) => (v && v.length <= 255) || 'It must between 1 - 255 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // format ekle
        },
        sha512: {
          required: (v) => (v && v.length <= 512) || 'It must between 1 - 512 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // format ekle
        },
        md5: {
          required: (v) => (v && v.length <= 128) || 'It must between 1 - 128 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // format ekle
        },
        extentions: {
          required: (v) => (v && v.length <= 10) || 'It must between 1 - 10 characters',
          format: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space' // format ekle
        }
      },
      label: {
        matchType: 'Match Type',
        matchTypes: [
          { id: 'OR', label: 'OR' },
          { id: 'AND', label: 'AND' }
        ],
        addRule: 'ADD CONDITION',
        addGroup: 'ADD CONDITION SET',
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
            { text: 'Attachment extension', value: 'AttachmentExtension' },
            'Custom syntax',
            'Analysis result'
          ],
          operandsFrom: ['Email', 'Domain', 'Regex'],
          operandsTo: ['Email', 'Group', 'Domain', 'Regex'],
          operandsCC: ['Email', 'Group', 'Domain', 'Regex'],
          operandsAnalysisResult: ['Phishing', 'Malicious', 'Non-malicious'],
          operandsSenderIP: [
            { text: 'is equal to', value: 'Equal' },
            { text: 'is not equal to', value: 'IsNotEqual' },
            { text: 'exists', value: 'Exists' },
            { text: 'does not exist', value: 'DoesNotExist' }
          ],
          operators: [
            { text: 'contains', value: 'Contains' },
            { text: 'does not contain', value: 'DoesNotContain' },
            { text: 'is equal to', value: 'Equal' },
            { text: 'is not equal to', value: 'IsNotEqual' },
            { text: 'exists', value: 'Exists' },
            { text: 'does not exist', value: 'DoesNotExist' }
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
      }
    }
  },
  mounted() {},
  computed: {
    canNext() {
      return this.activeStep < this.totalStep
    },
    canPrev() {
      return this.activeStep > 1
    }
  },
  methods: {
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
        keys.map((key, index) => {
          if (ref.$refs[key].length > 0 && key !== 'refForm') {
            playbookActionInvestigations[valueIndex] = ref.$refs[key][0].investigateData
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
            emailTemplateId: 1
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
        playbookAction,
        playbookActionAnalyzers,
        playbookActionNotifications,
        playbookActionInvestigations,
        condition: this.condition
      }

      if (ref.$refs.refForm.validate()) {
        createPlaybook(payload)
          .then((response) => {
            this.$store.dispatch('common/createSnackBar', {
              message: 'Playbook has been created',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-check-circle'
            })
            this.$emit('closeFormWithUpdate')
          })
          .catch((error) => {})
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
        keys.map((key, index) => {
          if (ref.$refs[key].length > 0 && key !== 'refForm') {
            playbookActionInvestigations[valueIndex] = ref.$refs[key][0].investigateData
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
          return item.selected === true
        })
      }

      const targetUserType = ref.targetUserType
      const targetUsers = ref.tarUsers
      const playbookActionNotifications = []
      let index = 0
      for (let i = 0; i < targetUserType.length; i++) {
        if ((targetUsers[i] && targetUsers[i] !== null) || targetUserType[i] === 'Reporter') {
          playbookActionNotifications[index] = {
            targetUserType: targetUserType[i],
            targetUsers: targetUserType[i] === 'Reporter' ? [] : targetUsers[i],
            emailTemplateId: 1
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
        playbookActionNotifications,
        playbookActionAnalyzers,
        playbookActionInvestigations,
        condition: this.condition
      }

      if (ref.$refs.refForm.validate()) {
        updatePlaybook(payload)
          .then((response) => {
            this.$store.dispatch('common/createSnackBar', {
              message: 'Playbook has been updated',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-check-circle'
            })
            this.$emit('closeFormWithUpdate')
          })
          .catch((error) => {})
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
        if (isFormValid) {
          this.transformQuery()
          this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
        }
        const ref = this.$refs.refStep1Form
        if (this.activeStep === 1 && !this.$refs.refStep1Form.validate()) {
          return this.$nextTick(() => {
            const el = ref.$el.querySelector('.error--text')
            scrollToComponent(el)
          })
        }
      } else {
        this.$store.dispatch('common/createSnackBar', {
          message: 'Condition set can not be empty',
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
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
      const aqsa = {
        logicalOperator: this.newQuery.operator,
        children: this.newQuery.children.map((item) => {})
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
            const ret = []
            children.map((item) => {
              let returnObj = {}
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
      this.$emit('cancelForm')
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
    removeAction(event) {
      let a = this.actionList.findIndex((x, i) => x.id == event)
      this.actionList.splice(a, 1)
    },
    callForGetPlaybook() {
      getPlaybook(this.playbookId)
        .then((response) => {
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
        })
        .catch((error) => {})
    }
  },
  created() {
    if (this.playbookId) {
      this.callForGetPlaybook()
    }
  }
}
</script>

<style lang="scss" src="./CreateOrEditRule.scss" />
