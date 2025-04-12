// Data storage
function logout(event) {
  event.preventDefault(); // stops the link from refreshing
  window.location.href = "index.html";
}
// Initialize with sample data if empty
let customers = JSON.parse(localStorage.getItem("customers")) || [
  {
    id: 2414,
    name: "John Smith",
    address: "123 Main St, Anytown",
    phone: "555-1234",
    email: "john@example.com",
  },
  {
    id: 2415,
    name: "Emily Johnson",
    address: "456 Oak Ave, Somewhere",
    phone: "555-5678",
    email: "emily@example.com",
  },
  {
    id: 2416,
    name: "Mike Williams",
    address: "789 Pine Rd, Nowhere",
    phone: "555-9012",
    email: "mike@example.com",
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
    courierName: "Fast Delivery",
  },
  {
    id: 2,
    courierName: "Quick Ship",
  },
  {
    id: 3,
    courierName: "Trump deli service",
  },
];

let orders = JSON.parse(localStorage.getItem("orders")) || [
  {
    id: 1,
    customerId: 2414,
    address: "123 Main St, Anytown",
    deliveryId: 1,
    date: "2023-05-15",
    paymentMethod: "Credit Card",
    status: "Completed",
  },
  {
    id: 2,
    customerId: 2415,
    address: "456 Oak Ave, Somewhere",
    deliveryId: 2,
    date: "2023-05-16",
    paymentMethod: "Cash",
    status: "Processing",
  },
  {
    id: 3,
    customerId: 2416,
    address: "789 Pine Rd, Nowhere",
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
// Generate ID starting from a custom value
function generateId(array, startFrom = 1000) {
  return array.length > 0
    ? Math.max(...array.map((item) => item.id)) + 1
    : startFrom;
}

// ========== CUSTOMERS ==========
document
  .getElementById("customerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("customerId").value;
    const customer = {
      id: id ? parseInt(id) : generateId(customers, 1000), // Custom starting point
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
    resetCustomerForm();
    console.log(customers);
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
    address: document.getElementById("address").value,
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
  updateOrderCount();
  renderOrders();
  populateOrderDropdown();
  updateOrderCount();
  updateStatistics();
  updateOrderCount();
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
              <td>${order.address}</td>
              <td>${delivery ? delivery.courierName : "Unknown"} (ID: ${
        order.deliveryId
      })</td>
              <td>${order.date}</td>
              <td>${order.paymentMethod}</td>
              <td>${order.status}</td>
              <td>
                  <button onclick="editOrder(${order.id})">Edit</button>
                  <button onclick="deleteOrder(${order.id})">Delete</button>
                  <button onclick="generateReceipt(${
                    order.id
                  })">Receipt</button>
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
    updateOrderCount();
  }
}

