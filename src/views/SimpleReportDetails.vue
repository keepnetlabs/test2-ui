<template>
  <div class="campaign-reports pt-0" id="simple-report-details">
    <v-layout id="ts-layout" wrap style="min-height: 80vh;">
      <v-col class="k-container__tab-container" cols="12">
        <v-card id="campaign-manager-report-card" class="k-card">
          <el-tabs v-model="tab">
            <el-tab-pane label="Summary" name="summary" id="simple-report-details-summary-content">
              <DatatableLoading v-if="isLoading" :loading="isLoading" />
              <iframe v-else style="border: none; width: 100%; height: 100vh;" :src="src"></iframe>
            </el-tab-pane>
            <el-tab-pane label="Details" name="details" id="simple-report-details-summary-content">
              <DatatableLoading v-if="isLoading" :loading="isLoading" />
              <iframe
                v-else
                style="border: none; width: 100%; height: 100vh;"
                :src="srcOpened"
              ></iframe>
            </el-tab-pane>
          </el-tabs>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import { useLoading } from '@/hooks/useLoading'
import { getTicket } from '@/api/common'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
export default {
  name: 'SimpleReportDetails',
  components: { DatatableLoading },
  mixins: [useLoading],
  data() {
    return {
      tab: 'summary',
      src: ``,
      srcOpened: ''
    }
  },
  created() {
    this.callForData()
  },
  watch: {
    tab() {
      this.callForData()
    }
  },
  methods: {
    callForData() {
      this.setLoading(true)
      getTicket()
        .then((response) => {
          const {
            data: {
              data: { ticket }
            }
          } = response || { data: { data: { ticket: '' } } }
          console.log('qlikTicket', ticket)

          const companyResourceId =
            localStorage.getItem('isSelectCompany') === 'true'
              ? localStorage.getItem('companyRequestId')
              : localStorage.getItem('companyResourceId')

          //https://qlik.devkeepnet.com/single/?appid=6ef0b3f6-d3a2-4aed-a416-5afb1cf3ec83&obj=CRxuQjL&opt=ctxmenu,currsel
          //https://qlik.devkeepnet.com/single/?appid=6ef0b3f6-d3a2-4aed-a416-5afb1cf3ec83&sheet=5454d995-a0fe-4eb1-b741-0b6f26c1e7d4&opt=ctxmenu,currsel
          //https://qlik.devkeepnet.com/custom/single/?appid=6ef0b3f6-d3a2-4aed-a416-5afb1cf3ec83&sheet=5454d995-a0fe-4eb1-b741-0b6f26c1e7d4&opt=ctxmenu,currsel?qlikTicket=
          const iframeSrc = `https://qlik.devkeepnet.com/custom/single/?appid=e532f28a-5e2b-454f-acb7-054a907afb8e&sheet=${
            this.tab === 'summary'
              ? '5fe1fcbb-0701-49ed-8a24-79ef90f59831'
              : '9607d39b-fb4f-444d-a1cd-57bc096e905e'
          }&opt=noselections,ctxmenu&qlikTicket=${ticket}&select=$::PhishingCampaignJob.ResourceId,${
            this?.$route?.params?.id
          }&select=$::Company.ResourceId,${companyResourceId}`
          this[this.tab === 'summary' ? 'src' : 'srcOpened'] = iframeSrc
        })
        .finally(this.setLoading)
    }
  }
}
</script>
