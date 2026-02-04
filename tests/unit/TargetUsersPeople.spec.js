
import { createLocalVue, shallowMount } from "@vue/test-utils";
import People from "@/components/TargetUsers/People.vue";
import { customVuetify as vuetify } from "./utils";
import { deleteTargetUser } from "@/api/targetUsers";

jest.mock("@/api/targetUsers", () => ({
  bulkDeleteTargetUsers: jest.fn(() => Promise.resolve()),
  deleteTargetUser: jest.fn(() =>
    Promise.resolve({ data: { message: "ok" } })
  ),
  exportTargetUsers: jest.fn(() => Promise.resolve({ data: {} })),
  getTargetUserCustomFieldsByCompanyId: jest.fn(() =>
    Promise.resolve({ data: { data: [] } })
  ),
  getTargetUsersCountSummary: jest.fn(() =>
    Promise.resolve({ data: { data: {} } })
  ),
  getTargetUsers: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: []
        }
      }
    })
  ),
  searchTargetGroups: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}));

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

describe("TargetUsers People deleted selection guards", () => {
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

  it("flags deleted selections for add/delete buttons", async () => {
    const wrapper = mountFactory();
    await wrapper.setData({
      selection: [{ status: "Deleted" }]
    });

    expect(wrapper.vm.hasDeletedSelection).toBe(true);
    expect(wrapper.vm.getAddUsersButtonStyle).toEqual({
      opacity: 0.5,
      pointerEvents: "none"
    });
    expect(wrapper.vm.getDeleteSelectionButtonStyle).toEqual({
      opacity: 0.5,
      pointerEvents: "none"
    });
  });

  it("does not call delete when selected user is deleted", async () => {
    const wrapper = mountFactory();
    await wrapper.setData({ selection: [] });
    await wrapper.vm.handleDeleteUser({ status: "Deleted" }, []);
    expect(deleteTargetUser).not.toHaveBeenCalled();
  });

  it("does not open bulk delete when deleted exists in selection", async () => {
    const wrapper = mountFactory();
    const changeDeleteModalStatusMock = jest.fn();
    wrapper.vm.changeDeleteModalStatus = changeDeleteModalStatusMock;
    wrapper.vm.isMultipleDelete = false;

    wrapper.vm.handleMultipleDelete([{ status: "Deleted" }], [], false);

    expect(wrapper.vm.isMultipleDelete).toBe(false);
    expect(changeDeleteModalStatusMock).not.toHaveBeenCalled();
  });

  it("triggers delete selection when allowed", async () => {
    const wrapper = mountFactory();
    const handleDeleteMock = jest.fn();
    wrapper.vm.$refs.refPeopleTable = { handleDelete: handleDeleteMock };
    await wrapper.setData({ selection: [{ resourceId: "1", status: "Active" }] });

    wrapper.vm.handleDeleteSelectionClick();

    expect(handleDeleteMock).toHaveBeenCalledWith([
      { resourceId: "1", status: "Active" }
    ]);
  });

  it("does not trigger delete selection when deleted is selected", async () => {
    const wrapper = mountFactory();
    const handleDeleteMock = jest.fn();
    wrapper.vm.$refs.refPeopleTable = { handleDelete: handleDeleteMock };
    await wrapper.setData({ selection: [{ status: "Deleted" }] });

    wrapper.vm.handleDeleteSelectionClick();

    expect(handleDeleteMock).not.toHaveBeenCalled();
  });

  it("shows default add users tooltip when selection is valid", async () => {
    const wrapper = mountFactory();
    await wrapper.setData({ selection: [{ status: "Active" }] });
    expect(wrapper.vm.addUsersTooltip).toBe("Add users to a group");
  });

  it("shows delete tooltip when selection is valid", async () => {
    const wrapper = mountFactory();
    await wrapper.setData({ selection: [{ status: "Active" }] });
    expect(wrapper.vm.deleteSelectionTooltip).toBe("Delete");
  });

  it("shows delete tooltip when selection includes deleted", async () => {
    const wrapper = mountFactory();
    await wrapper.setData({ selection: [{ status: "Deleted" }] });
    expect(wrapper.vm.deleteSelectionTooltip).toBe(
      "Deleted users cannot be deleted."
    );
  });

  it("computes hasDeletedSelection for isDeleted flag", async () => {
    const wrapper = mountFactory();
    await wrapper.setData({ selection: [{ isDeleted: true }] });
    expect(wrapper.vm.hasDeletedSelection).toBe(true);
  });

  it("uses default add users button style when no deleted selection", async () => {
    const wrapper = mountFactory();
    await wrapper.setData({ selection: [{ status: "Active" }] });
    expect(wrapper.vm.getAddUsersButtonStyle).toBeNull();
  });
});
