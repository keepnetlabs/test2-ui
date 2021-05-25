<template>
  <div class="workshop">
    <multipane class="vertical-panes" layout="vertical">
      <div class="pane" :style="{ width: '50%' }">
        <div>
          <h6 class="title is-6">Pane 1</h6>
        </div>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane" :style="{ flexGrow: 1 }">
        <div>
          <h6 class="title is-6">Pane 3</h6>
        </div>
      </div>
    </multipane>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane'

export default {
  name: 'Workshop',
  props: {},
  components: { Multipane, MultipaneResizer },
  data() {
    return {
      formData: {
        inputFirstName: null
      }
    }
  },
  mounted() {},
  methods: {
    submit() {
      this.$refs.form1.validate()
    }
  }
}
</script>

<style lang="scss">
.workshop {
  min-height: 80vh !important;
  padding-top: 10px;
  &__container {
    padding: 0 16px 24px 16px !important;
    width: 100%;
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
  .vertical-panes {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
  }
  .vertical-panes > .pane {
    text-align: left;
    padding: 15px;
    overflow: hidden;
    background: #eee;
  }
  .vertical-panes > .pane ~ .pane {
    border-left: 1px solid #ccc;
  }
}
</style>
