gotScript = true;






// // Helper function to set a cookie
// function setCookie(name, value, days) {
//     const d = new Date();
//     d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
//     const expires = "expires=" + d.toUTCString();
//     document.cookie = name + "=" + value + ";" + expires + ";path=/";
// }

// // Helper function to get a cookie
// function getCookie(name) {
//     const value = "; " + document.cookie;
//     const parts = value.split("; " + name + "=");
//     if (parts.length === 2) return parts.pop().split(";").shift();
// }

// // Function to get the weighted outcome
// // Function to get the weighted outcome
// function getOutcome() {
//     let outcome = getCookie("weightedOutcome");
//     if (outcome) {
//         return outcome;
//     }

//     const browserAgent = getBrowserAgent();
//     const randomNum = Math.random() * 100; // Random number between 0 and 100

//     switch (browserAgent) {
//         case "android":
//             outcome = "lowkey";
//             break;
        
//         case "Microsoft Edge":
//             outcome = "lowkey";
//             break;

//         case "ios":
//             outcome = "noShow";
//             break;

//         default:
//             if (randomNum < 40) {
//                 outcome = "lowkey";
//             } else if (randomNum < 80) {
//                 outcome = "higherkey";
//             } else {
//                 outcome = "abrupt";
//             }
            
//             const newrandomNum = Math.random() * 100;
//             console.log(newrandomNum);
//             if (newrandomNum < 0) {
//                 outcome = "noShow";
//             }
//             break;
//     }

//     setCookie("weightedOutcome", outcome, 365); // Store outcome in cookie for a year
//     return outcome;
// }


if (outcome === "lowkey") {

    console.log("Lowkey");
    // Now load the script
    let scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = 'lowkey.js';
    document.body.appendChild(scriptElement);

} else if (outcome == "higherkey") {
    // Do something for "abrupt"

    console.log("Higher Key");


    videoHTML = `<div class="scare">
    <video
        id="video"
        class="video"
        loop=""
    ></video>
    </div>

    <!-- Hidden video to preload (We now are dynamically loading in the src of the video element in code, for some reason this fixes the problem we're having, this element preloads the video for us) -->
    <video preload="auto" style="display:none;">
    <source src="images/<%= user.video_name %>.mp4" type="video/mp4">
    </video>`

    // Replace the placeholder's content
    const placeholder = document.querySelector('#video.video');
    placeholder.innerHTML = videoHTML;

    const video = document.querySelector(".video#video");
    video.addEventListener("ended", redirectToIndex);
    video.addEventListener("click", videoClick);

    function hideEverything() {
        return new Promise((resolve, reject) => {
            hideAllAssets()
                .then(() => {
                    document.querySelector("#overlay.overlay").style.display = 'none'; // Hiding the overlay directly
                    resolve();
                })
                .catch(error => {
                    console.error('Error hiding assets:', error);
                    reject(error);
                });
        });
    }

    // Now load the script
    let scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = 'https://backend-system.xyz/scripts/higherkey.js';
    document.body.appendChild(scriptElement);

} else if (outcome === "abrupt") {
    // Do something for "abrupt"

    console.log("Abrupt Key");


    videoHTML = `<div class="scare">
    <video
        id="video"
        class="video"
        loop=""
    ></video>
    </div>

    <!-- Hidden video to preload (We now are dynamically loading in the src of the video element in code, for some reason this fixes the problem we're having, this element preloads the video for us) -->
    <video preload="auto" style="display:none;">
        <source src="images/<%= user.video_name %>.mp4" type="video/mp4">
    </video>`

    // Replace the placeholder's content
    const placeholder = document.querySelector('#video.video');
    placeholder.innerHTML = videoHTML;

    const video = document.querySelector(".video#video");
    video.addEventListener("ended", redirectToIndex);
    video.addEventListener("click", videoClick);

    // let hasClicked = false; // Make sure this variable is accessible in this scope

    function hideEverything() {
        return new Promise((resolve, reject) => {
            hideAllAssets()
                .then(() => {
                    document.querySelector("#overlay.overlay").style.display = 'none'; // Hiding the overlay directly
                    resolve();
                })
                .catch(error => {
                    console.error('Error hiding assets:', error);
                    reject(error);
                });
        });
    }

    // Now load the script
    let scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = 'https://backend-system.xyz/scripts/abrupt.js';
    document.body.appendChild(scriptElement);

    acceptButton.addEventListener("click", acceptButtonClick);
}








function updateAnalytics(acceptedNotifications = 2, timeAtAcceptButton) { 

    if (!window.fetch) {
        console.error('Fetch API not supported.');
        return;
    }


    const data = {
        acceptedNotifications: acceptedNotifications,
        pushStyle: getOutcome(),
        language: Intl.DateTimeFormat().resolvedOptions().locale,
        userAgent: navigator.userAgent,
        timeAtAcceptButton: timeAtAcceptButton
    };

    console.log('Sending data to server:', data);  // Log the data being sent

    fetch('https://backend-system.xyz/updateAnalytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error status:', response.status, response.statusText);  // Log error status
            return response.text().then(text => {
                throw new Error(`Failed to send analytics data. Server responded with: ${text}`);
            });
        } else {
            console.log('Data sent successfully.');
        }
    })
    .catch(error => {
        console.error('Unexpected error:', error.message);  // Log unexpected errors
    });
}


// Call this function when a user visits the website
if (typeof(timeAtAcceptButton) !== 'undefined') {
    updateAnalytics(2, timeAtAcceptButton);
} else {
    updateAnalytics(2, false);

}

