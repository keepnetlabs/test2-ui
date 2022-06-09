<template>
  <div class="configure-new-company-next-steps-item">
    <h3>{{ title }}</h3>
    <slot>
      <p>
        Go to <router-link :to="routeLink" target="_blank"> {{ routeText }} </router-link>
        {{ text }}
      </p>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'ConfigureNewCompanyNextStepsItem',
  props: {
    routeLink: {
      validator(value) {
        return typeof value === 'string' || typeof value === 'object'
      }
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
