<template>
  <div>
    <div
      v-if="!isLoading && !isTargetGroupEmpty && !isTargetGroupLoading"
      class="campaign-manager-target-user-groups-header"
    >
      <div>
        <v-icon color="#000000">mdi-account-multiple</v-icon>
        <span class="campaign-manager-target-user-groups-header__text">{{
          groupName
        }}</span>
      </div>
      <div>
        <span class="campaign-manager-target-user-groups-header__badge"
          >Total {{ totalUserCount }} users:
          <span
            class="campaign-manager-target-user-groups-header__active-and-inactive-users"
            >{{ getActiveAndInactiveUserCountText }}</span
          ></span
        >
      </div>
      <AlertBox
        v-if="canRenderAlertbox"
        :text="getUnverifiedDomainsText"
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
      <AlertBox
        v-if="canRenderPhoneNumberAlertBox"
        :text="getPhoneNumberWarningText"
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
      <AlertBox
        v-if="canRenderPhoneNumberAwarenessAlertBox"
        :text="getAwarenessPhoneNumberWarningText"
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
      <AlertBox
        v-if="canRenderNoPhoneNumberAlertBox"
        icon-color="#B83A3A"
        style="background-color: #f56c6c33"
        text="There are 0 target users with phone numbers in the selected groups. MFA scenario(s) in the campaign won’t be able to launched."
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
      <AlertBox
        v-if="canRenderAlertboxLanguage && !isLoading"
        :class="getPreferredLanguageAlertBoxClass"
        :icon-color="getNonPreferredLanguageUsers === 0 ? '#43A047' : '#2196f3'"
        :text="getPreferredLanguageText"
        :icon-name="
          getNonPreferredLanguageUsers === 0 ? 'mdi-check-circle' : 'mdi-alert-circle'
        "
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
      <AlertBox
        v-if="canRenderSmartGroupAlertBox"
        text="This Smart Group updates automatically. Users who no longer meet its criteria are removed and won't receive the next trainings."
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
    </div>
    <div>
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        is-server-side
        :showPagination="false"
        :loading="getLoadingStatus"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :add-row-class-name="addRowClassName"
      />
    </div>
  </div>
</template>

