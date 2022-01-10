<template>
  <div>
    <div class="v-messages theme--light" v-if="isValid">
      <div class="v-messages__wrapper">
        <div class="v-messages__message" style="font-size: 9px;">
          {{ labels.RequiredStar }}
        </div>
      </div>
    </div>
    <div class="v-text-field__details checkbox-error" v-else>
      <transition appear name="bounce">
        <div class="v-messages theme--light error--text" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message" style="padding-left: 10px;">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
export default {
  name: 'CustomError',
  props: {
    isValid: {
      type: Boolean
    },
    errorMessage: {
      type: String,
      default: labels.Required
    }
  },
  data() {
    return {
      labels
    }
  }
}
</script>
