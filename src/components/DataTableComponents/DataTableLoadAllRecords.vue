<template>
  <div class="datatable-all-records">
    <span class="datatable-all-records__text"
      >Only first 1000 records are listed. Load all records to see and filter all records</span
    >
    <v-btn
      :ripple="false"
      class="datatable-all-records__button ml-4"
      rounded
      color="white"
      style="box-shadow: none; border: 1px solid #2196f3 !important;"
      @click="handleAllRecordsButtonClick"
    >
      Load All Records
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'DataTableLoadAllRecords',
  emits: ['on-all-records-button-click'],
  methods: {
    handleAllRecordsButtonClick() {
      this.$emit('on-all-records-button-click')
    }
  }
}
</script>

<style lang="scss">
.datatable-all-records {
  background-color: #fafafa;
  height: 48px;
  display: flex;
  align-items: center;
  &__text {
    margin-left: 27px;
    font-size: 12px;
    font-weight: 600;
    color: #383b41;
  }
  &__button {
    border-radius: 18px;
    background-color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3 !important;
    text-transform: capitalize;
  }
}
</style>
