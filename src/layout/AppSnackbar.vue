<template>
  <div>
    <template v-for="(snackbar, index) in snackbars">
      <v-snackbar
        :key="snackbar.message"
        v-model="snackbar.status"
        :color="snackbar.color"
        bottom
        @input="changeSnackbarStatus($event, snackbar)"
        :style="getSnackBarStyle(snackbar.message, index)"
        :timeout="3000"
      >
        <div class="snackbar__left-column">
          <div v-if="snackbar.icon">
            <v-icon color="#fff" size="20px"> {{ snackbar.icon }}</v-icon>
          </div>
          <div class="snackbar__message" :class="[snackbar.icon ? 'ml-4' : '']">
            {{ snackbar.message }}
          </div>
        </div>
        <div class="snackbar__right-column">
          <v-icon
            v-if="!snackbar.action"
            color="#fff"
            size="20px"
            @click="changeSnackbarStatus(false, snackbar)"
            >mdi-close</v-icon
          >
          <router-link class="snackbar__action" v-else :to="snackbar.action.link">
            <v-btn @click.native="changeSnackbarStatus($event, snackbar)" color="#2196f3" rounded>
              {{ snackbar.action.label }}
            </v-btn>
          </router-link>
        </div>
      </v-snackbar>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppSnackbar',
  computed: {
    ...mapGetters({
      snackbars: 'common/getSnackBars'
    })
  },
  methods: {
    changeSnackbarStatus(value, snackbar) {
      this.$store.dispatch('common/closeSnackBar', snackbar)
    },
    getSnackBarStyle(message, index) {
      const messageLength = message.trim().length
      const styleObj = {}
      if (index >= 1) {
        styleObj['bottom'] = `${65 * index}px`
        if (window.outerWidth <= 580) {
          styleObj['bottom'] = `${75 * index}px`
        }
      } else {
        styleObj['bottom'] = '5px'
      }
      if (messageLength > 40 && messageLength < 60) {
        styleObj['width'] = '580px'
      } else if (messageLength > 60) {
        styleObj['width'] = '580px'
      } else {
        styleObj['width'] = '480px'
      }
      if (window.outerWidth <= 580) {
        styleObj['width'] = '95%'
      }
      return styleObj
    }
  }
}
</script>

<style lang="scss">
.v-snack__wrapper {
  width: 100%;
  @media only screen and (min-width: 600px) {
    margin: 0;
  }
}
.v-snack__content {
  padding: 12px 16px;
}

.snackbar {
  &__left-column {
    display: flex;
    align-items: center;
    flex-basis: 85%;
  }
  &__right-column {
  }
  &__message {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: normal;
    color: #ffffff;
  }
  &__action {
    text-decoration: none;
    color: white;
    margin-right: 5px;
    .v-btn__content {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: center;
      color: #ffffff;
    }

    .v-btn {
      height: 36px !important;
    }
  }
}

.v-snack {
  @media (max-width: 580px) {
    width: 95% !important;
  }
}
</style>