function deleteOrder(id) {
  if (confirm("Are you sure you want to delete this order?")) {
    orders = orders.filter((o) => o.id !== id);
    orderDetails = orderDetails.filter((od) => od.orderId !== id);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    renderOrders();
    updateOrderCount();
    renderOrderDetails();
    updateOrderCount();
    updateOrderCount();
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
    updateOrderCount();
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    updateOrderCount();
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
    option.textContent = `${delivery.courierName} (ID: ${delivery.id})`;
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
  updateOrderCount();
  populateCustomerDropdown();
  populateDeliveryDropdown();
  populateOrderDropdown();
  populateProductDropdown();
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

// generate reciept
function generateReceipt(orderId) {
  const existingModal = document.getElementById("receiptModal");
  if (existingModal) {
    existingModal.remove();
  }

  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    alert("Order not found!");
    return;
  }

  const customer = customers.find((c) => c.id === order.customerId);
  const delivery = deliveries.find((d) => d.id === order.deliveryId);
  const details = orderDetails.filter((od) => od.orderId === orderId);

  // Calculate totals
  let subtotal = 0;
  let totalItems = 0;
  details.forEach((detail) => {
    subtotal += detail.totalPrice;
    totalItems += detail.quantity;
  });

  let receiptHTML = `
    <div class="receipt-container" style="font-family: Arial, sans-serif; width: 80%; max-width: 800px; margin: 20px auto; padding: 30px; border: 1px solid #ddd; box-shadow: 0 0 15px rgba(0,0,0,0.2); background: white; overflow-y: auto; max-height: 90vh;">
      <div class="receipt-header" style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4a4a4a; margin-bottom: 5px;">Donut Shop</h1>
        <p style="color: #777; margin-top: 0;">123 Sweet Street, Donutville</p>
        <p style="color: #777;">Phone: (555) 123-4567</p>
        <h2 style="border-top: 2px dashed #ccc; border-bottom: 2px dashed #ccc; padding: 10px 0; margin: 15px 0;">ORDER RECEIPT</h2>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div class="receipt-info" style="flex: 1;">
          <p><strong>Receipt #:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${order.date}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
        </div>
        <div class="customer-info" style="flex: 1;">
          <p><strong>Customer:</strong> ${
            customer ? customer.name : "Unknown"
          }</p>
          <p><strong>Phone:</strong> ${customer ? customer.phone : "N/A"}</p>
          <p><strong>Email:</strong> ${customer ? customer.email : "N/A"}</p>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <p><strong>Delivery Address:</strong> ${order.address}</p>
        <p><strong>Delivery Service:</strong> ${
          delivery ? delivery.courierName : "Not specified"
        }</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Order Status:</strong> <span style="color: ${
          order.status === "Completed"
            ? "green"
            : order.status === "Processing"
            ? "orange"
            : "red"
        };">${order.status}</span></p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f5f5f5; border-bottom: 2px solid #ddd;">
            <th style="text-align: left; padding: 12px 8px;">Item</th>
            <th style="text-align: center; padding: 12px 8px;">Description</th>
            <th style="text-align: right; padding: 12px 8px;">Price</th>
            <th style="text-align: center; padding: 12px 8px;">Qty</th>
            <th style="text-align: right; padding: 12px 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
  `;

  details.forEach((detail) => {
    const product = products.find((p) => p.id === detail.productId);
    const itemPrice = product ? product.price : 0;

    receiptHTML += `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 8px; vertical-align: top;">${
          product ? product.name : "Unknown Product"
        }</td>
        <td style="padding: 10px 8px; text-align: center; vertical-align: top;">${
          product ? product.description : "N/A"
        }</td>
        <td style="padding: 10px 8px; text-align: right; vertical-align: top;">$${itemPrice.toFixed(
          2
        )}</td>
        <td style="padding: 10px 8px; text-align: center; vertical-align: top;">${
          detail.quantity
        }</td>
        <td style="padding: 10px 8px; text-align: right; vertical-align: top;">$${detail.totalPrice.toFixed(
          2
        )}</td>
      </tr>
    `;
  });

  receiptHTML += `
        </tbody>
      </table>

      <div style="border-top: 2px solid #ddd; padding-top: 15px; margin-top: 20px;">
        <div style="float: right; width: 300px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span><strong>Total Items:</strong></span>
            <span>${totalItems}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span><strong>Subtotal:</strong></span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 1.1em;">
            <span><strong>Total Amount:</strong></span>
            <span><strong>$${subtotal.toFixed(2)}</strong></span>
          </div>
        </div>
        <div style="clear: both;"></div>
      </div>

      <div style="margin-top: 30px; text-align: center; font-size: 0.9em; color: #777;">
        <p>Thank you for your order!</p>
        <p>Please contact us if you have any questions about your order.</p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <button onclick="printReceipt()" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-right: 10px;">
          <i class="fas fa-print"></i> Print Receipt
        </button>
        <button onclick="closeReceipt()" style="padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>
  `;

  // Create a modal to display the receipt
  // const modal = document.createElement("div");
  // modal.id = "receiptModal";
  // modal.style.position = "fixed";
  // modal.style.top = "0";
  // modal.style.left = "0";
  // modal.style.width = "100%";
  // modal.style.height = "100vh";
  // modal.style.backgroundColor = "rgba(0,0,0,0.8)";
  // modal.style.zIndex = "1000";
  // modal.style.overflow = "auto";
  // modal.style.display = "flex";
  // modal.style.justifyContent = "center";
  // modal.style.alignItems = "flex-start";
  // modal.style.padding = "20px 0";
  // modal.innerHTML = receiptHTML;

  // document.body.appendChild(modal);
  // document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  const modal = document.createElement("div");
  modal.id = "receiptModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.8)";
  modal.style.zIndex = "1000";
  modal.style.overflow = "auto"; // Changed from 'hidden' to 'auto'

  // Center container with proper sizing
  const container = document.createElement("div");
  container.style.width = "90%";
  container.style.maxWidth = "800px";
  container.style.margin = "20px auto"; // Added margin
  container.style.padding = "20px";
  container.style.background = "white";
  container.style.borderRadius = "5px";
  container.style.boxShadow = "0 0 20px rgba(0,0,0,0.2)";
  container.innerHTML = receiptHTML;

  modal.appendChild(container);
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";
}
function closeReceipt() {
  const modal = document.getElementById("receiptModal");
  if (modal) {
    modal.remove();
    document.body.style.overflow = "auto"; // Restore scrolling
  }
}

function printReceipt() {
  const receiptContainer = document.querySelector(
    "#receiptModal .receipt-container"
  );
  if (!receiptContainer) return;

  const printContent = receiptContainer.cloneNode(true);
  const buttons = printContent.querySelectorAll("button");
  buttons.forEach((button) => button.remove());

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Order Receipt</title>
        <style>
          @page {
            size: auto;
            margin: 5mm;
          }
          body, html {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden !important;
          }
          .print-area {
            page-break-after: always; /* Ensure content stays on one page */
            page-break-inside: avoid;
            height: calc(100vh - 10mm); /* Slightly less than full page */
            overflow: hidden;
          }
          .receipt-container {
            width: 100%;
            max-width: 80mm;
            margin: 0 auto;
            padding: 10px;
            overflow: visible !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 5px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
        </style>
      </head>
      <body>
        <div class="print-area">
          ${printContent.outerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 200);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
function updateOrderCount() {
  const totalOrders = orders.length;
  const countElement = document.getElementById("orderCount");

  if (countElement) {
    countElement.textContent = `Total Orders: ${totalOrders}`;
  } else {
    // Create the element if it doesn't exist
    const ordersTab = document.querySelector("#Orders");
    if (ordersTab) {
      const countP = document.createElement("p");
      countP.id = "orderCount";
      countP.textContent = `Total Orders: ${totalOrders}`;
      ordersTab.insertBefore(countP, ordersTab.firstChild);
    }
  }
}
