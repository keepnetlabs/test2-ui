<template>
  <div flat class="playbook-rule-form">
    <v-card flat light class="header">
      <v-list-item class="pl-0 pr-0">
        <div class="v-btn v-btn__icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">mdi-plus</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="">Create New Rule</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>

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
              <v-row class="pt-1">
                <v-col lg="5">
                  <v-form ref="refStep1Form" lazy-validation>
                    <v-list-item>
                      <v-list-item-content>
                        <label class="bottom-margin">Rule Name</label>
                        <v-text-field
                          placeholder="Enter a name for the rule"
                          outlined
                          v-model="name"
                          :rules="[
                            (v) => validations.required(v, 'Required'),
                            (v) => validations.maxLength(v, 150, 'Max 150 characters')
                          ]"
                        ></v-text-field>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <label class="bottom-margin">Description</label>
                        <v-textarea
                          placeholder="Describe the role"
                          outlined
                          v-model="description"
                          :rules="[(v) => validations.maxLength(v, 1000, 'Max 1000 characters')]"
                        />
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <label>Priority</label>
                        <v-list-item-title class="v-card-sub-header bottom-margin">
                          Rules with higher priority override lower priority rules
                        </v-list-item-title>
                        <div class="playbook-rule-form__radio-group">
                          <v-radio-group v-model="priority" row>
                            <v-radio :ripple="false" value="Very Low" label="Very Low" />
                            <v-radio :ripple="false" value="Low" label="Low" />
                            <v-radio :ripple="false" value="Medium" label="Medium" />
                            <v-radio :ripple="false" value="High" label="High" />
                            <v-radio :ripple="false" value="Very High" label="Very High" />
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
                          v-model="tags"
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
                          persistent-hint
                          small-chips
                          :return-object="false"
                          hide-details="auto"
                        ></v-combobox>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-switch
                          :ripple="false"
                          v-model="isActive"
                          :label="isActive ? 'Active' : 'Inactive'"
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-form>
                </v-col>
              </v-row>
            </v-stepper-content>
            <!-- STEP 2 -->
            <v-stepper-content step="2">
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
              <v-row>
                <v-col>
                  <pre>{{ JSON.stringify(query, null, 2) }}</pre>
                </v-col>
                <v-col>
                  <pre>{{ JSON.stringify(condition, null, 2) }}</pre>
                </v-col>
                <v-col>
                  <pre>{{ JSON.stringify(newQuery, null, 2) }}</pre>
                </v-col>
              </v-row>
            </v-stepper-content>
            <!-- STEP 3 -->
            <v-stepper-content step="3">
              <v-container fluid class="playbook-actions">
                <v-row>
                  <v-col class="v-col" cols="12">
                    <ActionItem :actionData.sync="actionData" />
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </div>
    <!-- TODO: Convert footer block to common component -->
    <div class="wizard__footer">
      <div class="text-left">
        <v-btn outlined rounded color="error" @click="cancelForm">CANCEL</v-btn>
      </div>

      <div>
        <v-btn v-if="canPrev" class="mr-3" outlined rounded color="cyan" @click="prevStep">
          PREVIOUS
        </v-btn>

        <v-btn v-if="canNext" rounded color="primary" @click="nextStep">
          NEXT
        </v-btn>

        <v-btn v-if="!canNext" rounded color="primary">
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

export default {
  name: 'CreateOrEditRule',
  components: { ActionItem, VueQueryBuilder, QueryBuilderGroup },
  data() {
    return {
      actionData: {},
      actionList: [{ id: 0 }],
      isValid: true,
      totalStep: 3,
      activeStep: 3,
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
        addGroup: 'ADD NEW CONDITION SET',
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
            'Sender IP',
            'Subject',
            'Keyword',
            'Attachment name',
            'Attachment hash',
            'Attachment extension',
            'Custom syntax',
            'Analysis result'
          ],
          operandsFrom: ['Email', 'Domain', 'Regex'],
          operandsTo: ['Email', 'Group', 'Domain', 'Regex'],
          operandsCC: ['Email', 'Group', 'Domain', 'Regex'],
          operandsAnalysisResult: ['Phishing', 'Malicious', 'Non-malicious'],
          operandsSenderIP: ['is equal to', 'is not equal to', 'exist', 'does not exist'],
          operators: [
            'contains',
            'does not contain',
            'is equal to',
            'is not equal to',
            'exist',
            'does not exist'
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
              children: [
                {
                  type: 'query-builder-group',
                  query: {
                    logicalOperator: 'OR',
                    children: [
                      {
                        type: 'query-builder-rule',
                        query: {
                          rule: 'conditions',
                          operator: 'contains',
                          operand: 'From',
                          value: 'gurkan.ugurlu@keepnetlabs.com',
                          format: 'Email'
                        }
                      }
                    ]
                  }
                },
                {
                  type: 'query-builder-group',
                  query: {
                    logicalOperator: 'OR',
                    children: [
                      {
                        type: 'query-builder-rule',
                        query: {
                          rule: 'conditions',
                          operator: 'contains',
                          operand: 'From',
                          value: 'gurkan.ugurlu@keepnetlabs.com',
                          format: 'Email'
                        }
                      },
                      {
                        type: 'query-builder-rule',
                        query: {
                          rule: 'conditions',
                          operator: 'contains',
                          operand: 'From',
                          value: 'ugurlu.gurkan96@gmail.com',
                          format: 'Email'
                        }
                      }
                    ]
                  }
                },
                {
                  type: 'query-builder-rule',
                  query: {
                    rule: 'conditions',
                    operator: 'contains',
                    operand: 'From',
                    value: 'gurkan.ugurlu@keepnetlabs.com',
                    format: 'Email'
                  }
                }
              ]
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
      } else {
        this.$store.dispatch('common/createSnackBar', {
          message: 'Condition set must not be empty !',
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
          if (item.conditionGroups) {
            children.push(this.refGetQuery(item.conditionGroups, 'conditionGroups'))
          }
          if (item.conditionItems) {
            children.push(this.refGetQuery(item.conditionItems, 'conditionItems'))
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
            console.log('temp', temp)
          }
          return {
            type: 'query-builder-group',
            query: {
              logicalOperator: item.operator,
              children: children.length > 1 ? temp : children[0]
            }
          }
        } else {
          return {
            type: 'query-builder-rule',
            query: {
              ...item
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
            ...obj.query
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
        this.tags.push(...this.tagsearch.split(','))
        this.$nextTick(() => {
          this.tagsearch = ''
        })
      })
    },
    removeAction(event) {
      let a = this.actionList.findIndex((x, i) => x.id == event)
      this.actionList.splice(a, 1)
    }
  }
}
</script>

<style lang="scss" src="./CreateOrEditRule.scss" />
