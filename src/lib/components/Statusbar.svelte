<script lang='ts'>
  import * as Auth from '$lib/ts/auth'
  import * as Storage from '$lib/ts/storage'
  import { browser } from '$app/env'
  import { space } from 'svelte/internal';
  
  let user:string = ""
  let loggedIn = ""
  
  if (browser) {
    user = Storage.fetchFromCookies('userData')?.email
    loggedIn = Storage.fetchFromCookies('loggedIn')
    console.log(loggedIn)
    console.log(user)
  }
  // Auth.loginStore.subscribe(change =>{
  //   user = change?.userData?.email ?? ""
  //   loggedIn = change.loggedIn
  // })
</script>

<section id='statusbar'>
  <div id='user-stuff'>
    {#if loggedIn}
    <span>Welcome to Polyref! Logged in as: {user}</span>
    {:else}
    <span>Welcome to Polyref. Sign up above to access your ref board from anywhere!</span>
    {/if}
  </div>
  <div id='dock'>
    <span>What is Polyref?</span>
  </div>
</section>

<style lang='scss'>
  #statusbar {
    display: flex;
    flex-direction: row;
    position: fixed;
    z-index: 20;
    background: black;
    width:100%;
    // height: 2em;
    bottom:0px;
  }
  
  #user-stuff {
    color: hsl(180,100%,50%);
    padding:1em;
    text-align: left;
    width:75%;
  }
  
  #dock {
    color: hsl(180,100%,50%);
    padding:1em;
    text-align: right;
  }
  
</style>