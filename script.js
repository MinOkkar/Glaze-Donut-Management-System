// Data storage

// Initialize with sample data if empty
let customers = JSON.parse(localStorage.getItem("customers")) || [
  {
    id: 1,
    name: "John Smith",
    address: "123 Main St, Anytown",
    phone: "555-1234",
    email: "john@example.com",
  },
];

let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    name: "Glazed Donut",
    description: "Classic glazed",
    price: 1.5,
    stock: 100,
  },
  {
    id: 2,
    name: "Chocolate Sprinkles",
    description: "Chocolate frosted with sprinkles",
    price: 2.0,
    stock: 75,
  },
  {
    id: 3,
    name: "Boston Cream",
    description: "Custard filled with chocolate glaze",
    price: 2.25,
    stock: 60,
  },
  {
    id: 4,
    name: "Jelly Filled",
    description: "Raspberry jelly filled",
    price: 2.0,
    stock: 50,
  },
  {
    id: 5,
    name: "Maple Bacon",
    description: "Maple glaze with bacon bits",
    price: 2.75,
    stock: 40,
  },
];

let deliveries = JSON.parse(localStorage.getItem("deliveries")) || [
  {
    id: 1,
    status: "Delivered",
    address: "123 Main St, Anytown",
    courierName: "Fast Delivery",
  },
  {
    id: 2,
    status: "In Transit",
    address: "456 Oak Ave, Somewhere",
    courierName: "Quick Ship",
  },
  {
    id: 3,
    status: "Pending",
    address: "789 Pine Rd, Nowhere",
    courierName: "Speedy Couriers",
  },
];

let orders = JSON.parse(localStorage.getItem("orders")) || [
  {
    id: 1,
    customerId: 1,
    deliveryId: 1,
    date: "2023-05-15",
    paymentMethod: "Credit Card",
    status: "Completed",
  },
  {
    id: 2,
    customerId: 2,
    deliveryId: 2,
    date: "2023-05-16",
    paymentMethod: "Cash",
    status: "Processing",
  },
  {
    id: 3,
    customerId: 3,
    deliveryId: 3,
    date: "2023-05-17",
    paymentMethod: "PayPal",
    status: "Pending",
  },
];

let orderDetails = JSON.parse(localStorage.getItem("orderDetails")) || [
  { orderId: 1, productId: 1, quantity: 12, totalPrice: 18.0 },
  { orderId: 1, productId: 2, quantity: 6, totalPrice: 12.0 },
  { orderId: 2, productId: 3, quantity: 4, totalPrice: 9.0 },
  { orderId: 2, productId: 4, quantity: 3, totalPrice: 6.0 },
  { orderId: 3, productId: 5, quantity: 2, totalPrice: 5.5 },
  { orderId: 3, productId: 1, quantity: 6, totalPrice: 9.0 },
];

// Save to localStorage if empty
if (!localStorage.getItem("customers"))
  localStorage.setItem("customers", JSON.stringify(customers));
if (!localStorage.getItem("products"))
  localStorage.setItem("products", JSON.stringify(products));
if (!localStorage.getItem("deliveries"))
  localStorage.setItem("deliveries", JSON.stringify(deliveries));
if (!localStorage.getItem("orders"))
  localStorage.setItem("orders", JSON.stringify(orders));
if (!localStorage.getItem("orderDetails"))
  localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  renderAll();
  document.getElementById("orderDate").valueAsDate = new Date();
});

// Tab functionality
function openTab(evt, tabName) {
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  let tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Generate ID
function generateId(array) {
  return array.length > 0 ? Math.max(...array.map((item) => item.id)) + 1 : 1;
}

// ========== CUSTOMERS ==========
document
  .getElementById("customerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("customerId").value;
    const customer = {
      id: id ? parseInt(id) : generateId(customers),
      name: document.getElementById("customerName").value,
      address: document.getElementById("customerAddress").value,
      phone: document.getElementById("customerPhone").value,
      email: document.getElementById("customerEmail").value,
    };

    if (id) {
      // Update existing customer
      const index = customers.findIndex((c) => c.id === parseInt(id));
      customers[index] = customer;
    } else {
      // Add new customer
      customers.push(customer);
    }

    localStorage.setItem("customers", JSON.stringify(customers));
    renderCustomers();
    updateStatistics();
    resetCustomerForm();
  });

function renderCustomers() {
  const tbody = document.getElementById("customerList");
  tbody.innerHTML = customers
    .map(
      (customer) => `
          <tr>
              <td>${customer.id}</td>
              <td>${customer.name}</td>
              <td>${customer.address}</td>
              <td>${customer.phone}</td>
              <td>${customer.email}</td>
              <td>
                  <button onclick="editCustomer(${customer.id})">Edit</button>
                  <button onclick="deleteCustomer(${customer.id})">Delete</button>
              </td>
          </tr>
      `
    )
    .join("");
}

