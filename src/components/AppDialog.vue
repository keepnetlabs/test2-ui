<template>
  <v-dialog
    :content-class="className"
    :opacity="0.23"
    :value="status"
    :width="dialogWidth"
    @click:outside="changeStatus(false)"
    @input="changeStatus"
    class="k-dialog"
  >
    <v-card class="k-dialog__card" light>
      <v-form lazy-validation ref="refDialogForm">
        <v-list-item class="pl-0 pr-0" v-if="icon && title && subtitle">
          <div class="v-btn v-cart-icon-wrapper" v-if="icon">
            <v-icon :color="iconColor" class="ml-2" left medium>
              {{ icon }}
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="k-dialog__title">{{ title }}</v-list-item-title>
            <v-list-item-subtitle class="k-dialog__sub-title">{{ subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <div class="k-dialog__body">
          <slot name="app-dialog-body">
            {{ body }}
          </slot>
        </div>
        <v-card-actions class="pa-0 k-dialog__footer">
          <slot name="app-dialog-footer"></slot>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
/*
    **** props *****
   status --> Modal Status
   icon --> Title Icon
   iconColor --> Icon color
   title --> Title
   subTitle --> Subtitle
   body--> Body (string)
   size --> Size (big,small)
   className --> ClassName for Dialog

    **** Slots ****
    app-dialog-body
    app-dialog-footer

     */
export default {
  name: 'AppDialog',
  props: {
    status: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    iconColor: {
      type: String,
      default: 'blue'
    },
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    body: {
      type: String
    },
    size: {
      type: String,
      default: 'small'
    },
    className: {
      type: String
    }
  },
  computed: {
    dialogWidth() {
      let retValue
      switch (this.size) {
        case 'small':
          retValue = '480'
          break
        case 'big':
          retValue = '580'
          break
        case 'maximum':
          retValue = '650'
        default:
          break
      }
      return retValue
    }
  },
  methods: {
    changeStatus(value) {
      this.$emit('changeStatus', value)
    }
  }
}
</script>

<style lang="scss">
.k-dialog {
  &__card {
    padding: 24px 24px 10px 24px;
    border-radius: 12px !important;
    box-shadow: 0 11px 15px -7px rgba(80, 80, 80, 0.2), 0 24px 38px 0 rgba(80, 80, 80, 0.14),
      0 9px 46px 8px rgba(80, 80, 80, 0.12);
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: normal;
    color: #2196f3 !important;
  }

  &__sub-title {
    margin-top: 2px;
    font-size: 16px;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__body {
    padding-top: 34px;
    font-size: 13px;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72) !important;
    padding-bottom: 17px;
  }

  &__button {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
  }

  &__footer {
    > * {
      width: 100%;
    }
  }
}
</style>
