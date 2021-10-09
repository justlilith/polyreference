<script lang='ts'>
  import * as Auth from '$lib/ts/auth'
import { space } from 'svelte/internal';

  let user:string
  let loggedIn:boolean = false

  if (Auth.loggedIn) {
    user = Auth.userData.user_metadata['name']
    loggedIn = true;
  }
</script>

<section id='statusbar'>
  <div id='user-stuff'>
    {#if loggedIn}
      <span>Welcome to Polyref, {user}!</span>
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