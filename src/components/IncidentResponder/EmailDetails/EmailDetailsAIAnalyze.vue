<template>
  <div class="email-details-ai-analyze">
    <v-card light class="email-details-ai-analyze__card">
      <div class="email-details-ai-analyze__header">
        <div>
          <div class="email-details-ai-analyze__title">AI Analyze Report</div>
          <div class="email-details-ai-analyze__subtitle">
            Structured assessment summary
          </div>
        </div>
        <div class="email-details-ai-analyze__header-badges" v-if="report">
          <Badge
            class-name="email-details-ai-analyze__badge"
            :text="report.executive_summary.risk_level"
            :color="getRiskColor(report.executive_summary.risk_level)"
            size="small"
            :outline="false"
            :fullWidth="false"
          />
          <Badge
            class-name="email-details-ai-analyze__badge"
            :text="report.executive_summary.status"
            :color="getStatusColor(report.executive_summary.status)"
            size="small"
            :outline="false"
            :fullWidth="false"
          />
        </div>
      </div>

      <div v-if="isLoadingReport" class="email-details-ai-analyze__skeleton">
        <div class="email-details-ai-analyze__skeleton-row">
          <v-skeleton-loader type="chip" :loading="isLoadingReport" width="120" />
          <v-skeleton-loader type="chip" :loading="isLoadingReport" width="140" />
        </div>
        <v-skeleton-loader type="heading" :loading="isLoadingReport" />
        <div class="email-details-ai-analyze__skeleton-grid">
          <v-skeleton-loader type="card" :loading="isLoadingReport" />
          <v-skeleton-loader type="card" :loading="isLoadingReport" />
          <v-skeleton-loader type="card" :loading="isLoadingReport" />
          <v-skeleton-loader type="card" :loading="isLoadingReport" />
        </div>
        <v-skeleton-loader type="heading" :loading="isLoadingReport" class="mt-4" />
        <v-skeleton-loader type="paragraph" :loading="isLoadingReport" />
        <v-skeleton-loader type="heading" :loading="isLoadingReport" class="mt-4" />
        <div class="email-details-ai-analyze__skeleton-grid">
          <v-skeleton-loader type="chip" :loading="isLoadingReport" />
          <v-skeleton-loader type="chip" :loading="isLoadingReport" />
          <v-skeleton-loader type="chip" :loading="isLoadingReport" />
          <v-skeleton-loader type="chip" :loading="isLoadingReport" />
        </div>
        <v-skeleton-loader type="heading" :loading="isLoadingReport" class="mt-4" />
        <div class="email-details-ai-analyze__skeleton-grid">
          <v-skeleton-loader type="card" :loading="isLoadingReport" />
          <v-skeleton-loader type="card" :loading="isLoadingReport" />
        </div>
      </div>
      <div v-else-if="loadError" class="email-details-ai-analyze__empty">
        <div class="email-details-ai-analyze__empty-title">
          AI analysis unavailable
        </div>
        <div class="email-details-ai-analyze__empty-text">{{ loadError }}</div>
      </div>
      <div v-else-if="!report" class="email-details-ai-analyze__empty">
        <div class="email-details-ai-analyze__empty-title">
          No AI analysis yet
        </div>
        <div class="email-details-ai-analyze__empty-text">
          Run Analyze with AI to generate a report for this email.
        </div>
      </div>

      <div v-else>
        <div
          class="email-details-ai-analyze__section email-details-ai-analyze__section--summary"
        >
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">1</span>
            Executive Summary
          </div>
          <div class="email-details-ai-analyze__summary-grid">
            <div class="email-details-ai-analyze__summary-item">
              <span class="email-details-ai-analyze__label">Category</span>
              <span class="email-details-ai-analyze__category">
                <v-icon class="mr-1" style="font-size: 14px; color: #1173c1;"
                  >mdi-tag</v-icon
                >
                {{ report.executive_summary.email_category }}
              </span>
            </div>
            <div class="email-details-ai-analyze__summary-item">
              <span class="email-details-ai-analyze__label">Verdict</span>
              <Badge
                class-name="email-details-ai-analyze__badge"
                :text="report.executive_summary.verdict"
                :color="getVerdictColor(report.executive_summary.verdict)"
                size="small"
                :outline="false"
                :fullWidth="false"
              />
            </div>
            <div class="email-details-ai-analyze__summary-item">
              <span class="email-details-ai-analyze__label">Confidence</span>
              <span class="email-details-ai-analyze__value">
                {{ formatConfidence(report.executive_summary.confidence) }}
              </span>
              <v-progress-linear
                class="email-details-ai-analyze__progress"
                :value="
                  getConfidencePercent(report.executive_summary.confidence)
                "
                height="6"
                :color="getConfidenceColor(report.executive_summary.confidence)"
                background-color="#e0e0e0"
                rounded
              />
            </div>
            <div class="email-details-ai-analyze__summary-item">
              <span class="email-details-ai-analyze__label">Risk Level</span>
              <Badge
                class-name="email-details-ai-analyze__badge"
                :text="report.executive_summary.risk_level"
                :color="getRiskColor(report.executive_summary.risk_level)"
                size="small"
                :outline="false"
                :fullWidth="false"
              />
            </div>
            <div class="email-details-ai-analyze__summary-item">
              <span class="email-details-ai-analyze__label">Status</span>
              <Badge
                class-name="email-details-ai-analyze__badge"
                :text="report.executive_summary.status"
                :color="getStatusColor(report.executive_summary.status)"
                size="small"
                :outline="false"
                :fullWidth="false"
              />
            </div>
          </div>
        </div>

        <div class="email-details-ai-analyze__section">
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">2</span>
            Agent Determination
          </div>
          <p class="email-details-ai-analyze__body-text">
            {{ report.agent_determination }}
          </p>
        </div>

        <div class="email-details-ai-analyze__section">
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">3</span>
            Risk Indicators
          </div>
          <div class="email-details-ai-analyze__split">
            <div>
              <div class="email-details-ai-analyze__subhead">Observed</div>
              <div class="email-details-ai-analyze__pill-list">
                <span
                  v-for="(item, index) in observedIndicators"
                  :key="`obs-${index}`"
                  class="email-details-ai-analyze__pill email-details-ai-analyze__pill--warning"
                >
                  {{ item }}
                </span>
                <span
                  v-if="!showAllIndicators && observedMoreCount > 0"
                  class="email-details-ai-analyze__pill email-details-ai-analyze__pill--more email-details-ai-analyze__pill--clickable"
                  @click="toggleIndicators"
                >
                  +{{ observedMoreCount }} more
                </span>
              </div>
            </div>
            <div>
              <div class="email-details-ai-analyze__subhead">Not Observed</div>
              <div class="email-details-ai-analyze__pill-list">
                <span
                  v-for="(item, index) in notObservedIndicators"
                  :key="`not-${index}`"
                  class="email-details-ai-analyze__pill email-details-ai-analyze__pill--success"
                >
                  {{ item }}
                </span>
                <span
                  v-if="!showAllIndicators && notObservedMoreCount > 0"
                  class="email-details-ai-analyze__pill email-details-ai-analyze__pill--more email-details-ai-analyze__pill--clickable"
                  @click="toggleIndicators"
                >
                  +{{ notObservedMoreCount }} more
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="email-details-ai-analyze__section">
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">4</span>
            Evidence Flow
          </div>
          <div class="email-details-ai-analyze__timeline">
            <div
              v-for="step in report.evidence_flow"
              :key="step.step"
              class="email-details-ai-analyze__timeline-item"
            >
              <div class="email-details-ai-analyze__timeline-step">
                {{ step.step }}
              </div>
              <div>
                <div class="email-details-ai-analyze__timeline-title">
                  {{ step.title }}
                </div>
                <div class="email-details-ai-analyze__body-text">
                  {{ step.description }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="email-details-ai-analyze__section">
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">5</span>
            Actions Recommended
          </div>
          <ul class="email-details-ai-analyze__list">
            <li
              v-for="(item, index) in report.actions_recommended"
              :key="`act-${index}`"
            >
              {{ item }}
            </li>
          </ul>
        </div>

        <div
          class="email-details-ai-analyze__section email-details-ai-analyze__section--last"
        >
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">6</span>
            Confidence Limitations
          </div>
          <p class="email-details-ai-analyze__body-text">
            {{ report.confidence_limitations }}
          </p>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import Badge from "@/components/Badge";
import { getBtnPriorityColor, getBtnStatusColor } from "@/utils/functions";
import axios from "axios";
import AuthenticationService from "@/services/authentication";
export default {
  name: "EmailDetailsAIAnalyze",
  components: {
    Badge
  },
  props: {
    id: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      isLoadingReport: true,
      loadError: "",
      report: null,
      showAllIndicators: false,
      staticReport: {
        executive_summary: {
          email_category: "Marketing",
          verdict: "No Threat Detected - Marketing Email",
          risk_level: "Low",
          confidence: 0.9,
          reported_by: 1,
          status: "Investigation Complete"
        },
        agent_determination:
          "This email is assessed as a legitimate external marketing communication promoting an AI-focused training/event. Technical controls show strong alignment: SPF, DKIM, and DMARC all pass for keepnetlabs.com, with clean sender IP reputation and normal Microsoft 365/Google routing. Content analysis indicates standard promotional tactics (limited seats, discounts, benefit-focused language) without any credential harvesting, financial redirection, or impersonation of authority. All embedded URLs and the sending infrastructure returned clean results from threat intelligence sources. Based on converging technical and behavioral signals, the email is classified as low-risk marketing with high confidence and no further action required beyond normal user discretion.",
        risk_indicators: {
          observed: [
            'Marketing-style urgency framing present (e.g., limited seats, "HEMEN KAYIT OLUN")',
            "Reward-based emotional framing (time savings, discounts, membership benefits)",
            "Tracking/marketing links present (awstrack.me) typical of campaigns",
            "External promotional content inviting registration for a paid program"
          ],
          not_observed: [
            "No SPF authentication failure",
            "No DKIM authentication failure",
            "No DMARC misalignment or failure",
            "No domain spoofing or typosquatting indicators",
            "No authority impersonation detected",
            "No request for credentials",
            "No direct financial transfer request in the email body",
            "No explicit request for payment details or invoices",
            "No malicious URLs detected by threat intelligence",
            "No attachment-based payloads observed",
            "No verification-avoidance tactics (recipient is not discouraged from verifying independently)",
            "No indications of account compromise or internal mailbox abuse",
            "No security awareness / phishing simulation markers"
          ]
        },
        evidence_flow: [
          {
            step: 1,
            title: "Email Ingestion and Initial Triage",
            description:
              'The email with subject "Fwd: FW: Gelecek hafta bu saatte, yapay zekâ siziniçin çalışıyor olabilir!" from gurkan.ugurlu@keepnetlabs.com was received and automatically queued for analysis after being reported once by a user for review.'
          },
          {
            step: 2,
            title: "Header and Authentication Analysis",
            description:
              "SPF, DKIM, and DMARC all passed and aligned for keepnetlabs.com, with the visible From domain matching authentication headers and no signs of spoofing or domain similarity abuse. The sending IP (Google mail server) showed clean reputation, and the routing path via Google to Microsoft 365 was consistent with expected provider infrastructure over TLS."
          },
          {
            step: 3,
            title: "Behavioral and Content Analysis",
            description:
              'The body content was evaluated for social engineering patterns. The email promoted an AI training/event with calls to action such as "HEMEN KAYIT OLUN" and mentioned limited seats and member discounts, indicating typical marketing urgency and reward framing. No authority impersonation, scare tactics, or attempts to bypass verification were observed.'
          },
          {
            step: 4,
            title: "Intent and Threat Intelligence Correlation",
            description:
              "Intent classification identified the message as benign, with clear promotional/educational marketing goals and no credential or financial harvesting. URLs, including those behind awstrack.me, were checked against threat intelligence sources and returned clean, with no malware, phishing, or C2 indicators associated with the links or sending IP."
          },
          {
            step: 5,
            title: "Risk Assessment and Category Determination",
            description:
              "Combining technical authentication results, behavioral analysis, and clean threat intelligence, the email was categorized as Marketing. The absence of high-risk indicators (credential requests, financial redirection, malicious links) supported a Low risk rating."
          },
          {
            step: 6,
            title: "Final Verdict and Documentation",
            description:
              'The investigation concluded that this is a legitimate marketing/event campaign email, not a phishing or social engineering attack. The case was documented for audit purposes with a final status of "Investigation Complete" and no remediation actions required beyond standard user awareness.'
          }
        ],
        blast_radius: {
          action_taken_before_response:
            "Email was reported by one user for security review but not widely interacted with; no evidence of compromise or malicious activity observed.",
          confirmed_compromise: false
        },
        actions_recommended: [
          "No action required from SOC at this time; retain email in user mailbox.",
          "Advise users to continue exercising normal caution when following external marketing links and registering for third-party events.",
          "Optionally, update email filtering/segmentation rules to classify similar campaigns under a Marketing or Promotions folder for user convenience, without blocking.",
          "No need to block the sender domain or IP, as current indicators show legitimate marketing use."
        ],
        confidence_limitations:
          "High confidence in determination. Multiple independent signals converge on this verdict."
      }
    };
  },
  computed: {
    observedIndicators() {
      const observed = this.report?.risk_indicators?.observed || [];
      return this.showAllIndicators ? observed : observed.slice(0, 4);
    },
    notObservedIndicators() {
      const notObserved = this.report?.risk_indicators?.not_observed || [];
      return this.showAllIndicators ? notObserved : notObserved.slice(0, 4);
    },
    observedMoreCount() {
      const observed = this.report?.risk_indicators?.observed || [];
      return Math.max(0, observed.length - 4);
    },
    notObservedMoreCount() {
      const notObserved = this.report?.risk_indicators?.not_observed || [];
      return Math.max(0, notObserved.length - 4);
    }
  },
  methods: {
    async fetchReport() {
      if (!this.id) return;
      this.isLoadingReport = true;
      this.loadError = "";
      try {
        const accessToken = AuthenticationService.getToken();
        const apiBaseUrl =
          APP_CONFIG?.VUE_APP_ROOT_API || "https://test-api.devkeepnet.com";
        const body = {
          id: this.id,
          accessToken,
          apiBaseUrl
        };
        const isLocalhost = window.location.hostname.includes("localhost");
        const url = isLocalhost
          ? "http://localhost:4111/email-ir/analyze"
          : "https://agentic-ai-agent.keepnetlabs.com/email-ir/analyze";
        const response = await axios.post(url, body, {
          headers: { "Content-Type": "application/json" }
        });
        const payload = response?.data || {};
        this.report = payload.report || payload.data?.report || null;
      } catch (error) {
        console.error("Error fetching AI analyze report:", error);
        this.loadError = "Unable to load AI analysis report at this time.";
        this.report = null;
      } finally {
        this.isLoadingReport = false;
      }
    },
    formatConfidence(value) {
      if (value === null || value === undefined || Number.isNaN(Number(value)))
        return "N/A";
      return `${Math.round(Number(value) * 100)}%`;
    },
    getConfidencePercent(value) {
      if (value === null || value === undefined || Number.isNaN(Number(value)))
        return 0;
      return Math.max(0, Math.min(100, Math.round(Number(value) * 100)));
    },
    getConfidenceColor(value) {
      const percent = this.getConfidencePercent(value);
      if (percent >= 80) return "#43a047";
      if (percent >= 50) return "#1173C1";
      return "#fb8c00";
    },
    getRiskColor(level) {
      return getBtnPriorityColor(level) || getBtnStatusColor(level);
    },
    getVerdictColor(text) {
      const normalized = (text || "").toLowerCase();
      if (normalized.includes("no threat") || normalized.includes("benign")) {
        return getBtnStatusColor("nonmalicious");
      }
      if (normalized.includes("suspicious") || normalized.includes("warning")) {
        return getBtnStatusColor("warning");
      }
      if (normalized.includes("malicious") || normalized.includes("phishing")) {
        return getBtnStatusColor("malicious");
      }
      return getBtnStatusColor("none");
    },
    getStatusColor(text) {
      const normalized = (text || "").toLowerCase();
      if (normalized.includes("complete")) return getBtnStatusColor("complete");
      if (normalized.includes("in progress"))
        return getBtnStatusColor("in progress");
      if (normalized.includes("pending")) return getBtnStatusColor("pending");
      return getBtnStatusColor(normalized);
    },
    toggleIndicators() {
      this.showAllIndicators = !this.showAllIndicators;
    }
  },
  mounted() {
    this.fetchReport();
  },
  watch: {
    id(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.fetchReport();
      }
    }
  }
};
</script>
