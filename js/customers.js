var customers = [
    { 
        name: 'Anna Marinova Petkova', 
        email: 'annam@gmail.com', 
        phone: '0887896321',
        vip: 'no'
    },
    { 
        name: 'Phil Adams Jones', 
        email: 'philj@gmail.com', 
        phone: '0897456210',
        vip: 'no'
    },
    { 
        name: 'Peter Angelov Angelov', 
        email: 'peteraa@gmail.com', 
        phone: '0875285132',
        vip: 'no'
    },
    { 
        name: 'Maria Ivanova Ivanova', 
        email: 'maria91@gmail.com', 
        phone: '0881237468',
        vip: 'no'
    },
    { 
        name: 'Stefan Dimitrov Petrov', 
        email: 'stefandp@gmail.com', 
        phone: '0895789411',
        vip: 'no'
    }
];

function format(customers) {
    var btnUpdateId = 1;
    var btnDeleteId = 1;
    var table = "<table id=\"table\"><tr><th>Name</th><th>Email</th><th>Phone Number</th><th>VIP</th><th>Edit</th></tr>";
    customers.forEach(customer => {
        table += "<tr>";
        Object.entries(customer).forEach(([key, property]) => {
            table += `<td>${property}</td>`;
        });
        table += `<td><button id=${btnUpdateId} onclick=\"preparePopup(${btnUpdateId})\">Update customer</button><br><button id=${btnDeleteId} onclick=\"deleteCustomer(${btnDeleteId})\">Delete customer</button></tr>`;
        btnUpdateId += 1;
        btnDeleteId += 1;
    });
    table += "</table>";

    return table;
}

function listCustomers(customers) {
    localStorage.setItem('customers', JSON.stringify(customers));
    document.getElementById("content").innerHTML = format(customers);
}

function openPopup(action, data = null) {
    var element = document.getElementById("popup");
    element.style.display = "block";

    var actionBtn = document.getElementById('action-btn');
    if(action == 'add') {
        document.getElementById('action').innerHTML = 'Add Customer';
        actionBtn.innerHTML = 'Add';
    } else {
        document.getElementById('action').innerHTML = 'Update Customer';
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

    document.getElementById("name").value =  null;
    document.getElementById("email").value =  null;
    document.getElementById("phone").value =  null;
}

window.onclick = function(e){
    if(e.target == popup){
      closePopup();
    }
}  

function upsert(action, data = null) {
    var customer = { 
        name: document.getElementById("name").value, 
        email: document.getElementById("email").value, 
        phone: document.getElementById("phone").value
    }

    var customers = JSON.parse(localStorage.getItem('customers'));
    if (action == 'add') {
        customer['vip'] = 'no';
        customers.push(customer);
    } else {
        customers[data - 1].name = customer.name;    
        customers[data - 1].email = customer.email;    
        customers[data - 1].phone = customer.phone;
    }

    listCustomers(customers);

    closePopup();
}

function preparePopup(btnUpdateId) {
    openPopup('update', btnUpdateId);

    var customers = JSON.parse(localStorage.getItem('customers'));
    var customer = customers[btnUpdateId - 1];
    document.getElementById("name").value =  customer.name;
    document.getElementById("email").value =  customer.email;
    document.getElementById("phone").value =  customer.phone;
}

function deleteCustomer(btnDeleteId) {

    // Delete in storage
    var customers = JSON.parse(localStorage.getItem('customers'));
    customers.splice(btnDeleteId - 1, 1);

    // List everything again
    listCustomers(customers);
}

listCustomers(customers);