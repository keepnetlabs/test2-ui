const tour = {
  namespaced: true,
  state: {
    tour: {
      isActive: false
    },
    steps: [
      {
        target: '.tour-one', // We're using document.querySelector() under the hood
        content: `
          <div data-v-cba730ac="" tabindex="-1" class="v-list-tour">
              <div data-v-cba730ac="" class="tour-icon-wrapper" style="margin-top: -10px;">
                  <i data-v-cba730ac="" aria-hidden="true" medium="" class="v-icon notranslate ml-2 v-icon--left mdi mdi-reminder theme--light blue--text"></i>
              </div>
              <div data-v-cba730ac="" class="v-list-item__content v-list-item__content2" style="text-align: start;">
                  <div data-v-cba730ac="" class="tour-title">Tour</div>
                  <div data-v-cba730ac="" class="tour-sub-title">Phishing Campaigns</div>
              </div>
          </div>
              <div class="tour-description">
    Current status of the campaigns that completed, cancelled, remained passive or idle.      
</div>`,
        params: {
          placement: 'right-start',
          modifiers: {}
        },
        offset: -200
      },
      {
        target: '.tour-two', // We're using document.querySelector() under the hood
        content: `
          <div data-v-cba730ac="" tabindex="-1" class="v-list-tour">
              <div data-v-cba730ac="" class="tour-icon-wrapper" style="margin-top: -10px;">
                  <i data-v-cba730ac="" aria-hidden="true" medium="" class="v-icon notranslate ml-2 v-icon--left mdi mdi-reminder theme--light blue--text"></i>
              </div>
              <div data-v-cba730ac="" class="v-list-item__content v-list-item__content2" style="text-align: start;">
                  <div data-v-cba730ac="" class="tour-title">Tour</div>
                  <div data-v-cba730ac="" class="tour-sub-title">Company Information</div>
              </div>
          </div>
              <div class="tour-description">With data collected from Keepnet components, a cybersecurity awareness grade is calculated for your company. 
              The grade is your Company Score, the average of the Phishing Score and Training Score. See Grades section for more details. </div>`,
        params: {
          placement: 'left-start',
          modifiers: {}
        },
        offset: -220
      },
      {
        target: '.tour-three', // We're using document.querySelector() under the hood
        content: `
          <div data-v-cba730ac="" tabindex="-1" class="v-list-tour">
              <div data-v-cba730ac="" class="tour-icon-wrapper" style="margin-top: -10px;">
                  <i data-v-cba730ac="" aria-hidden="true" medium="" class="v-icon notranslate ml-2 v-icon--left mdi mdi-reminder theme--light blue--text"></i>
              </div>
              <div data-v-cba730ac="" class="v-list-item__content v-list-item__content2" style="text-align: start;">
                  <div data-v-cba730ac="" class="tour-title">Tour</div>
                  <div data-v-cba730ac="" class="tour-sub-title">Overall Stats</div>
              </div>
          </div>
              <div class="tour-description">
              Phishing Simulator Score represents the sum of Opened, Clicked, and Captured data, with weighted average multipliers of 20%, 30% and 50% respectively. Awareness Educator Score represents the sum of Opened, Clicked, and View Duration data, with weighted average multipliers of 20%, 30% and 50% respectively. See the Grades section for more detail.
</div>`,
        params: {
          placement: 'top-start',
          modifiers: {},
          enableScrolling: false
        },
        offset: -620
      },
      {
        target: '.tour-four', // We're using document.querySelector() under the hood
        content: `
          <div data-v-cba730ac="" tabindex="-1" class="v-list-tour">
              <div data-v-cba730ac="" class="tour-icon-wrapper" style="margin-top: -10px;">
                  <i data-v-cba730ac="" aria-hidden="true" medium="" class="v-icon notranslate ml-2 v-icon--left mdi mdi-reminder theme--light blue--text"></i>
              </div>
              <div data-v-cba730ac="" class="v-list-item__content v-list-item__content2" style="text-align: start;">
                  <div data-v-cba730ac="" class="tour-title">Tour</div>
                  <div data-v-cba730ac="" class="tour-sub-title">Last 5 Campaigns Stats</div>
              </div>
          </div>
              <div class="tour-description">List of the last 5 campaigns in detail.</div>`,
        params: {
          placement: 'left-start',
          modifiers: {}
        },
        offset: -220
      },
      {
        target: '.tour-five', // We're using document.querySelector() under the hood
        content: `
          <div data-v-cba730ac="" tabindex="-1" class="v-list-tour">
              <div data-v-cba730ac="" class="tour-icon-wrapper" style="margin-top: -10px;">
                  <i data-v-cba730ac="" aria-hidden="true" medium="" class="v-icon notranslate ml-2 v-icon--left mdi mdi-reminder theme--light blue--text"></i>
              </div>
              <div data-v-cba730ac="" class="v-list-item__content v-list-item__content2" style="text-align: start;">
                  <div data-v-cba730ac="" class="tour-title">Tour</div>
                  <div data-v-cba730ac="" class="tour-sub-title">Logo</div>
              </div>
          </div>
              <div class="tour-description">Company Logo displayed here.</div>`,
        params: {
          placement: 'left-start',
          modifiers: {}
        }
      },
      {
        target: '.tour-six', // We're using document.querySelector() under the hood
        content: `
          <div data-v-cba730ac="" tabindex="-1" class="v-list-tour">
              <div data-v-cba730ac="" class="tour-icon-wrapper" style="margin-top: -10px;">
                  <i data-v-cba730ac="" aria-hidden="true" medium="" class="v-icon notranslate ml-2 v-icon--left mdi mdi-reminder theme--light blue--text"></i>
              </div>
              <div data-v-cba730ac="" class="v-list-item__content v-list-item__content2" style="text-align: start;">
                  <div data-v-cba730ac="" class="tour-title">Tour</div>
                  <div data-v-cba730ac="" class="tour-sub-title">Dashboard</div>
              </div>
          </div>
              <div class="tour-description">Dashboard provides an overview of your current status. Use the navigation menu on the left to access the functions of the system. </div>`,
        params: {
          placement: 'left-start',
          modifiers: {}
        }
      }
    ]
  },
  getters: {
    isTourActive: state => state.tour.isActive,
    getTourData: state => state.tour,
    getSteps: state => state.steps
  },
  mutations: {
    SET_TOUR_STATUS(state, payload) {
      const newObj = Object.assign({}, state.tour)
      newObj.isActive = payload
      state.tour = newObj
    },
    SET_STEP_NUMBER(state, payload) {
      const newObj = Object.assign({}, state.tour)
      newObj[payload.previousStep] = false
      newObj[payload.nextStep] = true
      state.tour = newObj
    },
    END_TOUR(state, payload) { // eslint-disable-line
      const newObj = Object.assign({}, state.tour)
      newObj['0'] = false
      newObj['1'] = false
      newObj['2'] = false
      newObj['3'] = false
      newObj['5'] = false
      newObj['6'] = false
      newObj.isActive = false
      state.tour = newObj
    }
  },
  actions: {
    setTourStatus({ commit }, payload) {
      commit('SET_TOUR_STATUS', payload)
    },
    setStepNumber({ commit, dispatch }, payload) {
      if (payload.nextStep == 5 || payload.nextStep == 6) {
        dispatch('common/changeMenuStatus', true, { root: true })
      }

      commit('SET_STEP_NUMBER', payload)
    },
    endTour({ commit }) {
      commit('END_TOUR', null)
    }
  }
}

export default tour
