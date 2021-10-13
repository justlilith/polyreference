<script lang='ts'>
  import * as Auth from '$lib/ts/auth'
  import * as Storage from '$lib/ts/storage'
  import { browser } from '$app/env'
  import { space } from 'svelte/internal';
  import Crier from '$lib/components/Crier.svelte'
  
  let user:string = ""
  let loggedIn:boolean = false
  
  Auth.authStore.subscribe((update)=>{
    user = update.userData?.email
    loggedIn = update.loggedIn
  })

  if (browser) {  
      Auth.authCheck().then(res => loggedIn = res)
  }
</script>

<section id='statusbar'>
  <div id='user-stuff'>
    {#if loggedIn}
    <span>Welcome to Polyref! Logged in as: {user}</span>
    {:else}
    <span>Welcome to Polyref. Sign up above to access your ref board from anywhere!</span>
    {/if}
  </div>
  <div>
    <Crier></Crier>
  </div>
  <div id='dock'>
		<span class="material-icons">info</span>
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
    min-width:50%;
  }
  
  #dock {
    color: hsl(180,100%,50%);
    padding:1em;
    text-align: right;
    flex-grow: 1;
  }
  
</style>