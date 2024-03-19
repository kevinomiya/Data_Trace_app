import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createCustomer(customer) {
  return window.canister.dataTrace.createCustomer(customer);
}

// createEquipment
export async function createEquipment(equipment) {
  return window.canister.dataTrace.createEquipment(equipment);
}

// createService
export async function createService(service) {
  return window.canister.dataTrace.createService(service);
}



export async function getCustomer(id) {
  try {
    return await window.canister.dataTrace.getCustomer(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getCustomers() {
  try {
    return await window.canister.dataTrace.getCustomers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getEquipment(id) {
  try {
    return await window.canister.dataTrace.getEquipment(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getEquipments() {
  try {
    return await window.canister.dataTrace.getEquipments();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getService(id) {
  try {
    return await window.canister.dataTrace.getService(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getServices() {
  try {
    return await window.canister.dataTrace.getServices();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// updateEquipment
export async function updateEquipment(equipment) {
  return window.canister.dataTrace.updateEquipment(equipment);
}

// updateService
export async function updateService(service) {
  return window.canister.dataTrace.updateService(service);
}

// updateCustomer
export async function updateCustomer(customer) {
  return window.canister.dataTrace.updateCustomer(customer);
} 

// addEquipmentToService
export async function addEquipmentToService(serviceId, equipmentId) {
  return window.canister.dataTrace.addEquipmentToService(serviceId, equipmentId);
}

// addServiceToCustomer
export async function addServiceToCustomer(customerId, serviceId) {
  return window.canister.dataTrace.addServiceToCustomer(customerId, serviceId);
}

// sortCustomer
export async function sortCustomer() {
  return window.canister.dataTrace.sortCustomer();
}



export async function payService(customer) {
  const dataTraceCanister = window.canister.dataTrace;
  const payResponse = await dataTraceCanister.createReservePayout(customer.id);
  const reciverPrincipal = Principal.from(payResponse.Ok.paidTo);
  const reservorAddress = await dataTraceCanister.getAddressFromPrincipal(reciverPrincipal);
  const block = await transferICP(reservorAddress, payResponse.Ok.price, payResponse.Ok.memo);
  await dataTraceCanister.completeReservePayment(reciverPrincipal, customer.id, payResponse.Ok.price, block, payResponse.Ok.memo);
}












