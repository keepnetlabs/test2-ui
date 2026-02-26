<template>
  <div v-if="isVisible">
    <div class="training-report-user-details-overlay" @click="handleOverlayClick"></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="getNavigationDrawerClass"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header">
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle class="k-overlay__title">
                  Details
                </VListItemTitle>
                <VListItemSubtitle v-if="getSubtitle" class="text-primary-color">
                  {{ getSubtitle }}
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </div>
          <div>
            <VIcon class="cursor-pointer" color="#757575" @click="handleClose">
              mdi-close
            </VIcon>
          </div>
        </div>
      </div>
      <div class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body">
        <div v-if="item && isSurvey" class="training-report-user-details-dialog">
          <el-tabs v-model="activeTab" ref="refTabContainer" class="mt-4">
            <el-tab-pane label="Responses" name="responses" id="responses-content">
              <div v-if="activeTab === 'responses'" class="tab-content">
                <div v-if="isResponsesLoading" class="responses-layout">
                  <!-- Skeleton Loading for Questions Panel -->
                  <div class="questions-panel">
                    <div class="questions-list">
                      <h3 class="panel-title">Questions</h3>
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
                      <h3 class="panel-title">Answer Details</h3>
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
                            v-for="n in 2"
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
                <div v-else>
                  <div class="responses-toolbar" v-if="sessionSelectItems.length > 1">
                    <KSelect
                      v-model="selectedSessionIndex"
                      :items="sessionSelectItems"
                      outlined
                      dense
                      hide-details
                      placeholder="Response"
                      style="max-width: 380px;"
                    />
                  </div>
                  <div class="responses-layout">
                    <!-- Questions List (Left Side) -->
                    <div class="questions-panel">
                      <div class="questions-list">
                        <h3 class="panel-title">Questions</h3>
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
                        <h3 class="panel-title">Answer Details</h3>
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
                          <h5
                            v-if="
                              selectedQuestion.questionType !== 'fill-in' &&
                              selectedQuestion.questionType !== 'numeric' &&
                              selectedQuestion.questionType !== 'long-fill-in'
                            "
                            class="answer-options-title"
                          >
                            Answer Options:
                          </h5>
                          <!-- Choice Single question type için component -->
                          <ChoiceQuestionComponent
                            v-if="
                              selectedQuestion.questionType === 'choice-single' ||
                              selectedQuestion.questionType === 'true-false'
                            "
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Choice Multi question type için component -->
                          <MultipleResponseComponent
                            v-else-if="selectedQuestion.questionType === 'choice-multi'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Fill-In question type için component -->
                          <FillInComponent
                            v-else-if="selectedQuestion.questionType === 'fill-in'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Numeric question type için component -->
                          <NumericComponent
                            v-else-if="selectedQuestion.questionType === 'numeric'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Sequence question type için component -->
                          <SequenceComponent
                            v-else-if="selectedQuestion.questionType === 'sequence'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Matching question type için component -->
                          <MatchingComponent
                            v-else-if="selectedQuestion.questionType === 'matching'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Dropdown question type için component -->
                          <DropdownComponent
                            v-else-if="selectedQuestion.questionType === 'dropdown'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Word Bank question type için component -->
                          <WordBankComponent
                            v-else-if="selectedQuestion.questionType === 'word-bank'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Hotspot question type için component -->
                          <HotspotComponent
                            v-else-if="selectedQuestion.questionType === 'hotspot'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Likert question type için component -->
                          <LikertComponent
                            v-else-if="selectedQuestion.questionType === 'likert'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Long Fill In (Essay) question type için component -->
                          <LongFillInComponent
                            v-else-if="selectedQuestion.questionType === 'long-fill-in'"
                            :answer-options="selectedQuestion.answerOptions"
                            :show-correct-answers="showCorrectAnswers"
                          />
                          <!-- Diğer question type'lar için fallback -->
                          <div v-else class="options-list">
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
        <div v-else class="user-details-dialog">
          <p>No user selected</p>
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'
import ChoiceQuestionComponent from './ChoiceQuestionComponent'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import MultipleResponseComponent from './MultipleResponseComponent'
import FillInComponent from './FillInComponent'
import NumericComponent from './NumericComponent'
import SequenceComponent from './SequenceComponent'
import MatchingComponent from './MatchingComponent'
import DropdownComponent from './DropdownComponent'
import WordBankComponent from './WordBankComponent'
import HotspotComponent from './HotspotComponent'
import LikertComponent from './LikertComponent'
import LongFillInComponent from './LongFillInComponent'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'

