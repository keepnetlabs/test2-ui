<template>
  <div id="vishing-report-summary" class="training-report-summary">
    <VishingReportSummaryHeader
      :vishing-name="vishingName"
      :id="id"
      :vishing-report-items="getResendDialogItems"
    />
    <VishingReportSummaryCards :items="getCardsData" />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <VishingReportCampaignInfo
        class="vishing-report-campaign-info"
        :items="getVishingInfoData"
        :is-test-training="isTestTraining"
      />
      <VishingReportDelivery class="ml-4" :items="getTrainingVishingDeliveryData" />
    </div>
    <VishingReportTemplate :form-data="getVishingTemplateData" />
  </div>
</template>

<script>
import VishingReportSummaryHeader from '@/components/VishingReport/VishingReportSummaryHeader'
import VishingReportSummaryCards from '@/components/VishingReport/VishingReportSummaryCards'
import VishingReportCampaignInfo from '@/components/VishingReport/VishingReportCampaignInfo'
import VishingReportDelivery from '@/components/VishingReport/VishingReportDelivery'
import VishingReportTemplate from '@/components/VishingReport/VishingReportTemplate'
export default {
  name: 'VishingReportSummary',
  components: {
    VishingReportTemplate,
    VishingReportDelivery,
    VishingReportCampaignInfo,
    VishingReportSummaryCards,
    VishingReportSummaryHeader
  },
  props: {
    id: {
      type: String
    },
    vishingName: {
      type: String
    },
    trainingSummary: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {
    getCardsData() {
      const { reportDetail = {}, completedCount = 0 } = this.trainingSummary || {}
      const {
        totalTargetUserCount = 0,
        totalUserClickedCount = 0,
        totalUserOpenedCount = 0,
        noResponseCount = 0,
        inProgressCount = 0
      } = reportDetail
      const inProgress = inProgressCount ? inProgressCount : totalUserClickedCount - completedCount
      return {
        openedEmail: {
          userCount: totalUserOpenedCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((totalUserOpenedCount / totalTargetUserCount) * 100).toFixed()
        },
        inProgress: {
          userCount: inProgress,
          userPercent:
            totalTargetUserCount === 0 ? '0' : ((inProgress / totalTargetUserCount) * 100).toFixed()
        },
        completedTraining: {
          userCount: completedCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((completedCount / totalTargetUserCount) * 100).toFixed()
        },
        noResponse: {
          userCount: noResponseCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((noResponseCount / totalTargetUserCount) * 100).toFixed()
        }
      }
    },
    getTrainingVishingDeliveryData() {
      const {
        phoneNumber = '+44 545 678 95 53',
        startDate = '28.05.2021 16:29:00 - 29.05.2021 16:29:90'
      } = this.trainingSummary || {}
      return {
        'Campaign Start-End Date': startDate,
        'Caller Phone Number': phoneNumber,
        'Calling Status': 15
      }
    },
    getVishingInfoData() {
      const { totalTargetUserCount = 15 } = this?.trainingSummary?.reportDetail || {}
      return {
        'Target Users': {
          show: true,
          value: totalTargetUserCount
        },
        Language: {
          show: true,
          value: 'EN/Female'
        }
      }
    },
    isTestTraining() {
      const { isTest = false } = this.trainingSummary || {}
      return isTest
    },
    getVishingTemplateData() {
      const { trainingDetails = {} } = this.trainingSummary || {}
      const { companyName = '', description: trainingDescription = '' } = trainingDetails
      const { name = '', description = '', template = '' } = this.enrollmentEmailData || {}
      return {
        template: {
          resourceId: '1',
          name: 'Long Template Name that Creates Overflow Elipsis',
          language: 'English - Female',
          languageShortCode: 'EN',
          narratorGender: 'Female',
          description:
            'Blandit quam habitant eget nisi eget quam amet, at amet. Enim, eget donec aliquet leo quis interdum tortor ',
          difficulty: 'Medium',
          createdBy: 'System',
          createTime: '14/06/2022 06:49',
          isOwner: true,
          availableFor: 'No',
          tags: ['tag1', 'tag2', 'tag1', 'tag2', 'tag1', 'tag2'],
          steps: [
            {
              type: 'Text to Speech',
              textToSpeech:
                'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
              fileUrl:
                'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
            },
            {
              type: 'Upload Audio',
              fileName: 'Randomfilename.mp3',
              fileUrl:
                'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
              requiredDigitCount: 4
            },
            {
              type: 'Pause',
              pauseSeconds: 5
            },
            {
              type: 'Text to Speech',
              textToSpeech:
                'Nunc dignissim nullam enim malesuada non. Non nisl quam eget risus varius. Nunc sed tortor molestie eu interdum. Tristique viverra eget varius enim vitae. Bibendum enim imperdiet eu, neque, habitant volutpat. Aliquam suspendisse massa nunc accumsan tortor, neque. Nisi libero tincidunt nunc doloraa. ',
              fileUrl:
                'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'
            },
            {
              type: 'Upload Audio',
              fileName: 'Randomfilename.mp3',
              fileUrl:
                'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3',
              requiredDigitCount: 4,
              isFailStep: true
            }
          ]
        }
      }
    }
  },
  methods: {
    getResendDialogItems() {
      return { answered: 21, noResponse: 36 }
    }
  }
}
</script>
