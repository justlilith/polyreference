function saveToCookies (name:string, value:unknown):void{
  document.cookie = `${name}=${JSON.stringify(value)}`
  console.log(document.cookie)
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

export {
  saveToCookies
  , fetchFromCookies
}