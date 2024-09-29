export const setCookie = (name, value, days) => {
    const expires = days
      ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}`
      : "";
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
  };
  

export const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  };

export const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

export const setObjectAsCookie = (cookieName,obj,days) => {
    const jsonString = JSON.stringify(obj);
    setCookie(cookieName, jsonString, days);
}

export const getObjectFromCookie = (cookieName) => {
    const cookieValue = getCookie(cookieName);
    return cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : null;

}



