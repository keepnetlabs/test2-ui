<template>
  <div class="campaign-reports" id="campaign-reports">
    <div class="campaign-reports__content">
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <iframe v-else style="border: none; width: 100%; height: 100vh;" :src="src"></iframe>
    </div>
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
      src: ``
    }
  },
  created() {
    this.callForData()
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

          this.src = `https://qlik.devkeepnet.com/custom/single/?appid=6ef0b3f6-d3a2-4aed-a416-5afb1cf3ec83&sheet=5454d995-a0fe-4eb1-b741-0b6f26c1e7d4&opt=noselections,ctxmenu&qlikTicket=${ticket}&select=$::PhishingCampaignJob.ResourceId,${this?.$route?.params?.id}&select=$::Company.ResourceId,${companyResourceId}`
        })
        .finally(this.setLoading)
    }
  }
}
</script>
