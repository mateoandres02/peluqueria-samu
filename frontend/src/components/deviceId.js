const deviceId = btoa(navigator.userAgent + screen.width + screen.height + Intl.DateTimeFormat().resolvedOptions().timeZone);


export default deviceId 