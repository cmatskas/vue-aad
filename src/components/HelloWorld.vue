<template>
  <div class="content-container">
    <div class="section content-title-group">
      <h2 class="title">Welcome to the Azure AD + Graph demo app with Vue.js</h2>
    </div>
    <div v-if="account">
      <div class="level">
        <div class="level-item title">
          You are logged in as {{account.name}}
        </div>
      </div>
      <div class="level">
        <div class="level-item">
          Storage data goes here
        </div>
      </div>
    </div>
    <div v-else>
      You need to authenticate to access your SQL data
    </div>
  </div>
</template>

<script>
import customTokenCredential from '../CustomTokenProvider';
import  { BlobServiceClient } from '@azure/storage-blob';
import * as msal from "@azure/msal-browser";

const storageAccountName = 'azfuncwithmsistorage';

export default {
  name: 'HelloWorld',
  data(){
    return{
      account:undefined,
      accessToken:''
    }
  },
  async created(){
    this.$emitter.on('login', async (account) => {
      this.account = account;
      console.log(this.account);
      console.log('Getting storage data');
      await this.getAzureStorageData();
    }),
    this.$emitter.on('logout', () => {
        console.log('logging out');
        this.account = undefined;
    })
  },
  methods: {
    async getAzureStorageData(){
      if(!this.account){
        return;
      }
      let request = {
            scopes:["User.Read", "user_impersonation" ]
          };
      const msalInstance = new msal.PublicClientApplication(this.$store.state.msalConfig);
      let self = this;
      await msalInstance.acquireTokenSilent(request).then(tokenResponse =>{
          console.log(`Access token aquired ${tokenResponse.accessToken}`)
          self.accessToken = tokenResponse.accessToken;
        }).catch(async (error) => {
          if (error.errorMessage.indexOf("interaction_required") !== -1){
            console.error('Silent token acquisition failed. Using interactive mode');
            return await msalInstance.acquireTokenPopup(request).then(tokenResponse => {
              console.log(`Access token acquired via interactive auth ${tokenResponse.accessToken}`);
              self.accessToken = tokenResponse.accessToken;
            })
          }
        }).catch(error =>{
          console.error(error);
      });

      let tokenCredential = new customTokenCredential(self.accessToken);
      const blobClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net`,
        tokenCredential
      );

      let i = 1;
      const iter = blobClient.listContainers();
      let containerItem = await iter.next();
      while (!containerItem.done) {
        console.log(`Container ${i++}: ${containerItem.value.name}`);
        containerItem = await iter.next();
      }
      
    }
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
