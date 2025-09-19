<template>
  <AppDialog
    title-id="text--training-report-user-details-popup-title"
    title="User Details"
    subtitle-id="text--training-report-user-details-popup-subtitle"
    maxHeightSize="800"
    :custom-size="'1200'"
    :icon="CONSTANTS.icon"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div v-if="item && isSurvey" class="user-details-dialog">
        <el-tabs v-model="activeTab" ref="refTabContainer">
          <el-tab-pane label="Responses" name="responses" id="responses-content">
            <div v-if="activeTab === 'responses'" class="tab-content">
              <div v-if="isResponsesLoading" class="responses-layout">
                <!-- Skeleton Loading for Questions Panel -->
                <div class="questions-panel">
                  <h3 class="panel-title">Questions</h3>
                  <div class="questions-list">
                    <div
                      v-for="n in 3"
                      :key="'skeleton-q-' + n"
                      class="question-item skeleton-item"
                    >
                      <div class="question-number skeleton-circle"></div>
                      <div class="question-text skeleton-content">
                        <div class="skeleton-line skeleton-line-long"></div>
                        <div class="skeleton-line skeleton-line-medium"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Skeleton Loading for Answer Panel -->
                <div class="answers-panel">
                  <div class="answer-details skeleton-answer-panel">
                    <div class="question-header">
                      <div class="question-number-badge skeleton-circle"></div>
                      <div class="question-title skeleton-content">
                        <div class="skeleton-line skeleton-line-long"></div>
                      </div>
                    </div>

                    <div class="answer-options">
                      <h5 class="answer-options-title">Answer Options:</h5>
                      <div class="options-list">
                        <div
                          v-for="n in 4"
                          :key="'skeleton-a-' + n"
                          class="option-item skeleton-option"
                        >
                          <div class="skeleton-line skeleton-line-medium"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="responsesData.length === 0" class="empty-state">
                <p>You do not have any survey data available.</p>
              </div>
              <div v-else class="responses-layout">
                <!-- Questions List (Left Side) -->
                <div class="questions-panel">
                  <h3 class="panel-title">Questions</h3>
                  <div class="questions-list">
                    <div
                      v-for="(question, index) in responsesData"
                      :key="question.questionId || index"
                      class="question-item"
                      :class="{ active: selectedQuestionIndex === index }"
                      @click="selectQuestion(index)"
                    >
                      <div class="question-number">{{ index + 1 }}</div>
                      <div class="question-text">
                        {{ question.questionText }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Answer Details (Right Side) -->
                <div class="answers-panel">
                  <div v-if="selectedQuestion" class="answer-details">
                    <div class="selected-question">
                      <div class="question-header">
                        <div class="question-number-badge">
                          {{ selectedQuestionIndex + 1 }}
                        </div>
                        <h4 class="question-title">
                          {{ selectedQuestion.questionText }}
                        </h4>
                      </div>
                    </div>

                    <div class="answer-options">
                      <h5 class="answer-options-title">Answer Options:</h5>
                      <div class="options-list">
                        <div
                          v-for="option in selectedQuestion.answerOptions"
                          :key="option.optionId || option.text"
                          class="option-item"
                          :class="{
                            selected: option.isUserAnswer,
                            correct: option.isCorrect && showCorrectAnswers
                          }"
                        >
                          <span class="option-text">{{ option.text }}</span>
                          <div class="option-badges">
                            <span v-if="option.isUserAnswer" class="badge badge-selected"
                              >Selected</span
                            >
                            <span
                              v-if="option.isCorrect && showCorrectAnswers"
                              class="badge badge-correct"
                              >Correct</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Interactions" name="interactions" id="interactions-content">
            <div v-if="activeTab === 'interactions'" class="tab-content">
              <DataTable
                :id="CONSTANTS.interactionsTableId"
                ref="refInteractionsTable"
                selectable
                filterable
                options
                no-padding-bottom
                :show-filter-options="false"
                :is-settings-popup="false"
                :loading="isInteractionsLoading"
                :table="interactionsTableData"
                :columns="interactionsTableOptions.columns"
                :empty="interactionsTableOptions.iEmpty"
                :row-actions="interactionsTableOptions.rowActions"
                :add-button="interactionsTableOptions.addButton"
                :download-button="interactionsTableOptions.downloadButton"
                :axios-payload.sync="interactionsAxiosPayload"
                :count-row="5"
                @columnFilterChanged="interactionsColumnFilterChanged"
                @columnFilterCleared="interactionsColumnFilterCleared"
                @server-side-page-number-changed="interactionsServerSidePageNumberChanged"
                @server-side-size-changed="interactionsServerSideSizeChanged"
                @sortChangedEvent="interactionsSortChanged"
                @searchChangedEvent="interactionsHandleSearchChange"
                @refreshAction="callForInteractionsData"
              >
                <template v-slot:datatable-custom-column="{ scope, col }">
                  <div
                    v-if="col.property === 'interaction'"
                    class="training-report-users-interactions__interaction-column"
                  >
                    <v-btn style="display: none;" />
                    <Badge
                      v-bind="getStatusBadgeProps(scope.row.interaction)"
                      :col="col"
                      size="medium"
                    />
                  </div>
                </template>
              </DataTable>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else-if="item && !isSurvey" class="user-details-dialog">
        <DataTable
          :id="CONSTANTS.interactionsTableId"
          ref="refInteractionsTable"
          selectable
          filterable
          options
          no-padding-bottom
          :show-filter-options="false"
          :is-settings-popup="false"
          :loading="isInteractionsLoading"
          :table="interactionsTableData"
          :columns="interactionsTableOptions.columns"
          :empty="interactionsTableOptions.iEmpty"
          :row-actions="interactionsTableOptions.rowActions"
          :add-button="interactionsTableOptions.addButton"
          :download-button="interactionsTableOptions.downloadButton"
          :axios-payload.sync="interactionsAxiosPayload"
          :count-row="5"
          @columnFilterChanged="interactionsColumnFilterChanged"
          @columnFilterCleared="interactionsColumnFilterCleared"
          @server-side-page-number-changed="interactionsServerSidePageNumberChanged"
          @server-side-size-changed="interactionsServerSideSizeChanged"
          @sortChangedEvent="interactionsSortChanged"
          @searchChangedEvent="interactionsHandleSearchChange"
          @refreshAction="callForInteractionsData"
        >
          <template v-slot:datatable-custom-column="{ scope, col }">
            <div
              v-if="col.property === 'interaction'"
              class="training-report-users-interactions__interaction-column"
            >
              <v-btn style="display: none;" />
              <Badge v-bind="getStatusBadgeProps(scope.row.interaction)" :col="col" size="medium" />
            </div>
          </template>
        </DataTable>
      </div>
      <div v-else class="user-details-dialog">
        <p>No user selected</p>
      </div>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn--action-training-report-user-details-modal"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleClose"
        >
          CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

