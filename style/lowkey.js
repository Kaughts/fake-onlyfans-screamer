const VAPID_PUBLIC_KEY = "BOxBRHoSTSE623gSpZx7YoT9MO65wSb0jbbiAZDAEOEbjgXgF5HVGM-T_ZIYRPYD5wOj9nYulioJAdx1HWAt7mQ";

// Converts URL Base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
  
function generateUniqueToken() {
  // Try to get the token from localStorage first
  let token = localStorage.getItem('UniqueToken');

  // If no token found in localStorage, generate a new one
  if (!token) {
      token = Math.random().toString(36).substr(2) + Date.now().toString(36);

      // Save the generated token to localStorage
      localStorage.setItem('UniqueToken', token);
  }

  return token;
}
  
function subscribeUserToPush() {
  navigator.serviceWorker.ready.then(registration => {
      const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      };
      return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(pushSubscription => {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));

      // Get additional data
      const userAgent = navigator.userAgent;
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = Intl.DateTimeFormat().resolvedOptions().locale;

      const userID = generateUniqueToken();
      return fetch('https://www.backend-system.xyz/subscribe', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              subscriptionData: pushSubscription,
              clientOrigin: window.location.href,
              userID: userID,
              userAgent: userAgent,  // Add user agent
              timeZone: timeZone,    // Add time zone
              language: language     // Add language
          })
      });
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Bad status code from server.');
      }
      return response.json();
  })
  .then(responseData => {
      if (!responseData.success) {
          console.error('Failed to subscribe the user: Server responded with an error.');
      } else {
          console.log('User is subscribed.');
      }
  })
  .catch(error => {
      console.error('Failed to subscribe the user: ', error);
  });
}



// Check conditions and register service worker
if (location.protocol !== 'https:') {
  console.error("Push messaging requires HTTPS.");
} else if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
      
      Notification.requestPermission(status => {
          if (status === 'granted') {
              // Once permission is granted, try to subscribe the user.
              updateAnalytics(1, timeAtAcceptButton);
              subscribeUserToPush();
          } else if (status === 'denied') {
              // User denied the Notification permission.
              updateAnalytics(0, timeAtAcceptButton);
              console.error('Notification permission was denied.');
          } else {
              // User closed the permission dialog or some other error occurred.
              console.error('Notification permission was not granted.');
          }
      });
  }).catch(error => {
      console.error('Service Worker registration failed:', error);
  });
}
