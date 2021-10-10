function saveToCookies(name, value) {
    let cookies = document.cookie.split(';');
    cookies = cookies.filter(cookie => {
        return cookie.split('=')[0] != name;
    });
    const newCookie = `${name}=${JSON.stringify(value)}`;
    cookies.push(newCookie);
    document.cookie = cookies.join('');
    if (!document.cookie.split(';').includes(`${name}=${JSON.stringify(value)}`)) {
        return new Error('Couldn\'t save to cookies');
    }
}
function fetchFromCookies(name, fallback) {
    const cookies = document.cookie.split(';');
    // let splitCookies:Array<Array<string>> = cookies.map(cookie =>{
    //   return cookie.split('=')
    // })
    const foundCookie = cookies.find(cookie => {
        return cookie.includes(name);
    });
    if (!foundCookie) {
        return fallback;
    }
    return foundCookie.split('=')[1];
}
export { saveToCookies, fetchFromCookies };
//# sourceMappingURL=storage.js.map