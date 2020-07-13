<template>
  <div class="action-items">
    <!-- <p>{{ id }}</p>
    <p>{{ actionItemType }}</p>
    <p>{{ actions }}</p>
    <p>{{ openEnginesModal }}</p>
    <p>{{ analysisEngines }}</p>
    <p>{{ notifyTemplate }}</p>
    -->
    {{ act.actionTypes }}
    <app-dialog
      size="big"
      :status="openEnginesModal"
      class-name="download-modal"
      @changeStatus="openEnginesModal = false"
    >
      <template v-slot:app-dialog-body>
        <div class="bg-white">
          <div class="">
            <div class="analyze__main__select-row-wrap check-all">
              <div class="checkbox-and-text">
                <v-checkbox
                  class="k-checkbox"
                  color="#2196f3"
                  v-model="acceptAllAnalysisEngines"
                  @change="acceptAllAnalysisEnginesClick"
                />
                <span class="checkbox-text">Select All</span>
              </div>
              <div class="analyze__main__select-row-inline">
                <span type="button" class="analyze__main__select-row-inline__button">
                  Hash
                </span>
                <span type="button" class="analyze__main__select-row-inline__button">
                  File
                </span>
                <span type="button" class="analyze__main__select-row-inline__button">
                  Url
                </span>
              </div>
            </div>
          </div>
          <div>
            <div class="analyze__main__select-row-wrap">
              <div
                v-for="(engine, index) in analysisEngines"
                :key="index"
                class="analyze__main__select-row-wrap__item"
              >
                <div class="checkbox-and-text">
                  <v-checkbox class="k-checkbox" color="#2196f3" v-model="engine.selected" />
                  <span class="checkbox-text">{{ engine.name }}</span>
                </div>
                <div class="analyze__main__select-row-inline">
                  <span
                    class="analyze__main__select-row-inline__button"
                    :class="
                      engine.isSendFileHash
                        ? 'analyze__main__select-row-inline__button-selected'
                        : ''
                    "
                    @click="engine.isSendFileHash = !engine.isSendFileHash"
                  >
                    Hash
                  </span>
                  <span
                    class="analyze__main__select-row-inline__button"
                    :class="
                      engine.isSendFile ? 'analyze__main__select-row-inline__button-selected' : ''
                    "
                    @click="engine.isSendFile = !engine.isSendFile"
                  >
                    File
                  </span>
                  <span
                    class="analyze__main__select-row-inline__button"
                    :class="
                      engine.isSendUrl ? 'analyze__main__select-row-inline__button-selected' : ''
                    "
                    @click="engine.isSendUrl = !engine.isSendUrl"
                  >
                    Url
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="delete-user__footer">
          <v-btn
            @click="openEnginesModal = false"
            color="#f56c6c"
            class="delete-user__footer-button"
            text
            >CANCEL</v-btn
          >
        </div>
      </template>
    </app-dialog>
    <v-row
      v-for="(action, index) in actions"
      :key="index"
      class="vqb-rule rounded-xl action-items__item"
    >
      <v-col md="2" class="mr-2">
        <v-select
          :value="actionsValues[index]"
          :items="act.actionTypes"
          :return-object="true"
          outlined
          placeholder="Select Action Type"
          height="40"
          item-text="name"
          item-value="val"
          @input="setAvailableItems($event, actionsValues[index], index)"
        />
      </v-col>
      <v-col v-if="actionsValues[index].val === 'markAs'" md="2" class="mr-2">
        <v-select v-model="markAsOpts" :items="act.markAsOpts" outlined hide-details />
      </v-col>
      <v-col
        v-if="actionsValues[index].val == 'analyze'"
        md="auto"
        class="mr-2 flex-grow-1 d-flex col-md-auto col analyze__main"
      >
        <v-text-field
          outlined
          placeholder="Select Action Type"
          height="40"
          @click="openEnginesModal = true"
          class="analysis-engines-select"
        >
        </v-text-field>
        <v-col class="analyze__main-checkbox">
          <v-checkbox class="k-checkbox" color="#2196f3" v-model="analyzeCheckbox" />
          <span class="checkbox-text">Investigate according to analyze results</span>
        </v-col>
      </v-col>

      <v-col v-if="actionsValues[index].val == 'tag'" md="auto" class="mr-2 flex-grow-1">
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
        ></v-combobox>
      </v-col>
      <v-col v-if="actionsValues[index].val == 'notify'" md="2" class="mr-2">
        <v-select v-model="notifyType" :items="act.notifyTypes" outlined />
      </v-col>
      <v-col
        v-if="actionsValues[index].val == 'notify' && notifyType == 'A user'"
        md="2"
        class="mr-2"
      >
        <v-autocomplete
          :items="targetUsers"
          :loading="isLoading"
          :search-input.sync="search"
          v-model="targetUsersData"
          color="white"
          item-text="email"
          item-value="resourceId"
          placeholder="Select Target User"
          outlined
          multiple
        ></v-autocomplete>
      </v-col>
      <v-col v-if="notifyType == 'A group'" md="2" class="mr-2">
        <v-select outlined hide-details />
      </v-col>
      <v-col v-if="actionsValues[index].val == 'notify'" md="2" class="mr-2">
        <v-select
          v-model="notifyTemplate"
          :items="act.notifyTemplates"
          item-value="value"
          item-text="label"
          outlined
          hide-details
        />
      </v-col>
      <v-col class="text-right">
        <!-- Remove act button -->
        <v-btn icon @click="removeAction(index, action)">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col md="12" v-if="analyzeCheckbox && actionsValues[index].val == 'analyze'">
        <investigate :act="act" />
      </v-col>
      <v-col v-if="actionsValues[index].val == 'investigate'" md="12">
        <investigate :act="act" />
      </v-col>
    </v-row>
    <v-btn class="playbook-rule-form__button" text color="#2196f3" @click="addAction()">
      <v-icon>mdi-plus</v-icon> Add Action
    </v-btn>
  </div>
