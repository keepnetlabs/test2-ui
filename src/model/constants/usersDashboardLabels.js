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
    activityTimelineEarnedPoints: (points) => `Earned ${points} points`,
    activityTimelineLostPoints: (points) => `Lost ${points} points`,
    activityTimelineInCampaign: 'in the',
    activityTimelinePhishingCampaign: 'phishing campaign',
    activityTimelineAtDifficulty: 'at',
    activityTimelineDifficulty: 'difficulty',
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
    phishingTestResultsEarnedPoints: (points) => `You earned +${points} points for your reports.`,
    phishingTestResultsLostPoints: (points) => `You lost -${points} points for missed reports.`,
    phishingTestResultsAccuracyUp: (percentage) =>
      `Detection accuracy up by ${percentage}% from last month.`,
    phishingTestResultsSuccessRate: 'success rate'
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
    activityTimelineEarnedPoints: (points) => `Earned ${points} points`,
    activityTimelineLostPoints: (points) => `Lost ${points} points`,
    activityTimelineInCampaign: 'in the',
    activityTimelinePhishingCampaign: 'phishing campaign',
    activityTimelineAtDifficulty: 'at',
    activityTimelineDifficulty: 'difficulty',
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
    phishingTestResultsEarnedPoints: (points) => `You earned +${points} points for your reports.`,
    phishingTestResultsLostPoints: (points) => `You lost -${points} points for missed reports.`,
    phishingTestResultsAccuracyUp: (percentage) =>
      `Detection accuracy up by ${percentage}% from last month.`,
    phishingTestResultsSuccessRate: 'success rate'
  },
  'tr-TR': {
    // Header
    welcomeTitle: (name) => `${name}, Güvenlik Büyüme Paneline Hoş Geldiniz!`,
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
    activityTimelineEarnedPoints: (points) => `${points} puan kazandınız`,
    activityTimelineLostPoints: (points) => `${points} puan kaybettiniz`,
    activityTimelineInCampaign: 'kampanyasında',
    activityTimelinePhishingCampaign: 'oltalama',
    activityTimelineAtDifficulty: 'zorluk seviyesinde',
    activityTimelineDifficulty: 'zorluk',
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
    phishingTestResultsEarnedPoints: (points) => `Raporlarınız için +${points} puan kazandınız.`,
    phishingTestResultsLostPoints: (points) =>
      `Kaçırılan raporlar için -${points} puan kaybettiniz.`,
    phishingTestResultsAccuracyUp: (percentage) =>
      `Tespit doğruluğu geçen aya göre %${percentage} arttı.`,
    phishingTestResultsSuccessRate: 'başarı oranı'
  },
  'de-DE': {
    // Header
    welcomeTitle: (name) => `${name}, Willkommen zu Ihrem Sicherheitswachstums-Dashboard!`,
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
    activityTimelineEarnedPoints: (points) => `${points} Punkte verdient`,
    activityTimelineLostPoints: (points) => `${points} Punkte verloren`,
    activityTimelineInCampaign: 'in der',
    activityTimelinePhishingCampaign: 'Phishing-Kampagne',
    activityTimelineAtDifficulty: 'bei',
    activityTimelineDifficulty: 'Schwierigkeit',
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
    phishingTestResultsEarnedPoints: (points) =>
      `Sie haben +${points} Punkte für Ihre Berichte verdient.`,
    phishingTestResultsLostPoints: (points) =>
      `Sie haben -${points} Punkte für verpasste Berichte verloren.`,
    phishingTestResultsAccuracyUp: (percentage) =>
      `Erkennungsgenauigkeit um ${percentage}% gegenüber dem Vormonat gestiegen.`,
    phishingTestResultsSuccessRate: 'Erfolgsrate'
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
    activityTimelineEarnedPoints: (points) => `Gagné ${points} points`,
    activityTimelineLostPoints: (points) => `Perdu ${points} points`,
    activityTimelineInCampaign: 'dans la',
    activityTimelinePhishingCampaign: 'campagne de phishing',
    activityTimelineAtDifficulty: 'à',
    activityTimelineDifficulty: 'difficulté',
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
    phishingTestResultsTitle: 'Vos résultats de test de phishing',
    phishingTestResultsSubtitle:
      'Aperçu des résultats de vos activités de phishing des 30 derniers jours.',
    phishingTestResultsReportedPhishingEmails: 'E-mails de phishing signalés :',
    phishingTestResultsPhishingSimulations: 'Simulations de phishing :',
    phishingTestResultsDetectionAccuracy: 'Précision de détection :',
    phishingTestResultsEarnedPoints: (points) =>
      `Vous avez gagné +${points} points pour vos rapports.`,
    phishingTestResultsLostPoints: (points) =>
      `Vous avez perdu -${points} points pour les rapports manqués.`,
    phishingTestResultsAccuracyUp: (percentage) =>
      `La précision de détection a augmenté de ${percentage}% par rapport au mois dernier.`,
    phishingTestResultsSuccessRate: 'taux de réussite'
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
    activityTimelineEarnedPoints: (points) => `Ganó ${points} puntos`,
    activityTimelineLostPoints: (points) => `Perdió ${points} puntos`,
    activityTimelineInCampaign: 'en la',
    activityTimelinePhishingCampaign: 'campaña de phishing',
    activityTimelineAtDifficulty: 'a',
    activityTimelineDifficulty: 'dificultad',
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
    phishingTestResultsEarnedPoints: (points) => `Ganó +${points} puntos por sus informes.`,
    phishingTestResultsLostPoints: (points) => `Perdió -${points} puntos por informes perdidos.`,
    phishingTestResultsAccuracyUp: (percentage) =>
      `La precisión de detección aumentó un ${percentage}% desde el mes pasado.`,
    phishingTestResultsSuccessRate: 'tasa de éxito'
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