export default {
  name: 'TrainingReportUserDetailsDialog',
  components: { DataTable, AppDialog, Badge },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    status: {
      type: Boolean
    },
    item: {
      type: Object
    },
    isSurvey: {
      type: Boolean,
      default: false
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    },
    isAddTrainingTypeKeyToPayload: {
      type: Boolean,
      default: false
    },
    trainingSummary: {
      type: Object
    }
  },
  data() {
    const interactionsColumns = [
      {
        property: 'eventTime',
        align: 'left',
        fixed: false,
        editable: false,
        label: 'Date',
        show: true,
        type: 'text',
        width: 200,
        hideSort: true
      },
      {
        property: 'interaction',
        align: 'center',
        fixed: 'left',
        editable: false,
        label: 'Interaction',
        show: true,
        type: 'slot',
        width: 180,
        props: {
          style: {
            maxWidth: '110px !important'
          }
        },
        hideSort: true
      },
      {
        property: 'userAgent',
        align: 'left',
        editable: false,
        label: 'User Agent',
        hideSort: true,
        show: true,
        type: 'text',
        width: 250
      },
      {
        property: 'browserName',
        align: 'left',
        label: labels.Browser,
        fixed: false,
        show: true,
        type: 'text',
        width: 180,
        isEditable: false,
        hideSort: true
      },
      {
        property: 'userGeolocation',
        align: 'left',
        editable: false,
        label: 'Geolocation',
        hideSort: true,
        show: true,
        type: 'text',
        width: 180
      },
      {
        property: 'userIpAddresslist',
        align: 'left',
        fixed: 'right',
        editable: false,
        label: 'IP',
        hideSort: true,
        show: true,
        type: 'text',
        width: 160
      }
    ]

    if (
      this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
      this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_TYPES.LEARNING_PATH
    ) {
      interactionsColumns[0].fixed = false
      interactionsColumns.splice(0, 0, {
        property: 'currentStep',
        align: 'left',
        fixed: 'left',
        editable: false,
        label: 'Current Step',
        sortable: false,
        hideSort: true,
        show: true,
        type: 'text',
        width: 180
      })
    }

    return {
      activeTab: 'responses',
      isResponsesLoading: false,
      isInteractionsLoading: false,
      selectedQuestionIndex: 0,
      CONSTANTS: {
        icon: 'mdi-text-box',
        interactionsTableId: 'training-report-user-interactions-data-table'
      },
      interactionsServerSideProps: new ServerSideProps(),
      interactionsAxiosPayload: getDefaultAxiosPayload({ orderBy: 'Date' }),
      interactionsTableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: interactionsColumns,
        addButton: {
          show: false
        },
        iEmpty: {
          message: 'No interactions found for this user'
        },
        rowActions: [],
        downloadButton: {
          show: false
        }
      },
      responsesData: [],
      interactionsTableData: []
    }
  },
  computed: {
    getSubtitle() {
      return `${this.item?.firstName || ''} ${this.item?.lastName || ''}`
    },
    selectedQuestion() {
      return this.responsesData[this.selectedQuestionIndex] || null
    }
  },
  watch: {
    activeTab: {
      handler(newTab) {
        if (newTab === 'responses' && this.isSurvey && this.item) {
          this.callForResponsesData()
        } else if (newTab === 'interactions' && this.item) {
          this.callForInteractionsData()
        }
      }
    },
    item: {
      immediate: true,
      handler(newItem, oldItem) {
        // Sadece item gerçekten değiştiğinde API call yap
        if (
          newItem &&
          (!oldItem || newItem.targetUserResourceId !== oldItem?.targetUserResourceId)
        ) {
          if (this.isSurvey && this.activeTab === 'responses') {
            this.callForResponsesData()
          } else if (this.activeTab === 'interactions' || !this.isSurvey) {
            this.callForInteractionsData()
          }
        }
      }
    }
  },
  methods: {
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },

    callForResponsesData() {
      if (!this.item || !this.isSurvey) return

      this.isResponsesLoading = true

      AwarenessEducatorService.getTrainingReportExamResultSessions(
        this.item.enrollmentId,
        this.item.targetUserResourceId
      )
        .then((response) => {
          console.log('API Response:', response)
          const { data } = response
          console.log('Response data:', data)
          // Transform API response to component data structure
          // data.data array'ini kullanmalıyız çünkü API response'u {data: {data: [...], status: ...}} formatında
          this.responsesData = this.transformApiResponseToComponentData(data.data)
          console.log('Transformed data:', this.responsesData)
          this.selectedQuestionIndex = 0
        })
        .catch((error) => {
          console.error('Error fetching exam result sessions:', error)
          // Fallback to empty data on error
          this.responsesData = []
        })
        .finally(() => {
          this.isResponsesLoading = false
        })
    },

    selectQuestion(index) {
      this.selectedQuestionIndex = index
    },

    transformApiResponseToComponentData(apiData) {
      console.log('Transform input:', apiData)

      if (!apiData || !Array.isArray(apiData)) {
        console.log('No data or not array')
        return []
      }

      // API'den gelen data formatı: data array içinde session objesi var
      const sessionData = apiData[0] // İlk session'ı al
      console.log('Session data:', sessionData)

      if (!sessionData || !sessionData.interactionsHumanReadable) {
        console.log('No session data or interactionsHumanReadable')
        return []
      }

      console.log('interactionsHumanReadable:', sessionData.interactionsHumanReadable)

      const transformedData = sessionData.interactionsHumanReadable.map((interaction) => ({
        questionId: interaction.index + 1,
        questionText: interaction.question,
        responseDate: `${sessionData.enrollmentSessionCreatedAt} ${interaction.time}`,
        answerOptions: this.transformAnswerOptions(interaction.answers)
      }))

      console.log('Final transformed data:', transformedData)
      return transformedData
    },

    transformAnswerOptions(answers) {
      if (!Array.isArray(answers)) {
        return []
      }

      return answers.map((answer, index) => ({
        optionId: index + 1,
        text: answer.option,
        isUserAnswer: Boolean(answer.isUserAnswer),
        isCorrect: Boolean(answer.correctAnswer)
      }))
    },

    callForInteractionsData() {
      if (!this.item) return

      this.isInteractionsLoading = true
      let type = 0
      let textType = this.isAddTrainingTypeKeyToPayload
        ? this.trainingSummary.trainingTypeName.replaceAll(' ', '')
        : null
      if (textType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) type = 1
      else if (textType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) type = 2
      else if (textType === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) type = 3
      else if (
        textType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        textType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        type = 4

      AwarenessEducatorService.getTrainingReportInteractions(
        this.item.enrollmentId,
        this.item.targetUserResourceId,
        null, // interactionType
        type
      )
        .then((response) => {
          this.interactionsTableData = response?.data?.data.map((item) => ({
            interaction: item.interaction,
            eventTime: item.eventTime,
            currentStep: item.currentStep,
            ...item.trackingInfo
          }))
        })
        .finally(() => {
          this.isInteractionsLoading = false
        })
    },

    // Responses table methods
    responsesColumnFilterChanged(filter) {
      // Implement if needed
    },
    responsesColumnFilterCleared() {
      // Implement if needed
    },
    responsesServerSidePageNumberChanged(pageNumber) {
      // Implement if needed
    },
    responsesServerSideSizeChanged(size) {
      // Implement if needed
    },
    responsesSortChanged(sort) {
      // Implement if needed
    },
    responsesHandleSearchChange(search) {
      // Implement if needed
    },

    // Interactions table methods
    interactionsColumnFilterChanged(filter) {
      // Implement if needed
    },
    interactionsColumnFilterCleared() {
      // Implement if needed
    },
    interactionsServerSidePageNumberChanged(pageNumber) {
      // Implement if needed
    },
    interactionsServerSideSizeChanged(size) {
      // Implement if needed
    },
    interactionsSortChanged(sort) {
      // Implement if needed
    },
    interactionsHandleSearchChange(search) {
      // Implement if needed
    },

    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>

<style scoped>
.user-details-dialog {
  min-height: auto;
}

.tab-content {
  padding-top: 8px;
}

.training-report-users-interactions__interaction-column {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Responses Layout */
.responses-layout {
  display: flex;
  gap: 24px;
}

.questions-panel {
  flex: 0 0 450px;
  padding-right: 24px;
}

.answers-panel {
  flex: 1;
  padding-left: 24px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

/* Questions List */
.questions-list {
  max-height: 550px;
  overflow-y: auto;
}

.question-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f2f2f2;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.question-item:hover {
  border-color: #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.question-item.active {
  border: 1px solid #2196f3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
}

.question-number {
  flex: 0 0 32px;
  height: 32px;
  background-color: #f2f2f2;
  color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 12px;
  transition: all 0.2s ease;
}

.question-item.active .question-number {
  background-color: #2196f3;
  color: white;
}

.question-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
}

/* Answer Details */
.answer-details {
  max-height: 550px;
  overflow-y: auto;
  border: 1px solid #f2f2f2;
  border-radius: 12px;
  padding: 24px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.question-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f2f2f2;
}

.question-number-badge {
  flex: 0 0 32px;
  height: 32px;
  background-color: #2196f3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
}

.question-title {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.answer-options-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

/* Option Items */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.option-item.selected {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

.option-item.correct {
  background-color: #e8f5e8;
  border-color: #4caf50;
}

.option-item.selected.correct {
  background-color: #c8e6c9;
  border-color: #2e7d32;
}

.option-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.option-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.badge {
  height: 24px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-selected {
  background-color: #2196f3;
  color: white;
}

.badge-correct {
  background-color: #4caf50;
  color: white;
}

/* Response Info */
.response-info {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f2f2f2;
}

.response-date {
  color: #666;
  font-style: italic;
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
}

.empty-state p {
  font-size: 16px;
}

/* Skeleton Loading Styles */
@keyframes skeleton-pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.skeleton-item {
  pointer-events: none;
}

.skeleton-circle {
  background-color: #e0e0e0 !important;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 14px;
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-line-long {
  width: 85%;
}

.skeleton-line-medium {
  width: 60%;
}

.skeleton-option {
  background-color: #f8f9fa !important;
  border-color: #e9ecef !important;
  pointer-events: none;
}

.skeleton-option .skeleton-line {
  width: 70%;
}

.skeleton-answer-panel {
  pointer-events: none;
}

.skeleton-answer-panel .question-title {
  margin: 0;
}
</style>
