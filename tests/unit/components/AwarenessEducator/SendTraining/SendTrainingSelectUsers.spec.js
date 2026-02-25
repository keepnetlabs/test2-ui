import SendTrainingSelectUsers from '@/components/AwarenessEducator/SendTraining/SendTrainingSelectUsers.vue'

describe('SendTrainingSelectUsers.vue', () => {
  it('resetCheckboxes clears all campaign target flags', () => {
    const ctx = {
      formData: {
        userWhoOpenedEmail: true,
        userWhoClickedEmail: true,
        userWhoSubmittedData: true,
        userWhoSubmittedMFACode: true,
        userWhoDownloadedAttachment: true,
        userWhoReportedAsSuspicious: true
      }
    }
    SendTrainingSelectUsers.methods.resetCheckboxes.call(ctx)
    expect(Object.values(ctx.formData).every((v) => v === false)).toBe(true)
  })

  it('getTotalTargetUserCount sums selected campaign stats', () => {
    const total = SendTrainingSelectUsers.computed.getTotalTargetUserCount.call({
      selectedCampaign: {
        scenarioStats: {
          openedEmail: 2,
          clickedEmail: 3,
          submittedEmail: 4,
          mfa: 1,
          attachmentOpenedEmail: 5,
          reportedEmail: 6
        }
      },
      formData: {
        userWhoOpenedEmail: true,
        userWhoClickedEmail: false,
        userWhoSubmittedData: true,
        userWhoSubmittedMFACode: false,
        userWhoDownloadedAttachment: false,
        userWhoReportedAsSuspicious: true
      }
    })
    expect(total).toBe(12)
  })
})

