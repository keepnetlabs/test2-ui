<template>
  <div>
    <v-overlay
      :value="isShow"
      opacity="1"
      color="white"
      :z-index="999"
      fixed
      light
      class="add-users-manually__overlay"
      :dark="false"
      style="overflow-y: auto;"
    >
      <v-container class="add-users-manually" id="add-users-manually">
        <v-card light class="add-users-manually__container">
          <div class="add-users-manually__header">
            <v-list-item class="pl-0 pr-0">
              <div class="v-btn v-cart-icon-wrapper">
                <v-icon class="ml-2" color="blue" left medium>mdi-account-plus</v-icon>
              </div>
              <v-list-item-content class="pt-0 pb-0">
                <v-list-item-title class="add-users-manually__header-title">
                  Add Users Manually
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div class="add-users-manually__body">
            <div class="add-users-manually__body-header">
              <div class="add-users-manually__body-header__title">Add Users Manually</div>
              <div class="add-users-manually__body-header__subtitle">
                Add new user information to the table below
              </div>
            </div>
            <div class="add-users-manually__body-container">
              <data-table
                :addButton="tableOptions.addButton"
                :columns="tableOptions.columns"
                :countRow="5"
                :empty="tableOptions.empty"
                :filterable="true"
                :options="true"
                :pageSizes="tableOptions.pageSizes"
                :refName="'usersListTable'"
                :row-actions="tableOptions.rowActions"
                :selectable="true"
                :sizeable="true"
                @deleteAction="handleDelete"
                @downloadEvent="exportPhishingReporterUserList"
                id="usersList"
                ref="refUsersList"
                @turnOn="callForTurnOn"
              />
            </div>
          </div>
          <div class="add-users-manually__footer">
            <v-btn
              @click="handleCloseOverlay"
              class="add-users-manually__footer-btn-cancel"
              rounded
            >
              CANCEL
            </v-btn>
            <v-btn
              @click="handleImportAllUsers"
              rounded
              color="#2196f3"
              class="add-users-manually__footer-btn-import-all-users"
            >
              IMPORT ALL USERS
            </v-btn>
          </div>
        </v-card>
      </v-container>
    </v-overlay>
  </div>
</template>

<script>
import DataTable from '../../components/DataTable'
export default {
  name: 'AddUsersManuallyModal',
  components: {
    DataTable
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: 'firstName',
            align: 'left',
            editable: false,
            label: 'First Name',
            sortable: true,
            show: true,
            fixed: true,
            type: 'text',
            width: 150
            //minWidth: 80
          },
          {
            property: 'lastName',
            align: 'left',
            editable: false,
            label: 'Last Name',
            sortable: true,
            show: true,
            type: 'text',
            width: 150
            //minWidth: 80
          },
          {
            property: 'email',
            align: 'left',
            editable: false,
            label: 'E-mail',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 300
            //minWidth: 80
          },
          {
            property: 'hostName',
            align: 'left',
            editable: false,
            label: 'Device Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'fiber',
            width: 200
            //minWidth: 80
          },
          {
            property: 'lastSeen',
            align: 'left',
            editable: false,
            label: 'Last Seen',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 220
            //minWidth: 80
          },
          {
            property: 'addInVersion',
            align: 'center',
            editable: false,
            label: 'Version',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 140
            //minWidth: 80
          },
          {
            property: 'addInStatus',
            align: 'center',
            editable: false,
            label: 'Status',
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 160,
            hasTooltip: true,
            //minWidth: 80,
            fullWidth: true
          }
        ],
        empty: {
          message: 'No users are showing',
          subMes: 'Add Users',
          btn: 'Add Users',
          icon: 'mdi-account-plus'
        },
        rowActions: [
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction'
          },
          {
            name: 'Turn',
            icon: 'mdi-power',
            action: 'turnOn'
          }
        ],
        pageSizes: [5, 10, 25, 50, 100]
      }
    }
  },
  methods: {
    handleCloseOverlay() {
      this.$emit('changeModalStatus', false)
    },
    handleImportAllUsers() {}
  }
}
</script>

<style lang="scss">
.add-users-manually {
  font-family: 'Open Sans', sans-serif !important;
  max-width: 100% !important;
  &__container {
    width: 100%;
    height: 100%;
    overflow-y: auto;

    &.v-card {
      padding: 32px 158px 157px 158px !important;
      box-shadow: none !important;
      @media (max-width: 800px) {
        padding: 32px 32px 80px 32px !important;
      }
    }
  }
  &__header {
    &-title {
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }
  &__body {
    margin-top: 32px;
    &-header {
      &__title {
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87) !important;
      }
      &__subtitle {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87) !important;
      }
    }
    &-container {
      margin-top: 8px;
    }
  }
  &__footer {
    position: fixed;
    bottom: 0;
    padding: 16px 158px 16px 158px;
    @media (max-width: 800px) {
      padding: 16px 32px 16px 32px;
    }
    left: 0;
    background-color: #f5f7fa;
    width: 100%;
    display: flex;
    justify-content: space-between;
    &-btn-cancel {
      color: #f56c6c !important;
      border: 1px solid #f56c6c !important;
      box-shadow: none !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      width: 86px;
      height: 36px !important;
    }

    &-btn-import-all-users {
      color: #ffffff !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      width: 160px;
      height: 36px !important;
      border-radius: 18px;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
      background-color: #2196f3;
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
  }

  &__overlay {
    .v-overlay__content {
      width: 100%;
      height: 100%;
    }
    .v-overlay__scrim {
    }
  }
}
</style>
