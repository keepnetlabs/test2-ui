<template>
  <div class="email-details-ai-analyze">
    <div v-if="isLoadingReport" class="email-details-ai-analyze__loader-wrapper">
      <EmailTemplatesAILoader
        title="AI Analysis is running"
        description="This process may take approximately 30 seconds. Please stay on the page during this time."
        :loader-time="30"
        :is-loading-finished="!isLoadingReport"
      />
    </div>
    <v-card v-else light class="email-details-ai-analyze__card">
      <div class="email-details-ai-analyze__header">
        <div>
          <div class="email-details-ai-analyze__title">AI Analysis Summary</div>
          <div class="email-details-ai-analyze__subtitle">
            Structured assessment summary
          </div>
        </div>
        <div class="email-details-ai-analyze__header-actions" v-if="report">
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
          <v-btn
            color="#1e88e5"
            dark
            depressed
            small
            class="email-details-ai-analyze__cta-btn"
            @click="runAnalysis"
            :loading="isRunningAnalysis"
          >
            <v-icon left small>mdi-refresh</v-icon>
            Re-run Analysis
          </v-btn>
        </div>
      </div>

      <div v-if="loadError" class="email-details-ai-analyze__empty">
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
          Run AI Analysis to generate a report for this email.
        </div>
        <v-btn
          color="#1e88e5"
          dark
          depressed
          class="email-details-ai-analyze__cta-btn mt-3"
          @click="runAnalysis"
          :loading="isRunningAnalysis"
        >
          <v-icon left>mdi-brain</v-icon>
          Run AI Analysis
        </v-btn>
      </div>

      <div v-else>
        <div
          class="email-details-ai-analyze__section email-details-ai-analyze__section--summary"
        >
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">1</span>
            Executive Summary
          </div>
          <p v-if="whyThisMatters" class="email-details-ai-analyze__section-subtitle">
            {{ whyThisMatters }}
          </p>
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
                :text="formattedVerdict"
                :color="getVerdictColor(formattedVerdict)"
                size="small"
                :outline="false"
                :fullWidth="false"
              />
            </div>
            <div class="email-details-ai-analyze__summary-item">
              <span class="email-details-ai-analyze__label">Confidence</span>
              <v-tooltip bottom nudge-left="40">
                <template v-slot:activator="{ on, attrs }">
                  <div class="email-details-ai-analyze__confidence-badge-wrapper" v-bind="attrs" v-on="on">
                    <Badge
                      class-name="email-details-ai-analyze__badge"
                      :text="confidenceLevel"
                      :color="getConfidenceLevelColor(confidenceLevel)"
                      size="small"
                      :outline="false"
                      :fullWidth="false"
                    />
                  </div>
                </template>
                <span>{{ confidenceBasis }}</span>
              </v-tooltip>
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
          </div>
        </div>

        <div class="email-details-ai-analyze__section">
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">2</span>
            Agent Determination
          </div>
          <p class="email-details-ai-analyze__body-text">
            {{
              isAgentDeterminationExpanded
                ? agentDeterminationText
                : agentDeterminationPreview
            }}
          </p>
          <v-btn
            v-if="isAgentDeterminationLong"
            text
            small
            color="#1e88e5"
            class="email-details-ai-analyze__metadata-toggle"
            @click="toggleAgentDetermination"
          >
            <v-icon left small>
              {{ isAgentDeterminationExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
            {{ isAgentDeterminationExpanded ? "Show less" : "Show more" }}
          </v-btn>
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
                  v-if="!showAllObservedIndicators && observedMoreCount > 0"
                  class="email-details-ai-analyze__pill email-details-ai-analyze__pill--more email-details-ai-analyze__pill--clickable"
                  @click="toggleObservedIndicators"
                >
                  View all indicators
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
                  v-if="!showAllNotObservedIndicators && notObservedMoreCount > 0"
                  class="email-details-ai-analyze__pill email-details-ai-analyze__pill--more email-details-ai-analyze__pill--clickable"
                  @click="toggleNotObservedIndicators"
                >
                  View all indicators
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
          <div class="email-details-ai-analyze__evidence-stepper">
            <div
              v-for="(step, index) in report.evidence_flow"
              :key="`stepper-${step.step}`"
              class="email-details-ai-analyze__evidence-step"
            >
              <div class="email-details-ai-analyze__timeline-step">
                {{ step.step }}
              </div>
              <div class="email-details-ai-analyze__evidence-step-label">
                {{ step.title }}
              </div>
              <v-icon
                v-if="index < report.evidence_flow.length - 1"
                class="email-details-ai-analyze__evidence-step-arrow"
                small
              >
                mdi-chevron-right
              </v-icon>
            </div>
          </div>
          <div class="email-details-ai-analyze__evidence-panels">
            <div
              v-for="step in report.evidence_flow"
              :key="step.step"
              class="email-details-ai-analyze__evidence-panel"
              :class="{ 'email-details-ai-analyze__evidence-panel--open': isEvidenceStepOpen(step.step) }"
            >
              <button
                type="button"
                class="email-details-ai-analyze__evidence-toggle"
                @click="toggleEvidenceStep(step.step)"
              >
                <div class="email-details-ai-analyze__evidence-panel-header">
                  <div class="email-details-ai-analyze__timeline-step">
                    {{ step.step }}
                  </div>
                  <div class="email-details-ai-analyze__evidence-panel-main">
                    <div class="email-details-ai-analyze__timeline-title">
                      {{ step.title }}
                    </div>
                    <div
                      class="email-details-ai-analyze__evidence-chip"
                      :class="`email-details-ai-analyze__evidence-chip--${getEvidenceFindingMeta(step).tone}`"
                    >
                      {{ getEvidenceFindingMeta(step).text }}
                    </div>
                  </div>
                  <v-icon class="email-details-ai-analyze__evidence-chevron" small>
                    {{
                      isEvidenceStepOpen(step.step)
                        ? "mdi-chevron-up"
                        : "mdi-chevron-down"
                    }}
                  </v-icon>
                </div>
              </button>
              <transition name="email-details-ai-analyze__evidence-transition">
                <div
                  v-if="isEvidenceStepOpen(step.step)"
                  class="email-details-ai-analyze__evidence-panel-body email-details-ai-analyze__body-text"
                >
                  {{ step.description }}
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div
          v-if="hasUrlEvidenceArtifacts"
          class="email-details-ai-analyze__section"
        >
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">5</span>
            Rendered URL Evidence
          </div>
          <p class="email-details-ai-analyze__section-subtitle">
            Browser-rendered screenshots and visual AI signals for URLs found in the email.
          </p>
          <div class="email-details-ai-analyze__url-evidence-grid">
            <div
              v-for="artifact in urlEvidenceArtifacts"
              :key="getEvidenceArtifactKey(artifact)"
              class="email-details-ai-analyze__url-evidence-card"
            >
              <div class="email-details-ai-analyze__url-evidence-preview">
                <img
                  v-if="urlEvidenceImageUrls[getEvidenceArtifactKey(artifact)]"
                  :src="urlEvidenceImageUrls[getEvidenceArtifactKey(artifact)]"
                  :alt="getEvidenceArtifactTitle(artifact)"
                  class="email-details-ai-analyze__url-evidence-image"
                  role="button"
                  tabindex="0"
                  @click="openUrlEvidencePreview(artifact)"
                  @keyup.enter="openUrlEvidencePreview(artifact)"
                />
                <div
                  v-else
                  class="email-details-ai-analyze__url-evidence-placeholder"
                >
                  <v-progress-circular
                    v-if="urlEvidenceImageLoading[getEvidenceArtifactKey(artifact)]"
                    indeterminate
                    size="22"
                    width="2"
                    color="#1e88e5"
                  />
                  <v-icon v-else color="#90a4ae">mdi-image-off-outline</v-icon>
                </div>
              </div>
              <div class="email-details-ai-analyze__url-evidence-content">
                <div class="email-details-ai-analyze__url-evidence-header">
                  <Badge
                    class-name="email-details-ai-analyze__badge"
                    :text="formatEvidenceStatus(artifact.status)"
                    :color="getEvidenceStatusColor(artifact.status)"
                    size="small"
                    :outline="false"
                    :fullWidth="false"
                  />
                  <Badge
                    v-if="artifact.vision_verdict"
                    class-name="email-details-ai-analyze__badge"
                    :text="formatVisionVerdict(artifact.vision_verdict)"
                    :color="getVisionVerdictColor(artifact.vision_verdict)"
                    size="small"
                    :outline="false"
                    :fullWidth="false"
                  />
                  <Badge
                    v-if="artifact.vision_confidence"
                    class-name="email-details-ai-analyze__badge"
                    :text="formatVisionConfidence(artifact.vision_confidence)"
                    :color="getVisionConfidenceColor(artifact.vision_confidence)"
                    size="small"
                    :outline="false"
                    :fullWidth="false"
                  />
                </div>
                <div class="email-details-ai-analyze__url-evidence-url">
                  {{ artifact.normalized_url || artifact.original_url }}
                </div>
                <div
                  v-if="hasDistinctOriginalUrl(artifact)"
                  class="email-details-ai-analyze__url-evidence-original-url"
                >
                  Original: {{ artifact.original_url }}
                </div>
                <p
                  v-if="artifact.evidence_summary"
                  class="email-details-ai-analyze__body-text email-details-ai-analyze__url-evidence-summary"
                >
                  {{ artifact.evidence_summary }}
                </p>
                <p
                  v-if="isInsufficientDataEvidence(artifact)"
                  class="email-details-ai-analyze__url-evidence-muted"
                >
                  AI could not determine a reliable visual verdict from this screenshot. Manual review is recommended.
                </p>
                <div
                  v-if="getEvidenceSignalFlags(artifact).length"
                  class="email-details-ai-analyze__url-evidence-flags"
                >
                  <span
                    v-for="flag in getEvidenceSignalFlags(artifact)"
                    :key="`${getEvidenceArtifactKey(artifact)}-${flag}`"
                    class="email-details-ai-analyze__url-evidence-flag"
                  >
                    {{ flag }}
                  </span>
                </div>
                <div
                  v-if="Array.isArray(artifact.visual_signals) && artifact.visual_signals.length"
                  class="email-details-ai-analyze__url-evidence-signals"
                >
                  <div class="email-details-ai-analyze__url-evidence-subhead">
                    Visual Signals
                  </div>
                  <ul class="email-details-ai-analyze__url-evidence-signal-list">
                    <li
                      v-for="signal in artifact.visual_signals.slice(0, 5)"
                      :key="`${getEvidenceArtifactKey(artifact)}-${signal}`"
                    >
                      {{ signal }}
                    </li>
                  </ul>
                </div>
                <div
                  v-if="artifact.recommended_action"
                  class="email-details-ai-analyze__url-evidence-action"
                >
                  <strong>Recommended action:</strong>
                  {{ artifact.recommended_action }}
                </div>
                <p
                  v-if="!artifact.evidence_summary && !artifact.screenshot_url"
                  class="email-details-ai-analyze__url-evidence-muted"
                >
                  Screenshot was rendered, but no stored preview is available.
                </p>
                <p
                  v-if="urlEvidenceImageErrors[getEvidenceArtifactKey(artifact)] || artifact.error"
                  class="email-details-ai-analyze__url-evidence-error"
                >
                  {{ formatEvidenceError(urlEvidenceImageErrors[getEvidenceArtifactKey(artifact)] || artifact.error) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <v-dialog
          v-model="isUrlEvidencePreviewOpen"
          max-width="1100"
          overlay-opacity="0.72"
        >
          <v-card v-if="selectedUrlEvidenceArtifact" light class="email-details-ai-analyze__preview-dialog">
            <div class="email-details-ai-analyze__preview-header">
              <div>
                <div class="email-details-ai-analyze__preview-title">
                  Rendered URL Evidence
                </div>
                <div class="email-details-ai-analyze__preview-url">
                  {{ selectedUrlEvidenceArtifact.normalized_url || selectedUrlEvidenceArtifact.original_url }}
                </div>
              </div>
              <v-btn icon small @click="closeUrlEvidencePreview">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <div class="email-details-ai-analyze__preview-body">
              <img
                :src="getEvidenceImageObjectUrl(selectedUrlEvidenceArtifact)"
                :alt="getEvidenceArtifactTitle(selectedUrlEvidenceArtifact)"
                class="email-details-ai-analyze__preview-image"
              />
            </div>
          </v-card>
        </v-dialog>

        <div class="email-details-ai-analyze__section">
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">{{ actionsSectionIndex }}</span>
            Actions Recommended
          </div>
          <div class="email-details-ai-analyze__actions-group">
            <div
              v-for="group in actionGroups"
              :key="group.key"
              class="email-details-ai-analyze__action-group"
            >
              <div class="email-details-ai-analyze__action-group-title">
                <span>{{ group.title }}</span>
                <v-tooltip bottom max-width="240">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      small
                      color="#78909c"
                      class="email-details-ai-analyze__action-group-info"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>{{ group.description }}</span>
                </v-tooltip>
              </div>
              <div class="email-details-ai-analyze__action-group-subtitle">
                {{ group.shortLabel }}
              </div>
              <div class="email-details-ai-analyze__actions">
                <div
                  v-for="(item, index) in group.items"
                  :key="`${group.key}-${index}`"
                  class="email-details-ai-analyze__action-item"
                >
                  <v-icon class="email-details-ai-analyze__action-icon" :color="group.iconColor">
                    {{ group.icon }}
                  </v-icon>
                  <span class="email-details-ai-analyze__body-text">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="email-details-ai-analyze__section email-details-ai-analyze__section--last"
        >
          <div class="email-details-ai-analyze__section-title">
            <span class="email-details-ai-analyze__section-index">{{ metadataSectionIndex }}</span>
            Confidence & Metadata
          </div>
          <div class="email-details-ai-analyze__callout">
            <v-icon class="email-details-ai-analyze__callout-icon" color="#1173C1"
              >mdi-information</v-icon
            >
            <p class="email-details-ai-analyze__body-text">
              {{ report.confidence_limitations }}
            </p>
          </div>
          <v-btn
            text
            small
            color="#1e88e5"
            class="email-details-ai-analyze__metadata-toggle"
            @click="toggleMetadata"
          >
            <v-icon left small>
              {{ isMetadataExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
            {{ isMetadataExpanded ? "Hide details" : "Show details" }}
          </v-btn>
          <div v-if="isMetadataExpanded" class="email-details-ai-analyze__metadata">
            <div class="email-details-ai-analyze__metadata-item">
              <span class="email-details-ai-analyze__metadata-label">Analysis Source</span>
              <span class="email-details-ai-analyze__metadata-value">Auto Analysis</span>
            </div>
            <div class="email-details-ai-analyze__metadata-item">
              <span class="email-details-ai-analyze__metadata-label">Created At</span>
              <span class="email-details-ai-analyze__metadata-value">
                {{ formattedReportCreatedAt }}
              </span>
            </div>
            <div class="email-details-ai-analyze__metadata-item">
              <span class="email-details-ai-analyze__metadata-label">Analysis Engine</span>
              <span class="email-details-ai-analyze__metadata-value">Agentic AI</span>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import Badge from "@/components/Badge";
import EmailTemplatesAILoader from "@/components/EmailTemplates/EmailTemplatesAILoader";
import {
  getBtnPriorityColor,
  getBtnStatusColor,
  getTimeZoneForMoment
} from "@/utils/functions";
import axios from "axios";
import AuthenticationService from "@/services/authentication";
export default {
  name: "EmailDetailsAIAnalyze",
  components: {
    Badge,
    EmailTemplatesAILoader
  },
  props: {
    id: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    const evidenceFindingMetaMap = {
      PASS: { text: "PASS", tone: "pass", icon: "mdi-check-circle" },
      FLAG: { text: "FLAG", tone: "flag", icon: "mdi-flag-variant" },
      ALERT: { text: "ALERT", tone: "alert", icon: "mdi-bell-alert" },
      HIGH: { text: "HIGH", tone: "high", icon: "mdi-arrow-up-bold-circle" },
      SPAM: { text: "Spam", tone: "spam", icon: "mdi-email-remove" },
      MARKETING: { text: "Marketing", tone: "marketing", icon: "mdi-bullhorn" },
      INTERNAL: { text: "Internal", tone: "internal", icon: "mdi-office-building" },
      "CEO FRAUD": { text: "CEO Fraud", tone: "ceo-fraud", icon: "mdi-account-tie" },
      PHISHING: { text: "Phishing", tone: "phishing", icon: "mdi-fish" },
      SEXTORTION: {
        text: "Sextortion",
        tone: "sextortion",
        icon: "mdi-alert-octagon"
      },
      MALWARE: { text: "Malware", tone: "malware", icon: "mdi-bug" },
      "SECURITY AWARENESS": {
        text: "Security Awareness",
        tone: "security-awareness",
        icon: "mdi-school"
      },
      "OTHER SUSPICIOUS": {
        text: "Other Suspicious",
        tone: "other-suspicious",
        icon: "mdi-help-rhombus"
      },
      BENIGN: { text: "Benign", tone: "benign", icon: "mdi-shield-check" },
      // Legacy labels kept for backward compatibility.
      PHISH: { text: "Phish", tone: "phishing", icon: "mdi-fish" }
    };

    return {
      isLoadingReport: true,
      isRunningAnalysis: false,
      loadError: "",
      report: null,
      reportCreatedAt: null,
      urlEvidenceImageUrls: {},
      urlEvidenceImageLoading: {},
      urlEvidenceImageErrors: {},
      selectedUrlEvidenceArtifact: null,
      isUrlEvidencePreviewOpen: false,
      isMetadataExpanded: true,
      isAgentDeterminationExpanded: false,
      openEvidenceSteps: [],
      evidenceFindingMetaMap,
      showAllObservedIndicators: false,
      showAllNotObservedIndicators: false,
      staticReport: {
        executive_summary: {
          email_category: "Marketing",
          verdict: "No Threat Detected - Marketing Email",
          risk_level: "Low",
          confidence: 0.9,
          confidence_level: "High",
          confidence_basis: "Based on behavioral and contextual indicators.",
          why_this_matters: "",
          reported_by: 1,
          status: "Analysis Complete"
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
              'The investigation concluded that this is a legitimate marketing/event campaign email, not a phishing or social engineering attack. The case was documented for audit purposes with a final status of "Analysis Complete" and no remediation actions required beyond standard user awareness.'
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
    confidenceLevel() {
      if (this.report?.executive_summary?.evidence_strength) {
        return this.report.executive_summary.evidence_strength;
      }
      if (this.report?.executive_summary?.confidence_level) {
        return this.report.executive_summary.confidence_level;
      }
      const val = this.report?.executive_summary?.confidence;
      if (val === null || val === undefined) return "N/A";
      const pct = Math.round(Number(val) * 100);
      if (pct >= 80) return "Strong";
      if (pct >= 50) return "Moderate";
      return "Limited";
    },
    confidenceBasis() {
      return (
        this.report?.executive_summary?.confidence_basis ||
        "Based on behavioral and contextual indicators."
      );
    },
    formattedVerdict() {
      const verdict = this.report?.executive_summary?.verdict || "";
      return verdict.replace(
        "Confirmed Phishing Attack",
        "High-Risk Phishing"
      );
    },
    whyThisMatters() {
      return this.report?.executive_summary?.why_this_matters || "";
    },
    urlEvidenceArtifacts() {
      const artifacts = this.report?.url_evidence_artifacts;
      return Array.isArray(artifacts) ? artifacts : [];
    },
    hasUrlEvidenceArtifacts() {
      return this.urlEvidenceArtifacts.length > 0;
    },
    actionsSectionIndex() {
      return this.hasUrlEvidenceArtifacts ? 6 : 5;
    },
    metadataSectionIndex() {
      return this.hasUrlEvidenceArtifacts ? 7 : 6;
    },
    agentDeterminationText() {
      return this.report?.agent_determination || "";
    },
    isAgentDeterminationLong() {
      return this.agentDeterminationText.length > 280;
    },
    agentDeterminationPreview() {
      if (!this.isAgentDeterminationLong) return this.agentDeterminationText;
      return `${this.agentDeterminationText.slice(0, 280).trim()}...`;
    },
    observedIndicators() {
      const observed = this.report?.risk_indicators?.observed || [];
      return this.showAllObservedIndicators ? observed : observed.slice(0, 4);
    },
    notObservedIndicators() {
      const notObserved = this.report?.risk_indicators?.not_observed || [];
      return this.showAllNotObservedIndicators ? notObserved : notObserved.slice(0, 4);
    },
    observedMoreCount() {
      const observed = this.report?.risk_indicators?.observed || [];
      return Math.max(0, observed.length - 4);
    },
    notObservedMoreCount() {
      const notObserved = this.report?.risk_indicators?.not_observed || [];
      return Math.max(0, notObserved.length - 4);
    },
    formattedReportCreatedAt() {
      if (!this.reportCreatedAt) return "N/A";
      const format = getTimeZoneForMoment() || "YYYY/MM/DD HH:mm";
      if (!this.$moment) return this.reportCreatedAt;
      return this.$moment(this.reportCreatedAt).format(format);
    },
    actionGroups() {
      const actions = this.report?.actions_recommended;

      if (Array.isArray(actions)) {
        return [
          {
            key: "legacy",
            title: "Recommended Actions",
            items: actions,
            icon: "mdi-check-circle",
            iconColor: "#43a047"
          }
        ];
      }

      const p1 = Array.isArray(actions?.p1_immediate) ? actions.p1_immediate : [];
      const p2 = Array.isArray(actions?.p2_follow_up) ? actions.p2_follow_up : [];
      const p3 = Array.isArray(actions?.p3_hardening) ? actions.p3_hardening : [];

      return [
        {
          key: "p1",
          title: "P1",
          shortLabel: "Immediate",
          description: "Immediate action required.",
          items: p1,
          icon: "mdi-alert-circle",
          iconColor: "#d32f2f"
        },
        {
          key: "p2",
          title: "P2",
          shortLabel: "Follow-up",
          description: "Follow-up actions to complete within 24 hours.",
          items: p2,
          icon: "mdi-progress-clock",
          iconColor: "#f9a825"
        },
        {
          key: "p3",
          title: "P3",
          shortLabel: "Hardening",
          description: "Hardening and long-term preventive improvements.",
          items: p3,
          icon: "mdi-shield-check",
          iconColor: "#1e88e5"
        }
      ].filter((group) => group.items.length > 0);
    }
  },
  methods: {
    async runAnalysis() {
      if (!this.id) return;
      this.revokeUrlEvidenceImageUrls();
      this.isRunningAnalysis = true;
      this.isLoadingReport = true;
      this.loadError = "";
      this.report = null;
      this.reportCreatedAt = null;
      this.isMetadataExpanded = true;
      this.isAgentDeterminationExpanded = false;
      this.openEvidenceSteps = [];
      this.$emit("update:loading", true);
      try {
        const accessToken = AuthenticationService.getToken();
        const apiBaseUrl =
          APP_CONFIG?.VUE_APP_ROOT_API || "https://test-api.devkeepnet.com";
        const body = {
          id: this.id,
          accessToken,
          apiBaseUrl
        };
        const isLocalhost = globalThis.location.hostname.includes("localhost");
        const url = isLocalhost
          ? "http://localhost:4111/email-ir/analyze"
          : "https://agentic-ai-agent.keepnetlabs.com/email-ir/analyze";
        const response = await axios.post(url, body, {
          headers: { "Content-Type": "application/json" }
        });
        const payload = response?.data || {};
        this.report = payload.report || payload.data?.report || null;
        this.reportCreatedAt = new Date();
        this.openEvidenceSteps = this.getDefaultOpenEvidenceSteps();
        this.loadUrlEvidenceImages();
      } catch (error) {
        console.error("Error running AI analysis:", error);
        this.loadError = "Unable to run AI analysis at this time.";
        this.report = null;
        this.revokeUrlEvidenceImageUrls();
      } finally {
        this.isRunningAnalysis = false;
        this.isLoadingReport = false;
        this.$emit("update:loading", false);
      }
    },
    async fetchReport() {
      if (!this.id) return;
      this.revokeUrlEvidenceImageUrls();
      this.isLoadingReport = true;
      this.loadError = "";
      this.reportCreatedAt = null;
      this.isMetadataExpanded = true;
      this.isAgentDeterminationExpanded = false;
      this.openEvidenceSteps = [];
      this.$emit("update:loading", true);
      try {
        const accessToken = AuthenticationService.getToken();
        const apiBaseUrl =
          APP_CONFIG?.VUE_APP_ROOT_API || "https://test-api.devkeepnet.com";
        const body = {
          id: this.id,
          accessToken,
          apiBaseUrl
        };
        const isLocalhost = globalThis.location.hostname.includes("localhost");
        const url = isLocalhost
          ? "http://localhost:4111/email-ir/analyze"
          : "https://agentic-ai-agent.keepnetlabs.com/email-ir/analyze";
        const response = await axios.post(url, body, {
          headers: { "Content-Type": "application/json" }
        });
        const payload = response?.data || {};
        this.report = payload.report || payload.data?.report || null;
        this.reportCreatedAt = new Date();
        this.openEvidenceSteps = this.getDefaultOpenEvidenceSteps();
        this.loadUrlEvidenceImages();
      } catch (error) {
        console.error("Error fetching AI analyze report:", error);
        this.loadError = "Unable to load AI analysis report at this time.";
        this.report = null;
        this.revokeUrlEvidenceImageUrls();
      } finally {
        this.isLoadingReport = false;
        this.$emit("update:loading", false);
      }
    },
    getConfidenceLevelColor(level) {
      const normalized = (level || "").toLowerCase();
      if (normalized === "strong" || normalized === "high") {
        return getBtnStatusColor("complete");
      }
      if (normalized === "moderate" || normalized === "medium") {
        return getBtnStatusColor("warning");
      }
      if (normalized === "limited" || normalized === "low") {
        return getBtnStatusColor("pending");
      }
      return getBtnStatusColor("pending");
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
    getEvidenceArtifactKey(artifact) {
      return (
        artifact?.screenshot_key ||
        artifact?.screenshot_url ||
        artifact?.normalized_url ||
        artifact?.original_url ||
        "url-evidence"
      );
    },
    getEvidenceArtifactTitle(artifact) {
      return `Rendered evidence for ${artifact?.normalized_url || artifact?.original_url || "URL"}`;
    },
    getEvidenceImageObjectUrl(artifact) {
      return this.urlEvidenceImageUrls[this.getEvidenceArtifactKey(artifact)] || "";
    },
    openUrlEvidencePreview(artifact) {
      if (!this.getEvidenceImageObjectUrl(artifact)) return;
      this.selectedUrlEvidenceArtifact = artifact;
      this.isUrlEvidencePreviewOpen = true;
    },
    closeUrlEvidencePreview() {
      this.isUrlEvidencePreviewOpen = false;
      this.selectedUrlEvidenceArtifact = null;
    },
    getAgentBaseUrl() {
      const isLocalhost = globalThis.location.hostname.includes("localhost");
      return isLocalhost
        ? "http://localhost:4111"
        : "https://agentic-ai-agent.keepnetlabs.com";
    },
    resolveEvidenceImageUrl(artifact) {
      const screenshotUrl = artifact?.screenshot_url;
      if (!screenshotUrl) return "";
      if (/^https?:\/\//i.test(screenshotUrl)) return screenshotUrl;
      return `${this.getAgentBaseUrl()}${screenshotUrl}`;
    },
    async loadUrlEvidenceImages() {
      const artifacts = this.urlEvidenceArtifacts.filter(
        (artifact) => artifact.screenshot_url
      );
      if (!artifacts.length) return;

      await Promise.all(
        artifacts.map(async (artifact) => {
          const key = this.getEvidenceArtifactKey(artifact);
          const url = this.resolveEvidenceImageUrl(artifact);
          if (!url) return;

          this.$set(this.urlEvidenceImageLoading, key, true);
          this.$delete(this.urlEvidenceImageErrors, key);

          try {
            const response = await axios.get(url, { responseType: "blob" });
            const objectUrl = globalThis.URL.createObjectURL(response.data);
            this.$set(this.urlEvidenceImageUrls, key, objectUrl);
          } catch (error) {
            console.error("Error loading URL evidence image:", error);
            this.$set(
              this.urlEvidenceImageErrors,
              key,
              "Screenshot preview is unavailable."
            );
          } finally {
            this.$set(this.urlEvidenceImageLoading, key, false);
          }
        })
      );
    },
    revokeUrlEvidenceImageUrls() {
      Object.values(this.urlEvidenceImageUrls).forEach((objectUrl) => {
        if (objectUrl) {
          globalThis.URL.revokeObjectURL(objectUrl);
        }
      });
      this.urlEvidenceImageUrls = {};
      this.urlEvidenceImageLoading = {};
      this.urlEvidenceImageErrors = {};
      this.closeUrlEvidencePreview();
    },
    formatEvidenceStatus(status) {
      const labels = {
        stored: "Evidence",
        vision_analyzed: "AI Reviewed",
        rendered: "Rendered",
        blocked: "Blocked",
        skipped: "Skipped",
        error: "Error"
      };
      const normalized = (status || "unknown").toLowerCase();
      if (labels[normalized]) {
        return labels[normalized];
      }
      return normalized
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    },
    formatVisionVerdict(verdict) {
      return (verdict || "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    },
    formatVisionConfidence(confidence) {
      const normalized = (confidence || "").toLowerCase();
      if (!normalized) return "";
      return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)} confidence`;
    },
    hasDistinctOriginalUrl(artifact) {
      return Boolean(
        artifact?.original_url &&
          artifact?.normalized_url &&
          artifact.original_url !== artifact.normalized_url
      );
    },
    getEvidenceSignalFlags(artifact) {
      const flags = [];
      if (artifact?.credential_harvesting) flags.push("Credential Harvesting");
      if (artifact?.brand_impersonation) flags.push("Brand Impersonation");
      if (artifact?.suspicious_redirect) flags.push("Suspicious Redirect");
      return flags;
    },
    formatEvidenceError(error) {
      const text = String(error || "");
      if (!text) return "";
      if (text.includes("put: Unspecified error") || text.includes("r2_put_failed")) {
        return "Screenshot was rendered, but evidence storage is temporarily unavailable.";
      }
      return text;
    },
    isInsufficientDataEvidence(artifact) {
      return (artifact?.vision_verdict || "").toLowerCase() === "insufficient_data";
    },
    getEvidenceStatusColor(status) {
      const normalized = (status || "").toLowerCase();
      if (["stored", "rendered", "vision_analyzed"].includes(normalized)) {
        return getBtnStatusColor("complete");
      }
      if (["blocked", "skipped"].includes(normalized)) {
        return getBtnStatusColor("warning");
      }
      if (normalized === "error") {
        return getBtnStatusColor("malicious");
      }
      return getBtnStatusColor("pending");
    },
    getVisionVerdictColor(verdict) {
      const normalized = (verdict || "").toLowerCase();
      if (normalized === "benign" || normalized === "insufficient_data") {
        return getBtnStatusColor("nonmalicious");
      }
      if (normalized === "suspicious") {
        return getBtnStatusColor("warning");
      }
      return getBtnStatusColor("malicious");
    },
    getVisionConfidenceColor(confidence) {
      const normalized = (confidence || "").toLowerCase();
      if (normalized === "high") return getBtnStatusColor("complete");
      if (normalized === "medium") return getBtnStatusColor("warning");
      if (normalized === "low") return getBtnStatusColor("pending");
      return getBtnStatusColor("pending");
    },
    getEvidenceFindingMeta(step) {
      const rawLabel = step?.finding_label || "";
      const label = rawLabel.trim().toUpperCase();

      if (this.evidenceFindingMetaMap[label]) {
        return this.evidenceFindingMetaMap[label];
      }

      if (label) {
        return {
          text: rawLabel,
          tone: "flag",
          icon: "mdi-information"
        };
      }

      // Backward-compatible fallback when finding_label is not provided yet.
      const normalizedTitle = (step?.title || "").toLowerCase();
      if (normalizedTitle.includes("risk") || normalizedTitle.includes("threat")) {
        return { text: "HIGH", tone: "high", icon: "mdi-arrow-up-bold-circle" };
      }
      if (normalizedTitle.includes("final") || normalizedTitle.includes("verdict")) {
        return { text: "Phishing", tone: "phishing", icon: "mdi-fish" };
      }
      return { text: "PASS", tone: "pass", icon: "mdi-check-circle" };
    },
    getDefaultOpenEvidenceSteps() {
      const firstStep = this.report?.evidence_flow?.[0]?.step;
      return firstStep !== undefined && firstStep !== null ? [firstStep] : [];
    },
    isEvidenceStepOpen(stepId) {
      return this.openEvidenceSteps.includes(stepId);
    },
    toggleEvidenceStep(stepId) {
      if (this.isEvidenceStepOpen(stepId)) {
        this.openEvidenceSteps = this.openEvidenceSteps.filter(
          (item) => item !== stepId
        );
        return;
      }
      this.openEvidenceSteps = [...this.openEvidenceSteps, stepId];
    },
    toggleMetadata() {
      this.isMetadataExpanded = !this.isMetadataExpanded;
    },
    toggleAgentDetermination() {
      this.isAgentDeterminationExpanded = !this.isAgentDeterminationExpanded;
    },
    toggleObservedIndicators() {
      this.showAllObservedIndicators = !this.showAllObservedIndicators;
    },
    toggleNotObservedIndicators() {
      this.showAllNotObservedIndicators = !this.showAllNotObservedIndicators;
    }
  },
  mounted() {
    this.fetchReport();
  },
  beforeDestroy() {
    this.revokeUrlEvidenceImageUrls();
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

<style scoped>
.email-details-ai-analyze__url-evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.email-details-ai-analyze__url-evidence-card {
  border: 1px solid #e3edf5;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}

.email-details-ai-analyze__url-evidence-preview {
  min-height: 180px;
  background: #f6f9fc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-details-ai-analyze__url-evidence-image {
  display: block;
  width: 100%;
  max-height: 260px;
  object-fit: contain;
  background: #f6f9fc;
  cursor: zoom-in;
}

.email-details-ai-analyze__url-evidence-placeholder {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-details-ai-analyze__url-evidence-content {
  padding: 14px;
}

.email-details-ai-analyze__url-evidence-header {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.email-details-ai-analyze__url-evidence-url {
  color: #263238;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  word-break: break-all;
}

.email-details-ai-analyze__url-evidence-original-url {
  color: #78909c;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 4px;
  word-break: break-all;
}

.email-details-ai-analyze__url-evidence-summary {
  margin-top: 10px;
}

.email-details-ai-analyze__url-evidence-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.email-details-ai-analyze__url-evidence-flag {
  background: #fff3e0;
  border: 1px solid #ffcc80;
  border-radius: 999px;
  color: #e65100;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
}

.email-details-ai-analyze__url-evidence-signals {
  margin-top: 10px;
}

.email-details-ai-analyze__url-evidence-subhead {
  color: #546e7a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.email-details-ai-analyze__url-evidence-signal-list {
  color: #455a64;
  font-size: 12px;
  line-height: 1.45;
  margin: 0;
  padding-left: 18px;
}

.email-details-ai-analyze__url-evidence-action {
  background: #f5f9ff;
  border-left: 3px solid #1e88e5;
  color: #263238;
  font-size: 12px;
  line-height: 1.45;
  margin-top: 10px;
  padding: 8px 10px;
}

.email-details-ai-analyze__url-evidence-error {
  color: #d32f2f;
  font-size: 12px;
  margin: 8px 0 0;
}

.email-details-ai-analyze__url-evidence-muted {
  color: #78909c;
  font-size: 12px;
  margin: 8px 0 0;
}

.email-details-ai-analyze__preview-dialog {
  overflow: hidden;
}

.email-details-ai-analyze__preview-header {
  align-items: flex-start;
  border-bottom: 1px solid #e3edf5;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 14px 16px;
}

.email-details-ai-analyze__preview-title {
  color: #263238;
  font-size: 15px;
  font-weight: 700;
}

.email-details-ai-analyze__preview-url {
  color: #78909c;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 4px;
  word-break: break-all;
}

.email-details-ai-analyze__preview-body {
  background: #f6f9fc;
  max-height: 78vh;
  overflow: auto;
  padding: 16px;
}

.email-details-ai-analyze__preview-image {
  background: #fff;
  display: block;
  margin: 0 auto;
  max-width: 100%;
}
</style>
