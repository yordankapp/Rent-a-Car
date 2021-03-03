function listCustomers() {
    var customers = JSON.parse(localStorage.getItem("customers"));
    var select = document.getElementById("customer");
    
    customers.forEach(customer => {
        var option = document.createElement("option");
        option.text = customer.name;
        select.add(option);
    });
}

function listVehicles() {
    var vehicles = JSON.parse(localStorage.getItem("vehicles"));
    var select = document.getElementById("vehicle");

    select.innerHTML = "";
    
    vehicles.forEach(vehicle => {
        if(vehicle.available == "yes"){
            var option = document.createElement("option");
            option.text = `${vehicle.brand} ${vehicle.model}`;
            select.add(option);
        }
    });
}

function calculateCostAndDiscount(rentEvent) {
    var price;
    var vehicles = JSON.parse(localStorage.getItem("vehicles"));
    for (let index = 0; index < vehicles.length; index++) {
        if(`${vehicles[index].brand} ${vehicles[index].model}` == rentEvent.vehicle){
            price = parseFloat(vehicles[index].pricePerDay.split('$')[0]);
            vehicles[index].available = 'no';
            break;
        }
    }

    localStorage.setItem('vehicles', JSON.stringify(vehicles));

    var pricePerMinute = price/(24*60);
    var start = new Date(rentEvent.start);
    var end = new Date(rentEvent.end);
    var differenceInMinutes = (end - start)/(60*1000);

    var cost = pricePerMinute * differenceInMinutes;
    document.getElementById("price").innerHTML = cost.toFixed(2);
    var days = Math.floor(differenceInMinutes/(60*24));

    var discount = 0;
    if (isVip(rentEvent.customer)) {
        discount = 15;
    } else if (days >= 10) {
        discount = 10;
    } else if (days >= 5) {
        discount = 7;
    } else if (days >= 3) {
        discount = 5;
    }

    return [cost, discount];
}

function rent() {
    var rentEvent = {
        customer: document.getElementById("customer").value,
        vehicle: document.getElementById("vehicle").value,
        start: document.getElementById("startRent").value,
        end: document.getElementById("endRent").value
    }

    let cost, discount;

    [cost, discount] = calculateCostAndDiscount(rentEvent);
    
    var finalPrice = cost - (cost*discount)/100;
    document.getElementById("finalPrice").innerHTML = finalPrice.toFixed(2);
    document.getElementById("customerInfo").innerHTML = rentEvent.customer;
    document.getElementById("vehicleInfo").innerHTML = rentEvent.vehicle;
    document.getElementById("startInfo").innerHTML = rentEvent.start;
    document.getElementById("endInfo").innerHTML = rentEvent.end;
    document.getElementById("message").style.display = "flex";
    document.getElementById("discount").innerHTML = discount;

    var rents = localStorage.getItem('rents');
    var parsedRents = rents ? JSON.parse(rents) : [];

    rentEvent['discount'] = discount;
    rentEvent['price'] = finalPrice.toFixed(2);
    parsedRents.push(rentEvent);
    localStorage.setItem('rents', JSON.stringify(parsedRents));

    listRents();
    listVehicles();
}

function format(rents) {
    if (!rents.length) {
        return '';
    }
                    
    var table = "<h2>Rent History</h2><table id=\"table\"><tr><th>Customer</th><th>Vehicle</th><th>Start date</th><th>End</th><th>Discount</th><th>Price</th></tr>";
    rents.forEach(rent => {
        table += "<tr>";
        Object.entries(rent).forEach(([key, property]) => {
            table += `<td>${property}</td>`;
        });
        table += `</tr>`;
    });
    table += "</table>";

    return table;
}

function listRents() {
    var rents = localStorage.getItem('rents');
    var parsedRents = rents ? JSON.parse(rents) : [];

    document.getElementById("rents").innerHTML = format(parsedRents);
}

function isVip(customerName) {
    var customers = JSON.parse(localStorage.getItem('customers'));
    var index;
    for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];
        if (customer.name == customerName) {
            index = i;
            break;
        }
    }

    if (customers[index].vip == 'yes') {
        return true;
    }

    var rents = JSON.parse(localStorage.getItem("rents"));
    if (!rents) {
        return false;
    }

    var numberOfRents = 0;
    
    var today = new Date();
    var before60Days = new Date(today);
    before60Days.setDate(today.getDate() - 60);    

    rents.forEach(rent => {
        if (rent.customer == customerName && before60Days < new Date(rent.start)) {
            numberOfRents++;
        }
    });

    if (numberOfRents > 0) {
        customers[index].vip = 'yes';
        localStorage.setItem('customers', JSON.stringify(customers));
        return true;
    }

    return false;
}

listCustomers();
listVehicles();
listRents();