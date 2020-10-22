<template>
  <div class="content-container">
    <div class="section content-title-group">
      <h2 class="title">Welcome to the Azure AD + Graph demo app with Vue.js</h2>
    </div>
    <div v-if="account">
      You are logged in as {{account.username}}
    </div>
    <div v-else>
      You need to authenticate to access your SQL data
    </div>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data(){
    return{
      account:undefined,
    }
  },
  created(){
    this.$emitter.on('login', (account) => {
      this.account = account;
      console.log(this.account);
    }),
    this.$emitter.on('logout', () => {
        this.account = undefined;
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
