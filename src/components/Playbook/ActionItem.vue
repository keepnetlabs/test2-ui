<template>
  <div class="action-items" id="playbook-action-items">
    <app-dialog
      v-if="openEnginesModal"
      size="big"
      :status="openEnginesModal"
      icon="mdi-blur"
      max-height
      title="Select Integrations"
      subtitle="Select Integrations and what data to send"
      title-id="text--playbook-actions-engine-popup-title"
      subtitle-id="text--playbook-actions-engine-popup-subtitle"
      @changeStatus="closeEngineModal"
    >
      <template #app-dialog-body>
        <div class="bg-white">
          <div>
            <v-text-field
              v-model="searchEnginesModelInput"
              id="input--playbook-search-engines"
              class="filter-field"
              placeholder="Search"
              outlined
              prepend-inner-icon="mdi-magnify"
              hide-details
              @input="searchEnginesModel"
            />
            <div class="analyze__main__select-row-wrap check-all">
              <div class="checkbox-and-text">
                <v-checkbox
                  v-model="getAllCheckboxSelection"
                  id="input--is-all-analysis"
                  class="k-checkbox"
                  color="#2196f3"
                  hide-details
                  @change="acceptAllAnalysisEnginesClick"
                />
                <span class="checkbox-text-dialog">Select All</span>
              </div>
              <div class="analyze__main__select-row-inline">
                <span class="analyze__main__select-row-inline__button__title">
                  Hash
                </span>
                <span class="analyze__main__select-row-inline__button__title">
                  File
                </span>
                <span class="analyze__main__select-row-inline__button__title">
                  Url
                </span>
                <span class="analyze__main__select-row-inline__button__title">
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
                    v-model="engine.selected"
                    :id="`input--anaysis-engine-${index}`"
                    class="k-checkbox"
                    style="margin-left: -2px;"
                    color="#2196f3"
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
                    v-bind="getDynamicCheckboxProps(engine, index, 'hash')"
                    :id="`input--anaysis-engine-${index}-hash`"
                    class="analyze__main__select-row-inline__button"
                    @click="hashChange(engine.isCheckHash, index)"
                  >
                    Hash
                  </span>
                  <span
                    v-bind="getDynamicCheckboxProps(engine, index, 'file')"
                    :id="`input--anaysis-engine-${index}-file`"
                    class="analyze__main__select-row-inline__button"
                    @click="fileChange(engine.isCheckFile, index)"
                  >
                    File
                  </span>
                  <span
                    v-bind="getDynamicCheckboxProps(engine, index, 'url')"
                    :id="`input--anaysis-engine-${index}-url`"
                    style="cursor: pointer;"
                    class="analyze__main__select-row-inline__button"
                    @click="urlChange(engine.isCheckUrl, index)"
                  >
                    Url
                  </span>
                  <span
                    v-bind="getDynamicCheckboxProps(engine, index, 'sendIp')"
                    :id="`input--anaysis-engine-${index}-sender-ip`"
                    style="cursor: pointer;"
                    class="analyze__main__select-row-inline__button"
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
      <template #app-dialog-footer>
        <app-dialog-footer
          confirm-button-id="btn-confirm--playbook-engine-popup"
          cancel-button-id="btn-cancel--playbook-engine-popup"
          @handleClose="closeEngineModal"
          @handleConfirm="confirmEngineModalFucn"
        />
      </template>
    </app-dialog>
    <v-form ref="refForm" v-model="isFormValid" lazy-validation>
      <div v-for="(action, index) in actions" :key="index" class="vqb-rule action-items__item">
        <v-row :style="getActionRowStyle(actionsValues[index].val)">
          <v-col
            md="2"
            :style="actionsValues[index].val === 'notify' ? 'max-width:11%;flex: 0 0 11%;' : ''"
          >
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
              v-model="playbookAction.tags"
              type="combobox"
              :id="`input--action-tags-${index}`"
              :items="[]"
              chips
              deletable-chips
              outlined
              class="hide-caret"
              multiple
              dense
              persistent-hint
              small-chips
              placeholder="Enter tags and press enter key"
              required
              :return-object="false"
              :rules="[(v) => v.length > 0 || 'Required']"
              @input="handleTagItemChange"
            />
          </v-col>
          <v-col
            v-if="actionsValues[index].val === 'notify'"
            style="max-width: 12%; flex: 0 0 12%;"
            md="1"
          >
            <k-select
              v-model="targetUserType[index]"
              outlined
              placeholder="User selection"
              :id="`input--action-notify-${index}`"
              :items="getNotifyTypes()"
              :rules="[(v) => validations.required(v, 'Required')]"
              @input="tarUsers[index] = []"
            />
          </v-col>
          <v-col
            v-if="actionsValues[index].val === 'notify' && targetUserType[index] === 'Users'"
            :md="isShowAnalysisResults[index] ? 3 : 4"
          >
            <k-select
              v-infinite-scroll="{
                target: `#input--action-system-users-${index} .k-select__menu`,
                callback: callForSystemUsers
              }"
              v-select-search-handler="{
                callback: callForSearchSystemUsers,
                isLoadingKey: 'isSystemUsersLoading'
              }"
              v-model="tarUsers[index]"
              key="systemUsers"
              type="autocomplete"
              nudge-width="40"
              :id="`input--action-system-users-${index}`"
              placeholder="Select system users"
              outlined
              class="edit-select target-users-select-multi"
              item-text="email"
              item-value="email"
              multiple
              dense
              deletable-chips
              auto-select-first
              :return-object="false"
              persistent-hint
              small-chips
              :items="systemUsersItems"
              :rules="[(v) => (!v?.length ? 'Required' : true)]"
              :no-data-text="isSystemUsersLoading ? 'Loading...' : 'No user group available'"
            />
          </v-col>
          <v-col
            v-if="actionsValues[index].val === 'notify' && targetUserType[index] === 'Groups'"
            :md="isShowAnalysisResults[index] ? 3 : 4"
          >
            <k-select
              key="groups"
              v-infinite-scroll="{
                target: `#input--action-target-groups-${index} .k-select__menu`,
                callback: callForTargetGroups
              }"
              v-select-search-handler="{
                callback: callForSearchTargetGroups,
                isLoadingKey: 'isUserGroupsLoading'
              }"
              v-model="tarUsers[index]"
              type="autocomplete"
              :id="`input--action-target-groups-${index}`"
              :items="userGroupsItems"
              nudge-width="40"
              placeholder="Select user groups"
              outlined
              class="edit-select target-users-select-multi"
              item-text="name"
              item-value="resourceId"
              multiple
              dense
              deletable-chips
              auto-select-first
              persistent-hint
              small-chips
              :return-object="false"
              :rules="[(v) => (!v?.length ? 'Required' : true)]"
              :no-data-text="isUserGroupsLoading ? 'Loading...' : 'No user group available'"
              :slots="{ selection: true, item: false }"
            >
              <template v-slot:selection="data" v-if="userGroupsItems.length > 0">
                <v-chip
                  v-bind="data.attrs"
                  :key="JSON.stringify(data.item)"
                  :input-value="data.selected"
                  small
                >
                  {{
                    userGroupsItems.find((item) => {
                      return item.resourceId === data.item.resourceId
                    }).name
                  }}
                  <v-icon
                    right
                    style="font-size: 18px;"
                    @click="data.parent.selectItem(data.item.resourceId)"
                    >mdi-close-circle</v-icon
                  >
                </v-chip>
              </template>
            </k-select>
          </v-col>
          <v-col
            v-if="actionsValues[index].val === 'notify'"
            md="2"
            @mouseover="handleMouseOverOnNotifyTemplates($event, index)"
            @mouseleave="handleMouseOutNotifyTemplates"
          >
            <k-select
              v-model="notifyTemplates[index]"
              ref="refNotifyTemplatesSelect"
              :id="`input--action-notify-templates-${index}`"
              :items="act.notifyTemplates"
              placeholder="Select notification template"
              item-value="resourceId"
              item-text="name"
              outlined
              min-width-type="ultra"
              :rules="[(v) => validations.required(v, 'Required')]"
            />
            <data-table-tooltip
              v-if="showOverFlowTooltip"
              :tooltip-style="overFlowTooltipStyle"
              :content="overFlowTooltipContent"
            />
          </v-col>
          <div
            v-if="actionsValues[index].val === 'notify' && isShowAnalysisResults[index]"
            class="action-items__item-analysis-result mr-2"
            :style="getAnalysisResultStyle(index)"
          >
            <span class="action-items__item-analysis-result-text">If analysis result</span>
          </div>
          <v-col
            v-if="actionsValues[index].val === 'notify' && isShowAnalysisResults[index]"
            md="2"
            style="max-width: 20%; flex: 0 0 20%;"
          >
            <k-select
              v-model="analysisResults[index]"
              key="analysisResult"
              type="autocomplete"
              :id="`input--action-analysis-result-${index}`"
              placeholder="Select results"
              outlined
              class="edit-select target-users-select-multi"
              multiple
              dense
              deletable-chips
              auto-select-first
              small-chips
              :return-object="false"
              :items="analysisResultItems"
              :rules="[(v) => !!v.length || 'An analysis result should be selected']"
              :no-data-text="isSystemUsersLoading ? 'Loading...' : 'No user group available'"
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
            v-if="analyzeCheckbox && actionsValues[index].val === 'analyze'"
            md="12"
            style="padding-top: 12px; !important;"
          >
            <investigate
              :id="`playbook-action-investigate-analyze-${index}`"
              :isCreatedByAnalyzer="true"
              :investigateData="playbookActionInvestigationAnalyzeData"
              :act="act"
              :actionType="actionsValues[index].val"
            />
          </v-col>
          <v-col v-if="actionsValues[index].val === 'investigate'" md="12">
            <investigate
              :id="`playbook-action-investigate-${index}`"
              :investigate-data="playbookActionInvestigations[index]"
              :index="index"
              :ref="`refInvestigate-${index}`"
              :act="act"
              :actionType="actionsValues[index].val"
            />
          </v-col>
        </v-row>
        <v-row v-if="actionsValues[index].val === 'notify'" class="mb-2">
          <v-col>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <div v-on="on" style="max-width: 275px;">
                  <v-switch
                    v-model="isShowAnalysisResults[index]"
                    id="input--action-item-notify-result-status"
                    class="action-items__item-analysis-result-switch"
                    label="Notify according to analysis result"
                    color="#2196f3"
                    :disabled="isShowAnalysisResultDisabled"
                    @change="handleAnalysisResultChange($event, index)"
                  />
                </div>
              </template>
              <span>It cannot be chosen without adding an analyze action</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </div>
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
import { getAnalysisEngine } from '@/api/playbook'
import AppDialog from '../AppDialog'
import Investigate from './Investigate'
import { required } from '@/utils/validations'
import { searchTargetGroups } from '@/api/targetUsers'
import KSelect from '@/components/Common/Inputs/KSelect'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { searchEmailTemplate } from '@/api/company'
import { getDefaultAxiosPayload, getSelectSearchPayload } from '@/utils/functions'
import { getSystemUsers } from '@/api/systemUsers'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'
import DataTableTooltip from '@/components/DataTableComponents/DataTableTooltip'
export default {
  components: { DataTableTooltip, AppDialogFooter, KSelect, AppDialog, Investigate },
  name: 'ActionItem',
  props: {
    id: Number,
    hasKeyword: Boolean,
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
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
  data() {
    return {
      isShowAnalysisResults: [],
      showOverFlowTooltip: false,
      isShowAnalysisResultDisabled: false,
      overFlowTooltipStyle: {},
      overFlowTooltipContent: '',
      isSystemUsersLoading: false,
      searchEnginesData: null,
      searchEnginesModelInput: null,
      timerId: null,
      isLoading: false,
      search: [],
      timeout: null,
      systemUsersItems: [],
      analysisResultItems: ['Phishing', 'Malicious', 'Undetected', 'Simulation'],
      validations: {
        required
      },
      userGroupsItems: [],
      analyzeCheckbox: false,
      openEnginesModal: false,
      acceptAllAnalysisEngines: false,
      analysisEngines: [],
      initialAnalysisEngines: [],
      actionItemType: 'markAs',
      isFormValid: true,
      markAsOpts: 'Undetected',
      acceptCheckbox: false,
      targetUserType: [],
      notifyTemplates: [],
      targetUsers: [],
      tarUsers: [],
      analysisResults: [],
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
        notifyTemplates: [],
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
        scanTypes: [],
        filters: [],
        targetUserType: 'AllUsers',
        targetUsers: [],
        actionType: 'NoAction',
        actionNotifyTargetUserType: 'Reporter',
        actionNotifyTargetUsers: [],
        autoAction: {
          isPermanentDelete: false,
          type: 'NoAction',
          warningMessage: ''
        },
        durationType: 'ThreeDays',
        emailDateRangeType: 'ThreeDays'
      },

      playbookActionAnalyzers: [],
      systemUsersAxiosPayload: getDefaultAxiosPayload(),
      targetGroupsAxiosPayload: getDefaultAxiosPayload(),
      totalNumberOfPagesOfTargetGroups: 1,
      totalNumberOfPagesOfSystemUsers: 1,
      isUserGroupsLoading: false
    }
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
  methods: {
    callForSystemUsers(addPage) {
      if (addPage) {
        this.systemUsersAxiosPayload.pageNumber += 1
        if (this.systemUsersAxiosPayload.pageNumber > this.totalNumberOfPagesOfSystemUsers) return
      }
      getSystemUsers(this.systemUsersAxiosPayload)
        .then((response) => {
          this.setSystemUsers(response)
          this.totalNumberOfPagesOfSystemUsers = response.data.data.totalNumberOfPages
        })
        .finally(() => (this.isSystemUsersLoading = false))
    },
    handleAnalysisResultChange(value = false, index = 0) {
      this.analysisResults[index] = []
      this.isShowAnalysisResults[index] = value
    },
    handleMouseOverOnNotifyTemplates(e, index) {
      e.stopPropagation()
      if (this.$refs.refNotifyTemplatesSelect[0].$refs.refComponent.$_menuProps.value) {
        this.showOverFlowTooltip = false
      }

      if (Object.keys(this.overFlowTooltipStyle).length) return
      if (
        e.target
          ?.querySelector('.v-select__selection.v-select__selection--comma')
          ?.getBoundingClientRect()?.width > 179
      ) {
        const parentRect = e.target.getBoundingClientRect()
        this.overFlowTooltipStyle = {
          top: `${parentRect.top + 45}px`,
          left: `${parentRect.left + 4}px`
        }
        this.overFlowTooltipContent = this.act.notifyTemplates.find(
          (notifyTemplate) => notifyTemplate.resourceId === this.notifyTemplates[index]
        )?.name
        this.showOverFlowTooltip = true
      }
    },
    getAnalysisResultStyle(index = 0) {
      const style = {
        marginTop: '6px'
      }
      if (['Groups', 'Users'].includes(this.targetUserType[index])) {
        style.maxWidth = '7%'
        style.flex = '0 0 7%'
      }
      return style
    },
    handleMouseOutNotifyTemplates(e) {
      e.stopPropagation()
      this.overFlowTooltipStyle = {}
      this.showOverFlowTooltip = false
    },
    getActionRowStyle(val = '') {
      const style = { paddingTop: '16px', marginBottom: '8px' }
      if (val === 'notify') {
        style.borderBottom = '1px solid #E0E0E0'
      }
      return style
    },
    setSystemUsers(response) {
      const { data: { data = [] } = [] } = response
      this.systemUsersItems = [...this.systemUsersItems, ...data.results]
    },
    callForSearchSystemUsers(search = '') {
      if (!search) return
      getSystemUsers(getSelectSearchPayload(this.systemUsersAxiosPayload, search, 'Email'))
        .then(this.setSystemUsers)
        .finally(() => {
          this.isSystemUsersLoading = false
        })
    },
    handleActionSelectClick({ val }) {
      if (val === 'markAs') this.act.actionTypes[1].disabled = false
      else if (val === 'analyze') this.act.actionTypes[0].disabled = false
    },
    getDynamicCheckboxProps(engine = {}, index = 0, type = '') {
      const props = {}
      if (type === 'hash') {
        if (engine.analysisEngineType['isSendFileHash']) {
          props['style'] = { cursor: 'pointer' }
          props['class'] = engine.isCheckHash
            ? 'analyze__main__select-row-inline__button-selected'
            : ''
        } else {
          props['style'] = { cursor: 'default', visibility: 'hidden' }
        }
      }
      if (type === 'file') {
        if (engine.analysisEngineType['isSendFile']) {
          props['style'] = { cursor: 'pointer' }
          props['class'] = engine.isCheckFile
            ? 'analyze__main__select-row-inline__button-selected'
            : ''
        } else {
          props['style'] = { cursor: 'default', visibility: 'hidden' }
        }
      }
      if (type === 'url') {
        if (engine.analysisEngineType['isSendUrl']) {
          props['style'] = { cursor: 'pointer' }
          props['class'] = engine.isCheckUrl
            ? 'analyze__main__select-row-inline__button-selected'
            : ''
        } else {
          props['style'] = { cursor: 'default', visibility: 'hidden' }
        }
      }
      if (type === 'sendIp') {
        if (engine.analysisEngineType['isSendIp']) {
          props['style'] = { cursor: 'pointer' }
          props['class'] = engine.isCheckSenderIP
            ? 'analyze__main__select-row-inline__button-selected'
            : ''
        } else {
          props['style'] = { cursor: 'default', visibility: 'hidden' }
        }
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
    validateIntegrations() {
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
    searchEnginesModel() {
      if (this.searchEnginesModelInput) {
        this.searchEnginesData = this.analysisEngines.reduce((acc, item) => {
          for (const keyValue of Object.values(item)) {
            if (
              typeof keyValue === 'string' &&
              keyValue
                .toLocaleLowerCase()
                .includes(this.searchEnginesModelInput.toLocaleLowerCase())
            ) {
              acc.push(item)
              break
            }
          }
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
              isCheckFile: val,
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
                isCheckFile: val,
                isCheckSenderIP: val,
                selected: val
              }
            : item
        } else {
          return {
            ...item,
            isCheckUrl: val,
            isCheckHash: val,
            isCheckFile: val,
            isCheckSenderIP: val,
            selected: val
          }
        }
      })
    },
    analysisEnginesChange(engine, index) {
      if (this.searchEnginesData) {
        let item = this.analysisEngines.find(
          (item) => item.resourceId === this.searchEnginesData[index].resourceId
        )
        item.isCheckUrl = engine.selected
        item.isCheckHash = engine.selected
        item.isCheckFile = engine.selected
        item.isCheckSenderIP = engine.selected
        this.checkAllDataChecked(index, item)
      } else if (engine['analysisEngineType']) {
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
          ? analysisEngineType.isSendIp
          : engine.selected
      } else {
        this.analysisEngines[index].isCheckUrl = engine.selected
        this.analysisEngines[index].isCheckHash = engine.selected
        this.analysisEngines[index].isCheckFile = engine.selected
        this.analysisEngines[index].isCheckSenderIP = engine.selected
      }
    },
    getAnalysisEngine() {
      const payload = {
        pageNumber: 1,
        pageSize: 1000,
        orderBy: 'CreateTime',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'Status',
                  Value: 'Active',
                  Operator: 'Include'
                }
              ],
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
      this.act.actionTypes.map((item) => {
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
        this.notifyTemplates[index] = null
      }
      if (oldValue.val === 'markAs') {
        this.playbookAction.markType = ''
      }
      if (value.val === 'markAs') this.playbookAction.markType = 'Undetected'

      if (value.val === 'status') {
        this.playbookActionStatus.actionStatusType = 'Open'
      }
      if (value.val === 'investigate') {
        this.playbookActionInvestigations[index] = {
          isCreatedByAnalyzer: false,
          scanTypes: [],
          autoDetectFilters: false,
          filters: [],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: 'NoAction',
          actionNotifyTargetUserType: 'Reporter',
          actionNotifyTargetUsers: [],
          autoAction: {
            isPermanentDelete: false,
            type: 'NoAction',
            warningMessage: ''
          },
          durationType: 'OneDay',
          emailDateRangeType: 'ThreeDays'
        }
      }
      this.checkIsShowAnalysisResultDisabled()
      this.checkMarkAsAndAnalyzeDisability()
      this.$forceUpdate()
    },
    checkIsShowAnalysisResultDisabled() {
      this.isShowAnalysisResultDisabled = !this.actions.some((action) => action.val === 'analyze')
      if (this.isShowAnalysisResultDisabled) {
        this.analysisResults = []
        this.isShowAnalysisResults = []
      }
    },
    getCurrentActions() {
      return this.actions
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

      if (nextAvailableAction.val === 'markAs') {
        let markType =
          this.playbookAction.markType === 'Unknown' ? 'Undetected' : this.playbookAction.markType
        this.playbookAction.markType = markType || 'Undetected'
      }

      if (nextAvailableAction.val === 'investigate') {
        this.playbookActionInvestigations[this.actions.length] = {
          isCreatedByAnalyzer: false,
          scanTypes: [],
          filters: [],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: 'NoAction',
          actionNotifyTargetUserType: 'Reporter',
          actionNotifyTargetUsers: [],
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
      this.checkIsShowAnalysisResultDisabled()
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
        this.notifyTemplates.splice(index, 1)
        this.analysisResults.splice(index, 1)
        this.isShowAnalysisResults.splice(index, 1)
      } else {
        for (let j = 0; j <= this.targetUserType.length - 1; j++) {
          if (j > index) {
            this.targetUserType[j - 1] = this.targetUserType[j]
            this.tarUsers[j - 1] = this.tarUsers[j]
            this.tarUsers[j] = null
            this.targetUserType[j] = null
            this.notifyTemplates[j - 1] = this.notifyTemplates[j]
            this.notifyTemplates[j] = null
            this.analysisResults[j - 1] = this.analysisResults[j]
            this.analysisResults[j] = null
            this.isShowAnalysisResults[j - 1] = this.isShowAnalysisResults[j]
            this.isShowAnalysisResults[j] = null
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
          scanTypes: [],
          filters: [],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: 'NoAction',
          actionNotifyTargetUserType: 'Reporter',
          actionNotifyTargetUsers: [],
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
      this.checkIsShowAnalysisResultDisabled()
      this.checkMarkAsAndAnalyzeDisability()
    },
    updateAnalysisEngines() {
      if (this.analysisEngines.length > 0 && this.editedPlaybookActionAnalyzers) {
        this.analysisEngines = this.analysisEngines.map((item) => {
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
      }
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
    },
    callForTargetGroups(addPage) {
      if (addPage) {
        this.targetGroupsAxiosPayload.pageNumber += 1
        if (this.targetGroupsAxiosPayload.pageNumber > this.totalNumberOfPagesOfTargetGroups) return
      }
      searchTargetGroups(this.targetGroupsAxiosPayload)
        .then((response) => {
          this.setTargetGroups(response)
          this.totalNumberOfPagesOfTargetGroups = response.data.data.totalNumberOfPages
        })
        .finally(() => (this.isUserGroupsLoading = false))
    },
    setTargetGroups(response) {
      const { data: { data = [] } = [] } = response
      this.userGroupsItems = [...this.userGroupsItems, ...data.results]
    },
    callForSearchTargetGroups(search = '') {
      if (!search) return
      searchTargetGroups(getSelectSearchPayload(this.targetGroupsAxiosPayload, search))
        .then(this.setTargetGroups)
        .finally(() => {
          this.isUserGroupsLoading = false
        })
    }
  },
  created() {
    if (!this.playbookId) {
      this.addAction()
    }
    this.callForTargetGroups()
    this.callForSearchEmailTemplate()
    this.callForSystemUsers()
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
        const length = this.addAction('notify')
        if (item.emailTemplateId) {
          this.notifyTemplates[length - 1] = item.emailTemplateId
        }
      })
      let valIndex = 0
      this.actions.map((item, index) => {
        if (item.val === 'notify') {
          this.targetUserType[index] = val[valIndex].targetUserType
          this.tarUsers[index] = val[valIndex].targetUsers
          if (val[valIndex]?.analysisResultFilters?.length) {
            this.analysisResults[index] = val[valIndex].analysisResultFilters
            this.isShowAnalysisResults[index] = true
          }
          valIndex++
        }
      })
    },
    editedPlaybookActionAnalyzers() {
      this.updateAnalysisEngines()
    },
    analysisEngines(val) {},
    editedPlaybookActionInvestigations(investigations) {
      investigations.map((investigation) => {
        const lastLength = this.addAction('investigate')
        this.playbookActionInvestigations[lastLength - 1] = investigation
      })
    }
  }
}
</script>