function editCustomer(id) {
  const customer = customers.find((c) => c.id === id);
  if (customer) {
    document.getElementById("customerId").value = customer.id;
    document.getElementById("customerName").value = customer.name;
    document.getElementById("customerAddress").value = customer.address;
    document.getElementById("customerPhone").value = customer.phone;
    document.getElementById("customerEmail").value = customer.email;

    document.getElementById("customerSubmit").textContent = "Update Customer";
    document.getElementById("customerCancel").style.display = "inline-block";
  }
}

function deleteCustomer(id) {
  if (confirm("Are you sure you want to delete this customer?")) {
    customers = customers.filter((c) => c.id !== id);
    localStorage.setItem("customers", JSON.stringify(customers));
    renderCustomers();
    updateStatistics();
  }
}

document
  .getElementById("customerCancel")
  .addEventListener("click", resetCustomerForm);

function resetCustomerForm() {
  document.getElementById("customerForm").reset();
  document.getElementById("customerId").value = "";
  document.getElementById("customerSubmit").textContent = "Add Customer";
  document.getElementById("customerCancel").style.display = "none";
}

// ========== PRODUCTS ==========
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const product = {
    id: id ? parseInt(id) : generateId(products),
    name: document.getElementById("productName").value,
    description: document.getElementById("productDesc").value,
    price: parseFloat(document.getElementById("productPrice").value),
    stock: parseInt(document.getElementById("productStock").value),
  };

  if (id) {
    // Update existing product
    const index = products.findIndex((p) => p.id === parseInt(id));
    products[index] = product;
  } else {
    // Add new product
    products.push(product);
  }

  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
  updateStatistics();
  resetProductForm();
});

function renderProducts() {
  const tbody = document.getElementById("productList");
  tbody.innerHTML = products
    .map(
      (product) => `
          <tr>
              <td>${product.id}</td>
              <td>${product.name}</td>
              <td>${product.description}</td>
              <td>$${product.price.toFixed(2)}</td>
              <td>${product.stock}</td>
              <td>
                  <button onclick="editProduct(${product.id})">Edit</button>
                  <button onclick="deleteProduct(${product.id})">Delete</button>
              </td>
          </tr>
      `
    )
    .join("");
}

function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productDesc").value = product.description;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;

    document.getElementById("productSubmit").textContent = "Update Product";
    document.getElementById("productCancel").style.display = "inline-block";
  }
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter((p) => p.id !== id);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    updateStatistics();
  }
}

document
  .getElementById("productCancel")
  .addEventListener("click", resetProductForm);

function resetProductForm() {
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("productSubmit").textContent = "Add Product";
  document.getElementById("productCancel").style.display = "none";
}

// ========== DELIVERIES ==========
document
  .getElementById("deliveryForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("deliveryId").value;
    const delivery = {
      id: id ? parseInt(id) : generateId(deliveries),
      status: document.getElementById("deliveryStatus").value,
      address: document.getElementById("deliveryAddress").value,
      courierName: document.getElementById("courierName").value,
    };

    if (id) {
      // Update existing delivery
      const index = deliveries.findIndex((d) => d.id === parseInt(id));
      deliveries[index] = delivery;
    } else {
      // Add new delivery
      deliveries.push(delivery);
    }

    localStorage.setItem("deliveries", JSON.stringify(deliveries));
    renderDeliveries();
    populateDeliveryDropdown();
    updateStatistics();
    resetDeliveryForm();
  });

function renderDeliveries() {
  const tbody = document.getElementById("deliveryList");
  tbody.innerHTML = deliveries
    .map(
      (delivery) => `
          <tr>
              <td>${delivery.id}</td>
              <td>${delivery.status}</td>
              <td>${delivery.address}</td>
              <td>${delivery.courierName}</td>
              <td>
                  <button onclick="editDelivery(${delivery.id})">Edit</button>
                  <button onclick="deleteDelivery(${delivery.id})">Delete</button>
              </td>
          </tr>
      `
    )
    .join("");
}

function editDelivery(id) {
  const delivery = deliveries.find((d) => d.id === id);
  if (delivery) {
    document.getElementById("deliveryId").value = delivery.id;
    document.getElementById("deliveryStatus").value = delivery.status;
    document.getElementById("deliveryAddress").value = delivery.address;
    document.getElementById("courierName").value = delivery.courierName;

    document.getElementById("deliverySubmit").textContent = "Update Delivery";
    document.getElementById("deliveryCancel").style.display = "inline-block";
  }
}

