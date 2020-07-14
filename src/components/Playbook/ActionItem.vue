<template>
  <div class="action-items">
    {{ act.actionTypes }}
    <app-dialog
      size="small"
      :status="openEnginesModal"
      class-name="download-modal"
      @changeStatus="openEnginesModal = false"
      icon="mdi-blur"
      v-if="openEnginesModal"
      title="Select Integrations"
      subtitle="Select Integrations and what data to send"
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
                <span class="checkbox-text-dialog">Select All</span>
              </div>
              <div class="analyze__main__select-row-inline">
                <span type="button" class="analyze__main__select-row-inline__button__title">
                  Hash
                </span>
                <span type="button" class="analyze__main__select-row-inline__button__title">
                  File
                </span>
                <span type="button" class="analyze__main__select-row-inline__button__title">
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
                  <v-checkbox
                    class="k-checkbox"
                    color="#2196f3"
                    v-model="engine.selected"
                    @change="analysisEnginesChange(engine, index)"
                  />
                  <span class="checkbox-text-dialog">{{ engine.name }}</span>
                </div>
                <div class="analyze__main__select-row-inline">
                  <span
                    class="analyze__main__select-row-inline__button"
                    :class="
                      engine.isSendFileHash
                        ? 'analyze__main__select-row-inline__button-selected'
                        : ''
                    "
                    @click="hashChange(engine.isSendFileHash, index)"
                  >
                    Hash
                  </span>
                  <span
                    class="analyze__main__select-row-inline__button"
                    :class="
                      engine.isSendFile ? 'analyze__main__select-row-inline__button-selected' : ''
                    "
                    @click="fileChange(engine.isSendFile, index)"
                  >
                    File
                  </span>
                  <span
                    class="analyze__main__select-row-inline__button"
                    :class="
                      engine.isSendUrl ? 'analyze__main__select-row-inline__button-selected' : ''
                    "
                    @click="urlChange(engine.isSendUrl, index)"
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
          <v-btn
            text
            color="#2196f3"
            class="k-dialog__button"
            @click="getSelectedIntegrations(), (openEnginesModal = false)"
            >CONFIRM</v-btn
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
        <v-select v-model="playbookAction.markType" :items="act.markAsOpts" outlined hide-details />
      </v-col>
      <v-col
        v-if="actionsValues[index].val === 'analyze'"
        md="auto"
        class="mr-2 flex-grow-1 d-flex col-md-auto col analyze__main"
      >
        <v-text-field
          outlined
          :placeholder="`${getSelectedIntegrations()} integrations selected `"
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

      <v-col v-if="actionsValues[index].val === 'tag'" md="auto" class="mr-2 flex-grow-1">
        <v-combobox
          v-model="playbookAction.tags"
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
          placeholder="Enter tags and press enter key"
          required
        ></v-combobox>
      </v-col>
      <v-col v-if="actionsValues[index].val === 'notify'" md="2" class="mr-2">
        <v-select
          v-model="targetUserType[index]"
          :items="act.notifyTypes"
          outlined
          @input="tarUsers[index] = []"
        />
      </v-col>
      <v-col
        v-if="actionsValues[index].val === 'notify' && targetUserType[index] === 'Users'"
        md="5"
        class="mr-2"
      >
        <v-autocomplete
          :items="targetUsers"
          :loading="isLoading"
          :search-input.sync="search"
          v-model="tarUsers[index]"
          color="white"
          item-text="email"
          item-value="email"
          placeholder="Select Target User"
          outlined
          multiple
          small-chips
          deletable-chips
        ></v-autocomplete>
      </v-col>
      <v-col
        v-if="actionsValues[index].val === 'notify' && targetUserType[index] === 'Groups'"
        md="5"
        class="mr-2"
      >
        <v-combobox
          :items="targetUsersList"
          placeholder="Select user groups"
          outlined
          class="edit-select target-users-select-multi"
          v-model="tarUsers[index]"
          item-text="name"
          item-value="resourceId"
          multiple
          dense
          deletable-chips
          :return-object="false"
          persistent-hint
          small-chips
          hide-details
        ></v-combobox>
      </v-col>
      <v-col v-if="actionsValues[index].val === 'notify'" md="2" class="mr-2">
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
        <v-btn icon @click="removeAction(index, action)" v-if="action.val !== 'markAs'">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col md="12" v-if="analyzeCheckbox && actionsValues[index].val === 'analyze'">
        <investigate :investigateData="playbookActionInvestigationAnalyzeData" :act="act" />
      </v-col>
      <v-col v-if="actionsValues[index].val == 'investigate'" md="12">
        <investigate
          :investigateData="playbookActionInvestigations[index]"
          :index="index"
          :isCreatedByAnalyzer="true"
          :ref="`refInvestigate${-index}`"
          :act="act"
        />
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
import { mapGetters } from 'vuex'
export default {
  components: { AppDialog, Investigate },

  name: 'ActionItem',
  props: {
    id: Number,
    actionData: Object,
    resourceId: String,
    editedActions: Object,
    editedPlaybookActionAnalyzers: Array,
    editedNotifications: Array,
    editedPlaybookActionInvestigations: Array
  },
  data() {
    return {
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
      targetUserType: [],
      notifyTemplate: '18',
      searchUser: '',
      searchGroup: '',
      targets: [],
      targetUsers: '',
      tarUsers: [],
      investigationFilter: ['URLs', 'Attachments'],
      investigationRange: '3 days before and after',
      investigationDuration: '3 days',
      investigateAction: 'Delete email',
      investigateActionNotification: 'Reporter',
      investigateActionNotificationTemplate: '18',
      playbookActionInvestigations: [],
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
        notifyTypes: ['Reporter', 'Users', 'Groups'],
        markAsOpts: ['Clean', 'Phishing', 'Malicious', 'Spam'],
        notifyTemplates: [
          { label: 'IR User Notification', value: '18' },
          { label: 'IR Delete Action Notification', value: '41' },
          { label: 'Incident Investigation', value: '46' },
          { label: 'About to Expire', value: '2282' },
          { label: 'Incident Investigation Progress Report', value: '2311' },
          { label: 'Incident Investigation Suspicious Email Analysis Report', value: '2320' }
        ],
        investigateFilters: [
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
        investigateRanges: [
          '1 day before and after',
          '3 days before and after',
          '7 days before and after',
          '2 weeks before and after'
        ],
        investigateDurations: ['1 day', '3 days', '7 days'],
        investigateActions: [
          'Notify',
          { text: 'Delete email', value: 'DeleteEmail' },
          'Quarantine'
        ],
        investigateActionNotifications: ['Reporter', 'Mailbox owner', 'Group', 'Everyone']
      },
      actions: [],
      actionsValues: [],
      playbookAction: {
        markType: 'Clean',
        tags: []
      },
      playbookActionInvestigationAnalyzeData: {
        isCreatedByAnalyzer: true,
        scanTypes: ['Outlook'],
        filters: [],
        expireDate: new Date(new Date().setDate(new Date().getDate() + 3))
          .toISOString()
          .split('T')
          .join(' ')
          .split('.')[0],
        startDate: new Date(new Date().setDate(new Date().getDate() - 1))
          .toISOString()
          .split('T')
          .join(' ')
          .split('.')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 1))
          .toISOString()
          .split('T')
          .join(' ')
          .split('.')[0],
        targetUserType: 'AllUsers',
        targetUsers: [],
        actionType: 'Notify',
        actionNotifyTargetUserType: 'Reporter',
        actionNotifyTargetUsers: [],
        emailTemplateId: 1
      },

      playbookActionAnalyzers: []
    }
  },
  methods: {
    getSelectedIntegrations() {
      return this.analysisEngines.filter((item) => item.selected).length
    },
    checkAllDataChecked(index) {
      this.analysisEngines[index].selected =
        this.analysisEngines[index].isSendFileHash ||
        this.analysisEngines[index].isSendFile ||
        this.analysisEngines[index].isSendUrl
    },
    hashChange(val, index) {
      this.analysisEngines[index].isSendFileHash = !val
      this.checkAllDataChecked(index)
    },
    fileChange(val, index) {
      this.analysisEngines[index].isSendFile = !val
      this.checkAllDataChecked(index)
    },
    urlChange(val, index) {
      this.analysisEngines[index].isSendUrl = !val
      this.checkAllDataChecked(index)
    },
    acceptAllAnalysisEnginesClick() {
      const val = this.acceptAllAnalysisEngines

      this.analysisEngines = this.analysisEngines.map((item) => {
        return {
          ...item,
          isSendUrl: val,
          isSendFileHash: val,
          isSendFile: val,
          selected: val
        }
      })
    },
    analysisEnginesChange(engine, index) {
      this.analysisEngines[index].isSendUrl = engine.selected
      this.analysisEngines[index].isSendFileHash = engine.selected
      this.analysisEngines[index].isSendFile = engine.selected
    },
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
          console.log('response.data.data', response.data.data)
          const data = response.data.data.results.map((item) => {
            return {
              resourceId: item.resourceId,
              integrationId: item.resourceId,
              name: item.name,
              isSendUrl: true,
              isSendFileHash: true,
              isSendFile: true,
              selected: true
            }
          })
          this.acceptAllAnalysisEngines = true
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
      /*
      this.$nextTick(() => {
        this.tags.push(...this.tagsearch.split(','))
        this.$nextTick(() => {
          this.tagsearch = ''
        })
      })

       */
    },
    setAvailableItems(value, oldValue, index) {
      this.actionsValues[index] = value
      this.actions[index] = value
      this.act.actionTypes.map((item, index) => {
        this.actionsValues.map((i) => {
          if (item.val === i.val && item.val !== 'investigate' && item.val !== 'notify') {
            item.disabled = true
          }
          if (oldValue && oldValue.val !== value.val && item.val === oldValue.val) {
            item.disabled = false
          }
        })
      })
      this.$forceUpdate()
    },
    addAction(actionVal = null) {
      let nextAvailableAction
      if (actionVal) {
        nextAvailableAction = this.act.actionTypes.find((item) => item.val === actionVal)
      } else {
        nextAvailableAction = this.act.actionTypes.find((item) => !item.disabled)
      }

      this.act.actionTypes.find((item) => {
        if (
          JSON.stringify(item) === JSON.stringify(nextAvailableAction) &&
          nextAvailableAction.val !== 'investigate' &&
          nextAvailableAction.val !== 'notify'
        ) {
          item.disabled = true
          nextAvailableAction.disabled = true
        }
      })
      if (nextAvailableAction.val === 'investigate') {
      }

      this.actions.push(nextAvailableAction)

      const length = this.actions.length
      this.actionsValues[length - 1] = nextAvailableAction
      this.idCounter = this.idCounter + 1
    },
    removeAction(index, action) {
      this.act.actionTypes.find((item) => {
        if (
          JSON.stringify(this.actionsValues[index]) === JSON.stringify(item) &&
          item.val !== 'investigate' &&
          item.val !== 'notify'
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
    if (
      this.actions.findIndex((item) => {
        return item.val === 'markAs'
      }) === -1
    ) {
      this.addAction()
    }

    this.$store.dispatch('investigations/getTargetUsersList').then() //module name than method name
    this.getAnalysisEngine()
    this.getTargetUsers()
  },
  watch: {
    search(val) {
      this.getTargetUsers()
    },
    editedActions(val) {
      this.playbookAction = val
      if (val.tags) {
        this.addAction('tag')
      }
    },
    editedNotifications(val) {
      val.map((item) => {
        this.addAction('notify')
      })
      let valIndex = 0
      this.actions.map((item, index) => {
        if (item.val === 'notify') {
          this.targetUserType[index] = val[valIndex].targetUserType
          this.tarUsers[index] = val[valIndex].targetUsers
          valIndex++
        }
      })
    },
    editedPlaybookActionAnalyzers(val) {
      const dizi = this.analysisEngines.filter((item) => {
        const abc = val.find((i) => {
          return i.resourceId === item.resourceId
        })
        return !!abc
      })
      this.analysisEngines = dizi
      if (val.length > 0) {
        this.addAction('analyze')
      }
    },
    analysisEngines(val) {},
    editedPlaybookActionInvestigations(investigations) {
      investigations.map((investigation) => {
        this.addAction('investigate')
      })
      setTimeout(() => {
        const keys = Object.keys(this.$refs)
        keys.map((key, index) => {
          this.$refs[key][0].investigateData = JSON.parse(JSON.stringify(investigations[index]))
        })
      }, 500)
    }
  },

  computed: {
    ...mapGetters({
      targetUsersList: 'investigations/getTargetUsersListGetter' // for using getters
    })
  }
}
</script>
<style lang="scss" src="./ActionItem.scss" />
