<template>
  <table style="width: 600px; margin: 0 auto;" aria-label="email-template">
    <tbody>
      <tr
        style="
          font-size: 24px;
          line-height: 1.29;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
          opacity: 0.7;
          max-width: 200px;
          min-height: 72px;
          display: flex;
          justify-content: center;
          border-radius: 4px;
          margin: 0 auto 30px auto;
          vertical-align: middle;
          background-color: #e0e0e0;
          align-items: center;
        "
      >
        <td>
          <img
            alt="notification-template-logo"
            style="display: block; width: 100%; max-width: 200px; min-height: 72px;"
            :src="emailTemplateLogo"
          />
        </td>
      </tr>
      <tr>
        <td>
          <p style="margin: 2px;">
            Let’s design an email template
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="margin: 2px;">
            To design an email template, first click the Edit button to enter design mode
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="margin: 2px;">
            Once there choose the layout, use blocks, text, images and other features you need to
            design a responsive email, really fast.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 10px;">
          <p style="margin: 2px;">
            Give your content a style by changing fonts, colors, borders and other properties.
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="margin: 2px;">
            Use shortcodes to define user names, email addresses, URLs, training pieces, dates and
            many more properties
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="margin: 2px;">
            Upload files as attachments to track who downloads and runs suspicious files
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <hr style="margin: 8px auto 16px auto; max-width: 600px; border: 1px solid #b3d4fc;" />
        </td>
      </tr>
      <tr :style="{ marginTop: '16px', justifyContent: 'center' }">
        <td style="text-align: center;">
          <img
            style="margin-left: 48px; height: 32px;"
            alt="facebook-icon"
            src="https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/2cb007b9-3230-4bc1-0aef-4b7764264600/public"
          />

          <img
            alt="twitter-icon"
            src="https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/8270d529-e442-4b65-dca6-7d0edc86d800/public"
            style="margin-left: 48px; height: 32px;"
          />
          <img
            alt="instagram-icon"
            src="https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/1bbc26c7-cde1-4d70-987e-616a71a26500/public"
            style="margin-left: 48px; height: 32px;"
          />
        </td>
      </tr>
      <tr>
        <td>
          <hr style="margin: 14px auto 14px auto; max-width: 600px; border: 1px solid #b3d4fc;" />
        </td>
      </tr>
      <tr>
        <td>
          <p style="margin-bottom: 0;">
            This email is sent by <span>{USERNAME}</span> from <span>{COMPANYNAME}</span> on
            <span>{DATESENT}</span>
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'EmailTemplateDefault',
  props: {
    emailTemplateLogo: {
      type: String
    }
  }
}
</script>
