<template>
  <div class="agentic-ai-settings">
    <company-settings-header
      title="Agentic AI Settings"
      sub-title="Configure how and when AI can act across your organization."
    />

    <DatatableLoading v-if="isFetching" :loading="isFetching" />

    <div v-else class="agentic-ai-settings__content" style="width: 554px;">
      <div class="send-training-settings__lms-switch mb-6">
        <VSwitch
          v-model="agenticAISettings.isAgenticAIEnabled"
          :disabled="!hasAgenticAILicense || isSaving"
          hide-details
          color="#2196f3"
          @change="handleAgenticAIToggle"
        >
          <template #label>
            <div class="d-flex flex-column ml-6">
              <span style="font-weight: 600; color: #383b41;"
                >Enable Agentic AI</span
              >
              <span style="color: #383b41;">
                {{
                  agenticAISettings.isAgenticAIEnabled
                    ? "AI actions are controlled by execution mode, safeguards and policies."
                    : "Agentic AI is currently disabled. No AI-driven actions will be executed."
                }}
              </span>
            </div>
          </template>
        </VSwitch>
      </div>

      <FormGroup
        v-if="agenticAISettings.isAgenticAIEnabled"
        class-name="agentic-ai-settings__execution-mode-form-group mb-4"
      >
        <template #title>
          <p class="agentic-ai-settings__section-title">Execution Mode</p>
          <p class="agentic-ai-settings__section-description">
            Choose whether AI actions require approval before execution.
          </p>
        </template>
        <v-radio-group
          v-model="agenticAISettings.executionMode"
          hide-details
          class="agentic-ai-settings__execution-mode-options"
          :disabled="!hasAgenticAILicense || isSaving"
        >
          <div class="agentic-ai-settings__execution-mode-option">
            <v-radio
              color="#2196f3"
              value="approval"
              label="Approval-Gated Execution"
              class="agentic-ai-settings__execution-mode-radio"
            />
            <p class="agentic-ai-settings__execution-mode-option-description">
              AI recommends actions and executes them only after approval.
            </p>
          </div>

          <div class="agentic-ai-settings__execution-mode-option">
            <v-radio
              color="#2196f3"
              value="autonomous"
              label="Autonomous Execution"
              class="agentic-ai-settings__execution-mode-radio"
            />
            <p class="agentic-ai-settings__execution-mode-option-description">
              AI executes actions automatically based on defined policies.
            </p>
          </div>
        </v-radio-group>
      </FormGroup>

      <FormGroup
        v-if="agenticAISettings.isAgenticAIEnabled"
        class-name="agentic-ai-settings__safeguards-form-group"
      >
        <template #title>
          <p class="agentic-ai-settings__section-title">Safeguards</p>
          <p class="agentic-ai-settings__section-description">
            This safeguard is mandatory to ensure ethical, compliant, and
            predictable AI behavior.
          </p>
        </template>
        <AccordionGroup :items="safeguardItems" />
      </FormGroup>

      <FormGroup
        v-if="agenticAISettings.isAgenticAIEnabled"
        class-name="agentic-ai-settings__behavioral-policies-form-group"
      >
        <template #title>
          <p class="agentic-ai-settings__section-title">Behavioral Policies</p>
          <p class="agentic-ai-settings__section-description">
            Define how AI adapts actions based on user behavior, risk, and
            progression.
          </p>
        </template>
        <AccordionGroup :items="behavioralPolicyItems" />
      </FormGroup>
    </div>
  </div>
</template>

<script>
import CompanySettingsHeader from "@/components/Company Settings/CompanySettingsHeader.vue";
import { COMMON_CONSTANTS } from "@/model/constants/commonConstants";
import { getAgenticAISettings, saveAgenticAISettings } from "@/api/company";
import DatatableLoading from "@/components/SkeletonLoading/DatatableLoading.vue";
import FormGroup from "@/components/SmallComponents/FormGroup.vue";
import AccordionGroup from "@/components/SmallComponents/AccordionGroup.vue";

