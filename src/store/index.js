import { createStore } from 'vuex';

const store = createStore({
    state () {
      return {
        msalConfig :{
            auth: {
                clientId: 'eade5a90-a367-4641-b40c-7d51e308a6aa',
                authority: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47'
            },
            cache: {
                cacheLocation: 'localStorage'
            }
      }
    }
  },
});

export default store;