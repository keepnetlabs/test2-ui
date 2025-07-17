<template>
  <v-tooltip bottom max-width="300" color="#B83A3A">
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
        class="red-flag-tooltip-trigger"
        style="
          position: absolute;
          top: 16px;
          left: 2px;
          width: 100%;
          height: 16px;
          z-index: 2;
          cursor: pointer;
        "
      ></div>
    </template>
    <span>{{ tooltipContent }}</span>
  </v-tooltip>
</template>
<script>
export default {
  name: 'RedFlagTooltip',
  props: {
    tooltipContent: {
      type: String,
      default: ''
    }
  }
}
</script>
