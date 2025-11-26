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

    // Your Badges
    yourBadgesTitle: 'Your Badges',
    yourBadgesSubtitle: 'See all your earned and available badges in one place.',
    yourBadgesEarnedOn: (date) => `Earned on ${date}`,
    yourBadgesNotEarnedYet: 'Not earned yet',
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
    yourLearningAvailable: 'Available',
    yourLearningNotAvailable: 'Not Available',
    yourLearningStartTraining: 'Start Training',
    yourLearningRedoTraining: 'Redo Training',
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
    activityTimelineEmptyMessage: 'No activities found.',
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
    activityTimelineDifficulity: 'difficulity',
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
    actionTypeOpenedAttachment: 'Opened Attachment'
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

    // Your Badges
    yourBadgesTitle: 'Your Badges',
    yourBadgesSubtitle: 'See all your earned and available badges in one place.',
    yourBadgesEarnedOn: (date) => `Earned on ${date}`,
    yourBadgesNotEarnedYet: 'Not earned yet',
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
    yourLearningAvailable: 'Available',
    yourLearningNotAvailable: 'Not Available',
    yourLearningStartTraining: 'Start Training',
    yourLearningRedoTraining: 'Redo Training',
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
    activityTimelineEmptyMessage: 'No activities found.',
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
    activityTimelineDifficulity: 'difficulity',
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
    actionTypeOpenedAttachment: 'Opened Attachment'
  },
  'tr-TR': {
    // Header
    welcomeTitle: (name) => `${name}, Güvenlik Gelişim Paneline Hoş Geldiniz!`,
    welcomeDescription:
      'İlerlemenizi takip edin ve eylemlerinizin güvenlik kültürümüzü nasıl güçlendirdiğini görün.',

    // Overall Performance
    overallPerformanceTitle: 'Genel Performans',
    overallPerformanceSubtitle:
      'Son 30 gündeki performansınızı, puanlarınızı ve sıralamanızı takip edin.',
    overallPerformanceSeeRanking: 'Sıralama Detaylarını Gör',
    overallPerformancePoints: 'Puan:',
    overallPerformanceRank: 'Sıra:',

    // Recent Badges
    recentBadgesTitle: 'Son Rozetler',
    recentBadgesSubtitle:
      'Eylemleriniz ve davranışlarınızdan kazandığınız son 3 rozeti görüntüleyin.',
    recentBadgesSeeAll: 'Tüm Rozetleri Gör',

    // Your Badges
    yourBadgesTitle: 'Rozetleriniz',
    yourBadgesSubtitle: 'Kazandığınız ve mevcut tüm rozetleri tek bir yerde görün.',
    yourBadgesEarnedOn: (date) => `${date} tarihinde kazanıldı`,
    yourBadgesNotEarnedYet: 'Henüz kazanılmadı',
    badgeEliteSecurityChampion: 'Elite Güvenlik Şampiyonu',
    badgeEngagementStar: 'Katılım Yıldızı',
    badgeSecurityAmbassador: 'Güvenlik Elçisi',

    // Your Learning
    yourLearningTitle: 'Öğrenmeleriniz',
    yourLearningSubtitle: 'Tamamladığınız ve atanan tüm eğitimleri tek bir yerde görün.',
    yourLearningTrainingMaterialName: 'Eğitim Materyali Adı',
    yourLearningStartDate: 'Başlangıç Tarihi',
    yourLearningTrainingStatus: 'Eğitim Durumu',
    yourLearningCertificate: 'Sertifika',
    yourLearningPoints: 'Puanlar',
    yourLearningActions: 'İşlemler',
    yourLearningNotStarted: 'Başlatılmadı',
    yourLearningNotCompleted: 'Tamamlanmadı',
    yourLearningCompleted: 'Tamamlandı',
    yourLearningAvailable: 'Mevcut',
    yourLearningNotAvailable: 'Mevcut Değil',
    yourLearningStartTraining: 'Eğitimi Başlat',
    yourLearningRedoTraining: 'Eğitimi Tekrarla',
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
    leaderboardEmptyMessage: 'Liderlik tablosu verisi bulunamadı.',
    leaderboardYou: 'Sen',

    // Activity Timeline
    activityTimelineTitle: 'Aktivite Zaman Çizelgeniz',
    activityTimelineSubtitle:
      'Son 30 gündeki son aktivitelerinizin ve sonuçlarının zaman çizelgesi.',
    activityTimelineLoadMore: 'Daha Fazla Aktivite Yükle',
    activityTimelineEmptyMessage: 'Aktivite bulunamadı.',
    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: 'Bildirilen e-posta',
    activityTimelineIncidentResponderSubject:
      ' konusu olay müdahale ekibi tarafından analiz edildi ve sonuçlandı',
    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `<strong>${userName}</strong> için <strong>${category}</strong> kategorisindeki <strong>${enrollmentName}</strong> kaydına kayıt e-postası gönderildi.`
      }
      return `<strong>${userName}</strong> için <strong>${enrollmentName}</strong> kaydına kayıt e-postası gönderildi.`
    },
    activityTimelineFor: 'için',
    activityTimelineEnrollment: 'kayıt',
    activityTimelineCategory: 'kategorisinde.',
    // Neutral + Other
    activityTimelineWith: 'ile',
    activityTimelineHasBeenSentTo: 'gönderildi',
    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'seviyesinde',
    activityTimelineDifficulity: 'zorluk',
    // Opened
    activityTimelineOpenedTheEmailFor: 'e-postasını açtı',
    activityTimelineDifficulty: 'zorluk.',
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
    activityTimelineMoreThan3Days: 'davetten 3 günden fazla sonra.',
    activityTimeline1To3Days: 'davetten 1–3 gün sonra.',
    activityTimelineWithin24Hours: '24 saat içinde.',
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
      const action = points > 0 ? 'kazandı' : 'kaybetti'
      let text = `${userName}, <strong>${category}</strong> kategorisindeki <strong>${enrollmentName}</strong> kaydında <strong>%${performance}</strong> kayıt performansı nedeniyle <strong>${pointsAbs} puan</strong> <strong>${action}</strong>`
      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = pointRule.ruleName === 'Joined After 3 Days' ? 'kaybetti' : 'aldı'
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'ekstra'
        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          ruleText = ` ve davetten 3 günden daha geç eğitime katıldığı için <strong>${rulePoints} ${extra} puan</strong> <strong>${ruleAction}</strong>.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = ` ve davetten 1–3 gün sonra eğitime katıldığı için <strong>${rulePoints} ${extra} puan</strong> <strong>${ruleAction}</strong>.`
        } else {
          ruleText = ` ve davetten 24 saat içinde eğitime katıldığı için <strong>${rulePoints} ${extra} puan</strong> <strong>${ruleAction}</strong>.`
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
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to Turkish equivalents
      const campaignTypeMap = {
        'phishing': 'oltalama',
        'smishing': 'smishing',
        'vishing': 'vishing',
        'callback': 'geri arama',
        'quishing': 'quishing'
      }
      const campaignTypeTR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `${userName}, <strong>${difficulty}</strong> zorluk seviyesindeki <strong>${campaignName}</strong> ${campaignTypeTR} kampanyasında <strong>${pointsAbs} puan</strong> <strong>${action}</strong>, kampanya performansı <strong>%${performance}</strong> ile.`
    },
    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName}, <strong>${category}</strong> kategorisindeki <strong>${enrollmentName}</strong> kaydı için e-postayı açtı.`
    },
    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to Turkish equivalents
      const campaignTypeMap = {
        'phishing': 'oltalama',
        'smishing': 'smishing',
        'vishing': 'vishing',
        'callback': 'geri arama',
        'quishing': 'quishing'
      }
      const campaignTypeTR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `${userName}, <strong>${difficulty}</strong> zorluk seviyesindeki <strong>${campaignName}</strong> ${campaignTypeTR} kampanyası için e-postayı açtı.`
    },
    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to Turkish equivalents
      const campaignTypeMap = {
        'phishing': 'oltalama',
        'smishing': 'smishing',
        'vishing': 'vishing',
        'callback': 'geri arama',
        'quishing': 'quishing'
      }
      const campaignTypeTR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `<strong>${difficulty}</strong> zorluk seviyesindeki <strong>${campaignName}</strong> ${campaignTypeTR} kampanyası ${userName} kullanıcısına gönderildi.`
    },
    // Legacy (keeping for backward compatibility)
    activityTimelineEarnedPoints: (points) => `${points} puan kazandınız`,
    activityTimelineLostPoints: (points) => `${points} puan kaybettiniz`,
    activityTimelineInCampaign: 'kampanyasında',
    activityTimelinePhishingCampaign: 'oltalama',
    activityTimelineAtDifficulty: 'zorluk seviyesinde',
    activityTimelineWithPerformance: 'kampanya performansı',
    activityTimelineEasy: 'kolay',
    activityTimelineMedium: 'orta',
    activityTimelineHard: 'zor',

    // User Menu
    userMenuEmail: 'E-posta:',
    userMenuDepartment: 'Departman:',
    userMenuPhoneNumber: 'Telefon Numarası:',
    userMenuPreferredLanguage: 'Tercih Edilen Dil:',

    // Phishing Test Results
    phishingTestResultsTitle: 'Oltalama Test Sonuçlarınız',
    phishingTestResultsSubtitle: 'Son 30 gündeki oltalama aktivite sonuçlarınızın özeti.',
    phishingTestResultsReportedPhishingEmails: 'Bildirilen Oltalama E-postaları:',
    phishingTestResultsPhishingSimulations: 'Oltalama Simülasyonları:',
    phishingTestResultsDetectionAccuracy: 'Tespit Doğruluğu:',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return 'Raporlarınız için henüz puan kazanmadınız.'
      }
      return `Raporlarınız için +${points} puan kazandınız.`
    },
    phishingTestResultsLostPoints: (points) => {
      if (points === 0) {
        return 'Kaçırılan raporlar için puan kaybetmediniz.'
      }
      return `Kaçırılan raporlar için -${points} puan kaybettiniz.`
    },
    phishingTestResultsAccuracyUp: (percentage) => {
      const absPercentage = Math.abs(percentage)
      if (percentage < 0) {
        return `Tespit doğruluğu geçen aya göre %${absPercentage} azaldı.`
      } else if (percentage > 0) {
        return `Tespit doğruluğu geçen aya göre %${absPercentage} arttı.`
      }
      return 'Tespit doğruluğu geçen aya göre değişmedi.'
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
    actionTypeOpenedAttachment: 'Ek Açıldı'
  },
  'de-DE': {
    // Header
    welcomeTitle: (name) => `${name}, willkommen in Ihrem Sicherheitswachstums-Dashboard!`,
    welcomeDescription:
      'Verfolgen Sie Ihren Fortschritt und sehen Sie, wie Ihre Aktionen unsere Sicherheitskultur stärken.',

    // Overall Performance
    overallPerformanceTitle: 'Gesamtleistung',
    overallPerformanceSubtitle:
      'Verfolgen Sie Ihre Leistung, Punkte und Rang für die letzten 30 Tage.',
    overallPerformanceSeeRanking: 'Ranking-Details anzeigen',
    overallPerformancePoints: 'Punkte:',
    overallPerformanceRank: 'Rang:',

    // Recent Badges
    recentBadgesTitle: 'Aktuelle Abzeichen',
    recentBadgesSubtitle:
      'Zeigen Sie Ihre letzten 3 Abzeichen an, die Sie durch Ihre Aktionen und Verhaltensweisen verdient haben.',
    recentBadgesSeeAll: 'Alle Abzeichen anzeigen',

    // Your Badges
    yourBadgesTitle: 'Ihre Abzeichen',
    yourBadgesSubtitle: 'Sehen Sie alle Ihre verdienten und verfügbaren Abzeichen an einem Ort.',
    yourBadgesEarnedOn: (date) => `Verdient am ${date}`,
    yourBadgesNotEarnedYet: 'Noch nicht verdient',
    badgeEliteSecurityChampion: 'Elite-Sicherheits-Champion',
    badgeEngagementStar: 'Engagement-Stern',
    badgeSecurityAmbassador: 'Sicherheits-Botschafter',

    // Your Learning
    yourLearningTitle: 'Ihr Lernen',
    yourLearningSubtitle:
      'Sehen Sie alle Ihre abgeschlossenen und zugewiesenen Schulungen an einem Ort.',
    yourLearningTrainingMaterialName: 'Schulungsmaterialname',
    yourLearningStartDate: 'Startdatum',
    yourLearningTrainingStatus: 'Schulungsstatus',
    yourLearningCertificate: 'Zertifikat',
    yourLearningPoints: 'Punkte',
    yourLearningActions: 'Aktionen',
    yourLearningNotStarted: 'Nicht gestartet',
    yourLearningNotCompleted: 'Nicht abgeschlossen',
    yourLearningCompleted: 'Abgeschlossen',
    yourLearningAvailable: 'Verfügbar',
    yourLearningNotAvailable: 'Nicht verfügbar',
    yourLearningStartTraining: 'Schulung starten',
    yourLearningRedoTraining: 'Schulung wiederholen',
    yourLearningNoTrainingMaterials: 'Keine Schulungsmaterialien gefunden',

    // Your Certificates
    yourCertificatesTitle: 'Ihre Zertifikate',
    yourCertificatesSubtitle:
      'Sehen Sie alle Ihre verdienten und ausstehenden Zertifikate an einem Ort.',
    yourCertificatesCertificateName: 'Zertifikatsname',
    yourCertificatesCertificateDate: 'Zertifikatsdatum',
    yourCertificatesTrainingStatus: 'Schulungsstatus',
    yourCertificatesActions: 'Aktionen',
    yourCertificatesNoCertificates: 'Keine Zertifikate gefunden',
    yourCertificatesDownloadCertificate: 'Zertifikat herunterladen',

    // Leaderboard
    leaderboardTitle: 'Bestenliste',
    leaderboardSubtitle: 'Mitarbeiterleistungs-Rankings der letzten 30 Tage.',
    leaderboardRank: 'Rang',
    leaderboardFirstName: 'Vorname',
    leaderboardLastName: 'Nachname',
    leaderboardEmail: 'E-Mail',
    leaderboardDepartment: 'Abteilung',
    leaderboardPerformance: 'Leistung',
    leaderboardTotalPoints: 'Gesamtpunkte',
    leaderboardEmptyMessage: 'Keine Bestenlistendaten verfügbar.',
    leaderboardYou: 'Sie',

    // Activity Timeline
    activityTimelineTitle: 'Ihre Aktivitäts-Zeitleiste',
    activityTimelineSubtitle:
      'Eine Zeitleiste Ihrer letzten Aktivitäten und ihrer Ergebnisse aus den letzten 30 Tagen.',
    activityTimelineLoadMore: 'Weitere Aktivitäten laden',
    activityTimelineEmptyMessage: 'Keine Aktivitäten gefunden.',
    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: 'Die gemeldete E-Mail mit dem',
    activityTimelineIncidentResponderSubject:
      'Betreff wurde vom Vorfallbearbeiter analysiert und führte zu',
    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `An ${userName} wurde eine Anmelde-E-Mail für die <strong>${enrollmentName}</strong>-Anmeldung in der Kategorie <strong>${category}</strong> gesendet.`
      }
      return `An ${userName} wurde eine Anmelde-E-Mail für die <strong>${enrollmentName}</strong>-Anmeldung gesendet.`
    },
    activityTimelineFor: 'für',
    activityTimelineEnrollment: 'Anmeldung in der',
    activityTimelineCategory: 'Kategorie.',
    // Neutral + Other
    activityTimelineWith: 'mit',
    activityTimelineHasBeenSentTo: 'wurde gesendet an',
    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'bei',
    activityTimelineDifficulity: 'Schwierigkeit',
    // Opened
    activityTimelineOpenedTheEmailFor: 'öffnete die E-Mail für',
    activityTimelineDifficulty: 'Schwierigkeit.',
    // Points
    activityTimelineEarned: 'verdient',
    activityTimelineLost: 'verloren',
    activityTimelinePoints: 'Punkte',
    activityTimelineInThe: 'in der',
    activityTimelineWithAnEnrollmentPerformance: 'mit einer Anmeldeleistung von',
    activityTimelineWithACampaignPerformance: 'mit einer Kampagnenleistung von',
    // Point Rule
    activityTimelineAnd: 'und',
    activityTimelineReceived: 'erhalten',
    activityTimelineExtra: 'zusätzliche',
    activityTimelineForJoiningTheTraining: 'für die Teilnahme am Training',
    activityTimelineMoreThan3Days: 'mehr als 3 Tage nach Einladung.',
    activityTimeline1To3Days: '1–3 Tage nach Einladung.',
    activityTimelineWithin24Hours: 'innerhalb von 24 Stunden.',
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
      const action = points > 0 ? 'verdient' : 'verloren'
      let text = `${userName} hat <strong>${pointsAbs} Punkte</strong> in der <strong>${enrollmentName}</strong>-Anmeldung der Kategorie <strong>${category}</strong> <strong>${action}</strong>, mit einer Anmeldeleistung von <strong>${performance}%</strong>`
      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = pointRule.ruleName === 'Joined After 3 Days' ? 'verloren' : 'erhalten'
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'zusätzliche'
        const prefix =
          pointRule.ruleName === 'Joined After 3 Days'
            ? ''
            : pointRule.ruleName === 'Joined 1–3 Days'
            ? ''
            : '+'
        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          ruleText = ` und <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} Punkte</strong>, da die Teilnahme am Training mehr als 3 Tage nach der Einladung erfolgte.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = ` und <strong>${ruleAction}</strong> <strong>${prefix}${rulePoints} ${extra} Punkte</strong>, da die Teilnahme am Training 1–3 Tage nach der Einladung erfolgte.`
        } else {
          ruleText = ` und <strong>${ruleAction}</strong> <strong>${prefix}${rulePoints} ${extra} Punkte</strong>, da die Teilnahme am Training innerhalb von 24 Stunden nach der Einladung erfolgte.`
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
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to German equivalents
      const campaignTypeMap = {
        'phishing': 'Phishing',
        'smishing': 'Smishing',
        'vishing': 'Vishing',
        'callback': 'Rückruf',
        'quishing': 'Quishing'
      }
      const campaignTypeDE = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `${userName} hat <strong>${pointsAbs} Punkte</strong> in der <strong>${campaignName}</strong> ${campaignTypeDE}-Kampagne mit <strong>${difficulty}</strong> Schwierigkeitsgrad <strong>${action}</strong>, mit einer Kampagnenleistung von <strong>${performance}%</strong>.`
    },
    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName} hat die E-Mail für die <strong>${enrollmentName}</strong>-Anmeldung der Kategorie <strong>${category}</strong> geöffnet.`
    },
    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to German equivalents
      const campaignTypeMap = {
        'phishing': 'Phishing',
        'smishing': 'Smishing',
        'vishing': 'Vishing',
        'callback': 'Rückruf',
        'quishing': 'Quishing'
      }
      const campaignTypeDE = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `${userName} hat die E-Mail für die <strong>${campaignName}</strong> ${campaignTypeDE}-Kampagne mit <strong>${difficulty}</strong> Schwierigkeitsgrad geöffnet.`
    },
    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to German equivalents
      const campaignTypeMap = {
        'phishing': 'Phishing',
        'smishing': 'Smishing',
        'vishing': 'Vishing',
        'callback': 'Rückruf',
        'quishing': 'Quishing'
      }
      const campaignTypeDE = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `Die <strong>${campaignName}</strong> ${campaignTypeDE}-Kampagne mit <strong>${difficulty}</strong> Schwierigkeitsgrad wurde an ${userName} gesendet.`
    },
    // Legacy (keeping for backward compatibility)
    activityTimelineEarnedPoints: (points) => `${points} Punkte verdient`,
    activityTimelineLostPoints: (points) => `${points} Punkte verloren`,
    activityTimelineInCampaign: 'in der',
    activityTimelinePhishingCampaign: 'Phishing-Kampagne',
    activityTimelineAtDifficulty: 'bei',
    activityTimelineWithPerformance: 'mit einer Kampagnenleistung von',
    activityTimelineEasy: 'einfach',
    activityTimelineMedium: 'mittel',
    activityTimelineHard: 'schwer',

    // User Menu
    userMenuEmail: 'E-Mail:',
    userMenuDepartment: 'Abteilung:',
    userMenuPhoneNumber: 'Telefonnummer:',
    userMenuPreferredLanguage: 'Bevorzugte Sprache:',

    // Phishing Test Results
    phishingTestResultsTitle: 'Ihre Phishing-Testergebnisse',
    phishingTestResultsSubtitle:
      'Übersicht über Ihre Phishing-Aktivitätsergebnisse der letzten 30 Tage.',
    phishingTestResultsReportedPhishingEmails: 'Gemeldete Phishing-E-Mails:',
    phishingTestResultsPhishingSimulations: 'Phishing-Simulationen:',
    phishingTestResultsDetectionAccuracy: 'Erkennungsgenauigkeit:',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return 'Sie haben noch keine Punkte für Ihre Berichte verdient.'
      }
      return `Sie haben +${points} Punkte für Ihre Berichte verdient.`
    },
    phishingTestResultsLostPoints: (points) => {
      if (points === 0) {
        return 'Sie haben keine Punkte für verpasste Berichte verloren.'
      }
      return `Sie haben -${points} Punkte für verpasste Berichte verloren.`
    },
    phishingTestResultsAccuracyUp: (percentage) => {
      const absPercentage = Math.abs(percentage)
      if (percentage < 0) {
        return `Erkennungsgenauigkeit um ${absPercentage}% gegenüber dem Vormonat gesunken.`
      } else if (percentage > 0) {
        return `Erkennungsgenauigkeit um ${absPercentage}% gegenüber dem Vormonat gestiegen.`
      }
      return 'Erkennungsgenauigkeit gegenüber dem Vormonat unverändert.'
    },
    phishingTestResultsSuccessRate: 'Erfolgsrate',

    // Activity Action Types
    actionTypeClickedTraining: 'Training angeklickt',
    actionTypeEmailOpened: 'E-Mail geöffnet',
    actionTypeEmailSent: 'E-Mail gesendet',
    actionTypeDownloadedPoster: 'Poster heruntergeladen',
    actionTypeExamPassed: 'Prüfung bestanden',
    actionTypeClickedLink: 'Link angeklickt',
    actionTypeSMSSent: 'SMS gesendet',
    actionTypeOpenedAttachment: 'Anhang geöffnet'
  },
  'fr-FR': {
    // Header
    welcomeTitle: (name) =>
      `${name}, Bienvenue sur votre tableau de bord de croissance de la sécurité !`,
    welcomeDescription:
      'Suivez vos progrès et voyez comment vos actions renforcent notre culture de sécurité.',

    // Overall Performance
    overallPerformanceTitle: 'Performance globale',
    overallPerformanceSubtitle:
      'Suivez vos performances, points et classement pour les 30 derniers jours.',
    overallPerformanceSeeRanking: 'Voir les détails du classement',
    overallPerformancePoints: 'Points :',
    overallPerformanceRank: 'Rang :',

    // Recent Badges
    recentBadgesTitle: 'Badges récents',
    recentBadgesSubtitle:
      'Affichez vos 3 derniers badges gagnés grâce à vos actions et comportements.',
    recentBadgesSeeAll: 'Voir tous les badges',

    // Your Badges
    yourBadgesTitle: 'Vos badges',
    yourBadgesSubtitle: 'Consultez tous vos badges gagnés et disponibles en un seul endroit.',
    yourBadgesEarnedOn: (date) => `Gagné le ${date}`,
    yourBadgesNotEarnedYet: 'Pas encore gagné',
    badgeEliteSecurityChampion: "Champion de sécurité d'élite",
    badgeEngagementStar: "Étoile d'engagement",
    badgeSecurityAmbassador: 'Ambassadeur de sécurité',

    // Your Learning
    yourLearningTitle: 'Votre apprentissage',
    yourLearningSubtitle:
      'Consultez toutes vos formations terminées et assignées en un seul endroit.',
    yourLearningTrainingMaterialName: 'Nom du matériel de formation',
    yourLearningStartDate: 'Date de début',
    yourLearningTrainingStatus: 'Statut de la formation',
    yourLearningCertificate: 'Certificat',
    yourLearningPoints: 'Points',
    yourLearningActions: 'Actions',
    yourLearningNotStarted: 'Non démarré',
    yourLearningNotCompleted: 'Non terminé',
    yourLearningCompleted: 'Terminé',
    yourLearningAvailable: 'Disponible',
    yourLearningNotAvailable: 'Non disponible',
    yourLearningStartTraining: 'Démarrer la formation',
    yourLearningRedoTraining: 'Refaire la formation',
    yourLearningNoTrainingMaterials: 'Aucun matériel de formation trouvé',

    // Your Certificates
    yourCertificatesTitle: 'Vos certificats',
    yourCertificatesSubtitle:
      'Consultez tous vos certificats obtenus et en attente en un seul endroit.',
    yourCertificatesCertificateName: 'Nom du certificat',
    yourCertificatesCertificateDate: 'Date du certificat',
    yourCertificatesTrainingStatus: 'Statut de la formation',
    yourCertificatesActions: 'Actions',
    yourCertificatesNoCertificates: 'Aucun certificat trouvé',
    yourCertificatesDownloadCertificate: 'Télécharger le certificat',

    // Leaderboard
    leaderboardTitle: 'Classement',
    leaderboardSubtitle: 'Classements de performance des employés au cours des 30 derniers jours.',
    leaderboardRank: 'Rang',
    leaderboardFirstName: 'Prénom',
    leaderboardLastName: 'Nom de famille',
    leaderboardEmail: 'E-mail',
    leaderboardDepartment: 'Département',
    leaderboardPerformance: 'Performance',
    leaderboardTotalPoints: 'Points totaux',
    leaderboardEmptyMessage: 'Aucune donnée de classement disponible.',
    leaderboardYou: 'Vous',

    // Activity Timeline
    activityTimelineTitle: "Votre chronologie d'activité",
    activityTimelineSubtitle:
      'Une chronologie de vos activités récentes et de leurs résultats au cours des 30 derniers jours.',
    activityTimelineLoadMore: "Charger plus d'activités",
    activityTimelineEmptyMessage: 'Aucune activité trouvée.',
    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: "L'e-mail signalé avec l'",
    activityTimelineIncidentResponderSubject:
      "objet a été analysé par le répondeur aux incidents et a abouti à",
    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `Un e-mail d'inscription a été envoyé à ${userName} pour l'inscription <strong>${enrollmentName}</strong> de la catégorie <strong>${category}</strong>.`
      }
      return `Un e-mail d'inscription a été envoyé à ${userName} pour l'inscription <strong>${enrollmentName}</strong>.`
    },
    activityTimelineFor: 'pour',
    activityTimelineEnrollment: 'inscription dans la',
    activityTimelineCategory: 'catégorie.',
    // Neutral + Other
    activityTimelineWith: 'avec',
    activityTimelineHasBeenSentTo: 'a été envoyé à',
    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'à',
    activityTimelineDifficulity: 'difficulté',
    // Opened
    activityTimelineOpenedTheEmailFor: "a ouvert l'e-mail pour",
    activityTimelineDifficulty: 'difficulté.',
    // Points
    activityTimelineEarned: 'gagné',
    activityTimelineLost: 'perdu',
    activityTimelinePoints: 'points',
    activityTimelineInThe: 'dans la',
    activityTimelineWithAnEnrollmentPerformance: "avec une performance d'inscription de",
    activityTimelineWithACampaignPerformance: 'avec une performance de campagne de',
    // Point Rule
    activityTimelineAnd: 'et',
    activityTimelineReceived: 'reçu',
    activityTimelineExtra: 'supplémentaire',
    activityTimelineForJoiningTheTraining: 'pour avoir rejoint la formation',
    activityTimelineMoreThan3Days: "plus de 3 jours après l'invitation.",
    activityTimeline1To3Days: "1–3 jours après l'invitation.",
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
      let text = `${userName} a <strong>${action}</strong> <strong>${pointsAbs} points</strong> dans l'inscription <strong>${enrollmentName}</strong> de la catégorie <strong>${category}</strong>, avec une performance d'inscription de <strong>${performance}%</strong>`
      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = pointRule.ruleName === 'Joined After 3 Days' ? 'perdu' : 'reçu'
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'supplémentaires'
        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          ruleText = ` et a <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} points</strong> car la participation à la formation a eu lieu plus de 3 jours après l'invitation.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = ` et a <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} points</strong> car la participation à la formation a eu lieu 1–3 jours après l'invitation.`
        } else {
          ruleText = ` et a <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} points</strong> car la participation à la formation a eu lieu dans les 24 heures suivant l'invitation.`
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
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to French equivalents
      const campaignTypeMap = {
        'phishing': 'hameçonnage',
        'smishing': 'smishing',
        'vishing': 'vishing',
        'callback': 'rappel',
        'quishing': 'quishing'
      }
      const campaignTypeFR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `${userName} a <strong>${action}</strong> <strong>${pointsAbs} points</strong> dans la campagne <strong>${campaignName}</strong> de <strong>${campaignTypeFR}</strong> de difficulté <strong>${difficulty}</strong>, avec une performance de campagne de <strong>${performance}%</strong>.`
    },
    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName} a ouvert l'e-mail pour l'inscription <strong>${enrollmentName}</strong> de la catégorie <strong>${category}</strong>.`
    },
    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to French equivalents
      const campaignTypeMap = {
        'phishing': 'hameçonnage',
        'smishing': 'smishing',
        'vishing': 'vishing',
        'callback': 'rappel',
        'quishing': 'quishing'
      }
      const campaignTypeFR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `${userName} a ouvert l'e-mail pour la campagne <strong>${campaignName}</strong> de <strong>${campaignTypeFR}</strong> de difficulté <strong>${difficulty}</strong>.`
    },
    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to French equivalents
      const campaignTypeMap = {
        'phishing': 'hameçonnage',
        'smishing': 'smishing',
        'vishing': 'vishing',
        'callback': 'rappel',
        'quishing': 'quishing'
      }
      const campaignTypeFR = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `La campagne <strong>${campaignName}</strong> de <strong>${campaignTypeFR}</strong> de difficulté <strong>${difficulty}</strong> a été envoyée à ${userName}.`
    },
    // Legacy (keeping for backward compatibility)
    activityTimelineEarnedPoints: (points) => `Gagné ${points} points`,
    activityTimelineLostPoints: (points) => `Perdu ${points} points`,
    activityTimelineInCampaign: 'dans la',
    activityTimelinePhishingCampaign: 'campagne d\'hameçonnage',
    activityTimelineAtDifficulty: 'à',
    activityTimelineWithPerformance: 'avec une performance de campagne de',
    activityTimelineEasy: 'facile',
    activityTimelineMedium: 'moyen',
    activityTimelineHard: 'difficile',

    // User Menu
    userMenuEmail: 'E-mail :',
    userMenuDepartment: 'Département :',
    userMenuPhoneNumber: 'Numéro de téléphone :',
    userMenuPreferredLanguage: 'Langue préférée :',

    // Phishing Test Results
    phishingTestResultsTitle: 'Vos résultats de test d\'hameçonnage',
    phishingTestResultsSubtitle:
      'Aperçu des résultats de vos activités d\'hameçonnage des 30 derniers jours.',
    phishingTestResultsReportedPhishingEmails: 'E-mails d\'hameçonnage signalés :',
    phishingTestResultsPhishingSimulations: 'Simulations d\'hameçonnage :',
    phishingTestResultsDetectionAccuracy: 'Précision de détection :',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return "Vous n'avez pas encore gagné de points pour vos rapports."
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
    actionTypeOpenedAttachment: 'Pièce jointe ouverte'
  },
  'es-ES': {
    // Header
    welcomeTitle: (name) => `${name}, ¡Bienvenido a su panel de crecimiento de seguridad!`,
    welcomeDescription:
      'Rastree su progreso y vea cómo sus acciones fortalecen nuestra cultura de seguridad.',

    // Overall Performance
    overallPerformanceTitle: 'Rendimiento general',
    overallPerformanceSubtitle:
      'Rastree su rendimiento, puntos y clasificación de los últimos 30 días.',
    overallPerformanceSeeRanking: 'Ver detalles de clasificación',
    overallPerformancePoints: 'Puntos:',
    overallPerformanceRank: 'Clasificación:',

    // Recent Badges
    recentBadgesTitle: 'Insignias recientes',
    recentBadgesSubtitle:
      'Vea sus últimas 3 insignias obtenidas por sus acciones y comportamientos.',
    recentBadgesSeeAll: 'Ver todas las insignias',

    // Your Badges
    yourBadgesTitle: 'Sus insignias',
    yourBadgesSubtitle: 'Vea todas sus insignias obtenidas y disponibles en un solo lugar.',
    yourBadgesEarnedOn: (date) => `Obtenido el ${date}`,
    yourBadgesNotEarnedYet: 'Aún no obtenido',
    badgeEliteSecurityChampion: 'Campeón de Seguridad de Élite',
    badgeEngagementStar: 'Estrella de Compromiso',
    badgeSecurityAmbassador: 'Embajador de Seguridad',

    // Your Learning
    yourLearningTitle: 'Su aprendizaje',
    yourLearningSubtitle: 'Vea todas sus capacitaciones completadas y asignadas en un solo lugar.',
    yourLearningTrainingMaterialName: 'Nombre del material de capacitación',
    yourLearningStartDate: 'Fecha de inicio',
    yourLearningTrainingStatus: 'Estado de la capacitación',
    yourLearningCertificate: 'Certificado',
    yourLearningPoints: 'Puntos',
    yourLearningActions: 'Acciones',
    yourLearningNotStarted: 'No iniciado',
    yourLearningNotCompleted: 'No completado',
    yourLearningCompleted: 'Completado',
    yourLearningAvailable: 'Disponible',
    yourLearningNotAvailable: 'No disponible',
    yourLearningStartTraining: 'Iniciar capacitación',
    yourLearningRedoTraining: 'Rehacer capacitación',
    yourLearningNoTrainingMaterials: 'No se encontraron materiales de capacitación',

    // Your Certificates
    yourCertificatesTitle: 'Sus certificados',
    yourCertificatesSubtitle: 'Vea todos sus certificados obtenidos y pendientes en un solo lugar.',
    yourCertificatesCertificateName: 'Nombre del certificado',
    yourCertificatesCertificateDate: 'Fecha del certificado',
    yourCertificatesTrainingStatus: 'Estado de la capacitación',
    yourCertificatesActions: 'Acciones',
    yourCertificatesNoCertificates: 'No se encontraron certificados',
    yourCertificatesDownloadCertificate: 'Descargar certificado',

    // Leaderboard
    leaderboardTitle: 'Tabla de clasificación',
    leaderboardSubtitle: 'Clasificaciones de rendimiento de los empleados en los últimos 30 días.',
    leaderboardRank: 'Rango',
    leaderboardFirstName: 'Nombre',
    leaderboardLastName: 'Apellido',
    leaderboardEmail: 'Correo electrónico',
    leaderboardDepartment: 'Departamento',
    leaderboardPerformance: 'Rendimiento',
    leaderboardTotalPoints: 'Puntos totales',
    leaderboardEmptyMessage: 'No hay datos de clasificación disponibles.',
    leaderboardYou: 'Tú',

    // Activity Timeline
    activityTimelineTitle: 'Su línea de tiempo de actividad',
    activityTimelineSubtitle:
      'Una línea de tiempo de sus actividades recientes y sus resultados de los últimos 30 días.',
    activityTimelineLoadMore: 'Cargar más actividades',
    activityTimelineEmptyMessage: 'No se encontraron actividades.',
    // Incident Responder
    activityTimelineIncidentResponderReportedEmail: 'El correo electrónico reportado con el',
    activityTimelineIncidentResponderSubject:
      'asunto fue analizado por el respondedor de incidentes y resultó en',
    // Neutral + Awareness
    activityTimelineEnrollmentEmailSentTo: (userName, enrollmentName, category) => {
      if (category) {
        return `Se ha enviado un correo electrónico de inscripción a ${userName} para la inscripción <strong>${enrollmentName}</strong> de la categoría <strong>${category}</strong>.`
      }
      return `Se ha enviado un correo electrónico de inscripción a ${userName} para la inscripción <strong>${enrollmentName}</strong>.`
    },
    activityTimelineFor: 'para',
    activityTimelineEnrollment: 'inscripción en la',
    activityTimelineCategory: 'categoría.',
    // Neutral + Other
    activityTimelineWith: 'con',
    activityTimelineHasBeenSentTo: 'ha sido enviado a',
    // Smishing/Vishing/Quishing + Fail
    activityTimelineAt: 'a',
    activityTimelineDifficulity: 'dificultad',
    // Opened
    activityTimelineOpenedTheEmailFor: 'abrió el correo electrónico para',
    activityTimelineDifficulty: 'dificultad.',
    // Points
    activityTimelineEarned: 'ganó',
    activityTimelineLost: 'perdió',
    activityTimelinePoints: 'puntos',
    activityTimelineInThe: 'en la',
    activityTimelineWithAnEnrollmentPerformance: 'con un rendimiento de inscripción de',
    activityTimelineWithACampaignPerformance: 'con un rendimiento de campaña de',
    // Point Rule
    activityTimelineAnd: 'y',
    activityTimelineReceived: 'recibió',
    activityTimelineExtra: 'extra',
    activityTimelineForJoiningTheTraining: 'por unirse a la capacitación',
    activityTimelineMoreThan3Days: 'más de 3 días después de la invitación.',
    activityTimeline1To3Days: '1–3 días después de la invitación.',
    activityTimelineWithin24Hours: 'dentro de las 24 horas.',
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
      const action = points > 0 ? 'ganó' : 'perdió'
      let text = `${userName} <strong>${action}</strong> <strong>${pointsAbs} puntos</strong> en la inscripción <strong>${enrollmentName}</strong> de la categoría <strong>${category}</strong>, con un rendimiento de inscripción del <strong>${performance}%</strong>`
      if (pointRule) {
        const rulePoints = Math.abs(pointRule.rulePoint)
        const ruleAction = pointRule.ruleName === 'Joined After 3 Days' ? 'perdió' : 'recibió'
        const extra = pointRule.ruleName === 'Joined After 3 Days' ? '' : 'extra'
        let ruleText = ''
        if (pointRule.ruleName === 'Joined After 3 Days') {
          ruleText = ` y <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} puntos</strong> porque la participación en la capacitación ocurrió más de 3 días después de la invitación.`
        } else if (pointRule.ruleName === 'Joined 1–3 Days') {
          ruleText = ` y <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} puntos</strong> porque la participación en la capacitación ocurrió 1–3 días después de la invitación.`
        } else {
          ruleText = ` y <strong>${ruleAction}</strong> <strong>${rulePoints} ${extra} puntos</strong> porque la participación en la capacitación ocurrió dentro de las 24 horas posteriores a la invitación.`
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
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to Spanish equivalents
      const campaignTypeMap = {
        'phishing': 'phishing',
        'smishing': 'smishing',
        'vishing': 'vishing',
        'callback': 'devolución de llamada',
        'quishing': 'quishing'
      }
      const campaignTypeES = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `${userName} <strong>${action}</strong> <strong>${pointsAbs} puntos</strong> en la campaña <strong>${campaignName}</strong> de <strong>${campaignTypeES}</strong> de dificultad <strong>${difficulty}</strong>, con un rendimiento de campaña del <strong>${performance}%</strong>.`
    },
    activityTimelineAwarenessOpened: (userName, enrollmentName, category) => {
      return `${userName} abrió el correo electrónico para la inscripción <strong>${enrollmentName}</strong> de la categoría <strong>${category}</strong>.`
    },
    activityTimelineCampaignOpened: (userName, campaignName, campaignType, difficulty) => {
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to Spanish equivalents
      const campaignTypeMap = {
        'phishing': 'phishing',
        'smishing': 'smishing',
        'vishing': 'vishing',
        'callback': 'devolución de llamada',
        'quishing': 'quishing'
      }
      const campaignTypeES = campaignTypeMap[campaignTypeClean.toLowerCase()] || campaignTypeClean
      return `${userName} abrió el correo electrónico para la campaña <strong>${campaignName}</strong> de <strong>${campaignTypeES}</strong> de dificultad <strong>${difficulty}</strong>.`
    },
    activityTimelineCampaignSentTo: (campaignName, campaignType, difficulty, userName) => {
      // Remove "campaign" from campaignType to avoid duplication (e.g., "phishing campaign" -> "phishing")
      const campaignTypeClean = campaignType.replace(/\s*campaign\s*/gi, '').trim()
      // Map to Spanish equivalents
      const campaignTypeMap = {
        'phishing': 'phishing',
        'smishing': 'smishing',
        'vishing': 'vishing',
        'callback': 'devolución de llamada',
        'quishing': 'quishing'
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

    // User Menu
    userMenuEmail: 'Correo electrónico:',
    userMenuDepartment: 'Departamento:',
    userMenuPhoneNumber: 'Número de teléfono:',
    userMenuPreferredLanguage: 'Idioma preferido:',

    // Phishing Test Results
    phishingTestResultsTitle: 'Sus resultados de prueba de phishing',
    phishingTestResultsSubtitle:
      'Resumen de los resultados de su actividad de phishing de los últimos 30 días.',
    phishingTestResultsReportedPhishingEmails: 'Correos electrónicos de phishing reportados:',
    phishingTestResultsPhishingSimulations: 'Simulaciones de phishing:',
    phishingTestResultsDetectionAccuracy: 'Precisión de detección:',
    phishingTestResultsEarnedPoints: (points) => {
      if (points === 0) {
        return 'Aún no ha ganado puntos por sus informes.'
      }
      return `Ganó +${points} puntos por sus informes.`
    },
    phishingTestResultsLostPoints: (points) => {
      if (points === 0) {
        return 'No ha perdido puntos por informes perdidos.'
      }
      return `Perdió -${points} puntos por informes perdidos.`
    },
    phishingTestResultsAccuracyUp: (percentage) => {
      const absPercentage = Math.abs(percentage)
      if (percentage < 0) {
        return `La precisión de detección disminuyó un ${absPercentage}% desde el mes pasado.`
      } else if (percentage > 0) {
        return `La precisión de detección aumentó un ${absPercentage}% desde el mes pasado.`
      }
      return 'La precisión de detección no cambió desde el mes pasado.'
    },
    phishingTestResultsSuccessRate: 'tasa de éxito',

    // Activity Action Types
    actionTypeClickedTraining: 'Formación clicada',
    actionTypeEmailOpened: 'Correo electrónico abierto',
    actionTypeEmailSent: 'Correo electrónico enviado',
    actionTypeDownloadedPoster: 'Póster descargado',
    actionTypeExamPassed: 'Examen aprobado',
    actionTypeClickedLink: 'Enlace clicado',
    actionTypeSMSSent: 'SMS enviado',
    actionTypeOpenedAttachment: 'Adjunto abierto'
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
