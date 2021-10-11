import { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/gotrue-js'
import { v4 as uuidv4} from 'uuid'

const supabase = new SupabaseClient('https://bqljggidsuurzwjgspix.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzc2MTI0MywiZXhwIjoxOTQ5MzM3MjQzfQ.lQzW2bbkwkN4IPf0QqJVHkTh_YJdd9mATglBUktRBpA',{})


function saveToCookies (name:string, value:unknown):void{
  document.cookie = `${name}=${JSON.stringify(value)}`
}


type FetchFramesResponseT = {
  fetchedFrameList: FrameT[]|null
  error: Error|null
}
async function fetchFrames (user:User):Promise<FetchFramesResponseT> {
  const {data, error} = await supabase.storage.from('images').download(`${user.id}/frameData.txt`)
  if (!error){
    const frameData = await data.text()
    try {
      if (frameData.length == 0) {
        console.log(JSON.parse(frameData))
        return { fetchedFrameList: null, error: null }
      }
      return { fetchedFrameList: JSON.parse(frameData), error: null }
    } catch (e) {
      return { fetchedFrameList: null, error: e }
    }
  } else {
    return {fetchedFrameList: null, error: error}
  }
}


function fetchFromCookies (name: string) {
  const cookies:Array<string> = document.cookie.split(';')
  const foundCookie = cookies.find(cookie => {
    return cookie.includes(`${name}=`)
  })
  if (foundCookie) {
    return JSON.parse(foundCookie.split('=')[1])
    // return "otay"
  } else {
    return null
  }
}


async function uploadFrames (userData:User, frameList:FrameT[]):Promise<void> {
  const frameData:string = JSON.stringify(frameList)
  const {data, error} = await supabase.storage.from('images').upload(`${userData.id}/frameData.txt`,frameData,{ upsert: true})
  if (error) {
    console.log(error)
  }
}

type UploadImageArgsT = {
  userData: User
  imageFile: File
}
type UploadImageResponseT = {
  error: Error|null
  imageUrl: string | null
}
async function uploadImage (args:UploadImageArgsT):Promise<UploadImageResponseT> {
  const uuid = uuidv4()
  const {data, error} = await supabase.storage.from('images').upload(`${args.userData.id}/${uuid}`,args.imageFile,{upsert:true})
  if (!error){
    console.log(data.Key)
    const {error, publicURL} = await supabase.storage.from('images').getPublicUrl(`${args.userData.id}/${uuid}`)
    if (!error) {
      console.log(publicURL)
      return {error:null, imageUrl: publicURL}
    } else {
      return {error:error, imageUrl: null}
    }
  } else {
    return {error:error, imageUrl: null}
  }
}

async function upsertFolder (userData:User) {
  const blankFile = new Blob()
  const {data, error} = await supabase.storage.from('images').upload(`${userData.id}/_blank.txt`, blankFile,{
    upsert: true
  })
  console.log(data)
  console.log(error)
}




export {
  saveToCookies
  , fetchFrames
  , fetchFromCookies
  , uploadFrames
  , uploadImage
  , upsertFolder
}