import { SupabaseClient } from '@supabase/supabase-js'
import type { User, Session } from '@supabase/gotrue-js'
import { writable } from 'svelte/store'
import * as Storage from '$lib/ts/storage'

const supabase = new SupabaseClient('https://bqljggidsuurzwjgspix.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzc2MTI0MywiZXhwIjoxOTQ5MzM3MjQzfQ.lQzW2bbkwkN4IPf0QqJVHkTh_YJdd9mATglBUktRBpA',{})

let loggedIn:boolean
let userData:User
let sessionData:Session

const authStore = writable({
  loggedIn: loggedIn
  , userData: userData
  , sessionData: sessionData
})


const authCheck = async ():Promise<boolean> => {
  const token = Storage.fetchFromCookies('refreshToken')
  const {user, session, error} = await supabase.auth.signIn({refreshToken:token})
  if (!error) {
    Storage.saveToCookies('refreshToken',session.refresh_token)
    authStore.update(()=> {
      return {
        userData: user
        , sessionData: session
        , loggedIn: true
      }
    })
    return true
  } else {
    return false
  }
}


const logInWithEmail = async (args):Promise<Array<User|Session|Error>> => {
  const { user, session, error} = await supabase.auth.signIn({
    password: args.password
    , email: args.email
  })
  if (!error) {
    loggedIn = true
    userData = user
    sessionData = session
    // Storage.saveToCookies('userData',userData)
    // Storage.saveToCookies('loggedIn',true)
    Storage.saveToCookies('refreshToken',session.refresh_token)
    authStore.update(() => {
      return {
        loggedIn: true
        , userData: userData
        , sessionData: sessionData
      }
    })
  }
  return [user, session, error]
}


const logOut = async () => {
  await supabase.auth.signOut()
  authStore.update(()=> {
    return {
      loggedIn: false
      , userData: null
      , sessionData: null
    }
  })
  Storage.saveToCookies('refreshToken', null)
}


const signUpWithEmail = async (args):Promise<Array<User|Session|Error>> => {
  const { user, session, error} = await supabase.auth.signUp({
    password: args.password
    , email: args.email
  })
  if (!error){
    loggedIn = true
    sessionData = session
    const {user, error} = await supabase.auth.update({data: {name: args.name}})
    if (!error){
      userData = user
    }
  }
  return [user, session, error]
}

// const signUpWithPhone = async (args):Promise<Array<User|Session|Error>> => {
//   const { user, session, error} = await supabase.auth.signUp({
//     phone: args.phone
//     , password: args.password
//     , email: args.email
//   })
//   return [user, session, error]
// }

export {
  authCheck
  , loggedIn
  , logOut
  , authStore
  , logInWithEmail
  , sessionData
  , signUpWithEmail
  // , signUpWithPhone
  , userData
}