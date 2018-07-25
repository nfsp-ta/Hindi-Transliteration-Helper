<template>
  <v-app>
    <input 
      type="file"
      style="display:none"
      ref="fileLoader"
      accept=".json"
      @change="openFile" />
    <app-toolbar @app-btn="drawer.open = !drawer.open"></app-toolbar>
    <app-menu 
      v-model="drawer"
      @menu-open="showOpenDialog"
      @menu-load="showLoadDialog"
      @menu-save="downloadArticle">
    </app-menu>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">Load From Clipboard</v-card-title>
        <v-card-text>
          <v-text-field v-model="txt" label="Paste Hindi Text Here"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn @click="loadHindi">Load</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center xs12>
          <v-container xs12>
          	<p 
              class="xs12"
              v-if="paragraphs!=null"
              v-for="(paragraph, pId) in paragraphs"
              :key="pId">
              <span v-for="(word, wId) in paragraph" class="pair" :key="wId">
                <span class="hi">{{word.word}}</span>
                <span class="en" @click="word.edt = true;">
                  <span class="txt" v-show="!word.edt">{{dict[word.hi]}}</span>
                  <input 
                    class="edt"
                    v-autosize
                    v-focus="word.edt"
                    v-show="word.edt"
                    v-model.trim="dict[word.hi]"
                    @blur="word.edt = false"
                    @keydown="wordEditing($event,pId,wId)"
                    @keyup="wordEdited($event,pId,wId)" />
                </span>
              </span>
            </p>
          </v-container>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import appToolbar from './components/toolbar.vue'
import appMenu from './components/menu.vue'
import Vue from 'vue'

function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) { // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  } else { // Others
    var a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);  
    }, 0); 
  }
}

export default {
  name: 'app',
  components: {
    'app-toolbar': appToolbar, 
    'app-menu': appMenu,
  },
  data: () => ({
    dialog: false,
    txt: "",
    drawer: {
      open: true
    },
    paragraphs: [
      [
        /*{word: 'आप', hi: 'आप', edt: false},
        {word: 'कैसे', hi: 'कैसे', edt: false},
        {word: 'हैं?', hi: 'हैं', edt: false}*/
      ]
    ],
    dict: {
      /*'आप':'aap',
      'कैसे':'kai-se',
      'हैं':'hai'*/
    }
  }),
  methods: {
    downloadArticle: function () {
      var article = this.paragraphs.map(function(paragraph) {
        return paragraph.map(function(word) {
          return {w: word.word, h: word.hi};
        });
      });
      download(JSON.stringify({dict: this.dict, article: article}),'article.json');
    },
    showOpenDialog: function () {
      this.$refs.fileLoader.click();
    },
    showLoadDialog: function () {
      this.dialog = true;
    },
    wordEditing: function(evt, pId, wId) {
      let ele = evt.currentTarget;
      let nextWord = null;
      if ((ele.value.length === 0 && evt.key == "Backspace") || (ele.selectionEnd == 0 && ele.selectionStart == 0 && evt.key == "ArrowLeft")) {
        nextWord = this.paragraphs[pId][wId - 1];
        this.paragraphs[pId][wId].edt = false;          
      }
      if (ele.selectionStart == ele.selectionEnd && ele.selectionEnd == ele.value.length && evt.key == "ArrowRight") {
        nextWord = this.paragraphs[pId][wId + 1];
        this.paragraphs[pId][wId].edt = false;
      }
      if (nextWord != null)
        nextWord.edt = true;
    },
    wordEdited: function(evt, pId, wId) {
      let ele = evt.currentTarget;
      let nextWord = null;
      if (ele.value.slice(-1) === " ") {
        nextWord = this.paragraphs[pId][wId + 1];
        this.paragraphs[pId][wId].edt = false;
      }
      if ( false) {
        nextWord = this.paragraphs[pId][wId - 1];
        this.paragraphs[pId][wId].edt = false;
      }
      if (nextWord != null)
        nextWord.edt = true;
    },
    openFile: function() {
      const self = this;
			var theFile = this.$refs.fileLoader.files[0];
			if (theFile.size > 0)
			{
				var reader = new FileReader();
				reader.readAsText(theFile);
				reader.onload = function() {
          var file = JSON.parse(reader.result);
          if (file.dict) {
            for (var key in file.dict) {
              Vue.set(self.dict, key, file.dict[key]);
            }
          }
          if (file.article) {
            file.article.map(function(paragraph) {
              var parTmp = [];
              paragraph.map(function(word) {
                parTmp.push({word: word.w, hi: word.h, edt: false});
              });
              self.paragraphs.push(parTmp);
            })
          }
        }
      }
      self.drawer.open = false;
    },
    loadHindi: function() {
      var dict = this.dict;
      var paragraphs = this.paragraphs;
      var txt = this.txt.replace(/\n\n/g, "\n");
      this.txt = "";
      var ary1 = txt.split("\n");
      ary1.forEach(function(par){
        var parTmp = [];
        var txt2 = par.replace(/—/g, " —");
        var ary2 = txt2.split(" ");
        var rgx = /[^\u0900-\u0963\u0965-\u097F-]*/gi
        ary2.forEach(function(w){
          var hw = w.replace(rgx,"");
          Vue.set(dict, hw, "");
          parTmp.push({word: w, hi: hw, edt: false});
        });
        paragraphs.push(parTmp);
      });
      this.dialog = false;
    }
  }
}
</script>

<style>
  p {
    display: flex;
    flex-wrap: wrap;
  }
  .pair {
		display: inline-block;
		text-align: center;
		margin: 0.7em 0.25em;
	}
	.en {
		display: block;
		width: 100%;
		text-align: center;
	}
	.hi {
		display: block;
		font-size: 1.3em;
	}
	.hio {
		display: none;
	}
	.txt {
		display: block;
		height: 1.25em;
		min-height: 1.25em;
		line-height: 1.25;
	}
	.edt {
		text-align: center;
		align-self: center;
		width: 1em;
		border: none;
		padding: 0;
	}
	@media print{
		body {font-size: .6em;}
		p {page-break-inside: avoid;}
	}
</style>