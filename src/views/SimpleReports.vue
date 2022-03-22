<template>
  <div class="campaign-reports" id="campaign-reports">
    <div class="campaign-reports__content">
      <iframe style="border: none; width: 100%; height: 80vh;" :src="src"></iframe>
    </div>
  </div>
</template>

<script>
import { useLoading } from '@/hooks/useLoading'
import { getTicket } from '@/api/common'
export default {
  name: 'SimpleReports',
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
          debugger
          /*
          const companyResourceId =
            localStorage.getItem('isSelectCompany') === 'true'
              ? localStorage.getItem('companyRequestId')
              : localStorage.getItem('companyResourceId')

           */
          //https://qlik.devkeepnet.com/single/?appid=6ef0b3f6-d3a2-4aed-a416-5afb1cf3ec83&obj=CRxuQjL&opt=ctxmenu,currsel
          //https://qlik.devkeepnet.com/single/?appid=6ef0b3f6-d3a2-4aed-a416-5afb1cf3ec83&sheet=5454d995-a0fe-4eb1-b741-0b6f26c1e7d4&opt=ctxmenu,currsel
          //https://qlik.devkeepnet.com/custom/single/?appid=6ef0b3f6-d3a2-4aed-a416-5afb1cf3ec83&sheet=5454d995-a0fe-4eb1-b741-0b6f26c1e7d4&opt=ctxmenu,currsel?qlikTicket=
          this.src = `https://qlik.devkeepnet.com/custom/single/?appid=6ef0b3f6-d3a2-4aed-a416-5afb1cf3ec83&sheet=5454d995-a0fe-4eb1-b741-0b6f26c1e7d4&opt=ctxmenu,currsel?qlikTicket=${ticket}&select=$::COMPANYID,%7B08E4D039-FEF0-47F1-8F73-003DA41D15DB%7D`
        })
        .finally(this.setLoading)
    }
  }
}
</script>