<script>
import DataTable from "@/components/DataTable";
import labels from "@/model/constants/labels";
import {
  getTargetGroupCountDetail,
  searchTargetGroupUsers,
  getTargetGroupCountDetailExt,
} from "@/api/targetUsers";
import { getStoreValue, PROPERTY_STORE } from "@/model/constants/commonConstants";
import { cancellableAxiosRequest, getDefaultAxiosPayload } from "@/utils/functions";
import AlertBox from "@/components//AlertBox";
import { SCENARIO_DISTRIBUTION } from "@/components/CampaignManager/utils";
import LookupLocalStorage from "@/helper-classes/lookup-local-storage";
export default {
  name: "CampaignManagerTargetGroupUsersTable",
  components: { DataTable, AlertBox },
  props: {
    resourceId: {
      type: String,
    },
    groupName: {
      type: String,
    },
    isTargetGroupEmpty: {
      type: Boolean,
    },
    isTargetGroupLoading: {
      type: Boolean,
    },
    lastColumnName: {
      type: String,
      default: "email",
    },
    addRowClassName: {
      type: Function,
    },
    isVishing: {
      type: Boolean,
      default: false,
    },
    isSmishing: {
      type: Boolean,
      default: false,
    },
    isAwareness: {
      type: Boolean,
      default: false,
    },
    isMFAScenarioSelected: {
      type: Boolean,
      default: false,
    },
    addPhoneNumberColumn: {
      type: Boolean,
      default: false,
    },
    isPhishing: {
      type: Boolean,
      default: false,
    },
    targetGroupResourceIds: {
      type: Array,
      default: () => [],
    },
    scenarioResourceIds: {
      type: Array,
      default: () => [],
    },
    sendUserPreferredLanguage: {
      type: String,
      default: "0",
    },
    scenarioDistribution: {
      type: Number,
      default: 0,
    },
    categoryFilter: {
      type: Object,
    },
    addPrefferredLanguageColumn: {
      type: Boolean,
      default: false,
    },
    isLearningPath: {
      type: Boolean,
      default: false,
    },
    isSmartGroup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      axiosPayload: getDefaultAxiosPayload(),
      totalUserCount: 0,
      activeUserCount: 0,
      preferredLanguages: [],
      randomLanguages: [],
      userCountDetailResponse: null,
      isRenderDefaultLanguageAlertBoxFormat: false,
      activeCompanyName: "",
      activeUsersWithPhoneNumberCount: 0,
      activeUsersWithoutPhoneNumberCount: 0,
      inactiveUserCount: 0,
      usersFromUnverifiedDomainsCount: 0,
      userFromPreferredLanguage: 0,
      userFromPreferredLanguagesText: "e.g., French, German, Spanish, and 7 more",
      userFromCompanyLanguageText: "",
      userFromCompanyLanguage: 0,
      CONSTANTS: {
        id: "campaign-manager-target-group-users-data-table",
        ascending: "ascending",
      },
      isLoading: false,
      tableData: [],
      tableOptions: {
        iEmpty: {
          message: labels.EmptyTargetUsersPeople,
          id: "btn-empty--target-users-people",
        },
        columns: this.getColumns(),
      },
    };
  },
  computed: {
    getActiveAndInactiveUserCountText() {
      let text = "";
      if (this.isVishing) {
        if (this.activeUsersWithPhoneNumberCount) {
          text += `${this.activeUsersWithPhoneNumberCount} active`;
        }
      } else if (this.activeUserCount) {
        text += `${this.activeUserCount} active`;
      }

      if (text !== "" && this.inactiveUserCount) {
        text += ", ";
      }

      if (this.inactiveUserCount) {
        text += `${this.inactiveUserCount} inactive`;
      }

      return text;
    },
    getLoadingStatus() {
      return this.isTargetGroupLoading || this.isLoading;
    },
    canRenderAlertboxLanguage() {
      return (
        parseInt(this.sendUserPreferredLanguage) === 1 &&
        this.totalUserCount > 0 &&
        !this.isVishing &&
        !this.isSmishing &&
        !this.isAwareness
      );
    },
    canRenderAlertbox() {
      if (this.isAwareness) return false;
      return this.usersFromUnverifiedDomainsCount > 0 && !this.isVishing;
    },
    canRenderPhoneNumberAlertBox() {
      if (this.isAwareness) return false;
      return this.activeUsersWithoutPhoneNumberCount > 0 && this.isMFAScenarioSelected;
    },
    canRenderPhoneNumberAwarenessAlertBox() {
      return this.activeUsersWithoutPhoneNumberCount > 0 && this.isAwareness;
    },
    canRenderNoPhoneNumberAlertBox() {
      return this.activeUsersWithPhoneNumberCount === 0 && this.isMFAScenarioSelected;
    },
    canRenderSmartGroupAlertBox() {
      return this.isLearningPath && this.isSmartGroup;
    },
    getPreferredLanguageAlertBoxClass() {
      const classes = ["w-100"];
      if (this.getNonPreferredLanguageUsers === 0) {
        classes.push("preferred-language-alert-box--success");
      } else {
        classes.push("preferred-language-alert-box");
      }
      return classes.join(" ");
    },
    getPreferredLanguageText() {
      if (!this.userCountDetailResponse) return "";

      const activeData = this.userCountDetailResponse.filter(
        (row) => row.status === "Active"
      );
      const fallbackCount = this.getNonPreferredLanguageUsers || 0;
      const companyLanguage = this.activeCompanyName || this.randomLanguages[0];

      // Get language counts for matched users from both "Yes" and "No" status items
      const languageCounts = [];
      activeData.forEach((row) => {
        if (row.hasPreferredLanguage) {
          // Get languages from "Yes" status items
          const yesStatusItem = row.hasPreferredLanguage.find(
            (item) => item.status === "Yes"
          );
          if (yesStatusItem && yesStatusItem.hasPreferredLanguage) {
            yesStatusItem.hasPreferredLanguage.forEach((lang) => {
              if (lang.count > 0) {
                languageCounts.push(
                  `${
                    this.languageOptions.find(
                      (option) => option.languageTypeName === lang.status
                    )?.text || lang.status
                  } (${lang.count})`
                );
              }
            });
          }
        }
      });

      if (languageCounts.length === 0) {
        // No language matches scenario
        const userWord = fallbackCount === 1 ? "user" : "users";
        return `No language match: ${fallbackCount} ${userWord} will get the company language (${companyLanguage}).`;
      } else if (fallbackCount === 0) {
        // All users matched scenario
        const languageText = languageCounts.join(", ");
        return `All users matched: ${languageText}.`;
      } else {
        // Some users need fallback scenario
        const languageText = languageCounts.join(", ");
        const userWord = fallbackCount === 1 ? "user" : "users";
        const fallbackWord = fallbackCount === 1 ? "fallbacks" : "fallback";
        return `Matched users: ${languageText}; ${fallbackCount} ${userWord} ${fallbackWord} to company language (${companyLanguage}).`;
      }
    },
    getUserFromPreferredLanguage() {
      if (!this.userCountDetailResponse) return;
      const activeData = this?.userCountDetailResponse?.filter(
        (row) => row.status === "Active"
      );
      return activeData.reduce((acc, row) => {
        const yesStatusItem = row?.hasPreferredLanguage?.find((r) => r.status === "Yes");
        return acc + yesStatusItem?.count || 0;
      }, 0);
    },
    getNonPreferredLanguageUsers() {
      if (!this.userCountDetailResponse) return;
      const activeData = this?.userCountDetailResponse?.filter(
        (row) => row.status === "Active"
      );
      return activeData.reduce((acc, row) => {
        const noStatusItem = row?.hasPreferredLanguage?.find((r) => r.status === "No");
        return acc + noStatusItem?.count || 0;
      }, 0);
    },
    getUnverifiedDomainsText() {
      return `There ${this.usersFromUnverifiedDomainsCount > 1 ? "are" : "is"} ${
        this.usersFromUnverifiedDomainsCount
      } active user${
        this.usersFromUnverifiedDomainsCount > 1 ? "s" : ""
      } with unverified domains in this group. Please verify the domains in order to send ${
        this.isSmishing ? "sms" : "emails"
      }.`;
    },
    getPhoneNumberWarningText() {
      return `There ${this.activeUsersWithPhoneNumberCount > 1 ? "are" : "is"} ${
        this.activeUsersWithPhoneNumberCount
      } active user${
        this.activeUsersWithPhoneNumberCount > 1 ? "s" : ""
      } with phone number${this.activeUsersWithPhoneNumberCount > 1 ? "s" : ""} and ${
        this.activeUsersWithoutPhoneNumberCount
      } active user${
        this.activeUsersWithoutPhoneNumberCount > 1 ? "s" : ""
      } without phone number${
        this.activeUsersWithoutPhoneNumberCount > 1 ? "s" : ""
      } in this group. Only the ${this.activeUsersWithPhoneNumberCount} user${
        this.activeUsersWithPhoneNumberCount > 1 ? "s" : ""
      } with phone number${
        this.activeUsersWithPhoneNumberCount > 1 ? "s" : ""
      } will receive MFA scenario.`;
    },
    getAwarenessPhoneNumberWarningText() {
      return `There ${this.activeUsersWithPhoneNumberCount > 1 ? "are" : "is"} ${
        this.activeUsersWithPhoneNumberCount
      } active user${
        this.activeUsersWithPhoneNumberCount > 1 ? "s" : ""
      } with phone numbers and ${
        this.activeUsersWithoutPhoneNumberCount
      } active users without phone numbers in this group. Only the ${
        this.activeUsersWithPhoneNumberCount
      } user${
        this.activeUsersWithPhoneNumberCount > 1 ? "s" : ""
      } with phone numbers will receive training email and SMS.`;
    },
  },
  watch: {
    isMFAScenarioSelected: {
      immediate: true,
      handler(val) {
        if (this.isSmishing || this.isVishing) return;
        if (val) {
          this.tableOptions.columns.push({
            property: "phoneNumber",
            align: "left",
            editable: false,
            label: "Phone Number",
            sortable: true,
            show: true,
            width: 150,
            type: "text",
            overrideWidth: true,
            hideSort: true,
          });
        } else {
          const phoneNumberColumnIndex = this.tableOptions.columns.findIndex(
            (column) => column.property === "phoneNumber"
          );
          if (phoneNumberColumnIndex !== -1) {
            this.tableOptions.columns.splice(phoneNumberColumnIndex, 1);
          }
        }
      },
    },
    resourceId() {
      this.callForData();
    },
    addPhoneNumberColumn() {
      this.tableOptions.columns = this.getColumns();
    },
    addPrefferredLanguageColumn() {
      this.tableOptions.columns = this.getColumns();
    },
  },
  created() {
    this.callForData();
  },
  methods: {
    getColumns() {
      const columns = [
        {
          property: PROPERTY_STORE.FIRSTNAME,
          align: "left",
          editable: false,
          label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
          fixed: false,
          sortable: true,
          show: true,
          type: "text",
          hideSort: true,
        },
        {
          property: PROPERTY_STORE.LASTNAME,
          align: "left",
          editable: false,
          label: getStoreValue(PROPERTY_STORE.LASTNAME),
          sortable: true,
          show: true,
          type: "text",
          hideSort: true,
        },
        {
          property: this.lastColumnName,
          align: "left",
          editable: false,
          label: this.lastColumnName === "email" ? "Email" : "Phone Number",
          sortable: true,
          show: true,
          type: "text",
          overrideWidth: true,
          hideSort: true,
        },
      ];
      if (this.addPhoneNumberColumn) {
        columns.push({
          property: "phoneNumber",
          align: "left",
          editable: false,
          label: "Phone Number",
          sortable: true,
          show: true,
          type: "text",
          width: 200,
          overrideWidth: true,
          hideSort: true,
        });
      }
      if (this.addPrefferredLanguageColumn) {
        columns.push({
          property: "preferredLanguage",
          align: "left",
          editable: false,
          label: "Preferred Language",
          sortable: true,
          show: true,
          type: "text",
          width: 200,
          overrideWidth: true,
          hideSort: true,
        });
      }
      return columns;
    },
    cancellableSearchTargetGroupUsers: cancellableAxiosRequest(searchTargetGroupUsers),
    callForData() {
      if (!this.resourceId) return;
      this.setLoading(true);
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            languageTypeName: language.name,
            value: language.resourceId,
          })) || [];
        this.cancellableSearchTargetGroupUsers(this.resourceId, this.axiosPayload)
          .then((response) => {
            if (!Object.keys(response).length) return;
            const {
              data: { data },
            } = response;
            this.tableData =
              data.results?.map((row) => {
                if (Array.isArray(row.preferredLanguage)) {
                  return {
                    ...row,
                    preferredLanguage: row.preferredLanguage.map((lang) => {
                      return (
                        this.languageOptions.find(
                          (option) => option.languageTypeName === lang
                        )?.text || lang
                      );
                    }),
                  };
                }
                return {
                  ...row,
                  preferredLanguage:
                    this.languageOptions.find(
                      (option) => option.languageTypeName === row.preferredLanguage
                    )?.text || row.preferredLanguage,
                };
              }) || [];
          })
          .then(() => {
            const isCallingPreferred =
              this.isPhishing && parseInt(this.sendUserPreferredLanguage) === 1;
            const method = isCallingPreferred
              ? getTargetGroupCountDetailExt
              : getTargetGroupCountDetail;
            const payload = isCallingPreferred
              ? {
                  targetGroupResourceIds: [this.resourceId],
                  scenarioResourceIds: this.scenarioResourceIds || [],
                  sendUserPreferredLanguage: parseInt(this.sendUserPreferredLanguage),
                }
              : [this.resourceId];
            if (
              this.scenarioDistribution !== SCENARIO_DISTRIBUTION.MANUALLY &&
              isCallingPreferred
            ) {
              payload.categoryFilter = {
                Condition: this.categoryFilter.filter.Condition,
                FilterGroups: this.categoryFilter.filter.FilterGroups,
              };
            }
            method(payload)
              .then((response) => {
                if (!Object.keys(response).length) return;
                const {
                  data: { data },
                } = response;
                this.userCountDetailResponse = data;
                const activeUserCount =
                  data.find((row) => row.status === "Active")?.count || 0;
                const activeUsersWithPhoneNumberCount =
                  data
                    .find((row) => row.status === "Active")
                    ?.hasPhoneNumber?.find((row) => row.status === "Yes")?.count || 0;
                const activeUsersWithoutPhoneNumberCount =
                  data
                    .find((row) => row.status === "Active")
                    ?.hasPhoneNumber?.find((row) => row.status === "No")?.count || 0;
                const inactiveUserCount =
                  data.find((row) => row.status === "Passive")?.count || 0;
                const usersFromUnverifiedDomainsCount =
                  data
                    .find((row) => row.status === "Active")
                    ?.domainAllowList?.find((row) => row.status === "Unverified")
                    ?.count || 0;
                this.totalUserCount = activeUserCount + inactiveUserCount;
                this.activeUserCount = activeUserCount;
                this.inactiveUserCount = inactiveUserCount;
                this.usersFromUnverifiedDomainsCount = usersFromUnverifiedDomainsCount;
                this.activeUsersWithPhoneNumberCount = activeUsersWithPhoneNumberCount;
                this.activeUsersWithoutPhoneNumberCount = activeUsersWithoutPhoneNumberCount;
                const activeData = data.find((row) => row.status === "Active");
                const yesCompanyPrefYesItem = activeData?.hasCompanyPreferredLanguage?.find(
                  (row) => row.status === "Yes"
                );
                this.userFromCompanyLanguage = yesCompanyPrefYesItem?.count || 0;
                const yesUserPrefYesItem = activeData?.hasPreferredLanguage?.find(
                  (row) => row.status === "Yes"
                );
                this.userFromPreferredLanguage = yesUserPrefYesItem?.count || 0;
                const preferredLanguages = new Set();
                const randomLanguages = new Set();
                let isNoPreferredLanguage = false;
                let isYesRandomLanguage = false;
                data.map((row) => {
                  if (row.hasPreferredLanguage) {
                    const noPrefLanguages = row.hasPreferredLanguage.filter(
                      (r) => r.status === "No"
                    );
                    if (noPrefLanguages.length) {
                      noPrefLanguages[0]?.hasPreferredLanguage?.map((lang) => {
                        preferredLanguages.add(lang.status);
                      });
                    } else {
                      isNoPreferredLanguage = true;
                    }
                  }
                  if (row.hasRandomLanguage) {
                    const noRandomLanguages = row.hasRandomLanguage.filter(
                      (r) => r.status === "Yes"
                    );
                    if (noRandomLanguages.length) {
                      noRandomLanguages[0]?.hasRandomLanguage?.map((lang) => {
                        randomLanguages.add(lang.status);
                      });
                    } else {
                      isYesRandomLanguage = true;
                    }
                  }
                });
                this.preferredLanguages = Array.from(preferredLanguages);
                this.randomLanguages = Array.from(randomLanguages);
                this.activeCompanyName =
                  this.languageOptions.find(
                    (lang) =>
                      lang.languageTypeName === activeData?.companyPreferredLanguage
                  )?.text || activeData?.companyPreferredLanguage;
                this.isRenderDefaultLanguageAlertBoxFormat =
                  isNoPreferredLanguage && isYesRandomLanguage;
                this.setLoading(false);
              })
              .catch(() => {
                this.setLoading(false);
              });
          });
      });
    },
    setLoading(flag = false) {
      this.isLoading = flag;
    },
  },
};
</script>
