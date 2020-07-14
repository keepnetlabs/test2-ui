import axios from 'axios'
import AuthenticationService from '../../services/authentication'
import router from '../../router/index'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import {
  investigationList,
  cancelInvestigation,
  investigationDetails,
  createInvestigation,
  InvestigationGroups,
  getTargetUsers,
  saveNewInvestigation,
  getStatsAndMenuDataFunction,
  getInvestigationDetailsDataFunction,
  SET_INVESTIGATIONLISTEMPY,
  investigationDetailsListFunction,
  investigationDetailsTargetUsersListFunction,
  sendInvestigationWarningMessage,
  deleteInvestigationDetailsItem,
  irSummary
} from '../../api/investigations'

const investigations = {
  namespaced: true,
  state: {
    investigationList: [],
    targetUsersList: [],
    getStatsAndMenuData: {},
    getInvestigationDetailsData: {},
    getInvestigationDetailsListData: [],
    getInvestigationDetailsTargetUsersListData: [],
    irSummary: {}
  },
  getters: {
    // create global getters for the target users list and investigaiton list
    investigationListGetter: (state) => state.investigationList,
    getTargetUsersListGetter: (state) => state.targetUsersList,
    statsAndMenuGetter: (state) => state.getStatsAndMenuData,
    investigationDetailsDataGetter: (state) => state.getInvestigationDetailsData,
    getInvestigationDetailsListGetter: (state) => state.getInvestigationDetailsListData,
    getInvestigationDetailsTargetUsersListGetter: (state) =>
      state.getInvestigationDetailsTargetUsersListData,
    irSummaryGetter: (state) => state.irSummary
  },
  mutations: {
    SET_INVESTIGATIONDETAILSTargetUsersLISTDATA(state, payload) {
      let data = payload.data
      state.getInvestigationDetailsTargetUsersListData = data
    },
    SET_INVESTIGATIONDETAILSLISTDATA(state, payload) {
      let data = payload.data
      state.getInvestigationDetailsListData = data
    },
    SET_INVESTIGATIONLISTEMPY(state, payload) {
      state.state.investigationList = [{}]
    },
    SET_INVESTIGATIONDETAILSDATA(state, payload) {
      //set target list data to vuex store
      let data = payload.data
      //data.asd = new Date()
      state.getInvestigationDetailsData = data
    },
    SET_STATSANDMENUDATA(state, payload) {
      //set target list data to vuex store
      let data = payload.data
      state.getStatsAndMenuData = data
    },
    SET_INVESTIGATIONLIST(state, payload) {
      const pagination = {}
      let data = payload.data
      data.results.userStats = payload.data.results
      let stateData = data.results.map((item) => {
        return { ...item, userStatus: [item.completedUsersCount, item.scannedUsersCount] }
      })
      console.log('stateData', stateData)
      state.investigationList = { totalNumberOfRecords: data.totalNumberOfRecords, data: stateData }
    },
    SET_IRSUMMARY(state, payload) {
      let data = payload.data
      console.log('summary', data)
      state.irSummary = data
    },
    SET_TARGETUSERSLIST(state, payload) {
      //set target list data to vuex store
      let data = payload.data
      //data.unshift({ name: 'All', groupId: 'all' })
      state.targetUsersList = data
    }
  },
  actions: {
    SET_INVESTIGATIONLISTEMPY(state, payload) {
      state.state.investigationList = []
    },
    async deleteInvestigationDetailsItem({ commit, dispatch }, obj) {
      // get investigaiton list via axious

      await deleteInvestigationDetailsItem(obj.data, obj.id)
        .then((response) => {
          dispatch(
            'common/createSnackBar',
            {
              errorState: true,
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Investigations Details Item Has Been Deleted Succesfully'
            },
            { root: true }
          )
        })
        .catch(() => {
          dispatch(
            'common/createSnackBar',
            {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error When Item Deleted'
            },
            { root: true }
          )
        })
    },
    async sendInvestigationWarningMessage({ commit, dispatch }, obj) {
      // get investigaiton list via axious

      await sendInvestigationWarningMessage(obj.data, obj.id)
        .then((response) => {
          dispatch(
            'common/createSnackBar',
            {
              errorState: true,
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'User Warning Message Has Been Sent Succesfully'
            },
            { root: true }
          )
        })
        .catch(() => {
          dispatch(
            'common/createSnackBar',
            {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when User Warning Message Sent'
            },
            { root: true }
          )
        })
    },
    async cancelInvestigation({ commit, dispatch }, id) {
      // get investigaiton list via axious

      await cancelInvestigation(id)
        .then((response) => {
          dispatch(
            'common/createSnackBar',
            {
              errorState: true,
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Investigation Stopped Succesfully'
            },
            { root: true }
          )
        })
        .catch(() => {
          dispatch(
            'common/createSnackBar',
            {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when cancelling Investigation'
            },
            { root: true }
          )
        })
    },
    async getInvestigationDetailsTargetUsersListData({ commit, dispatch }, obj) {
      // get investigaiton details
      await investigationDetailsTargetUsersListFunction(obj.data, obj.id)
        .then((response) => {
          const result = response.data
          commit('SET_INVESTIGATIONDETAILSTargetUsersLISTDATA', result)
        })
        .catch(() => {
          /*dispatch('common/createSnackBar', {
            errorState: true,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting investigation details'
          }, {root: true})*/
        })
    },
    async getInvestigationDetailsListData({ commit, dispatch }, obj) {
      // get investigaiton details
      await investigationDetailsListFunction(obj.data, obj.id)
        .then((response) => {
          const result = response.data
          commit('SET_INVESTIGATIONDETAILSLISTDATA', result)
        })
        .catch((error) => {
          const payload = {
            data: {
              pageNumber: 1,
              pageSize: 1,
              results: [],
              totalNumberOfPages: 1,
              totalNumberOfRecords: 1
            }
          }
          commit('SET_INVESTIGATIONDETAILSLISTDATA', payload)
        })
    },
    async getInvestigationDetailsData({ commit, dispatch }, id) {
      // get investigaiton details
      await getInvestigationDetailsDataFunction(id)
        .then((response) => {
          const result = response.data
          commit('SET_INVESTIGATIONDETAILSDATA', result)
        })
        .catch(() => {
          /*dispatch('common/createSnackBar', {
            errorState: true,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting investigation details'
          }, {root: true})*/
        })
    },
    async getStatsAndMenuData({ commit, dispatch }, id) {
      // get investigaiton list via axious

      await getStatsAndMenuDataFunction(id)
        .then((response) => {
          const result = response.data

          commit('SET_STATSANDMENUDATA', result)
        })
        .catch(() => {
          dispatch(
            'common/createSnackBar',
            {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when getting stats and menus data.'
            },
            { root: true }
          )
        })
    },
    async getInvestigationList({ commit, dispatch }, obj) {
      // get investigaiton list via axious
      await investigationList(obj)
        .then((response) => {
          const result = response.data
          console.log('result', result)
          commit('SET_INVESTIGATIONLIST', result)
        })
        .catch(() => {
          /*dispatch('common/createSnackBar', {
            errorState: true,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting investigation details'
          }, {root: true})*/
        })
    },
    async getIrSummary({ commit, dispatch }, obj) {
      // get investigaiton list via axious

      await irSummary(obj)
        .then((response) => {
          const result = response.data
          commit('SET_IRSUMMARY', result)
        })
        .catch(() => {
          dispatch(
            'common/createSnackBar',
            {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when getting the summary'
            },
            { root: true }
          )
        })
    },

    async getTargetUsersList({ commit, dispatch }) {
      // get target list via axious

      await getTargetUsers()
        .then((response) => {
          const result = response.data
          commit('SET_TARGETUSERSLIST', result)
        })
        .catch(() => {
          dispatch(
            'common/createSnackBar',
            {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when getting the user groups'
            },
            { root: true }
          )
        })
    },
    async createInvestigation({ commit, dispatch }, obj) {
      // create investigaiton list via axious. obj is a data parameter ( body ).
      // if you want to manipulate the obj, do it before.
      await saveNewInvestigation(obj)
        .then((resp) => {
          dispatch(
            'common/createSnackBar',
            {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Investigation Created Succesfully'
            },
            { root: true }
          )
        })
        .catch((resp) => {
          dispatch(
            'common/createSnackBar',
            {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when creating the investigation, try again.'
            },
            { root: true }
          )
        })
    },
    async getNotifications({ commit, dispatch }, id) {
      await listNotifications(id, localStorage.getItem('companyId'))
        .then((response) => {
          const res = response.data
          commit('SET_NOTIFICATIONS', res)
        })
        .catch(() => {
          dispatch(
            'common/createSnackBar',
            {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Notifications could not fetch'
            },
            { root: true }
          )
        })
    },
    async saveNotifications({ commit, dispatch }, obj) {
      await saveNotifications(obj)
        .then(() => {
          dispatch(
            'common/createSnackBar',
            {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Saved Succesfully'
            },
            { root: true }
          )
          commit('SET_NOTIFICATIONS', obj)
        })
        .catch(() => {
          dispatch(
            'common/createSnackBar',
            {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when saving the notifications, try again.'
            },
            { root: true }
          )
        })
    }
  }
}

export default investigations
