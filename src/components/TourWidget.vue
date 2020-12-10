<template>
  <v-tour name="myTour" :steps="steps" :callbacks="myCallbacks">
    <template slot-scope="tour">
      <transition name="fade">
        <div>
          <!-- eslint-disable -->
          <v-step
            v-if="tour.currentStep === index"
            v-for="(step, index) of tour.steps"
            :key="index"
            :step="step"
            :previous-step="tour.previousStep"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :class="{ step_four: tour.currentStep == 3 }"
          >
            <template v-if="tour.currentStep === 0">
              <div slot="actions" class="v-step__buttons">
                <button @click="tour.stop" class="v-step__button">End Tour</button>
                <div class="d-flex flex-column flex-grow-1"></div>
                <button @click="tour.nextStep" class="v-step__button">Next</button>
              </div>
            </template>
            <template v-if="tour.isLast">
              <div slot="actions" class="v-step__buttons">
                <button @click="tour.stop" class="v-step__button"></button>
                <div>
                  <button
                    @click="tour.previousStep"
                    class="v-step__button"
                    style="padding-right: 8px !important;"
                  >
                    Previous
                  </button>
                  <button @click="tour.stop" class="v-step__button">End Tour</button>
                </div>
              </div>
            </template>
            <template v-if="tour.currentStep != 0 && !tour.isLast">
              <div slot="actions" class="v-step__buttons">
                <button @click="tour.stop" class="v-step__button">End Tour</button>
                <div>
                  <button
                    @click="tour.previousStep"
                    class="v-step__button"
                    style="padding-right: 8px !important;"
                  >
                    Previous
                  </button>
                  <button @click="tour.nextStep" class="v-step__button">Next</button>
                </div>
              </div>
            </template>
          </v-step>
        </div>
      </transition>
    </template>
  </v-tour>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'tour-widget',
  data() {
    return {
      myCallbacks: {
        onStart: this.cutomOnStartCallback,
        onPreviousStep: this.customPreviousStepCallback,
        onNextStep: this.customNextStepCallback,
        onStop: this.customOnStopCallback
      }
    }
  },
  methods: {
    ...mapActions({
      setTourStatus: 'tour/setTourStatus',
      setStepNumber: 'tour/setStepNumber',
      endTour: 'tour/endTour'
    }),
    cutomOnStartCallback() {
      this.setStepNumber({
        previousStep: 0,
        nextStep: 0
      })
    },
    customPreviousStepCallback(currentStep) {
      this.setStepNumber({
        previousStep: currentStep,
        nextStep: currentStep - 1
      })
    },
    customNextStepCallback(currentStep) {
      this.setStepNumber({
        previousStep: currentStep,
        nextStep: currentStep + 1
      })
    },
    customOnStopCallback() {
      this.endTour()
    }
  },
  computed: {
    ...mapGetters({
      isTourActive: 'tour/isTourActive',
      steps: 'tour/getSteps',
      notificationList: 'dashboard/getNotificationList'
    })
  },
  created() {},
  mounted() {
    if (this.isTourActive) {
      // this.$tours['myTour'].start();
    }
  },
  props: {}
}
</script>

<style scoped lang="scss">
::v-deep .v-list-tour {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 100%;
  flex: 1 1 100%;
  letter-spacing: normal;
  min-height: 48px;
  outline: none;
  padding: 0 16px;
  position: relative;
  text-decoration: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
::v-deep .tour-icon-wrapper {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  margin-right: 24px;
  -webkit-box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  border: solid 1px rgba(100, 181, 246, 0.5);
  background-color: #e3f2fd;

  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  font-weight: 400;
  letter-spacing: 0;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  max-width: 100%;
  outline: 0;
  position: relative;
  text-decoration: none;
  text-indent: 0;
  text-transform: uppercase;
  -webkit-transition-duration: 0.28s;
  transition-duration: 0.28s;
  -webkit-transition-property: opacity, -webkit-box-shadow, -webkit-transform;
  transition-property: box-shadow, transform, opacity, -webkit-box-shadow, -webkit-transform;
  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

::v-deep #v-step-1244304f {
  left: -30px !important;
  top: 33px !important;

  @media only screen and (max-width: 769px) {
    left: 17px !important;
  }
}

::v-deep #v-step-12441c69 {
  left: 27px !important;
  top: 34px !important;

  @media only screen and (max-width: 1025px) {
    left: 0 !important;
  }
}

::v-deep #v-step-363b490f {
  left: 527px !important;
  top: 31px !important;
}

::v-deep #v-step-363b5f83 {
  left: 30px !important;
  top: 34px !important;
}

::v-deep #v-step-12442ae5 {
  left: 560px !important;
  top: 33px !important;
}

::v-deep #v-step-dc1ac23e {
  left: 218px !important;
  top: -25px !important;
  transform: translate3d(107px, 250px, 0px) !important;

  @media only screen and (max-width: 1025px) {
    left: 20px !important;
  }
  @media only screen and (max-width: 769px) {
    left: -50px !important;
    top: 400px !important;
  }
}

.z_index_custom {
  z-index: 13;
}

