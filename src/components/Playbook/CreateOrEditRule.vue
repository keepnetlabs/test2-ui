<template>
  <div flat class="playbook-rule-form">
    <v-row class="flex-grow-0 no-gutters">
      <v-col>
        <v-card flat light class="header">
          <v-list-item class="pl-0 pr-0">
            <div class="v-btn v-btn__icon-wrapper">
              <v-icon medium left color="blue" class="ml-2">mdi-plus</v-icon>
            </div>
            <v-list-item-content class="pt-0 pb-0">
              <v-list-item-title class="v-card-headline">Create New Rule</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="flex-grow-1 no-gutters">
      <v-col>
        <v-stepper light v-model="activeStep" class="wizard">
          <v-stepper-header class="wizard__header">
            <v-stepper-step :complete="activeStep > 1" step="1">Rule Info</v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="activeStep > 2" step="2">Condutions</v-stepper-step>
            <v-divider />
            <v-stepper-step step="3">Actions</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <!-- STEP 1 -->
            <v-stepper-content step="1" class="col-5">
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
              <v-form ref="form" v-model="form1" lazy-validation>
                <v-list-item class="pt-1 0 pa-0">
                  <v-list-item-content>
                    <label>Rule Name</label>
                    <v-text-field
                      placeholder="Enter a name for the rule"
                      outlined
                      v-model="name"
                      :rules="[nameRules.required, nameRules.empty]"
                      required
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label>Description</label>
                    <v-textarea
                      placeholder="Describe the role"
                      outlined
                      v-model="description"
                      required
                      hide-details="auto"
                    />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <label class="mb-0">Priority</label>
                    <v-list-item-title class="v-card-sub-header">
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
                    <label class="mb-0">Tags</label>
                    <v-list-item-title class="v-card-sub-header">
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
                      required
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
            </v-stepper-content>
            <!-- STEP 2 -->
            <v-stepper-content step="2">
              <vue-query-builder
                :max-depth="2"
                class="w-100"
                :labels="label"
                :rules="rules"
                v-model="query"
              >
                <template v-slot:default="slotProps">
                  <query-builder-group v-bind="slotProps" :query.sync="query" />
                </template>
              </vue-query-builder>
            </v-stepper-content>
            <!-- STEP 3 -->
            <v-stepper-content step="3">
              <v-container fluid class="playbook-actions">
                <v-row :ref="`itemID-${index}`" v-for="(item, index) in actionList" :key="index">
                  <v-col class="v-col" cols="12">
                    <ActionItem v-bind:act.sync="act" :id="item.id" @remove="removeAction" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn text color="primary" @click="addAction()">
                      <v-icon>mdi-plus</v-icon> Add Action
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
    <!-- TODO: Convert footer block to common component -->
    <v-row justify="end" class="wizard__footer flex-grow-0 no-gutters">
      <v-col cols="auto" class="justify-start">
        <v-btn outlined rounded color="error" @click="cancelForm">CANCEL</v-btn>
      </v-col>
      <v-spacer />

      <v-col cols="auto" v-if="canPrev" class="mr-3">
        <v-btn outlined rounded color="cyan" @click="prevStep">
          PREVIOUS
        </v-btn>
      </v-col>
      <v-col cols="auto" v-if="canNext">
        <v-btn rounded color="primary" @click="nextStep">
          NEXT
        </v-btn>
      </v-col>
      <v-col cols="auto" v-if="!canNext">
        <v-btn rounded color="primary">
          SAVE
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VueQueryBuilder from 'vue-query-builder'
import QueryBuilderGroup from '../Common/QueryBuilder/CustomGroup'
import ActionItem from './ActionItem'

export default {
  name: 'CreateOrEditRule',
  components: { ActionItem, VueQueryBuilder, QueryBuilderGroup },
  data() {
    return {
      idCounter: 1,
      actionList: [{ id: 0 }],
      totalStep: 3,
      activeStep: 3,
      form1: false,
      form2: false,
      form3: false,
      tagsearch: '',
      name: '',
      description: '',
      priority: '',
      tags: [],
      isActive: true,
      act: {
        actionTypes: ['Mark as', 'Analyse', 'Investigate', 'Notify', 'Tag'],
        markAsOpts: ['Clean', 'Phising', 'Malicious', 'Spam'],
        playbookAction: {
          markType: 'Clean',
          targetUser: '',
          targetGroupId: '',
          tags: ['']
        },
        playbookActionNotifications: [
          {
            targetUserType: 'Groups',
            targetUsers: [],
            emailTemplateId: 1
          }
        ],
        playbookActionAnalyzers: [
          {
            integrationId: 'faczwHLF1Jmw',
            isCheckHash: true,
            isCheckFile: false,
            isCheckUrl: true
          }
        ],
        playbookActionInvestigations: [
          {
            isCreatedByAnalyzer: false,
            expireDate: '2020-05-01 03:17:07.140',
            startDate: '2020-01-01 03:17:07.140',
            endDate: '2020-09-09 03:17:07.140',
            scanTypes: ['Outlook'],
            filters: [
              'From',
              'To',
              'Cc',
              'SenderIp',
              'Subject',
              'Keyword',
              'Url',
              'AttachmentName',
              'AttachmentExtension',
              'AttachmentHash'
            ],
            targetUserType: 'SpecificUsers',
            targetUsers: ['burak@keepnetlabs.com', 'burak.okmen@outlook.com'],
            actionType: 'Notify',
            actionNotifyTargetUserType: 'Reporter',
            actionNotifyTargetUsers: ['4B499616-1D96-4723-93F7-79B1E8F110A7'],
            emailTemplateId: 1
          }
        ]
      },
      condition: {
        operator: 'Or',
        conditionGroups: [
          {
            operator: 'And',
            conditionItems: [
              {
                FieldName: 'To',
                operator: 'Equal',
                Format: 'Email',
                Value: 'burak.okmen@outlook.com'
              }
            ],
            conditionGroups: []
          }
        ]
      },
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
          { id: 'and', label: 'AND' },
          { id: 'or', label: 'OR' }
        ],
        addRule: 'ADD CONDITION',
        addGroup: 'ADD NEW CONDITION SET',
        textInputPlaceholder: 'value'
      },
      operators: [
        'contains',
        'does not contain',
        'is equal to',
        'is not equal to',
        'exist',
        'does not exist'
      ],
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
          operandsAnalysisResult: ['Phising', 'Malicious', 'Non-malicious'],
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
                  type: 'query-builder-rule',
                  query: {
                    rule: 'conditions',
                    operator: 'contains',
                    operand: 'From',
                    format: 'Domain',
                    value: null
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
      this.activeStep = this.activeStep >= this.totalStep ? this.totalStep : this.activeStep + 1
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