export default {
  name: "AgenticAISettings",
  components: {
    CompanySettingsHeader,
    DatatableLoading,
    FormGroup,
    AccordionGroup
  },
  data() {
    return {
      agenticAISettings: {
        isAgenticAIEnabled: false,
        executionMode: "approval"
      },
      behavioralPolicySettings: {
        simulationCadenceEnabled: false,
        newHireRampUpProgram: false,
        standardEmployeeSimulationCadence: false,
        riskBasedSimulationFrequency: false,
        highRiskRoleSimulationCadence: false,
        repeatOffenderSimulationEscalation: false,
        lowRiskUserFrequencyReduction: false
      },
      isFetching: true,
      isSaving: false
    };
  },
  computed: {
    hasAgenticAILicense() {
      return this.$store.getters["login/getHasAgenticAILicense"];
    },

    safeguardItems() {
      return [
        {
          title: "Operational Safeguards",
          subtitle:
            "Define practical boundaries that control when and how often AI actions can occur.",
          children: [
            {
              title: "Simulation Frequency Cap",
              tooltip:
                "Control how frequently phishing simulations are delivered to different user groups."
            },
            {
              title: "Training Cooldown Window",
              tooltip:
                "Ensure users have space between learning actions to prevent fatigue."
            },
            {
              title: "Holiday & Blackout Periods",
              tooltip:
                "Automatically pause simulations during pre-defined holidays or blackout dates."
            },
            {
              title: "Timezone Awareness",
              tooltip:
                "Respect each user's local timezone when scheduling AI actions."
            }
          ],
          description: "",
          enabled: false,
          disabled: !this.hasAgenticAILicense
        },
        {
          title: "Ethical & Governance Safeguards",
          subtitle:
            "Ensure AI behavior aligns with ethical standards, human rights, and organizational governance.",
          children: [
            {
              title: "Ethical AI Communication",
              tooltip:
                "Enforce ethical behavior, human rights, and transparency in line with ISO 26000."
            },
            {
              title: "Organizational Governance Alignment",
              tooltip:
                "Ensure trust, accountability, and fairness in accordance with ISO 37000."
            },
            {
              title: "Inclusive Language Enforcement",
              tooltip:
                "Apply gender-neutral and inclusive language standards based on ISO 30415 and UN guidelines."
            },
            {
              title: "Equality & Non-Discrimination",
              tooltip:
                "Prevent biased or discriminatory language or actions in alignment with the UDHR."
            }
          ],
          description: "",
          enabled: false,
          disabled: !this.hasAgenticAILicense
        },
        {
          title: "Clarity, Accessibility & Cultural Safeguards",
          subtitle:
            "Guarantee clear, inclusive, accessible, and culturally appropriate AI communication.",
          children: [
            {
              title: "Plain Language Enforcement",
              tooltip:
                "Ensure AI communication is clear, simple, and jargon-free following US & UK plain-language principles."
            },
            {
              title: "Accessibility-Aware Language",
              tooltip:
                "Generate accessible content aligned with WCAG guidance for users with reading, visual, or hearing difficulties."
            },
            {
              title: "Transparent AI Communication",
              tooltip:
                "Ensure AI actions and messages are explainable and aligned with OECD and EU fairness principles."
            },
            {
              title: "Culturally Sensitive Messaging",
              tooltip:
                "Deliver positive and culturally appropriate communication aligned with NCSC guidance."
            }
          ],
          enabled: false,
          disabled: !this.hasAgenticAILicense
        }
      ];
    },

    behavioralPolicyItems() {
      return [
        {
          title: "Simulation Cadence",
          subtitle:
            "Control how frequently phishing simulations are delivered to different user groups.",
          description: "",
          showSwitch: true,
          switchModel: this.behavioralPolicySettings,
          switchField: "simulationCadenceEnabled",
          switchDisabled: !this.hasAgenticAILicense,
          switchOnChange: this.handleSimulationCadenceSwitchChange,
          children: [
            {
              title: "New Hire Ramp-Up Program",
              tooltip:
                "Run phishing simulations every 14 days for new hires during their initial onboarding period.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "newHireRampUpProgram",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleBehavioralPolicyCheckboxChange
            },
            {
              title: "Standard Employee Simulation Cadence",
              tooltip:
                "Deliver phishing simulations monthly to all non–new-hire users.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "standardEmployeeSimulationCadence",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleBehavioralPolicyCheckboxChange
            },
            {
              title: "Risk-Based Simulation Frequency",
              tooltip:
                "Increase or decrease simulation frequency dynamically based on individual user risk levels.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "riskBasedSimulationFrequency",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleBehavioralPolicyCheckboxChange
            },
            {
              title: "High-Risk Role Simulation Cadence",
              tooltip:
                "Apply more frequent simulations to high-risk roles such as finance, HR, and executives.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "highRiskRoleSimulationCadence",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleBehavioralPolicyCheckboxChange
            },
            {
              title: "Repeat Offender Simulation Escalation",
              tooltip:
                "Temporarily increase simulation frequency for users with repeated phishing failures.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "repeatOffenderSimulationEscalation",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleBehavioralPolicyCheckboxChange
            },
            {
              title: "Low-Risk User Frequency Reduction",
              tooltip:
                "Reduce simulation frequency for consistently low-risk and high-performing users.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "lowRiskUserFrequencyReduction",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleBehavioralPolicyCheckboxChange
            }
          ]
        }
      ];
    },

    behavioralPolicyCheckboxFields() {
      return [
        "newHireRampUpProgram",
        "standardEmployeeSimulationCadence",
        "riskBasedSimulationFrequency",
        "highRiskRoleSimulationCadence",
        "repeatOffenderSimulationEscalation",
        "lowRiskUserFrequencyReduction"
      ];
    },

    operationalDetails() {
      const operational = this.safeguardItems[0];
      return operational?.children || [];
    }
  },
  mounted() {
    this.fetchAgenticAISettings();
  },
  methods: {
    fetchAgenticAISettings() {
      if (!this.hasAgenticAILicense) {
        this.isFetching = false;
        return;
      }
      this.isFetching = true;
      getAgenticAISettings()
        .then((response) => {
          const enabled = !!response?.data?.data?.agenticAIEnabled;
          this.agenticAISettings.isAgenticAIEnabled = enabled;
        })
        .finally(() => {
          this.isFetching = false;
        });
    },
    handleAgenticAIToggle(val) {
      if (!this.hasAgenticAILicense) return;
      const previousValue = !val;
      this.isSaving = true;
      saveAgenticAISettings({ agenticAIEnabled: val })
        .then(() => {
          const message = val
            ? "Agentic AI is now enabled."
            : "Agentic AI is now disabled.";
          this.$store.dispatch("common/createSnackBar", {
            message,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: "mdi-information"
          });
          // keep global state in sync so ChatPanel can react immediately
          this.$store.dispatch("login/getAgenticAIEnabled");
        })
        .catch(() => {
          // revert UI state on failure
          this.agenticAISettings.isAgenticAIEnabled = previousValue;
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    handleSimulationCadenceSwitchChange(value) {
      const fields = this.behavioralPolicyCheckboxFields;
      fields.forEach((field) => {
        this.behavioralPolicySettings[field] = value;
      });
    },

    handleBehavioralPolicyCheckboxChange() {
      const fields = this.behavioralPolicyCheckboxFields;
      const anyChecked = fields.some(
        (field) => this.behavioralPolicySettings[field]
      );
      if (this.behavioralPolicySettings.simulationCadenceEnabled !== anyChecked) {
        this.behavioralPolicySettings.simulationCadenceEnabled = anyChecked;
      }
    }
  }
};
</script>
