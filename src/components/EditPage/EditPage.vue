<template>
  <div class="edit-page">
    <v-snackbar v-model="snackbar">
      {{snackbarMessage}}<v-btn
        color="pink"
        text
        @click="snackbar = false"
      >Close</v-btn></v-snackbar>
    <div class="form-actions">
      <v-btn
        color="primary"
        text
        @click="$router.back()"
      >Back</v-btn>
      <v-btn
        color="success"
        @click="handleSubmit"
      >Submit</v-btn>
    </div>
    <div>
      <v-text-field
        label="Title"
        :value="title"
        @input="updateTitleValue"
        :disabled="mode === 'edit'"
      ></v-text-field>
    </div>
    <div v-if="mode === 'edit'">
      <v-text-field
        label="Description of changes"
        :value="changelog"
        @input="updateChangelog"
      ></v-text-field>
    </div>
    <div class="editor">
      <div class="text-input">
        <v-textarea
          filled
          full-width
          auto-grow
          name="md-input"
          label="Enter Markdown here."
          :value="textBoxValue"
          @input="updateTextValue"
        ></v-textarea>
      </div>
      <div class="md-preview elevation-1">
        <!-- <VueMarkdown :source="textBoxValue"></VueMarkdown> -->
        <div v-html="mde.render(textBoxValue)"></div>
      </div>
    </div>
    <div class="subtitle-2">Max filesize: 5MB</div>
    <br/>
    <div v-for="(upload, index) in numOfUpload" class="upload-box" :key="index">
      <div><v-file-input
      accept="image/png, image/jpeg, image/gif"
      label="Click here to upload image"
      outlined
      dense
      @change="(e) => populateUploadImages(e, index)"
      ></v-file-input></div>
      <div v-if="links[index]">
        <v-list subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                Place this text anywhere you want the image to be:
              </v-list-item-title>
              <v-list-item-subtitle
              class="image-code"
              @click="copyTextFromDiv">
                {{links[index]}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </div>
    <div>
      <v-btn @click="addImage">Add another image</v-btn>
    </div>
  </div>
</template>

<style src="./EditPage.scss" lang="scss" scoped></style>

<script>
import { postEntry, putEntry, getEntry } from '@/api/entries'
import { postImage } from '@/api/images'

const wikilinks = require('markdown-it-wikilinks')()
const mde = require('markdown-it')().use(wikilinks)

export default {
  name: 'EditPage',
  data: () => ({
    textBoxValue: '',
    title: 'Untitled',
    snackbar: false,
    changelog: '',
    mde,
    numOfUpload: 1,
    imagesToUpload: [],
    links: [],
    snackbarMessage: 'Sorry, the submission was invalid, please check your inputs.',
  }),
  computed: {
    mode() {
      if (this.$route.path.includes('add')) {
        return 'add'
      }
      if (this.$route.path.includes('edit')) {
        return 'edit'
      }
      return 'add'
    },
  },
  async mounted() {
    const entryName = this.$route.params.id
    if (entryName) {
      const entry = await getEntry(decodeURI(entryName))
      if (!entry.title) {
        this.$router.push({ name: 'NotFound' })
      }
      this.textBoxValue = entry.md
      this.title = entry.title || 'Untitled'
    }
  },
  methods: {
    goToEdit() {
      this.$router.push({ name: 'Edit' })
    },
    updateTextValue(e) {
      this.textBoxValue = e
    },
    updateTitleValue(e) {
      this.title = e
    },
    updateChangelog(e) {
      this.changelog = e
    },
    async add() {
      // upload text to page id
      const res = await postEntry({
        title: this.title,
        md: this.textBoxValue,
      })

      if (res.success) {
        // reroute to editted page
        this.$router.push({ name: 'Entry', params: { id: res.cb } })
      } else {
        this.snackbar = true
      }
    },
    async edit() {
      // upload text to page id
      const res = await putEntry(this.$route.params.id, {
        title: this.title,
        md: this.textBoxValue,
        changelog: this.changelog,
      })

      if (res.success) {
        // reroute to editted page
        this.$router.push({ name: 'Entry', params: { id: this.$route.params.id } })
      } else {
        this.snackbarMessage = 'Sorry, the submission was invalid, please check your inputs.'
        this.snackbar = true
      }
    },
    async handleSubmit() {
      if (this.mode === 'add') {
        this.add()
      } else if (this.mode === 'edit') {
        this.edit()
      } else {
        // eslint-disable-next-line no-alert
        alert('error, invalid submission')
      }
    },
    parseForLinks(text) {
      const replacer = (matched) => {
        const term = matched.substring(2, matched.length - 2)
        return `[${term}](${window.location.origin}/entry/${term})`
      }
      return text.replace(/\[\[.*?\]\]/mg, replacer)
    },
    addImage() {
      this.numOfUpload += 1
    },
    async populateUploadImages(e, index) {
      if (e) {
        const file = new FormData()
        file.append('image', e)
        const res = await postImage(file)
        this.$set(this.links, index, `![alt text](http://localhost:3001/images/i/${res.cb} "${e.name}")`)
      }
    },
    copyTextFromDiv(e) {
      const el = document.createElement('textarea') // Create a <textarea> element
      el.value = e.target.innerText // Set its value to the string that you want copied
      el.setAttribute('readonly', '') // Make it readonly to be tamper-proof
      el.style.position = 'absolute'
      el.style.left = '-9999px' // Move outside the screen to make it invisible
      document.body.appendChild(el) // Append the <textarea> element to the HTML document
      const selected = document.getSelection()
        .rangeCount > 0 // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0) // Store selection if found
        : false // Mark as false to know no selection existed before
      el.select() // Select the <textarea> content
      document.execCommand('copy') // Copy - only works as a result of a user action (e.g. click events)
      document.body.removeChild(el) // Remove the <textarea> element
      if (selected) { // If a selection existed before copying
        document.getSelection().removeAllRanges() // Unselect everything on the HTML document
        document.getSelection().addRange(selected) // Restore the original selection
      }

      /* Alert the copied text */
      this.snackbarMessage = 'Copied code to clipboard.'
      this.snackbar = true
    },
  },
}
</script>
