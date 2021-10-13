<script lang='ts'>
  import { fade } from 'svelte/transition'
  import * as Auth from '$lib/ts/auth'
import { dataset_dev } from 'svelte/internal'
import { session } from '$app/stores'
  import type { User, Session } from '@supabase/supabase-js'
  
  let phone:string
  let name:string
  let password:string
  let email:string
  
  let authDropdown:boolean
  let chooseAuth:boolean
  let loginMenu:boolean
  let signupMenu:boolean
  
  let error:Error
  let signupSuccess = false
  let loginSuccess = false
  let logOutSuccess = false
  
  let loggedIn:boolean
  
  Auth.authStore.subscribe((update)=> {
    loggedIn = update.loggedIn
  })

  const clearResponses = () => {
    signupSuccess = false
    loginSuccess = false
    error = null
    logOutSuccess = false
  }

  function shakeDropdown () {
    let box = document.getElementById('auth-dropdown')
    let counter = 0
    let id = setInterval(function shakeme () {
      if (counter < 3) {
        setTimeout(()=> {
          box.setAttribute("style", "right:5px")
          counter += 1
        },50)
        box.setAttribute("style", "right:0px")
      } else {
        clearInterval(id)
        counter = 0
      }
    },100)
  }
</script>

<div id='auth-menu'>
  <button on:click='{()=> {authDropdown = true; chooseAuth = true; loginMenu = false; signupMenu = false; clearResponses()}}'>
    Menu
  </button>
</div>

{#if authDropdown}
<div transition:fade|local='{{duration:100}}' class='modal' on:click='{()=> {authDropdown = false; clearResponses()}}'>
</div>
<div transition:fade|local='{{duration:100}}' class='auth-dropdown' id='auth-dropdown'>
  
  {#if loggedIn}
  <button class='back-button span-both' on:click='{()=> {clearResponses(); logOutSuccess = true; authDropdown = true; loginMenu = false; signupMenu = false; chooseAuth = false; Auth.logOut()}}'>
    Log Out
  </button>
  
  {:else}
  
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
    const res = await Auth.logInWithEmail({name:name, email: email, password:password})
    error = res.error
    console.log(res)
    if (error) {
      shakeDropdown()
    }
    if (!res.error) {
      loginSuccess = true
    }
  }}">
  <span class='left' >Email</span>
  <input class='right' bind:value="{email}"/>
  <span class='left'>Password</span>
  <input class='right' type='password' bind:value="{password}"/>
  <!-- <button>Submit</button> -->
  <button class='span-both' value="submit">Submit</button>
</form>
<button class='back-button span-both' on:click="{() =>{loginMenu = false; chooseAuth = true; clearResponses()}}">Back</button>
<p class='span-both'>
  <span>Don't have an account?</span> <a href='#/' on:click="{()=> {loginMenu = false; signupMenu = true; clearResponses()}}">Sign up here.</a>
</p>
{/if}
{#if signupMenu}
<form class='span-both form' on:submit="{async (e)=>{
  e.preventDefault();
  shakeDropdown()
  const res = await Auth.signUpWithEmail({password: password, email: email})
  console.log(res)
  if (res?.user?.confirmation_sent_at){
    signupSuccess = true
    signupMenu = false
  }
  if (res?.error) {
    error = res.error
    shakeDropdown()
  }
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
<button class='back-button span-both' on:click="{() =>{signupMenu = false; chooseAuth = true; clearResponses()}}">Back</button>
<p class='span-both'>
  <span>Already have an account?</span> <a href='#/' on:click="{()=> {loginMenu = true; signupMenu = false; clearResponses()}}">Log in here.</a>
</p>
{/if}

{/if}
{#if error}
<p class='span-both error'>
<span>{`${error.message} :<`}</span>
</p>
{/if}
{#if signupSuccess}
<p class='span-both success'>
<span>Congrats! Check your email to validate your account :></span>
</p>
{/if}
{#if loginSuccess}
<p class='span-both success'>
<span>Congrats! You're now logged in :></span>
</p>
{/if}
{#if logOutSuccess}
<p class='span-both success'>
<span>Congrats! You've now logged out :></span>
</p>
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

  .error {
    color: hsl(20,100%,50%);
  }
  
  .success {
    color: hsl(120,100%,50%);
  }
</style>