var vehicles = [
    { 
        brand: 'Ford', 
        model: 'Fiesta', 
        type: 'economy',
        constructionYear: '2010', 
        fuelType: 'diesel', 
        numberOfSeats: '4', 
        picture: '../img/ford-fiesta.jpg', 
        pricePerDay: '20$', 
        available: 'yes'
    },
    { 
        brand: 'Tesla', 
        model: 'X', 
        type: 'SUV',
        constructionYear: '2019', 
        fuelType: 'electric', 
        numberOfSeats: '4', 
        picture: '../img/tesla-x.jpg', 
        pricePerDay: '100$', 
        available: 'no'
    },
    { 
        brand: 'Ford', 
        model: 'Transit', 
        type: 'cargo',
        constructionYear: '2017', 
        fuelType: 'petrol', 
        numberOfSeats: '2', 
        picture: '../img/ford-transit.jpg', 
        pricePerDay: '10$', 
        available: 'yes'
    },
    { 
        brand: 'Porsche', 
        model: 'Panamera', 
        type: 'luxury',
        constructionYear: '2019', 
        fuelType: 'hybrid', 
        numberOfSeats: '4', 
        picture: '../img/porsche-panamera.jpg', 
        pricePerDay: '200$', 
        available: 'no'
    },
    { 
        brand: 'Volvo', 
        model: 'V60', 
        type: 'estate',
        constructionYear: '2020', 
        fuelType: 'hybrid', 
        numberOfSeats: '4', 
        picture: '../img/volvo-v60.jpg', 
        pricePerDay: '50$', 
        available: 'yes'
    }
];

function format(vehicles) {
    var btnUpdateId = 1;
    var btnDeleteId = 1;
    var table = "<table id=\"table\"><tr><th>Brand</th><th>Model</th><th>Type</th><th>Year</th><th>Fuel type</th><th>Seats</th><th>Picture</th><th>Price per day</th><th>Available</th><th>Edit</th></tr>";
    vehicles.forEach(vehicle => {
        table += "<tr>";
        Object.entries(vehicle).forEach(([key, property]) => {
            if(key == "picture")
            {
                table += `<td><img src="${property}" class="carImg"></td>`;
            }
            else
                table += `<td>${property}</td>`;
        });
        table += `<td><button id=${btnUpdateId} onclick=\"preparePopup(${btnUpdateId})\">Update vehicle</button><br><button id=${btnDeleteId} onclick=\"deleteVehicle(${btnDeleteId})\">Delete vehicle</button></tr>`;
        btnUpdateId += 1;
        btnDeleteId += 1;
    });
    table += "</table>";

    return table;
}

function listVehicles(vehicles) {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    document.getElementById("content").innerHTML = format(vehicles);
}

function openPopup(action, data = null) {
    var element = document.getElementById("popup");
    element.style.display = "block";

    var actionBtn = document.getElementById('action-btn');
    if(action == 'add') {
        document.getElementById('action').innerHTML = 'Add Vehicle';
        actionBtn.innerHTML = 'Add';
    } else {
        document.getElementById('action').innerHTML = 'Update Vehicle';
        actionBtn.innerHTML = 'Update';
    }
    actionBtn.addEventListener('click', function() {
        upsert(action, data);
        this.removeEventListener('click', arguments.callee);
    });
}

function closePopup() {
    var element = document.getElementById("popup");
    element.style.display = "none";

    document.getElementById('img-preview').style.display = "none";

    document.getElementById("brand").value =  null;
    document.getElementById("model").value =  null;
    document.getElementById("type").value =  null;
    document.getElementById("constructionYear").value =  null;
    document.getElementById("fuelType").value =  null;
    document.getElementById("numberOfSeats").value =  null;
    document.getElementById("pricePerDay").value =  null;
    document.getElementById("img").value =  null;
    document.getElementById("availableInput").value =  null;
}

window.onclick = function(e){
    if(e.target == popup){
      closePopup();
    }
  }  

function previewFile() {
    const preview = document.getElementById('img-preview');
    const file = document.getElementById('img').files[0];
    const reader = new FileReader();
  
    reader.addEventListener("load", function () {
      // convert image file to base64 string
      preview.src = reader.result;
      preview.style.display = "block";
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }

function upsert(action, data = null) {
    var vehicle = { 
        brand: document.getElementById("brand").value, 
        model: document.getElementById("model").value, 
        type: document.getElementById("type").value,
        constructionYear: document.getElementById("constructionYear").value, 
        fuelType: document.getElementById("fuelType").value, 
        numberOfSeats: document.getElementById("numberOfSeats").value, 
        picture: document.getElementById("img-preview").src,
        pricePerDay: document.getElementById("pricePerDay").value, 
        available: action == 'add' ? 'yes' : document.getElementById('availableInput').value
    }

    var vehicles = JSON.parse(localStorage.getItem('vehicles'));
    if (action == 'add') {
        vehicles.push(vehicle);
    } else {
        vehicles[data - 1] = vehicle;    
    }

    listVehicles(vehicles);

    closePopup();
}

function preparePopup(btnUpdateId) {
    document.getElementById("available").style.display = "block";
    openPopup('update', btnUpdateId);

    var vehicles = JSON.parse(localStorage.getItem('vehicles'));
    var vehicle = vehicles[btnUpdateId - 1];
    document.getElementById("brand").value =  vehicle.brand;
    document.getElementById("model").value =  vehicle.model;
    document.getElementById("type").value =  vehicle.type;
    document.getElementById("constructionYear").value =  vehicle.constructionYear;
    document.getElementById("fuelType").value =  vehicle.fuelType;
    document.getElementById("numberOfSeats").value =  vehicle.numberOfSeats;
    document.getElementById("pricePerDay").value =  vehicle.pricePerDay;
    document.getElementById("availableInput").value =  vehicle.available;
}

function deleteVehicle(btnDeleteId) {

    // Delete in storage
    var vehicles = JSON.parse(localStorage.getItem('vehicles'));
    vehicles.splice(btnDeleteId - 1, 1);

    // List everything again
    listVehicles(vehicles);
}

listVehicles(vehicles);