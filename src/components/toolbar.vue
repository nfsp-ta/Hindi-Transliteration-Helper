<template>
<v-toolbar
      color="blue darken-3"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="$emit('app-btn')"></v-toolbar-side-icon>
        <span>Hindi Transliteration Helper</span>
      </v-toolbar-title>
    </v-toolbar>
</template>

<script>

export default {
   data: () => ({
  })
}
</script>

<style>
</style>