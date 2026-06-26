<template>
  <div v-if="isVisible">
    <div
      class="sovereignty-report-drawer__overlay"
      :class="{ 'nested-overlay': isNested }"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="[getNavigationDrawerClass, 'sovereignty-report-drawer']"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header">
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle id="text--sovereignty-report-title" class="k-overlay__title">
                  Data residency report
                </VListItemTitle>
                <VListItemSubtitle
                  v-if="headerSubtitle"
                  id="text--sovereignty-report-subtitle"
                  class="text-truncate"
                >
                  {{ headerSubtitle }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </div>
          <div>
            <VIcon
              id="btn-close--sovereignty-report"
              class="cursor-pointer"
              color="#757575"
              @click="closeDrawer"
            >
              mdi-close
            </VIcon>
          </div>
        </div>
      </div>
      <div class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body sovereignty-report-drawer__body">
        <template v-if="loading">
          <div class="sovereignty-report-drawer__skeleton">
            <div class="sovereignty-report-drawer__skeleton-banner">
              <VSkeletonLoader type="avatar" width="24" height="24" />
              <div class="sovereignty-report-drawer__skeleton-banner-text">
                <VSkeletonLoader type="text" width="92%" height="13" class="mb-2" />
                <VSkeletonLoader type="text" width="78%" height="13" />
              </div>
            </div>

            <div class="sovereignty-report-drawer__skeleton-section">
              <VSkeletonLoader type="text" width="120" height="14" class="mb-3" />
              <div class="sovereignty-report-drawer__skeleton-meta-card">
                <div
                  v-for="i in 6"
                  :key="`meta-${i}`"
                  class="sovereignty-report-drawer__skeleton-meta-item"
                >
                  <VSkeletonLoader type="text" width="80" height="11" class="mb-2" />
                  <VSkeletonLoader type="text" width="70%" height="13" />
                </div>
              </div>
            </div>

            <div class="sovereignty-report-drawer__skeleton-section">
              <VSkeletonLoader type="text" width="160" height="14" class="mb-3" />
              <div class="sovereignty-report-drawer__skeleton-cards">
                <div
                  v-for="i in 2"
                  :key="`db-${i}`"
                  class="sovereignty-report-drawer__skeleton-card"
                >
                  <div class="sovereignty-report-drawer__skeleton-card-head">
                    <VSkeletonLoader type="text" width="120" height="16" />
                    <VSkeletonLoader type="text" width="80" height="20" />
                  </div>
                  <div
                    v-for="j in 4"
                    :key="`row-${i}-${j}`"
                    class="sovereignty-report-drawer__skeleton-card-row"
                  >
                    <VSkeletonLoader type="text" width="80" height="12" />
                    <VSkeletonLoader type="text" width="60%" height="12" />
                  </div>
                  <div class="sovereignty-report-drawer__skeleton-stats">
                    <div
                      v-for="k in 3"
                      :key="`stat-${i}-${k}`"
                      class="sovereignty-report-drawer__skeleton-stat"
                    >
                      <VSkeletonLoader type="text" width="32" height="20" class="mb-1" />
                      <VSkeletonLoader type="text" width="56" height="10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="sovereignty-report-drawer__skeleton-section">
              <VSkeletonLoader type="text" width="140" height="14" class="mb-3" />
              <div class="sovereignty-report-drawer__skeleton-rules">
                <div
                  v-for="i in 5"
                  :key="`rule-${i}`"
                  class="sovereignty-report-drawer__skeleton-rule"
                >
                  <div class="sovereignty-report-drawer__skeleton-rule-head">
                    <VSkeletonLoader type="avatar" width="18" height="18" />
                    <VSkeletonLoader type="text" width="32" height="13" />
                    <VSkeletonLoader
                      type="text"
                      width="56"
                      height="20"
                      class="sovereignty-report-drawer__skeleton-rule-chip"
                    />
                  </div>
                  <VSkeletonLoader type="text" width="92%" height="12" class="mt-2" />
                  <VSkeletonLoader type="text" width="38%" height="12" class="mt-2" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="errorMessage">
          <AlertBox
            class="bg-red-light"
            icon-color="#f56c6c"
            icon-name="mdi-alert"
            :slots="{ primaryAction: false, secondaryAction: false }"
          >
            <template #text>
              <p class="mb-0">{{ errorMessage }}</p>
            </template>
          </AlertBox>
        </template>
        <template v-else-if="report">
          <AlertBox
            v-if="report.conclusion"
            class="sovereignty-report-drawer__verdict-alert"
            :class="verdictAlert.bg"
            :icon-color="verdictAlert.color"
            :icon-name="verdictAlert.icon"
            :slots="{ primaryAction: false, secondaryAction: false }"
          >
            <template #text>
              <p class="mb-0 sovereignty-report-drawer__verdict-text">
                {{ report.conclusion }}
              </p>
            </template>
          </AlertBox>

          <section v-if="auditMetadata" class="sovereignty-report-drawer__section">
            <h3 class="sovereignty-report-drawer__section-title">Audit metadata</h3>
            <div class="sovereignty-report-drawer__meta-grid">
              <div
                v-if="auditMetadata.expectedRegion"
                class="sovereignty-report-drawer__meta-item"
              >
                <span class="sovereignty-report-drawer__meta-label">Selected region</span>
                <span class="sovereignty-report-drawer__region-pill">
                  <VIcon size="14" color="#2196f3">mdi-database</VIcon>
                  {{ auditMetadata.expectedRegion }}
                </span>
              </div>
              <div v-if="auditMetadata.reportId" class="sovereignty-report-drawer__meta-item">
                <span class="sovereignty-report-drawer__meta-label">Report ID</span>
                <span class="sovereignty-report-drawer__meta-value sovereignty-report-drawer__meta-value--mono">
                  {{ auditMetadata.reportId }}
                </span>
              </div>
              <div v-if="auditMetadata.generatedBy" class="sovereignty-report-drawer__meta-item">
                <span class="sovereignty-report-drawer__meta-label">Generated by</span>
                <span class="sovereignty-report-drawer__meta-value">{{ auditMetadata.generatedBy }}</span>
              </div>
              <div v-if="auditMetadata.generatedAtUtc" class="sovereignty-report-drawer__meta-item">
                <span class="sovereignty-report-drawer__meta-label">Generated (UTC)</span>
                <span class="sovereignty-report-drawer__meta-value">{{ auditMetadata.generatedAtUtc }}</span>
              </div>
              <div v-if="auditMetadata.environment" class="sovereignty-report-drawer__meta-item">
                <span class="sovereignty-report-drawer__meta-label">Environment</span>
                <span class="sovereignty-report-drawer__meta-value">{{ auditMetadata.environment }}</span>
              </div>
              <div v-if="auditMetadata.evidenceLevel" class="sovereignty-report-drawer__meta-item">
                <span class="sovereignty-report-drawer__meta-label">Evidence level</span>
                <span class="sovereignty-report-drawer__meta-value">{{ auditMetadata.evidenceLevel }}</span>
              </div>
              <div v-if="report.companyResourceId" class="sovereignty-report-drawer__meta-item">
                <span class="sovereignty-report-drawer__meta-label">Company resource ID</span>
                <span class="sovereignty-report-drawer__meta-value sovereignty-report-drawer__meta-value--mono">
                  {{ report.companyResourceId }}
                </span>
              </div>
            </div>
          </section>

          <section v-if="latestMigration" class="sovereignty-report-drawer__section">
            <h3 class="sovereignty-report-drawer__section-title">Migration</h3>
            <article class="sovereignty-report-drawer__migration-card">
              <header class="sovereignty-report-drawer__migration-head">
                <div class="sovereignty-report-drawer__migration-target">
                  <VIcon size="18" color="#2196f3">mdi-database-arrow-right</VIcon>
                  <span>{{ latestMigration.toRegion || '—' }}</span>
                </div>
                <span
                  class="sovereignty-report-drawer__migration-chip"
                  :class="`sovereignty-report-drawer__migration-chip--${migrationStatusMeta.variant}`"
                >
                  <VIcon size="14" :color="migrationStatusMeta.iconColor">
                    {{ migrationStatusMeta.icon }}
                  </VIcon>
                  {{ migrationStatusMeta.label }}
                </span>
              </header>

              <dl class="sovereignty-report-drawer__db-meta">
                <div class="sovereignty-report-drawer__db-meta-line">
                  <dt>Started (UTC)</dt>
                  <dd>{{ latestMigration.startedAtUtc || '—' }}</dd>
                </div>
                <div class="sovereignty-report-drawer__db-meta-line">
                  <dt>Finished (UTC)</dt>
                  <dd>{{ latestMigration.finishedAtUtc || '—' }}</dd>
                </div>
                <div
                  v-if="latestMigration.jobResourceId"
                  class="sovereignty-report-drawer__db-meta-line"
                >
                  <dt>Job ID</dt>
                  <dd class="sovereignty-report-drawer__meta-value--mono">
                    {{ latestMigration.jobResourceId }}
                  </dd>
                </div>
              </dl>

              <div class="sovereignty-report-drawer__migration-stats">
                <div class="sovereignty-report-drawer__stat">
                  <span class="sovereignty-report-drawer__stat-value">
                    {{ formatNumber(latestMigration.processedRowCount) }}
                  </span>
                  <span class="sovereignty-report-drawer__stat-label">Processed</span>
                </div>
                <div class="sovereignty-report-drawer__stat">
                  <span class="sovereignty-report-drawer__stat-value">
                    {{ formatNumber(latestMigration.totalRowCount) }}
                  </span>
                  <span class="sovereignty-report-drawer__stat-label">Total rows</span>
                </div>
                <div v-if="latestMigration.failedRowCount > 0" class="sovereignty-report-drawer__stat">
                  <span class="sovereignty-report-drawer__stat-value sovereignty-report-drawer__stat-value--danger">
                    {{ formatNumber(latestMigration.failedRowCount) }}
                  </span>
                  <span class="sovereignty-report-drawer__stat-label">Failed</span>
                </div>
              </div>

              <footer
                v-if="migrationStatusMeta.variant === 'failed' && latestMigration.failureReason"
                class="sovereignty-report-drawer__migration-failure"
              >
                <VIcon size="16" color="#f56c6c">mdi-alert-circle</VIcon>
                <span>{{ latestMigration.failureReason }}</span>
              </footer>
            </article>
          </section>

          <section v-if="databaseChecks.length" class="sovereignty-report-drawer__section">
            <h3 class="sovereignty-report-drawer__section-title">
              Database checks
              <span class="sovereignty-report-drawer__section-count">{{ databaseChecks.length }}</span>
            </h3>
            <div class="sovereignty-report-drawer__db-grid">
              <article
                v-for="(db, idx) in databaseChecks"
                :key="`db-${idx}-${db.databaseName}`"
                class="sovereignty-report-drawer__db-card"
              >
                <header class="sovereignty-report-drawer__db-header">
                  <div class="sovereignty-report-drawer__db-name">
                    <VIcon size="18" color="#2196f3">mdi-database</VIcon>
                    <span>{{ db.databaseName }}</span>
                  </div>
                  <span
                    class="sovereignty-report-drawer__role-chip"
                    :class="`sovereignty-report-drawer__role-chip--${roleVariant(db.role)}`"
                  >
                    {{ humanizeRole(db.role) }}
                  </span>
                </header>
                <dl class="sovereignty-report-drawer__db-meta">
                  <div v-if="db.region" class="sovereignty-report-drawer__db-meta-line">
                    <dt>Region</dt>
                    <dd>{{ db.region }}</dd>
                  </div>
                  <div v-if="db.databaseServer" class="sovereignty-report-drawer__db-meta-line">
                    <dt>Server</dt>
                    <dd class="sovereignty-report-drawer__truncate">{{ db.databaseServer }}</dd>
                  </div>
                  <div v-if="db.logicalDatabaseName" class="sovereignty-report-drawer__db-meta-line">
                    <dt>Logical DB</dt>
                    <dd>{{ db.logicalDatabaseName }}</dd>
                  </div>
                  <div v-if="db.queryExecutionTimestampUtc" class="sovereignty-report-drawer__db-meta-line">
                    <dt>Checked at (UTC)</dt>
                    <dd>{{ db.queryExecutionTimestampUtc }}</dd>
                  </div>
                </dl>
                <div class="sovereignty-report-drawer__stats">
                  <div class="sovereignty-report-drawer__stat">
                    <span class="sovereignty-report-drawer__stat-value">{{ formatNumber(db.totalRowCount) }}</span>
                    <span class="sovereignty-report-drawer__stat-label">Total rows</span>
                  </div>
                  <div class="sovereignty-report-drawer__stat">
                    <span class="sovereignty-report-drawer__stat-value">{{ formatNumber(db.piiPopulatedRowCount) }}</span>
                    <span class="sovereignty-report-drawer__stat-label">PII populated</span>
                  </div>
                  <div class="sovereignty-report-drawer__stat">
                    <span class="sovereignty-report-drawer__stat-value">{{ formatNumber(db.piiEmptyRowCount) }}</span>
                    <span class="sovereignty-report-drawer__stat-label">PII empty</span>
                  </div>
                </div>
                <div
                  v-if="Array.isArray(db.sampleResourceIds) && db.sampleResourceIds.length"
                  class="sovereignty-report-drawer__sample-ids"
                >
                  <span class="sovereignty-report-drawer__meta-label">Sample resource IDs</span>
                  <div class="sovereignty-report-drawer__sample-id-list">
                    <code
                      v-for="rid in db.sampleResourceIds"
                      :key="rid"
                      class="sovereignty-report-drawer__sample-id"
                    >
                      {{ rid }}
                    </code>
                  </div>
                </div>
                <footer v-if="db.status" class="sovereignty-report-drawer__db-footer">
                  Status: <strong>{{ db.status }}</strong>
                </footer>
              </article>
            </div>
          </section>

          <section v-if="validationRules.length" class="sovereignty-report-drawer__section">
            <h3 class="sovereignty-report-drawer__section-title">Validation rules</h3>
            <div
              v-if="piiFieldsConsidered.length"
              class="sovereignty-report-drawer__pii-fields"
            >
              <span class="sovereignty-report-drawer__pii-fields-label">
                PII fields evaluated
              </span>
              <div class="sovereignty-report-drawer__pii-fields-list">
                <span
                  v-for="field in piiFieldsConsidered"
                  :key="field"
                  class="sovereignty-report-drawer__pii-field"
                >
                  {{ field }}
                </span>
              </div>
            </div>
            <ul class="sovereignty-report-drawer__rules">
              <li
                v-for="rule in validationRules"
                :key="rule.ruleId"
                class="sovereignty-report-drawer__rule"
              >
                <div class="sovereignty-report-drawer__rule-head">
                  <VIcon
                    :color="rule.outcome === 'PASS' ? '#43a047' : rule.outcome === 'FAIL' ? '#f56c6c' : '#9e9e9e'"
                    size="18"
                  >
                    {{
                      rule.outcome === 'PASS'
                        ? 'mdi-check-circle'
                        : rule.outcome === 'FAIL'
                          ? 'mdi-close-circle'
                          : 'mdi-help-circle-outline'
                    }}
                  </VIcon>
                  <span class="sovereignty-report-drawer__rule-id">{{ rule.ruleId }}</span>
                  <span
                    class="sovereignty-report-drawer__outcome-chip"
                    :class="`sovereignty-report-drawer__outcome-chip--${(rule.outcome || 'unknown').toLowerCase()}`"
                  >
                    {{ rule.outcome || 'NOT EVALUATED' }}
                  </span>
                </div>
                <p class="mb-0 sovereignty-report-drawer__rule-desc">{{ rule.description }}</p>
                <code v-if="rule.passCondition" class="sovereignty-report-drawer__rule-cond">
                  {{ rule.passCondition }}
                </code>
              </li>
            </ul>
            <div
              v-if="overallPassCondition"
              class="sovereignty-report-drawer__overall-cond"
            >
              <span class="sovereignty-report-drawer__overall-cond-label">
                Overall pass condition
              </span>
              <code class="sovereignty-report-drawer__overall-cond-value">
                {{ overallPassCondition }}
              </code>
            </div>
          </section>

          <section v-if="violations.length" class="sovereignty-report-drawer__section">
            <h3 class="sovereignty-report-drawer__section-title sovereignty-report-drawer__section-title--danger">
              Violations
              <span class="sovereignty-report-drawer__section-count sovereignty-report-drawer__section-count--danger">
                {{ violations.length }}
              </span>
            </h3>
            <ul class="sovereignty-report-drawer__violations">
              <li
                v-for="(v, idx) in violations"
                :key="`violation-${idx}`"
                class="sovereignty-report-drawer__violation"
              >
                <pre>{{ formatJson(v) }}</pre>
              </li>
            </ul>
          </section>

          <section v-if="evidenceTrail.length" class="sovereignty-report-drawer__section">
            <h3 class="sovereignty-report-drawer__section-title">
              Evidence trail
              <span class="sovereignty-report-drawer__section-count">{{ evidenceTrail.length }}</span>
            </h3>
            <ol class="sovereignty-report-drawer__steps">
              <li
                v-for="step in evidenceTrail"
                :key="`step-${step.step}`"
                class="sovereignty-report-drawer__step"
              >
                <details>
                  <summary class="sovereignty-report-drawer__step-summary">
                    <span class="sovereignty-report-drawer__step-number">{{ step.step }}</span>
                    <span class="sovereignty-report-drawer__step-action">{{ step.action }}</span>
                    <span
                      v-if="step.ruleOutcome"
                      class="sovereignty-report-drawer__outcome-chip"
                      :class="`sovereignty-report-drawer__outcome-chip--${step.ruleOutcome.toLowerCase()}`"
                    >
                      {{ step.ruleEvaluated }} · {{ step.ruleOutcome }}
                    </span>
                  </summary>
                  <div class="sovereignty-report-drawer__step-body">
                    <div v-if="step.databaseRole" class="sovereignty-report-drawer__step-meta">
                      <span class="sovereignty-report-drawer__meta-label">Source</span>
                      <span>{{ step.databaseRole }}</span>
                    </div>
                    <div v-if="step.query" class="sovereignty-report-drawer__step-block">
                      <span class="sovereignty-report-drawer__meta-label">Query</span>
                      <pre>{{ step.query }}</pre>
                    </div>
                    <div v-if="step.result !== undefined" class="sovereignty-report-drawer__step-block">
                      <span class="sovereignty-report-drawer__meta-label">Result</span>
                      <pre>{{ formatJson(step.result) }}</pre>
                    </div>
                  </div>
                </details>
              </li>
            </ol>
          </section>

          <section v-if="auditConclusion" class="sovereignty-report-drawer__section">
            <h3 class="sovereignty-report-drawer__section-title">Audit conclusion</h3>
            <div class="sovereignty-report-drawer__conclusion-card">
              <div class="sovereignty-report-drawer__conclusion-head">
                <span
                  class="sovereignty-report-drawer__verdict-pill"
                  :class="`sovereignty-report-drawer__verdict-pill--${verdictTone}`"
                >
                  {{ auditConclusion.verdict }}
                </span>
                <span v-if="auditConclusion.evidenceLevel" class="sovereignty-report-drawer__pill">
                  {{ auditConclusion.evidenceLevel }}
                </span>
              </div>
              <p v-if="auditConclusion.statement" class="mb-0 sovereignty-report-drawer__conclusion-text">
                {{ auditConclusion.statement }}
              </p>
              <footer
                v-if="auditConclusion.signedBy || auditConclusion.signedAtUtc"
                class="sovereignty-report-drawer__conclusion-foot"
              >
                <template v-if="auditConclusion.signedBy">
                  Signed by <strong>{{ auditConclusion.signedBy }}</strong>
                </template>
                <template v-if="auditConclusion.signedAtUtc">
                  on <strong>{{ auditConclusion.signedAtUtc }}</strong> (UTC)
                </template>
              </footer>
            </div>
          </section>
        </template>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import AlertBox from '@/components/AlertBox'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
import useHtmlOverflowControl from '@/hooks/useHtmlOverflowControl'
import { getPiiResidencyReport } from '@/api/company'

export default {
  name: 'SovereigntyReportDrawer',
  components: { AlertBox },
  mixins: [useDrawerAnimation, useHtmlOverflowControl],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    companyResourceId: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: ''
    },
    isNested: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      report: null,
      errorMessage: '',
      requestToken: 0
    }
  },
  computed: {
    headerSubtitle() {
      const region = this.report?.expectedRegion
      if (this.companyName && region) return `${this.companyName} · ${region}`
      return this.companyName || region || ''
    },
    auditMetadata() {
      return this.report?.auditMetadata || null
    },
    latestMigration() {
      return this.report?.latestMigration || null
    },
    migrationStatusMeta() {
      const migration = this.latestMigration
      // Native migration enum: 0 Queued, 1 InProgress, 2 Completed, 3 Failed.
      const status = Number(migration?.status)
      const byStatus = {
        0: { variant: 'queued', icon: 'mdi-clock-outline', iconColor: '#9e9e9e' },
        1: { variant: 'in-progress', icon: 'mdi-progress-clock', iconColor: '#2196f3' },
        2: { variant: 'completed', icon: 'mdi-check-circle', iconColor: '#43a047' },
        3: { variant: 'failed', icon: 'mdi-close-circle', iconColor: '#f56c6c' }
      }
      const meta = byStatus[status] || {
        variant: 'unknown',
        icon: 'mdi-help-circle-outline',
        iconColor: '#9e9e9e'
      }
      return {
        ...meta,
        status,
        label: migration?.statusName || 'Unknown'
      }
    },
    databaseChecks() {
      if (!Array.isArray(this.report?.databaseChecks)) return []
      const rolePriority = { 'expected-region': 0, central: 1, 'other-region': 2 }
      return [...this.report.databaseChecks].sort((a, b) => {
        const pa = rolePriority[a?.role] ?? 99
        const pb = rolePriority[b?.role] ?? 99
        return pa - pb
      })
    },
    violations() {
      return Array.isArray(this.report?.violations) ? this.report.violations : []
    },
    evidenceTrail() {
      return Array.isArray(this.report?.evidenceTrail) ? this.report.evidenceTrail : []
    },
    auditConclusion() {
      return this.report?.auditConclusion || null
    },
    verdictTone() {
      const verdict = (this.report?.verdict || '').toUpperCase()
      if (verdict === 'PASS') return 'pass'
      if (verdict === 'REGIONLESS') return 'regionless'
      return 'fail'
    },
    verdictAlert() {
      if (this.verdictTone === 'pass') {
        return { bg: 'bg-green-light', color: '#43a047', icon: 'mdi-check-circle' }
      }
      if (this.verdictTone === 'regionless') {
        return { bg: 'bg-aqua-light', color: '#2196f3', icon: 'mdi-information' }
      }
      return { bg: 'bg-red-light', color: '#f56c6c', icon: 'mdi-alert-circle' }
    },
    ruleOutcomes() {
      const outcomes = {}
      for (const step of this.evidenceTrail) {
        if (step.ruleEvaluated) {
          outcomes[step.ruleEvaluated] = step.ruleOutcome
        }
      }
      return outcomes
    },
    validationRules() {
      const rules = this.report?.validationLogic?.rules
      if (!Array.isArray(rules)) return []
      return rules.map((r) => ({
        ruleId: r.ruleId,
        description: r.description,
        passCondition: r.passCondition,
        outcome: this.ruleOutcomes[r.ruleId]
      }))
    },
    piiFieldsConsidered() {
      const fields = this.report?.validationLogic?.piiFieldsConsidered
      return Array.isArray(fields) ? fields : []
    },
    overallPassCondition() {
      return this.report?.validationLogic?.overallPassCondition || ''
    }
  },
  watch: {
    isVisible: {
      handler(val) {
        if (val) {
          this.fetchReport()
        } else {
          this.resetState()
        }
      },
      immediate: false
    }
  },
  methods: {
    resetState() {
      this.loading = false
      this.report = null
      this.errorMessage = ''
      this.requestToken += 1
    },
    fetchReport() {
      if (!this.companyResourceId) return
      const token = ++this.requestToken
      this.loading = true
      this.report = null
      this.errorMessage = ''
      getPiiResidencyReport(this.companyResourceId, { loading: false })
        .then((res) => {
          if (token !== this.requestToken) return
          this.report = res?.data?.data ?? null
        })
        .catch((err) => {
          if (token !== this.requestToken) return
          this.errorMessage =
            err?.response?.data?.validationMessages?.[0] ||
            err?.response?.data?.message ||
            'Failed to load report.'
        })
        .finally(() => {
          if (token !== this.requestToken) return
          this.loading = false
        })
    },
    humanizeRole(role) {
      if (!role) return ''
      if (role === 'central') return 'Central'
      if (role === 'expected-region') return 'Selected region'
      if (role === 'other-region') return 'Other region'
      return role
    },
    roleVariant(role) {
      if (role === 'expected-region') return 'expected'
      if (role === 'central') return 'central'
      return 'other'
    },
    formatNumber(value) {
      const num = Number(value)
      if (!Number.isFinite(num)) return '-'
      return num.toLocaleString('en-US')
    },
    formatJson(value) {
      try {
        return JSON.stringify(value, null, 2)
      } catch (e) {
        return String(value)
      }
    }
  }
}
</script>