function deleteDelivery(id) {
  if (confirm("Are you sure you want to delete this delivery?")) {
    deliveries = deliveries.filter((d) => d.id !== id);
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
    renderDeliveries();
    populateDeliveryDropdown();
    updateStatistics();
  }
}

document
  .getElementById("deliveryCancel")
  .addEventListener("click", resetDeliveryForm);

function resetDeliveryForm() {
  document.getElementById("deliveryForm").reset();
  document.getElementById("deliveryId").value = "";
  document.getElementById("deliverySubmit").textContent = "Add Delivery";
  document.getElementById("deliveryCancel").style.display = "none";
}

// ========== ORDERS ==========
document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("orderId").value;
  const order = {
    id: id ? parseInt(id) : generateId(orders),
    customerId: parseInt(document.getElementById("orderCustomerID").value),
    deliveryId: parseInt(document.getElementById("orderDeliveryID").value),
    date: document.getElementById("orderDate").value,
    paymentMethod: document.getElementById("orderPaymentMethod").value,
    status: document.getElementById("orderStatus").value,
  };

  if (id) {
    // Update existing order
    const index = orders.findIndex((o) => o.id === parseInt(id));
    orders[index] = order;
  } else {
    // Add new order
    orders.push(order);
  }

  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
  populateOrderDropdown();
  updateStatistics();
  resetOrderForm();
});

function renderOrders() {
  const tbody = document.getElementById("orderList");
  tbody.innerHTML = orders
    .map((order) => {
      const customer = customers.find((c) => c.id === order.customerId);
      const delivery = deliveries.find((d) => d.id === order.deliveryId);
      return `
          <tr>
              <td>${order.id}</td>
              <td>${customer ? customer.name : "Unknown"} (ID: ${
        order.customerId
      })</td>
              <td>${delivery ? delivery.status : "Unknown"} (ID: ${
        order.deliveryId
      })</td>
              <td>${order.date}</td>
              <td>${order.paymentMethod}</td>
              <td>${order.status}</td>
              <td>
                  <button onclick="editOrder(${order.id})">Edit</button>
                  <button onclick="deleteOrder(${order.id})">Delete</button>
              </td>
          </tr>
          `;
    })
    .join("");
}

function editOrder(id) {
  const order = orders.find((o) => o.id === id);
  if (order) {
    document.getElementById("orderId").value = order.id;
    document.getElementById("orderCustomerID").value = order.customerId;
    document.getElementById("orderDeliveryID").value = order.deliveryId;
    document.getElementById("orderDate").value = order.date;
    document.getElementById("orderPaymentMethod").value = order.paymentMethod;
    document.getElementById("orderStatus").value = order.status;

    document.getElementById("orderSubmit").textContent = "Update Order";
    document.getElementById("orderCancel").style.display = "inline-block";
  }
}

function deleteOrder(id) {
  if (confirm("Are you sure you want to delete this order?")) {
    orders = orders.filter((o) => o.id !== id);
    orderDetails = orderDetails.filter((od) => od.orderId !== id);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    renderOrders();
    renderOrderDetails();
  }
}

document
  .getElementById("orderCancel")
  .addEventListener("click", resetOrderForm);

function resetOrderForm() {
  document.getElementById("orderForm").reset();
  document.getElementById("orderId").value = "";
  document.getElementById("orderDate").valueAsDate = new Date();
  document.getElementById("orderSubmit").textContent = "Add Order";
  document.getElementById("orderCancel").style.display = "none";
}

// ========== ORDER DETAILS ==========
document
  .getElementById("orderDetailForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("orderDetailId").value;
    const orderId = parseInt(document.getElementById("detailOrderID").value);
    const productId = parseInt(
      document.getElementById("detailProductID").value
    );

    const orderDetail = {
      orderId: orderId,
      productId: productId,
      quantity: parseInt(document.getElementById("detailQuantity").value),
      totalPrice: parseFloat(document.getElementById("detailTotalPrice").value),
    };

    if (id) {
      // Update existing order detail
      const [existingOrderId, existingProductId] = id.split("-");
      const index = orderDetails.findIndex(
        (od) =>
          od.orderId === parseInt(existingOrderId) &&
          od.productId === parseInt(existingProductId)
      );
      orderDetails[index] = orderDetail;
    } else {
      // Add new order detail
      orderDetails.push(orderDetail);
    }

    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    renderOrderDetails();
    resetOrderDetailForm();
  });

