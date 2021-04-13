<template>
  <div class="incident-wrapper">
    <app-modal
      :status="showNewsletterPageGrapes"
      v-if="showNewsletterPageGrapes"
      icon-name="mdi-check"
      title="Edit Post Email"
      z-index="999999"
      :show-header="false"
      id="threat-sharing-post-incident-create-edit-modal"
    >
      <template v-slot:overlay-body>
        <GrapesNewsletterModal
          ref="grapesJsPostIncident"
          :htmlData="editHtmlData"
          v-if="showNewsletterPageGrapes"
          :blockManagerComponents="{}"
        ></GrapesNewsletterModal>
      </template>
      <template v-slot:overlay-footer>
        <v-btn
          class="new-integration__footer-btn-cancel"
          id="threat-sharing-grapesjs-modal-close-button"
          rounded
          @click="closeGrapesJs()"
        >
          {{ labels.Cancel }}
        </v-btn>
        <div class="new-integration__footer__right-col">
          <v-btn
            class="new-integration__footer-btn-save white--text"
            color="#2196f3"
            rounded
            id="threat-sharing-grapesjs-modal-save-button"
            @click="saveGrapesJs()"
          >
            {{ labels.Save }}
          </v-btn>
        </div>
      </template>
    </app-modal>
    <div class="incident-container">
      <div class="incident-inner">
        <v-card
          id="post-incident-card"
          light
          class="incident-card pb-4 pa-6"
          style="border-radius: 0 !important;"
        >
          <v-list-item class="pl-0 pr-0">
            <div class="v-btn v-cart-icon-wrapper">
              <v-icon medium left color="blue" class="ml-2">mdi-send</v-icon>
            </div>
            <v-list-item-content class="pt-0 pb-0">
              <v-list-item-title class="v-card-headline">Post an Incident</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <div id="incident-step-container" class="incident-steps">
            <div id="step-one-container" class="steps">
              <div v-if="step < 2" :class="{ 'active-step': step === 1 }" class="step-number">
                1
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 1,
                  'hide-step': step === 3 || step === 4 || step === 5
                }"
                class="step-name"
                >Select Incident</span
              >
            </div>
            <div class="steps">
              <hr />
            </div>
            <div id="step-two-container" class="steps">
              <div v-if="step < 3" :class="{ 'active-step': step === 2 }" class="step-number">
                2
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 2,
                  'hide-step': step === 1 || step === 4 || step === 5
                }"
                class="step-name"
                >General Info</span
              >
            </div>
            <div class="steps">
              <hr />
            </div>
            <div id="step-three-container" class="steps">
              <div v-if="step < 4" :class="{ 'active-step': step === 3 }" class="step-number">
                3
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 3,
                  'hide-step': step === 1 || step === 2 || step === 5
                }"
                class="step-name"
                >Incident Details</span
              >
            </div>
            <div class="steps">
              <hr />
            </div>
            <div id="step-four-container" class="steps">
              <div v-if="step < 5" :class="{ 'active-step': step === 4 }" class="step-number">
                4
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 4,
                  'hide-step': step === 1 || step === 2 || step === 3
                }"
                class="step-name"
                >Attributes</span
              >
            </div>
            <div class="steps">
              <hr />
            </div>
            <div id="step-five-container" class="steps">
              <div v-if="step < 6" :class="{ 'active-step': step === 5 }" class="step-number">
                5
              </div>
              <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
              <span
                :class="{
                  'active-step-span': step === 5,
                  'hide-step': step === 1 || step === 2 || step === 3 || step === 4
                }"
                class="step-name"
                >Preview</span
              >
            </div>
          </div>
          <div id="post-step-one" v-if="step === 1">
            <!-- Step 1 Starts -->
            <div class="incident-header pb-6">
              <p>Select Incident</p>
              <span
                >Search for the reported incident or upload an email to post as an incident</span
              >
            </div>
            <div v-if="!selectedEmail" class="incident-content">
              <div class="input-header">Find Incident</div>
              <div class="input-sub">Search and find emails among reported incidents</div>
              <input style="display: none;" type="text" name="fakeusernameremembered" />
              <k-select
                type="autocomplete"
                id="threat-sharing-select-incident-autocomplete"
                v-model.trim="selectedEmail"
                :search-input.sync="searchIncident"
                :items="listData"
                chips
                clearable
                hide-selected
                no-filter
                label="Search for incident name or status"
                class="first-select input-select mb-6 no-action-on-click"
                solo
                :rules="autocomplete"
                required
                :loading="isFindIncidentLoading"
                :hide-no-data="isFindIncidentLoading"
                @change="getSelectedEmailPreview"
                @focus="handleLoadingState"
                @input="handleTagItemChange"
                @click:append="handleTagItemChange"
                @click:append-outer="handleTagItemChange"
                :slots="{ selection: true, item: true, progress: true }"
                autocomplete="off"
              >
                <template v-slot:selection="{ attrs, item }">
                  <v-chip
                    id="select-inc-chip"
                    v-bind="attrs"
                    color="#2196f3"
                    :input-value="item.subject"
                    label
                    small
                  >
                    <span class="pr-2">{{ item.subject }}</span>
                  </v-chip>
                </template>
                <template v-slot:item="{ item }">
                  <div class="select-row-wrap">
                    <div class="email-name">{{ item.subject }}</div>
                    <div class="select-row-inline">
                      <div class="file-type-wrap">
                        <v-icon
                          :style="{
                            visibility: item.attachmentCount != 0 ? 'visible' : 'hidden'
                          }"
                          class="email-icon"
                          >mdi-paperclip
                        </v-icon>
                        <div
                          class="email-type"
                          :class="[
                            item.result === 'BeingAnalyzed' ? 'btn-pending' : '',
                            item.result === 'Malicious' ? 'btn-cancelled' : '',
                            item.result === 'non-malicious' ? 'btn-active' : '',
                            item.result === 'Phishing' ? 'btn-warning' : ''
                          ]"
                        >
                          <span>{{ item.result }}</span>
                        </div>
                      </div>
                      <div id="email-time" class="email-time">{{ item.createTime }}</div>
                    </div>
                  </div>
                </template>
                <template v-slot:progress>
                  <k-select-loading v-show="showLoader" />
                </template>
              </k-select>
              <div class="input-header mb-6">- or -</div>
              <div class="input-header">Upload Email</div>
              <div class="input-sub">.eml or .msg files only.</div>
              <div class="upload-wrapper">
                <k-file-upload
                  ref="refFileUpload"
                  :extensions="['eml', 'msg']"
                  :is-stand-alone="true"
                  @inputFile="uploadFile"
                  @clear="clearUpload"
                  :on-upload-progress="onUploadProgress"
                  id="threat-sharing-upload-post-incident"
                />
                <!-- <div
                  class="v-input up-btn v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--placeholder"
                  id="upload-btn"
                >
                  <div class="v-input__prepend-outer">
                    <div class="v-input__icon v-input__icon--prepend">
                      <i
                        role="button"
                        tabindex="0"
                        class="v-icon notranslate v-icon--link material-icons theme--light"
                        >false</i
                      >
                    </div>
                  </div>
                  <div class="v-input__control">
                    <div class="v-input__slot">
                      <div class="v-input__prepend-inner">
                        <div class="v-input__icon v-input__icon--prepend-inner">
                          <i class="v-icon notranslate mdi mdi-upload theme--light"></i>
                        </div>
                      </div>
                      <div class="v-text-field__slot">
                        <div class="v-file-input__text v-file-input__text--placeholder">Upload</div>
                        <input
                          name="file"
                          id="upload-file-input"
                          type="file"
                          @change="uploadFile"
                          accept=".eml,.msg"
                        />
                      </div>
                    </div>
                  </div>
                </div> -->
              </div>

              <span
                id="post-first-error"
                v-if="selectedEmail || msgEmlFile == null"
                class="select-error"
                >Please select an incident or upload an email</span
              >
            </div>
            <div id="post-first-preview-container" class="mt-2" v-else-if="selectedEmail">
              <v-card
                id="post-first-preview-card"
                light
                class="pb-4 pt-0 mt-2 pa-6 investigation-content"
                style="width: 600px;"
              >
                <div class="mail-preview">
                  <v-icon
                    id="threat-sharing-post-first-preview-close"
                    v-if="!editItem"
                    class="close-incident"
                    @click="closePreview()"
                    >mdi-close-circle
                  </v-icon>
                  <PreviewHeaderForSinglePost :uploadRespond="uploadRespond" />
                  <div id="last-preview-body-preview" class="preview-body">
                    <k-shadow-frame
                      id="incident-preview-1"
                      :content="uploadRespond.visibleBody || uploadRespond.initialBody"
                    />
                  </div>
                  <div
                    id="preview-footer-container-att-preview"
                    class="preview-footer"
                    v-if="!!uploadRespond.attachments && uploadRespond.attachments.length"
                  >
                    <h2>Attachments</h2>
                    <div class="attachment-wrapper">
                      <div
                        v-for="(att, ind) of uploadRespond.attachments"
                        :key="ind + att.id"
                        :id="'attachment-' + att.name"
                        class="attachment red-attach"
                        :class="[
                          att.isFlagged ? 'red-attach' : '',
                          !att.isFlagged ? 'blue-attach' : '',
                          !att.isHidden ? 'clean-attach' : ''
                        ]"
                      >
                        <AttachmentsPreview :att="att" />
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </div>
          </div>
          <div id="post-step-two" class="step-container" v-if="step === 2">
            <div class="incident-header">
              <p>General Info</p>
              <span>
                Include title, description of incident and neccessary files(pics, documents, or
                code)
              </span>
            </div>
            <div class="incident-content">
              <div class="input-header">Title</div>
              <v-form onSubmit="return false;" v-model="valid" ref="titleInput">
                <v-text-field
                  id="post-title-text-field"
                  placeholder="Enter Title"
                  @mouseover.native="hover = true"
                  label="Title"
                  outlined
                  dense
                  class="title-field filter-field pt-4"
                  v-model.trim="uploadRespond.Title"
                  solo
                  validate-on-blur
                  :rules="[
                    titleRule.default,
                    titleRule.regex,
                    titleRule.required,
                    titleRule.empty,
                    titleRule.minLength
                  ]"
                  hint="*Required"
                  persistent-hint
                ></v-text-field>
              </v-form>
              <!--<span class="required">*Required</span>-->
              <div class="input-header pt-6">Description</div>
              <div class="input-sub pb-1">Describe the incident briefly (Max. 300 characters)</div>
              <v-form onSubmit="return false;" v-model="valid" ref="descriptionInput">
                <v-textarea
                  id="post-description-textarea"
                  @mouseover.native="hover = true"
                  outlined
                  placeholder="Enter Description"
                  dense
                  auto-grow
                  class="comment-input"
                  rows="5"
                  row-height="15"
                  solo
                  validate-on-blur
                  :rules="[descRule.required, descRule.empty, descRule.default, descRule.minLength]"
                  v-model.trim="uploadRespond.Description"
                  hint="*Required"
                  persistent-hint
                ></v-textarea>
              </v-form>

              <div class="input-header pt-6">Category</div>
              <div class="input-sub pb-1">Select threat categories</div>
              <v-form onSubmit="return false;" v-model="categoryValid" ref="categoryInput">
                <k-select
                  id="post-category-select"
                  class="cat-select"
                  v-model.trim="uploadRespond.CategoryResourceIdArray"
                  :items="categories"
                  item-value="resourceId"
                  item-text="name"
                  placeholder="Select the category"
                  chips
                  deletable-chips
                  requied
                  solo
                  multiple
                  outlined
                  required
                  :rules="category"
                  :class="{
                    'errored-selectbox':
                      uploadRespond &&
                      uploadRespond.CategoryResourceIdArray &&
                      uploadRespond.CategoryResourceIdArray.length < 1
                  }"
                  hint="*Required"
                  persistent-hint
                >
                  <template v-slot:append-item></template>
                </k-select>
              </v-form>
              <!--<span class="required">*Required</span>-->

              <div class="input-header pt-6">Security Label (TLP)</div>
              <div class="input-sub pb-1">
                Use TLP labels to inform recipients about how to share sensitive information. Please
                visit
                <a
                  href="https://www.cisa.gov/tlp#:~:text=The%20Traffic%20Light%20Protocol%20(TLP,by%20the%20recipient(s)."
                  class="text-primary"
                  target="_blank"
                  >Traffic Light Protocol</a
                >
                for more information.
              </div>
              <v-form>
                <k-select
                  v-model="value"
                  :items="items2"
                  :return-object="false"
                  outlined
                  placeholder="Select an option"
                  class="tlp-select"
                  position="top"
                  :slots="{ selection: true, item: true }"
                  hint="*Required"
                  persistent-hint
                >
                  <template v-slot:selection="{ attrs, item, select }">
                    <v-chip @click="select" :class="item.cssClass">
                      <span>{{ item.text }}</span>
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                      <v-list-item-subtitle class="tlp_subtitle">{{
                        item.desc
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-avatar>
                      <div
                        :style="{
                          backgroundColor: item.color,
                          width: '16px',
                          height: '16px',
                          border: '1px solid #000000'
                        }"
                      ></div>
                    </v-list-item-avatar>
                  </template>
                </k-select>
              </v-form>
            </div>
          </div>
          <div id="post-step-three" class="step-container" v-if="step === 3">
            <div class="incident-header">
              <p>Incident Details</p>
              <span>
                Enter information on discovery of threat, how it affects and how to fight against
              </span>
            </div>
            <div class="incident-content">
              <div class="input-header">Discovery and Detection</div>
              <div class="input-sub">
                Explain how the threat was detected and what tools were used?
              </div>
              <v-form onSubmit="return false;" v-model="validDisc" ref="discoveryInput">
                <v-textarea
                  id="post-discovery-textarea"
                  v-model.trim="uploadRespond.DiscoveryAndDetection"
                  @mouseover.native="hover = true"
                  outlined
                  dense
                  placeholder="Enter discovery and detection"
                  auto-grow
                  class="comment-input"
                  rows="5"
                  row-height="15"
                  solo
                  @input="$forceUpdate()"
                  :rules="
                    uploadRespond.DiscoveryAndDetection
                      ? [
                          explanationRules.empty,
                          explanationRules.minLength,
                          explanationRules.required
                        ]
                      : []
                  "
                ></v-textarea>
              </v-form>

              <div class="input-header pb-5 pt-7">Impact Range</div>
              <div class="input-sec-header">Affect Area</div>
              <div class="input-sub">Which systems and programs are affected by the threat?</div>
              <v-form onSubmit="return false;" v-model="validAffect" ref="affectInput">
                <k-select
                  type="combobox"
                  id="post-affect-area-combobox"
                  v-model.trim="uploadRespond.AffectArea"
                  :search-input.sync="affectSearch"
                  label="Windows 10 etc."
                  multiple
                  :clearable="true"
                  append-icon
                  chips
                  deletable-chips
                  class="affect-combobox affect-input"
                  @keyup.tab="updateTags"
                  solo
                  outlined
                  dense
                  validate-on-blur
                  @blur="validateAffectArea"
                  :rules="[affectRules.regex]"
                  @input="handleTagItemChange"
                ></k-select>
              </v-form>

              <div class="input-sec-header pt-3">Scope</div>
              <div class="input-sub">How does it work and affect your systems?</div>
              <v-form onSubmit="return false;" v-model="validScope" ref="scopeInput">
                <v-text-field
                  id="post-scope-textfield"
                  @mouseover.native="hover = true"
                  label="Explain"
                  outlined
                  dense
                  class="filter-field"
                  v-model.trim="uploadRespond.Scope"
                  solo
                  validate-on-blur
                  ref="scopeTextField"
                  @input="$forceUpdate()"
                  :rules="
                    uploadRespond.Scope
                      ? [
                          scopeRules.regex,
                          scopeRules.empty,
                          scopeRules.minLength,
                          scopeRules.required
                        ]
                      : []
                  "
                ></v-text-field>
              </v-form>
            </div>
          </div>
          <div id="post-step-four" v-if="step === 4">
            <!-- Step 4 Starts -->
            <div class="investigate-header">
              <p>Select Attributes To Share</p>
              <span>
                Hide the information you want to exclude when sharing. You must share at least 1
                attribute. Mark harmful attributes to let others know about them.
              </span>
            </div>
            <div class="investigation-content">
              <div class="mail-preview">
                <PreviewHeader :uploadRespond="uploadRespond" />
                <div class="preview-header position-relative">
                  <h2
                    v-if="uploadRespond.editableBody || uploadRespond.visibleBody"
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                  >
                    Body
                  </h2>
                  <v-btn
                    id="threat-sharing-post-incident-edit-html-button"
                    class="create-btn v-btn v-btn--flat v-btn--text theme--dark v-size--default edit-html-template-button"
                    @click="editHtmlTemplate"
                  >
                    <v-icon class="mr-2 text-h6">mdi-pencil</v-icon> Edit</v-btn
                  >
                </div>

                <div
                  v-if="uploadRespond.editableBody || uploadRespond.initialBody"
                  id="last-preview-body-preview"
                  class="preview-body"
                >
                  <k-shadow-frame
                    id="last-preview-body-shadow-root"
                    :content="uploadRespond.editableBody || uploadRespond.initialBody"
                  />
                </div>
                <div
                  v-if="uploadRespond.editableBody || uploadRespond.initialBody"
                  id="last-preview-body-preview"
                  class="preview-body"
                  style="display: none;"
                >
                  <k-shadow-frame
                    id="last-preview-body-shadow-root-for-preview"
                    :content="uploadRespond.visibleBodyForPreview"
                  />
                </div>
                <div
                  id="preview-footer-container-att-preview"
                  class="preview-footer"
                  v-if="!!uploadRespond.attachments && uploadRespond.attachments.length"
                >
                  <h2>Attachments</h2>
                  <div class="attachment-wrapper">
                    <div
                      v-for="(att, ind) of uploadRespond.attachments"
                      :key="ind + att.id"
                      :id="'attachment-' + att.name"
                      class="attachment red-attach"
                      :class="[
                        att.isFlagged ? 'red-attach' : '',
                        !att.isFlagged ? 'blue-attach' : '',
                        !att.isHidden ? 'clean-attach' : ''
                      ]"
                    >
                      <AttachmentsPreview :att="att" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="post-filters"
                :class="{ 'minify-filter': !filterOpened }"
                class="investigation-filters"
              >
                <div class="investigation-filters__area">
                  <div class="d-flex justify-space-between investigation-filters__area--filter">
                    <div class="d-flex">
                      <span class="investigation-filters__area--filter__title">Hide</span>
                    </div>
                    <div class="d-flex">
                      <span class="investigation-filters__area--filter__title mr-4">Mark as</span>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between investigation-filters__area--filter">
                    <div class="d-flex" v-if="uploadRespond.subject">
                      <v-checkbox
                        v-model="allHeader"
                        @change="headerValChange"
                        hide-details
                        :indeterminate="checkHeaderSelected && !this.allHeader"
                      ></v-checkbox>
                      <label v-if="filterOpened">All Header</label>
                    </div>
                    <div class="d-flex">
                      <div class="img-wrapper mr-10">
                        <v-icon>mdi-menu</v-icon>
                        <span class="investigation-filters__area--filter__all-header">All</span>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between investigation-filters__area--filter">
                    <div class="d-flex" v-if="uploadRespond.subject">
                      <v-checkbox
                        v-model="uploadRespond.isSubjectHidden"
                        @change="subjectValChange"
                        hide-details
                        off-icon="mdi-eye"
                        on-icon="mdi-eye-off"
                      ></v-checkbox>
                      <label v-if="filterOpened">Subject</label>
                    </div>
                    <div class="d-flex">
                      <div v-if="!uploadRespond.isSubjectFlagged" class="img-wrapper">
                        <v-icon>mdi-text-short</v-icon>
                      </div>
                      <div v-else class="img-wrapper">
                        <v-icon color="#f56c6c">mdi-text-short</v-icon>
                      </div>
                      <v-menu
                        :disabled="uploadRespond.isSubjectHidden"
                        v-model="subSettings"
                        right
                        offset-x
                        transition="scale-transition"
                        @click="subSettings = !subSettings"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            id="threat-sharing-post-incident-subject-hidden"
                            class="chevron-btn-menu"
                            icon
                            :class="{ 'disabled-chevron': uploadRespond.isSubjectHidden }"
                          >
                            <v-icon :class="{ 'chevron-down': subSettings }" v-on="on"
                              >mdi-chevron-down
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isSubjectFlagged = false"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="!uploadRespond.isSubjectFlagged">mdi-check</v-icon>
                              </div>
                              None
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isSubjectFlagged = true"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="uploadRespond.isSubjectFlagged">mdi-check</v-icon>
                              </div>
                              Flagged Subject
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between investigation-filters__area--filter">
                    <div class="d-flex" v-if="uploadRespond.from">
                      <v-checkbox
                        v-model="uploadRespond.isFromHidden"
                        @change="fromValChange"
                        hide-details
                        off-icon="mdi-eye"
                        on-icon="mdi-eye-off"
                      ></v-checkbox>
                      <label v-if="filterOpened">From</label>
                    </div>
                    <div class="d-flex">
                      <div v-if="!uploadRespond.isFromFlagged" class="img-wrapper">
                        <v-icon>mdi-account-arrow-right</v-icon>
                      </div>
                      <div v-else class="img-wrapper">
                        <v-icon color="#f56c6c">mdi-account-arrow-right</v-icon>
                      </div>
                      <v-menu
                        :disabled="uploadRespond.isFromHidden"
                        v-model="fromSettings"
                        right
                        offset-x
                        transition="scale-transition"
                        @click="fromSettings = !fromSettings"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            id="threat-sharing-post-incident-from-hidden"
                            class="chevron-btn-menu"
                            icon
                            :class="{ 'disabled-chevron': uploadRespond.isFromHidden }"
                          >
                            <v-icon :class="{ 'chevron-down': fromSettings }" v-on="on"
                              >mdi-chevron-down
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isFromFlagged = false"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="!uploadRespond.isFromFlagged">mdi-check</v-icon>
                              </div>
                              None
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isFromFlagged = true"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="uploadRespond.isFromFlagged">mdi-check</v-icon>
                              </div>
                              Flagged From
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-space-between investigation-filters__area--filter"
                    v-if="uploadRespond.to && uploadRespond.to.length"
                  >
                    <div class="d-flex" v-if="uploadRespond.to && uploadRespond.to.length">
                      <v-checkbox
                        v-model="uploadRespond.isToHidden"
                        @change="toValChange"
                        hide-details
                        off-icon="mdi-eye"
                        on-icon="mdi-eye-off"
                      ></v-checkbox>
                      <label v-if="filterOpened">To</label>
                    </div>
                    <div class="d-flex">
                      <div class="img-wrapper toFlagged">
                        <v-icon :color="uploadRespond.isToFlagged ? '#f56c6c' : ''"
                          >mdi-account-arrow-left</v-icon
                        >
                      </div>
                      <v-menu
                        :disabled="uploadRespond.isToHidden"
                        v-model="toSettings"
                        right
                        offset-x
                        transition="scale-transition"
                        @click="toSettings = !toSettings"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            id="threat-sharing-post-incident-to-hidden"
                            class="chevron-btn-menu"
                            icon
                            :class="{ 'disabled-chevron': uploadRespond.isToHidden }"
                          >
                            <v-icon :class="{ 'chevron-down': toSettings }" v-on="on"
                              >mdi-chevron-down
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isToFlagged = false"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="!uploadRespond.isToFlagged">mdi-check</v-icon>
                              </div>
                              None
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isToFlagged = true"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="uploadRespond.isToFlagged">mdi-check</v-icon>
                              </div>
                              Flagged To
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-space-between investigation-filters__area--filter"
                    v-if="uploadRespond.cc && uploadRespond.cc.length"
                  >
                    <div class="d-flex" v-if="uploadRespond.cc && uploadRespond.cc.length">
                      <v-checkbox
                        v-model="uploadRespond.isCcHidden"
                        @change="ccValChange"
                        hide-details
                        off-icon="mdi-eye"
                        on-icon="mdi-eye-off"
                      ></v-checkbox>
                      <label v-if="filterOpened">CC</label>
                    </div>
                    <div class="d-flex">
                      <div class="img-wrapper ccFlagged">
                        <v-icon :color="uploadRespond.isCcFlagged ? '#f56c6c' : ''"
                          >mdi-account-arrow-left</v-icon
                        >
                      </div>
                      <v-menu
                        :disabled="uploadRespond.isCcHidden"
                        v-model="ccSettings"
                        right
                        offset-x
                        transition="scale-transition"
                        @click="ccSettings = !ccSettings"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            id="threat-sharing-post-incident-cc-hidden"
                            class="chevron-btn-menu"
                            icon
                            :class="{ 'disabled-chevron': uploadRespond.isCcHidden }"
                          >
                            <v-icon :class="{ 'chevron-down': ccSettings }" v-on="on"
                              >mdi-chevron-down
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isCcFlagged = false"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="!uploadRespond.isCcFlagged">mdi-check</v-icon>
                              </div>
                              None
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isCcFlagged = true"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="uploadRespond.isCcFlagged">mdi-check</v-icon>
                              </div>
                              Flagged CC
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-space-between investigation-filters__area--filter"
                    v-if="uploadRespond.bcc && uploadRespond.bcc.length"
                  >
                    <div class="d-flex" v-if="uploadRespond.bcc && uploadRespond.bcc.length">
                      <v-checkbox
                        v-model="uploadRespond.isBccHidden"
                        @change="bccValChange"
                        hide-details
                        off-icon="mdi-eye"
                        on-icon="mdi-eye-off"
                      ></v-checkbox>
                      <label v-if="filterOpened">BCC</label>
                    </div>
                    <div class="d-flex">
                      <div class="img-wrapper bccFlagged">
                        <v-icon :color="uploadRespond.isBccFlagged ? '#f56c6c' : ''"
                          >mdi-account-arrow-left</v-icon
                        >
                      </div>
                      <v-menu
                        :disabled="uploadRespond.isBccHidden"
                        v-model="bccSettings"
                        right
                        offset-x
                        transition="scale-transition"
                        @click="bccSettings = !bccSettings"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            id="threat-sharing-post-incident-bcc-hidden"
                            class="chevron-btn-menu"
                            icon
                            :class="{ 'disabled-chevron': uploadRespond.isBccHidden }"
                          >
                            <v-icon :class="{ 'chevron-down': bccSettings }" v-on="on"
                              >mdi-chevron-down
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isBccFlagged = false"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="!uploadRespond.isBccFlagged">mdi-check</v-icon>
                              </div>
                              None
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="uploadRespond.isBccFlagged = true"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="uploadRespond.isBccFlagged">mdi-check</v-icon>
                              </div>
                              Flagged BCC
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                </div>
                <div
                  class="investigation-filters__area--breaker"
                  v-if="uploadRespond.urls && !!uploadRespond.urls.length"
                >
                  <div class="investigation-filters__area--breaker__line"></div>
                </div>
                <div
                  class="investigation-filters__area"
                  v-if="uploadRespond.urls && !!uploadRespond.urls.length"
                >
                  <div class="d-flex justify-space-between investigation-filters__area--filter">
                    <div class="d-flex">
                      <v-checkbox
                        v-model="allLinks"
                        @change="allUrlsValChange"
                        :indeterminate="
                          uploadRespond.urls.find((item) => item.isHidden) && !allLinks
                        "
                        hide-details
                      ></v-checkbox>
                      <label v-if="filterOpened">All Links</label>
                    </div>
                    <div class="d-flex">
                      <div class="img-wrapper mr-10">
                        <v-icon>mdi-link</v-icon
                        ><span class="investigation-filters__area--filter__all-header">All</span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-space-between investigation-filters__area--filter"
                    v-for="(url, ind) of uploadRespond.urls"
                    :key="ind + url.url"
                    :id="ind + url.url"
                  >
                    <div class="d-flex">
                      <v-checkbox
                        v-model="url.isHidden"
                        @change="urlSwitchChange(url, ind)"
                        hide-details
                        off-icon="mdi-eye"
                        on-icon="mdi-eye-off"
                      ></v-checkbox>
                      <v-tooltip bottom opacity="1" z-index="9999">
                        <template v-slot:activator="{ on }">
                          <label
                            v-on="on"
                            v-if="filterOpened"
                            class="investigation-filters__area--filter--label"
                            >{{ url.name || url.url }}
                            <span class="url-badge">{{ url.orderNumber }}</span></label
                          >
                        </template>
                        <span class="tool">{{ url.name || url.url }}</span>
                      </v-tooltip>
                    </div>
                    <div class="d-flex">
                      <div class="img-wrapper">
                        <v-icon :color="url.isFlagged ? '#f56c6c' : ''">mdi-link</v-icon>
                      </div>
                      <v-menu
                        v-model="attcChevron[ind]"
                        right
                        offset-x
                        transition="scale-transition"
                        :disabled="url.isHidden"
                        @click="attcChevron[ind] = !attcChevron[ind]"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            :id="`threat-sharing-post-incident-urls-${ind}`"
                            class="chevron-btn-menu"
                            icon
                            :class="{ 'disabled-chevron': url.isHidden }"
                          >
                            <v-icon :class="{ 'chevron-down': attcChevron[ind] }" v-on="on"
                              >mdi-chevron-down
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="url.isFlagged = false"
                            @change="urlSwitchChange(url, ind)"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="!url.isFlagged">mdi-check</v-icon>
                              </div>
                              None
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="url.isFlagged = true"
                            @change="urlSwitchChange(url, ind)"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="url.isFlagged">mdi-check</v-icon>
                              </div>
                              Phishing Link
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                </div>
                <div
                  class="investigation-filters__area--breaker"
                  v-if="uploadRespond.attachments && !!uploadRespond.attachments.length"
                >
                  <div class="investigation-filters__area--breaker__line"></div>
                </div>
                <div
                  class="investigation-filters__area"
                  v-if="uploadRespond.attachments && !!uploadRespond.attachments.length"
                >
                  <div class="d-flex justify-space-between investigation-filters__area--filter">
                    <div class="d-flex">
                      <v-checkbox
                        v-model="allAttachments"
                        @change="allAttachmentsValChange"
                        :indeterminate="
                          uploadRespond.attachments.find((item) => item.isHidden) && !allAttachments
                        "
                        hide-details
                      ></v-checkbox>
                      <label v-if="filterOpened">All Attachments</label>
                    </div>
                    <div class="d-flex">
                      <div class="img-wrapper mr-10">
                        <v-icon>mdi-paperclip</v-icon
                        ><span class="investigation-filters__area--filter__all-header">All</span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-space-between investigation-filters__area--filter"
                    v-for="(attachment, ind) of uploadRespond.attachments"
                    :key="ind + attachment.name"
                  >
                    <div class="d-flex">
                      <v-checkbox
                        v-model="attachment.isHidden"
                        @change="checkAttachmentsChangeForAllLinksSwitch(attachment, ind)"
                        hide-details
                        off-icon="mdi-eye"
                        on-icon="mdi-eye-off"
                      ></v-checkbox>
                      <v-tooltip bottom opacity="1" z-index="9999">
                        <template v-slot:activator="{ on }">
                          <label
                            v-on="on"
                            v-if="filterOpened"
                            class="investigation-filters__area--filter--label"
                            >{{ attachment.name }}</label
                          >
                        </template>
                        <span>{{ attachment.name }}</span>
                      </v-tooltip>
                    </div>
                    <div class="d-flex">
                      <div class="img-wrapper">
                        <v-icon :color="attachment.isFlagged ? '#f56c6c' : ''"
                          >mdi-paperclip</v-icon
                        >
                      </div>
                      <v-menu
                        v-model="urls[ind]"
                        isHidden
                        right
                        offset-x
                        transition="scale-transition"
                        :disabled="attachment.isHidden"
                        @click="urls[ind] = !urls[ind]"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            :id="`threat-sharing-post-incident-attachments-${ind}`"
                            class="chevron-btn-menu"
                            icon
                            :class="{ 'disabled-chevron': attachment.isHidden }"
                          >
                            <v-icon :class="{ 'chevron-down': urls[ind] }" v-on="on"
                              >mdi-chevron-down
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="attachment.isFlagged = false"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="!attachment.isFlagged">mdi-check</v-icon>
                              </div>
                              None
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            class="pl-1 mal-list-wrapper"
                            @click="attachment.isFlagged = true"
                          >
                            <v-list-item-title class="mal-list-row">
                              <div class="mal-icon-wrapper">
                                <v-icon v-if="attachment.isFlagged">mdi-check</v-icon>
                              </div>
                              Malicious File
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                </div>
                <span v-if="allFiltersClosed()" class="filter-no-selected" id="select-one-attr"
                  >Please select at least 1 attribute</span
                >
              </div>
            </div>
          </div>
          <div id="post-step-five" v-if="step === 5">
            <!-- Step 5 Stars here -->
            <div class="incident-header pb-8">
              <p>Preview</p>
              <span>See how your post will look like</span>
            </div>
            <v-checkbox
              class="is-anonym-check"
              v-model="isAnonym"
              label="Post as anonymous"
              color="#2196f3"
              id="anonym-check"
            ></v-checkbox>
            <div id="last-preview-post" class="post-wrapper">
              <v-expansion-panels :multiple="false" v-model="panel" class="mb-4">
                <v-expansion-panel>
                  <div class="threat-sharing-content">
                    <div class="ts-header">
                      <div id="last-preview-title" class="ts-title">
                        <span v-if="uploadRespond.subject">{{ uploadRespond.Title }}</span>
                        <span v-else>Post Title</span>
                      </div>
                      <div class="flex-grow-1"></div>
                      <div class="ts-header-btn-1">
                        <v-expansion-panel-header
                          id="last-preview-collapse-container"
                          class="pa-0"
                          style="min-height: 36px;"
                          @click="toggle = !toggle"
                          disable-icon-rotate
                          ref="expandIncident"
                        >
                          <template v-slot:actions mandatory="true">
                            <v-btn
                              id="threat-sharing-post-incident-last-preview-collapse"
                              v-if="!toggle"
                              outlined
                              rounded
                              medium
                              color="blue"
                              >COLLAPSE
                            </v-btn>
                            <v-btn
                              id="threat-sharing-post-incident-last-preview-details"
                              v-else
                              outlined
                              rounded
                              medium
                              color="blue"
                              >DETAILS
                            </v-btn>
                          </template>
                        </v-expansion-panel-header>
                      </div>
                    </div>

                    <div class="ts-user-comp">
                      <div id="last-prev-user-comp" class="ts-user-comp-detail">
                        by
                        <b v-if="uploadRespond.from" class="pl-1 pr-1">
                          <span v-if="!isAnonym">{{ getByValue() }}</span>
                          <span v-else>Anonymous</span>
                        </b>
                        <a v-else href="#" class="pl-1 pr-1">{{ getFromValue() }}</a>
                        from
                        <b v-if="currentCompany" :id="currentCompany" class="pl-1 pr-1">
                          <span v-if="!isAnonym">{{ currentCompany }}</span>
                          <span v-else>Anonymous</span>
                        </b>
                        <a v-else class="pl-1 pr-1">Company Name</a> on
                        <a class="pl-1 pr-1">
                          {{ currentCommunityName }}
                        </a>
                      </div>
                      <div class="ts-user-date">
                        <span>{{ uploadRespond.sentTime }}</span>
                      </div>
                    </div>
                    <div class="ts-body">
                      <v-clamp
                        v-if="uploadRespond.Description"
                        :id="uploadRespond.Description"
                        autoresize
                        :max-lines="3"
                        >{{ uploadRespond.Description }}
                      </v-clamp>
                    </div>
                    <div id="post-inc-preview-footer" class="ts-footer d-flex row wrap">
                      <div class="ts-like mt-1">
                        <v-btn
                          id="threat-sharing-post-incident-like-button"
                          text
                          x-small
                          icon
                          color="grey"
                        >
                          <v-icon>mdi-thumb-up</v-icon>
                        </v-btn>
                        <span class="ts-action-counter">0</span>
                      </div>
                      <div class="ts-message mt-1">
                        <v-btn
                          id="threat-sharing-post-incident-reply-button"
                          text
                          x-small
                          icon
                          color="grey"
                        >
                          <v-icon>mdi-message-reply-text</v-icon>
                        </v-btn>
                        <span class="ts-action-counter">0</span>
                      </div>
                      <div class="ts-harmful mt-1">
                        <v-btn
                          id="threat-sharing-post-incident-malicious-count"
                          v-if="maliciousCount"
                          text
                          x-small
                          icon
                          color="red"
                        >
                          <v-icon style="font-size: 14px;">mdi-alert-circle</v-icon>
                        </v-btn>
                        <span class="ts-actions">{{ maliciousCount }} harmful item(s)</span>
                      </div>
                      <div class="flex-grow-1"></div>
                      <div class="ts-tags">
                        <v-btn
                          v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                          text
                          small
                          rounded
                          outlined
                          class="tag-btn text-none"
                          id="threat-sharing-post-incident-last-prev-attach"
                        >
                          <span v-if="uploadRespond.attachments.length === 1">Attachment</span>
                          <span v-else-if="uploadRespond.attachments.length > 1">Attachments</span>
                        </v-btn>
                        <v-btn
                          v-if="
                            uploadRespond.CategoryResourceIdArray &&
                            uploadRespond.CategoryResourceIdArray.length
                          "
                          text
                          small
                          rounded
                          outlined
                          class="tag-btn ml-1 text-none"
                          id="threat-sharing-post-incident-badge"
                          >{{ findCategory(uploadRespond.CategoryResourceIdArray[0]) }}
                        </v-btn>
                        <v-btn
                          v-if="
                            uploadRespond.CategoryResourceIdArray &&
                            uploadRespond.CategoryResourceIdArray.length > 1 &&
                            uploadRespond.attachments &&
                            !uploadRespond.attachments.length
                          "
                          text
                          small
                          rounded
                          outlined
                          class="tag-btn ml-1 text-none"
                          id="threat-sharing-post-incident-badge-attach"
                          >{{ findCategory(uploadRespond.CategoryResourceIdArray[1]) }}
                        </v-btn>
                        <div style="position: relative;">
                          <v-btn
                            v-if="
                              (uploadRespond.attachments &&
                                uploadRespond.attachments.length &&
                                uploadRespond.CategoryResourceIdArray &&
                                uploadRespond.CategoryResourceIdArray.length > 1) ||
                              (uploadRespond.CategoryResourceIdArray &&
                                uploadRespond.CategoryResourceIdArray.length > 2)
                            "
                            text
                            small
                            rounded
                            outlined
                            class="tag-btn ml-1 text-none"
                            @mouseover="hoverTool = true"
                            @mouseleave="hoverTool = false"
                            id="threat-sharing-post-incident-last-prev-with-tooltip"
                          >
                            <span
                              v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                              >+{{ uploadRespond.CategoryResourceIdArray.length - 1 }}</span
                            >
                            <span v-else
                              >+{{ uploadRespond.CategoryResourceIdArray.length - 2 }}</span
                            >
                          </v-btn>
                          <div
                            v-if="
                              hoverTool &&
                              uploadRespond.CategoryResourceIdArray &&
                              uploadRespond.CategoryResourceIdArray.length >= 1
                            "
                            class="tooltip-wrapper"
                          >
                            <div
                              v-if="
                                uploadRespond.attachments.length &&
                                uploadRespond.CategoryResourceIdArray &&
                                uploadRespond.CategoryResourceIdArray.length === 4
                              "
                            >
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[1])
                              }}</span>
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[2])
                              }}</span>
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[3])
                              }}</span>
                            </div>
                            <div v-else-if="uploadRespond.attachments.length">
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[1])
                              }}</span>
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[2])
                              }}</span>
                            </div>
                            <div
                              v-else-if="
                                uploadRespond.attachments.length &&
                                uploadRespond.CategoryResourceIdArray &&
                                uploadRespond.CategoryResourceIdArray.length === 1
                              "
                            >
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[1])
                              }}</span>
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[2])
                              }}</span>
                            </div>
                            <div v-else-if="!uploadRespond.attachments.length">
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[2])
                              }}</span>
                              <span>{{
                                findCategory(uploadRespond.CategoryResourceIdArray[3])
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <v-expansion-panel-content
                    eager
                    class="expand-body member-company-body pb-3 pa-0"
                  >
                    <v-tabs
                      v-model="tab"
                      background-color="transparent"
                      color="basil"
                      class="tab-bar v-tabs-bar__details-tab"
                      id="last-prev-tabs"
                    >
                      <v-tab>Email Preview</v-tab>
                      <v-tab>Details</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                      <v-tab-item>
                        <div class="mail-preview">
                          <PreviewHeaderForSinglePost :uploadRespond="uploadRespond" />
                          <div class="preview-body">
                            <k-shadow-frame
                              id="last-preview-body-shadow-root-review"
                              :content="uploadRespond.editableBody || uploadRespond.initialBody"
                            />
                          </div>
                          <div
                            class="preview-footer"
                            v-if="!!uploadRespond.attachments && uploadRespond.attachments.length"
                          >
                            <h2>Attachments</h2>
                            <div class="attachment-wrapper">
                              <div
                                v-for="(att, ind) of uploadRespond.attachments"
                                :key="ind + att.id"
                                :id="'attachment-' + att.name"
                                class="attachment red-attach"
                                :class="[
                                  att.isFlagged ? 'red-attach' : '',
                                  !att.isFlagged ? 'blue-attach' : '',
                                  !att.isHidden ? 'clean-attach' : ''
                                ]"
                              >
                                <AttachmentsPreview :att="att" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id="last-step-preview-buttons"
                          class="preview-buttons"
                          style="display: none;"
                        >
                          <v-btn id="last-step-useful-btn">
                            <v-icon>mdi-thumb-up</v-icon>
                            Useful 0
                          </v-btn>
                          <v-btn
                            id="last-step-comment-opened"
                            :class="{ 'active-act': commentOpened }"
                          >
                            <!-- @click="commentOpened = !commentOpened" -->
                            <v-icon :class="{ 'active-act': commentOpened }">mdi-comment</v-icon>
                            Comments (0)
                          </v-btn>
                        </div>
                      </v-tab-item>
                      <v-tab-item>
                        <div class="single-post__details">
                          <div id="last-detail-parts" class="detail-parts">
                            <p
                              v-if="
                                (uploadRespond.subject && uploadRespond.isSubjectFlagged) ||
                                (!!uploadRespond.from && uploadRespond.isFromFlagged) ||
                                (uploadRespond.to &&
                                  !!uploadRespond.to.length &&
                                  uploadRespond.isToFlagged) ||
                                (uploadRespond.cc &&
                                  !!uploadRespond.cc.length &&
                                  uploadRespond.isCcFlagged) ||
                                (uploadRespond.bcc &&
                                  !!uploadRespond.bcc.length &&
                                  uploadRespond.isBccFlagged)
                              "
                              class="detail-black disc-header single-post__details__section-header"
                            >
                              Header
                            </p>
                            <div>
                              <p
                                v-if="uploadRespond.subject && uploadRespond.isSubjectFlagged"
                                :id="uploadRespond.subject"
                                class="detail-black detail-red single-post__details__section-header--sub"
                              >
                                Subject:
                                {{
                                  !uploadRespond.isSubjectHidden
                                    ? uploadRespond.subject
                                    : 'Hidden by Owner'
                                }}
                              </p>
                              <p
                                v-if="
                                  uploadRespond &&
                                  uploadRespond.subject &&
                                  uploadRespond.isSubjectFlagged
                                "
                                id="harmful-Subject"
                                class="detail-black single-post__details__section-header--result"
                              >
                                Emails with this subject may include harmful content
                              </p>
                            </div>
                            <div>
                              <p
                                v-if="uploadRespond.from && uploadRespond.isFromFlagged"
                                :id="uploadRespond.from"
                                class="detail-black detail-red single-post__details__section-header--sub"
                              >
                                From:
                                {{
                                  !uploadRespond.isFromHidden
                                    ? uploadRespond.from
                                    : 'Hidden by Owner'
                                }}
                              </p>
                              <p
                                v-if="
                                  uploadRespond && uploadRespond.from && uploadRespond.isFromFlagged
                                "
                                id="harmful-sender"
                                class="detail-black single-post__details__section-header--result"
                              >
                                Emails from this sender may include harmful content
                              </p>
                            </div>
                            <div>
                              <p
                                v-if="uploadRespond.to && uploadRespond.isToFlagged"
                                class="detail-black detail-red single-post__details__section-header--sub"
                              >
                                To:
                                {{
                                  !uploadRespond.isToHidden
                                    ? uploadRespond.to.toString()
                                    : 'Hidden by Owner'
                                }}
                              </p>
                              <p
                                v-if="
                                  uploadRespond && uploadRespond.to && uploadRespond.isToFlagged
                                "
                                id="harmful-to"
                                class="detail-black single-post__details__section-header--result"
                              >
                                This email address may be targeted by emails include harmful content
                              </p>
                            </div>
                            <div>
                              <p
                                v-if="
                                  uploadRespond.cc &&
                                  uploadRespond.cc.length &&
                                  uploadRespond.isCcFlagged
                                "
                                class="detail-black detail-red single-post__details__section-header--sub"
                              >
                                CC:
                                {{
                                  !uploadRespond.isCcHidden
                                    ? uploadRespond.cc.toString()
                                    : 'Hidden by Owner'
                                }}
                              </p>
                              <p
                                v-if="
                                  uploadRespond &&
                                  uploadRespond.cc &&
                                  uploadRespond.cc.length &&
                                  uploadRespond.isCcFlagged
                                "
                                id="harmful-cc"
                                class="detail-black single-post__details__section-header--result"
                              >
                                This email address may be targeted by emails include harmful content
                              </p>
                            </div>
                            <div>
                              <p
                                v-if="
                                  uploadRespond.bcc &&
                                  uploadRespond.bcc.length &&
                                  uploadRespond.isBccFlagged
                                "
                                class="detail-black detail-red single-post__details__section-header--sub"
                              >
                                CC:
                                {{
                                  !uploadRespond.isBccHidden
                                    ? uploadRespond.bcc.toString()
                                    : 'Hidden by Owner'
                                }}
                              </p>
                              <p
                                v-if="
                                  uploadRespond &&
                                  uploadRespond.bcc &&
                                  uploadRespond.bcc.length &&
                                  uploadRespond.isBccFlagged
                                "
                                id="harmful-bcc"
                                class="detail-black single-post__details__section-header--result"
                              >
                                This email address may be targeted by emails include harmful content
                              </p>
                            </div>
                          </div>
                          <div
                            v-if="uploadRespond && uploadRespond.urls && uploadRespond.urls.length"
                            class="preview-attch-wrapper detail-parts"
                          >
                            <p
                              v-if="
                                uploadRespond &&
                                uploadRespond.urls &&
                                uploadRespond.urls.some((a) => !a.isHidden && a.isFlagged)
                              "
                              class="detail-black single-post__details__section-header"
                            >
                              Body
                            </p>
                            <p
                              v-for="(el, ind) of uploadRespond.urls"
                              :key="ind + el.url"
                              v-if="el && !el.isHidden && el.isFlagged"
                              :id="'detail-links-' + el.name"
                              class="detail-black detail-red single-post__details__section-header--sub"
                            >
                              Link: {{ el.name }} ({{ el.url }})
                              <!--<span
                                class="single-post__details__section-header--result--copy-link"
                                @click="contentCopy(el.url)"
                              >
                                <v-icon
                                  class="single-post__details__section-header--result--copy-link__icon"
                                  >mdi-content-copy</v-icon
                                >Copy Url
                              </span>-->
                              <span
                                class="attach-found-malicious single-post__details__section-header--result d-block"
                              >
                                This link has been reported as phishing
                              </span>
                            </p>
                          </div>
                          <div
                            class="details-attchments-wrapper preview-footer"
                            v-if="uploadRespond.attachments && uploadRespond.attachments.length"
                          >
                            <div
                              v-for="(att, ind) of uploadRespond.attachments"
                              :key="ind + att.name"
                              v-if="att.isFlagged"
                              class="preview-attch-wrapper details-attachments"
                            >
                              <p class="single-post__details__section-header">
                                Attachments
                              </p>
                              <div>
                                <div :id="'detail-attachs-' + att.name" class="attachment">
                                  <div
                                    :id="'detail-name-' + att.name"
                                    v-if="!att.isHidden"
                                    class="file-name max-char safari-hide-tooltip single-post__details__section-header--sub"
                                  >
                                    {{ att.name }}
                                  </div>
                                  <div
                                    :id="'detail-name-' + att.name"
                                    v-if="att.isHidden"
                                    class="file-name max-char single-post__details__section-header--sub"
                                  >
                                    Hidden by Owner
                                  </div>
                                </div>
                              </div>
                              <div v-if="att.isFlagged">
                                <p
                                  class="attach-found-malicious detail-black single-post__details__section-header--result"
                                >
                                  This file has been reported as malicious content
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="detail-discovery pb-4">
                            <div
                              :id="'detail-discovery-empty'"
                              v-if="uploadRespond && uploadRespond.DiscoveryAndDetection"
                              class="disc-header"
                            >
                              Discovery and Detection
                            </div>
                            <p
                              :id="'detail-discovery'"
                              v-if="uploadRespond && uploadRespond.DiscoveryAndDetection"
                              class="discovery-p"
                            >
                              {{ uploadRespond && uploadRespond.DiscoveryAndDetection }}
                            </p>
                            <div
                              v-if="uploadRespond && uploadRespond.AffectArea"
                              class="disc-header mb-1"
                            >
                              Impact Range
                            </div>
                            <div
                              :id="'detail-effect-area'"
                              v-if="uploadRespond && uploadRespond.AffectArea"
                              class="impact-row"
                            >
                              <div class="impact-left">Effect area:</div>
                              <div
                                style="width: max-content; padding-right: 13px;"
                                class="impact-right"
                              >
                                {{ uploadRespond && uploadRespond.AffectArea.toString() }}
                              </div>
                            </div>
                            <div
                              :id="'detail-scope' + uploadRespond"
                              v-if="uploadRespond && uploadRespond.Scope"
                              class="impact-row"
                            >
                              <div class="impact-left">Scope:</div>
                              <div class="impact-right">
                                {{ uploadRespond && uploadRespond.Scope }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <v-form ref="accept_terms_and_conditions_checkbox">
              <div class="d-flex" style="margin-bottom: 8px;">
                <v-checkbox
                  id="accept-terms-and-conditions-post-incident"
                  class="k-checkbox accept-terms-and-conditions-checkbox"
                  color="#2196f3"
                  v-model="acceptCheckbox"
                  :rules="[checkboxRule.required]"
                  @change="checkCheckboxValidation()"
                />
                <div class="d-flex accept-terms-and-conditions-label-group">
                  <label :for="'accept-terms-and-conditions-post-incident'" class="mr-1"
                    >I accept
                  </label>
                  <a
                    :href="termsAndConditionsUrl"
                    @click="(event) => event.stopPropagation()"
                    class="mr-1"
                    target="_blank"
                    >terms and conditions</a
                  >
                  <label :for="'accept-terms-and-conditions-post-incident'"> for communities</label>
                </div>
              </div>
            </v-form>
          </div>
        </v-card>
        <div id="post-footer-actions" class="footer-actions">
          <v-btn
            id="threat-sharing-post-incident-cancel-button"
            class="cancel-btn"
            text
            color="#f56c6c"
            @click="onCancelClicked"
            >Cancel
          </v-btn>
          <div>
            <v-btn
              v-if="step === 2 || step === 3 || step === 4 || step === 5"
              id="threat-sharing-post-incident-back-button"
              class="previous-btn mr-4"
              text
              color="#2196f3"
              @click="onPreviousButtonClick(step)"
              >BACK
            </v-btn>
            <v-btn
              v-if="step === 1"
              id="threat-sharing-post-incident-next-button"
              :disabled="!selectedEmail && !uploadRespond.IsActive"
              :class="{ 'disabled-cursor': !selectedEmail && !uploadRespond.IsActive }"
              class="create-btn"
              text
              color="#2196f3"
              @click="onContinue"
              >Next
            </v-btn>
            <v-btn
              v-if="step === 2"
              id="threat-sharing-post-incident-step-two-next-button"
              :class="{ 'disabled-cursor': !stepTwoDisabled() }"
              class="create-btn"
              text
              color="#2196f3"
              @click="onSecondStep"
              >Next
            </v-btn>
            <v-btn
              v-if="step === 3"
              id="threat-sharing-post-incident-step-three-next-button"
              class="create-btn"
              text
              color="#2196f3"
              @click="onThirdStep"
              >Next
            </v-btn>
            <v-btn
              id="threat-sharing-post-incident-step-four-next-button"
              v-if="step === 4"
              :class="{ 'disabled-cursor': allFiltersClosed() }"
              class="create-btn"
              text
              color="#2196f3"
              @click="onBeforeLastStep"
              >Next
            </v-btn>
            <v-btn
              id="threat-sharing-post-incident-step-five-next-button"
              v-if="step === 5"
              class="create-btn"
              text
              color="#2196f3"
              @click="onFinish"
              :disabled="saveDisable"
              >Post
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PreviewHeader from './PreviewHeader'
import PreviewHeaderForSinglePost from './PreviewHeaderForSinglePost'
import VClamp from 'vue-clamp'
import {
  createCommunityPost,
  getCommunityPost,
  getSelectedEmailPreview,
  listThreatCategories,
  parseEmail,
  searchNotifiedMail,
  updateCommunityPost,
  uploadEmlOrMsg
} from '../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import KShadowFrame from '../KShadowFrame'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import AppModal from '../AppModal'
import labels from '@/model/constants/labels'
import GrapesNewsletterModal from '../GrapesJs/Newsletter/GrapesNewsletterModal'
import { incidenPostReviewElementBind, scrollToComponent } from '../../utils/functions'
import AttachmentsPreview from './AttachmentsPreview'
import KSelect from '@/components/Common/Inputs/KSelect'
import * as Validations from '@/utils/validations'
import KSelectLoading from '@/components/KSelectLoading'
Vue.customElement('k-shadow-frame', KShadowFrame, {
  shadow: true,
  shadowCss: `
 @import url('https://fonts.googleapis.com/css?family=Material+Icons');
 @import url('https://cdn.materialdesignicons.com/5.2.45/css/materialdesignicons.min.css');
 @import url('https://cdn.jsdelivr.net/npm/vuetify@2.2.29/dist/vuetify.min.css');
.hidden-icon-link {
  background-color: #757575;
  color: #ffffff;
}
.malicious-style,
.malicious-link {
     color: #f56c6d !important;
    border-color: #f56c6d !important;
    background-color: #f3e1e5 !important;
    text-decoration: none !important;
    position: relative;
  text-decoration: none !important;
  border-bottom: 0 solid;
  position:relative;
  .share-setting-text {
    text-decoration: none !important;
    text-decoration-color: transparent !important;
    text-decoration-style: unset !important;
    border: none !important;
    border-bottom: transparent !important;
    border-bottom-color: transparent !important;
    border-image: none !important;
    border-image-width: 0 !important;
  }
}
[data-title]:hover:after {
    opacity: 1;

    visibility: visible;
}
[data-title]:after {
     content: attr(data-title);
    position: absolute;
    padding: 4px 8px;
    bottom: -40px;
    left: 0;
    white-space: nowrap;
    opacity: 0;
    z-index: 99999;
    visibility: hidden;
   border-radius: 4px;
    line-height: 1.33;
    min-height: 24px;
    background: #6d6d6d !important;
    color: rgba(255, 255, 255, 0.87) !important;
    font-family: "Open Sans", sans-serif !important;
    font-size: 12px;
    text-decoration:none;
        font-weight: normal;

}
[data-title] {
    position: relative;
}
.malicious-style {
   color: #bb2a45 !important;
    border-color: #bb2a45 !important;
    background-color: #f3e1e5 !important;

  text-decoration: none !important;
  border-bottom: 1px solid;
  position:relative;
      text-indent: 0;
}

.malicious-icon {
 top: 0px;
  background: transparent;
  color: #f56c6c;
  font-size: inherit !important;
  padding: 0;
}

.red-malicious-alert {
   color: #f56c6c !important;
    caret-color: #f56c6c !important;
    text-decoration: unset !important;
    text-decoration-color: transparent !important;
    font-size: inherit !important;
    overflow: hidden;
}

.red-malicious-alert::before {
  border: unset !important;
}

.hidden-icon-link {
  background-color: #757575;
  color: #ffffff;
}

.url-badge{
  font-family: "Open Sans", sans-serif;
    position: absolute;
    top: -8px;
    right: -8px;
    color: white;
    background-color: #757575c2;
    height: 10px;
    width: 10px;
    text-align: center;
    border-radius: 30px;
    font-size: 8px;
    font-weight: 900;
    line-height: 1.2 !important;
}
a{position:relative}
 `
})

export default {
  components: {
    KSelectLoading,
    KSelect,
    KFileUpload,
    VClamp,
    PreviewHeader,
    GrapesNewsletterModal,
    AppModal,
    PreviewHeaderForSinglePost,
    AttachmentsPreview
  },
  props: {
    editItem: {
      type: Object,
      required: false
    },
    updatePost: {
      type: String,
      required: false
    },
    isEditMode: {
      type: Boolean,
      required: false,
      default: false
    },
    communityName: {
      type: String
    },
    refreshData: {
      required: false
    }
  },
  computed: {
    checkHeaderSelected() {
      if (
        this.uploadRespond.isSubjectHidden ||
        this.uploadRespond.isFromHidden ||
        this.uploadRespond.isToHidden ||
        this.uploadRespond.isCcHidden ||
        this.uploadRespond.isBccHidden
      ) {
        return true
      } else {
        return false
      }
    },
    maliciousCount() {
      let count = 0
      if (this.uploadRespond.isFromFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isSubjectFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isToFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isCcFlagged) {
        count = count + 1
      }
      if (this.uploadRespond.isBccFlagged) {
        count = count + 1
      }
      count =
        count +
        this.uploadRespond.urls.reduce((acc, item) => {
          if (item.isFlagged) acc = acc + 1
          return acc
        }, 0)
      count =
        count +
        this.uploadRespond.attachments.reduce((acc, item) => {
          if (item.isFlagged) acc = acc + 1
          return acc
        }, 0)
      return count
    }
  },
  data: () => ({
    saveDisable: false,
    labels,
    visibleBodyForPreview: null,
    termsAndConditionsUrl: 'https://www.keepnetlabs.com/terms-conditions/',
    acceptCheckbox: false,
    editHtmlData: null,
    showNewsletterPageGrapes: false,
    isFindIncidentLoading: true,
    showLoader: false,
    value: 'wFlYRDMW946M',
    isInit: true,
    items2: [
      {
        text: 'TLP: WHITE',
        value: 'wFlYRDMW946M',
        color: '#ffffff',
        cssClass: 'tlp-select__chip--white',
        desc: 'Disclosure is not limited.'
      },
      {
        text: 'TLP: GREEN',
        value: 'wKBhLuFZ46y9',
        color: '#2cde00',
        cssClass: 'tlp-select__chip--green',
        desc: 'Limited disclosure, restricted to the community.'
      },
      {
        text: 'TLP: AMBER',
        value: 'RhHwRcLlZxek',
        color: '#ffc000',
        cssClass: 'tlp-select__chip--amber',
        desc: 'Limited disclosure, restricted to participants’ organizations.'
      },
      {
        text: 'TLP: RED',
        value: 'YpUZxVhYJlKg',
        color: '#ff0033',
        cssClass: 'tlp-select__chip--red',
        desc: 'Not for disclosure, restricted to participants only.'
      }
    ],
    fromSettings: false,
    toSettings: false,
    ccSettings: false,
    bccSettings: false,
    subSettings: false,
    currentCompany: null,
    listData: [],
    step: 1,
    search: '',
    searchIncident: '',
    items: [],
    categories: ['Malicious', 'Non-malicious', 'Phishing'],
    model: [],
    activator: null,
    attach: null,
    colors: ['#e0e0e0'],
    editing: null,
    index: -1,
    nonce: 1,
    menu: false,
    x: 0,
    warnItem: true,
    selectedEmail: '',
    affectSearch: null,
    emails: [
      {
        name: 'File Format Exploit',
        icon: 'mdi-paperclip',
        type: 'Malicious',
        time: '1w'
      },
      {
        name: 'File Format Exploit',
        icon: 'mdi-paperclip',
        type: 'Malicious',
        time: '1w'
      },
      {
        name: 'File Format Exploit',
        icon: 'mdi-paperclip',
        type: 'Malicious',
        time: '1w'
      }
    ],
    header: {
      allHeader: true,
      subject: true,
      sender: true,
      receiver: true
    },
    body: {
      allLinks: true,
      phishingLinks: true,
      phishing1: true,
      phishing2: false
    },
    footer: {
      allAttachments: true,
      attachment1: true,
      attachment2: true
    },
    valid: false,
    categoryValid: false,
    validDisc: false,
    validAffect: false,
    validScope: false,
    autocomplete: [(v) => (!!v && /^[A-Za-z0-9ışŞğĞçÇöÖüÜİ\/,\/.\/\-\/_\s]*$/gi.test(v)) || ''],
    title: [(v) => !!v || 'Title is required'],
    category: [(v) => (!!v && v.length >= 1) || 'Required'],
    titleRule: {
      required: (v) => Validations.required(v),
      default: (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage('Title')),
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜİ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      empty: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space',
      minLength: (v) => Validations.minLength(v, 4, labels.getMinLengthMessage(labels.Title, 4))
    },
    descRule: {
      default: (v) => Validations.maxLength(v, 300, labels.getMaxLengthMessage('Description', 300)),
      required: (v) => Validations.required(v),
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜİ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      empty: (v) => {
        if (!v) return true
        return (v && !v.startsWith(' ')) || 'Cannot start with space'
      },
      minLength: (v) =>
        Validations.minLength(v, 5, labels.getMinLengthMessage(labels.Description, 5))
    },

    checkboxRule: {
      required: (v) => {
        return v || 'You must accept terms and conditions before creating the community'
      }
    },
    explanationRules: {
      default: (v) => Validations.required(v),
      required: (v) =>
        Validations.maxLength(v, 300, labels.getMaxLengthMessage('Discovery and detection', 300)),
      empty: (v) => (v && !v.startsWith(' ')) || 'Discovery and detection cannot start with space',
      minLength: (v) =>
        Validations.minLength(v, 5, labels.getMinLengthMessage('Discovery and detection', 5))
    },
    scopeRules: {
      default: (v) => Validations.required(v),
      required: (v) => Validations.maxLength(v, 200, labels.getMaxLengthMessage('Scope', 200)),
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜİ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      empty: (v) => (v && !v.startsWith(' ')) || 'Scope cannot start with space',
      minLength: (v) => Validations.minLength(v, 5, labels.getMinLengthMessage('Scope', 5))
    },
    affectRules: {
      regex: (v) =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜİ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen'
    },
    createInc: {
      postId: '',
      title: 'Subject: Subject comes here',
      description: '',
      category: '',
      discovery: '',
      affect: [],
      affectSearch: null,
      scope: '',
      select: ['add-tags-with', 'enter', 'tab', 'paste'],
      items: [],
      search: '',
      createUser: '',
      createCompany: '',
      onPreview: true
    },
    filterOpened: true,
    flagData: {
      subject: false,
      sender: false,
      receiver: false,
      phishing: false,
      link: false,
      attachment: false
    },
    subChevron: false,
    fromChevron: false,
    toChevron: false,
    linkChevron: [],
    attcChevron: [],
    urls: [],
    msgEmlFile: null,
    toggle: false,
    panel: 0,
    expanded: false,
    tab: 0,
    commentOpened: false,
    userComment: '',
    comments: [],
    hoverTool: false,
    seeComments: false,
    date: new Date().toISOString().slice(0, 10),
    uploadRespond: {
      DiscoveryAndDetection: ' '
    },
    shareSettings: {},
    allHeader: false,
    allLinks: false,
    allAttachments: false,
    isAnonym: false,
    onUploadProgress: null
  }),
  watch: {
    searchIncident(val) {
      val !== this.select && this.querySelections(val)
    }
  },
  created() {
    document.querySelector('html').style.overflowY = 'hidden'
    document.querySelector('.page-nav').style.zIndex = 8
  },
  methods: {
    handleLoadingState() {
      if (this.isInit) {
        this.showLoader = true
      }
    },
    setVisibleBody() {
      let urls = this.uploadRespond.urls.filter((item, index) => item.isHidden)
      for (let url of urls) {
        let els = document
          .getElementById('last-preview-body-shadow-root-for-preview')
          .shadowRoot.querySelectorAll('[href="' + url.url + '"]')
        if (els && els.length) {
          for (let i = 0, l = els.length; i < l; i++) {
            let el = els[i]
            el.style.pointerEvents = 'auto'
            el.style.cursor = 'pointer'
            el.removeAttribute('data-title')
            el.setAttribute('data-post-item-hidden', 'false')
            el.innerHTML = 'Hidden by Owner'
            el.style.backgroundColor = '#757575'
            el.style.color = '#ffffff'
            el.style.position = 'relative'
            el.style.pointerEvents = 'none'
            el.url = 'Hidden by Owner'
            el.setAttribute('href', '#')
          }
        }
      }
      this.uploadRespond.visibleBodyForPreview = document.getElementById(
        'last-preview-body-shadow-root-for-preview'
      ).shadowRoot.innerHTML
    },
    handleTagItemChange(value) {
      this.querySelections(this.searchIncident || '')
      if (this.isFindIncidentLoading) return false
    },
    checkCheckboxValidation() {
      this.isCheckboxChecked = this.acceptCheckbox
    },
    closeGrapesJs() {
      this.showNewsletterPageGrapes = false
      setTimeout(() => {
        document.querySelector('html').style.overflowY = 'hidden'
      }, 250)
    },
    saveGrapesJs() {
      let editedHtml = this.$refs.grapesJsPostIncident.getGrapesEditorContent()
      let payload = { htmlBody: editedHtml }
      parseEmail(payload).then((response) => {
        let urls = response.data.data.map((item) => {
          return { ...item, isFlagged: false, isHidden: false }
        })
        document.querySelector('html').style.overflowY = 'hidden'
        this.showNewsletterPageGrapes = false
        this.uploadRespond.urls = urls
        this.uploadRespond.editableBody = editedHtml
        this.uploadRespond.visibleBodyForPreview = editedHtml
        this.setShadowRootMalicousLink('last-preview-body-shadow-root')
      })
    },
    editHtmlTemplate() {
      this.editHtmlData = this.uploadRespond.editableBody || this.uploadRespond.initialBody
      this.showNewsletterPageGrapes = true
    },
    querySelections(val) {
      let _this = this
      setTimeout(() => {
        if (!val) {
          this.listData = this.backupListData
        } else {
          if (this.listData && this.backupListData) {
            _this.listData = this.backupListData.reduce((acc, item) => {
              Object.values(item).find((i) => {
                if (
                  typeof i === 'string' &&
                  i.toLocaleLowerCase().includes(val.toLocaleLowerCase())
                )
                  return acc.push(item)
              })
              return acc
            }, [])
          }
          setTimeout(() => {
            _this.$forceUpdate()
          }, 50)
        }
      }, 500)
    },
    getByValue() {
      return this.uploadRespond.PostedUserFullName || localStorage.getItem('userName')
    },
    getFromValue() {
      return this.uploadRespond.PostedUserCompanyName || localStorage.getItem('companyName')
    },
    contentCopy(contentBody) {
      navigator.clipboard.writeText(contentBody)
      this.$store.dispatch('common/createSnackBar', {
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        message: 'Content has been copied'
      })
    },
    findCategory(id) {
      switch (id) {
        case 'Ps0SSyl7rVNe':
          return 'Malicious'
        case 'bEuAD1pdbRXF':
          return 'Non-Malicious'
        case 'NGLCc9UCxJvw':
          return 'Phishing'
        case 'Gwt67E1ftYtr':
          return 'Spam'
        default:
          return ''
      }
    },
    urlSwitchChange(url, id, rootId) {
      //this.setShadowRootMalicousLink('last-preview-body-shadow-root')
      this.checkUrlChangeForAllLinksSwitch()
      let els = document
        .getElementById(rootId || 'last-preview-body-shadow-root')
        .shadowRoot.querySelectorAll('[href="' + url.url + '"]')
      if (els && els.length) {
        for (let i = 0, l = els.length; i < l; i++) {
          let el = els[i]
          el.style.pointerEvents = 'auto'
          el.style.cursor = 'pointer'
          el.setAttribute('target', '_blank')
          el.setAttribute('index', url.index)
          el.removeAttribute('data-title')
          if (url.isHidden) {
            url.isFlagged = false
            el.innerHTML = url.urlHtml || url.name || url.url
            el.innerHTML = el.innerHTML + `<span class="hidden-icon mdi mdi-eye-off"></span>`
            el.style.backgroundColor = '#757575'
            el.style.color = '#ffffff'
            el.style.position = 'relative'
            el.style.pointerEvents = 'none'
          } else if (!!url && !!url.name) {
            el.innerHTML = url.name
            el.setAttribute('href', url.url)
            el.style.backgroundColor = 'inherit'
            el.style.color = 'inherit'
          } else if (!!url && !!url.urlHtml) {
            el.innerHTML = url.urlHtml
            el.setAttribute('href', url.url)
            el.style.backgroundColor = 'inherit'
            el.style.color = 'inherit'
          }
          if (url.isFlagged) {
            const el = els[i]
            el.setAttribute('target', '_blank')
            el.setAttribute('data-title', 'This link has been reported as a phishing')
            el.style.backgroundColor = '#f3e1e5'
            el.style.color = '#bb2a45'
            el.innerHTML = el.innerHTML + `<span class="malicious-link mdi mdi-alert"></span>`
            el.style.cursor = 'default'
            el.setAttribute('onclick', 'return false;')

            //el.appendChild(iEl)
          } else if (!url.isFlagged && !url.isHidden) {
            el.innerHTML = url.urlHtml || url.name || url.url
            el.style.backgroundColor = 'inherit'
            el.style.color = 'inherit'
          }
          if (this.step === 4) {
            el.innerHTML = el.innerHTML + ` <span class="url-badge">${url.orderNumber}</span>`
          }
        }
      }
      let hiddenEls = document.getElementsByClassName(url.url)
      if (hiddenEls && hiddenEls.length) {
        for (let i = 0, l = hiddenEls.length; i < l; i++) {
          let hiddenEl = hiddenEls[i]
          hiddenEl.setAttribute('target', '_blank')
          if (url.isHidden) {
            hiddenEl.innerHTML = 'Hidden by Owner'
            //hiddenEl.setAttribute('href', '#')
          } else if (!!url && !!url.urlHtml) {
            hiddenEl.innerHTML = url.urlHtml
            hiddenEl.setAttribute('href', url.url)
          }
          if (url.isFlagged) {
            hiddenEl.classList.add('malicious-link')
            let iEl = document.createElement('span')
            iEl.className +=
              'red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light'
            hiddenEl.appendChild(iEl)
          }
        }
      }
    },
    setShadowRootMalicousLink(id) {
      let _this = this
      setTimeout(() => {
        let recrusiveFunctionForDom = () =>
          document.getElementById(id) && document.getElementById(id).shadowRoot
        if (!recrusiveFunctionForDom) recrusiveFunctionForDom()
        _this.uploadRespond.urls = _this.uploadRespond.urls.map((item, index) => {
          let urlItem = document
            .getElementById(id)
            .shadowRoot.querySelectorAll('[href="' + item.url + '"]')
          return {
            ...item,
            url: item.url.replace(/amp;/g, ''),
            name: item.name,
            urlHtml: !!urlItem.length && urlItem[0].innerHTML ? urlItem[0].innerHTML : null,
            index: index + 1
          }
        })
        if (id === 'incident-preview-1' || id === 'last-preview-body-shadow-root-review') {
          for (let url of this.uploadRespond.urls) {
            incidenPostReviewElementBind(url, null, id, true)
          }
        } else {
          for (let url of this.uploadRespond.urls) {
            this.urlSwitchChange(url, null, id)
          }
        }
      }, 500)
    },
    allUrlsValChange(val) {
      this.uploadRespond.urls = this.uploadRespond.urls.map((item) => {
        item.isHidden = val
        item.isFlagged = false
        this.urlSwitchChange(item)
        return { ...item, isHidden: val }
      })
    },
    checkUrlChangeForAllLinksSwitch() {
      this.allLinks = !this.uploadRespond.urls.find((item) => !item.isHidden)
    },
    allAttachmentsValChange(val) {
      this.uploadRespond.attachments = this.uploadRespond.attachments.map((item) => {
        item.isHidden = val
        item.isFlagged = false
        return { ...item, isHidden: val }
      })
    },
    checkAttachmentsChangeForAllLinksSwitch(att, index) {
      this.allAttachments = !this.uploadRespond.attachments.find((item) => !item.isHidden)
      att.isFlagged = false
    },
    headerValChange(val) {
      this.uploadRespond.isSubjectHidden = val
      this.uploadRespond.isFromHidden = val
      this.uploadRespond.isToHidden = val
      this.uploadRespond.isCcHidden = val
      this.uploadRespond.isBccHidden = val
      this.uploadRespond.isSubjectFlagged = false
      this.uploadRespond.isFromFlagged = false
      this.uploadRespond.isToFlagged = false
      this.uploadRespond.isCcFlagged = false
      this.uploadRespond.isBccFlagged = false
    },
    checkAllHeaderCheck() {
      this.allHeader =
        (!this.uploadRespond.subject || this.uploadRespond.isSubjectHidden) &&
        (!this.uploadRespond.from || this.uploadRespond.isFromHidden) &&
        (!this.uploadRespond.to.length || this.uploadRespond.isToHidden) &&
        (!this.uploadRespond.cc.length || this.uploadRespond.isCcHidden) &&
        (!this.uploadRespond.bcc.length || this.uploadRespond.isBccHidden)
    },
    subjectValChange(val) {
      if (val) this.uploadRespond.isSubjectFlagged = false
      this.checkAllHeaderCheck()
    },
    fromValChange(val) {
      if (val) this.uploadRespond.isFromFlagged = false
      this.checkAllHeaderCheck()
    },
    toValChange(val) {
      if (val) this.uploadRespond.isToFlagged = false
      this.checkAllHeaderCheck()
    },
    ccValChange(val) {
      if (val) this.uploadRespond.isCcFlagged = false
      this.checkAllHeaderCheck()
    },
    bccValChange(val) {
      if (val) this.uploadRespond.isBccFlagged = false
      this.checkAllHeaderCheck()
    },
    getListThreatCategories() {
      listThreatCategories().then((response) => {
        this.categories = response.data.data
      })
    },
    uploadFile(e) {
      this.msgEmlFile = e

      uploadEmlOrMsg(this.msgEmlFile, (e) => {
        this.onUploadProgress = e
      }).then((response) => {
        this.selectedEmail = response.data.data.from
        this.uploadRespond = response.data.data
        this.uploadRespond.initialBody = response.data.data.initialBody
        this.uploadRespond.visibleBody = response.data.data.initialBody
        this.uploadRespond.editableBody = response.data.data.initialBody
        this.uploadRespond.visibleBodyForPreview = response.data.data.initialBody
        this.setShadowRootMalicousLink('incident-preview-1')
      })
    },
    clearUpload() {
      //this.uploadFile(null)
    },
    searchNotifiedMail() {
      const payload = {
        pageNumber: 1,
        pageSize: 500000,
        orderBy: 'createTime',
        ascending: false,
        clusteredBy: ''
      }
      searchNotifiedMail(payload)
        .then((response) => {
          const { data } = response
          if (this.searchIncident) {
            this.backupListData = JSON.parse(JSON.stringify(data.data.results))
            this.$nextTick(() => {
              this.listData = this.backupListData.reduce((acc, item) => {
                Object.values(item).find((i) => {
                  if (
                    typeof i === 'string' &&
                    i.toLocaleLowerCase().includes(this.searchIncident.toLocaleLowerCase())
                  )
                    return acc.push(item)
                })
                return acc
              }, [])
            })
          } else {
            this.listData = data.data.results
            this.backupListData = JSON.parse(JSON.stringify(data.data.results))
          }
        })
        .finally(() => {
          this.isFindIncidentLoading = false
          this.showLoader = false
        })
    },
    getSelectedEmailPreview(selectedItem) {
      const _this = this
      if (_this.editItem) {
        getCommunityPost(_this.editItem.communityPostResourceId).then((response) => {
          const { data } = response
          _this.uploadRespond = data.data.communityPostEmail
          _this.uploadRespond.visibleBodyForPreview =
            data.data.communityPostEmail.editableBody ||
            data.data.communityPostEmail.visibleBody ||
            data.data.communityPostEmail.initialBody
          if (_this.editItem) {
            _this.uploadRespond.CommunityPostResourceId = _this.editItem.communityPostResourceId
            _this.uploadRespond.Title = _this.editItem.title
            _this.uploadRespond.Description = _this.editItem.description
            _this.uploadRespond.DiscoveryAndDetection = _this.editItem.discoveryAndDetection
            _this.uploadRespond.Scope = _this.editItem.scope
            _this.uploadRespond.CategoryResourceIdArray = _this.editItem.categoryResourceIdArray
            _this.uploadRespond.PostedUserFullName = _this.editItem.postedUserFullName
            _this.uploadRespond.PostedUserCompanyName = _this.editItem.postedUserCompanyName
            _this.uploadRespond.PostedTime = _this.editItem.postedTime
            _this.uploadRespond.LikeCount = _this.editItem.likeCount
            _this.uploadRespond.CommentCount = _this.editItem.commentCount
            _this.uploadRespond.HarmfulItemCount = _this.editItem.harmfulItemCount
            _this.uploadRespond.HasAttachment = _this.editItem.hasAttachment
            _this.uploadRespond.CommunityResourceId = _this.editItem.communityResourceId
            _this.uploadRespond.CommunityName = this.editItem.communityName
            _this.uploadRespond.AffectArea = data.data.affectArea
          }
          if (!_this.uploadRespond.bcc) _this.uploadRespond.bcc = []
          if (!_this.uploadRespond.cc) _this.uploadRespond.cc = []
          if (!_this.uploadRespond.to) _this.uploadRespond.to = []
          this.setShadowRootMalicousLink('incident-preview-1')
          //this.listData = data.data.results
        })
      } else {
        getSelectedEmailPreview(selectedItem.resourceId).then((response) => {
          const { data } = response
          this.uploadRespond = data.data
          this.uploadRespond.initialBody = data.data.initialBody
          this.uploadRespond.visibleBody = data.data.initialBody
          this.uploadRespond.editableBody = response.data.data.initialBody
          this.uploadRespond.visibleBodyForPreview = response.data.data.initialBody
          // this.setShadowRootMalicousLink('incident-preview-1')
          // this.listData = data.data.results
        })
      }
    },
    onCancelClicked() {
      this.$emit('refreshData')
      this.$emit('closeIncidentModal')
    },
    stepChange(num) {
      this.step = num
    },
    onContinue() {
      return this.step++
    },
    onSecondStep() {
      if (
        !this.$refs.titleInput.validate() ||
        !this.$refs.descriptionInput.validate() ||
        !this.$refs.categoryInput.validate() ||
        !this.stepTwoDisabled()
      ) {
        this.$refs.titleInput.validate()
        this.$refs.descriptionInput.validate()
        this.$refs.categoryInput.validate()
        return false
      } else {
        this.step++
      }
    },
    onThirdStep() {
      if (this.uploadRespond.AffectArea && !this.$refs.affectInput.validate()) {
        if (this.uploadRespond.DiscoveryAndDetection) this.$refs.discoveryInput.validate()
        if (this.uploadRespond.AffectArea) this.$refs.affectInput.validate()
        if (this.uploadRespond.Scope) this.$refs.scopeInput.validate()
        return false
      }
      if (this.uploadRespond.DiscoveryAndDetection && !this.$refs.discoveryInput.validate()) {
        if (this.uploadRespond.DiscoveryAndDetection) this.$refs.discoveryInput.validate()
        if (this.uploadRespond.AffectArea) this.$refs.affectInput.validate()
        if (this.uploadRespond.Scope) this.$refs.scopeInput.validate()
        return false
      }
      if (this.uploadRespond.Scope && !this.$refs.scopeInput.validate()) {
        if (this.uploadRespond.DiscoveryAndDetection) this.$refs.discoveryInput.validate()
        if (this.uploadRespond.AffectArea) this.$refs.affectInput.validate()
        if (this.uploadRespond.Scope) this.$refs.scopeInput.validate()
        return false
      } else {
        if (!this.uploadRespond.DiscoveryAndDetection) this.uploadRespond.DiscoveryAndDetection = ''
        if (!this.uploadRespond.Scope) this.uploadRespond.Scope = ''
        if (!this.uploadRespond.AffectArea) this.uploadRespond.AffectArea = ''
        this.step++
        this.setShadowRootMalicousLink('last-preview-body-shadow-root')
      }
    },
    onBeforeLastStep() {
      this.setVisibleBody()
      this.step++
      this.setShadowRootMalicousLink('last-preview-body-shadow-root-review')
    },
    onPreviousButtonClick() {
      this.step = this.step - 1
      if (this.step == 4) {
        this.setShadowRootMalicousLink('last-preview-body-shadow-root')
      } else if (this.step == 1) {
        this.setShadowRootMalicousLink('incident-preview-1')
      }
    },
    onFinish() {
      //CommunityResourceId: this.$route.params.id,
      if (!this.$refs.accept_terms_and_conditions_checkbox.validate()) {
        return this.$nextTick(() => {
          const el = this.$refs.accept_terms_and_conditions_checkbox.$el.querySelector(
            '.error--text'
          )
          scrollToComponent(el)
        })
      }
      if (this.editItem) {
        this.saveDisable = true
        const payload = {
          CommunityResourceId: this.$route.params.id || this.editItem.communityResourceId,
          Title: this.uploadRespond.Title,
          Description: this.uploadRespond.Description,
          CategoryResourceIdArray: this.uploadRespond.CategoryResourceIdArray,
          DiscoveryAndDetection: this.uploadRespond.DiscoveryAndDetection,
          AffectArea: this.uploadRespond.AffectArea,
          Scope: this.uploadRespond.Scope,
          IsAnonymous: this.isAnonym,
          securityLabelResourceIdArray: [this.value],
          CommunityPostEmail: {
            editableBody: this.uploadRespond.editableBody,
            visibleBody: this.uploadRespond.visibleBodyForPreview,
            resourceId: this.uploadRespond.resourceId,
            from: this.uploadRespond.from,
            isFromHidden: this.uploadRespond.isFromHidden,
            isFromFlagged: this.uploadRespond.isFromFlagged,
            subject: this.uploadRespond.subject,
            isSubjectHidden: this.uploadRespond.isSubjectHidden,
            isSubjectFlagged: this.uploadRespond.isSubjectFlagged,
            to: this.uploadRespond.to,
            isToHidden: this.uploadRespond.isToHidden,
            isToFlagged: this.uploadRespond.isToFlagged,
            cc: this.uploadRespond.cc,
            isCcHidden: this.uploadRespond.isCcHidden,
            isCcFlagged: this.uploadRespond.isCcFlagged,
            bcc: this.uploadRespond.bcc,
            isBccHidden: this.uploadRespond.isBccHidden,
            isBccFlagged: this.uploadRespond.isBccFlagged,
            sentTime: this.uploadRespond.sentTime,
            urls: this.uploadRespond.urls,
            attachments: this.uploadRespond.attachments,
            emailTexts: []
          },
          IsTermsAndConditionsAccepted: this.acceptCheckbox
        }
        //CommunityResourceId:this.$route.params.id ,
        updateCommunityPost(this.editItem.communityPostResourceId, payload)
          .then(() => {
            this.saveDisable = false
            this.$store.dispatch('tableReload/setTableReload', true)
            this.onCancelClicked()
            setTimeout(() => {
              this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
            }, 500)
          })
          .catch(() => {
            this.saveDisable = false
          })
      } else {
        this.saveDisable = true
        const payload = {
          CommunityResourceId: this.$route.params.id,
          Title: this.uploadRespond.Title,
          Description: this.uploadRespond.Description,
          CategoryResourceIdArray: this.uploadRespond.CategoryResourceIdArray,
          DiscoveryAndDetection: this.uploadRespond.DiscoveryAndDetection,
          AffectArea: this.uploadRespond.AffectArea,
          Scope: this.uploadRespond.Scope,
          IsAnonymous: this.isAnonym,
          securityLabelResourceIdArray: [this.value],
          EmailPreview: {
            initialBody: this.uploadRespond.initialBody,
            editableBody: this.uploadRespond.editableBody,
            visibleBody: this.uploadRespond.visibleBodyForPreview,
            from: this.uploadRespond.from,
            isFromHidden: this.uploadRespond.isFromHidden,
            isFromFlagged: this.uploadRespond.isFromFlagged,
            subject: this.uploadRespond.subject,
            isSubjectHidden: this.uploadRespond.isSubjectHidden,
            isSubjectFlagged: this.uploadRespond.isSubjectFlagged,
            to: this.uploadRespond.to,
            isToHidden: this.uploadRespond.isToHidden,
            isToFlagged: this.uploadRespond.isToFlagged,
            cc: this.uploadRespond.cc,
            isCcHidden: this.uploadRespond.isCcHidden,
            isCcFlagged: this.uploadRespond.isCcFlagged,
            bcc: this.uploadRespond.bcc,
            isBccHidden: this.uploadRespond.isBccHidden,
            isBccFlagged: this.uploadRespond.isBccFlagged,
            sentTime: this.uploadRespond.sentTime,
            urls: this.uploadRespond.urls,
            attachments: this.uploadRespond.attachments,
            emailTexts: []
          },
          IsTermsAndConditionsAccepted: this.acceptCheckbox
        }
        createCommunityPost(payload)
          .then(() => {
            this.$store.dispatch('tableReload/setTableReload', true)
            this.onCancelClicked()
            setTimeout(() => {
              this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
            }, 500)
          })
          .finally(() => (this.saveDisable = false))
      }
    },
    updateTags() {
      /*
          if (this.uploadRespond && this.uploadRespond.AffectArea && this.uploadRespond.AffectArea.length) {
            for (let [ind, tag] of [this.uploadRespond.AffectArea].entries()) {
              if (!this.regexChar(tag[ind])) this.uploadRespond.AffectArea.splice(ind, 1)
            }
          }
          */
      this.$nextTick(() => {
        this.createInc.select.push(...this.createInc.search.split(','))
        this.$nextTick(() => {
          this.search = ''
        })
      })
    },
    closePreview() {
      this.selectedEmail = ''
      this.uploadRespond = {}
      this.msgEmlFile = null
      this.shareSettings = {}
    },
    stepTwoDisabled() {
      if (
        this.uploadRespond &&
        this.uploadRespond.Title &&
        this.regexChar(this.uploadRespond.Title) &&
        this.uploadRespond.CategoryResourceIdArray &&
        this.uploadRespond.CategoryResourceIdArray &&
        this.uploadRespond.CategoryResourceIdArray.length > 0
      ) {
        return true
      } else {
        return false
      }
    },
    stepThreeDisabled() {
      if (
        this.uploadRespond &&
        this.uploadRespond.DiscoveryAndDetection &&
        this.uploadRespond.DiscoveryAndDetection.length >= 5 &&
        this.uploadRespond.DiscoveryAndDetection.length <= 300 &&
        this.uploadRespond.Scope &&
        this.uploadRespond.Scope.length >= 5 &&
        this.uploadRespond.Scope.length <= 200 &&
        this.regexChar(this.uploadRespond.Scope) &&
        this.regexChar(this.uploadRespond.AffectArea)
      ) {
        return true
      } else {
        return false
      }
    },
    regexChar(val) {
      return /^[A-Za-z0-9ışŞğĞçÇöÖüÜİ\/,\/.\/\-\/_\s]*$/gi.test(val)
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
        this.index = index
      } else {
        this.editing = null
        this.index = -1
      }
    },
    validateAffectArea() {
      const refThis = this
      setTimeout(function () {
        if (refThis.uploadRespond && refThis.uploadRespond.AffectArea) {
          let i = refThis.uploadRespond.AffectArea.length
          while (i--) {
            if (!refThis.regexChar(refThis.uploadRespond.AffectArea[i])) {
              refThis.uploadRespond.AffectArea.splice(i, 1)
            }
          }
        }
      }, 300)
    },
    allFiltersClosed() {
      /*
      if (
        this.shareSettings.subject[0].IsShow === false &&
        this.shareSettings.senderInfo[0].IsShow === false &&
        this.shareSettings.receiverInfo.every((item) => item.IsShow === false) &&
        ((this.shareSettings.attachments.length &&
          this.shareSettings.attachments.every((item) => item.IsShow === false)) ||
          !this.shareSettings.attachments.length) &&
        ((this.shareSettings.links.length &&
          this.shareSettings.links.every((item) => item.IsShow === false)) ||
          !this.shareSettings.links.length)
      ) {
        return true
      } else {
        return false
      }*/
    }
  },
  mounted() {
    if (this.editItem) {
      this.value = this.editItem.securityLabelResourceIdArray[0]
      this.selectedEmail = this.editItem.communityPostResourceId
      //let val = { resourceId: '4pDtxLYSG0mb' }
      let val = { resourceId: this.editItem.communityPostResourceId }
      this.getSelectedEmailPreview(val)
    }
    this.searchNotifiedMail()
    this.getListThreatCategories()
    this.currentCompany =
      (this.editItem && this.editItem.postedUserCompanyName) ||
      localStorage.getItem('selectedCompanyName')
    this.currentCommunityName =
      (this.editItem && this.editItem.communityName) || localStorage.getItem('communityName')
  },
  beforeDestroy() {
    document.querySelector('html').style.overflowY = 'initial'
    document.querySelector('.page-nav').style.zIndex = 19
  }
}
</script>
<style lang="scss" src="./PostIncident.scss"></style>
