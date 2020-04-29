import axios from 'axios'
import AuthenticationService from '../../services/authentication'
import router from '../../router/index'
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
        investigationListGetter: state => state.investigationList,
        getTargetUsersListGetter: state => state.targetUsersList,
        statsAndMenuGetter: state => state.getStatsAndMenuData,
        investigationDetailsDataGetter: state => state.getInvestigationDetailsData,
        getInvestigationDetailsListGetter: state => state.getInvestigationDetailsListData,
        getInvestigationDetailsTargetUsersListGetter: state => state.getInvestigationDetailsTargetUsersListData,
        irSummaryGetter: state => state.irSummary
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
            let data = payload.data;
            state.getStatsAndMenuData = data
        },
        SET_INVESTIGATIONLIST(state, payload) {
            // added dummy data
            // set response to vuex store
            // investigation list
            let data = payload.data.results
            debugger
            data.userStats = payload.data.results;
            state.investigationList = data
        },
        SET_IRSUMMARY(state, payload) {
            let data = payload.data
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
        async deleteInvestigationDetailsItem({ commit }, obj) {
            // get investigaiton list via axious
            commit('common/SET_IS_LOADING', true, { root: true })
            await deleteInvestigationDetailsItem(obj.data, obj.id)
                .then(response => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Investigations Details Item Has Been Deleted Succesfully', { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error When Item Deleted', { root: true })
                })
        },
        async sendInvestigationWarningMessage({ commit }, obj) {
            // get investigaiton list via axious
            commit('common/SET_IS_LOADING', true, { root: true })
            await sendInvestigationWarningMessage(obj.data, obj.id)
                .then(response => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'User Warning Message Has Been Sent Succesfully', { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when User Warning Message Sent', { root: true })
                })
        },
        async cancelInvestigation({ commit }, id) {
            // get investigaiton list via axious
            commit('common/SET_IS_LOADING', true, { root: true })
            await cancelInvestigation(id)
                .then(response => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Investigation Stopped Succesfully', { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when cancelling Investigation', { root: true })
                })
        },
        async getInvestigationDetailsTargetUsersListData({ commit }, obj) {
            // get investigaiton details
            commit('common/SET_IS_LOADING', true, { root: true })
            await investigationDetailsTargetUsersListFunction(obj.data, obj.id)
                .then(response => {
                    const result = response.data
                    commit('SET_INVESTIGATIONDETAILSTargetUsersLISTDATA', result)
                    commit('common/SET_IS_LOADING', false, { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when getting investigation details', { root: true })
                })
        },
        async getInvestigationDetailsListData({ commit }, obj) {
            // get investigaiton details
            commit('common/SET_IS_LOADING', true, { root: true })
            await investigationDetailsListFunction(obj.data, obj.id)
                .then(response => {
                    const result = response.data
                    commit('SET_INVESTIGATIONDETAILSLISTDATA', result)
                    commit('common/SET_IS_LOADING', false, { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when getting investigation details', { root: true })
                })
        },
        async getInvestigationDetailsData({ commit }, id) {
            // get investigaiton details
            commit('common/SET_IS_LOADING', true, { root: true })
            await getInvestigationDetailsDataFunction(id)
                .then(response => {
                    const result = response.data
                    commit('SET_INVESTIGATIONDETAILSDATA', result)
                    commit('common/SET_IS_LOADING', false, { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when getting investigation details', { root: true })
                })
        },
        async getStatsAndMenuData({ commit }, id) {
            // get investigaiton list via axious
            commit('common/SET_IS_LOADING', true, { root: true })
            await getStatsAndMenuDataFunction(id)
                .then(response => {
                    const result = response.data
                    commit('SET_STATSANDMENUDATA', result)
                    commit('common/SET_IS_LOADING', false, { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when getting investigation details', { root: true })
                })
        },
        async getInvestigationList({ commit }, obj) {
            // get investigaiton list via axious
            commit('common/SET_IS_LOADING', true, { root: true })
            await investigationList(obj)
                .then(response => {
                    const result = response.data
                    commit('SET_INVESTIGATIONLIST', result)
                    commit('common/SET_IS_LOADING', false, { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when getting the investigation List', { root: true })
                })
        },
        async getIrSummary({ commit }, obj) {
            // get investigaiton list via axious
            commit('common/SET_IS_LOADING', true, { root: true })
            await irSummary(obj)
                .then(response => {
                    const result = response.data
                    commit('SET_IRSUMMARY', result)
                    commit('common/SET_IS_LOADING', false, { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when getting the investigation List', { root: true })
                })
        },

        async getTargetUsersList({ commit }) {
            // get target list via axious
            commit('common/SET_IS_LOADING', true, { root: true })
            await getTargetUsers()
                .then(response => {
                    const result = response.data
                    commit('SET_TARGETUSERSLIST', result)
                    commit('common/SET_IS_LOADING', false, { root: true })
                })
                .catch(() => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when getting the communities', { root: true })
                })
        },
        async createInvestigation({ commit, dispatch }, obj) {
            // create investigaiton list via axious. obj is a data parameter ( body ).
            // if you want to manipulate the obj, do it before.
            await saveNewInvestigation(obj)
                .then(resp => {
                    commit('common/SET_IS_LOADING', false, { root: true })
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Investigation Created Succesfully', { root: true })
                })
                .catch(resp => {
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when creating the investigation, try again.', {
                        root: true
                    })
                })
        },
        async getNotifications({ commit }, id) {
            await listNotifications(id, localStorage.getItem('companyId'))
                .then(response => {
                    const res = response.data
                    commit('SET_NOTIFICATIONS', res)
                })
                .catch(() => {
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Notifications could not fetch', { root: true })
                })
        },
        async saveNotifications({ commit, dispatch }, obj) {
            await saveNotifications(obj)
                .then(() => {
                    commit('SET_NOTIFICATIONS', obj)
                    dispatch('common/SET_SNACK_STATUS', true, { root: true })
                    dispatch('common/setErrorMessage', 'Saved Succesfully', { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
                })
                .catch(() => {
                    commit('common/SET_SNACK_STATUS', true, { root: true })
                    commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
                    commit('common/SET_ERROR_STATE', true, { root: true })
                    commit('common/SET_ERROR_MESSAGE', 'Error when saving the notifications, try again.', {
                        root: true
                    })
                })
        }
    }
}

export default investigations