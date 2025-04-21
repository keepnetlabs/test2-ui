<template>
  <Fragment>
    <CreateNewUserGroupModal
      v-if="isTargetGroupModalVisible"
      :status="isTargetGroupModalVisible"
      :is-create-button-disabled="isCreateTargetGroupButtonDisabled"
      @changeNewUserGroupStatus="handleCloseTargetGroupModal"
      @handleSave="handleConfirmTargetGroupModal"
    />

    <v-form ref="refForm">
      <FormGroup :title="labels.CampaignName" has-hint>
        <InputEntityName
          v-model.trim="formData.name"
          id="input--campaign-info-name"
          entity-name="campaign name"
          initial-placeholder="Enter a name"
          :initial-rules="rules.name"
        />
      </FormGroup>
      <FormGroup
        v-if="isPhishing"
        title="Hyper-Personalization"
        sub-title="Tailor scenarios to the user’s language."
      >
        <KSelect
          :value="hyperPersonalization"
          class="tlp-select"
          outlined
          placeholder="Select an option"
          item-text="text"
          item-value="value"
          :items="getHyperPersonalizationItems"
          :return-object="false"
          :slots="{ item: true, selection: false }"
          @change="$emit('hyperPersonalizationChange', $event)"
        >
          <template #item="{ item }">
            <v-list-item-content>
              <v-list-item-title> {{ item.text }}</v-list-item-title>
              <v-list-item-subtitle class="tlp_subtitle">{{
                item.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </KSelect>
      </FormGroup>
      <FormGroup
        v-if="isPhishing"
        title="Smart Grouping"
        sub-title="Users who failed the campaign are automatically added to the selected target group."
      >
        <KSelect
          v-infinite-scroll="{
            target: '#input--target-group-groups .k-select__menu',
            callback: callForTargetGroups,
          }"
          ref="refTargetGroupSelect"
          v-select-search-handler="{
            callback: searchTargetGroups,
            isLoadingKey: 'isTargetGroupsLoading',
          }"
          type="autocomplete"
          :value="clickedUserGroupResourceId"
          id="input--target-group-groups"
          clearable
          item-text="name"
          item-value="resourceId"
          outlined
          :no-data-text="noTargetGroupText"
          placeholder="Select a target group"
          :items="targetGroupList"
          :slots="{ prependItem: true }"
          :disabled="isEdit"
          @change="$emit('update:clickedUserGroupResourceId', $event)"
        >
          <template #prependItem>
            <v-list-item ripple @mousedown.prevent @click="handleCreateGroup">
              <v-list-item-action>
                <v-icon color="#757575"> mdi-plus </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <span style="font-weight: 600">Create new group</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </KSelect>
      </FormGroup>
      <CampaignManagerReplyTracking
        v-if="showReplyTracking"
        v-model="formData.emailReplySettings"
      />
      <InputDuration v-if="showDuration" v-model="formData.duration" />
      <FormGroup v-if="showMarkAsTest" :title="labels.MarkAsTest">
        <div>
          <v-checkbox
            v-model="formData.excludeFromReports"
            id="input--campaign-manager-campaign-settings-exclude-from-reports"
            color="#2196f3"
          >
            <template #label
              >Exclude this campaign’s statistics from all generic reports</template
            >
          </v-checkbox>
        </div>
      </FormGroup>
    </v-form>
  </Fragment>
</template>

