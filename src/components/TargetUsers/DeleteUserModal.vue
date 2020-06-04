<template>
  <v-overlay
    :opacity="1"
    :value="isShow"
    :z-index="999"
    fixed
    class="delete-user__overlay"
    color="rgba(0, 0, 0, 0.23)"
  >
    <v-card
      class="delete-user"
      light
      style="
        max-width: 513px;
        border-radius: 12px !important;
        padding: 32px 24px 0px 24px !important;
      "
    >
      <v-list-item class="pl-0 pr-0">
        <div class="v-cart-icon-wrapper">
          <v-icon class="ml-2" color="blue" left medium>mdi-delete</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="delete-user__title">Delete User?</v-list-item-title>
          <v-list-item-subtitle class="delete-user__subtitle"
            >The user will be deleted permanently</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="pl-0 pr-0">
        <v-list-item-content class="delete-user__body">
          {{ getFirstAndLastName }} will be deleted and removed from all groups. User stats will
          remain in reports.
        </v-list-item-content>
      </v-list-item>
      <div class="delete-user__footer">
        <v-btn @click="closeModal" color="#f56c6c" class="delete-user__footer-button" text
          >CANCEL</v-btn
        >
        <v-btn
          @click="handleDelete"
          color="#2196f3"
          class="delete-user__footer-button"
          style="padding: 0;"
          text
          >DELETE</v-btn
        >
      </div>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  computed: {
    getFirstAndLastName() {
      const { firstName = '', lastName = '' } = this.selectedRow
      return `${firstName} ${lastName}`
    }
  },
  methods: {
    closeModal() {
      this.$emit('changeModalStatus', false)
    },
    handleDelete() {
      this.$emit('deleteAction', this.selectedRow)
      this.$emit('changeModalStatus', false)
    }
  },
  name: 'DeleteUserModal'
}
</script>

<style scoped lang="scss">
* {
  font-family: 'Open Sans', sans-serif !important;
}

.delete-user {
  &__title {
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: #2196f3 !important;
  }

  &__subtitle {
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__body {
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72) !important;
    padding-top: 30px !important;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 10px;
    &-button {
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
    }
  }

  &__overlay {
    -webkit-backdrop-filter: blur(3px) !important;
    backdrop-filter: blur(3px) !important;
  }
}
.v-cart-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  margin-right: 24px;
  box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  border: solid 1px rgba(100, 181, 246, 0.5);
  background-color: #e3f2fd;
  display: flex;
  justify-content: center;
}
</style>
