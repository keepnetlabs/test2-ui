import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'

export default {
  computed: {
    getDistributionTextRenderStatus() {
      if (!this.totalTargetUserCount) return false
      return this.inputDistributionFormData.distributionTypeId === DISTRIBUTION_TYPES.PHISHING
        ? this.inputDistributionFormData.sendingLimit &&
            this.inputDistributionFormData.distributionDelayEvery
        : this.inputDistributionFormData.sendingLimit &&
            this.inputDistributionFormData.distributionEmailOver
    },
    getDistributionText() {
      if (this.totalTargetUserCount === 1)
        return `Sending an email will start immediately for a single user.`
      return this.inputDistributionFormData.distributionTypeId === DISTRIBUTION_TYPES.PHISHING
        ? `Sending ${this.inputDistributionFormData.sendingLimit} emails every ${this.inputDistributionFormData.distributionDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} to ${this.totalTargetUserCount} target users will take approximately ${this.getApproximatedTime}.`
        : `Sending  ${this.inputDistributionFormData.sendingLimit} emails every ${this.getEmailOverMinutes} minutes to ${this.totalTargetUserCount} targets users will take ${this.getApproximatedTime}.`
    },
    getEmailOverMinutes() {
      let seconds = this.batchEverySendSecond
      seconds = seconds.toFixed()
      if (seconds < 1) seconds = 1
      let minutes = 0
      if (seconds > 60) {
        minutes = seconds % 60
        seconds = seconds / 60
      }
      minutes = minutes.toString()
      seconds = seconds.toString()
      const singleDigitMinutes = `0${minutes}`
      const singleDigitSeconds = `0${seconds}`
      return `${minutes.length === 1 ? singleDigitMinutes : minutes}:${
        seconds.length === 1 ? singleDigitSeconds : seconds
      }`
    },
    getApproximatedTime() {
      let seconds = this.totalSendSecond
      let minutes = 0
      let hours = 0
      if (seconds > 60) {
        minutes = Math.floor(seconds / 60)
        seconds = seconds % 60
      }
      if (minutes > 60) {
        hours = Math.floor(minutes / 60)
        minutes = minutes % 60
      }
      seconds = Math.floor(seconds)
      if (minutes === 0 && hours === 0 && seconds === 0) {
        seconds = 1
      }
      const hoursText = hours > 1 ? 'hours' : 'hour'
      const minutesText = minutes > 1 ? 'minutes' : 'minute'
      const secondsText = seconds > 1 ? 'seconds' : 'second'
      const leftSideHours = `${hours} ${hoursText} `
      let leftSideText = '',
        rightSideText = ''
      if (hours !== 0) {
        leftSideText = leftSideHours
      }
      if (minutes !== 0) {
        leftSideText += `${minutes} ${minutesText} `
      }

      if (seconds !== 0) {
        if (hours !== 0 || minutes !== 0) rightSideText = `and ${seconds} ${secondsText}`
        else rightSideText = `${seconds} ${secondsText}`
      }

      return `${leftSideText}${rightSideText}`
    }
  }
}