<script>
import labels from "@/model/constants/labels";
import FormGroup from "@/components/SmallComponents/FormGroup";
import * as validations from "@/utils/validations";
import InputEntityName from "@/components/Common/Inputs/InputEntityName";
import {
  scrollToComponent,
  getDefaultAxiosPayload,
  getSelectSearchPayload,
} from "@/utils/functions";
import { searchTargetGroups, createTargetGroup } from "@/api/targetUsers";
import { Fragment } from "vue-frag";
import CreateNewUserGroupModal from "@/components/TargetUsers/CreateNewUserGroupModal";
import KSelect from "@/components/Common/Inputs/KSelect";
import InfiniteScroll from "@/directives/infinite-scroll";
import SelectSearchHandler from "@/directives/select-search-handler";
import CampaignManagerReplyTracking from "@/components/CampaignManager/CampaignManagerReplyTracking";
export default {
  name: "CampaignManagerCampaignInfo",
  components: {
    CampaignManagerReplyTracking,
    FormGroup,
    InputEntityName,
    CreateNewUserGroupModal,
    KSelect,
    Fragment,
  },
  props: {
    defaultValues: {
      type: Object,
    },
    isEdit: {
      type: Boolean,
    },
    showDuration: {
      type: Boolean,
      default: true,
    },
    showMarkAsTest: {
      type: Boolean,
      default: true,
    },
    isCallback: {
      type: Boolean,
      default: false,
    },
    isPhishing: {
      type: Boolean,
      default: false,
    },
    clickedUserGroupResourceId: {
      type: String,
    },
    initialClickedUserGroupResourceId: {
      type: String,
    },
    showReplyTracking: {
      type: Boolean,
      default: false,
    },
    hyperPersonalization: {
      type: String,
      default: "",
    },
    formDetails: {
      type: Object,
      default: () => ({}),
    },
  },
  directives: {
    "infinite-scroll": InfiniteScroll,
    "select-search-handler": SelectSearchHandler,
  },
  data() {
    return {
      isTargetGroupModalVisible: false,
      isCreateTargetGroupButtonDisabled: false,
      isTargetGroupsLoading: false,
      targetGroupPayload: getDefaultAxiosPayload({
        pageSize: 100,
        selectTargetUserResourceIds: "",
      }),
      targetGroupList: [],
      targetGroups: [],
      labels,
      formData: {
        name: "",
        duration: 30,
        excludeFromReports: false,
        emailReplySettings: {
          isEnabled: false,
          subDomain: "",
          domain: "",
          isSaveContentEnabled: false,
          isOutOfOfficeEnabled: false,
        },
      },
      rules: {
        name: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, " "),
          (v) =>
            validations.maxLength(
              v,
              256,
              labels.getMaxLengthMessage(labels.CampaignName)
            ),
        ],
        select: [
          (v) => !!v.length || labels.Required,
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, " "),
        ],
      },
    };
  },
  watch: {
    clickedUserGroupResourceId: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit("update:clickedUserGroupResourceId", val);
        if (val) {
          const smartGroupIndex = this.targetGroupList.findIndex(
            (group) => group.resourceId === val
          );
          if (smartGroupIndex !== -1) {
            this.$emit("smartGroupSelected", this.targetGroupList[smartGroupIndex]);
          }
        } else this.$emit("smartGroupSelected", null);
      },
    },
    initialClickedUserGroupResourceId: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.targetGroupPayload.selectTargetUserResourceIds = val;
          this.callForTargetGroups();
        }
      },
    },
    isCallback: {
      immediate: true,
      handler(val) {
        if (val) {
          this.rules.days.push((v) =>
            validations.numberRangeRule(
              v,
              1,
              30,
              "Duration can be minimum 1, maximum 30 days"
            )
          );
        }
      },
    },
    defaultValues: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return;
        for (const key of Object.keys(val)) {
          this.formData[key] = val[key];
        }
      },
    },
  },
  computed: {
    noTargetGroupText() {
      return this.isTargetGroupsLoading ? "Loading..." : "No target group available";
    },
    getHyperPersonalizationItems() {
      return this?.formDetails?.sendUserPreferredLanguageTypes?.map((item) => {
        return {
          text: this.getItemTitle(item.value),
          description: item.text,
          value: item.value,
        };
      });
    },
  },
  created() {
    const initialFormValues = JSON.parse(JSON.stringify(this.formData));
    this.$emit("initialFormValues", initialFormValues);
    this.callForTargetGroups();
  },
  methods: {
    getItemTitle(value) {
      if (value === "0") return "Send in a manually selected language";
      return "Send in the target users' preferred language";
    },
    handleCreateGroup() {
      this.isTargetGroupModalVisible = true;
      if (this.$refs?.refTargetGroupSelect?.$refs?.refComponent)
        this.$refs.refTargetGroupSelect.$refs.refComponent.isMenuActive = false;
    },
    handleCloseTargetGroupModal() {
      this.isTargetGroupModalVisible = false;
    },
    handleConfirmTargetGroupModal(group) {
      this.$emit("smartGroupSelected", group);
      this.isCreateTargetGroupButtonDisabled = true;
      createTargetGroup(group)
        .then((response) => {
          this.isTargetGroupModalVisible = false;
          this.targetGroupList.unshift({
            name: group.name,
            resourceId: response.data.data.resourceId,
          });
          this.clickedUserGroupResourceId = response.data.data.resourceId;
        })
        .finally(() => (this.isCreateTargetGroupButtonDisabled = false));
    },
    setTargetGroups(response) {
      const { data: { data = [] } = [] } = response;
      this.targetGroups = [...this.targetGroups, ...data.results];
      this.targetGroupList = this.targetGroups.map((tg) => ({
        name: tg.name,
        resourceId: tg.resourceId,
      }));
    },
    callForTargetGroups(addPage) {
      if (addPage) {
        this.targetGroupPayload.pageNumber += 1;
        if (this.targetGroupPayload.pageNumber > this.totalNumberOfPagesOfTargetGroups)
          return;
      }
      this.isTargetGroupsLoading = true;
      searchTargetGroups(this.targetGroupPayload)
        .then(this.setTargetGroups)
        .then((data) => {
          this.totalNumberOfPagesOfTargetGroups = data?.data?.totalNumberOfPages || 1;
        })
        .finally(() => {
          this.isTargetGroupsLoading = false;
        });
    },
    searchTargetGroups(search = "") {
      if (search) {
        searchTargetGroups(getSelectSearchPayload(this.targetGroupPayload, search))
          .then(this.setTargetGroups)
          .finally(() => {
            this.isTargetGroupsLoading = false;
          });
      } else {
        this.callForTargetGroups();
      }
    },
    setInitialName(value) {
      this.formData.name = value;
      const initialFormValues = JSON.parse(JSON.stringify(this.formData));
      this.$emit("initialFormValues", initialFormValues);
    },
    validateForm() {
      let isValid = this.$refs.refForm.validate();
      if (!isValid) {
        this.$nextTick(() => {
          const el = this.$refs.refForm.$el.querySelector(".error--text");
          scrollToComponent(el);
        });
      }
      return isValid;
    },
  },
};
</script>
