<template>
  <div
    class="data-table-loading"
    v-if="loading"
    :class="loaderType === 0 ? 'data-table-loading' : 'data-table-loading-v2'"
  >
    <v-skeleton-loader
      :loading="loading"
      v-show="loading"
      v-bind="attrs"
      v-if="loaderType === 0"
      type="table-heading,table-tbody"
    >
      <slot name="skeleton-content"></slot>
    </v-skeleton-loader>
    <semipolar-spinner :animation-duration="2000" :size="65" color="#2196f3" v-else />
  </div>
</template>

<script>
import { SemipolarSpinner } from 'epic-spinners'

export default {
  name: 'DatatableLoading',
  props: {
    loading: { required: true, default: false, type: Boolean },
    loaderType: { required: false, default: 0, type: Number }
  },
  components: {
    SemipolarSpinner
  },
  data() {
    return {
      attrs: {
        boilerplate: false
      }
    }
  }
}
</script>

<style lang="scss">
.data-table-loading {
  height: 100%;
  margin-bottom: 20px;
}

.data-table-loading-v2 {
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 4;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  .semipolar-spinner {
    margin: 0 auto;
  }
  /*
    position: relative;
  margin-top: 50px;
  z-index: 999999;
  width: 100%;
  min-height: 372px;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
   */
}
</style>
