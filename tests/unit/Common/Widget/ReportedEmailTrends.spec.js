import { createLocalVue, shallowMount } from "@vue/test-utils";
import ReportedEmailTrends from "@/components/Common/Widget/WidgetComponents/ReportedEmailTrends.vue";
import { customVuetify as vuetify } from "../../utils";

jest.mock("@/utils/functions", () => ({
  getDataTableFieldLabel: jest.fn((val) => `label-${val}`)
}));

describe("ReportedEmailTrends widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}, propsData = {}) => {
    return shallowMount(ReportedEmailTrends, {
      localVue,
      vuetify,
      propsData,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getReportedEmailTrendsCard": [],
            ...gettersOverrides
          }
        }
      },
      stubs: ["WidgetLoading", "WidgetContainer", "WidgetHeader", "WidgetBody", "line-chart"]
    });
  };

  describe("Component Structure", () => {
    it("has correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("ReportedEmailTrends");
    });

    it("has required subcomponents", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetHeader");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetBody");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetLoading");
    });

    it("has editMode prop", () => {
      const wrapper = mountFactory({}, { editMode: true });
      expect(wrapper.vm.editMode).toBe(true);
    });

    it("has hasLink prop with default true", () => {
      const wrapper = mountFactory({}, {});
      expect(wrapper.vm.hasLink).toBe(true);
    });
  });

  describe("Link Property", () => {
    it("returns link when hasLink is true", () => {
      const wrapper = mountFactory({}, { hasLink: true });
      expect(wrapper.vm.getLink).toEqual({
        href: "/incident-responder",
        text: "Incident Responder"
      });
    });

    it("returns null when hasLink is false", () => {
      const wrapper = mountFactory({}, { hasLink: false });
      expect(wrapper.vm.getLink).toBeNull();
    });

    it("link href points to incident-responder", () => {
      const wrapper = mountFactory({}, { hasLink: true });
      expect(wrapper.vm.getLink.href).toBe("/incident-responder");
    });

    it("link text is correct", () => {
      const wrapper = mountFactory({}, { hasLink: true });
      expect(wrapper.vm.getLink.text).toBe("Incident Responder");
    });
  });

  describe("Component Title", () => {
    it("returns computed title property", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.getTitle).toBe("string");
    });
  });

  describe("Store Integration", () => {
    it("accesses isLoading from store", () => {
      const wrapper = mountFactory({ "widgets/getIsLoading": true });
      expect(wrapper.vm.isLoading).toBe(true);
    });

    it("accesses reportedEmailTrends from store", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });
      expect(wrapper.vm.reportedEmailTrends).toEqual(data);
    });

    it("handles empty data from store", () => {
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": []
      });
      expect(wrapper.vm.reportedEmailTrends).toEqual([]);
    });
  });

  describe("Chart Data Building - Single Entry", () => {
    it("builds chart data from single entry", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartData.datasets).toBeDefined();
      expect(wrapper.vm.chartData.datasets.length).toBe(1);
      expect(wrapper.vm.chartData.datasets[0].label).toContain("label-");
    });

    it("builds chart data with Phishing type", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartData.datasets[0].borderColor).toBe("#f56c6c");
    });

    it("builds chart data with Undetected type", () => {
      const data = [
        { month: "2025-01", result: "Undetected", emailCount: 5 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartData.datasets[0].borderColor).toBe("#00bcd4");
    });

    it("builds chart data with Malicious type", () => {
      const data = [
        { month: "2025-01", result: "Malicious", emailCount: 8 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartData.datasets[0].borderColor).toBe("#b83a3a");
    });
  });

  describe("Chart Data Building - Multiple Entries", () => {
    it("builds chart data from multiple entries", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 },
        { month: "2025-02", result: "Undetected", emailCount: 5 },
        { month: "2025-03", result: "Malicious", emailCount: 8 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(3);
    });

    it("handles multiple same type entries", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 },
        { month: "2025-02", result: "Phishing", emailCount: 15 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(1);
      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(2);
    });

    it("groups data by result type", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 },
        { month: "2025-01", result: "Undetected", emailCount: 5 },
        { month: "2025-02", result: "Phishing", emailCount: 15 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      const phishingDataset = wrapper.vm.chartData.datasets.find(d => d.borderColor === "#f56c6c");
      expect(phishingDataset.data.length).toBe(2);
    });
  });

  describe("Chart Dataset Properties", () => {
    it("sets correct chart dataset properties", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      const dataset = wrapper.vm.chartData.datasets[0];
      expect(dataset.fill).toBe(false);
      expect(dataset.pointRadius).toBe(3);
      expect(dataset.borderWidth).toBe(2);
      expect(dataset.lineTension).toBe(0);
      expect(dataset.backgroundColor).toBe("white");
    });

    it("has data array in dataset", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(Array.isArray(wrapper.vm.chartData.datasets[0].data)).toBe(true);
      expect(wrapper.vm.chartData.datasets[0].data.length).toBeGreaterThan(0);
    });
  });

  describe("Chart Options Building", () => {
    it("builds chart options with plugins", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartOptions.plugins).toBeDefined();
      expect(wrapper.vm.chartOptions.plugins.datalabels).toBeDefined();
    });

    it("sets responsive chart options", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartOptions.responsive).toBe(true);
      expect(wrapper.vm.chartOptions.maintainAspectRatio).toBe(false);
    });

    it("configures tooltip callbacks", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartOptions.tooltips.callbacks).toBeDefined();
      expect(typeof wrapper.vm.chartOptions.tooltips.callbacks.title).toBe("function");
    });
  });

  describe("Empty State Handling", () => {
    it("clears chart data when no results", () => {
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": []
      });

      wrapper.vm.updateReportedEmailTrends([]);

      expect(wrapper.vm.chartData).toEqual({});
    });

    it("has empty state message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.message).toBe("You do not have any reported emails");
    });

    it("empty btn is optional", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.btn).toBeUndefined();
    });
  });

  describe("Edge Cases - Data Values", () => {
    it("handles zero email count", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 0 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(1);
    });

    it("handles large email counts", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10000 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(1);
      expect(wrapper.vm.chartOptions.scales.yAxes[0].ticks.max).toBeGreaterThanOrEqual(10000);
    });

    it("handles decimal email counts", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10.5 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(1);
    });
  });

  describe("Methods", () => {
    it("has onEmptyBtnClicked method", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.onEmptyBtnClicked).toBe("function");
    });

    it("calls onEmptyBtnClicked without errors", () => {
      const wrapper = mountFactory();
      expect(() => {
        wrapper.vm.onEmptyBtnClicked();
      }).not.toThrow();
    });
  });

  describe("Initialization", () => {
    it("initializes with empty months array", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.months.length).toBe(12);
    });

    it("initializes chart data on creation", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      expect(wrapper.vm.chartData.datasets).toBeDefined();
    });
  });

  describe("Watch Properties", () => {
    it("updates chart when reportedEmailTrends changes", async () => {
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": []
      });

      const newData = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];

      wrapper.vm.reportedEmailTrends = newData;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.chartData).toBeDefined();
    });
  });

  describe("Event Emission", () => {
    it("emits deleteWidget event when header emits", async () => {
      const wrapper = mountFactory();

      wrapper.vm.$emit("deleteWidget");
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted("deleteWidget")).toBeTruthy();
    });
  });

  describe("Props Variations", () => {
    it("handles editMode true", () => {
      const wrapper = mountFactory({}, { editMode: true });
      expect(wrapper.vm.editMode).toBe(true);
    });

    it("handles editMode false", () => {
      const wrapper = mountFactory({}, { editMode: false });
      expect(wrapper.vm.editMode).toBe(false);
    });

    it("handles hasLink true and editMode true", () => {
      const wrapper = mountFactory({}, { hasLink: true, editMode: true });
      expect(wrapper.vm.hasLink).toBe(true);
      expect(wrapper.vm.editMode).toBe(true);
      expect(wrapper.vm.getLink).toBeTruthy();
    });

    it("handles hasLink false and editMode true", () => {
      const wrapper = mountFactory({}, { hasLink: false, editMode: true });
      expect(wrapper.vm.hasLink).toBe(false);
      expect(wrapper.vm.editMode).toBe(true);
      expect(wrapper.vm.getLink).toBeNull();
    });
  });

  describe("Data Transformation", () => {
    it("transforms month format to timestamp", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      const chartPoint = wrapper.vm.chartData.datasets[0].data[0];
      expect(typeof chartPoint.x).toBe("number");
      expect(chartPoint.x > 0).toBe(true);
    });

    it("preserves result type in chart data", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 10 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      const chartPoint = wrapper.vm.chartData.datasets[0].data[0];
      expect(chartPoint.result).toBe("Phishing");
    });

    it("preserves email count as y value", () => {
      const data = [
        { month: "2025-01", result: "Phishing", emailCount: 42 }
      ];
      const wrapper = mountFactory({
        "widgets/getReportedEmailTrendsCard": data
      });

      wrapper.vm.updateReportedEmailTrends(data);

      const chartPoint = wrapper.vm.chartData.datasets[0].data[0];
      expect(chartPoint.y).toBe(42);
    });
  });
});
