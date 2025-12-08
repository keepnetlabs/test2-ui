// Users Dashboard Labels - Multi-language support
const usersDashboardLabels = {
  'en-GB': {
    // Header
    welcomeTitle: (name) => `${name}, Welcome to Your Security Growth Dashboard!`,
    welcomeDescription:
      'Track your progress and see how your actions strengthen our security culture.',

    // User Menu
    userMenuEmail: 'Email:',
    userMenuDepartment: 'Department:',
    userMenuPhoneNumber: 'Phone Number:',
    userMenuPreferredLanguage: 'Preferred Language:',
    userMenuLogout: 'Logout',

    // Overall Performance
    overallPerformanceTitle: 'Overall Performance',
    overallPerformanceSubtitle: 'Track your performance, points, and rank for the last 30 days.',
    overallPerformanceSeeRanking: 'See Ranking Details',
    overallPerformancePoints: 'Points:',
    overallPerformanceRank: 'Rank:',

    // Recent Badges
    recentBadgesTitle: 'Recent Badges',
    recentBadgesSubtitle: 'View your last 3 badges earned from your actions and behaviours.',
    recentBadgesSeeAll: 'See All Badges',
    recentBadgesNoBadges: 'No recent badges found.',

    // Your Badges
    yourBadgesTitle: 'Your Badges',
    yourBadgesSubtitle: 'See all your earned and available badges in one place.',
    yourBadgesEarnedOn: (date) => `Earned on ${date}`,
    yourBadgesNotEarnedYet: 'Not earned yet',
    yourBadgesNoBadges: 'No badges found.',
    badgeEliteSecurityChampion: 'Elite Security Champion',
    badgeEngagementStar: 'Engagement Star',
    badgeSecurityAmbassador: 'Security Ambassador',
    // Badge Descriptions: en-GB and en-US use API description directly, no labels needed

    // Your Learning
    yourLearningTitle: 'Your Learning',
    yourLearningSubtitle: 'See all your completed and assigned trainings in one place.',
    yourLearningTrainingMaterialName: 'Training Material Name',
    yourLearningStartDate: 'Start Date',
    yourLearningTrainingStatus: 'Training Status',
    yourLearningCertificate: 'Certificate',
    yourLearningPoints: 'Points',
    yourLearningActions: 'Actions',
    yourLearningNotStarted: 'Not Started',
    yourLearningNotCompleted: 'Not Completed',
    yourLearningCompleted: 'Completed',
    yourLearningInProgress: 'In Progress',
    yourLearningAvailable: 'Available',
    yourLearningNotAvailable: 'Not Available',
    yourLearningStartTraining: 'Start Training',
    yourLearningRedoTraining: 'Redo Training',
    yourLearningMaxPoints: 'max',
    yourLearningNoTrainingMaterials: 'No training materials found',

    // Your Certificates
    yourCertificatesTitle: 'Your Certificates',
    yourCertificatesSubtitle: 'See all your earned and pending certificates in one place.',
    yourCertificatesCertificateName: 'Certificate Name',
    yourCertificatesCertificateDate: 'Certificate Date',
    yourCertificatesTrainingStatus: 'Training Status',
    yourCertificatesActions: 'Actions',
    yourCertificatesNoCertificates: 'No certificates found',
    yourCertificatesDownloadCertificate: 'Download Certificate',
    yourCertificatesInQueue: 'In Queue',

    // Leaderboard
    leaderboardTitle: 'Leaderboard',
    leaderboardSubtitle: 'Employee performance rankings over the last 30 days.',
    leaderboardRank: 'Rank',
    leaderboardFirstName: 'First Name',
    leaderboardLastName: 'Last Name',
    leaderboardEmail: 'Email',
    leaderboardDepartment: 'Department',
    leaderboardPerformance: 'Performance',
    leaderboardTotalPoints: 'Total Points',
    leaderboardEmptyMessage: 'No leaderboard data available.',
    leaderboardYou: 'You',

    // Activity Timeline
    activityTimelineTitle: 'Your Activity Timeline',
    activityTimelineSubtitle:
      'A timeline of your recent activities and their outcomes from the last 30 days.',
    activityTimelineLoadMore: 'Load More Activities',
    activityTimelineEmptyMessage: 'No activities found in 30 days.',
    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: 'The reported email with',
    activityTimelineIncidentResponderSubject:
      'subject was analyzed by the incident responder and resulted in',
    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `Enrollment email sent to ${userName} for <strong>${enrollmentName}</strong> enrollment in the <strong>${category}</strong> category.`
      }
      return `Enrollment email sent to ${userName} for <strong>${enrollmentName}</strong> enrollment.`
    },
    activityTimelineFor: 'for',
    activityTimelineEnrollment: 'enrollment in the',
    activityTimelineCategory: 'category.',
    // Neutral + Other
    activityTimelineWith: 'with',
    activityTimelineHasBeenSentTo: 'has been sent to',
    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'at',
    activityTimelineDifficulity: 'difficulty',
    // Opened
    activityTimelineOpenedTheEmailFor: 'opened the email for',
    activityTimelineDifficulty: 'difficulty.',
    // Points
    activityTimelineEarned: 'earned',
    activityTimelineLost: 'lost',
    activityTimelinePoints: 'points',
    activityTimelineInThe: 'in the',
    activityTimelineWithAnEnrollmentPerformance: 'with an enrollment performance of',
    activityTimelineWithACampaignPerformance: 'with a campaign performance of',
    // Point Rule
    activityTimelineAnd: 'and',
    activityTimelineReceived: 'received',
    activityTimelineExtra: 'extra',
    activityTimelineForJoiningTheTraining: 'for joining the training',
    activityTimelineMoreThan3Days: 'more than 3 days after invitation.',
    activityTimeline1To3Days: '1–3 days after invitation.',
    activityTimelineWithin24Hours: 'within 24 hours.',
    // Function labels for proper word order in each language
    activityTimelineAwarenessPoints: (
      userName,
      points,
      enrollmentName,
      category,
      performance,
      pointRule
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'earned' : 'lost'
      let text = `${userName} <strong>${action}</strong> <strong>${pointsAbs} points</strong> in the <strong>${enrollmentName}</strong> enrollment in the <strong>${category}</strong> category, with an enrollment performance of <strong>${performance}%</strong>`
      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = pointRule.ruleName === 'Joined After 3 Days' ? 'lost' : 'received'
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'extra'
        const prefix =
          pointRule.ruleName === 'Joined After 3 Days'
            ? ''
            : pointRule.ruleName === 'Joined 1–3 Days'
            ? ''
            : '+'
        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          ruleText = ` and <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} points</strong> for joining the training more than 3 days after the invitation.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = ` and <strong>${ruleAction}</strong> <strong>${prefix}${rulePoints} ${extra} points</strong> for joining the training 1–3 days after the invitation.`
        } else {
          ruleText = ` and <strong>${ruleAction}</strong> <strong>${prefix}${rulePoints} ${extra} points</strong> for joining the training within 24 hours of the invitation.`
        }
        text += ruleText
      } else {
        text += '.'
      }
      return text
    },
    activityTimelineCampaignPoints: (
      userName,
      points,
      campaignName,
      campaignType,
      difficulty,
      performance
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'earned' : 'lost'
      return `${userName} <strong>${action}</strong> <strong>${pointsAbs} points</strong> in the <strong>${campaignName}</strong> ${campaignType} at <strong>${difficulty}</strong> difficulty, with a campaign performance of <strong>${performance}%</strong>.`
    },
    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName} opened the email for <strong>${enrollmentName}</strong> enrollment in the <strong>${category}</strong> category.`
    },
    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      return `${userName} opened the email for <strong>${campaignName}</strong> ${campaignType} with <strong>${difficulty}</strong> difficulty.`
    },
    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      return `The <strong>${campaignName}</strong> ${campaignType} with <strong>${difficulty}</strong> difficulty has been sent to ${userName}.`
    },
    // Legacy (keeping for backward compatibility)
    activityTimelineEarnedPoints: (points) => `Earned ${points} points`,
    activityTimelineLostPoints: (points) => `Lost ${points} points`,
    activityTimelineInCampaign: 'in the',
    activityTimelinePhishingCampaign: 'phishing campaign',
    activityTimelineAtDifficulty: 'at',
    activityTimelineWithPerformance: 'with a campaign performance of',
    activityTimelineEasy: 'easy',
    activityTimelineMedium: 'medium',
    activityTimelineHard: 'hard',

    // Phishing Test Results
    phishingTestResultsTitle: 'Your Phishing Test Results',
    phishingTestResultsSubtitle:
      'Overview of your phishing activity results from the last 30 days.',
    phishingTestResultsReportedPhishingEmails: 'Reported Phishing Emails:',
    phishingTestResultsPhishingSimulations: 'Phishing Simulations:',
    phishingTestResultsDetectionAccuracy: 'Detection Accuracy:',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return 'No points earned for your reports yet.'
      }
      return `You earned +${points} points for your reports.`
    },
    phishingTestResultsLostPoints: (points) => {
      if (points === 0) {
        return 'No points lost for missed reports.'
      }
      return `You lost -${points} points for missed reports.`
    },
    phishingTestResultsAccuracyUp: (percentage) => {
      const absPercentage = Math.abs(percentage)
      if (percentage < 0) {
        return `Detection accuracy down by ${absPercentage}% from last month.`
      } else if (percentage > 0) {
        return `Detection accuracy up by ${absPercentage}% from last month.`
      }
      return 'Detection accuracy unchanged from last month.'
    },
    phishingTestResultsSuccessRate: 'success rate',

    // Activity Action Types
    actionTypeClickedTraining: 'Clicked Training',
    actionTypeEmailOpened: 'Email Opened',
    actionTypeEmailSent: 'Email Sent',
    actionTypeDownloadedPoster: 'Downloaded Poster',
    actionTypeExamPassed: 'Exam Passed',
    actionTypeClickedLink: 'Clicked Link',
    actionTypeSMSSent: 'SMS Sent',
    actionTypeOpenedAttachment: 'Opened Attachment',

    // DataTable Pagination
    dataTableRowsPerPage: 'Rows per page:',
    dataTableActions: 'Actions',
    dataTablePaginationOf: 'of'
  },
  'en-US': {
    // Header
    welcomeTitle: (name) => `${name}, Welcome to Your Security Growth Dashboard!`,
    welcomeDescription:
      'Track your progress and see how your actions strengthen our security culture.',

    // Overall Performance
    overallPerformanceTitle: 'Overall Performance',
    overallPerformanceSubtitle: 'Track your performance, points, and rank for the last 30 days.',
    overallPerformanceSeeRanking: 'See Ranking Details',
    overallPerformancePoints: 'Points:',
    overallPerformanceRank: 'Rank:',

    // Recent Badges
    recentBadgesTitle: 'Recent Badges',
    recentBadgesSubtitle: 'View your last 3 badges earned from your actions and behaviors.',
    recentBadgesSeeAll: 'See All Badges',
    recentBadgesNoBadges: 'No recent badges found.',

    // Your Badges
    yourBadgesTitle: 'Your Badges',
    yourBadgesSubtitle: 'See all your earned and available badges in one place.',
    yourBadgesEarnedOn: (date) => `Earned on ${date}`,
    yourBadgesNotEarnedYet: 'Not earned yet',
    yourBadgesNoBadges: 'No badges found.',
    badgeEliteSecurityChampion: 'Elite Security Champion',
    badgeEngagementStar: 'Engagement Star',
    badgeSecurityAmbassador: 'Security Ambassador',

    // Your Learning
    yourLearningTitle: 'Your Learning',
    yourLearningSubtitle: 'See all your completed and assigned trainings in one place.',
    yourLearningTrainingMaterialName: 'Training Material Name',
    yourLearningStartDate: 'Start Date',
    yourLearningTrainingStatus: 'Training Status',
    yourLearningCertificate: 'Certificate',
    yourLearningPoints: 'Points',
    yourLearningActions: 'Actions',
    yourLearningNotStarted: 'Not Started',
    yourLearningNotCompleted: 'Not Completed',
    yourLearningCompleted: 'Completed',
    yourLearningInProgress: 'In Progress',
    yourLearningAvailable: 'Available',
    yourLearningNotAvailable: 'Not Available',
    yourLearningStartTraining: 'Start Training',
    yourLearningRedoTraining: 'Redo Training',
    yourLearningMaxPoints: 'max',
    yourLearningNoTrainingMaterials: 'No training materials found',

    // Your Certificates
    yourCertificatesTitle: 'Your Certificates',
    yourCertificatesSubtitle: 'See all your earned and pending certificates in one place.',
    yourCertificatesCertificateName: 'Certificate Name',
    yourCertificatesCertificateDate: 'Certificate Date',
    yourCertificatesTrainingStatus: 'Training Status',
    yourCertificatesActions: 'Actions',
    yourCertificatesNoCertificates: 'No certificates found',
    yourCertificatesDownloadCertificate: 'Download Certificate',
    yourCertificatesInQueue: 'In Queue',

    // Leaderboard
    leaderboardTitle: 'Leaderboard',
    leaderboardSubtitle: 'Employee performance rankings over the last 30 days.',
    leaderboardRank: 'Rank',
    leaderboardFirstName: 'First Name',
    leaderboardLastName: 'Last Name',
    leaderboardEmail: 'Email',
    leaderboardDepartment: 'Department',
    leaderboardPerformance: 'Performance',
    leaderboardTotalPoints: 'Total Points',
    leaderboardEmptyMessage: 'No leaderboard data available.',
    leaderboardYou: 'You',

    // Activity Timeline
    activityTimelineTitle: 'Your Activity Timeline',
    activityTimelineSubtitle:
      'A timeline of your recent activities and their outcomes from the last 30 days.',
    activityTimelineLoadMore: 'Load More Activities',
    activityTimelineEmptyMessage: 'No activities found in 30 days.',
    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: 'The reported email with',
    activityTimelineIncidentResponderSubject:
      'subject was analyzed by the incident responder and resulted in',
    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `Enrollment email sent to ${userName} for <strong>${enrollmentName}</strong> enrollment in the <strong>${category}</strong> category.`
      }
      return `Enrollment email sent to ${userName} for <strong>${enrollmentName}</strong> enrollment.`
    },
    activityTimelineFor: 'for',
    activityTimelineEnrollment: 'enrollment in the',
    activityTimelineCategory: 'category.',
    // Neutral + Other
    activityTimelineWith: 'with',
    activityTimelineHasBeenSentTo: 'has been sent to',
    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'at',
    activityTimelineDifficulity: 'difficulty',
    // Opened
    activityTimelineOpenedTheEmailFor: 'opened the email for',
    activityTimelineDifficulty: 'difficulty.',
    // Points
    activityTimelineEarned: 'earned',
    activityTimelineLost: 'lost',
    activityTimelinePoints: 'points',
    activityTimelineInThe: 'in the',
    activityTimelineWithAnEnrollmentPerformance: 'with an enrollment performance of',
    activityTimelineWithACampaignPerformance: 'with a campaign performance of',
    // Point Rule
    activityTimelineAnd: 'and',
    activityTimelineReceived: 'received',
    activityTimelineExtra: 'extra',
    activityTimelineForJoiningTheTraining: 'for joining the training',
    activityTimelineMoreThan3Days: 'more than 3 days after invitation.',
    activityTimeline1To3Days: '1–3 days after invitation.',
    activityTimelineWithin24Hours: 'within 24 hours.',
    // Function labels for proper word order in each language
    activityTimelineAwarenessPoints: (
      userName,
      points,
      enrollmentName,
      category,
      performance,
      pointRule
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'earned' : 'lost'
      let text = `${userName} <strong>${action}</strong> <strong>${pointsAbs} points</strong> in the <strong>${enrollmentName}</strong> enrollment in the <strong>${category}</strong> category, with an enrollment performance of <strong>${performance}%</strong>`
      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = pointRule.ruleName === 'Joined After 3 Days' ? 'lost' : 'received'
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'extra'
        const prefix =
          pointRule.ruleName === 'Joined After 3 Days'
            ? ''
            : pointRule.ruleName === 'Joined 1–3 Days'
            ? ''
            : '+'
        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          ruleText = ` and <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} points</strong> for joining the training more than 3 days after the invitation.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = ` and <strong>${ruleAction}</strong> <strong>${prefix}${rulePoints} ${extra} points</strong> for joining the training 1–3 days after the invitation.`
        } else {
          ruleText = ` and <strong>${ruleAction}</strong> <strong>${prefix}${rulePoints} ${extra} points</strong> for joining the training within 24 hours of the invitation.`
        }
        text += ruleText
      } else {
        text += '.'
      }
      return text
    },
    activityTimelineCampaignPoints: (
      userName,
      points,
      campaignName,
      campaignType,
      difficulty,
      performance
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'earned' : 'lost'
      return `${userName} <strong>${action}</strong> <strong>${pointsAbs} points</strong> in the <strong>${campaignName}</strong> ${campaignType} at <strong>${difficulty}</strong> difficulty, with a campaign performance of <strong>${performance}%</strong>.`
    },
    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName} opened the email for <strong>${enrollmentName}</strong> enrollment in the <strong>${category}</strong> category.`
    },
    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      return `${userName} opened the email for <strong>${campaignName}</strong> ${campaignType} with <strong>${difficulty}</strong> difficulty.`
    },
    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      return `The <strong>${campaignName}</strong> ${campaignType} with <strong>${difficulty}</strong> difficulty has been sent to ${userName}.`
    },
    // Legacy (keeping for backward compatibility)
    activityTimelineEarnedPoints: (points) => `Earned ${points} points`,
    activityTimelineLostPoints: (points) => `Lost ${points} points`,
    activityTimelineInCampaign: 'in the',
    activityTimelinePhishingCampaign: 'phishing campaign',
    activityTimelineAtDifficulty: 'at',
    activityTimelineWithPerformance: 'with a campaign performance of',
    activityTimelineEasy: 'easy',
    activityTimelineMedium: 'medium',
    activityTimelineHard: 'hard',

    // User Menu
    userMenuEmail: 'Email:',
    userMenuDepartment: 'Department:',
    userMenuPhoneNumber: 'Phone Number:',
    userMenuPreferredLanguage: 'Preferred Language:',
    userMenuLogout: 'Logout',

    // Phishing Test Results
    phishingTestResultsTitle: 'Your Phishing Test Results',
    phishingTestResultsSubtitle:
      'Overview of your phishing activity results from the last 30 days.',
    phishingTestResultsReportedPhishingEmails: 'Reported Phishing Emails:',
    phishingTestResultsPhishingSimulations: 'Phishing Simulations:',
    phishingTestResultsDetectionAccuracy: 'Detection Accuracy:',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return 'No points earned for your reports yet.'
      }
      return `You earned +${points} points for your reports.`
    },
    phishingTestResultsLostPoints: (points) => {
      if (points === 0) {
        return 'No points lost for missed reports.'
      }
      return `You lost -${points} points for missed reports.`
    },
    phishingTestResultsAccuracyUp: (percentage) => {
      const absPercentage = Math.abs(percentage)
      if (percentage < 0) {
        return `Detection accuracy down by ${absPercentage}% from last month.`
      } else if (percentage > 0) {
        return `Detection accuracy up by ${absPercentage}% from last month.`
      }
      return 'Detection accuracy unchanged from last month.'
    },
    phishingTestResultsSuccessRate: 'success rate',

    // Activity Action Types
    actionTypeClickedTraining: 'Clicked Training',
    actionTypeEmailOpened: 'Email Opened',
    actionTypeEmailSent: 'Email Sent',
    actionTypeDownloadedPoster: 'Downloaded Poster',
    actionTypeExamPassed: 'Exam Passed',
    actionTypeClickedLink: 'Clicked Link',
    actionTypeSMSSent: 'SMS Sent',
    actionTypeOpenedAttachment: 'Opened Attachment',

    // DataTable Pagination
    dataTableRowsPerPage: 'Rows per page:',
    dataTableActions: 'Actions',
    dataTablePaginationOf: 'of'
  },
  'tr-TR': {
    // Header
    welcomeTitle: (name) => `${name}, Güvenlik Gelişim Paneline Hoş Geldiniz!`,
    welcomeDescription:
      'İlerlemenizi takip edin ve eylemlerinizin güvenlik kültürümüzü nasıl güçlendirdiğini görün.',

    // User Menu
    userMenuEmail: 'E-posta:',
    userMenuDepartment: 'Departman:',
    userMenuPhoneNumber: 'Telefon Numarası:',
    userMenuPreferredLanguage: 'Tercih Edilen Dil:',
    userMenuLogout: 'Çıkış Yap',

    // Overall Performance
    overallPerformanceTitle: 'Genel Performans',
    overallPerformanceSubtitle:
      'Son 30 gündeki performansınızı, puanlarınızı ve sıralamanızı takip edin.',
    overallPerformanceSeeRanking: 'Sıralama Detaylarını Gör',
    overallPerformancePoints: 'Puan:',
    overallPerformanceRank: 'Sıralama:',

    // Recent Badges
    recentBadgesTitle: 'Son Rozetler',
    recentBadgesSubtitle:
      'Eylemleriniz ve davranışlarınızla kazandığınız son 3 rozeti görüntüleyin.',
    recentBadgesSeeAll: 'Tüm Rozetleri Gör',
    recentBadgesNoBadges: 'Henüz kazanılmış rozet yok.',

    // Your Badges
    yourBadgesTitle: 'Rozetleriniz',
    yourBadgesSubtitle: 'Kazandığınız ve kazanabileceğiniz tüm rozetleri tek bir yerde görün.',
    yourBadgesEarnedOn: (date) => `${date} tarihinde kazanıldı`,
    yourBadgesNotEarnedYet: 'Henüz kazanılmadı',
    yourBadgesNoBadges: 'Henüz rozet bulunmuyor.',
    badgeEliteSecurityChampion: 'Elit Güvenlik Şampiyonu', // "Elite" -> "Elit"
    badgeEngagementStar: 'Katılım Yıldızı',
    badgeSecurityAmbassador: 'Güvenlik Elçisi',
    // Badge Names
    badgeName_1_0: 'İlk Eğitim Tamamlandı',
    badgeName_2_1: 'Eğitim Ustası',
    badgeName_2_2: 'Eğitim Ustası',
    badgeName_2_3: 'Eğitim Ustası',
    badgeName_3_1: 'Mükemmel Puan',
    badgeName_3_2: 'Mükemmel Puan',
    badgeName_3_3: 'Mükemmel Puan',
    badgeName_5_1: 'Güvenlik Şampiyonu',
    badgeName_5_2: 'Güvenlik Şampiyonu',
    badgeName_5_3: 'Güvenlik Şampiyonu',
    badgeName_6_0: 'İlk Oltalama Raporu',
    badgeName_7_1: 'Oltalama Avcısı',
    badgeName_7_2: 'Oltalama Avcısı',
    badgeName_7_3: 'Oltalama Avcısı',
    badgeName_8_1: 'Sıfır Tıklama Şampiyonu',
    badgeName_8_2: 'Sıfır Tıklama Şampiyonu',
    badgeName_8_3: 'Sıfır Tıklama Şampiyonu',
    // Badge Descriptions
    badgeDescription_1_0: 'İlk eğitiminizi tamamladığınızda kazanırsınız.',
    badgeDescription_2_1: '20 eğitimi tamamladığınızda kazanırsınız.',
    badgeDescription_2_2: '40 eğitimi tamamladığınızda kazanırsınız.',
    badgeDescription_2_3: '60 eğitimi tamamladığınızda kazanırsınız.',
    badgeDescription_3_1: '3 eğitim sınavında 100 puan aldığınızda kazanırsınız.',
    badgeDescription_3_2: '5 eğitim sınavında 100 puan aldığınızda kazanırsınız.',
    badgeDescription_3_3: '10 eğitim sınavında tutarlı olarak 100 puan aldığınızda kazanırsınız.',
    badgeDescription_5_1:
      'Liderlik tablosunda 10. sıra veya daha yüksek bir sıraya ulaştığınızda kazanırsınız.',
    badgeDescription_5_2:
      'Liderlik tablosunda 3. sıra veya daha yüksek bir sıraya ulaştığınızda kazanırsınız.',
    badgeDescription_5_3: 'Liderlik tablosunda 1. sıraya ulaştığınızda kazanırsınız.',
    badgeDescription_6_0: 'İlk oltalama e-postanızı bildirdiğinizde kazanırsınız.',
    badgeDescription_7_1: '3 oltalama e-postası bildirdiğinizde kazanırsınız.',
    badgeDescription_7_2: '10 oltalama e-postası bildirdiğinizde kazanırsınız.',
    badgeDescription_7_3: '25 oltalama e-postası bildirdiğinizde kazanırsınız.',
    badgeDescription_8_1:
      '2 kampanya boyunca herhangi bir oltalama simülasyonuna tıklamaktan başarıyla kaçındığınızda kazanırsınız.',
    badgeDescription_8_2:
      '4 kampanya boyunca herhangi bir oltalama simülasyonuna tıklamaktan başarıyla kaçındığınızda kazanırsınız.',
    badgeDescription_8_3:
      '6 kampanya boyunca herhangi bir oltalama simülasyonuna tıklamaktan başarıyla kaçındığınızda kazanırsınız.',

    // Your Learning
    yourLearningTitle: 'Eğitimleriniz', // "Öğrenmeleriniz" yerine "Eğitimleriniz" daha doğal.
    yourLearningSubtitle: 'Tamamladığınız ve size atanan tüm eğitimleri tek bir yerde görün.',
    yourLearningTrainingMaterialName: 'Eğitim Materyali Adı',
    yourLearningStartDate: 'Başlangıç Tarihi',
    yourLearningTrainingStatus: 'Eğitim Durumu',
    yourLearningCertificate: 'Sertifika',
    yourLearningPoints: 'Puan',
    yourLearningActions: 'İşlemler',
    yourLearningNotStarted: 'Başlanmadı',
    yourLearningNotCompleted: 'Tamamlanmadı',
    yourLearningCompleted: 'Tamamlandı',
    yourLearningInProgress: 'Devam Etmekte',
    yourLearningAvailable: 'Erişilebilir',
    yourLearningNotAvailable: 'Erişilemez',
    yourLearningStartTraining: 'Eğitimi Başlat',
    yourLearningRedoTraining: 'Eğitimi Tekrarla',
    yourLearningMaxPoints: 'maks',
    yourLearningNoTrainingMaterials: 'Eğitim materyali bulunamadı',

    // Your Certificates
    yourCertificatesTitle: 'Sertifikalarınız',
    yourCertificatesSubtitle: 'Kazandığınız ve bekleyen tüm sertifikalarınızı tek bir yerde görün.',
    yourCertificatesCertificateName: 'Sertifika Adı',
    yourCertificatesCertificateDate: 'Sertifika Tarihi',
    yourCertificatesTrainingStatus: 'Eğitim Durumu',
    yourCertificatesActions: 'İşlemler',
    yourCertificatesNoCertificates: 'Sertifika bulunamadı',
    yourCertificatesDownloadCertificate: 'Sertifikayı İndir',
    yourCertificatesInQueue: 'Kuyrukta',

    // Leaderboard
    leaderboardTitle: 'Liderlik Tablosu',
    leaderboardSubtitle: 'Son 30 gündeki çalışan performans sıralaması.',
    leaderboardRank: 'Sıra',
    leaderboardFirstName: 'Ad',
    leaderboardLastName: 'Soyad',
    leaderboardEmail: 'E-posta',
    leaderboardDepartment: 'Departman',
    leaderboardPerformance: 'Performans',
    leaderboardTotalPoints: 'Toplam Puan',
    leaderboardEmptyMessage: 'Liderlik tablosu verisi mevcut değil.',
    leaderboardYou: 'Siz', // "Sen" yerine "Siz" daha kurumsal.

    // Activity Timeline
    activityTimelineTitle: 'Aktivite Zaman Çizelgesi',
    activityTimelineSubtitle: 'Son 30 gündeki aktivitelerinizin ve sonuçlarının zaman akışı.',
    activityTimelineLoadMore: 'Daha Fazla Aktivite Yükle',
    activityTimelineEmptyMessage: 'Son 30 günde herhangi bir aktivite bulunamadı.',

    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: 'Bildirilen e-posta',
    activityTimelineIncidentResponderSubject:
      'konusuyla Olay Müdahale Ekibi tarafından incelendi ve sonuçlandırıldı:', // Biraz daha netleştirdim.

    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `<strong>${userName}</strong> kullanıcısına, <strong>${category}</strong> kategorisindeki <strong>${enrollmentName}</strong> eğitimi için atama e-postası gönderildi.`
      }
      return `<strong>${userName}</strong> kullanıcısına <strong>${enrollmentName}</strong> eğitimi için atama e-postası gönderildi.`
    },
    activityTimelineFor: 'için',
    activityTimelineEnrollment: 'eğitim kaydı',
    activityTimelineCategory: 'kategorisinde.',

    // Neutral + Other
    activityTimelineWith: 'ile',
    activityTimelineHasBeenSentTo: 'gönderildi',

    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'seviyesinde',
    activityTimelineDifficulity: 'zorluk',

    // Opened
    activityTimelineOpenedTheEmailFor: 'için gönderilen e-postayı açtı:', // Cümle yapısını toparlamak için.
    activityTimelineDifficulty: 'zorluk derecesi.',

    // Points
    activityTimelineEarned: 'kazandı',
    activityTimelineLost: 'kaybetti',
    activityTimelinePoints: 'puan',
    activityTimelineInThe: 'içinde',
    activityTimelineWithAnEnrollmentPerformance: 'kayıt performansı ile',
    activityTimelineWithACampaignPerformance: 'kampanya performansı ile',

    // Point Rule
    activityTimelineAnd: 've',
    activityTimelineReceived: 'aldı',
    activityTimelineExtra: 'ekstra',
    activityTimelineForJoiningTheTraining: 'eğitime katıldığı için',
    activityTimelineMoreThan3Days: 'davetten 3 günden fazla süre sonra.',
    activityTimeline1To3Days: 'davetten 1–3 gün sonra.',
    activityTimelineWithin24Hours: '24 saat içinde.',

    // Function labels for proper word order in each language
    // BURASI ÇOK ÖNEMLİ: Türkçe cümle yapısına (SOV) göre yeniden kurgulandı.
    activityTimelineAwarenessPoints: (
      userName,
      points,
      enrollmentName,
      category,
      performance,
      pointRule
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'kazandı' : 'kaybetti'

      // Cümle yapısı: [Kullanıcı], [Kategori] kategorisindeki [Eğitim] eğitiminde %X başarı göstererek Y puan [kazandı/kaybetti].
      let text = `${userName}, <strong>${category}</strong> kategorisindeki <strong>${enrollmentName}</strong> eğitiminde <strong>%${performance}</strong> performans göstererek <strong>${pointsAbs} puan</strong> <strong>${action}</strong>`

      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = pointRule.ruleName === 'Joined After 3 Days' ? 'kaybetti' : 'aldı' // received -> aldı
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'ekstra'

        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          ruleText = `; ayrıca davetten 3 günden fazla süre sonra katıldığı için <strong>${rulePoints} puan</strong> <strong>${ruleAction}</strong>.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = `; ayrıca davetten 1–3 gün sonra katıldığı için <strong>${rulePoints} ${extra} puan</strong> <strong>${ruleAction}</strong>.`
        } else {
          ruleText = `; ayrıca davetten sonraki 24 saat içinde katıldığı için <strong>${rulePoints} ${extra} puan</strong> <strong>${ruleAction}</strong>.`
        }
        text += ruleText
      } else {
        text += '.'
      }
      return text
    },

    activityTimelineCampaignPoints: (
      userName,
      points,
      campaignName,
      campaignType,
      difficulty,
      performance
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'kazandı' : 'kaybetti'

      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()

      const campaignTypeMap = {
        phishing: 'oltalama',
        smishing: 'smishing',
        vishing: 'vishing',
        callback: 'geri arama',
        quishing: 'quishing'
      }
      const campaignTypeTR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      // Cümle: [Kullanıcı], [Zorluk] seviyesindeki [İsim] [Tür] kampanyasında, %X performans ile Y puan [kazandı/kaybetti].
      return `${userName}, <strong>${difficulty}</strong> zorluk seviyesindeki <strong>${campaignName}</strong> ${campaignTypeTR} kampanyasında, <strong>%${performance}</strong> kampanya performansı ile <strong>${pointsAbs} puan</strong> <strong>${action}</strong>.`
    },

    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName}, <strong>${category}</strong> kategorisindeki <strong>${enrollmentName}</strong> eğitimi için gönderilen e-postayı açtı.`
    },

    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      const campaignTypeMap = {
        phishing: 'oltalama',
        smishing: 'smishing',
        vishing: 'vishing',
        callback: 'geri arama',
        quishing: 'quishing'
      }
      const campaignTypeTR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      return `${userName}, <strong>${difficulty}</strong> zorluk seviyesindeki <strong>${campaignName}</strong> ${campaignTypeTR} kampanyası e-postasını açtı.`
    },

    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      const campaignTypeMap = {
        phishing: 'oltalama',
        smishing: 'smishing',
        vishing: 'vishing',
        callback: 'geri arama',
        quishing: 'quishing'
      }
      const campaignTypeTR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      return `<strong>${difficulty}</strong> zorluk seviyesindeki <strong>${campaignName}</strong> ${campaignTypeTR} kampanyası, ${userName} kullanıcısına gönderildi.`
    },

    // Legacy (keeping for backward compatibility)
    activityTimelineEarnedPoints: (points) => `${points} puan kazanıldı`,
    activityTimelineLostPoints: (points) => `${points} puan kaybedildi`,
    activityTimelineInCampaign: 'kampanyasında',
    activityTimelinePhishingCampaign: 'oltalama',
    activityTimelineAtDifficulty: 'seviyesinde',
    activityTimelineWithPerformance: 'kampanya performansı',
    activityTimelineEasy: 'kolay',
    activityTimelineMedium: 'orta',
    activityTimelineHard: 'zor',

    // Phishing Test Results
    phishingTestResultsTitle: 'Oltalama Testi Sonuçlarınız',
    phishingTestResultsSubtitle: 'Son 30 gündeki oltalama simülasyonu aktivitelerinizin özeti.',
    phishingTestResultsReportedPhishingEmails: 'Bildirilen E-postalar:',
    phishingTestResultsPhishingSimulations: 'Oltalama Simülasyonları:',
    phishingTestResultsDetectionAccuracy: 'Tespit Doğruluğu:',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return 'Raporlamalarınızdan henüz puan kazanmadınız.'
      }
      return `Raporlamalarınız sayesinde +${points} puan kazandınız.`
    },
    phishingTestResultsLostPoints: (points) => {
      if (points === 0) {
        return 'Kaçırılan raporlar nedeniyle puan kaybı yok.'
      }
      return `Kaçırılan raporlar nedeniyle -${points} puan kaybettiniz.`
    },
    phishingTestResultsAccuracyUp: (percentage) => {
      const absPercentage = Math.abs(percentage)
      if (percentage < 0) {
        return `Tespit doğruluğu geçen aya göre %${absPercentage} düştü.`
      } else if (percentage > 0) {
        return `Tespit doğruluğu geçen aya göre %${absPercentage} arttı.`
      }
      return 'Tespit doğruluğu geçen ayla aynı.'
    },
    phishingTestResultsSuccessRate: 'başarı oranı',

    // Activity Action Types
    actionTypeClickedTraining: 'Eğitime Tıklandı',
    actionTypeEmailOpened: 'E-posta Açıldı',
    actionTypeEmailSent: 'E-posta Gönderildi',
    actionTypeDownloadedPoster: 'Poster İndirildi',
    actionTypeExamPassed: 'Sınav Geçildi',
    actionTypeClickedLink: 'Bağlantıya Tıklandı',
    actionTypeSMSSent: 'SMS Gönderildi',
    actionTypeOpenedAttachment: 'Ek Dosya Açıldı', // "Ek Açıldı" yerine daha net.

    // DataTable Pagination
    dataTableRowsPerPage: 'Sayfa başına satır:',
    dataTableActions: 'İşlemler',
    dataTablePaginationOf: '/'
  },
  'de-DE': {
    // Header
    welcomeTitle: (name) =>
      `Hallo ${name}, willkommen in Ihrem Sicherheits-Entwicklungs-Dashboard!`,
    welcomeDescription:
      'Verfolgen Sie Ihren Fortschritt und sehen Sie, wie Ihr Handeln unsere Sicherheitskultur stärkt.',

    // User Menu
    userMenuEmail: 'E-Mail:',
    userMenuDepartment: 'Abteilung:',
    userMenuPhoneNumber: 'Telefonnummer:',
    userMenuPreferredLanguage: 'Bevorzugte Sprache:',
    userMenuLogout: 'Abmelden',

    // Overall Performance
    overallPerformanceTitle: 'Gesamtleistung',
    overallPerformanceSubtitle:
      'Überblick über Ihre Leistung, Punkte und Platzierung in den letzten 30 Tagen.',
    overallPerformanceSeeRanking: 'Ranking-Details ansehen',
    overallPerformancePoints: 'Punkte:',
    overallPerformanceRank: 'Rang:',

    // Recent Badges
    recentBadgesTitle: 'Neueste Abzeichen',
    recentBadgesSubtitle:
      'Ihre letzten 3 Abzeichen, die Sie durch Ihre Aktionen und Ihr Verhalten verdient haben.',
    recentBadgesSeeAll: 'Alle Abzeichen ansehen',
    recentBadgesNoBadges: 'Keine neuesten Abzeichen gefunden.',

    // Your Badges
    yourBadgesTitle: 'Ihre Abzeichen',
    yourBadgesSubtitle: 'Alle Ihre verdienten und verfügbaren Abzeichen auf einen Blick.',
    yourBadgesEarnedOn: (date) => `Erhalten am ${date}`,
    yourBadgesNotEarnedYet: 'Noch nicht erhalten',
    yourBadgesNoBadges: 'Keine Abzeichen gefunden.',
    badgeEliteSecurityChampion: 'Elite-Sicherheitschampion',
    badgeEngagementStar: 'Engagement-Stern',
    badgeSecurityAmbassador: 'Sicherheitsbotschafter',
    // Badge Names
    badgeName_1_0: 'Erste Schulung abgeschlossen',
    badgeName_2_1: 'Schulungsmeister',
    badgeName_2_2: 'Schulungsmeister',
    badgeName_2_3: 'Schulungsmeister',
    badgeName_3_1: 'Perfekte Punktzahl',
    badgeName_3_2: 'Perfekte Punktzahl',
    badgeName_3_3: 'Perfekte Punktzahl',
    badgeName_5_1: 'Sicherheitschampion',
    badgeName_5_2: 'Sicherheitschampion',
    badgeName_5_3: 'Sicherheitschampion',
    badgeName_6_0: 'Erster Phishing-Bericht',
    badgeName_7_1: 'Phishing-Jäger',
    badgeName_7_2: 'Phishing-Jäger',
    badgeName_7_3: 'Phishing-Jäger',
    badgeName_8_1: 'Null-Klick-Champion',
    badgeName_8_2: 'Null-Klick-Champion',
    badgeName_8_3: 'Null-Klick-Champion',
    // Badge Descriptions
    badgeDescription_1_0:
      'Sie erhalten dieses Abzeichen, wenn Sie Ihre erste Schulung abschließen.',
    badgeDescription_2_1: 'Sie erhalten dieses Abzeichen, wenn Sie 20 Schulungen abschließen.',
    badgeDescription_2_2: 'Sie erhalten dieses Abzeichen, wenn Sie 40 Schulungen abschließen.',
    badgeDescription_2_3: 'Sie erhalten dieses Abzeichen, wenn Sie 60 Schulungen abschließen.',
    badgeDescription_3_1:
      'Sie erhalten dieses Abzeichen, wenn Sie bei 3 Schulungsquizzen 100 Punkte erreichen.',
    badgeDescription_3_2:
      'Sie erhalten dieses Abzeichen, wenn Sie bei 5 Schulungsquizzen 100 Punkte erreichen.',
    badgeDescription_3_3:
      'Sie erhalten dieses Abzeichen, wenn Sie bei 10 Schulungsquizzen durchgehend 100 Punkte erreichen.',
    badgeDescription_5_1:
      'Sie erhalten dieses Abzeichen, wenn Sie Rang 10 oder höher in der Bestenliste erreichen.',
    badgeDescription_5_2:
      'Sie erhalten dieses Abzeichen, wenn Sie Rang 3 oder höher in der Bestenliste erreichen.',
    badgeDescription_5_3:
      'Sie erhalten dieses Abzeichen, wenn Sie Rang #1 in der Bestenliste erreichen.',
    badgeDescription_6_0:
      'Sie erhalten dieses Abzeichen, wenn Sie Ihre erste Phishing-E-Mail melden.',
    badgeDescription_7_1: 'Sie erhalten dieses Abzeichen, wenn Sie 3 Phishing-E-Mails melden.',
    badgeDescription_7_2: 'Sie erhalten dieses Abzeichen, wenn Sie 10 Phishing-E-Mails melden.',
    badgeDescription_7_3: 'Sie erhalten dieses Abzeichen, wenn Sie 25 Phishing-E-Mails melden.',
    badgeDescription_8_1:
      'Sie erhalten dieses Abzeichen, wenn Sie erfolgreich das Anklicken jeglicher Phishing-Simulationen über 2 Kampagnen vermeiden.',
    badgeDescription_8_2:
      'Sie erhalten dieses Abzeichen, wenn Sie erfolgreich das Anklicken jeglicher Phishing-Simulationen über 4 Kampagnen vermeiden.',
    badgeDescription_8_3:
      'Sie erhalten dieses Abzeichen, wenn Sie erfolgreich das Anklicken jeglicher Phishing-Simulationen über 6 Kampagnen vermeiden.',

    // Your Learning
    yourLearningTitle: 'Ihre Schulungen', // "Ihr Lernen" yerine "Schulungen" (Eğitimler) daha doğal.
    yourLearningSubtitle: 'Alle abgeschlossenen und zugewiesenen Schulungen auf einen Blick.',
    yourLearningTrainingMaterialName: 'Schulungsinhalt', // Daha kısa ve net.
    yourLearningStartDate: 'Startdatum',
    yourLearningTrainingStatus: 'Status',
    yourLearningCertificate: 'Zertifikat',
    yourLearningPoints: 'Punkte',
    yourLearningActions: 'Aktionen',
    yourLearningNotStarted: 'Nicht begonnen',
    yourLearningNotCompleted: 'Nicht abgeschlossen',
    yourLearningCompleted: 'Abgeschlossen',
    yourLearningInProgress: 'In Bearbeitung',
    yourLearningAvailable: 'Verfügbar',
    yourLearningNotAvailable: 'Nicht verfügbar',
    yourLearningStartTraining: 'Training starten',
    yourLearningRedoTraining: 'Training wiederholen',
    yourLearningMaxPoints: 'Max.',
    yourLearningNoTrainingMaterials: 'Keine Schulungsmaterialien gefunden',

    // Your Certificates
    yourCertificatesTitle: 'Ihre Zertifikate',
    yourCertificatesSubtitle: 'Alle verdienten und ausstehenden Zertifikate an einem Ort.',
    yourCertificatesCertificateName: 'Zertifikatsname',
    yourCertificatesCertificateDate: 'Ausstellungsdatum',
    yourCertificatesTrainingStatus: 'Status',
    yourCertificatesActions: 'Aktionen',
    yourCertificatesNoCertificates: 'Keine Zertifikate gefunden',
    yourCertificatesDownloadCertificate: 'Zertifikat herunterladen',
    yourCertificatesInQueue: 'In Warteschlange',

    // Leaderboard
    leaderboardTitle: 'Bestenliste',
    leaderboardSubtitle: 'Mitarbeiter-Ranking der letzten 30 Tage.',
    leaderboardRank: 'Rang',
    leaderboardFirstName: 'Vorname',
    leaderboardLastName: 'Nachname',
    leaderboardEmail: 'E-Mail',
    leaderboardDepartment: 'Abteilung',
    leaderboardPerformance: 'Leistung',
    leaderboardTotalPoints: 'Gesamtpunkte',
    leaderboardEmptyMessage: 'Keine Daten für die Bestenliste verfügbar.',
    leaderboardYou: 'Sie',

    // Activity Timeline
    activityTimelineTitle: 'Aktivitätsverlauf',
    activityTimelineSubtitle:
      'Ein Zeitstrahl Ihrer Aktivitäten und Ergebnisse der letzten 30 Tage.',
    activityTimelineLoadMore: 'Mehr Aktivitäten laden',
    activityTimelineEmptyMessage: 'Keine Aktivitäten in den letzten 30 Tagen gefunden.',

    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: 'Die gemeldete E-Mail mit dem',
    activityTimelineIncidentResponderSubject:
      'Betreff wurde vom Incident-Response-Team analysiert. Ergebnis:', // Daha teknik ve net.

    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `Eine Einladungs-E-Mail für das Training <strong>${enrollmentName}</strong> (Kategorie: <strong>${category}</strong>) wurde an <strong>${userName}</strong> gesendet.`
      }
      return `Eine Einladungs-E-Mail für das Training <strong>${enrollmentName}</strong> wurde an <strong>${userName}</strong> gesendet.`
    },
    activityTimelineFor: 'für',
    activityTimelineEnrollment: 'die Zuweisung',
    activityTimelineCategory: 'Kategorie.',

    // Neutral + Other
    activityTimelineWith: 'mit',
    activityTimelineHasBeenSentTo: 'wurde gesendet an',

    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'mit',
    activityTimelineDifficulity: 'Schwierigkeitsgrad',

    // Opened
    activityTimelineOpenedTheEmailFor: 'öffnete die E-Mail für',
    activityTimelineDifficulty: 'Schwierigkeitsgrad.',

    // Points
    activityTimelineEarned: 'verdient',
    activityTimelineLost: 'verloren',
    activityTimelinePoints: 'Punkte',
    activityTimelineInThe: 'in der',
    activityTimelineWithAnEnrollmentPerformance: 'mit einer Trainingsleistung von',
    activityTimelineWithACampaignPerformance: 'mit einer Kampagnenleistung von',

    // Point Rule
    activityTimelineAnd: 'und',
    activityTimelineReceived: 'erhalten',
    activityTimelineExtra: 'zusätzliche',
    activityTimelineForJoiningTheTraining: 'für die Teilnahme am Training',
    activityTimelineMoreThan3Days: 'mehr als 3 Tage nach der Einladung.',
    activityTimeline1To3Days: '1–3 Tage nach der Einladung.',
    activityTimelineWithin24Hours: 'innerhalb von 24 Stunden.',

    // Function labels for proper word order in each language
    // ALMANCA CÜMLE YAPISI (V2 KURALI VE PARTIZIP SONDA) İÇİN DÜZENLENDİ
    activityTimelineAwarenessPoints: (
      userName,
      points,
      enrollmentName,
      category,
      performance,
      pointRule
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'verdient' : 'verloren'

      // Almanca Yapı: [User] hat [Puan] im [Training] mit [Performans] [kazandı/kaybetti].
      let text = `${userName} hat <strong>${pointsAbs} Punkte</strong> im Training <strong>${enrollmentName}</strong> (Kategorie: <strong>${category}</strong>) mit einer Leistung von <strong>${performance}%</strong> <strong>${action}</strong>`

      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = pointRule.ruleName === 'Joined After 3 Days' ? 'verloren' : 'erhalten'
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'zusätzliche'
        // Rule prefix handled logically in German without explicit '+' usually, but included if needed contextually.

        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          ruleText = `; außerdem wurden <strong>${rulePoints} Punkte</strong> <strong>${ruleAction}</strong>, da die Teilnahme mehr als 3 Tage nach der Einladung erfolgte.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = `; außerdem wurden <strong>${rulePoints} ${extra} Punkte</strong> <strong>${ruleAction}</strong>, da die Teilnahme 1–3 Tage nach der Einladung erfolgte.`
        } else {
          ruleText = `; außerdem wurden <strong>${rulePoints} ${extra} Punkte</strong> <strong>${ruleAction}</strong>, da die Teilnahme innerhalb von 24 Stunden erfolgte.`
        }
        text += ruleText
      } else {
        text += '.'
      }
      return text
    },

    activityTimelineCampaignPoints: (
      userName,
      points,
      campaignName,
      campaignType,
      difficulty,
      performance
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'verdient' : 'verloren'

      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()

      const campaignTypeMap = {
        phishing: 'Phishing',
        smishing: 'Smishing',
        vishing: 'Vishing',
        callback: 'Rückruf', // Callback phishing -> Callback/Rückruf
        quishing: 'Quishing'
      }
      const campaignTypeDE = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      // Almanca Yapı: [User] hat [Puan] in der [Kampanya] [kazandı/kaybetti].
      return `${userName} hat <strong>${pointsAbs} Punkte</strong> in der <strong>${campaignName}</strong>-${campaignTypeDE}-Kampagne (Schwierigkeit: <strong>${difficulty}</strong>) mit einer Kampagnenleistung von <strong>${performance}%</strong> <strong>${action}</strong>.`
    },

    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName} hat die E-Mail für das Training <strong>${enrollmentName}</strong> (Kategorie: <strong>${category}</strong>) geöffnet.`
    },

    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      const campaignTypeMap = {
        phishing: 'Phishing',
        smishing: 'Smishing',
        vishing: 'Vishing',
        callback: 'Rückruf',
        quishing: 'Quishing'
      }
      const campaignTypeDE = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      return `${userName} hat die E-Mail für die <strong>${campaignName}</strong>-${campaignTypeDE}-Kampagne (Schwierigkeit: <strong>${difficulty}</strong>) geöffnet.`
    },

    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      const campaignTypeMap = {
        phishing: 'Phishing',
        smishing: 'Smishing',
        vishing: 'Vishing',
        callback: 'Rückruf',
        quishing: 'Quishing'
      }
      const campaignTypeDE = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      return `Die <strong>${campaignName}</strong>-${campaignTypeDE}-Kampagne (Schwierigkeit: <strong>${difficulty}</strong>) wurde an ${userName} gesendet.`
    },

    // Legacy (keeping for backward compatibility)
    activityTimelineEarnedPoints: (points) => `${points} Punkte verdient`,
    activityTimelineLostPoints: (points) => `${points} Punkte verloren`,
    activityTimelineInCampaign: 'in der',
    activityTimelinePhishingCampaign: 'Phishing-Kampagne',
    activityTimelineAtDifficulty: 'bei',
    activityTimelineWithPerformance: 'mit einer Leistung von',
    activityTimelineEasy: 'einfach',
    activityTimelineMedium: 'mittel',
    activityTimelineHard: 'schwer',

    // Phishing Test Results
    phishingTestResultsTitle: 'Ihre Phishing-Testergebnisse',
    phishingTestResultsSubtitle: 'Übersicht Ihrer Phishing-Aktivitäten der letzten 30 Tage.',
    phishingTestResultsReportedPhishingEmails: 'Gemeldete E-Mails:',
    phishingTestResultsPhishingSimulations: 'Phishing-Simulationen:',
    phishingTestResultsDetectionAccuracy: 'Erkennungsgenauigkeit:',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return 'Bisher keine Punkte für Meldungen erhalten.'
      }
      return `Sie haben +${points} Punkte für Ihre Meldungen erhalten.`
    },
    phishingTestResultsLostPoints: (points) => {
      if (points === 0) {
        return 'Kein Punktabzug für verpasste Meldungen.'
      }
      return `Sie haben -${points} Punkte für verpasste Meldungen verloren.`
    },
    phishingTestResultsAccuracyUp: (percentage) => {
      const absPercentage = Math.abs(percentage)
      if (percentage < 0) {
        return `Die Erkennungsgenauigkeit ist im Vergleich zum Vormonat um ${absPercentage}% gesunken.`
      } else if (percentage > 0) {
        return `Die Erkennungsgenauigkeit ist im Vergleich zum Vormonat um ${absPercentage}% gestiegen.`
      }
      return 'Die Erkennungsgenauigkeit ist unverändert.'
    },
    phishingTestResultsSuccessRate: 'Erfolgsquote',

    // Activity Action Types
    actionTypeClickedTraining: 'Training angeklickt',
    actionTypeEmailOpened: 'E-Mail geöffnet',
    actionTypeEmailSent: 'E-Mail gesendet',
    actionTypeDownloadedPoster: 'Poster heruntergeladen',
    actionTypeExamPassed: 'Prüfung bestanden',
    actionTypeClickedLink: 'Link angeklickt',
    actionTypeSMSSent: 'SMS gesendet',
    actionTypeOpenedAttachment: 'Anhang geöffnet',

    // DataTable Pagination
    dataTableRowsPerPage: 'Zeilen pro Seite:',
    dataTableActions: 'Aktionen',
    dataTablePaginationOf: 'von'
  },
  'fr-FR': {
    // Header
    welcomeTitle: (name) => `${name}, Bienvenue sur votre Tableau de Bord Sécurité et Progrès !`, // Plus percutant
    welcomeDescription:
      'Suivez vos progrès et découvrez comment vos actions renforcent notre culture de sécurité.',

    // User Menu
    userMenuEmail: 'E-mail :', // Espace avant le ":"
    userMenuDepartment: 'Département :',
    userMenuPhoneNumber: 'Numéro de téléphone :',
    userMenuPreferredLanguage: 'Langue préférée :',
    userMenuLogout: 'Déconnexion',

    // Overall Performance
    overallPerformanceTitle: 'Performance Globale',
    overallPerformanceSubtitle:
      'Suivez vos performances, points et classement pour les 30 derniers jours.',
    overallPerformanceSeeRanking: 'Voir le détail du classement',
    overallPerformancePoints: 'Points :',
    overallPerformanceRank: 'Rang :',

    // Recent Badges
    recentBadgesTitle: 'Badges Récents',
    recentBadgesSubtitle:
      'Affichez vos 3 derniers badges obtenus grâce à vos actions et comportements.',
    recentBadgesSeeAll: 'Voir tous les badges',
    recentBadgesNoBadges: 'Aucun badge récent trouvé.',

    // Your Badges
    yourBadgesTitle: 'Vos Badges',
    yourBadgesSubtitle: 'Consultez tous vos badges obtenus et disponibles ici.',
    yourBadgesEarnedOn: (date) => `Obtenu le ${date}`, // "Gagné" yerine "Obtenu"
    yourBadgesNotEarnedYet: 'Pas encore obtenu',
    yourBadgesNoBadges: 'Aucun badge trouvé.',
    badgeEliteSecurityChampion: 'Champion de Sécurité Élite',
    badgeEngagementStar: "Étoile de l'Engagement",
    badgeSecurityAmbassador: 'Ambassadeur de Sécurité',
    // Badge Names
    badgeName_1_0: 'Première Formation Terminée',
    badgeName_2_1: 'Maître de la Formation',
    badgeName_2_2: 'Maître de la Formation',
    badgeName_2_3: 'Maître de la Formation',
    badgeName_3_1: 'Score Parfait',
    badgeName_3_2: 'Score Parfait',
    badgeName_3_3: 'Score Parfait',
    badgeName_5_1: 'Champion de Sécurité',
    badgeName_5_2: 'Champion de Sécurité',
    badgeName_5_3: 'Champion de Sécurité',
    badgeName_6_0: 'Premier Signalement de Hameçonnage',
    badgeName_7_1: 'Chasseur de Hameçonnage',
    badgeName_7_2: 'Chasseur de Hameçonnage',
    badgeName_7_3: 'Chasseur de Hameçonnage',
    badgeName_8_1: 'Champion Zéro Clic',
    badgeName_8_2: 'Champion Zéro Clic',
    badgeName_8_3: 'Champion Zéro Clic',
    // Badge Descriptions
    badgeDescription_1_0: 'Vous obtenez ce badge lorsque vous terminez votre première formation.',
    badgeDescription_2_1: 'Vous obtenez ce badge lorsque vous terminez 20 formations.',
    badgeDescription_2_2: 'Vous obtenez ce badge lorsque vous terminez 40 formations.',
    badgeDescription_2_3: 'Vous obtenez ce badge lorsque vous terminez 60 formations.',
    badgeDescription_3_1:
      'Vous obtenez ce badge lorsque vous obtenez 100 points sur 3 quiz de formation.',
    badgeDescription_3_2:
      'Vous obtenez ce badge lorsque vous obtenez 100 points sur 5 quiz de formation.',
    badgeDescription_3_3:
      'Vous obtenez ce badge lorsque vous obtenez systématiquement 100 points sur 10 quiz de formation.',
    badgeDescription_5_1:
      'Vous obtenez ce badge lorsque vous atteignez le rang 10 ou plus sur le classement.',
    badgeDescription_5_2:
      'Vous obtenez ce badge lorsque vous atteignez le rang 3 ou plus sur le classement.',
    badgeDescription_5_3:
      'Vous obtenez ce badge lorsque vous devenez le rang #1 sur le classement.',
    badgeDescription_6_0:
      'Vous obtenez ce badge lorsque vous signalez votre premier e-mail de hameçonnage.',
    badgeDescription_7_1: 'Vous obtenez ce badge lorsque vous signalez 3 e-mails de hameçonnage.',
    badgeDescription_7_2: 'Vous obtenez ce badge lorsque vous signalez 10 e-mails de hameçonnage.',
    badgeDescription_7_3: 'Vous obtenez ce badge lorsque vous signalez 25 e-mails de hameçonnage.',
    badgeDescription_8_1:
      'Vous obtenez ce badge lorsque vous évitez avec succès de cliquer sur toute simulation de hameçonnage sur 2 campagnes.',
    badgeDescription_8_2:
      'Vous obtenez ce badge lorsque vous évitez avec succès de cliquer sur toute simulation de hameçonnage sur 4 campagnes.',
    badgeDescription_8_3:
      'Vous obtenez ce badge lorsque vous évitez avec succès de cliquer sur toute simulation de hameçonnage sur 6 campagnes.',

    // Your Learning
    yourLearningTitle: 'Vos Formations', // "Votre apprentissage" yerine daha kurumsal
    yourLearningSubtitle:
      'Consultez toutes vos formations terminées et assignées en un seul endroit.',
    yourLearningTrainingMaterialName: 'Nom du Module', // Plus concis
    yourLearningStartDate: 'Date de Début',
    yourLearningTrainingStatus: 'Statut',
    yourLearningCertificate: 'Certificat',
    yourLearningPoints: 'Points',
    yourLearningActions: 'Actions',
    yourLearningNotStarted: 'Non démarré',
    yourLearningNotCompleted: 'Non terminé',
    yourLearningCompleted: 'Terminé',
    yourLearningInProgress: 'En Cours',
    yourLearningAvailable: 'Disponible',
    yourLearningNotAvailable: 'Non disponible',
    yourLearningStartTraining: 'Démarrer la formation',
    yourLearningRedoTraining: 'Refaire la formation',
    yourLearningMaxPoints: 'max',
    yourLearningNoTrainingMaterials: 'Aucun module de formation trouvé',

    // Your Certificates
    yourCertificatesTitle: 'Vos Certificats',
    yourCertificatesSubtitle:
      'Consultez tous vos certificats obtenus et en attente en un seul endroit.',
    yourCertificatesCertificateName: 'Nom du certificat',
    yourCertificatesCertificateDate: 'Date du certificat',
    yourCertificatesTrainingStatus: 'Statut de la formation',
    yourCertificatesActions: 'Actions',
    yourCertificatesNoCertificates: 'Aucun certificat trouvé',
    yourCertificatesDownloadCertificate: 'Télécharger le certificat',
    yourCertificatesInQueue: 'En attente',

    // Leaderboard
    leaderboardTitle: 'Classement',
    leaderboardSubtitle: 'Classement des performances des employés au cours des 30 derniers jours.',
    leaderboardRank: 'Rang',
    leaderboardFirstName: 'Prénom',
    leaderboardLastName: 'Nom',
    leaderboardEmail: 'E-mail',
    leaderboardDepartment: 'Département',
    leaderboardPerformance: 'Performance',
    leaderboardTotalPoints: 'Total des points',
    leaderboardEmptyMessage: 'Aucune donnée de classement disponible.',
    leaderboardYou: 'Vous',

    // Activity Timeline
    activityTimelineTitle: 'Historique des Activités', // Plus naturel
    activityTimelineSubtitle:
      'Chronologie de vos activités récentes et de leurs résultats au cours des 30 derniers jours.',
    activityTimelineLoadMore: "Charger plus d'activités",
    activityTimelineEmptyMessage: 'Aucune activité trouvée au cours des 30 derniers jours.',

    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: "L'e-mail signalé avec pour",
    activityTimelineIncidentResponderSubject:
      "objet a été analysé par l'équipe de réponse aux incidents, avec le résultat :", // Terme amélioré

    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `Un e-mail d'assignation a été envoyé à ${userName} pour la formation <strong>${enrollmentName}</strong> de la catégorie <strong>${category}</strong>.`
      }
      return `Un e-mail d'assignation a été envoyé à ${userName} pour la formation <strong>${enrollmentName}</strong>.`
    },
    activityTimelineFor: 'pour',
    activityTimelineEnrollment: 'assignation dans la',
    activityTimelineCategory: 'catégorie.',

    // Neutral + Other
    activityTimelineWith: 'avec',
    activityTimelineHasBeenSentTo: 'a été envoyé à',

    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'au niveau de',
    activityTimelineDifficulity: 'difficulté',

    // Opened
    activityTimelineOpenedTheEmailFor: "a ouvert l'e-mail pour",
    activityTimelineDifficulty: 'difficulté.',

    // Points
    activityTimelineEarned: 'gagné',
    activityTimelineLost: 'perdu',
    activityTimelinePoints: 'points',
    activityTimelineInThe: 'dans la',
    activityTimelineWithAnEnrollmentPerformance: 'avec une performance de formation de',
    activityTimelineWithACampaignPerformance: 'avec une performance de campagne de',

    // Point Rule
    activityTimelineAnd: 'et',
    activityTimelineReceived: 'reçu',
    activityTimelineExtra: 'supplémentaires',
    activityTimelineForJoiningTheTraining: 'pour avoir participé à la formation',
    activityTimelineMoreThan3Days: "plus de 3 jours après l'invitation.",
    activityTimeline1To3Days: "1 à 3 jours après l'invitation.",
    activityTimelineWithin24Hours: 'dans les 24 heures.',

    // Function labels for proper word order in each language
    activityTimelineAwarenessPoints: (
      userName,
      points,
      enrollmentName,
      category,
      performance,
      pointRule
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'gagné' : 'perdu'
      // Structure: [User] a [action] [points] dans [module] [performance]
      let text = `${userName} a <strong>${action}</strong> <strong>${pointsAbs} points</strong> dans la formation <strong>${enrollmentName}</strong> de la catégorie <strong>${category}</strong>, avec une performance de <strong>${performance}%</strong>`
      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = points > 0 ? 'reçu' : 'perdu'
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'supplémentaires'
        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          // Si points perdus, kural da puan kaybettirir, o zaman 'perdu' olmalı.
          const finalRuleAction = rulePoints > 0 && points < 0 ? 'perdu' : ruleAction
          ruleText = ` et a <strong>${finalRuleAction}</strong> <strong>${rulePoints} points</strong> car la participation a eu lieu plus de 3 jours après l'invitation.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = ` et a <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} points</strong> pour avoir participé 1 à 3 jours après l'invitation.`
        } else {
          ruleText = ` et a <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} points</strong> pour avoir participé dans les 24 heures suivant l'invitation.`
        }
        text += ruleText
      } else {
        text += '.'
      }
      return text
    },

    activityTimelineCampaignPoints: (
      userName,
      points,
      campaignName,
      campaignType,
      difficulty,
      performance
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'gagné' : 'perdu'

      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      const campaignTypeMap = {
        phishing: 'hameçonnage',
        smishing: 'smishing',
        vishing: 'vishing',
        callback: 'rappel',
        quishing: 'quishing'
      }
      const campaignTypeFR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      // Structure: [User] a [action] [points] dans la campagne [type] [difficulty] [performance]
      return `${userName} a <strong>${action}</strong> <strong>${pointsAbs} points</strong> dans la campagne <strong>${campaignName}</strong> d'<strong>${campaignTypeFR}</strong> de difficulté <strong>${difficulty}</strong>, avec une performance de campagne de <strong>${performance}%</strong>.`
    },

    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName} a ouvert l'e-mail pour la formation <strong>${enrollmentName}</strong> de la catégorie <strong>${category}</strong>.`
    },

    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      const campaignTypeMap = {
        phishing: 'hameçonnage',
        smishing: 'smishing',
        vishing: 'vishing',
        callback: 'rappel',
        quishing: 'quishing'
      }
      const campaignTypeFR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      return `${userName} a ouvert l'e-mail pour la campagne <strong>${campaignName}</strong> d'<strong>${campaignTypeFR}</strong> de difficulté <strong>${difficulty}</strong>.`
    },

    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      const campaignTypeMap = {
        phishing: 'hameçonnage',
        smishing: 'smishing',
        vishing: 'vishing',
        callback: 'rappel',
        quishing: 'quishing'
      }
      const campaignTypeFR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      return `La campagne <strong>${campaignName}</strong> d'<strong>${campaignTypeFR}</strong> de difficulté <strong>${difficulty}</strong> a été envoyée à ${userName}.`
    },

    // Legacy (keeping for backward compatibility)
    activityTimelineEarnedPoints: (points) => `Gagné ${points} points`,
    activityTimelineLostPoints: (points) => `Perdu ${points} points`,
    activityTimelineInCampaign: 'dans la',
    activityTimelinePhishingCampaign: "campagne d'hameçonnage",
    activityTimelineAtDifficulty: 'à',
    activityTimelineWithPerformance: 'avec une performance de campagne de',
    activityTimelineEasy: 'facile',
    activityTimelineMedium: 'moyen',
    activityTimelineHard: 'difficile',

    // Phishing Test Results
    phishingTestResultsTitle: "Vos Résultats de Test d'Hameçonnage",
    phishingTestResultsSubtitle:
      "Aperçu des résultats de vos activités d'hameçonnage des 30 derniers jours.",
    phishingTestResultsReportedPhishingEmails: 'E-mails signalés :',
    phishingTestResultsPhishingSimulations: "Simulations d'hameçonnage :",
    phishingTestResultsDetectionAccuracy: 'Précision de détection :',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return "Vous n'avez encore gagné aucun point pour vos rapports."
      }
      return `Vous avez gagné +${points} points pour vos rapports.`
    },
    phishingTestResultsLostPoints: (points) => {
      if (points === 0) {
        return "Vous n'avez perdu aucun point pour les rapports manqués."
      }
      return `Vous avez perdu -${points} points pour les rapports manqués.`
    },
    phishingTestResultsAccuracyUp: (percentage) => {
      const absPercentage = Math.abs(percentage)
      if (percentage < 0) {
        return `La précision de détection a diminué de ${absPercentage}% par rapport au mois dernier.`
      } else if (percentage > 0) {
        return `La précision de détection a augmenté de ${absPercentage}% par rapport au mois dernier.`
      }
      return 'La précision de détection est inchangée par rapport au mois dernier.'
    },
    phishingTestResultsSuccessRate: 'taux de réussite',

    // Activity Action Types
    actionTypeClickedTraining: 'Formation cliquée',
    actionTypeEmailOpened: 'E-mail ouvert',
    actionTypeEmailSent: 'E-mail envoyé',
    actionTypeDownloadedPoster: 'Affiche téléchargée',
    actionTypeExamPassed: 'Examen réussi',
    actionTypeClickedLink: 'Lien cliqué',
    actionTypeSMSSent: 'SMS envoyé',
    actionTypeOpenedAttachment: 'Pièce jointe ouverte',

    // DataTable Pagination
    dataTableRowsPerPage: 'Lignes par page :',
    dataTableActions: 'Actions',
    dataTablePaginationOf: 'sur'
  },
  'es-ES': {
    // Header
    welcomeTitle: (name) => `${name}, ¡Bienvenido a su Panel de Progreso de Seguridad!`, // Más fluido y profesional
    welcomeDescription:
      'Siga su progreso y observe cómo sus acciones fortalecen nuestra cultura de seguridad.',

    // User Menu
    userMenuEmail: 'Correo electrónico:',
    userMenuDepartment: 'Departamento:',
    userMenuPhoneNumber: 'Número de teléfono:',
    userMenuPreferredLanguage: 'Idioma preferido:',
    userMenuLogout: 'Cerrar sesión',

    // Overall Performance
    overallPerformanceTitle: 'Rendimiento General',
    overallPerformanceSubtitle: 'Siga su rendimiento, puntos y posición de los últimos 30 días.',
    overallPerformanceSeeRanking: 'Ver detalles de la clasificación',
    overallPerformancePoints: 'Puntos:',
    overallPerformanceRank: 'Posición:', // 'Clasificación' es correcto, pero 'Posición' más común en rankings

    // Recent Badges
    recentBadgesTitle: 'Insignias Recientes',
    recentBadgesSubtitle:
      'Vea sus últimas 3 insignias obtenidas por sus acciones y comportamientos.',
    recentBadgesSeeAll: 'Ver todas las insignias',
    recentBadgesNoBadges: 'No se encontraron insignias recientes.',

    // Your Badges
    yourBadgesTitle: 'Sus Insignias',
    yourBadgesSubtitle: 'Vea todas sus insignias obtenidas y disponibles en un solo lugar.',
    yourBadgesEarnedOn: (date) => `Obtenida el ${date}`, // Corregido género si la insignia es 'La Insignia'
    yourBadgesNotEarnedYet: 'Aún no obtenida',
    yourBadgesNoBadges: 'No se encontraron insignias.',
    badgeEliteSecurityChampion: 'Campeón de Seguridad Élite',
    badgeEngagementStar: 'Estrella del Compromiso', // Mejor flujo con 'del'
    badgeSecurityAmbassador: 'Embajador de Seguridad',
    // Badge Names
    badgeName_1_0: 'Primera Formación Completada',
    badgeName_2_1: 'Maestro de Formación',
    badgeName_2_2: 'Maestro de Formación',
    badgeName_2_3: 'Maestro de Formación',
    badgeName_3_1: 'Puntuación Perfecta',
    badgeName_3_2: 'Puntuación Perfecta',
    badgeName_3_3: 'Puntuación Perfecta',
    badgeName_5_1: 'Campeón de Seguridad',
    badgeName_5_2: 'Campeón de Seguridad',
    badgeName_5_3: 'Campeón de Seguridad',
    badgeName_6_0: 'Primer Reporte de Phishing',
    badgeName_7_1: 'Cazador de Phishing',
    badgeName_7_2: 'Cazador de Phishing',
    badgeName_7_3: 'Cazador de Phishing',
    badgeName_8_1: 'Campeón Cero Clic',
    badgeName_8_2: 'Campeón Cero Clic',
    badgeName_8_3: 'Campeón Cero Clic',
    // Badge Descriptions
    badgeDescription_1_0: 'La obtienes cuando completas tu primera formación.',
    badgeDescription_2_1: 'La obtienes cuando completas 20 formaciones.',
    badgeDescription_2_2: 'La obtienes cuando completas 40 formaciones.',
    badgeDescription_2_3: 'La obtienes cuando completas 60 formaciones.',
    badgeDescription_3_1: 'La obtienes cuando obtienes 100 puntos en 3 cuestionarios de formación.',
    badgeDescription_3_2: 'La obtienes cuando obtienes 100 puntos en 5 cuestionarios de formación.',
    badgeDescription_3_3:
      'La obtienes cuando obtienes consistentemente 100 puntos en 10 cuestionarios de formación.',
    badgeDescription_5_1: 'La obtienes cuando alcanzas el Rango 10 o superior en la clasificación.',
    badgeDescription_5_2: 'La obtienes cuando alcanzas el Rango 3 o superior en la clasificación.',
    badgeDescription_5_3: 'La obtienes cuando te conviertes en el Rango #1 en la clasificación.',
    badgeDescription_6_0: 'La obtienes cuando reportas tu primer correo electrónico de phishing.',
    badgeDescription_7_1: 'La obtienes cuando reportas 3 correos electrónicos de phishing.',
    badgeDescription_7_2: 'La obtienes cuando reportas 10 correos electrónicos de phishing.',
    badgeDescription_7_3: 'La obtienes cuando reportas 25 correos electrónicos de phishing.',
    badgeDescription_8_1:
      'La obtienes cuando evitas con éxito hacer clic en cualquier simulación de phishing a través de 2 campañas.',
    badgeDescription_8_2:
      'La obtienes cuando evitas con éxito hacer clic en cualquier simulación de phishing a través de 4 campañas.',
    badgeDescription_8_3:
      'La obtienes cuando evitas con éxito hacer clic en cualquier simulación de phishing a través de 6 campañas.',

    // Your Learning
    yourLearningTitle: 'Sus Formaciones', // 'Aprendizaje' es demasiado literal.
    yourLearningSubtitle: 'Vea todos sus cursos completados y asignados en un solo lugar.',
    yourLearningTrainingMaterialName: 'Nombre del Módulo', // Más conciso
    yourLearningStartDate: 'Fecha de Inicio',
    yourLearningTrainingStatus: 'Estado del Curso',
    yourLearningCertificate: 'Certificado',
    yourLearningPoints: 'Puntos',
    yourLearningActions: 'Acciones',
    yourLearningNotStarted: 'No iniciado',
    yourLearningNotCompleted: 'No completado',
    yourLearningCompleted: 'Completado',
    yourLearningInProgress: 'En Progreso',
    yourLearningAvailable: 'Disponible',
    yourLearningNotAvailable: 'No disponible',
    yourLearningStartTraining: 'Iniciar Curso',
    yourLearningRedoTraining: 'Repetir Curso', // Más natural que 'Rehacer'
    yourLearningMaxPoints: 'máx.', // Añadida tilde
    yourLearningNoTrainingMaterials: 'No se encontraron materiales de formación',

    // Your Certificates
    yourCertificatesTitle: 'Sus Certificados',
    yourCertificatesSubtitle: 'Vea todos sus certificados obtenidos y pendientes en un solo lugar.',
    yourCertificatesCertificateName: 'Nombre del certificado',
    yourCertificatesCertificateDate: 'Fecha del certificado',
    yourCertificatesTrainingStatus: 'Estado del Curso',
    yourCertificatesActions: 'Acciones',
    yourCertificatesNoCertificates: 'No se encontraron certificados',
    yourCertificatesDownloadCertificate: 'Descargar certificado',
    yourCertificatesInQueue: 'En cola',

    // Leaderboard
    leaderboardTitle: 'Clasificación',
    leaderboardSubtitle: 'Clasificaciones de rendimiento de los empleados en los últimos 30 días.',
    leaderboardRank: 'Rango',
    leaderboardFirstName: 'Nombre',
    leaderboardLastName: 'Apellido',
    leaderboardEmail: 'Correo electrónico',
    leaderboardDepartment: 'Departamento',
    leaderboardPerformance: 'Rendimiento',
    leaderboardTotalPoints: 'Puntos totales',
    leaderboardEmptyMessage: 'No hay datos de clasificación disponibles.',
    leaderboardYou: 'Usted', // Coherencia con el tono formal

    // Activity Timeline
    activityTimelineTitle: 'Su Historial de Actividad', // Más natural
    activityTimelineSubtitle:
      'Una cronología de sus actividades recientes y sus resultados de los últimos 30 días.',
    activityTimelineLoadMore: 'Cargar más actividades',
    activityTimelineEmptyMessage: 'No se encontraron actividades en los últimos 30 días.',

    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: 'El correo electrónico reportado con el',
    activityTimelineIncidentResponderSubject:
      'asunto fue analizado por el equipo de respuesta a incidentes y resultó en:', // Mejor término y puntuación

    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `Se ha enviado un correo electrónico de asignación a ${userName} para el curso <strong>${enrollmentName}</strong> de la categoría <strong>${category}</strong>.` // Usando 'asignación' y 'curso'
      }
      return `Se ha enviado un correo electrónico de asignación a ${userName} para el curso <strong>${enrollmentName}</strong>.`
    },
    activityTimelineFor: 'para',
    activityTimelineEnrollment: 'asignación del curso en la',
    activityTimelineCategory: 'categoría.',

    // Neutral + Other
    activityTimelineWith: 'con',
    activityTimelineHasBeenSentTo: 'ha sido enviado a',

    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'en',
    activityTimelineDifficulity: 'dificultad',

    // Opened
    activityTimelineOpenedTheEmailFor: 'abrió el correo electrónico para',
    activityTimelineDifficulty: 'dificultad.',

    // Points
    activityTimelineEarned: 'ganó',
    activityTimelineLost: 'perdió',
    activityTimelinePoints: 'puntos',
    activityTimelineInThe: 'en la',
    activityTimelineWithAnEnrollmentPerformance: 'con un rendimiento en el curso del',
    activityTimelineWithACampaignPerformance: 'con un rendimiento en la campaña del',

    // Point Rule
    activityTimelineAnd: 'y',
    activityTimelineReceived: 'recibió',
    activityTimelineExtra: 'adicionales', // 'Extra' es correcto, pero 'adicionales' es más formal.
    activityTimelineForJoiningTheTraining: 'por unirse al curso',
    activityTimelineMoreThan3Days: 'más de 3 días después de la invitación.',
    activityTimeline1To3Days: '1 a 3 días después de la invitación.',
    activityTimelineWithin24Hours: 'dentro de las 24 horas.',

    // Function labels for proper word order in each language
    // SINTAXIS MEJORADA PARA FLUIDEZ EN ESPAÑOL
    activityTimelineAwarenessPoints: (
      userName,
      points,
      enrollmentName,
      category,
      performance,
      pointRule
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'ganó' : 'perdió'
      // Estructura: [User] [acción] [puntos] en el curso [nombre] [categoría] con un rendimiento del [porcentaje]
      let text = `${userName} <strong>${action}</strong> <strong>${pointsAbs} puntos</strong> en el curso <strong>${enrollmentName}</strong> de la categoría <strong>${category}</strong>, con un rendimiento del <strong>${performance}%</strong>`
      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = pointRule.ruleName === 'Joined After 3 Days' ? 'perdió' : 'recibió'
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'adicionales'
        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          ruleText = ` y <strong>${ruleAction}</strong> <strong>${rulePoints} puntos</strong> por participar en el curso más de 3 días después de la invitación.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = ` y <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} puntos</strong> por participar 1 a 3 días después de la invitación.`
        } else {
          ruleText = ` y <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} puntos</strong> por participar dentro de las 24 horas posteriores a la invitación.`
        }
        text += ruleText
      } else {
        text += '.'
      }
      return text
    },

    activityTimelineCampaignPoints: (
      userName,
      points,
      campaignName,
      campaignType,
      difficulty,
      performance
    ) => {
      const pointsAbs = Math.abs(points)
      const action = points > 0 ? 'ganó' : 'perdió'

      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()

      const campaignTypeMap = {
        phishing: 'phishing',
        smishing: 'smishing',
        vishing: 'vishing',
        callback: 'llamada de retorno', // Más claro
        quishing: 'quishing'
      }
      const campaignTypeES = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      return `${userName} <strong>${action}</strong> <strong>${pointsAbs} puntos</strong> en la campaña <strong>${campaignName}</strong> de <strong>${campaignTypeES}</strong> de dificultad <strong>${difficulty}</strong>, con un rendimiento en la campaña del <strong>${performance}%</strong>.`
    },

    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName} abrió el correo electrónico para el curso <strong>${enrollmentName}</strong> de la categoría <strong>${category}</strong>.`
    },

    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      const campaignTypeMap = {
        phishing: 'phishing',
        smishing: 'smishing',
        vishing: 'vishing',
        callback: 'llamada de retorno',
        quishing: 'quishing'
      }
      const campaignTypeES = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      return `${userName} abrió el correo electrónico para la campaña <strong>${campaignName}</strong> de <strong>${campaignTypeES}</strong> de dificultad <strong>${difficulty}</strong>.`
    },

    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      const campaignTypeMap = {
        phishing: 'phishing',
        smishing: 'smishing',
        vishing: 'vishing',
        callback: 'llamada de retorno',
        quishing: 'quishing'
      }
      const campaignTypeES = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean

      return `La campaña <strong>${campaignName}</strong> de <strong>${campaignTypeES}</strong> de dificultad <strong>${difficulty}</strong> ha sido enviada a ${userName}.`
    },

    // Legacy (keeping for backward compatibility)
    activityTimelineEarnedPoints: (points) => `Ganó ${points} puntos`,
    activityTimelineLostPoints: (points) => `Perdió ${points} puntos`,
    activityTimelineInCampaign: 'en la',
    activityTimelinePhishingCampaign: 'campaña de phishing',
    activityTimelineAtDifficulty: 'a',
    activityTimelineWithPerformance: 'con un rendimiento de campaña de',
    activityTimelineEasy: 'fácil',
    activityTimelineMedium: 'medio',
    activityTimelineHard: 'difícil',

    // Phishing Test Results
    phishingTestResultsTitle: 'Sus Resultados de Prueba de Phishing',
    phishingTestResultsSubtitle:
      'Resumen de los resultados de su actividad de phishing de los últimos 30 días.',
    phishingTestResultsReportedPhishingEmails: 'Correos electrónicos reportados:', // Más conciso
    phishingTestResultsPhishingSimulations: 'Simulaciones de Phishing:',
    phishingTestResultsDetectionAccuracy: 'Precisión de Detección:',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return 'Aún no ha ganado puntos por sus reportes.'
      }
      return `Ganó +${points} puntos por sus reportes.`
    },
    phishingTestResultsLostPoints: (points) => {
      if (points === 0) {
        return 'No perdió puntos por reportes omitidos.' // Más natural
      }
      return `Perdió -${points} puntos por reportes omitidos.`
    },
    phishingTestResultsAccuracyUp: (percentage) => {
      const absPercentage = Math.abs(percentage)
      if (percentage < 0) {
        return `La precisión de detección disminuyó un ${absPercentage}% con respecto al mes pasado.`
      } else if (percentage > 0) {
        return `La precisión de detección aumentó un ${absPercentage}% con respecto al mes pasado.`
      }
      return 'La precisión de detección no cambió con respecto al mes pasado.'
    },
    phishingTestResultsSuccessRate: 'tasa de éxito',

    // Activity Action Types
    actionTypeClickedTraining: 'Curso clicado',
    actionTypeEmailOpened: 'Correo electrónico abierto',
    actionTypeEmailSent: 'Correo electrónico enviado',
    actionTypeDownloadedPoster: 'Póster descargado',
    actionTypeExamPassed: 'Examen aprobado',
    actionTypeClickedLink: 'Enlace clicado',
    actionTypeSMSSent: 'SMS enviado',
    actionTypeOpenedAttachment: 'Archivo adjunto abierto', // Más completo

    // DataTable Pagination
    dataTableRowsPerPage: 'Filas por página:',
    dataTableActions: 'Acciones',
    dataTablePaginationOf: 'de'
  }
}

/**
 * Get label for current language
 * @param {string} language - Language code (e.g., 'en-US', 'tr-TR')
 * @param {string} key - Label key
 * @param {...any} args - Additional arguments for function labels
 * @returns {string} Translated label
 */
export function getUsersDashboardLabel(language, key, ...args) {
  const langLabels = usersDashboardLabels[language] || usersDashboardLabels['en-GB']
  const label = langLabels[key]

  if (typeof label === 'function') {
    return label(...args)
  }

  return label || key
}

export default usersDashboardLabels
