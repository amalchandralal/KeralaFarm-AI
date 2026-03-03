function getUser(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("User fetched");
            resolve({ id: userId, name: "Amal" });
        }, 1000);
    });
}

function getOrders(user) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Orders fetched");
            resolve(["Order1", "Order2"]);
        }, 1000);
    });
}

function processPayment(orders) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Payment processed");
            resolve("Payment Successful");
        }, 1000);
    });
}

async function runEcommerceFlow() {
    try {
        const user = await getUser(1);
        const orders = await getOrders(user);
        const payment = await processPayment(orders);

        console.log(payment);
    } catch (error) {
        console.log("Error:", error);
    }
}

runEcommerceFlow();