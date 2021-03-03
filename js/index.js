function showStats() {
    var customers = JSON.parse(localStorage.getItem('customers')).length;
    var vehicles = JSON.parse(localStorage.getItem('vehicles')).length;
    var rents = JSON.parse(localStorage.getItem('rents'));

    var rentCount = 0;
    if (rents) {
        rentCount = rents.length;
    }
    
    document.getElementById('rentCount').innerHTML = rentCount;
    document.getElementById('customerCount').innerHTML = customers;
    document.getElementById('vehicleCount').innerHTML = vehicles;
}

showStats();