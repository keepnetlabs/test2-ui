import { createLocalVue, shallowMount } from "@vue/test-utils";
import CompanyCreateOrEdit from "@/components/Companies/CompanyCreateOrEdit.vue";
import { customVuetify as vuetify } from "../utils";

jest.mock("@/api/company", () => ({
  createCompany: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  expiryDateLimited: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  searchCompanies: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  searchCompanyGroupsWithParents: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [] } } })
  ),
  updateCompany: jest.fn(() => Promise.resolve({}))
}));

jest.mock("@/api/common", () => ({
  getLicences: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getCountryTimezones: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}));

jest.mock("@/helper-classes/lookup-local-storage", () => ({
  getMultiple: jest.fn(() => Promise.resolve([])),
  getSingle: jest.fn(() => Promise.resolve([]))
}));

jest.mock("@/api/callback", () => ({
  getAvailableCallbackNumbers: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}));

describe("CompanyCreateOrEdit date formatting", () => {
  const localVue = createLocalVue();

  const mocks = {
    $store: {
      getters: {
        "common/getTimezones": { timeZoneList: [] }
      },
      dispatch: jest.fn()
    }
  };

  const mountFactory = (dataOverrides = {}) => {
    return shallowMount(CompanyCreateOrEdit, {
      localVue,
      vuetify,
      mocks,
      propsData: {
        edit: false
      },
      data() {
        return {
          ...CompanyCreateOrEdit.data(),
          ...dataOverrides
        };
      },
      stubs: [
        "InputDate",
        "InputTimezone",
        "StepperFooter",
        "InputAddress",
        "InputDescription",
        "InputAIDescription",
        "InputTag",
        "InputCompliance",
        "InputBehaviour",
        "InputSelectRoles",
        "MakeAvailableFor",
        "ConfigureNewCompanyDialog",
        "KSelect",
        "InputUrl",
        "KFileUpload",
        "InputEntityName",
        "AlertBox",
        "CallbackNumberWarningModal",
        "FormGroup",
        "el-form",
        "el-form-item",
        "v-form",
        "v-list-item",
        "v-list-item-content",
        "v-list-item-title",
        "v-text-field",
        "v-btn",
        "v-icon",
        "v-divider",
        "v-list",
        "v-menu",
        "v-card"
      ]
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 0, 1));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("derives selectionDateFormat from dateFormat", () => {
    const wrapper = mountFactory({ dateFormat: "MM/DD/YYYY" });
    expect(wrapper.vm.selectionDateFormat).toBe("MM.DD.YYYY");
  });

  it("uses default selectionDateFormat when dateFormat is empty", () => {
    const wrapper = mountFactory({ dateFormat: "" });
    expect(wrapper.vm.selectionDateFormat).toBe("YYYY.MM.DD");
  });

  it("disables end dates earlier than start date for MM/DD/YYYY", () => {
    const wrapper = mountFactory({
      dateFormat: "MM/DD/YYYY",
      formData: {
        ...CompanyCreateOrEdit.data().formData,
        LicenseStartDate: "12/31/2025 00:00"
      }
    });

    const beforeStart = new Date(2025, 11, 31);
    expect(wrapper.vm.disabledEndDates(beforeStart)).toBe(true);
  });

  it("disables end dates earlier than start date for DD/MM/YYYY", () => {
    const wrapper = mountFactory({
      dateFormat: "DD/MM/YYYY",
      formData: {
        ...CompanyCreateOrEdit.data().formData,
        LicenseStartDate: "31/12/2025 00:00"
      }
    });

    const beforeStart = new Date(2025, 11, 31);
    expect(wrapper.vm.disabledEndDates(beforeStart)).toBe(true);
  });

  it("disables end dates earlier than start date for YYYY/MM/DD", () => {
    const wrapper = mountFactory({
      dateFormat: "YYYY/MM/DD",
      formData: {
        ...CompanyCreateOrEdit.data().formData,
        LicenseStartDate: "2025/12/31 00:00"
      }
    });

    const beforeStart = new Date(2025, 11, 31);
    expect(wrapper.vm.disabledEndDates(beforeStart)).toBe(true);
  });

  it("keeps end dates selectable when start date is empty", () => {
    const wrapper = mountFactory({
      dateFormat: "DD/MM/YYYY",
      formData: {
        ...CompanyCreateOrEdit.data().formData,
        LicenseStartDate: ""
      }
    });

    const futureDate = new Date(2026, 0, 10);
    expect(wrapper.vm.disabledEndDates(futureDate)).toBe(false);
  });

  it("normalizes date format to expected casing", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.normalizeDateFormat("dd/mm/yyyy")).toBe("dd/MM/yyyy");
    expect(wrapper.vm.normalizeDateFormat("mm/dd/yyyy")).toBe("MM/dd/yyyy");
    expect(wrapper.vm.normalizeDateFormat("yyyy/mm/dd")).toBe("yyyy/MM/dd");
  });

  it("returns default normalizeDateFormat when input is empty", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.normalizeDateFormat("")).toBe("dd/MM/yyyy");
  });

  it("updates end date when start date changes and expiry is limited", async () => {
    const wrapper = mountFactory({
      dateFormat: "MM/DD/YYYY",
      isExpiryDateLimited: true,
      formData: {
        ...CompanyCreateOrEdit.data().formData,
        LicenseStartDate: ""
      }
    });

    await wrapper.setData({
      formData: {
        ...wrapper.vm.formData,
        LicenseStartDate: "01/15/2025 00:00"
      }
    });

    expect(wrapper.vm.formData.LicenseEndDate).toContain("2025");
  });

  it("formats getDateFormat based on dateFormat setting", () => {
    const wrapper = mountFactory({ dateFormat: "MM/DD/YYYY" });
    expect(wrapper.vm.getDateFormat).toBe("MM.DD.yyyy");
  });

  it("disables dates earlier than today when no start date is set", () => {
    const wrapper = mountFactory({
      dateFormat: "DD/MM/YYYY",
      formData: {
        ...CompanyCreateOrEdit.data().formData,
        LicenseStartDate: ""
      }
    });
    const pastDate = new Date(2024, 11, 31);
    expect(wrapper.vm.disabledEndDates(pastDate)).toBe(true);
  });

  it("resets end date when start date is cleared and expiry is limited", async () => {
    const wrapper = mountFactory({
      dateFormat: "MM/DD/YYYY",
      isExpiryDateLimited: true,
      formData: {
        ...CompanyCreateOrEdit.data().formData,
        LicenseStartDate: "01/15/2025 00:00",
        LicenseEndDate: "02/15/2025 00:00"
      }
    });

    await wrapper.setData({
      formData: {
        ...wrapper.vm.formData,
        LicenseStartDate: ""
      }
    });

    expect(wrapper.vm.formData.LicenseEndDate).toBe("");
  });

  it("sets start and end dates for 1-year expiry period", () => {
    const wrapper = mountFactory({
      dateFormat: "MM/DD/YYYY",
      timeFormat: "24h",
      formData: {
        ...CompanyCreateOrEdit.data().formData,
        LicenseStartDate: "01/15/2025 10:30",
        LicensePeriodTypeResourceId: "HTHpWWXGJshG"
      }
    });

    wrapper.vm.expiryPeriodChange();

    expect(wrapper.vm.formData.LicenseStartDate).toContain("2025");
    expect(wrapper.vm.formData.LicenseEndDate).toContain("2026");
  });

  it("sets start and end dates for 3-year expiry period", () => {
    const wrapper = mountFactory({
      dateFormat: "MM/DD/YYYY",
      timeFormat: "24h",
      formData: {
        ...CompanyCreateOrEdit.data().formData,
        LicenseStartDate: "01/15/2025 10:30",
        LicensePeriodTypeResourceId: "6EXwfaM5ZDT4"
      }
    });

    wrapper.vm.expiryPeriodChange();

    expect(wrapper.vm.formData.LicenseEndDate).toContain("2028");
  });
});
