OBSRemote.prototype._authHash = OBSRemote.prototype._webCryptoHash;
var obs = new OBSRemote();
var authenticated = false;

obs.onAuthenticationSucceeded = function() { 
  authenticated = true;
  toastNotify('OBS-remote authenticated.');
};

obs.onAuthenticationFailed = function(remaining) { 
  authenticated = false; 
  toastNotify('OBS-remote failed authentication. ' + remaining.toString() + ' tries remaining.');
};

obs.onConnectionOpened = function() {
  obs.isAuthRequired(function(required) { 
    authenticated = !required
  });
  toastNotify('OBS-remote connection successful.');
};

function remoteConnect(address, password) {
  if (!obs._connected)
    obs.connect(address);

  if (!authenticated)
    obs.authenticate(password);
}