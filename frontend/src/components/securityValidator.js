const deviceId = btoa(navigator.userAgent + screen.width + screen.height + Intl.DateTimeFormat().resolvedOptions().timeZone);
const deviceIdStr = toString(deviceId);


const setDeviceId = () => {
  const deviceIdPelu = 'TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzNC4wLjAuMCBTYWZhcmkvNTM3LjM2MTM2Njc2OEFtZXJpY2EvQnVlbm9zX0FpcmVz'

  localStorage.setItem("devicePelu", deviceIdPelu)
};

const removeDeviceId = () => {
  localStorage.removeItem("devicePelu")
};

export {
  deviceIdStr,
  setDeviceId,
  removeDeviceId
}