</template>

<script>
import { getAnalysisEngine, getTargetUsers } from '../../api/playbook'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import AppDialog from '../AppDialog'
import Investigate from './Investigate'
export default {
  components: { AppDialog, Investigate },
  name: 'ActionItem',
  props: {
    id: Number,
    actionData: Object
  },
  data() {
    return {
      targetUserType: 'AllUsers',
      timerId: null,
      isLoading: false,
      search: '',
      targetUsersData: false,
      analyzeModel: false,
      analyzeCheckbox: false,
      openEnginesModal: false,
      acceptAllAnalysisEngines: false,
      analysisEngines: [],
      actionItemType: 'markAs',
      markAsOpts: 'Clean',
      acceptCheckbox: false,
      tagsearch: '',
      tags: [],
      notifyType: 'The reporter',
      notifyTemplate: '18',
      searchUser: '',
      searchGroup: '',
      targets: [],
      targetUsers: '',
      investigationFilter: ['URLs', 'Attachments'],
      investigationRange: '3 days before and after',
      investigationDuration: '3 days',
      investigateAction: 'Delete email',
      investigateActionNotification: '',
      investigateActionNotificationTemplate: '',
      act: {
        actionTypes: [
          {
            name: 'Mark as',
            val: 'markAs',
            disabled: false
          },
          {
            name: 'Analyze',
            val: 'analyze',
            disabled: false
          },
          {
            name: 'Investigate',
            val: 'investigate',
            disabled: false
          },
          {
            name: 'Notify',
            val: 'notify',
            disabled: false
          },
          {
            name: 'Tag',
            val: 'tag',
            disabled: false
          }
        ],
        notifyTypes: ['The reporter', 'A user', 'A group'],
        markAsOpts: ['Clean', 'Phising', 'Malicious', 'Spam'],
        notifyTemplates: [
          { label: 'IR User Notification', value: '18' },
          { label: 'IR Delete Action Notification', value: '41' },
          { label: 'Incident Investigation', value: '46' },
          { label: 'About to Expire', value: '2282' },
          { label: 'Incident Investigation Progress Report', value: '2311' },
          { label: 'Incident Investigation Suspicious Email Analysis Report', value: '2320' }
        ],
        investigateFilters: ['Subject', 'From', 'To', 'CC', 'Sender IP', 'URLs', 'Attachments'],
        investigateRanges: [
          '1 day before and after',
          '3 days before and after',
          '7 days before and after',
          '2 weeks before and after'
        ],
        investigateDurations: ['1 day', '3 days', '7 days'],
        investigateActions: ['Notify users', 'Delete email', 'Quarantine'],
        investigateActionNotifications: ['Reporter', 'Mailbox owner', 'Group', 'Everyone'],
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
      actions: [],
      actionsValues: []
    }
  },
  mounted() {
    //console.log(this)
    this.getAnalysisEngine()
    this.getTargetUsers()
  },
  methods: {
    asd(e) {
      e.preventDefault()
      this.analyzeModel = ''
    },
    acceptAllAnalysisEnginesClick() {},
    getAnalysisEngine() {
      const payload = {
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'CreateDate',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [{}]
        }
      }
      getAnalysisEngine(payload)
        .then((response) => {
          const data = response.data.data.results.map((item) => {
            return {
              ...item,
              isSendUrl: true,
              isSendFileHash: true,
              isSendFile: true,
              selected: true
            }
          })
          this.analysisEngines = data
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting analysis engines data!'
          })
        })
    },
    updateTags() {
      this.$nextTick(() => {
        this.tags.push(...this.tagsearch.split(','))
        this.$nextTick(() => {
          this.tagsearch = ''
        })
      })
    },
    setAvailableItems(value, oldValue, index) {
      this.actionsValues[index] = value
      this.actions[index] = value
      this.act.actionTypes.map((item, index) => {
        this.actionsValues.map((i) => {
          if (item.val === i.val && item.val !== 'investigate') {
            item.disabled = true
          }
          if (oldValue && oldValue.val !== value.val && item.val === oldValue.val) {
            item.disabled = false
          }
        })
      })
    },
    addAction() {
      const nextAvailableAction = this.act.actionTypes.find((item) => !item.disabled)
      this.act.actionTypes.find((item) => {
        if (
          JSON.stringify(item) === JSON.stringify(nextAvailableAction) &&
          nextAvailableAction.val !== 'investigate'
        ) {
          item.disabled = true
          nextAvailableAction.disabled = true
        }
      })
      this.actions.push(nextAvailableAction)

      const length = this.actions.length
      this.actionsValues[length - 1] = nextAvailableAction
      this.idCounter = this.idCounter + 1
    },
    removeAction(index, action) {
      this.act.actionTypes.find((item) => {
        if (
          JSON.stringify(this.actionsValues[index]) === JSON.stringify(item) &&
          item.val !== 'investigate'
        ) {
          item.disabled = false
        }
      })
      const newIndex = this.actions.findIndex((item) => {
        return JSON.stringify(this.actionsValues[index]) === JSON.stringify(item)
      })

      if (newIndex !== -1) {
        this.actions.splice(newIndex, 1)
        this.actionsValues.splice(index, 1)
      }
    },
    getTargetUsers() {
      const payload = {
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          filterGroups: [
            {
              condition: 'AND',
              filterItems: [
                {
                  fieldName: 'Email',
                  operator: 'Contains',
                  value: this.search || ''
                }
              ],
              filterGroups: []
            }
          ]
        }
      }
      getTargetUsers(payload)
        .then((response) => {
          this.targetUsers = response.data.data.results
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting target users data!'
          })
        })
    }
  },
  created() {
    this.addAction()
  },
  watch: {
    search(val) {
      this.getTargetUsers()
    }
  }
}
</script>
<style lang="scss" src="./ActionItem.scss" />
