<script lang='ts'>
  import { fade } from 'svelte/transition'
  import * as Auth from '$lib/ts/auth'
  
  let phone:string
  let name:string
  let password:string
  let email:string
  
  let authDropdown:boolean
  let chooseAuth:boolean
  let loginMenu:boolean
  let signupMenu:boolean
</script>

<div id='auth-menu'>
  <button on:click='{()=> {authDropdown = true; chooseAuth = true; loginMenu = false; signupMenu = false}}'>
    Menu
  </button>
</div>

{#if authDropdown}
<div transition:fade|local='{{duration:100}}' class=  'modal' on:click='{()=> {authDropdown = false}}'>
</div>
<div transition:fade|local='{{duration:100}}' class='auth-dropdown'>
  {#if chooseAuth}
  <button on:click='{()=> {loginMenu = true; signupMenu = false; chooseAuth = false}}'>
    Log In
  </button>
  <button on:click='{()=> {signupMenu = true; loginMenu = false; chooseAuth = false}}'>
    Sign Up
  </button>
  {/if}
  {#if loginMenu}
  <form class='span-both form' on:submit="{async (e)=>{
    e.preventDefault();
    // console.log(Auth.signUpWithPhone(phone))
    console.log(await Auth.LogInWithEmail({name:name, email: email, password:password}))
  }}">
  <span class='left' >Email</span>
  <input class='right' bind:value="{email}"/>
  <span class='left'>Password</span>
  <input class='right' type='password' bind:value="{password}"/>
  <!-- <button>Submit</button> -->
  <button class='span-both' value="submit">Submit</button>
</form>
<p class='span-both'>
  <span>Don't have an account?</span> <a href='#/' on:click="{()=> {loginMenu = false; signupMenu = true}}">Sign up here.</a>
</p>
<button class='back-button span-both' on:click="{() =>{loginMenu = false; chooseAuth = true}}">Back</button>
{/if}
{#if signupMenu}
<form class='span-both form' on:submit="{async (e)=>{
  e.preventDefault();
  // console.log(await Auth.signUpWithPhone({phone: phone, password: password, email: email}))
  console.log(await Auth.signUpWithEmail({password: password, email: email}))
}}">
<!-- <span class='left'>Phone</span>
<input class='right' bind:value="{phone}"/> -->
<span class='left'>Name</span>
<input class='right' bind:value="{name}"/>
<span class='left'>Email</span>
<input class='right' bind:value="{email}"/>
<span class='left'>Password</span>
<input class='right' bind:value="{password}" type="password"/>
<button class='span-both'>Submit</button>
</form>
<p class='span-both'>
  <span>Already have an account?</span> <a href='#/' on:click="{()=> {loginMenu = true; signupMenu = false}}">Log in here.</a>
</p>
<button class='back-button span-both' on:click="{() =>{signupMenu = false; chooseAuth = true}}">Back</button>
{/if}
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
  
  .auth-dropdown {
    background: #000;
    display:grid;
    // grid-template-areas: 'left right';
    grid-column: repeat(1fr, 3);
    // height: 300px;
    margin-top:75px;
    padding:1em;
    position:absolute;
    right:0px;
    top:0px;
    width: 300px;
    z-index: 145;
    color: white;
    gap: 1em;
  }
  
  .left {
    // grid-area: left;
    grid-column: 1 / span 1;
    margin: auto 0;
    text-align: left;
  }
  .right {
    // grid-area: right;
    grid-column: 2 / span 2;
    margin: auto 0;
  }
  .span-both {
    grid-column: 1 / span 3;
    margin: auto o;
  }
  .form {
    display:grid;
    gap: 1em;
    grid-column: repeat(1fr, 3);
  }
  .back-button {
    border: thin solid red;
    color:  red;
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