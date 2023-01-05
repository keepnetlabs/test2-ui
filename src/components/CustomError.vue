<template>
  <div>
    <template v-if="isValid">
      <template v-if="showValidMessage">
        <div class="v-messages theme--light">
          <div class="v-messages__wrapper">
            <div class="v-messages__message" style="font-size: 9px;">
              {{ labels.RequiredStar }}
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="v-text-field__details checkbox-error">
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
    </template>
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
    showValidMessage: {
      type: Boolean,
      default: true
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
