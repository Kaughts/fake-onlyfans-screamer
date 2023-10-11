// document.getElementById('myForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     var selectedPrice = document.getElementById('cars').value; // this line gets the selected price from the dropdown

//     paypal.Buttons({
//         createOrder: function () {
//             return fetch('/create-order', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     items: [
//                         {
//                             price: selectedPrice
//                         }
//                     ]
//                 }),
//             })
//                 .then(res => {
//                     if (res.ok) return res.json();
//                     return res.json().then(json => Promise.reject(json));
//                 })
//                 .then(({ id }) => {
//                     return id;
//                 })
//                 .catch(e => {
//                     console.error(e.error);
//                 });
//         },
//         onApprove: function (data, actions) {
//             return actions.order.capture();
//         },
//     }).render('#paypal');
// });

// Store PayPal button instance
var paypalButton = null;

function createPaypalButton(selectedPrice) {
    if (paypalButton != null) {
        paypalButton.close(); // close previous button instance
    }

    paypalButton = paypal.Buttons({
        createOrder: function () {
            return fetch('/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: [selectedPrice] // send selected price to server
                }),
            })
                .then(res => {
                    if (res.ok) return res.json();
                    return res.json().then(json => Promise.reject(json));
                })
                .then(({ id }) => {
                    return id;
                })
                .catch(e => {
                    console.error(e.error);
                });
        },
        onApprove: function (data, actions) {
            return actions.order.capture();
        },
    });

    paypalButton.render('#paypal');
}

// Initialize PayPal button with default price
createPaypalButton(document.getElementById('cars').value);

// Update PayPal button when dropdown selection changes
document.getElementById('cars').addEventListener('change', function () {
    createPaypalButton(this.value);
});