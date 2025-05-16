<template>
  <div class="columns-row">
    <CardLoading
      :loading="incidentLoading"
      class="dashboard-cards__skeleton-loading"
      :class="[incidentLoading && 'dashboard-cards-loading']"
    >
      <template #skeleton-content>
        <div
          id="card--incident-responder-phishing-reporter"
          class="dashboard-cards phishing-reporter mr-2"
        >
          <div class="card-header">
            <span class="head">Total Analysis Request</span>
          </div>
          <div class="columns-row__body">
            <div class="card-body">
              <div
                class="biggest"
                id="card--incident-responder-phishing-reporter-online-users-count"
              >
                {{ summaryData.totalAnalysisRequest || 0 }}
              </div>
            </div>
            <div
              class="card-footer"
              id="card--incident-responder-phishing-reporter-total-users-count"
            >
              from
              {{ summaryData.clientCount || 0 }}
              clients
            </div>
          </div>
          <div class="bg-image" style="bottom: 10px; right: -11px;">
            <img src="../../assets/img/book-glass.svg" alt="client count" />
          </div>
        </div>
      </template>
    </CardLoading>
    <CardLoading
      :loading="incidentLoading"
      class="dashboard-cards__skeleton-loading"
      :class="[incidentLoading && 'dashboard-cards-loading']"
    >
      <template #skeleton-content>
        <div
          id="card--incident-responder-incident-analysis"
          class="dashboard-cards bg-image-incident-analysis mr-2"
        >
          <div class="card-header">
            <span class="head">Found Phishing</span>
          </div>
          <div class="columns-row__body">
            <div class="card-body">
              <div
                class="biggest"
                id="card--incident-responder-incident-analysis-notified-harmful-count"
              >
                {{ summaryData.totalHarmfulUrl || 0 }}
              </div>
            </div>
            <div
              class="card-footer"
              id="card--incident-responder-incident-analysis-reported-mail-count"
            >
              of
              {{ summaryData.totalAnalyzedUrl || 0 }}
              analysed URLs
            </div>
          </div>
          <div class="bg-image">
            <img src="../../assets/img/hook.svg" alt="analysed urls" />
          </div>
        </div>
      </template>
    </CardLoading>
    <CardLoading
      :loading="incidentLoading"
      class="dashboard-cards__skeleton-loading"
      :class="[incidentLoading && 'dashboard-cards-loading']"
    >
      <template #skeleton-content>
        <div
          id="card--incident-responder-investigations"
          class="dashboard-cards investigations mr-2"
        >
          <div class="card-header">
            <span class="head">Found Malicious</span>
          </div>
          <div class="columns-row__body">
            <div class="card-body">
              <div
                class="biggest"
                id="card--incident-responder-incident-analysis-notified-harmful-count2"
              >
                {{ summaryData.totalHarmfulAttachment || 0 }}
              </div>
            </div>
            <div
              class="card-footer"
              id="card--incident-responder-incident-analysis-reported-mail-count3"
            >
              of
              {{ summaryData.totalAnalyzedAttachment || 0 }}
              analysed files
            </div>
          </div>
          <div class="bg-image">
            <img src="../../assets/img/bug.svg" alt="total attachment" />
          </div>
        </div>
      </template>
    </CardLoading>
    <CardLoading
      :loading="incidentLoading"
      :class="['dashboard-cards__skeleton-loading', incidentLoading && 'dashboard-cards-loading']"
    >
      <template #skeleton-content>
        <div id="card--incident-responder-roi-summary" class="dashboard-cards roi-summary">
          <div class="card-header">
            <span class="head">Undetected</span>
          </div>
          <div class="columns-row__body">
            <div class="card-body">
              <div
                class="biggest"
                id="card--incident-responder-incident-analysis-notified-harmful-count11"
              >
                {{ summaryData.totalUndetected || 0 }}
              </div>
            </div>
            <div
              class="card-footer"
              id="card--incident-responder-incident-analysis-reported-mail-count12"
            >
              of
              {{ summaryData.totalAnalysisRequest || 0 }}
              analysed emails
            </div>
          </div>
          <div class="bg-image">
            <img src="../../assets/img/circle.svg" alt="analysed emails" />
          </div>
        </div>
      </template>
    </CardLoading>
  </div>
</template>

<script>
import CardLoading from '@/components/SkeletonLoading/IRCardLoading'
export default {
  name: 'SandboxCards',
  components: { CardLoading },
  props: {
    incidentLoading: {
      type: Boolean
    },
    summaryData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