.v-step__buttons {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

::v-deep .v-step__button {
  color: #00bcd4 !important;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 1.71;
  text-align: center;
  text-transform: uppercase;
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .v-list-item__content2 {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-item-align: center;
  align-self: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-flex: 1;
  -ms-flex: 1 1;
  flex: 1 1;
  overflow: hidden;
  padding: 12px 0;
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
}

::v-deep .v-list-item2 {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 100%;
  flex: 1 1 100%;
  letter-spacing: normal;
  min-height: 48px;
  outline: none;
  position: relative;
  text-decoration: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

::v-deep .tour-title {
  width: 100%;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 24px;
  line-height: 1.6;
  color: #2196f3;
  padding-top: 4px;
}

::v-deep .tour-sub-title {
  font-family: 'Helvetica';
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}

::v-deep .tour-description {
  padding-top: 15px !important;
  text-align: start !important;
}

::v-deep .v-step[x-placement^='right'] {
  left: 40px !important;
}

::v-deep .v-step[x-placement^='right'] .v-step__arrow[data-v-aa0cbe42] {
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-top-color: transparent;
  border-width: 0 50px 52px 0;
  left: -26px;
  margin-left: 0;
  margin-right: 0;
  top: -7px;
}

::v-deep .v-step[x-placement^='left'] .v-step__arrow[data-v-aa0cbe42] {
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  border-width: 0px 0px 50px 52px !important;
  margin-left: 1px;
  margin-right: -16px;
  right: -0.5rem;
  top: -7px;
}

::v-deep .v-step[x-placement^='top'] .v-step__arrow[data-v-aa0cbe42],
::v-deep .v-step[x-placement^='bottom'] .v-step__arrow[data-v-aa0cbe42] {
  border-bottom-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  border-width: 0px 0px 50px 52px !important;
  margin-left: 1px !important;
  margin-right: -16px !important;
  left: -1px !important;
  bottom: -33px !important;
  border-left-color: #fff !important;
  top: unset !important;
}

::v-deep .v-step .v-step__arrow[data-v-aa0cbe42] {
  border-color: #ffffff;
  border-style: solid;
  height: 0;
  margin: 0.5rem;
  position: absolute;
  width: 0;
}

.v-step {
  padding-left: 32px !important;
  padding-right: 32px !important;
  padding-bottom: 17px !important;
  z-index: 999;
  width: 1000px;
  min-height: 100px;
  background-color: #ffffff !important; //rgba(241, 248, 254, 1) !important;
  border-radius: 20px !important;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: black !important;
  max-width: 500px !important;
  top: 35px;
  left: -33px !important;
}

@-moz-keyframes interaction_bubble {
  0% {
    width: 48px;
    height: 48px;
  }
  25% {
    width: 30px;
    height: 30px;
  }
  50% {
    width: 15px;
    height: 15px;
  }
  75% {
    width: 30px;
    height: 30px;
  }
  100% {
    width: 48px;
    height: 48px;
  }
}

@-webkit-keyframes interaction_bubble {
  0% {
    width: 48px;
    height: 48px;
  }
  25% {
    width: 30px;
    height: 30px;
  }
  50% {
    width: 15px;
    height: 15px;
  }
  75% {
    width: 30px;
    height: 30px;
  }
  100% {
    width: 48px;
    height: 48px;
  }
}

@-o-keyframes interaction_bubble {
  0% {
    width: 48px;
    height: 48px;
  }
  25% {
    width: 30px;
    height: 30px;
  }
  50% {
    width: 15px;
    height: 15px;
  }
  75% {
    width: 30px;
    height: 30px;
  }
  100% {
    width: 48px;
    height: 48px;
  }
}

.tour-btn-container {
  cursor: pointer;
  position: absolute;
  width: 48px;
  height: 48px;
  display: flex;

  .tour-btn-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: solid 1px #e5f1ff;
    margin-top: 10px;

    .tour-btn-circle {
      border-radius: 50%;
      width: 32px;
      height: 32px;
      background-color: #e5f1ff;
      display: flex;
      align-items: center;
      justify-content: center;

      .tour-btn-circle-inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #b3d4fc;
      }
    }
  }
}

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  ::v-deep .tour-title {
    text-align: left !important;
  }
  ::v-deep .tour-description {
    max-width: 86% !important;
    text-align: left !important;
  }

  ::v-deep #v-step-1244304f {
    .tour-description {
      max-width: 31% !important;
    }
  }

  ::v-deep #v-step-dc1ac23e {
    top: -30px !important;
    .tour-description {
      max-width: 20% !important;
    }
  }

  ::v-deep #v-step-12441c69 {
    > .v-step__content > div {
      width: 300px !important;
    }
  }

  ::v-deep #v-step-363b490f {
    > .v-step__content > div {
      width: 300px !important;
    }
  }

  ::v-deep #v-step-12442ae5 {
    > .v-step__content > div {
      width: 520px !important;
    }
  }

  ::v-deep .v-step {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  ::v-deep .v-step__arrow {
    background-color: rgba(155, 155, 155, 0.03) !important;
    left: -30 px !important;
  }

  ::v-deep .v-list-item__content.v-list-item__content2 {
    min-width: 300px;
  }
  ::v-deep .tour-sub-title {
    text-align: left;
  }
}
</style>
