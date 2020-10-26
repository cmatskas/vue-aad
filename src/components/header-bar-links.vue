<template>
  <div class="navbar-menu">
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a :href="github" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-github fa-2x" aria-hidden="true"></i>
          </a>
          <a :href="twitter" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-twitter fa-2x" aria-hidden="true"></i>
          </a>
          <a v-if="!account" @click="SignIn" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-sign-in-alt fa-2x" aria-hidden="false"></i>
          </a>
          <a v-else @click="SignOut" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-sign-out-alt fa-2x" aria-hidden="false"></i>
          </a>
          <div v-if="account">{{account.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as msal from "@azure/msal-browser";

export default {
  data() {
    return {
      account: undefined,
      github: 'https://github.com/cmatskas',
      twitter: 'https://twitter.com/christosmatskas',
      signin: 'https://microsoft.com',
    };
  },
  async created() {
    this.$msalInstance = new msal.PublicClientApplication(this.$store.state.msalConfig);
  },
  mounted() {
    const accounts = this.$msalInstance.getAllAccounts();
    if(accounts.length == 0){
      return;
    }
    this.account = accounts[0];
    this.$emitter.emit('login', this.account);
  },
  methods: {
    async SignIn() {
      await this.$msalInstance.loginPopup({})
        .then( () => {
          const myAccounts = this.$msalInstance.getAllAccounts();
          this.account = myAccounts[0];
          this.$emitter.emit('login', this.account);
        })
        .catch( (error) => {
          console.error(`error during authentication: ${error}`) 
        });
    },
    async SignOut(){
      await this.$msalInstance.logout({})
        .then(() =>{
          this.$emitter.emit('logout', 'logging out');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
};
</script>
