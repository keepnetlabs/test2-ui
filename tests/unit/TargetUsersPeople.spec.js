
import { createLocalVue, shallowMount } from "@vue/test-utils";
import People from "@/components/TargetUsers/People.vue";
import { customVuetify as vuetify } from "./utils";

describe("TargetUsers People summary auto clear", () => {
  const localVue = createLocalVue();

  const mocks = {
    $store: {
      getters: {
        "permissions/getTargetUsersEditPermissions": true,
        "permissions/getTargetUsersDeletePermissions": true,
        "permissions/getTargetUsersCreatePermissions": true,
        "permissions/getLDAPCreateConfigPermission": true,
        "permissions/getLDAPDetailPermission": false,
        "common/getTimezones": { timeZoneList: [] }
      },
      dispatch: jest.fn()
    }
  };

  const mountFactory = (methodMocks = {}) => {
    return shallowMount(People, {
      localVue,
      vuetify,
      mocks,
      methods: {
        callForLanguages: jest.fn(),
        callForFormDetails: jest.fn(),
        callForGetTargetUserCustomFieldsByCompanyId: jest.fn(),
        callForGetTimeZones: jest.fn(),
        callForTargetGroups: jest.fn(),
        callForTargetUsersCountSummary: jest.fn(),
        toggleStatusFilterVisibility: jest.fn(),
        checkIsLDAPConfigured: jest.fn(),
        applySummaryFilter: jest.fn(),
        ...methodMocks
      },
      stubs: [
        "GamificationReportUserDetailsDrawer",
        "DefaultErrorDialog",
        "DeleteUserModal",
        "AddUserModal",
        "CustomFieldsModal",
        "TargetUserImportFromAFile",
        "TargetUsersViewTargetUserGroups",
        "TargetUserLDAPImportModal",
        "TargetUserAddToAnExistingGroupModal",
        "TargetUserCreateGroupWithUserDialog",
        "UnverifiedDomainsModal",
        "TargetUsersSummaryCards",
        "AlertBox",
        "datatable"
      ]
    });
  };

  it("clears empty summary selections and reapplies filter", async () => {
    const applySummaryFilterMock = jest.fn();
    const wrapper = mountFactory({ applySummaryFilter: applySummaryFilterMock });
    await wrapper.setData({
      summaryCounts: {
        active: 0,
        inactive: 5,
        deleted: 0,
        monthly: 3
      },
      activeSummaryKeys: ["active", "inactive", "deleted", "monthly"]
    });

    wrapper.vm.autoClearEmptySummarySelection();

    expect(wrapper.vm.activeSummaryKeys).toEqual(["inactive", "monthly"]);
    expect(applySummaryFilterMock).toHaveBeenCalled();
  });

  it("keeps selections when counts are non-zero", async () => {
    const applySummaryFilterMock = jest.fn();
    const wrapper = mountFactory({ applySummaryFilter: applySummaryFilterMock });
    await wrapper.setData({
      summaryCounts: {
        active: 2,
        inactive: 1,
        deleted: 0,
        monthly: 0
      },
      activeSummaryKeys: ["active", "inactive"]
    });

    wrapper.vm.autoClearEmptySummarySelection();

    expect(wrapper.vm.activeSummaryKeys).toEqual(["active", "inactive"]);
    expect(applySummaryFilterMock).not.toHaveBeenCalled();
  });
});
