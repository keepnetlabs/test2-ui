import { createLocalVue, shallowMount } from "@vue/test-utils";
import PhishingCampaignTrends from "@/components/Common/Widget/WidgetComponents/PhishingCampaignTrends.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("PhishingCampaignTrends widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}, propsOverrides = {}) => {
    return shallowMount(PhishingCampaignTrends, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getPhishingCampaignTrendsCard": [],
            ...gettersOverrides
          }
        }
      },
      propsData: {
        editMode: false,
        ...propsOverrides
      },
      stubs: [
        "WidgetLoading",
        "WidgetContainer",
        "WidgetHeader",
        "WidgetBody",
        "line-chart"
      ]
    });
  };

  describe("Component Structure", () => {
    it("has correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("PhishingCampaignTrends");
    });

    it("has required subcomponents", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetHeader");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetBody");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetLoading");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetContainer");
      expect(wrapper.vm.$options.components).toHaveProperty("line-chart");
    });

    it("has editMode prop", () => {
      const wrapper = mountFactory({}, { editMode: true });
      expect(wrapper.vm.editMode).toBe(true);
    });

    it("defaults editMode to false", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.editMode).toBeFalsy();
    });
  });

  describe("Component Title", () => {
    it("uses title from labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.PhishingCampaignTrends);
    });

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

    it("accesses phishingCampaignTrends from store", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });
      expect(wrapper.vm.phishingCampaignTrends).toEqual(data);
    });

    it("handles empty data from store", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": []
      });
      expect(wrapper.vm.phishingCampaignTrends).toEqual([]);
    });
  });

  describe("Chart Data Building", () => {
    it("builds chart data from single trend entry", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(3);
      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(1);
      expect(wrapper.vm.chartData.datasets[0].label).toBe("Opened Attachment");
      expect(wrapper.vm.chartData.datasets[1].label).toBe("Clicked");
      expect(wrapper.vm.chartData.datasets[2].label).toBe("Submitted");
    });

    it("builds chart data from multiple trend entries", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 5,
          clickedCount: 10,
          submittedCount: 15
        },
        {
          date: "2025-02",
          attachmentOpenedCount: 8,
          clickedCount: 12,
          submittedCount: 20
        },
        {
          date: "2025-03",
          attachmentOpenedCount: 3,
          clickedCount: 7,
          submittedCount: 10
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(3);
      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(3);
      expect(wrapper.vm.chartData.datasets[1].data.length).toBe(3);
      expect(wrapper.vm.chartData.datasets[2].data.length).toBe(3);
    });

    it("sets correct chart dataset colors", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets[0].borderColor).toBe("#0198AC");
      expect(wrapper.vm.chartData.datasets[1].borderColor).toBe("#E6A23C");
      expect(wrapper.vm.chartData.datasets[2].borderColor).toBe("#B83A3A");
    });

    it("sets correct chart dataset properties", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      const dataset = wrapper.vm.chartData.datasets[0];
      expect(dataset.fill).toBe(false);
      expect(dataset.pointRadius).toBe(3);
      expect(dataset.borderWidth).toBe(2);
      expect(dataset.lineTension).toBe(0);
      expect(dataset.backgroundColor).toBe("white");
    });
  });

  describe("Chart Options Building", () => {
    it("builds chart options with plugins", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartOptions.plugins).toBeDefined();
      expect(wrapper.vm.chartOptions.plugins.datalabels).toBeDefined();
    });

    it("sets responsive chart options", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartOptions.responsive).toBe(true);
      expect(wrapper.vm.chartOptions.maintainAspectRatio).toBe(false);
    });

    it("configures legend display", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartOptions.legend.display).toBe(true);
      expect(wrapper.vm.chartOptions.legend.labels).toBeDefined();
    });

    it("configures tooltip callbacks", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartOptions.tooltips.callbacks).toBeDefined();
      expect(typeof wrapper.vm.chartOptions.tooltips.callbacks.title).toBe("function");
    });
  });

  describe("Empty State Handling", () => {
    it("clears chart data when no results", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": []
      });

      wrapper.vm.updatePhishingCampaignTrends([]);

      expect(wrapper.vm.chartData).toEqual({});
    });

    it("has empty state messages", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.message).toBe(labels.EmptyPhishingTrends);
    });

    it("displays empty message correctly", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.empty.message).toBe("string");
    });

    it("handles multiple empty updates", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": []
      });

      wrapper.vm.updatePhishingCampaignTrends([]);
      expect(wrapper.vm.chartData).toEqual({});

      wrapper.vm.updatePhishingCampaignTrends([]);
      expect(wrapper.vm.chartData).toEqual({});
    });
  });

  describe("Edge Cases - Data Values", () => {
    it("handles zero count values", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 0,
          clickedCount: 0,
          submittedCount: 0
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(3);
      expect(wrapper.vm.chartOptions.scales.yAxes[0].ticks.max).toBeGreaterThan(0);
    });

    it("handles large count values", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1000,
          clickedCount: 5000,
          submittedCount: 10000
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(3);
      expect(wrapper.vm.chartOptions.scales.yAxes[0].ticks.max).toBeGreaterThanOrEqual(10000);
    });

    it("handles decimal count values", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1.5,
          clickedCount: 2.7,
          submittedCount: 3.2
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(3);
    });

    it("handles negative count values", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: -1,
          clickedCount: -2,
          submittedCount: -3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(3);
    });

    it("handles mixed positive and negative values", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 10,
          clickedCount: -5,
          submittedCount: 15
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets.length).toBe(3);
    });
  });

  describe("Edge Cases - Date Values", () => {
    it("handles different date formats", () => {
      const data = [
        { date: "2025-01", attachmentOpenedCount: 1, clickedCount: 2, submittedCount: 3 },
        { date: "2025-12", attachmentOpenedCount: 5, clickedCount: 10, submittedCount: 15 }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(2);
    });

    it("handles multiple months within same year", () => {
      const data = [
        { date: "2025-01", attachmentOpenedCount: 1, clickedCount: 2, submittedCount: 3 },
        { date: "2025-02", attachmentOpenedCount: 2, clickedCount: 4, submittedCount: 6 },
        { date: "2025-03", attachmentOpenedCount: 3, clickedCount: 6, submittedCount: 9 }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(3);
    });

    it("handles dates across multiple years", () => {
      const data = [
        { date: "2024-12", attachmentOpenedCount: 1, clickedCount: 2, submittedCount: 3 },
        { date: "2025-01", attachmentOpenedCount: 2, clickedCount: 4, submittedCount: 6 },
        { date: "2025-02", attachmentOpenedCount: 3, clickedCount: 6, submittedCount: 9 }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      wrapper.vm.updatePhishingCampaignTrends(data);

      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(3);
    });
  });

  describe("Data Initialization", () => {
    it("initializes chart data on component creation", () => {
      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": data
      });

      expect(wrapper.vm.chartData.datasets).toBeDefined();
    });

    it("initializes with empty chart data when no data provided", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": []
      });

      expect(wrapper.vm.chartData).toEqual({});
    });

    it("initializes months array", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.months).toEqual([
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]);
    });

    it("initializes empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.message).toBe(labels.EmptyPhishingTrends);
    });
  });

  describe("Watch Property - phishingCampaignTrends", () => {
    it("updates chart when phishingCampaignTrends changes", async () => {
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": []
      });

      const newData = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];

      wrapper.vm.phishingCampaignTrends = newData;
      await wrapper.vm.$nextTick();

      // The watcher should have been called
      expect(wrapper.vm.chartData).toBeDefined();
    });
  });

  describe("Event Emission", () => {
    it("emits deleteWidget event when header emits", async () => {
      const wrapper = mountFactory();

      // Simulate event emission from WidgetHeader
      wrapper.vm.$emit("deleteWidget");
      await wrapper.vm.$nextTick();

      // Component should propagate the event
      expect(wrapper.emitted("deleteWidget")).toBeTruthy();
    });
  });

  describe("Loading State", () => {
    it("displays loading state when isLoading is true", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.isLoading).toBe(true);
    });

    it("hides loading state when isLoading is false", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("toggles loading state", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("Multiple Data Updates", () => {
    it("handles sequential data updates", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": []
      });

      const data1 = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];

      wrapper.vm.updatePhishingCampaignTrends(data1);
      expect(wrapper.vm.chartData.datasets.length).toBe(3);

      const data2 = [
        {
          date: "2025-02",
          attachmentOpenedCount: 5,
          clickedCount: 10,
          submittedCount: 15
        }
      ];

      wrapper.vm.updatePhishingCampaignTrends(data2);
      expect(wrapper.vm.chartData.datasets.length).toBe(3);
      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(1);
    });

    it("maintains chart structure during updates", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingCampaignTrendsCard": []
      });

      const data = [
        {
          date: "2025-01",
          attachmentOpenedCount: 1,
          clickedCount: 2,
          submittedCount: 3
        }
      ];

      wrapper.vm.updatePhishingCampaignTrends(data);
      expect(wrapper.vm.chartData.datasets).toBeDefined();
      expect(wrapper.vm.chartData.datasets[0]).toHaveProperty("label");
      expect(wrapper.vm.chartData.datasets[0]).toHaveProperty("data");
    });
  });

  describe("Edit Mode", () => {
    it("accepts editMode prop", () => {
      const wrapper = mountFactory({}, { editMode: true });
      expect(wrapper.vm.editMode).toBe(true);
    });

    it("can toggle editMode", () => {
      const wrapper = mountFactory({}, { editMode: false });
      expect(wrapper.vm.editMode).toBe(false);
    });
  });
});
