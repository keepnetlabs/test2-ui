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
