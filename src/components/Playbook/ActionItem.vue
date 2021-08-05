<template>
  <div class="action-items" id="playbook-action-items">
    <app-dialog
      size="big"
      :status="openEnginesModal"
      icon="mdi-blur"
      v-if="openEnginesModal"
      max-height
      title="Select Integrations"
      subtitle="Select Integrations and what data to send"
      title-id="text--playbook-actions-engine-popup-title"
      subtitle-id="text--playbook-actions-engine-popup-subtitle"
      @changeStatus="closeEngineModal"
    >
      <template v-slot:app-dialog-body>
        <div class="bg-white">
          <div class="">
            <v-text-field
              @mouseover.native="hover = true"
              id="input--playbook-search-engines"
              class="filter-field"
              placeholder="Search"
              outlined
              prepend-inner-icon="mdi-magnify"
              v-model="searchEnginesModelInput"
              @keyup="searchEnginesModel()"
              hide-details
            />
            <div class="analyze__main__select-row-wrap check-all">
              <div class="checkbox-and-text">
                <v-checkbox
                  v-model="getAllCheckboxSelection"
                  class="k-checkbox"
                  color="#2196f3"
                  id="input--is-all-analysis"
                  hide-details
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
                <span type="button" class="analyze__main__select-row-inline__button__title">
                  IP
                </span>
              </div>
            </div>
          </div>
          <div>
            <div class="analyze__main__select-row-wrap">
              <div
                v-for="(engine, index) in searchEnginesData || analysisEngines"
                :key="index"
                class="analyze__main__select-row-wrap__item"
              >
                <div class="checkbox-and-text">
                  <v-checkbox
                    class="k-checkbox"
                    :id="`input--anaysis-engine-${index}`"
                    color="#2196f3"
                    v-model="engine.selected"
                    hide-details
                    @change="analysisEnginesChange(engine, index)"
                  />
                  <span
                    :id="`input--anaysis-engine-${index}-name`"
                    class="checkbox-text-dialog"
                    :class="engine.selected ? 'checkbox-text-dialog-selected' : ''"
                    >{{ engine.name }}</span
                  >
                </div>
                <div class="analyze__main__select-row-inline">
                  <span
                    :id="`input--anaysis-engine-${index}-hash`"
                    class="analyze__main__select-row-inline__button"
                    v-bind="getDynamicCheckboxProps(engine, index, 'hash')"
                    @click="hashChange(engine.isCheckHash, index)"
                  >
                    Hash
                  </span>
                  <span
                    :id="`input--anaysis-engine-${index}-file`"
                    class="analyze__main__select-row-inline__button"
                    v-bind="getDynamicCheckboxProps(engine, index, 'file')"
                    @click="fileChange(engine.isCheckFile, index)"
                  >
                    File
                  </span>
                  <span
                    :id="`input--anaysis-engine-${index}-url`"
                    style="cursor: pointer;"
                    class="analyze__main__select-row-inline__button"
                    v-bind="getDynamicCheckboxProps(engine, index, 'url')"
                    @click="urlChange(engine.isCheckUrl, index)"
                  >
                    Url
                  </span>
                  <span
                    :id="`input--anaysis-engine-${index}-sender-ip`"
                    style="cursor: pointer;"
                    class="analyze__main__select-row-inline__button"
                    v-bind="getDynamicCheckboxProps(engine, index, 'sendIp')"
                    @click="sendIpChange(engine.isCheckSenderIP, index)"
                  >
                    IP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          confirm-button-id="btn-confirm--playbook-engine-popup"
          cancel-button-id="btn-cancel--playbook-engine-popup"
          @handleClose="closeEngineModal"
          @handleConfirm="confirmEngineModalFucn"
        />
      </template>
    </app-dialog>
    <v-form ref="refForm" v-model="isFormValid" lazy-validation>
      <v-row v-for="(action, index) in actions" :key="index" class="vqb-rule action-items__item">
        <v-col md="2">
          <k-select
            :value="actionsValues[index]"
            :items="act.actionTypes"
            :id="`input--action-value-${index}`"
            :return-object="true"
            outlined
            placeholder="Select Action Type"
            height="40"
            item-text="name"
            item-value="val"
            @input="setAvailableItems($event, actionsValues[index], index)"
            @click="handleActionSelectClick(actionsValues[index])"
          />
        </v-col>
        <v-col v-if="actionsValues[index].val === 'markAs'" md="2">
          <k-select
            v-model="playbookAction.markType"
            :id="`input--action-mark-type-${index}`"
            :items="act.markAsOpts"
            outlined
            hide-details
            height="40"
          />
        </v-col>
        <v-col v-if="actionsValues[index].val === 'status'" md="2">
          <k-select
            v-model="playbookActionStatus.actionStatusType"
            :id="`input--action-status-type-${index}`"
            :items="act.statusOpts"
            outlined
            hide-details
            height="40"
          />
        </v-col>
        <v-col
          v-if="actionsValues[index].val === 'analyze'"
          md="auto"
          class="flex-grow-1 d-flex col-md-auto col analyze__main"
        >
          <v-text-field
            :id="`input--action-selected-integrations-${index}`"
            outlined
            :placeholder="`${getSelectedIntegrations()} integrations selected `"
            height="40"
            :rules="[validateIntegrations]"
            @click="openEngineModalFunc"
            class="analysis-engines-select"
          >
          </v-text-field>
          <v-col
            class="analyze__main-checkbox"
            style="padding: 4px 0 0 0 !important; margin-left: 24px;"
          >
            <v-checkbox
              class="k-checkbox"
              color="#2196f3"
              id="input--action-is-analyze-with-investigation"
              v-model="analyzeCheckbox"
            />
            <span class="checkbox-text">Investigate according to analyze results</span>
          </v-col>
        </v-col>

        <v-col v-if="actionsValues[index].val === 'tag'" md="auto" class="flex-grow-1">
          <k-select
            type="combobox"
            :id="`input--action-tags-${index}`"
            v-model="playbookAction.tags"
            :items="[]"
            chips
            deletable-chips
            :rules="[(v) => v.length > 0 || 'Required']"
            outlined
            class="hide-caret"
            multiple
            dense
            persistent-hint
            small-chips
            :return-object="false"
            @input="handleTagItemChange"
            placeholder="Enter tags and press enter key"
            required
          />
        </v-col>
        <v-col v-if="actionsValues[index].val === 'notify'" md="2">
          <k-select
            v-model="targetUserType[index]"
            :id="`input--action-notify-${index}`"
            :items="getNotifyTypes()"
            outlined
            @input="tarUsers[index] = []"
            :rules="[(v) => validations.required(v, 'Required')]"
          />
        </v-col>
        <v-col
          v-if="actionsValues[index].val === 'notify' && targetUserType[index] === 'Users'"
          md="5"
        >
          <k-select
            type="combobox"
            :id="`input--action-target-users-${index}`"
            :items="specificUserItems"
            placeholder="Select target users"
            outlined
            class="edit-select target-users-select-multi"
            v-model="tarUsers[index]"
            item-text="email"
            item-value="email"
            :search-input.sync="search[index]"
            multiple
            dense
            deletable-chips
            auto-select-first
            :return-object="false"
            persistent-hint
            :rules="[(v) => validations.required(v, 'Required')]"
            small-chips
            hide-details
          />
        </v-col>
        <v-col
          v-if="actionsValues[index].val === 'notify' && targetUserType[index] === 'Groups'"
          md="5"
        >
          <k-select
            type="combobox"
            :id="`input--action-target-groups-${index}`"
            :items="userGroupsItems"
            placeholder="Select user groups"
            outlined
            class="edit-select target-users-select-multi"
            v-model="tarUsers[index]"
            item-text="name"
            item-value="resourceId"
            :search-input.sync="searchInput[index]"
            multiple
            dense
            deletable-chips
            :return-object="false"
            auto-select-first
            persistent-hint
            :rules="[(v) => validations.required(v, 'Required')]"
            small-chips
            hide-details
            :slots="{ selection: true, item: false }"
          >
            <template v-slot:selection="data" v-if="userGroupsItems.length > 0">
              <v-chip
                :key="JSON.stringify(data.item)"
                v-bind="data.attrs"
                :input-value="data.selected"
                small
              >
                {{
                  userGroupsItems.find((item) => {
                    return item.resourceId === data.item
                  }).name
                }}
                <v-icon right @click="data.parent.selectItem(data.item)" style="font-size: 18px;"
                  >mdi-close-circle</v-icon
                >
              </v-chip>
            </template>
          </k-select>
        </v-col>
        <v-col v-if="actionsValues[index].val === 'notify'" md="2">
          <k-select
            v-model="notifyTemplate"
            :id="`input--action-notify-templates-${index}`"
            :items="act.notifyTemplates"
            item-value="resourceId"
            item-text="name"
            outlined
            min-width-type="medium"
            nudge-width="50"
            hide-details
          />
        </v-col>
        <v-col class="text-right" v-if="actionsValues.length > 1">
          <!-- Remove act button -->
          <v-btn
            :id="`btn--action-close-${index}`"
            icon
            @click="removeAction(index, actionsValues[index].val)"
          >
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-col>
        <v-col
          md="12"
          v-if="analyzeCheckbox && actionsValues[index].val === 'analyze'"
          style="padding-top: 12px; !important;"
        >
          <investigate
            :id="`playbook-action-investigate-analyze-${index}`"
            :isCreatedByAnalyzer="true"
            :investigateData="playbookActionInvestigationAnalyzeData"
            :act="act"
          />
        </v-col>
        <v-col v-if="actionsValues[index].val === 'investigate'" md="12">
          <investigate
            :id="`playbook-action-investigate-${index}`"
            :investigate-data="playbookActionInvestigations[index]"
            :index="index"
            :ref="`refInvestigate-${index}`"
            :act="act"
          />
        </v-col>
      </v-row>
    </v-form>
    <v-btn
      id="btn-add--playbook-action"
      class="playbook-rule-form__button"
      text
      color="#2196f3"
      @click="addAction()"
    >
      <v-icon>mdi-plus</v-icon> Add Action
    </v-btn>
  </div>
