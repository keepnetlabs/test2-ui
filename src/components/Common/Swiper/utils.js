// MicroLearning Multi-Language Data

export const getMicroLearningData = (language = 'en-GB', userName = 'John') => {
  const data = {
    'en-GB': {
      introData: {
        title: `Hello ${userName}, you clicked a phishing simulation`,
        content: [
          "You're not alone. Many Finance team members clicked on this type of simulation. But you're now one step ahead.",
          `${userName}, this moment is part of your journey to building secure habits. Let's keep going!`
        ],
        button: {
          text: 'Smart Coaching Activated',
          action: 'next_slide',
          variant: 'primary',
          tooltip:
            'This page uses behavioral science techniques like normalization, positive framing, reflective feedback, choice architecture, and microlearning to help you recognize risks and build safer habits.'
        },
        illustration: {
          type: 'image',
          position: 'right',
          url:
            'https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/2d34080d-bdf8-45de-43af-f058b5314200/public'
        },
        layout: 'split',
        theme: 'default'
      },

      educationData: {
        title: 'What You Missed',
        description:
          'Hover over each box to view details. Please review all flags to complete the process—thank you!',
        theme: 'security',
        fields: [
          {
            key: 'From Name',
            value: 'Microsoft Account Team',
            tooltip:
              "The sender name doesn't match Microsoft's official naming convention. Real Microsoft emails use 'Microsoft Security Team' or similar."
          },
          {
            key: 'From Email Address',
            value: 'no-reply@m1crosoft.com',
            tooltip:
              "Notice the '1' instead of 'i' in 'microsoft'. This is a common phishing technique called typosquatting."
          },
          {
            key: 'Subject',
            value: 'Action required: Verify your account to avoid suspension',
            tooltip:
              'Creates false urgency to pressure quick action. Legitimate Microsoft emails rarely threaten account suspension.'
          }
        ],
        htmlContent: getEmailHTML('en-GB'),
        isShowRedFlags: true,
        redFlagsReviewed: 0,
        totalRedFlags: 9
      },

      behaviorData: {
        title: 'Your Behavior',
        description:
          'You clicked the link in under 5 seconds. This was a fast reaction. Next time, take a moment to inspect.',
        theme: 'primary',
        layout: 'default',
        tips: [
          {
            icon: 'mdi-magnify',
            title: 'Inspect the Sender',
            description: "Check the sender's domain carefully."
          },
          {
            icon: 'mdi-link-variant',
            title: 'Preview Links',
            description: 'Hover over links before clicking.'
          },
          {
            icon: 'mdi-clock-outline',
            title: 'Validate Urgency',
            description: 'Verify urgency claims through a second channel.'
          }
        ],
        actions: []
      },

      whatYouCanDoNextData: {
        title: 'What You Can Do Next',
        description: 'Continue improving your security awareness with these recommended actions.',
        theme: 'primary',
        layout: 'default',
        tips: [
          {
            icon: 'mdi-lock',
            title: 'Stay Vigilant',
            description:
              'You can still show your awareness. Use the Phishing Reporter button in your inbox to report any future suspicious emails—even after falling for one.'
          },
          {
            icon: 'mdi-file-document-multiple',
            title: 'Learn from Others',
            description:
              "Most of your peers spotted this email's red flags. Many hovered over the sender's address before clicking."
          },
          {
            icon: 'mdi-refresh',
            title: 'Keep Practicing',
            description:
              "You'll get more simulated phishing emails. Each one is a chance to sharpen your instincts."
          }
        ],
        actions: []
      },

      feedbackData: {
        title: "We'd love your feedback",
        userName: userName,
        placeholder: 'tell us what was helpful or what can be improved...',
        requireRating: true,
        requireText: false,
        minTextLength: 0,
        maxLength: 500,
        rows: 4,
        theme: 'primary',
        layout: 'default',
        actions: [
          {
            text: 'Submit Feedback',
            action: 'submit',
            type: 'primary'
          }
        ]
      }
    },

    'tr-TR': {
      introData: {
        title: `Merhaba ${userName}, bir kimlik avı simülasyonuna tıkladınız`,
        content: [
          'Yalnız değilsiniz. Finans ekibinin birçok üyesi bu tür simülasyona tıkladı. Ama şimdi bir adım öndeysiniz.',
          `${userName}, bu an güvenli alışkanlıklar geliştirme yolculuğunuzun bir parçası. Devam edelim!`
        ],
        button: {
          text: 'Akıllı Koçluk Etkinleştirildi',
          action: 'next_slide',
          variant: 'primary',
          tooltip:
            'Bu sayfa normalleştirme, olumlu çerçeveleme, yansıtıcı geri bildirim, seçim mimarisi ve mikro öğrenme gibi davranışsal bilim tekniklerini kullanarak riskleri tanımanıza ve daha güvenli alışkanlıklar geliştirmenize yardımcı olur.'
        },
        illustration: {
          type: 'image',
          position: 'right',
          url:
            'https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/2d34080d-bdf8-45de-43af-f058b5314200/public'
        },
        layout: 'split',
        theme: 'default'
      },

      educationData: {
        title: 'Kaçırdıklarınız',
        description:
          'Ayrıntıları görmek için her kutunun üzerine gelin. İşlemi tamamlamak için lütfen tüm bayrakları inceleyin—teşekkürler!',
        theme: 'security',
        fields: [
          {
            key: 'Gönderen Adı',
            value: 'Microsoft Account Team',
            tooltip:
              "Gönderen adı Microsoft'un resmi adlandırma kuralıyla eşleşmiyor. Gerçek Microsoft e-postaları 'Microsoft Security Team' veya benzeri kullanır."
          },
          {
            key: 'Gönderen E-posta Adresi',
            value: 'no-reply@m1crosoft.com',
            tooltip:
              "'microsoft'ta 'i' yerine '1' olduğuna dikkat edin. Bu, typosquatting adı verilen yaygın bir kimlik avı tekniğidir."
          },
          {
            key: 'Konu',
            value: 'Eylem gerekli: Hesabınızı askıya almayı önlemek için doğrulayın',
            tooltip:
              'Hızlı eylem için sahte aciliyet yaratır. Meşru Microsoft e-postaları nadiren hesap askıya alma tehdidinde bulunur.'
          }
        ],
        htmlContent: getEmailHTML('tr-TR'),
        isShowRedFlags: true,
        redFlagsReviewed: 0,
        totalRedFlags: 9
      },

      behaviorData: {
        title: 'Davranışınız',
        description:
          'Bağlantıya 5 saniyeden kısa sürede tıkladınız. Bu hızlı bir tepkiydi. Bir dahaki sefere inceleme için bir dakika ayırın.',
        theme: 'primary',
        layout: 'default',
        tips: [
          {
            icon: 'mdi-magnify',
            title: 'Göndereni İnceleyin',
            description: 'Gönderenin alan adını dikkatli bir şekilde kontrol edin.'
          },
          {
            icon: 'mdi-link-variant',
            title: 'Bağlantıları Önizleyin',
            description: 'Tıklamadan önce bağlantıların üzerine gelin.'
          },
          {
            icon: 'mdi-clock-outline',
            title: 'Aciliyeti Doğrulayın',
            description: 'Aciliyet iddialarını ikinci bir kanal üzerinden doğrulayın.'
          }
        ],
        actions: []
      },

      whatYouCanDoNextData: {
        title: 'Sırada Yapabilecekleriniz',
        description: 'Bu önerilen eylemlerle güvenlik farkındalığınızı artırmaya devam edin.',
        theme: 'primary',
        layout: 'default',
        tips: [
          {
            icon: 'mdi-lock',
            title: 'Tetikte Kalın',
            description:
              'Hala farkındalığınızı gösterebilirsiniz. Gelecekteki şüpheli e-postaları bildirmek için gelen kutunuzdaki Kimlik Avı Raporlayıcı düğmesini kullanın—birine aldanmış olsanız bile.'
          },
          {
            icon: 'mdi-file-document-multiple',
            title: 'Diğerlerinden Öğrenin',
            description:
              'Meslektaşlarınızın çoğu bu e-postanın kırmızı bayraklarını fark etti. Birçoğu tıklamadan önce gönderenin adresinin üzerine geldi.'
          },
          {
            icon: 'mdi-refresh',
            title: 'Pratik Yapmaya Devam Edin',
            description:
              'Daha fazla simüle kimlik avı e-postası alacaksınız. Her biri içgüdülerinizi keskinleştirme şansıdır.'
          }
        ],
        actions: []
      },

      feedbackData: {
        title: 'Geri bildiriminizi almak isteriz',
        userName: userName,
        placeholder: 'neyin yararlı olduğunu veya neyin iyileştirilebileceğini bize söyleyin...',
        requireRating: true,
        requireText: false,
        minTextLength: 0,
        maxLength: 500,
        rows: 4,
        theme: 'primary',
        layout: 'default',
        actions: [
          {
            text: 'Geri Bildirim Gönder',
            action: 'submit',
            type: 'primary'
          }
        ]
      }
    }
  }

  return data[language] || data['en-GB']
}

