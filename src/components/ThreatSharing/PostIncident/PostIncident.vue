<template>
  <div class="incident-wrapper">
    <app-modal
      v-if="showNewsletterPageGrapes"
      :status="showNewsletterPageGrapes"
      id="threat-sharing-post-incident-create-edit-modal"
      cancel-button-id="threat-sharing-grapesjs-modal-close-button"
      confirm-button-id="threat-sharing-grapesjs-modal-save-button"
      icon-name="mdi-check"
      title="Edit Post Email"
      :show-header="false"
      @closeOverlay="closeGrapesJs()"
      @submit="saveGrapesJs()"
    >
      <template #overlay-body>
        <GrapesNewsletterModal
          v-if="showNewsletterPageGrapes"
          ref="grapesJsPostIncident"
          :htmlData="editHtmlData"
          :blockManagerComponents="{}"
        />
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
              <v-list-item-title
                class="v-card-headline k-overlay__title"
                style="color: #2196f3 !important;"
                id="text--threat-sharing-incident-post-modal-title"
                >Post an Incident</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-stepper light v-model="step" class="k-stepper">
            <v-stepper-header class="k-stepper__header">
              <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
                >Select Incident</v-stepper-step
              >
              <v-divider class="k-stepper__divider" />
              <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
                >General Info</v-stepper-step
              >
              <v-divider class="k-stepper__divider" />
              <v-stepper-step class="k-stepper__step" :complete="step > 3" :step="3"
                >Incident Details</v-stepper-step
              >
              <v-divider class="k-stepper__divider" />
              <v-stepper-step class="k-stepper__step" :complete="step > 4" :step="4"
                >Attributes</v-stepper-step
              >
              <v-divider class="k-stepper__divider" />
              <v-stepper-step class="k-stepper__step" :complete="step > 5" :step="5"
                >Preview</v-stepper-step
              >
            </v-stepper-header>
            <v-stepper-items class="k-stepper__items">
              <v-stepper-content class="k-stepper__content" :step="1">
                <div id="post-step-one" v-if="step === 1">
                  <ConfigureCompanyStepHeader
                    class="mb-8"
                    title="Select Incident"
                    subtitle="Search for the reported incident or upload an email to post as an
                      incident"
                  />
                  <div v-if="!selectedEmail" class="incident-content mt-0">
                    <FormGroup
                      title="Find Incident"
                      sub-title="Search and find emails among reported incidents"
                    >
                      <PostIncidentInputEmail
                        v-model.trim="selectedEmail"
                        @on-change="getSelectedEmailPreview"
                      />
                    </FormGroup>
                    <div class="input-header mb-6">- or -</div>
                    <div class="input-header">Upload Email</div>
                    <div class="input-sub">Analyze an email file</div>
                    <div class="upload-wrapper">
                      <k-file-upload
                        ref="refFileUpload"
                        :extensions="['eml', 'msg']"
                        :is-stand-alone="true"
                        :on-upload-progress="onUploadProgress"
                        id="threat-sharing-upload-post-incident"
                        hint="Only eml and msg files. Max. file size 30MB"
                        :size="30"
                        @inputFile="uploadFile"
                      />
                    </div>
                    <span
                      v-if="!isStep1Valid"
                      id="post-first-error"
                      style="font-size: 9px; color: #d0021b; margin-top: 17px;"
                      >Please select an incident or upload an email</span
                    >
                  </div>
                  <DatatableLoading
                    v-else-if="isIncidentPreviewLoading"
                    style="max-width: 554px; margin-left: 0; padding-left: 0;"
                    :loading="isIncidentPreviewLoading"
                  />
                  <div id="post-first-preview-container" class="mt-2" v-else-if="selectedEmail">
                    <v-card
                      id="post-first-preview-card"
                      light
                      class="pb-4 pt-0 mt-2 pa-6 investigation-content"
                      style="width: 600px;"
                    >
                      <div class="mail-preview">
                        <v-icon
                          v-if="!editItem"
                          id="threat-sharing-post-first-preview-close"
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
                          v-if="!!uploadRespond.attachments && uploadRespond.attachments.length"
                          id="preview-footer-container-att-preview"
                          class="preview-footer"
                        >
                          <h2>Attachments</h2>
                          <div class="attachment-wrapper">
                            <div
                              v-for="(att, ind) of uploadRespond.attachments"
                              :key="ind + att.id"
                              :id="'text--threat-sharing-incidents-attachment-' + ind"
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
              </v-stepper-content>
              <v-stepper-content class="k-stepper__content" :step="2">
                <div id="post-step-two" class="step-container" v-if="step === 2">
                  <ConfigureCompanyStepHeader
                    class="mb-8"
                    title="General Info"
                    subtitle="Include title, description of incident and neccessary files(pics, documents,
                      or code)"
                  />
                  <v-form ref="refStep2Form">
                    <FormGroup has-hint title="Incident Title">
                      <v-text-field
                        v-model.trim="uploadRespond.Title"
                        id="input--threat-sharing-incident-title"
                        placeholder="Enter Title"
                        outlined
                        dense
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
                    </FormGroup>
                    <FormGroup
                      has-hint
                      title="Description"
                      sub-title="Describe the incident briefly (Max. 300 characters)"
                    >
                      <v-textarea
                        v-model.trim="uploadRespond.Description"
                        id="input--threat-sharing-incident-description"
                        outlined
                        placeholder="Enter Description"
                        dense
                        auto-grow
                        class="comment-input"
                        rows="5"
                        row-height="15"
                        validate-on-blur
                        :rules="[
                          descRule.required,
                          descRule.empty,
                          descRule.default,
                          descRule.minLength
                        ]"
                        hint="*Required"
                        persistent-hint
                      ></v-textarea>
                    </FormGroup>
                    <FormGroup has-hint title="Category" sub-title="Select threat categories">
                      <k-select
                        v-model.trim="uploadRespond.CategoryResourceIdArray"
                        id="input--threat-sharing-incident-category"
                        :items="categories"
                        item-value="resourceId"
                        item-text="name"
                        placeholder="Select the category"
                        chips
                        deletable-chips
                        small-chips
                        multiple
                        outlined
                        custom-menu-class="menu--threat-sharing-incident-category"
                        hint="*Required"
                        persistent-hint
                        :rules="[(v) => (!!v && v.length >= 1) || 'Required']"
                      >
                      </k-select>
                    </FormGroup>
                    <FormGroup
                      title="Security Label (TLP)"
                      sub-title='Use TLP labels to inform recipients about how to share sensitive information.
                      Please visit
                      <a
                        href="https://www.cisa.gov/tlp#:~:text=The%20Traffic%20Light%20Protocol%20(TLP,by%20the%20recipient(s)."
                        class="text-primary"
                        target="_blank"
                        >Traffic Light Protocol</a
                      >
                      for more information.'
                    >
                      <k-select
                        v-model="value"
                        id="input--threat-sharing-incident-tlp"
                        persistent-hint
                        outlined
                        placeholder="Select an option"
                        class="tlp-select"
                        custom-menu-class="menu--threat-sharing-post-tlp"
                        position="top"
                        hint="*Required"
                        :items="tlpItems"
                        :return-object="false"
                        :slots="{ selection: true, item: true }"
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
                    </FormGroup>
                  </v-form>
                </div>
              </v-stepper-content>
              <v-stepper-content class="k-stepper__content" :step="3">
                <div id="post-step-three" class="step-container" v-if="step === 3">
                  <ConfigureCompanyStepHeader
                    class="mb-8"
                    title="Incident Details"
                    subtitle="Enter information on discovery of threat, how it affects and how to fight
                      against"
                  />
                  <v-form ref="refStep3Form">
                    <FormGroup
                      title="Discovery and Detection"
                      sub-title="Explain how the threat was detected and what tools were used?"
                    >
                      <v-textarea
                        v-model.trim="uploadRespond.DiscoveryAndDetection"
                        id="input--threat-sharing-incident-discovery-detection"
                        outlined
                        dense
                        placeholder="Enter discovery and detection"
                        auto-grow
                        class="comment-input"
                        rows="5"
                        row-height="15"
                      ></v-textarea>
                    </FormGroup>
                    <FormGroup
                      title="Impact Range"
                      sub-title="Affect Area <div>Which systems and programs are affected by the threat?</div>"
                    >
                      <InputTag
                        v-model="uploadRespond.AffectArea"
                        ref="refTags"
                        id="input--action-tags-new-training-course-information"
                        placeholder="Windows 10 etc."
                      />
                    </FormGroup>
                    <FormGroup title="Scope" sub-title="How does it work and affect your systems?">
                      <v-text-field
                        v-model.trim="uploadRespond.Scope"
                        id="input--threat-sharing-incident-scope"
                        placeholder="Explain"
                        outlined
                        dense
                      ></v-text-field>
                    </FormGroup>
                  </v-form>
                </div>
              </v-stepper-content>
              <v-stepper-content class="k-stepper__content" :step="4">
                <div id="post-step-four" v-if="step === 4">
                  <ConfigureCompanyStepHeader
                    class="mb-8"
                    title="Select Attributes To Share"
                    subtitle="Hide the information you want to exclude when sharing. You must share at least
                      1 attribute. Mark harmful attributes to let others know about them."
                  />
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
                          style="z-index: 1;"
                          @click="editHtmlTemplate"
                        >
                          <v-icon class="mr-2 text-h6">mdi-pencil</v-icon>
                          Edit</v-btn
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
                        <div
                          class="d-flex justify-space-between investigation-filters__area--filter"
                        >
                          <div class="d-flex">
                            <span
                              id="text--threat-sharing-incident-step-four-hide"
                              class="investigation-filters__area--filter__title"
                              >Hide</span
                            >
                          </div>
                          <div class="d-flex">
                            <span
                              id="text--threat-sharing-incident-step-four-mark-as"
                              class="investigation-filters__area--filter__title mr-4"
                              >Mark as</span
                            >
                          </div>
                        </div>
                        <div
                          class="d-flex justify-space-between investigation-filters__area--filter"
                        >
                          <div class="d-flex" v-if="uploadRespond.subject">
                            <v-checkbox
                              v-model="allHeader"
                              id="input--threat-sharing-incident-is-header"
                              hide-details
                              :indeterminate="checkHeaderSelected && !this.allHeader"
                              @change="headerValChange"
                            ></v-checkbox>
                            <div v-if="filterOpened">All Header</div>
                          </div>
                          <div class="d-flex">
                            <div class="img-wrapper mr-10">
                              <v-icon>mdi-menu</v-icon>
                              <span class="investigation-filters__area--filter__all-header"
                                >All</span
                              >
                            </div>
                          </div>
                        </div>
                        <div
                          class="d-flex justify-space-between investigation-filters__area--filter"
                        >
                          <div class="d-flex" v-if="uploadRespond.subject">
                            <v-checkbox
                              v-model="uploadRespond.isSubjectHidden"
                              id="input--threat-sharing-incident-is-subject-hidden"
                              hide-details
                              off-icon="mdi-eye"
                              on-icon="mdi-eye-off"
                              @change="subjectValChange"
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
                              v-model="subSettings"
                              :disabled="uploadRespond.isSubjectHidden"
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
                                  :class="{
                                    'disabled-chevron': uploadRespond.isSubjectHidden
                                  }"
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
                                      <v-icon v-if="!uploadRespond.isSubjectFlagged"
                                        >mdi-check</v-icon
                                      >
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
                                      <v-icon v-if="uploadRespond.isSubjectFlagged"
                                        >mdi-check</v-icon
                                      >
                                    </div>
                                    Flagged Subject
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </div>
                        <div
                          class="d-flex justify-space-between investigation-filters__area--filter"
                        >
                          <div class="d-flex" v-if="uploadRespond.from">
                            <v-checkbox
                              v-model="uploadRespond.isFromHidden"
                              id="input--threat-sharing-incident-is-from-hidden"
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
                                  :class="{
                                    'disabled-chevron': uploadRespond.isFromHidden
                                  }"
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
                          v-if="uploadRespond.to && uploadRespond.to.length"
                          class="d-flex justify-space-between investigation-filters__area--filter"
                        >
                          <div class="d-flex" v-if="uploadRespond.to && uploadRespond.to.length">
                            <v-checkbox
                              v-model="uploadRespond.isToHidden"
                              id="input--threat-sharing-incident-is-to-hidden"
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
                              v-model="toSettings"
                              :disabled="uploadRespond.isToHidden"
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
                                  :class="{
                                    'disabled-chevron': uploadRespond.isToHidden
                                  }"
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
                              id="input--threat-sharing-incident-is-cc-hidden"
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
                                  :class="{
                                    'disabled-chevron': uploadRespond.isCcHidden
                                  }"
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
                              id="input--threat-sharing-incident-is-bcc-hidden"
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
                                  :class="{
                                    'disabled-chevron': uploadRespond.isBccHidden
                                  }"
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
                        <div
                          class="d-flex justify-space-between investigation-filters__area--filter"
                        >
                          <div class="d-flex">
                            <v-checkbox
                              v-model="allLinks"
                              id="input--threat-sharing-incident-is-all-links"
                              :indeterminate="
                                uploadRespond.urls.find((item) => item.isHidden) && !allLinks
                              "
                              hide-details
                              @change="allUrlsValChange"
                            ></v-checkbox>
                            <label v-if="filterOpened">All Links</label>
                          </div>
                          <div class="d-flex">
                            <div class="img-wrapper mr-10">
                              <v-icon>mdi-link</v-icon
                              ><span class="investigation-filters__area--filter__all-header"
                                >All</span
                              >
                            </div>
                          </div>
                        </div>
                        <div
                          v-for="(url, ind) of uploadRespond.urls"
                          class="d-flex justify-space-between investigation-filters__area--filter"
                          :key="ind + url.url"
                          :id="ind + url.url"
                        >
                          <div class="d-flex">
                            <v-checkbox
                              v-model="url.isHidden"
                              id="input--threat-sharing-incident-is-url-hidden"
                              hide-details
                              off-icon="mdi-eye"
                              on-icon="mdi-eye-off"
                              @change="urlSwitchChange(url, ind)"
                            ></v-checkbox>
                            <v-tooltip bottom opacity="1" z-index="9999">
                              <template #activator="{ on }">
                                <label
                                  v-if="filterOpened"
                                  v-on="on"
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
                                  <v-icon
                                    :class="{
                                      'chevron-down': attcChevron[ind]
                                    }"
                                    v-on="on"
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
                        v-if="uploadRespond.attachments && !!uploadRespond.attachments.length"
                        class="investigation-filters__area--breaker"
                      >
                        <div class="investigation-filters__area--breaker__line"></div>
                      </div>
                      <div
                        v-if="uploadRespond.attachments && !!uploadRespond.attachments.length"
                        class="investigation-filters__area"
                      >
                        <div
                          class="d-flex justify-space-between investigation-filters__area--filter"
                        >
                          <div class="d-flex">
                            <v-checkbox
                              v-model="allAttachments"
                              id="input--threat-sharing-incident-is-all-attachments"
                              :indeterminate="
                                uploadRespond.attachments.find((item) => item.isHidden) &&
                                !allAttachments
                              "
                              hide-details
                              @change="allAttachmentsValChange"
                            ></v-checkbox>
                            <label v-if="filterOpened">All Attachments</label>
                          </div>
                          <div class="d-flex">
                            <div class="img-wrapper mr-10">
                              <v-icon>mdi-paperclip</v-icon
                              ><span class="investigation-filters__area--filter__all-header"
                                >All</span
                              >
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
                              :id="`input--attachment-is-hidden-${ind}`"
                              hide-details
                              off-icon="mdi-eye"
                              on-icon="mdi-eye-off"
                              @change="checkAttachmentsChangeForAllLinksSwitch(attachment, ind)"
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
                                  :class="{
                                    'disabled-chevron': attachment.isHidden
                                  }"
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
                    </div>
                  </div>
                </div>
              </v-stepper-content>
              <v-stepper-content class="k-stepper__content" :step="5">
                <div id="post-step-five" v-if="step === 5">
                  <!-- Step 5 Stars here -->
                  <ConfigureCompanyStepHeader
                    class="mb-2"
                    title="Preview"
                    subtitle="See how your post will look like"
                  />
                  <v-checkbox
                    v-model="isAnonym"
                    class="is-anonym-check"
                    id="input--threat-sharing-incident-is-anonym"
                    label="Post as anonymous"
                    color="#2196f3"
                  ></v-checkbox>
                  <PostIncidentPreviewPost
                    :upload-respond="uploadRespond"
                    :current-community-name="currentCommunityName"
                    :current-company="currentCompany"
                    :is-anonym="isAnonym"
                  />
                  <v-form ref="acceptTermsAndConditionsCheckbox">
                    <div class="d-flex" style="margin-bottom: 8px;">
                      <v-checkbox
                        v-model="acceptCheckbox"
                        id="accept-terms-and-conditions-post-incident"
                        class="k-checkbox accept-terms-and-conditions-checkbox"
                        color="#2196f3"
                        :rules="[checkboxRule.required]"
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
                        <label :for="'accept-terms-and-conditions-post-incident'">
                          for communities</label
                        >
                      </div>
                    </div>
                  </v-form>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
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
              class="create-btn"
              text
              color="#2196f3"
              @click="onContinue"
              >Next
            </v-btn>
            <v-btn
              v-if="step === 2"
              id="threat-sharing-post-incident-step-two-next-button"
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
              v-if="step === 4"
              id="threat-sharing-post-incident-step-four-next-button"
              class="create-btn"
              text
              color="#2196f3"
              @click="onBeforeLastStep"
              >Next
            </v-btn>
            <v-btn
              v-if="step === 5"
              id="threat-sharing-post-incident-step-five-next-button"
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
import PreviewHeader from '@/components/ThreatSharing/PreviewHeader'
import PreviewHeaderForSinglePost from '@/components/ThreatSharing/PreviewHeaderForSinglePost'
import {
  createCommunityPost,
  getCommunityPostEditableData,
  getSelectedEmailPreview,
  listThreatCategories,
  parseEmail,
  updateCommunityPost,
  uploadEmlOrMsg
} from '@/api/threatSharing'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import KShadowFrame from '@/components/KShadowFrame'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import GrapesNewsletterModal from '@/components/GrapesJs/Newsletter/GrapesNewsletterModal'
import {
  incidenPostReviewElementBind,
  scrollToComponent,
  isDifferent,
  copyToClipboard
} from '@/utils/functions'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import * as Validations from '@/utils/validations'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import PostIncidentInputEmail from '@/components/ThreatSharing/PostIncident/PostIncidentInputEmail'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { tlpItems } from '@/components/ThreatSharing/PostIncident/utils'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputTag from '@/components/Common/Inputs/InputTag'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import PostIncidentPreviewPost from '@/components/ThreatSharing/PostIncident/PostIncidentPreviewPost'
import useHTMLSanitizer from '@/hooks/useHTMLSanitizer'
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
    PostIncidentPreviewPost,
    DatatableLoading,
    InputTag,
    FormGroup,
    KSelect,
    PostIncidentInputEmail,
    ConfigureCompanyStepHeader,
    KFileUpload,
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
    communityName: {
      type: String
    }
  },
  data: () => ({
    initialFormValues: {},
    saveDisable: false,
    labels,
    termsAndConditionsUrl: 'https://www.keepnetlabs.com/terms-conditions/',
    acceptCheckbox: false,
    editHtmlData: null,
    showNewsletterPageGrapes: false,
    value: 'wFlYRDMW946M',
    tlpItems,
    fromSettings: false,
    toSettings: false,
    ccSettings: false,
    bccSettings: false,
    subSettings: false,
    currentCompany: null,
    step: 1,
    items: [],
    categories: ['Malicious', 'Non-malicious', 'Phishing'],
    selectedEmail: null,
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
    titleRule: {
      required: (v) => Validations.required(v),
      default: (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage('Title')),
      regex: (v) =>
        /^[A-Z0-9ışŞğĞçÇöÖüÜİ\/,.\-_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      empty: (v) => (v && !v.startsWith(' ')) || 'Cannot start with space',
      minLength: (v) => Validations.minLength(v, 4, labels.getMinLengthMessage(labels.Title, 4))
    },
    descRule: {
      default: (v) => Validations.maxLength(v, 300, labels.getMaxLengthMessage('Description', 300)),
      required: (v) => Validations.required(v),
      regex: (v) =>
        /^[A-Z0-9ışŞğĞçÇöÖüÜİ\/,.\-_\s]*$/gi.test(v) ||
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
    filterOpened: true,
    attcChevron: [],
    isIncidentPreviewLoading: false,
    urls: [],
    msgEmlFile: null,
    currentCommunityName: '',
    uploadRespond: {
      DiscoveryAndDetection: ' '
    },
    allHeader: false,
    allLinks: false,
    allAttachments: false,
    isAnonym: false,
    onUploadProgress: null
  }),
  computed: {
    isStep1Valid() {
      return this.selectedEmail || this.msgEmlFile
    },
    checkHeaderSelected() {
      return !!(
        this.uploadRespond.isSubjectHidden ||
        this.uploadRespond.isFromHidden ||
        this.uploadRespond.isToHidden ||
        this.uploadRespond.isCcHidden ||
        this.uploadRespond.isBccHidden
      )
    }
  },
  created() {
    document.querySelector('html').style.overflowY = 'hidden'
    const pageNav = document.querySelector('.page-nav')
    if (pageNav) {
      pageNav.style.zIndex = 8
    }
  },
  mounted() {
    this.initialFormValues = {
      ...this.initialFormValues,
      selectedEmail: '',
      isAnonym: false,
      acceptCheckbox: false
    }
    if (this.editItem) {
      this.acceptCheckbox = true
      this.value = this.editItem.securityLabelResourceIdArray[0]
      this.selectedEmail = this.editItem.communityPostResourceId
      this.initialFormValues = {
        ...this.initialFormValues,
        selectedEmail: this.selectedEmail,
        value: this.value
      }
      let val = { resourceId: this.editItem.communityPostResourceId }
      this.getSelectedEmailPreview(val, true)
    }
    this.getListThreatCategories()
    this.currentCompany =
      (this.editItem && this.editItem.postedUserCompanyName) ||
      localStorage.getItem('selectedCompanyName')
    this.currentCommunityName =
      (this.editItem && this.editItem.communityName) || localStorage.getItem('communityName')
    this.initialFormValues = {
      ...this.initialFormValues,
      currentCompany: this.currentCompany,
      currentCommunityName: this.currentCommunityName
    }
  },
  beforeDestroy() {
    document.querySelector('html').style.overflowY = 'initial'
    const pageNav = document.querySelector('.page-nav')
    if (pageNav) {
      pageNav.style.zIndex = 19
    }
  },
  methods: {
    setVisibleBody() {
      let urls = this.uploadRespond.urls.filter((item) => item.isHidden)
      for (let url of urls) {
        let els = document
          .getElementById('last-preview-body-shadow-root-for-preview')
          ?.shadowRoot?.querySelectorAll('[href="' + url.url + '"]')
        if (els?.length) {
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
      )?.shadowRoot?.innerHTML
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
    contentCopy(contentBody) {
      copyToClipboard(contentBody)
        .then(() => [
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Content has been copied'
          })
        ])
        .catch(() => {})
    },
    urlSwitchChange(url, id, rootId) {
      this.checkUrlChangeForAllLinksSwitch()
      let els = document
        .getElementById(rootId || 'last-preview-body-shadow-root')
        ?.shadowRoot?.querySelectorAll('[href="' + url.url + '"]')
      if (els?.length) {
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
          document.getElementById(id) && document.getElementById(id)?.shadowRoot
        if (!recrusiveFunctionForDom) recrusiveFunctionForDom()
        _this.uploadRespond.urls =
          _this?.uploadRespond?.urls?.map((item, index) => {
            let urlItem = document
              .getElementById(id)
              ?.shadowRoot?.querySelectorAll('[href="' + item.url + '"]')
            return {
              ...item,
              url: item.url.replace(/amp;/g, ''),
              name: item.name,
              urlHtml:
                urlItem && !!urlItem.length && urlItem[0].innerHTML ? urlItem[0].innerHTML : null,
              index: index + 1
            }
          }) || []
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
    checkAttachmentsChangeForAllLinksSwitch(att) {
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
      }).then(async (response) => {
        this.selectedEmail = response.data.data.from
        this.uploadRespond = response.data.data
        const sanitizedInitialBody = await useHTMLSanitizer(response.data.data.initialBody)
        this.uploadRespond.initialBody = sanitizedInitialBody
        this.uploadRespond.visibleBody = sanitizedInitialBody
        this.uploadRespond.editableBody = sanitizedInitialBody
        this.uploadRespond.visibleBodyForPreview = sanitizedInitialBody
        this.setShadowRootMalicousLink('incident-preview-1')
      })
    },
    getSelectedEmailPreview(selectedItem, isInitial = false) {
      if (this.editItem) {
        this.isIncidentPreviewLoading = true
        getCommunityPostEditableData(this.editItem.communityPostResourceId)
          .then(async (response) => {
            const { data } = response
            this.uploadRespond = data.data.communityPostEmail
            const previewedBody =
              data.data.communityPostEmail.editableBody ||
              data.data.communityPostEmail.visibleBody ||
              data.data.communityPostEmail.initialBody
            this.uploadRespond.visibleBodyForPreview = await useHTMLSanitizer(previewedBody)
            if (this.editItem) {
              this.uploadRespond.CommunityPostResourceId = this.editItem.communityPostResourceId
              this.uploadRespond.Title = this.editItem.title
              this.uploadRespond.Description = this.editItem.description
              this.uploadRespond.DiscoveryAndDetection = this.editItem.discoveryAndDetection
              this.uploadRespond.Scope = this.editItem.scope
              this.uploadRespond.CategoryResourceIdArray = this.editItem.categoryResourceIdArray
              this.uploadRespond.PostedUserFullName = this.editItem.postedUserFullName
              this.uploadRespond.PostedUserCompanyName = this.editItem.postedUserCompanyName
              this.uploadRespond.PostedTime = this.editItem.postedTime
              this.uploadRespond.LikeCount = this.editItem.likeCount
              this.uploadRespond.CommentCount = this.editItem.commentCount
              this.uploadRespond.HarmfulItemCount = this.editItem.harmfulItemCount
              this.uploadRespond.HasAttachment = this.editItem.hasAttachment
              this.uploadRespond.CommunityResourceId = this.editItem.communityResourceId
              this.uploadRespond.CommunityName = this.editItem.communityName
              this.uploadRespond.AffectArea = data.data.affectArea || []
            }
            if (!this.uploadRespond.bcc) this.uploadRespond.bcc = []
            if (!this.uploadRespond.cc) this.uploadRespond.cc = []
            if (!this.uploadRespond.to) this.uploadRespond.to = []
            this.setShadowRootMalicousLink('incident-preview-1')
            if (isInitial) {
              this.initialFormValues = {
                ...this.initialFormValues,
                uploadRespond: {
                  ...this.initialFormValues.uploadRespond,
                  ...this.uploadRespond
                }
              }
            }
          })
          .finally(() => (this.isIncidentPreviewLoading = false))
      } else if (selectedItem?.resourceId) {
        this.isIncidentPreviewLoading = true
        getSelectedEmailPreview(selectedItem.resourceId)
          .then(async (response) => {
            const { data } = response
            this.uploadRespond = data.data
            const sanitizedInitialBody = await useHTMLSanitizer(response.data.data.initialBody)
            this.uploadRespond.initialBody = sanitizedInitialBody
            this.uploadRespond.visibleBody = sanitizedInitialBody
            this.uploadRespond.editableBody = sanitizedInitialBody
            this.uploadRespond.visibleBodyForPreview = sanitizedInitialBody
            if (isInitial) {
              this.initialFormValues = {
                ...this.initialFormValues,
                uploadRespond: {
                  ...this.initialFormValues.uploadRespond,
                  ...this.uploadRespond
                }
              }
            }
          })
          .finally(() => (this.isIncidentPreviewLoading = false))
      }
    },
    onCancelClicked() {
      const currentFormValues = {
        selectedEmail: this.selectedEmail,
        uploadRespond: this.uploadRespond,
        currentCommunityName: this.currentCommunityName,
        currentCompany: this.currentCompany,
        value: this.value,
        isAnonym: this.isAnonym,
        acceptCheckbox: this.acceptCheckbox
      }
      const isChanged = isDifferent(this.initialFormValues, currentFormValues)
      if (!isChanged) {
        this.$emit('refreshData')
        this.$emit('closeIncidentModal')
        return
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('refreshData')
          this.$emit('closeIncidentModal')
        }
      })
    },
    onContinue() {
      if (!this.isStep1Valid) return this.step
      return this.step++
    },
    onSecondStep() {
      if (this?.$refs?.refStep2Form?.validate()) this.step++
    },
    onThirdStep() {
      if (!this?.$refs?.refStep3Form.validate()) return
      this.step++
      this.setShadowRootMalicousLink('last-preview-body-shadow-root')
    },
    onBeforeLastStep() {
      this.setVisibleBody()
      this.step++
      this.setShadowRootMalicousLink('last-preview-body-shadow-root-review')
    },
    onPreviousButtonClick() {
      this.step = this.step - 1
      if (this.step === 4) {
        this.setShadowRootMalicousLink('last-preview-body-shadow-root')
      } else if (this.step === 1) {
        this.setShadowRootMalicousLink('incident-preview-1')
      }
    },
    onFinish() {
      if (!this.$refs.acceptTermsAndConditionsCheckbox.validate()) {
        return this.$nextTick(() => {
          const el = this.$refs.acceptTermsAndConditionsCheckbox.$el.querySelector('.error--text')
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
        updateCommunityPost(this.editItem.communityPostResourceId, payload)
          .then(() => {
            this.saveDisable = false
            this.$store.dispatch('tableReload/setTableReload', true)
            this.$emit('refreshData')
            this.$emit('closeIncidentModal')
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
          DiscoveryAndDetection: this.uploadRespond.DiscoveryAndDetection || '',
          AffectArea: this.uploadRespond.AffectArea || '',
          Scope: this.uploadRespond.Scope || '',
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
            this.$emit('refreshData')
            this.$emit('closeIncidentModal')
            setTimeout(() => {
              this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
            }, 500)
          })
          .finally(() => (this.saveDisable = false))
      }
    },
    closePreview() {
      this.selectedEmail = null
      this.uploadRespond = {}
      this.msgEmlFile = null
    }
  }
}
</script>