</template>

<script>
import { getAnalysisEngine } from '../../api/playbook'
import AppDialog from '../AppDialog'
import Investigate from './Investigate'
import { required } from '../../utils/validations'
import {
  getTargetGroups,
  getTargetGroupsByName,
  getTargetUsersByEmail
} from '../../api/targetUsers'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { searchEmailTemplate } from '@/api/company'

export default {
  components: { AppDialogFooter, KSelect, AppDialog, Investigate },
  name: 'ActionItem',
  props: {
    id: Number,
    hasKeyword: Boolean,
    actionData: Object,
    resourceId: String,
    editedActions: Object,
    playbookId: String,
    editedPlaybookActionAnalyzers: {
      type: Array,
      default: null
    },
    editedNotifications: Array,
    editedPlaybookActionInvestigations: Array
  },
  computed: {
    getAllCheckboxSelection: {
      get() {
        const data = this.searchEnginesModelInput ? this.searchEnginesData : this.analysisEngines
        return data.length && data.every((item) => item.selected)
      },
      set(val) {
        this.acceptAllAnalysisEngines = val
      }
    }
  },
  data() {
    return {
      labels,
      searchEnginesData: null,
      searchEnginesModelInput: null,
      timerId: null,
      isLoading: false,
      search: [],
      targetUsersData: false,
      searchInput: [],
      timeout: null,
      defaultUserGroupItems: [],
      defaultSpecificUserItems: [],
      specificUserItems: [],
      validations: {
        required
      },
      userGroupsItems: [],
      analyzeModel: false,
      analyzeCheckbox: false,
      openEnginesModal: false,
      acceptAllAnalysisEngines: false,
      analysisEngines: [],
      initialAnalysisEngines: [],
      actionItemType: 'markAs',
      isFormValid: true,
      markAsOpts: 'Undetected',
      acceptCheckbox: false,
      tagsearch: '',
      targetUserType: [],
      notifyTemplate: '1c95cf86d193',
      searchUser: '',
      searchGroup: '',
      targets: [],
      targetUsers: [],
      tarUsers: [],
      investigationFilter: ['URLs', 'Attachments'],
      investigationRange: '3 days before and after',
      investigationDuration: '3 days',
      investigateAction: 'Delete email',
      investigateActionNotification: 'Reporter',
      investigateActionNotificationTemplate: '18',
      investigateActionMessage: null,
      playbookActionInvestigations: [],
      playbookActionStatus: { actionStatusType: '' },
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
            name: 'Status',
            val: 'status',
            disabled: false
          },
          {
            name: 'Tag',
            val: 'tag',
            disabled: false
          }
        ],
        notifyTypes: ['Reporter', 'Users', 'Groups'],
        markAsOpts: ['Undetected', 'Phishing', 'Malicious', 'Simulation'],
        statusOpts: [
          'Open',
          'Closed',
          { text: 'In Progress', value: 'InProgress' },
          { text: 'False Positive', value: 'FalsePositive' }
        ],
        notifyTemplates: [
          { label: 'IR User Notification', value: '18' },
          { label: 'IR Delete Action Notification', value: '41' },
          { label: 'Incident Investigation', value: '46' },
          { label: 'About to Expire', value: '2282' },
          { label: 'Incident Investigation Progress Report', value: '2311' },
          {
            label: 'Incident Investigation Suspicious Email Analysis Report',
            value: '2320'
          }
        ],
        investigateFilters: [
          'From',
          'To',
          'Cc',
          { value: 'SenderIp', text: 'Sender Ip' },
          'Subject',
          'Url',
          { text: 'Attachment Name', value: 'AttachmentName' },
          { text: 'Attachment Extension', value: 'AttachmentExtension' },
          { text: 'Attachment Hash', value: 'AttachmentHash' }
        ],
        investigateRanges: [
          { text: '1 day before and after', value: 'OneDay' },
          { text: '3 days before and after', value: 'ThreeDays' },
          { text: '7 days before and after', value: 'SevenDays' },
          { text: '2 weeks before and after', value: 'TwoWeeks' }
        ],
        investigateDurations: [
          { text: '1 day', value: 'OneDay' },
          { text: '3 days', value: 'ThreeDays' },
          { text: '7 days', value: 'SevenDays' }
        ],
        investigateActions: [
          { text: 'No action', value: 'NoAction' },
          { text: 'Notify', value: 'Warning' },
          { text: 'Move to trash', value: 'MoveToTrash' },
          { text: 'Delete email', value: 'Delete' }
        ],
        investigateActionNotifications: ['Reporter', 'Mailbox owner', 'Group', 'Everyone']
      },
      actions: [],
      actionsValues: [],
      autoAction: {
        isPermanentDelete: false,
        type: 'Warning',
        warningMessage: ''
      },
      durationType: 'ThreeDays',
      emailDateRangeType: 'ThreeDays',
      playbookAction: {
        markType: 'Undetected',
        tags: []
      },
      playbookActionInvestigationAnalyzeData: {
        isCreatedByAnalyzer: true,
        scanTypes: [
          {
            type: 'Outlook',
            mailConfigurationResourceId: null,
            mailConfigurationName: 'Outlook'
          }
        ],
        filters: [],
        targetUserType: 'AllUsers',
        targetUsers: [],
        actionType: 'NoAction',
        actionNotifyTargetUserType: 'Reporter',
        actionNotifyTargetUsers: [],
        emailTempleditedPlaybookActionAnalyzersteId: 1,
        autoAction: {
          isPermanentDelete: false,
          type: 'NoAction',
          warningMessage: ''
        },
        durationType: 'ThreeDays',
        emailDateRangeType: 'ThreeDays'
      },

      playbookActionAnalyzers: []
    }
  },
  methods: {
    handleActionSelectClick({ val }) {
      if (val === 'markAs') this.act.actionTypes[1].disabled = false
      else if (val === 'analyze') this.act.actionTypes[0].disabled = false
    },
    getDynamicCheckboxProps(engine = {}, index = 0, type = '') {
      const props = {}
      switch (type) {
        case 'hash':
          if (engine.analysisEngineType['isSendFileHash']) {
            props['style'] = { cursor: 'pointer' }
            props['class'] = engine.isCheckHash
              ? 'analyze__main__select-row-inline__button-selected'
              : ''
          } else {
            props['style'] = { cursor: 'default', visibility: 'hidden' }
          }
          break
        case 'file':
          if (engine.analysisEngineType['isSendFile']) {
            props['style'] = { cursor: 'pointer' }
            props['class'] = engine.isCheckFile
              ? 'analyze__main__select-row-inline__button-selected'
              : ''
          } else {
            props['style'] = { cursor: 'default', visibility: 'hidden' }
          }
          break
        case 'url':
          if (engine.analysisEngineType['isSendUrl']) {
            props['style'] = { cursor: 'pointer' }
            props['class'] = engine.isCheckUrl
              ? 'analyze__main__select-row-inline__button-selected'
              : ''
          } else {
            props['style'] = { cursor: 'default', visibility: 'hidden' }
          }
          break
        case 'sendIp':
          if (engine.analysisEngineType['isSendIp']) {
            props['style'] = { cursor: 'pointer' }
            props['class'] = engine.isCheckSenderIP
              ? 'analyze__main__select-row-inline__button-selected'
              : ''
          } else {
            props['style'] = { cursor: 'default', visibility: 'hidden' }
          }
          break
        default:
          break
      }
      return props
    },
    confirmEngineModalFucn() {
      this.openEnginesModal = false
      this.$refs.refForm.validate()
      this.getSelectedIntegrations()
    },
    handleTagItemChange(value) {
      if (value && value[value.length - 1]) {
        value[value.length - 1] = value[value.length - 1].substring(0, 20)
      }
    },
    validateIntegrations(v) {
      return !!this.getSelectedIntegrations() || 'Required'
    },
    openEngineModalFunc() {
      this.initialAnalysisEngines = JSON.parse(JSON.stringify(this.analysisEngines))
      this.openEnginesModal = true
    },
    closeEngineModal() {
      this.analysisEngines = this.initialAnalysisEngines
      this.openEnginesModal = false
      this.$refs.refForm.validate()
    },
    callForGetTargetGroupItems(payload, isDefault = false) {
      getTargetGroupsByName(payload).then((response) => {
        const {
          data: {
            data: { results }
          }
        } = response
        if (isDefault) {
          this.defaultUserGroupItems = results
        }
        this.userGroupsItems = results || []
      })
    },
    callForGetTargetUsersItems(payload, isDefault = false) {
      getTargetUsersByEmail(payload).then((response) => {
        const {
          data: {
            data: { results }
          }
        } = response
        if (isDefault) {
          this.defaultSpecificUserItems = results
        }
        this.specificUserItems = results || []
      })
    },
    searchEnginesModel(val) {
      if (this.searchEnginesModelInput) {
        this.searchEnginesData = this.analysisEngines.reduce((acc, item) => {
          const data = Object.values(item).find((i) => {
            if (
              typeof i === 'string' &&
              i.toLocaleLowerCase().includes(this.searchEnginesModelInput.toLocaleLowerCase())
            )
              return acc.push(item)
          })
          return acc
        }, [])
      } else {
        this.searchEnginesData = null
      }
    },
    getNotifyTypes() {
      const notifyTypes = this.targetUserType.some((item) => {
        return item && item === 'Reporter'
      })
      if (notifyTypes) {
        return this.act.notifyTypes.map((item) => {
          return { text: item, value: item, disabled: item === 'Reporter' }
        })
      } else {
        return this.act.notifyTypes
      }
    },
    getSelectedIntegrations() {
      return this.analysisEngines.filter((item) => item.selected).length
    },
    checkAllDataChecked(index, item) {
      if (item) {
        item.selected =
          item.isCheckHash || item.isCheckFile || item.isCheckUrl || item.isCheckSenderIP
      } else {
        this.analysisEngines[index].selected =
          this.analysisEngines[index].isCheckHash ||
          this.analysisEngines[index].isCheckFile ||
          this.analysisEngines[index].isCheckUrl ||
          this.analysisEngines[index].isCheckSenderIP
      }
    },
    hashChange(val, index) {
      if (this.searchEnginesData) {
        let item = this.analysisEngines.find(
          (item) => item.resourceId == this.searchEnginesData[index].resourceId
        )
        item.isCheckHash = !val
        this.checkAllDataChecked(index, item)
      } else {
        this.analysisEngines[index].isCheckHash = !val
        this.checkAllDataChecked(index)
      }
    },
    fileChange(val, index) {
      if (this.searchEnginesData) {
        let item = this.analysisEngines.find(
          (item) => item.resourceId == this.searchEnginesData[index].resourceId
        )
        item.isCheckFile = !val
        this.checkAllDataChecked(index, item)
      } else {
        this.analysisEngines[index].isCheckFile = !val
        this.checkAllDataChecked(index)
      }
    },
    urlChange(val, index) {
      if (this.searchEnginesData) {
        let item = this.analysisEngines.find(
          (item) => item.resourceId == this.searchEnginesData[index].resourceId
        )
        item.isCheckUrl = !val
        this.checkAllDataChecked(index, item)
      } else {
        this.analysisEngines[index].isCheckUrl = !val
        this.checkAllDataChecked(index)
      }
    },
    sendIpChange(val, index) {
      if (this.searchEnginesData) {
        let item = this.analysisEngines.find(
          (item) => item.resourceId == this.searchEnginesData[index].resourceId
        )
        item.isCheckSenderIP = !val
        this.checkAllDataChecked(index, item)
      } else {
        this.analysisEngines[index].isCheckSenderIP = !val
        this.checkAllDataChecked(index)
      }
    },
    acceptAllAnalysisEnginesClick() {
      const val = this.acceptAllAnalysisEngines
      this.analysisEngines = this.analysisEngines.map((item) => {
        if (this.searchEnginesModelInput) {
          this.searchEnginesData = this.searchEnginesData.map((item) => {
            return {
              ...item,
              isCheckUrl: val,
              isCheckHash: val,
              isCheckFile: false,
              isCheckSenderIP: val,
              selected: val
            }
          })
          return this.searchEnginesData.find(
            (searchItem) => searchItem.resourceId === item.resourceId
          )
            ? {
                ...item,
                isCheckUrl: val,
                isCheckHash: val,
                isCheckFile: false,
                isCheckSenderIP: val,
                selected: val
              }
            : item
        } else {
          return {
            ...item,
            isCheckUrl: val,
            isCheckHash: val,
            isCheckFile: false,
            isCheckSenderIP: val,
            selected: val
          }
        }
      })
    },
    analysisEnginesChange(engine, index) {
      if (this.searchEnginesData) {
        let item = this.analysisEngines.find(
          (item) => item.resourceId == this.searchEnginesData[index].resourceId
        )
        item.isCheckUrl = engine.selected
        item.isCheckHash = engine.selected
        item.isCheckFile = engine.selected
        item.isCheckSenderIP = engine.selected
        this.checkAllDataChecked(index, item)
      } else {
        if (engine['analysisEngineType']) {
          const { analysisEngineType } = engine
          this.analysisEngines[index].isCheckUrl = engine.selected
            ? analysisEngineType.isSendUrl
            : engine.selected
          this.analysisEngines[index].isCheckHash = engine.selected
            ? analysisEngineType.isSendFileHash
            : engine.selected
          this.analysisEngines[index].isCheckFile = engine.selected
            ? analysisEngineType.isSendFile
            : engine.selected
          this.analysisEngines[index].isCheckSenderIP = engine.selected
            ? analysisEngineType.isCheckSenderIP
            : engine.selected
        } else {
          this.analysisEngines[index].isCheckUrl = engine.selected
          this.analysisEngines[index].isCheckHash = engine.selected
          this.analysisEngines[index].isCheckFile = engine.selected
          this.analysisEngines[index].isCheckSenderIP = engine.selected
        }
      }
    },
    getAnalysisEngine() {
      const payload = {
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'CreateTime',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }

      getAnalysisEngine(payload).then((response) => {
        const data = response.data.data.results.map((item) => {
          return {
            resourceId: item.resourceId,
            integrationId: item.resourceId,
            name: item.name,
            isCheckUrl: false,
            isCheckHash: false,
            isCheckFile: false,
            isCheckSenderIP: false,
            selected: false,
            analysisEngineType: item.analysisEngineType
          }
        })
        this.acceptAllAnalysisEngines = false

        if (this.analysisEngines.length === 0) {
          this.analysisEngines = data
          this.updateAnalysisEngines()
        }
      })
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

      if (oldValue.val === 'notify') {
        this.targetUserType[index] = null
        this.tarUsers[index] = null
      }
      if (oldValue.val === 'markAs' && value.val === 'analyze') {
        this.playbookAction.markType = ''
      }

      if (value.val === 'status') {
        this.playbookActionStatus.actionStatusType = 'Open'
      }
      if (value.val === 'investigate') {
        this.playbookActionInvestigations[index] = {
          isCreatedByAnalyzer: false,
          scanTypes: [
            {
              type: 'Outlook',
              mailConfigurationResourceId: null,
              mailConfigurationName: 'Outlook'
            }
          ],
          filters: [],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: 'NoAction',
          actionNotifyTargetUserType: 'Reporter',
          actionNotifyTargetUsers: [],
          emailTempleditedPlaybookActionAnalyzersteId: 1,
          autoAction: {
            isPermanentDelete: false,
            type: 'NoAction',
            warningMessage: ''
          },
          durationType: 'ThreeDays',
          emailDateRangeType: 'ThreeDays'
        }
      }
      this.checkMarkAsAndAnalyzeDisability()
      this.$forceUpdate()
    },
    addAction(actionVal = null) {
      this.checkMarkAsAndAnalyzeDisability()
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
        this.playbookActionInvestigations[this.actions.length] = {
          isCreatedByAnalyzer: false,
          scanTypes: [
            {
              type: 'Outlook',
              mailConfigurationResourceId: null,
              mailConfigurationName: 'Outlook'
            }
          ],
          filters: [],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: 'NoAction',
          actionNotifyTargetUserType: 'Reporter',
          actionNotifyTargetUsers: [],
          emailTempleditedPlaybookActionAnalyzersteId: 1,
          autoAction: {
            isPermanentDelete: false,
            type: 'NoAction',
            warningMessage: ''
          },
          durationType: 'ThreeDays',
          emailDateRangeType: 'ThreeDays'
        }
      }

      this.actions.push(nextAvailableAction)

      const length = this.actions.length
      this.actionsValues[length - 1] = nextAvailableAction
      this.checkMarkAsAndAnalyzeDisability()
      this.$forceUpdate()
      return this.actions.length
    },
    checkMarkAsAndAnalyzeDisability() {
      const checkFindedItem = (type) => this.actionsValues.find((item) => item.val === type)
      const setDisabledValue = (value1, value2, index) => {
        if (value1 && !value2) {
          this.act.actionTypes[index].disabled = true
        }
      }
      const markAs = checkFindedItem('markAs')
      const status = checkFindedItem('analyze')
      if (!markAs && !status) {
        this.act.actionTypes[0].disabled = false
        this.act.actionTypes[1].disabled = false
      } else {
        setDisabledValue(markAs, status, 1)
        setDisabledValue(status, markAs, 0)
      }
    },
    removeAction(index, actionVal) {
      this.act.actionTypes.find((item) => {
        if (
          JSON.stringify(this.actionsValues[index]) === JSON.stringify(item) &&
          item.val !== 'investigate' &&
          item.val !== 'notify'
        ) {
          item.disabled = false
        }
      })

      if (actionVal === 'markAs') {
        this.playbookAction.markType = ''
      }
      if (actionVal === 'status') {
        this.playbookActionStatus.actionStatusType = ''
      }

      if (actionVal === 'notify') {
        this.targetUserType.splice(index, 1)
        this.tarUsers.splice(index, 1)
      } else {
        for (let j = 0; j <= this.targetUserType.length - 1; j++) {
          if (j > index) {
            this.targetUserType[j - 1] = this.targetUserType[j]
            this.tarUsers[j - 1] = this.tarUsers[j]
            this.tarUsers[j] = null
            this.targetUserType[j] = null
          }
        }
      }

      if (actionVal === 'investigate') {
        this.playbookActionInvestigations.splice(index, 1)
      } else {
        for (let count = 0; count <= this.playbookActionInvestigations.length - 1; count++) {
          if (count > index) {
            this.playbookActionInvestigations[count - 1] = this.playbookActionInvestigations[count]
          }
        }
      }

      if (actionVal === 'tag') {
        this.playbookAction.tags = []
      }
      if (actionVal === 'analyze') {
        this.playbookActionInvestigationAnalyzeData = {
          isCreatedByAnalyzer: true,
          scanTypes: [
            {
              type: 'Outlook',
              mailConfigurationResourceId: null,
              mailConfigurationName: 'Outlook'
            }
          ],
          filters: [],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: 'NoAction',
          actionNotifyTargetUserType: 'Reporter',
          actionNotifyTargetUsers: [],
          emailTempleditedPlaybookActionAnalyzersteId: 1,
          autoAction: {
            isPermanentDelete: false,
            type: 'NoAction',
            warningMessage: ''
          },
          durationType: 'ThreeDays',
          emailDateRangeType: 'ThreeDays'
        }
        this.analyzeCheckbox = false
        this.analysisEngines = this.analysisEngines.map((item) => ({
          ...item,
          selected: false
        }))
      }
      const newIndex = this.actions.findIndex((item) => {
        return JSON.stringify(this.actionsValues[index]) === JSON.stringify(item)
      })
      if (newIndex !== -1) {
        this.actions.splice(newIndex, 1)
        this.actionsValues.splice(index, 1)
      }
      this.checkMarkAsAndAnalyzeDisability()
    },
    updateAnalysisEngines() {
      if (this.analysisEngines.length > 0 && this.editedPlaybookActionAnalyzers) {
        const dizi = this.analysisEngines.map((item) => {
          const valuesItem = this.editedPlaybookActionAnalyzers.find((i) => {
            return i.integrationId === item.resourceId
          })
          if (valuesItem) {
            return {
              ...item,
              ...valuesItem,
              resourceId: item.resourceId,
              selected: true
            }
          } else {
            return item
          }
        })
        this.analysisEngines = dizi
      }
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    callForSearchEmailTemplate() {
      let payload = {
        pageNumber: 1,
        pageSize: 50000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'categoryResourceId',
                  Operator: 'Include',
                  Value: ''
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      searchEmailTemplate(payload).then((response) => {
        this.act.notifyTemplates = response.data.data.results
      })
    }
  },
  created() {
    if (!this.playbookId) {
      this.addAction()
    }

    this.callForSearchEmailTemplate()

    getTargetGroups().then((response) => {
      this.userGroupsItems = response.data.data
      this.defaultUserGroupItems = response.data.data
    })

    this.callForGetTargetUsersItems(
      {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'Email',
        ascending: false,
        email: ''
      },
      true
    )

    this.getAnalysisEngine()
  },
  watch: {
    hasKeyword(val) {
      const isKeywordInArray = this.act.investigateFilters[5] === 'Keyword'
      if (val) {
        if (!isKeywordInArray) {
          this.act.investigateFilters.splice(5, 0, 'Keyword')
        }
      } else {
        if (isKeywordInArray) {
          this.act.investigateFilters.splice(5, 1)
        }
      }
    },
    search(val) {
      const value = val.find((item) => {
        return item
      })
      if (value && value.length >= 3) {
        this.debounce(() => {
          const payload = {
            pageNumber: 1,
            pageSize: 10,
            orderBy: 'Email',
            ascending: false,
            email: value
          }
          this.callForGetTargetUsersItems(payload)
        }, 1000)
      } else {
        this.specificUserItems = this.defaultSpecificUserItems
      }
    },
    searchInput(val) {
      const value = val.find((item) => {
        return item
      })
      if (value && value.length >= 3) {
        this.debounce(() => {
          const payload = {
            pageNumber: 1,
            pageSize: 10,
            orderBy: 'Name',
            ascending: false,
            groupName: value
          }
          this.callForGetTargetGroupItems(payload)
        }, 1000)
      } else {
        this.userGroupsItems = this.defaultUserGroupItems
      }
    },
    editedActions(val) {
      this.playbookAction = val
      if (val.markType && val.markType !== 'Unknown') {
        this.addAction('markAs')
      }
      if (val.tags.length > 0) {
        this.addAction('tag')
      }
    },
    editedNotifications(val) {
      val.map((item) => {
        this.addAction('notify')
        if (item.emailTemplateId) {
          this.notifyTemplate = item.emailTemplateId
        }
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
      this.updateAnalysisEngines()
    },
    analysisEngines(val) {},
    editedPlaybookActionInvestigations(investigations) {
      /*
      investigations.map((investigation, index) => {
        const lastLength = this.addAction('investigate')

        this.playbookActionInvestigations[lastLength - 1] = investigation
      })

       */
      investigations.map((investigation) => {
        const lastLength = this.addAction('investigate')
        this.playbookActionInvestigations[lastLength - 1] = investigation
      })
      /*
      setTimeout(() => {
        const keys = Object.keys(this.$refs)
        let valueIndex = 0
        keys.map((key, index) => {
          if (key !== 'refForm') {
            this.$refs[key][0].investigateData = JSON.parse(
              JSON.stringify(investigations[valueIndex])
            )
            valueIndex++
          }
        })
      }, 1000)

       */
    }
  }
}
</script>
<style lang="scss" src="./ActionItem.scss" />
