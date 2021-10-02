<script lang='ts'>
  import { fade } from 'svelte/transition'
  
  let loginDropdown:boolean
  let signupDropdown:boolean
</script>

<div id='auth-menu'>
  <button on:click='{()=> {loginDropdown = true; signupDropdown = false}}'>
    Log In
  </button>
  <button on:click='{()=> {signupDropdown = true; loginDropdown = false}}'>
    Sign Up
  </button>
</div>

{#if loginDropdown}
<div transition:fade|local='{{duration:100}}' class='modal' on:click='{()=> {loginDropdown = false}}'>
</div>
<div transition:fade|local='{{duration:100}}' class='menu-dropdown'>
  <div>
    <span>
      Phone
    </span>
    <input/>
  </div>
  <div>
    <span>
      Password
    </span>
    <input/>
  </div>
  <button>Submit</button>
</div>
{/if}

{#if signupDropdown}
<div transition:fade|local='{{duration:100}}' class='modal' on:click='{()=> {signupDropdown = false}}'>
</div>
<div transition:fade|local='{{duration:100}}' class='menu-dropdown'>
  <div>
    <span>Phone</span>
    <input/>
  </div>
  <div>
    <button>Submit</button>
  </div>
</div>
{/if}

<style lang='scss'>
  #auth-menu {
    padding:1em;
    position:absolute;
    // position:fixed;
    right:0px;
    z-index: 150;
  }
  
  button {
    background: none;
    border: thin solid #0FF;
    color: #0FF;
    height:3em;
  }
  
  .menu-dropdown {
    background: #000;
    display:flex;
    flex-flow: column nowrap;
    height: 300px;
    margin:1em;
    margin-top:75px;
    padding:1em;
    position:absolute;
    right:0px;
    top:0px;
    width: 300px;
    z-index: 145;
  }
  
  .menu-dropdown button {
  }
  .menu-dropdown span {
  }
  
  input {
    // display: inline-block;
    // width:100%;
    height:3em;
  }
  
  .modal {
    height:100%;
    position:fixed;
    width:100%;
    z-index: 140;
  }
</style>