export default {
  name: 'TrainingReportUserDetailsDialog',
  components: {
    DataTable,
    Badge,
    KSelect,
    ChoiceQuestionComponent,
    MultipleResponseComponent,
    FillInComponent,
    NumericComponent,
    SequenceComponent,
    MatchingComponent,
    DropdownComponent,
    WordBankComponent,
    HotspotComponent,
    LikertComponent,
    LongFillInComponent
  },
  mixins: [useLoading, useDefaultTableFunctions, useDrawerAnimation],
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
        type: 'text'
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
      selectedSessionIndex: null,
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
      interactionsTableData: [],
      allSessions: [],
      sessionSelectItems: []
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--training-report-user-details': true
      }
    },
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
    selectedSessionIndex(newIndex) {
      if (
        newIndex !== null &&
        Array.isArray(this.allSessions) &&
        this.allSessions.length > 0 &&
        this.allSessions[newIndex]
      ) {
        this.responsesData = this.transformSessionToQuestions(this.allSessions[newIndex])
        this.selectedQuestionIndex = 0
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
          const { data } = response
          this.allSessions = Array.isArray(data?.data) ? data.data : []
          // Build select items like: Response 1..N
          this.sessionSelectItems = this.allSessions.reverse().map((_, idx) => ({
            text: `Completion ${idx + 1}`,
            value: idx
          }))
          // Default to latest session
          const lastIndex = this.allSessions.length > 0 ? this.allSessions.length - 1 : null
          this.selectedSessionIndex = lastIndex
          this.responsesData =
            lastIndex === null ? [] : this.transformSessionToQuestions(this.allSessions[lastIndex])
          this.selectedQuestionIndex = 0
        })
        .catch((error) => {
          console.error('Error fetching exam result sessions:', error)
          // Fallback to empty data on error
          this.allSessions = []
          this.sessionSelectItems = []
          this.responsesData = []
          this.selectedSessionIndex = null
        })
        .finally(() => {
          this.isResponsesLoading = false
        })
    },

    selectQuestion(index) {
      this.selectedQuestionIndex = index
    },

    transformApiResponseToComponentData(apiData) {
      // Kept for backward compatibility; now unused
      if (!apiData || !Array.isArray(apiData)) return []
      const sessionData = apiData[apiData.length - 1]
      return this.transformSessionToQuestions(sessionData)
    },

    transformSessionToQuestions(sessionData) {
      if (!sessionData || !sessionData.interactionsHumanReadable) return []
      const transformedData = sessionData.interactionsHumanReadable
        .filter((interaction) => interaction.source === 'Qex')
        .map((interaction) => {
          return {
            questionId: interaction.index + 1,
            questionText: interaction.question,
            questionType: String(interaction.type || '').toLowerCase(),
            responseDate: `${sessionData.enrollmentSessionCreatedAt} ${interaction.time}`,
            answerOptions: this.transformAnswerOptions(interaction.answers)
          }
        })
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
        ? this.trainingSummary?.trainingTypeName?.replaceAll(' ', '')
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
          const rows = Array.isArray(response?.data?.data) ? response.data.data : []
          this.interactionsTableData = rows.map((item) => ({
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

    handleOverlayClick() {
      this.closeDrawer()
    },
    handleClose() {
      this.closeDrawer()
    }
  }
}
</script>
