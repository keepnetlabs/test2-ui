# Keepnet Labs Vue 

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### FOR THE DEVELOPMENT
We tried to stick best practices all around this app.
The based design - https://app.zeplin.io/project/5d419f858098ed4529208ac2
Before start, check out our UI Framework - https://vuetifyjs.com/en/
And also for the datatables - https://element.eleme.io/#/en-US/component/table

In the Vue.config.js we transpile some of our dependecies for Internet Explorer and imported main.scssd.
The eslintrc.json file defines rules for prettier, you feel free to change it.
We have 2 different env. file on this app, one for production - one for development.
Backend provide us 3 different api url until now, you can add if any new one appears.
VUE_APP_ROOT_API=https://back.keepnetlabs.com/api - Common usage like login-dashboard etc
VUE_APP_WEB_API=https://tsback.keepnetlabs.com/api - for Threat Sharing api calls
VUE_APP_WEB_API_TEST=https://apitest.keepnetlabs.com/api Investigation etc.

In the main.js file we simply import some of the third parties. The rest for the router,store etc.

We left App.vue just as entry point. Router-view in it and holds all application.

Also VIEWS folder holds each page views. When you have to add a new one, just don't forget to import it ROUTER too.

In the UTILS folder we defined some of our axios requests and intercept some of them for the authenticaton or backend requirements etc. We used this way to generic api calls. You don't have to define axios for each store module or api layer.

STORE basically carries all applications reactivity. We defined different modules and tried to keep them seperated on each module.
INDEX- We import the seperated modules to our store in that file
AUTH- for authentication, redirect login if user not etc.
COMMON- for common needs like loading overlay snack error messages etc. You can call them any module or component to show some error or success messages for the user.
DASHBOARD- holds dashboard page store state and actions.
INVESTIGATIONS- holds investigation page store states and actions.
LOGIN- holds all authentication, forgot password actions and states
THREAD SHARING- holds threat sharing page store states and actions.
TOUR- Tour helper should be on every page for new users, we implemented for this only Dashboard page but you can easily add tour helper to the other pages with this module.

In the SERVICES folder we defined a authentication js which check users auth status, expired or etc. It simply return us user's authentication status.

In the SASS folder we have just one main.scss file. This file has no scope, the styles apply for the all application.

In the ROUTER folder we imported our views. Also AuthenticationStatus and AuthenticationService used here too to do some redirect actions based on user's login status.

In the PLUGINS folder we imported three different plugins for the needs. You can simply add a new one to here like that.

In the MODEL / CONSTANS folder Some types defined for generic usage. You should add new ones if you need generic consts.

One LAYOUT just fine with the design. You can add a new layout if any differences appears on the design. In the Main.vue, menu - topbar - "router-view" and footer defined. When you add a new view with this layout, the page and mentioned components are ready for your created new view.

In the COMPONENTS, we created folders for each view. No need to create folder for Common components. Our component logic Not like Atomic design. Its just like big parts on the app. For example in the Threat Sharing page, we have tabs and right column. We seperated them with create a new component for each tab (Communities, Members, Incidents) and for a new one for Right Information Column (RightColumn). Also this page has a Incident Card, we created a SinglePost component for every post for generic using. Props, datas, store etc defined or got in these components. If you stick on this structure the whole application remains compatible.

ASSETS folder includes our images, SCSS's and our email-templates(mailing). If you add a new of one of these you should add it in this folder.

API folder includes our api calls. A different js file defined and seperated for the pages or authentiation for readability. UTILS imported in these files for different AXIOS requests. We exported every function in them because we imported these on STORE MODULES.
Usualy Components or Views make a Dispatch for call the Store action. And the actions reach the api call through this layers. We should import every api call function beginning of the Module. Then we can call the api call anytime we want. Example: threadSharing.js in the modules. On the 4. line we imported all of the api call functions from api/threadSharing.
Then we can call them like on line 260.

PUBLIC folder includes our predefined index.html for entry point and the favicon also.

The DIST folder created after 'yarn build' or 'npm run build' commands run. This commands transpile and build our applicaion for Publish.