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
            Let’s design an email template
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
            To design an email template, first click the Edit button to enter design mode
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="font-family: 'Open Sans', sans-serif; margin: 2px; color: #383b41;">
            Once there choose the layout, use blocks, text, images and other features you need to
            design a responsive email, really fast.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 10px;">
          <p style="font-family: 'Open Sans', sans-serif; margin: 2px; color: #383b41;">
            Give your content a style by changing fonts, colors, borders and other properties.
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="font-family: 'Open Sans', sans-serif; margin: 2px; color: #383b41;">
            Use shortcodes to define user names, email addresses, URLs, training pieces, dates and
            many more properties
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="font-family: 'Open Sans', sans-serif; margin: 2px; color: #383b41;">
            Upload files as attachments to track who downloads and runs suspicious files
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <img
            data-title="Qr Code"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAV0UlEQVR4Ae3dzZHkxLoG4OIG+wELGCwALGCwANiyASwALAAsACwANmyBiHvWgAWABYAFMBb0ra8DnStEZpX0llr1M88TUcHM0C2ppEy9mSkp9dzd3g4AFvqfHQAEBAgAEQECQESAABARIABEBAgAEQECQESAABARIABEBAgAEQECQESAABARIABEBAgAEQECQESAABARIABEBAgAEQECQESAABARIABEBAgAEQECQESAABB5freBRy882nF+T/96ukvc+vFL9wtt6vtl2KJc64EAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJARIAAENlkNt6UWVLbtp7t9FqOQ7pfrmX22K1nU976uKvvbZdcPvVAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAiAABICJAAIhc9Gy8qVufXfVa3PossFt/v2sp11tT389HDwSAiAABICJAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAyE3OxstlMOss3DY9EAAiAgSAiAABICJAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAiAABICJAAIgIEAAiZuPlmZfO/rv1bMNmN+bS6IEAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJARIAAELnJ2XjTWUtZ163PcstlcPzORw8EgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgMhFz8abzq7Kum59Vl2z+F4G9f366IEAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJARIAAEHnubm8HB2w9S+rWs9ze+veDh6IHAkBEgAAQESAARAQIABEBAkBEgAAQESAARAQIABEBAkBEgAAQESAARAQIABEBAkDk+d0GrmW201vfznR917I/t3br5Sy1dfm8dZe8P/VAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAiAABICJAAIg8d7e3e2DXMiurWXzXXV/q1rdza9dSXm599ubUJc9SrAcCQESAABARIABEBAgAEQECQESAABARIABEBAgAEQECQESAABARIABEBAgAEQECQOT53QW79Vk9r+X7Xctsw6lbn/331mfVNTt12xbbqQcCQESAABARIABENrkG8p///c9uS9bHEteyP23numzn6TZ5pS0At8cQFgARAQJARIAAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJARIAAENnkhVJz/PXXX7sff/xx98cff9z/+ffff9999tlnuxdeeGEH8Kz68MMPdy+++OL9n1955ZXdq6++unv8+PHuEpz9hVIVFp9++unuq6++uv/z2G+//XYxOwrgHOocWA3rsSdPnuy+/PLLs58fz94DeeONN3a//PLLDoB5arTmtdde2/38889nDZGzBkj1Ok4Nj9qR33///f1/a9hr3Iuprl593n333fvEnuOjjz6avU114Gr5r7/++v1/E7W9X3zxxf3213qn21/reOutt+6/Q6qW+fXXX/93HbWfBjVEWOt577337r/HnMJYy6j9dEwtu5ZXn+p6zz0GZclxaKl1ffzxx//9e2uba/u+/fbbo8uq/ff222//699/+OGHf/z9ocpOa7kffPDBfblYqrWsOvbj8nXo+NY+XXIcjy1vSSu6RiqqDK+1XWNDHfnuu+9Oroe98rLEnONb63n//ff/VQ43dXdG+wNTw2f/+OwP1N3+2sfdfqcc/N398NbdvsD86/d7n/rZ+p1jlixzut371sDdXH/++efdfmxz0fL3gXu31Oeff363P1HOXscnn3xydJl1bNJ9NPc7pMdh+OxPike3ubZnjio3rXWstc3HymZruUlZ6C1reswPHd8qs0vtT4Td5c2pk4M6XmtuV6l6WN9/SR05tu975WXJZ7yOOh77hk53P9Z3OJezBkhaoGrnzj3gxyrL1Kknrjkn4PqOhyrDoc/cilKF6pQwPHQc0gCZu/w1jsM1BUjrpHFsuecKkKp3S05Yx06mcwPkWJmr7Vrqoerh2gEy1jrvHWtsP6Sz3cY7vWBe5txdUN3M6nK3fn+OfWW57wo/lFp+r5tdaviorvuMh5GW2Pco7ruth9S+qXUc2o5DTt3GOcuv8VvXvv6pynV6zLYyDPXMVcOzazi2zuEuzrm2qIcPocrI1PQC+5bOdg2kFQDHbtmtg123tLUMY/n1qT/XyakKVGs9dZKvsee5Y6b1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q/0/XW+VyyWjDVXfWr3/Q/PR1TGoc8FQD6cjIUkdObWXOj4m9Z16Dx3P3Z6H8lylyO6MqlD1LuJWgKw1jFI7elywhmGeS535FKDUObAVIKcOw63h7Lfx1g7Y4hH86nVUkg+3H1ZwXNPDWwCD4RrMOcOjnL0HMhhunaxPvRui/t56ahfgWVJD+jXzbr3RcbhR4FLOixcTIABcl6t5Eh2AyyJAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAiAABILLJGwm/+eab3ZbeeeedXWLr7bwWW+/PdH3XQn1oU2/XtUU92mQ690cvPNpt6elfT3eJrbfzWmy9P9P1XQv1oU29XdcW9cgQFgARAQJAZJNrIKmthzK2Xt/WQzy6+m3XMtRmKOoy1pe6xXqrBwJARIAAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJARIAAEBEgAEQECAARAQJA5KJfKHXrs87e+iyiqVufNdhsypdB/TudHggAEQECQESAABARIABEBAgAEQECQESAABARIABEBAgAEQECQESAABARIABEBAgAkU1m4+W6Xcvso1vP+nwtbn2/3Pps32bjBeDmCBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACIPL/bwNazV9KWzuq59Wyg1zK7qlmD2279+916fVhCDwSAiAABICJAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAiAABICJAAIgIEAAiAgSAyCaz8aauZXbOrd367MZm1V13fVtTb58deiAARAQIABEBAkBEgAAQESAARAQIABEBAkBEgAAQESAARAQIABEBAkBEgAAQESAARC56Nt6UWUvXdeuzzppVt+3WZ32+Fpd8ntADASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASByk7Pxchm2nuU2lW7n1rPVmr35ut1iedEDASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASBiNl6OSmf13Hr20a1ngbW+ddeX2rqc8f/0QACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACI3ORsvFvPBnrrrmUW2K35fuvaer/c+vHbgh4IABEBAkBEgAAQESAARAQIABEBAkBEgAAQESAARAQIABEBAkBEgAAQESAARAQIAJGLno3XrJfX7dZnV03XZ5bbdX8vtfVxT13yeVAPBICIAAEgIkAAiAgQACICBICIAAEgIkAAiAgQACICBICIAAEgIkAAiAgQACICBIDIc3d7OwBYSA8EgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIgIEgIgAASAiQACICBAAIv8H7Y9lJqlPj7MAAAAASUVORK5CYII="
            alt="Qr Code"
            style="margin: 0 auto; display: flex; width: 100px; height: 100px;"
          />
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
      <tr>
        <td>
          <hr style="margin: 8px auto 16px auto; max-width: 800px; border: 1px solid #b3d4fc;" />
        </td>
      </tr>
      <tr style="text-align: center;">
        <td>
          <p style="margin-bottom: 0;">
            This email is sent from <span>{COMPANYNAME}</span> on <span>{DATESENT}</span>
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'QuishingEmailTemplateDefault',
  props: {
    emailTemplateLogo: {
      type: String
    }
  }
}
</script>
