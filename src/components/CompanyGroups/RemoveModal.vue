<template>
  <app-dialog v-if="!!selectedRow" :status="isShow" icon="mdi-delete" title="Warning!">
    <template v-slot:app-dialog-body>
      {{ selectedRow.companyName && selectedRow.companyName }} will be removed from company group.
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn @click="closeModal" color="#f56c6c" class="delete-user__footer-button" text
          >CANCEL</v-btn
        >
        <v-btn
          @click="confirmRemove"
          color="#2196f3"
          class="delete-user__footer-button"
          style="padding: 0;"
          text
          >REMOVE</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
export default {
  name: 'RemoveModal',
  props: {
    isShow: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  components: {
    AppDialog
  },
  computed: {},
  methods: {
    closeModal() {
      this.$emit('changeModalStatus', false)
    },
    confirmRemove() {
      this.$emit('confirmRemove', this.selectedRow)
      this.$emit('changeModalStatus', false)
    }
  }
}
</script>

<style lang="scss">
.delete-user {
  &__footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    &-button {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
    }
  }
}
</style>