function renderOrderDetails() {
  const tbody = document.getElementById("orderDetailList");
  tbody.innerHTML = orderDetails
    .map((detail) => {
      const order = orders.find((o) => o.id === detail.orderId);
      const product = products.find((p) => p.id === detail.productId);
      return `
          <tr>
              <td>${detail.orderId}${order ? ` (${order.date})` : ""}</td>
              <td>${product ? product.name : "Unknown"} (ID: ${
        detail.productId
      })</td>
              <td>${detail.quantity}</td>
              <td>$${detail.totalPrice.toFixed(2)}</td>
              <td>
                  <button onclick="editOrderDetail(${detail.orderId}, ${
        detail.productId
      })">Edit</button>
                  <button onclick="deleteOrderDetail(${detail.orderId}, ${
        detail.productId
      })">Delete</button>
              </td>
          </tr>
          `;
    })
    .join("");
}

function editOrderDetail(orderId, productId) {
  const detail = orderDetails.find(
    (od) => od.orderId === orderId && od.productId === productId
  );
  if (detail) {
    document.getElementById("orderDetailId").value = `${orderId}-${productId}`;
    document.getElementById("detailOrderID").value = detail.orderId;
    document.getElementById("detailProductID").value = detail.productId;
    document.getElementById("detailQuantity").value = detail.quantity;
    document.getElementById("detailTotalPrice").value = detail.totalPrice;

    document.getElementById("orderDetailSubmit").textContent =
      "Update Order Detail";
    document.getElementById("orderDetailCancel").style.display = "inline-block";
  }
}

function deleteOrderDetail(orderId, productId) {
  if (confirm("Are you sure you want to delete this order detail?")) {
    orderDetails = orderDetails.filter(
      (od) => !(od.orderId === orderId && od.productId === productId)
    );
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    renderOrderDetails();
  }
}

document
  .getElementById("orderDetailCancel")
  .addEventListener("click", resetOrderDetailForm);

function resetOrderDetailForm() {
  document.getElementById("orderDetailForm").reset();
  document.getElementById("orderDetailId").value = "";
  document.getElementById("orderDetailSubmit").textContent = "Add Order Detail";
  document.getElementById("orderDetailCancel").style.display = "none";
}

// ========== HELPER FUNCTIONS ==========
function populateCustomerDropdown() {
  const select = document.getElementById("orderCustomerID");
  select.innerHTML = '<option value="">Select Customer</option>';
  customers.forEach((customer) => {
    const option = document.createElement("option");
    option.value = customer.id;
    option.textContent = `${customer.name} (ID: ${customer.id})`;
    select.appendChild(option);
  });
}

function populateDeliveryDropdown() {
  const select = document.getElementById("orderDeliveryID");
  select.innerHTML = '<option value="">Select Delivery</option>';
  deliveries.forEach((delivery) => {
    const option = document.createElement("option");
    option.value = delivery.id;
    option.textContent = `${delivery.status} (ID: ${delivery.id})`;
    select.appendChild(option);
  });
}

function populateOrderDropdown() {
  const select = document.getElementById("detailOrderID");
  select.innerHTML = '<option value="">Select Order</option>';
  orders.forEach((order) => {
    const option = document.createElement("option");
    option.value = order.id;
    option.textContent = `Order #${order.id} (${order.date})`;
    select.appendChild(option);
  });
}

function populateProductDropdown() {
  const select = document.getElementById("detailProductID");
  select.innerHTML = '<option value="">Select Product</option>';
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} ($${product.price.toFixed(2)})`;
    select.appendChild(option);
  });
}

function renderAll() {
  renderCustomers();
  renderProducts();
  renderDeliveries();
  renderOrders();
  renderOrderDetails();

  populateCustomerDropdown();
  populateDeliveryDropdown();
  populateOrderDropdown();
  populateProductDropdown();

  updateStatistics(); // Add this line
}

// Call renderAll when the page loads
document.addEventListener("DOMContentLoaded", function () {
  renderAll();
  document.getElementById("orderDate").valueAsDate = new Date();
});

// Calculate total price when quantity changes
document
  .getElementById("detailQuantity")
  .addEventListener("change", function () {
    const productId = document.getElementById("detailProductID").value;
    const quantity = this.value;

    if (productId && quantity) {
      const product = products.find((p) => p.id === parseInt(productId));
      if (product) {
        document.getElementById("detailTotalPrice").value = (
          product.price * quantity
        ).toFixed(2);
      }
    }
  });

// Calculate total price when product changes
document
  .getElementById("detailProductID")
  .addEventListener("change", function () {
    const quantity = document.getElementById("detailQuantity").value;
    const productId = this.value;

    if (productId && quantity) {
      const product = products.find((p) => p.id === parseInt(productId));
      if (product) {
        document.getElementById("detailTotalPrice").value = (
          product.price * quantity
        ).toFixed(2);
      }
    }
  });
