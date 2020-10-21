<template>
  <div id="app">
    <HeaderBar />
    <img alt="Vue logo" src="@/assets/logo.png">
    <HelloWorld />
  </div>
</template>

<script>
import HeaderBar from '@/components/header-bar';
import HelloWorld from '@/components/HelloWorld';

export default {
  name: 'App',
  components: { HeaderBar, HelloWorld }
}
</script>

<style lang="scss">
  @import '@/styles/index.scss';
</style>
