<template>
  <div class="configure-new-company-next-steps-item">
    <h3>{{ title }}</h3>
    <slot>
      <p>
        Go to <router-link :to="routeLink"> {{ routeText }} </router-link> {{ text }}
      </p>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'ConfigureNewCompanyNextStepsItem',
  props: {
    routeLink: {
      type: String
    },
    routeText: {
      type: String
    },
    text: {
      type: String
    },
    title: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.configure-new-company-next-steps-item {
  h3 {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #383b41;
  }
  p {
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 24px;
  }
  a {
    text-decoration: none;
  }
}
</style>
