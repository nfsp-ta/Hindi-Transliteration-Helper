<template>
<div>

    <v-navigation-drawer
      fixed
      app
      v-model="drawer.open"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            row
            :clipped="$vuetify.breakpoint.mdAndUp"
            v-if="item.heading"
            align-center
            :key="item.heading"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click.stop="if(child.event) $emit('menu-' + child.event)"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile
            v-else
            :key="item.text"
            @click.stop="if(item.event) $emit('menu-' + item.event)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    </div>
  </template>

<script>
export default {
      data() {
      return {
        drawer: this.value,
      items: [
        { heading: 'Article'},
        { icon: 'folder_open', text: 'Open...', event: 'open' },
        { icon: 'save', text: 'Save...', event: 'save' },
        { icon: 'assignment', text: 'Load from Clipboard...', event: 'load' },
        { heading: 'Options'},
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Settings',
          model: false,
          children: [
            { text: 'Test' }
          ]
        },
        { icon: 'help', text: 'Help' }
      ]
  }},
  props: ['value'],
    watch: {
      drawer: {
        handler: function () {
          this.$emit('input', this.drawer);
        },
        deep: true
      }
    },
}
</script>

<style>
</style>