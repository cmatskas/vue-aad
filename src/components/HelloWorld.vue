<template>
  <div class="content-container">
    <div class="section content-title-group">
      <h2 class="title">Welcome to the Azure AD + Storage app with Vue.js</h2>
    </div>
    <div v-if="account">
      <div class="level">
        <div class="level-item title">
          You are logged in as {{account.name}}
        </div>
      </div>
      <div class="level">
        <div class="level-item">
          <ul>
            <li v-for="container in containers" :key="container.id">
              {{ container.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      You need to authenticate to access your SQL data
    </div>
  </div>
</template>1`

<script>
import customTokenCredential from '../CustomTokenProvider';
import  { BlobServiceClient } from '@azure/storage-blob';
import * as msal from "@azure/msal-browser";

const storageAccountName = 'cmatskasbackup';

export default {
  name: 'HelloWorld',
  data(){
    return{
      account:undefined,
      containers: []
    }
  },
  async created(){
    this.$emitter.on('login', async function (account) {
      this.account = account;
      console.log(this.account);
      console.log('Getting storage data');
      await this.getAzureStorageData();
    }.bind(this)),
    this.$emitter.on('logout', () => {
        console.log('logging out');
        this.account = undefined;
    })
  },
  methods: {
    async getAzureStorageData(){
      let request = {
              scopes:["https://storage.azure.com/user_impersonation" ]
            };
      const msalInstance = new msal.PublicClientApplication(this.$store.state.msalConfig);
      var accessToken = '';
      try {
        let tokenResponse = await msalInstance.acquireTokenSilent(request);
        console.log(`Access token aquired ${tokenResponse.accessToken}`)
        accessToken = tokenResponse.accessToken;
        this.accessToken = tokenResponse.accessToken;
        } catch (error) {
            console.error('Silent token acquisition failed. Using interactive mode');
            let tokenResponse =  await msalInstance.acquireTokenPopup(request);
            console.log(`Access token acquired via interactive auth ${tokenResponse.accessToken}`);
              accessToken = tokenResponse.accessToken;
      }
      let tokenCredential = new customTokenCredential(accessToken);
      const blobClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net`,
        tokenCredential
      );

      let i = 1;
      const iter = blobClient.listContainers();
      let containerItem = await iter.next();
      while (!containerItem.done) {
        console.log(`Container ${i++}: ${containerItem.value.name}`);
        this.containers.push (
          { id: containerItem.value.properties.etag,
            name: containerItem.value.name 
          })
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