// Email HTML content generator
function getEmailHTML(language = 'en-GB') {
  const content = {
    'en-GB': {
      title: 'Verify Your Microsoft Account',
      subject: 'Action Required: Verify Your Account to Prevent Suspension',
      greeting: 'Dear user,',
      mainText:
        'We were unable to verify your Microsoft 365 subscription due to a recent billing failure. To avoid suspension and potential data loss, please confirm your account information within the next',
      deadline: '24 hours',
      buttonText: 'Verify Now',
      warningText:
        'If you do not verify your account, your email service will be interrupted and your mailbox will be permanently deleted.',
      thanksText: 'Thank you for your prompt attention.',
      signature: 'Sincerely,<br>Microsoft Account Team',
      footerText1:
        'This message was sent from an unmonitored address. Please do not reply directly to this email.',
      footerText2: '© 2025 Microsoft Corporation, One Microsoft Way, Redmond, WA 98052'
    },
    'tr-TR': {
      title: 'Microsoft Hesabınızı Doğrulayın',
      subject: 'Eylem Gerekli: Hesabınızı Askıya Almayı Önlemek İçin Doğrulayın',
      greeting: 'Sayın kullanıcı,',
      mainText:
        'Son faturalandırma hatası nedeniyle Microsoft 365 aboneliğinizi doğrulayamadık. Askıya almayı ve olası veri kaybını önlemek için lütfen önümüzdeki',
      deadline: '24 saat',
      buttonText: 'Şimdi Doğrula',
      warningText:
        'Hesabınızı doğrulamazsanız, e-posta hizmetiniz kesintiye uğrayacak ve posta kutunuz kalıcı olarak silinecektir.',
      thanksText: 'Hızlı dikkatiniz için teşekkür ederiz.',
      signature: 'Saygılarımızla,<br>Microsoft Hesap Ekibi',
      footerText1:
        'Bu mesaj izlenmeyen bir adresten gönderilmiştir. Lütfen bu e-postayı doğrudan yanıtlamayın.',
      footerText2: '© 2025 Microsoft Corporation, One Microsoft Way, Redmond, WA 98052'
    }
  }

  const lang = content[language] || content['en-GB']

  return `<html lang="${language.split('-')[0]}"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${lang.title}</title>

</head>
<body style="Margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;color:#333;">
    <style>
    .flagged-area {
      position: relative;
      display: inline-block;
      border: 1px solid #e00;
      border-radius: 4px;
      padding: 0.2em 0.6em 0.2em 2em;
      margin: 0 0.1em;
    }
    .flagged-area::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0.5em;
      width: 1em;
      height: 1em;
      transform: translateY(-50%);
      background: url('https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/506bf119-942d-4224-7ab1-98292e2e3900/public') no-repeat center/contain;
    }
    .flagged-area:hover::after {
      content: attr(data-flag-tooltip);
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translate(-50%, 0);
      margin-top: 0.3em;
      padding: 0.4em 0.6em;
      background: #B83A3A;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      color: #fff;
      white-space: normal;
      word-break: break-word;
      min-width: 240px;
      border-radius: 4px;
      z-index: 1000;
    }
  </style>
  <center style="width:100%;background-color:#f5f5f5;">
    <table align="center" role="presentation" width="100%" style="max-width:600px;margin:0 auto;">

      <!-- Header Logo -->
      <tbody><tr>
        <td style="padding:20px 0;text-align:left;">
          <span class="flagged-area" data-field="logo" data-flag-tooltip="${
            language === 'tr-TR'
              ? "Logo, Microsoft CDN'si yerine üçüncü taraf bir siteden yükleniyor, bu sizi takip etmek veya kötü amaçlı içerik enjekte etmek için kullanılabilir."
              : 'The logo is loaded from a third-party site rather than a Microsoft CDN, which could be used to track you or inject malicious content.'
          }">
            <img src="https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/4405f77d-e69f-4aa5-858d-875a93de2a00/public" alt="Microsoft" style="width:120px;height:auto;display:block;border:0;outline:none;text-decoration:none;">
          </span>
        </td>
      </tr>

      <!-- Card Container -->
      <tr>
        <td style="background-color:#ffffff;padding:40px;border-radius:4px;">

          <!-- Subject -->
          <h1 style="Margin:0 0 24px 0;font-size:24px;line-height:32px;font-weight:bold;color:#111;">
            <span class="flagged-area" data-field="subject" data-flag-tooltip="${
              language === 'tr-TR'
                ? "Konu satırı aciliyet ('Eylem Gerekli') ve tehditler ('askıya almayı önle') kullanıyor—klasik kimlik avı taktikleri."
                : "The subject line uses urgency ('Action Required') and threats ('prevent suspension')—classic phishing tactics."
            }">
              ${lang.subject}
            </span>
          </h1>

          <!-- Greeting -->
          <p style="Margin:0 0 16px 0;font-size:16px;line-height:24px;">
            <span class="flagged-area" data-field="greeting" data-flag-tooltip="${
              language === 'tr-TR'
                ? "Gerçek sağlayıcılar genellikle sizi adınızla karşılar; 'Sayın kullanıcı' kişisel değildir ve toplu gönderimi önerir."
                : "Real providers usually address you by name; 'Dear user' is impersonal and suggests a mass mailing."
            }">
              ${lang.greeting}
            </span>
          </p>

          <!-- Main Text with Deadline -->
          <p style="Margin:0 0 24px 0;font-size:16px;line-height:24px;">
            ${lang.mainText}
            <span class="flagged-area" data-field="deadline" data-flag-tooltip="${
              language === 'tr-TR'
                ? "'24 saat içinde' gibi son tarihler düşünmeden hızlı eylem yapmanızı sağlamak için tasarlanmıştır."
                : "Deadlines like 'within 24 hours' are designed to rush you into action without thinking."
            }">
              ${lang.deadline}
            </span>.
          </p>

          <!-- CTA Button -->
          <table role="presentation" align="center" style="margin:0 auto 24px auto;">
            <tbody><tr>
              <td style="border-radius:4px;background-color:#0078D4;">
                <span class="flagged-area" data-field="ctaButton" data-flag-tooltip="${
                  language === 'tr-TR'
                    ? 'Düğmenin üzerine geldiğinizde Microsoft olmayan bir alan adına işaret eden URL ortaya çıkar—güçlü bir kimlik avı göstergesi.'
                    : 'Hovering over the button reveals a URL pointing to a non-Microsoft domain—a strong phishing indicator.'
                }">
                  <a href="#" style="display:inline-block;padding:12px 24px;font-size:16px;color:#fff;text-decoration:none;font-weight:bold;border-radius:4px;">
                    ${lang.buttonText}
                  </a>
                </span>
              </td>
            </tr>
          </tbody></table>

          <!-- Warning Text -->
          <p style="Margin:0 0 16px 0;font-size:14px;line-height:20px;color:#555;">
            <span class="flagged-area" data-field="warningText" data-flag-tooltip="${
              language === 'tr-TR'
                ? 'Kimlik avı e-postaları korku ve aciliyet yaratmak için genellikle hesap askıya alma veya veri kaybı konusunda uyarır.'
                : 'Phishing emails commonly warn of account suspension or data loss to create fear and urgency.'
            }">
              ${lang.warningText}
            </span>
          </p>

          <!-- Thanks and Signature -->
          <p style="Margin:0 0 16px 0;font-size:14px;line-height:20px;color:#555;">
            ${lang.thanksText}
          </p>
          <p style="Margin:0;font-size:14px;line-height:20px;color:#555;">
            ${lang.signature}
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:20px 0 0 0;text-align:center;font-size:12px;line-height:18px;color:#888;">
          <p style="Margin:0;">
            ${lang.footerText1}
          </p>
          <p style="Margin:4px 0 0 0;">
            ${lang.footerText2}
          </p>
        </td>
      </tr>

    </tbody></table>
  </center>

</body></html>`
}
