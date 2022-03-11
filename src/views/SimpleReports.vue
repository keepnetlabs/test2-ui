<template>
  <div class="campaign-reports" id="campaign-reports">
    <div class="campaign-reports__content">
      <iframe style="border: none; width: 100%; height: 100%;" :src="src"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleReports',
  data() {
    const companyResourceId =
      localStorage.getItem('isSelectCompany') === 'true'
        ? localStorage.getItem('companyRequestId')
        : localStorage.getItem('companyResourceId')
    return {
      src: `https://51.89.212.138/single/?appid=39e2ee85-4add-4156-8baa-980f7086a9b9&sheet=5fe1fcbb-0701-49ed-8a24-79ef90f59831&opt=ctxmenu,currsel&select=$::Company.ResourceId,${companyResourceId}`
    }
  }
}
</script>
