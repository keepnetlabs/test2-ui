<template>
  <table style="width: 800px; margin: 0 auto;" aria-label="email-template">
    <tbody>
      <tr
        style="
          font-family: 'Open Sans', sans-serif;
          font-size: 24px;
          line-height: 1.29;
          letter-spacing: normal;
          color: #383b41;
          opacity: 0.7;
          max-width: 200px;
          min-height: 72px;
          display: flex;
          justify-content: center;
          border-radius: 4px;
          margin: 0 auto 30px 0;
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
          <p
            style="
              color: #383b41;
              font-family: 'Open Sans', sans-serif;
              margin: 2px 2px 4px;
              font-size: 34px;
              font-style: normal;
              font-weight: 300;
            "
          >
            Let’s design an individual printout template
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p
            style="
              font-family: 'Open Sans', sans-serif;
              color: #383b41;
              margin: 2px;
              font-size: 18px;
              font-style: normal;
              font-weight: 600;
              line-height: normal;
            "
          >
            To design an individual printout template, first click the Edit button to enter design
            mode
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="font-family: 'Open Sans', sans-serif; margin: 2px; color: #383b41;">
            Once there choose the layout, use blocks, text, images, and other features you need to
            design a responsive individual printout, really fast.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 10px;">
          <p style="font-family: 'Open Sans', sans-serif; margin: 2px; color: #383b41;">
            Give your content a style by changing fonts, colors, borders, and other properties.
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="font-family: 'Open Sans', sans-serif; margin: 2px; color: #383b41;">
            Use merge tags to define user names, email addresses, dates and many more...
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <hr style="margin: 8px auto 16px auto; max-width: 800px; border: 1px solid #b3d4fc;" />
        </td>
      </tr>
      <tr :style="{ marginTop: '16px', justifyContent: 'center' }">
        <td style="text-align: center;">
          <img
            alt="facebook-icon"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjI0IC0xNDcxKSB0cmFuc2xhdGUoOTYgMTg2KSB0cmFuc2xhdGUoMCA1NzYpIHRyYW5zbGF0ZSgyIDQwKSB0cmFuc2xhdGUoMzIyIDI2NSkgdHJhbnNsYXRlKDIwNCA0MDQpIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiM0NTYxOUQiIHJ4PSIxNiIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xOC41NCAzLjg0Yy00LjMzOCAwLTUuNzcgMS45OS01Ljc3IDUuNDA0djIuNzAySDkuOTJ2NC4wNTZoMi44NVYyOC4xNmg1LjI1NlYxNi4wMDJoMy41NzJsLjQ4LTQuMDU2aC00LjA1MnYtMi40MWMwLTEuMDkuMjQtMS42NDIgMS45My0xLjY0MmgyLjEyMlYzLjg0SDE4LjU0eiIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K"
          />

          <img
            alt="twitter-icon"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzA0IC0xNDcxKSB0cmFuc2xhdGUoOTYgMTg2KSB0cmFuc2xhdGUoMCA1NzYpIHRyYW5zbGF0ZSgyIDQwKSB0cmFuc2xhdGUoMzIyIDI2NSkgdHJhbnNsYXRlKDIwNCA0MDQpIHRyYW5zbGF0ZSg4MCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiM1NUFDRUUiIHJ4PSIxNiIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTkuODMgNy42NzdjLTIuMjcuMDU3LTQuMDkgMS45MTUtNC4wOSA0LjIgMCAuMzI5LjAzNC42NS4xMDYuOTU4LTMuNDkyLS4xNzUtNi41ODgtMS44NDgtOC42Ni00LjM5LS4zNjIuNjItLjU3IDEuMzQzLS41NyAyLjExMyAwIDEuNDU4Ljc0MyAyLjc0MyAxLjg3IDMuNDk2LS42ODgtLjAyMi0xLjMzNy0uMjExLTEuOTA0LS41MjZ2LjA1NGMwIDIuMDM2IDEuNDUgMy43MzIgMy4zNzIgNC4xMTktLjM1My4wOTUtLjcyNC4xNDctMS4xMDguMTQ3LS4yNyAwLS41MzMtLjAyNi0uNzktLjA3NS41MzUgMS42NjkgMi4wODUgMi44ODUgMy45MjMgMi45MTgtMS40MzggMS4xMjctMy4yNDcgMS43OTktNS4yMTYgMS43OTktLjMzOSAwLS42NzQtLjAxOS0xLjAwMy0uMDU4IDEuODYgMS4xOTMgNC4wNjcgMS44ODggNi40NCAxLjg4OCA3LjcyOSAwIDExLjk1NS02LjQwMyAxMS45NTUtMTEuOTU1IDAtLjE4Mi0uMDAzLS4zNjUtLjAxMS0uNTQ2LjgyLS41OTEgMS41MzMtMS4zMzEgMi4wOTYtMi4xNzQtLjc1My4zMzQtMS41NjMuNTYxLTIuNDEzLjY2Mi44NjgtLjUyIDEuNTM0LTEuMzQzIDEuODQ4LTIuMzI1LS44MTIuNDgyLTEuNzExLjgzMi0yLjY2OSAxLjAyMS0uNzY2LS44MTYtMS44NTgtMS4zMjYtMy4wNjctMS4zMjZoLS4xMDl6Ii8+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K"
            style="margin-left: 48px; height: 32px;"
          />
          <img
            alt="instagram-icon"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzg0IC0xNDcxKSB0cmFuc2xhdGUoOTYgMTg2KSB0cmFuc2xhdGUoMCA1NzYpIHRyYW5zbGF0ZSgyIDQwKSB0cmFuc2xhdGUoMzIyIDI2NSkgdHJhbnNsYXRlKDIwNCA0MDQpIHRyYW5zbGF0ZSgxNjApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMkE1QjgzIiByeD0iMTYiLz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTcuNzc0IDUuNzZjLS4wOTguMDE4LS4xOTUuMDItLjI5My4wNDItLjkwOC4yMDctMS41NzEuOTQ4LTEuNyAxLjg2OC0uMDA2LjAzOC0uMDE1LjA2Ni0uMDIxLjEwNHYxNi40NTJjLjAxOS4xMDMuMDM5LjIxMS4wNjIuMzE1LjIwMS44ODcuOTQ2IDEuNTYzIDEuODQ4IDEuNjc5LjA0My4wMDUuMDgzLjAxNC4xMjYuMDJoMTYuNDA4Yy4xMDctLjAxNy4yMS0uMDIuMzE1LS4wNDIuODM2LS4xNzggMS41MTUtLjg4IDEuNjc5LTEuNzIxLjAxNy0uMDkyLjAyNy0uMTgyLjA0Mi0uMjczVjcuNzk2Yy0uMDE0LS4wOS0uMDI1LS4xNjMtLjA0Mi0uMjUyLS4xOC0uOTE4LS45MzktMS42MzYtMS44NjgtMS43NjQtLjAzOS0uMDA0LS4wNjYtLjAxMy0uMTA0LS4wMkg3Ljc3NHptMTMuNDkzIDEuNjU3aDEuOTNjLjQ2Mi4wMDEuODE4LjM3Ny44MTguODR2MS45M2MwIC40MzUtLjM0Mi44MDktLjc3Ni44Mi0uMzM4LjAwNy0uNjcgMC0xLjAwNyAwLS4zMTEgMC0uNjMzLjAyLS45NDQuMDItLjM4Mi0uMDAyLS42ODItLjIyNS0uNzk4LS41NjYtLjAzLS4wOTEtLjA2Mi0uMTc3LS4wNjItLjI3My0uMDA1LS42NDEgMC0xLjI5IDAtMS45MyAwLS40NjQuMzc3LS44NC44MzktLjg0ek0xNiAxMS44NDVjMi4zMjUtLjAwMSA0LjIwNSAxLjkxNiA0LjE1NSA0LjI0LS4wNSAyLjI1My0xLjk0IDQuMTItNC4yNiA0LjA3LTIuMjI5LS4wNDgtNC4wODMtMS44OTQtNC4wNS00LjIxNy4wMzItMi4yNjIgMS44ODMtNC4wOTQgNC4xNTUtNC4wOTN6TTcuOTYzIDE0LjA3aDEuOTUyYy0uNTA4IDEuNzM2LS4zNjIgMy40LjUwNCA0Ljk5NC41ODEgMS4wNyAxLjQxNSAxLjkwMyAyLjQ3NSAyLjQ5NyAyLjA5OSAxLjE3OCA0LjY5NiAxLjA1MyA2LjY3My0uMjk0Ljc2Mi0uNTIgMS4zODgtMS4xNjQgMS44NjgtMS45NS40OC0uNzg4Ljc3My0xLjY0Ni44OC0yLjU2LjEwOS0uOTE2LjAyNi0xLjgwNS0uMjUtMi42ODdoMS45NXY5LjE0OWMwIC40NC0uMzU2Ljc5Ni0uNzk2Ljc5Nkg4Ljc4Yy0uNDM2IDAtLjgxOC0uMzYtLjgxOC0uNzk2VjE0LjA3eiIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg=="
            style="margin-left: 48px;"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'IndividualPrintOutTemplateDefault',
  props: {
    emailTemplateLogo: {
      type: String
    }
  }
}
</script>
