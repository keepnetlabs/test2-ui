<template>
  <v-dialog
    :content-class="className"
    :opacity="0.23"
    :value="status"
    :id="id"
    :width="dialogWidth"
    @click:outside="changeStatus(false)"
    @input="changeStatus"
    class="k-dialog"
    :hide-overlay="hideOverlay"
  >
    <v-card class="k-dialog__card" light>
      <v-form lazy-validation ref="refDialogForm" onSubmit="return false;">
        <v-list-item
          v-if="icon || title"
          class="k-dialog__header"
          :class="[maxHeight && 'k-dialog__header-max-height']"
        >
          <div class="v-btn v-cart-icon-wrapper" v-if="icon">
            <v-icon :color="iconColor" class="ml-2" left medium>
              {{ icon }}
            </v-icon>
          </div>
          <div>
            <v-list-item-title class="k-dialog__title" :id="titleId">{{ title }}</v-list-item-title>
            <v-list-item-subtitle v-if="subtitle" class="k-dialog__sub-title" :id="subtitleId">{{
              subtitle
            }}</v-list-item-subtitle>
          </div>
        </v-list-item>
        <div
          class="k-dialog__body"
          :style="[
            {
              maxHeight: maxHeightSize ? maxHeightSize : '400px',
              minHeight: maxHeightSize ? maxHeightSize : ''
            }
          ]"
        >
          <slot name="app-dialog-body">
            {{ body }}
          </slot>
        </div>
        <v-card-actions
          class="k-dialog__footer"
          :class="[maxHeight && maxHeightSize && 'k-dialog__footer-max-height']"
        >
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
    hideOverlay: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    customSize: {
      type: String
    },
    subtitle: {
      type: String
    },
    body: {
      type: String
    },
    maxHeight: {
      type: Boolean,
      default: false
    },
    maxHeightSize: {
      type: String
    },
    size: {
      type: String,
      default: 'small'
    },
    className: {
      type: String
    },
    id: {
      type: String
    },
    titleId: {
      type: String
    },
    subtitleId: {
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
          break
        case 'ultraMaximum':
          retValue = '700'
          break
        default:
          break
      }
      if (this.customSize) {
        retValue = this.customSize
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
    border-radius: 12px !important;
    box-shadow: 0 11px 15px -7px rgba(80, 80, 80, 0.2), 0 24px 38px 0 rgba(80, 80, 80, 0.14),
      0 9px 46px 8px rgba(80, 80, 80, 0.12);
  }

  &__header {
    margin-bottom: 0;
    border-bottom: 1px solid #ebeef5;
    padding: 24px !important;
    &-max-height {
      box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
        0 3px 1px -2px rgba(80, 80, 80, 0.12);
      z-index: 99999;
      opacity: 1;
      position: sticky !important;
      top: 0;
      background-color: white;
    }
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: normal;
    color: #2196f3 !important;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__sub-title {
    margin-top: 2px;
    font-size: 16px;
    letter-spacing: normal;
    white-space: pre-wrap;
    word-break: break-word;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__body {
    font-size: 13px;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72) !important;

    overflow-y: auto;
    padding: 24px 24px 24px 24px;
    border-bottom: 1px solid #ebeef5;
    .k-table__wrapper {
      width: 100%;
    }
  }

  &__button {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    padding: 0 8px !important;
  }

  &__footer {
    padding: 8px 24px 8px 24px;
    > * {
      width: 100%;
    }
    &-max-height {
      position: sticky;
      bottom: 0;
      z-index: 999999;
      background: white;
      box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
        0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    }
  }
}
.k-dialog__body::-webkit-scrollbar {
  display: none;
}
.k-dialog__body {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
}
</style>
