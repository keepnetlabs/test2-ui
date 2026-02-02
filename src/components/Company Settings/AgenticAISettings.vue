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
        class-name="agentic-ai-settings__safeguards-form-group mt-6"
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
        class-name="agentic-ai-settings__behavioral-policies-form-group mt-6"
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
import {
  getAgenticAISettings,
  updateAgenticAISettings,
  resetAgenticAISettings,
  getAgenticAIMetadata
} from "@/api/company";
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
        lowRiskUserFrequencyReduction: false,
        complianceTrainingEnabled: false,
        roleBasedComplianceTraining: false,
        annualComplianceRefresh: false,
        newHireComplianceOnboarding: false,
        regulatorySpecificTraining: false,
        executiveBoardComplianceTraining: false,
        riskEscalationEnabled: false,
        repeatOffenderIdentification: false,
        escalatedSimulationTrainingPath: false,
        managerVisibilityOnHighRisk: false,
        positiveReinforcementEnabled: false,
        securityChampionRecognition: false,
        fastPhishingReporterAppreciation: false,
        consistentReporterEncouragement: false,
        behaviorImprovementRecognition: false,
        teamLevelAchievementRecognition: false,
        milestoneAchievementCelebration: false,
        difficultyProgressionEnabled: false,
        progressiveDifficultyModel: false,
        safeStartDifficulty: false,
        performanceBasedDifficultyAdjustment: false,
        repeatFailureDifficultyEscalation: false,
        highRiskScenarioExposure: false,
        difficultyStabilizationWindow: false,
        nudgesEnabled: false,
        incompleteTrainingReminder: false,
        trainingDueSoonReminder: false,
        followUpAfterSimulationFailure: false,
        lowEngagementReminder: false,
        reportingEncouragementNudge: false,
        behaviorImprovementPrompt: false,
        trainingEnablementEnabled: false,
        failureBasedTrainingEnrollment: false,
        targetedTrainingAssignment: false,
        repeatFailureTrainingEscalation: false,
        newHireTrainingOnboarding: false,
        trainingCooldownEnforcement: false,
        postIncidentTrainingAssignment: false
      },
      isFetching: true,
      isSaving: false,
      metadata: null,
      localToApiKeyMap: {}
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
        },
        {
          title: "Compliance Training Policies",
          subtitle: "Schedule all actions based on each user's local timezone.",
          description: "",
          showSwitch: true,
          switchModel: this.behavioralPolicySettings,
          switchField: "complianceTrainingEnabled",
          switchDisabled: !this.hasAgenticAILicense,
          switchOnChange: this.handleComplianceTrainingSwitchChange,
          children: [
            {
              title: "Role-Based Compliance Training",
              tooltip:
                "Automatically assign mandatory compliance training based on user role or department.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "roleBasedComplianceTraining",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleComplianceTrainingCheckboxChange
            },
            {
              title: "Annual Compliance Refresh",
              tooltip:
                "Enroll users in required compliance training on a fixed annual schedule.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "annualComplianceRefresh",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleComplianceTrainingCheckboxChange
            },
            {
              title: "New Hire Compliance Onboarding",
              tooltip:
                "Assign mandatory compliance training during onboarding, independent of phishing outcomes.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "newHireComplianceOnboarding",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleComplianceTrainingCheckboxChange
            },
            {
              title: "Regulatory-Specific Training",
              tooltip:
                "Enforce training for users subject to regulations such as NIS2, ISO, or internal policies.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "regulatorySpecificTraining",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleComplianceTrainingCheckboxChange
            },
            {
              title: "Executive & Board Compliance Training",
              tooltip:
                "Ensure leadership completes required governance and compliance training.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "executiveBoardComplianceTraining",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleComplianceTrainingCheckboxChange
            }
          ]
        },
        {
          title: "Risk Escalation",
          subtitle:
            "Increase focus and intensity for users exhibiting repeated or elevated risk behavior.",
          description: "",
          showSwitch: true,
          switchModel: this.behavioralPolicySettings,
          switchField: "riskEscalationEnabled",
          switchDisabled: !this.hasAgenticAILicense,
          switchOnChange: this.handleRiskEscalationSwitchChange,
          children: [
            {
              title: "Repeat Offender Identification",
              tooltip:
                "Flag users with repeated phishing failures as elevated risk.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "repeatOffenderIdentification",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleRiskEscalationCheckboxChange
            },
            {
              title: "Escalated Simulation & Training Path",
              tooltip:
                "Apply stricter simulation and training paths for high-risk users.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "escalatedSimulationTrainingPath",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleRiskEscalationCheckboxChange
            },
            {
              title: "Manager Visibility on High Risk",
              tooltip:
                "Notify managers when users or teams reach elevated risk levels.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "managerVisibilityOnHighRisk",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleRiskEscalationCheckboxChange
            }
          ]
        },
        {
          title: "Positive Reinforcement",
          subtitle:
            "Recognize and reinforce secure behavior through positive feedback.",
          description: "",
          showSwitch: true,
          switchModel: this.behavioralPolicySettings,
          switchField: "positiveReinforcementEnabled",
          switchDisabled: !this.hasAgenticAILicense,
          switchOnChange: this.handlePositiveReinforcementSwitchChange,
          children: [
            {
              title: "Security Champion Recognition",
              tooltip:
                "Recognize users who consistently demonstrate strong and exemplary security behavior.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "securityChampionRecognition",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handlePositiveReinforcementCheckboxChange
            },
            {
              title: "Fast Phishing Reporter Appreciation",
              tooltip:
                "Thank users who report suspicious emails quickly to reinforce prompt reporting.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "fastPhishingReporterAppreciation",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handlePositiveReinforcementCheckboxChange
            },
            {
              title: "Consistent Reporter Encouragement",
              tooltip:
                "Acknowledge users who regularly report phishing or suspicious activity over time.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "consistentReporterEncouragement",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handlePositiveReinforcementCheckboxChange
            },
            {
              title: "Behavior Improvement Recognition",
              tooltip:
                "Positively reinforce users who show measurable improvement after previous failures.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "behaviorImprovementRecognition",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handlePositiveReinforcementCheckboxChange
            },
            {
              title: "Team-Level Achievement Recognition",
              tooltip:
                "Highlight teams that maintain low risk levels and strong reporting behavior.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "teamLevelAchievementRecognition",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handlePositiveReinforcementCheckboxChange
            },
            {
              title: "Milestone Achievement Celebration",
              tooltip:
                "Celebrate milestones such as consecutive successful simulations or sustained secure behavior.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "milestoneAchievementCelebration",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handlePositiveReinforcementCheckboxChange
            }
          ]
        },
        {
          title: "Difficulty & Progression",
          subtitle:
            "Adjust simulation difficulty dynamically based on user performance and maturity.",
          description: "",
          showSwitch: true,
          switchModel: this.behavioralPolicySettings,
          switchField: "difficultyProgressionEnabled",
          switchDisabled: !this.hasAgenticAILicense,
          switchOnChange: this.handleDifficultyProgressionSwitchChange,
          children: [
            {
              title: "Progressive Difficulty Model (NIST Aligned)",
              tooltip:
                "Gradually increase phishing difficulty from low to hard based on user performance and the NIST Phish Scale.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "progressiveDifficultyModel",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleDifficultyProgressionCheckboxChange
            },
            {
              title: "Safe Start Difficulty",
              tooltip:
                "Start all new users with low-difficulty simulations to avoid early frustration.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "safeStartDifficulty",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleDifficultyProgressionCheckboxChange
            },
            {
              title: "Performance-Based Difficulty Adjustment",
              tooltip:
                "Automatically raise or lower difficulty based on recent simulation outcomes.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "performanceBasedDifficultyAdjustment",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleDifficultyProgressionCheckboxChange
            },
            {
              title: "Repeat Failure Difficulty Escalation",
              tooltip:
                "Increase difficulty for users who repeatedly fail simulations to challenge risky behavior patterns.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "repeatFailureDifficultyEscalation",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleDifficultyProgressionCheckboxChange
            },
            {
              title: "High-Risk Scenario Exposure",
              tooltip:
                "Introduce more realistic and advanced scenarios for users with elevated risk profiles.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "highRiskScenarioExposure",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleDifficultyProgressionCheckboxChange
            },
            {
              title: "Difficulty Stabilization Window",
              tooltip:
                "Prevent rapid difficulty changes by applying a minimum stabilization period between adjustments.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "difficultyStabilizationWindow",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleDifficultyProgressionCheckboxChange
            }
          ]
        },
        {
          title: "Nudges",
          subtitle:
            "Gently guide users with timely, positive, and contextual reminders.",
          description: "",
          showSwitch: true,
          switchModel: this.behavioralPolicySettings,
          switchField: "nudgesEnabled",
          switchDisabled: !this.hasAgenticAILicense,
          switchOnChange: this.handleNudgesSwitchChange,
          children: [
            {
              title: "Incomplete Training Reminder",
              tooltip:
                "Send friendly reminders to users who have not completed assigned training.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "incompleteTrainingReminder",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleNudgesCheckboxChange
            },
            {
              title: "Training Due Soon Reminder",
              tooltip:
                "Notify users shortly before assigned training deadlines to encourage timely completion.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "trainingDueSoonReminder",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleNudgesCheckboxChange
            },
            {
              title: "Follow-Up After Simulation Failure",
              tooltip:
                "Gently prompt users after a phishing failure to review guidance or next steps.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "followUpAfterSimulationFailure",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleNudgesCheckboxChange
            },
            {
              title: "Low Engagement Reminder",
              tooltip:
                "Encourage users with low interaction or reporting activity to stay engaged.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "lowEngagementReminder",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleNudgesCheckboxChange
            },
            {
              title: "Reporting Encouragement Nudge",
              tooltip: "Remind users how and when to report suspicious emails.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "reportingEncouragementNudge",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleNudgesCheckboxChange
            },
            {
              title: "Behavior Improvement Prompt",
              tooltip:
                "Nudge users who are improving to maintain positive momentum.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "behaviorImprovementPrompt",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleNudgesCheckboxChange
            }
          ]
        },
        {
          title: "Training & Enablement",
          subtitle:
            "Trigger learning actions automatically to reinforce secure behavior.",
          description: "",
          showSwitch: true,
          switchModel: this.behavioralPolicySettings,
          switchField: "trainingEnablementEnabled",
          switchDisabled: !this.hasAgenticAILicense,
          switchOnChange: this.handleTrainingEnablementSwitchChange,
          children: [
            {
              title: "Failure-Based Training Enrollment",
              tooltip:
                "Automatically enroll users in relevant training when they fail a phishing simulation.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "failureBasedTrainingEnrollment",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleTrainingEnablementCheckboxChange
            },
            {
              title: "Targeted Training Assignment",
              tooltip:
                "Assign specific training based on the type of phishing failure or risky behavior observed.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "targetedTrainingAssignment",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleTrainingEnablementCheckboxChange
            },
            {
              title: "Repeat Failure Training Escalation",
              tooltip:
                "Enroll users in advanced or additional training after repeated simulation failures.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "repeatFailureTrainingEscalation",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleTrainingEnablementCheckboxChange
            },
            {
              title: "New Hire Training Onboarding",
              tooltip:
                "Automatically assign foundational security training to new hires during onboarding.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "newHireTrainingOnboarding",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleTrainingEnablementCheckboxChange
            },
            {
              title: "Training Cooldown Enforcement",
              tooltip:
                "Prevent users from being enrolled in the same training repeatedly within a short period.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "trainingCooldownEnforcement",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleTrainingEnablementCheckboxChange
            },
            {
              title: "Post-Incident Training Assignment",
              tooltip:
                "Assign focused training after a real phishing incident or confirmed malicious interaction.",
              showCheckbox: true,
              checkboxModel: this.behavioralPolicySettings,
              checkboxField: "postIncidentTrainingAssignment",
              checkboxDisabled: !this.hasAgenticAILicense,
              checkboxOnChange: this.handleTrainingEnablementCheckboxChange
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

    complianceTrainingCheckboxFields() {
      return [
        "roleBasedComplianceTraining",
        "annualComplianceRefresh",
        "newHireComplianceOnboarding",
        "regulatorySpecificTraining",
        "executiveBoardComplianceTraining"
      ];
    },

    riskEscalationCheckboxFields() {
      return [
        "repeatOffenderIdentification",
        "escalatedSimulationTrainingPath",
        "managerVisibilityOnHighRisk"
      ];
    },

    positiveReinforcementCheckboxFields() {
      return [
        "securityChampionRecognition",
        "fastPhishingReporterAppreciation",
        "consistentReporterEncouragement",
        "behaviorImprovementRecognition",
        "teamLevelAchievementRecognition",
        "milestoneAchievementCelebration"
      ];
    },

    difficultyProgressionCheckboxFields() {
      return [
        "progressiveDifficultyModel",
        "safeStartDifficulty",
        "performanceBasedDifficultyAdjustment",
        "repeatFailureDifficultyEscalation",
        "highRiskScenarioExposure",
        "difficultyStabilizationWindow"
      ];
    },

    nudgesCheckboxFields() {
      return [
        "incompleteTrainingReminder",
        "trainingDueSoonReminder",
        "followUpAfterSimulationFailure",
        "lowEngagementReminder",
        "reportingEncouragementNudge",
        "behaviorImprovementPrompt"
      ];
    },

    trainingEnablementCheckboxFields() {
      return [
        "failureBasedTrainingEnrollment",
        "targetedTrainingAssignment",
        "repeatFailureTrainingEscalation",
        "newHireTrainingOnboarding",
        "trainingCooldownEnforcement",
        "postIncidentTrainingAssignment"
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
  watch: {
    'agenticAISettings.executionMode'(val, oldVal) {
      if(val !== oldVal && this.agenticAISettings.isAgenticAIEnabled && !this.isFetching) {
        this.updateSettings({ executionMode: val === 'autonomous' ? 'Autonomous' : 'ApprovalGated' });
      }
    }
  },
  methods: {
    async fetchAgenticAISettings() {
      if (!this.hasAgenticAILicense) {
        this.isFetching = false;
        return;
      }
      this.isFetching = true;
      try {
        const [metadataRes, settingsRes] = await Promise.all([
          getAgenticAIMetadata(),
          getAgenticAISettings()
        ]);
        
        this.metadata = metadataRes?.data?.data || {};
        this.buildLocalToApiKeyMap(this.metadata);

        const data = settingsRes?.data?.data || {};
        
        // Default to enabled if we can fetch settings or assume user has access based on license
        this.agenticAISettings.isAgenticAIEnabled = true; 
        
        this.agenticAISettings.executionMode = data.executionMode === 'Autonomous' ? 'autonomous' : 'approval';
        
        const backendPolicies = data.behavioralPolicies || {};
        
        // Reset all local policies (except switches logic which we handle below)
        const allKeys = [
          ...this.behavioralPolicyCheckboxFields,
          ...this.complianceTrainingCheckboxFields,
          ...this.riskEscalationCheckboxFields,
          ...this.positiveReinforcementCheckboxFields,
          ...this.difficultyProgressionCheckboxFields,
          ...this.nudgesCheckboxFields,
          ...this.trainingEnablementCheckboxFields
        ];
        
        allKeys.forEach(k => { this.behavioralPolicySettings[k] = false; });

        // Map backend keys to local keys
        for (const [key, value] of Object.entries(backendPolicies)) {
           const childKey = key.split('.')[1];
           if (childKey && Object.prototype.hasOwnProperty.call(this.behavioralPolicySettings, childKey)) {
             this.behavioralPolicySettings[childKey] = value;
           }
        }

        // Update enable switches based on child states
        this.handleBehavioralPolicyCheckboxChange({ skipSave: true });
        this.handleComplianceTrainingCheckboxChange({ skipSave: true });
        this.handleRiskEscalationCheckboxChange({ skipSave: true });
        this.handlePositiveReinforcementCheckboxChange({ skipSave: true });
        this.handleDifficultyProgressionCheckboxChange({ skipSave: true });
        this.handleNudgesCheckboxChange({ skipSave: true });
        this.handleTrainingEnablementCheckboxChange({ skipSave: true });

      } catch (error) {
        console.error("Failed to fetch Agentic AI settings", error);
      } finally {
        this.isFetching = false;
      }
    },
    buildLocalToApiKeyMap(metadata) {
      this.localToApiKeyMap = {};
      if(!metadata || !metadata.behavioralPolicies) return;
      
      metadata.behavioralPolicies.forEach(parent => {
         if(parent.items) {
           parent.items.forEach(child => {
             this.localToApiKeyMap[child.key] = `${parent.key}.${child.key}`;
           });
         }
      });
    },
    getApiKeyForLocalKey(localKey) {
       if (this.localToApiKeyMap[localKey]) return this.localToApiKeyMap[localKey];
       
       const fieldGroups = [
          { group: 'simulationCadence', fields: this.behavioralPolicyCheckboxFields },
          { group: 'complianceTrainingPolicies', fields: this.complianceTrainingCheckboxFields },
          { group: 'riskEscalation', fields: this.riskEscalationCheckboxFields },
          { group: 'positiveReinforcement', fields: this.positiveReinforcementCheckboxFields }, 
          { group: 'difficultyAndProgression', fields: this.difficultyProgressionCheckboxFields }, 
          { group: 'nudges', fields: this.nudgesCheckboxFields },
          { group: 'trainingAndEnablement', fields: this.trainingEnablementCheckboxFields } 
       ];
       
       for(const group of fieldGroups) {
          if(group.fields.includes(localKey)) return `${group.group}.${localKey}`;
       }
       return localKey;
    },
    async updateSettings(payload) {
      this.isSaving = true;
      try {
        await updateAgenticAISettings(payload);
        this.$store.dispatch("common/createSnackBar", {
            message: "Settings updated successfully",
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: "mdi-check-circle"
        });

        if (payload.executionMode) {
           this.$store.commit("login/SET_AGENTIC_AI_EXECUTION_MODE", payload.executionMode);
        }
      } catch (error) {
        this.$store.dispatch("common/createSnackBar", {
            message: "Failed to save settings",
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: "mdi-alert"
        });
      } finally {
        this.isSaving = false;
      }
    },
    async updatePolicy(localKey, value) {
       if (this.isFetching) return;
       const apiKey = this.getApiKeyForLocalKey(localKey);
       const payload = {
         behavioralPolicies: {
           [apiKey]: value
         }
       };
       await this.updateSettings(payload);
    },
    handleAgenticAIToggle(val) {
      if (!this.hasAgenticAILicense) return;
      this.isSaving = true;
      
      if (val) {
        updateAgenticAISettings({ executionMode: 'ApprovalGated' })
          .then(() => {
             this.agenticAISettings.isAgenticAIEnabled = true;
             this.$store.dispatch("common/createSnackBar", {
                message: "Agentic AI is now enabled.",
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                icon: "mdi-information"
             });
             this.$store.dispatch("login/getAgenticAIEnabled");
          })
          .catch(() => {
             this.agenticAISettings.isAgenticAIEnabled = false; 
          })
          .finally(() => { this.isSaving = false; });
      } else {
        resetAgenticAISettings()
          .then(() => {
             this.agenticAISettings.isAgenticAIEnabled = false;
             this.fetchAgenticAISettings(); 
             this.$store.dispatch("common/createSnackBar", {
                message: "Agentic AI is now disabled.",
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                icon: "mdi-information"
             });
             this.$store.dispatch("login/getAgenticAIEnabled");
          })
          .catch(() => {
             this.agenticAISettings.isAgenticAIEnabled = true; 
          })
          .finally(() => { this.isSaving = false; });
      }
    },
    handleSimulationCadenceSwitchChange(value) {
      const skipSave = typeof value === 'object' && value.skipSave;
      const actualValue = typeof value === 'boolean' ? value : this.behavioralPolicySettings.simulationCadenceEnabled;

      const fields = this.behavioralPolicyCheckboxFields;
      const policyUpdate = {};
      
      fields.forEach((field) => {
        this.behavioralPolicySettings[field] = actualValue;
        const key = this.getApiKeyForLocalKey(field);
        policyUpdate[key] = actualValue;
      });
      
      if(!skipSave) {
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handleBehavioralPolicyCheckboxChange(arg) {
      const skipSave = arg && arg.skipSave;
      const fields = this.behavioralPolicyCheckboxFields;
      const anyChecked = fields.some(
        (field) => this.behavioralPolicySettings[field]
      );
      if (
        this.behavioralPolicySettings.simulationCadenceEnabled !== anyChecked
      ) {
        this.behavioralPolicySettings.simulationCadenceEnabled = anyChecked;
      }
      
      if(!skipSave) {
        const policyUpdate = {};
        fields.forEach(f => {
           const key = this.getApiKeyForLocalKey(f);
           policyUpdate[key] = this.behavioralPolicySettings[f];
        });
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },
    handleComplianceTrainingSwitchChange(value) {
      const skipSave = typeof value === 'object' && value.skipSave;
      const actualValue = typeof value === 'boolean' ? value : this.behavioralPolicySettings.complianceTrainingEnabled;
      
      const fields = this.complianceTrainingCheckboxFields;
      const policyUpdate = {};
      
      fields.forEach((field) => {
        this.behavioralPolicySettings[field] = actualValue;
        const key = this.getApiKeyForLocalKey(field);
        policyUpdate[key] = actualValue;
      });

      if(!skipSave) {
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handleComplianceTrainingCheckboxChange(arg) {
      const skipSave = arg && arg.skipSave;
      const fields = this.complianceTrainingCheckboxFields;
      const anyChecked = fields.some(
        (field) => this.behavioralPolicySettings[field]
      );
      if (
        this.behavioralPolicySettings.complianceTrainingEnabled !== anyChecked
      ) {
        this.behavioralPolicySettings.complianceTrainingEnabled = anyChecked;
      }
      
      if(!skipSave) {
        const policyUpdate = {};
        fields.forEach(f => {
           const key = this.getApiKeyForLocalKey(f);
           policyUpdate[key] = this.behavioralPolicySettings[f];
        });
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handleRiskEscalationSwitchChange(value) {
      const skipSave = typeof value === 'object' && value.skipSave;
      const actualValue = typeof value === 'boolean' ? value : this.behavioralPolicySettings.riskEscalationEnabled;
      
      const fields = this.riskEscalationCheckboxFields;
      const policyUpdate = {};
      
      fields.forEach((field) => {
        this.behavioralPolicySettings[field] = actualValue;
        const key = this.getApiKeyForLocalKey(field);
        policyUpdate[key] = actualValue;
      });

      if(!skipSave) {
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handleRiskEscalationCheckboxChange(arg) {
      const skipSave = arg && arg.skipSave;
      const fields = this.riskEscalationCheckboxFields;
      const anyChecked = fields.some(
        (field) => this.behavioralPolicySettings[field]
      );
      if (this.behavioralPolicySettings.riskEscalationEnabled !== anyChecked) {
        this.behavioralPolicySettings.riskEscalationEnabled = anyChecked;
      }
      
      if(!skipSave) {
        const policyUpdate = {};
        fields.forEach(f => {
           const key = this.getApiKeyForLocalKey(f);
           policyUpdate[key] = this.behavioralPolicySettings[f];
        });
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },
    handlePositiveReinforcementSwitchChange(value) {
      const skipSave = typeof value === 'object' && value.skipSave;
      const actualValue = typeof value === 'boolean' ? value : this.behavioralPolicySettings.positiveReinforcementEnabled;
      
      const fields = this.positiveReinforcementCheckboxFields;
      const policyUpdate = {};
      
      fields.forEach((field) => {
        this.behavioralPolicySettings[field] = actualValue;
        const key = this.getApiKeyForLocalKey(field);
        policyUpdate[key] = actualValue;
      });
      
      if(!skipSave) {
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handlePositiveReinforcementCheckboxChange(arg) {
      const skipSave = arg && arg.skipSave;
      const fields = this.positiveReinforcementCheckboxFields;
      const anyChecked = fields.some(
        (field) => this.behavioralPolicySettings[field]
      );
      if (
        this.behavioralPolicySettings.positiveReinforcementEnabled !==
        anyChecked
      ) {
        this.behavioralPolicySettings.positiveReinforcementEnabled = anyChecked;
      }
      
      if(!skipSave) {
        const policyUpdate = {};
        fields.forEach(f => {
           const key = this.getApiKeyForLocalKey(f);
           policyUpdate[key] = this.behavioralPolicySettings[f];
        });
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handleDifficultyProgressionSwitchChange(value) {
      const skipSave = typeof value === 'object' && value.skipSave;
      const actualValue = typeof value === 'boolean' ? value : this.behavioralPolicySettings.difficultyProgressionEnabled;
      
      const fields = this.difficultyProgressionCheckboxFields;
      const policyUpdate = {};
      
      fields.forEach((field) => {
        this.behavioralPolicySettings[field] = actualValue;
        const key = this.getApiKeyForLocalKey(field);
        policyUpdate[key] = actualValue;
      });
      
      if(!skipSave) {
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handleDifficultyProgressionCheckboxChange(arg) {
      const skipSave = arg && arg.skipSave;
      const fields = this.difficultyProgressionCheckboxFields;
      const anyChecked = fields.some(
        (field) => this.behavioralPolicySettings[field]
      );
      if (
        this.behavioralPolicySettings.difficultyProgressionEnabled !==
        anyChecked
      ) {
        this.behavioralPolicySettings.difficultyProgressionEnabled = anyChecked;
      }
      
      if(!skipSave) {
        const policyUpdate = {};
        fields.forEach(f => {
           const key = this.getApiKeyForLocalKey(f);
           policyUpdate[key] = this.behavioralPolicySettings[f];
        });
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },
    handleNudgesSwitchChange(value) {
      const skipSave = typeof value === 'object' && value.skipSave;
      const actualValue = typeof value === 'boolean' ? value : this.behavioralPolicySettings.nudgesEnabled;
      
      const fields = this.nudgesCheckboxFields;
      const policyUpdate = {};
      
      fields.forEach((field) => {
        this.behavioralPolicySettings[field] = actualValue;
        const key = this.getApiKeyForLocalKey(field);
        policyUpdate[key] = actualValue;
      });
      
      if(!skipSave) {
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handleNudgesCheckboxChange(arg) {
      const skipSave = arg && arg.skipSave;
      const fields = this.nudgesCheckboxFields;
      const anyChecked = fields.some(
        (field) => this.behavioralPolicySettings[field]
      );
      if (this.behavioralPolicySettings.nudgesEnabled !== anyChecked) {
        this.behavioralPolicySettings.nudgesEnabled = anyChecked;
      }
      
      if(!skipSave) {
        const policyUpdate = {};
        fields.forEach(f => {
           const key = this.getApiKeyForLocalKey(f);
           policyUpdate[key] = this.behavioralPolicySettings[f];
        });
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handleTrainingEnablementSwitchChange(value) {
      const skipSave = typeof value === 'object' && value.skipSave;
      const actualValue = typeof value === 'boolean' ? value : this.behavioralPolicySettings.trainingEnablementEnabled;
      
      const fields = this.trainingEnablementCheckboxFields;
      const policyUpdate = {};
      
      fields.forEach((field) => {
        this.behavioralPolicySettings[field] = actualValue;
        const key = this.getApiKeyForLocalKey(field);
        policyUpdate[key] = actualValue;
      });
      
      if(!skipSave) {
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    },

    handleTrainingEnablementCheckboxChange(arg) {
      const skipSave = arg && arg.skipSave;
      const fields = this.trainingEnablementCheckboxFields;
      const anyChecked = fields.some(
        (field) => this.behavioralPolicySettings[field]
      );
      if (
        this.behavioralPolicySettings.trainingEnablementEnabled !== anyChecked
      ) {
        this.behavioralPolicySettings.trainingEnablementEnabled = anyChecked;
      }
      
      if(!skipSave) {
        const policyUpdate = {};
        fields.forEach(f => {
           const key = this.getApiKeyForLocalKey(f);
           policyUpdate[key] = this.behavioralPolicySettings[f];
        });
        this.updateSettings({ behavioralPolicies: policyUpdate });
      }
    }
  }
};
</script>
