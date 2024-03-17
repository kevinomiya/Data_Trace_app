// Import necessary modules and functions
import {
    query,
    update,
    text,
    Record,
    StableBTreeMap,
    Variant,
    Vec,
    None,
    Some,
    Ok,
    Err,
    ic,
    Principal,
    Opt,
    nat64,
    Duration,
    Result,
    bool,
    Canister
} from "azle";
import {
    Ledger,
    binaryAddressFromAddress,
    binaryAddressFromPrincipal,
    hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { id } from "azle/src/lib/ic/id";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

// Define record types for Equipment, Service, and Customer
const Equipment = Record({
    id: text,
    equipmentType: text,
    serialNumber: text,
    macAddress: text,
});

const Service = Record({
    id: text,
    serviceType: text,
    servicePlan: text,
    connectionSpeed: text,
    equipments: Vec(Equipment), // Modem, Router, Switch
    installationDate: text,
    technicianName: text,
    paymentMethod: text,
    billingCycle: text,
});

const Customer = Record({
    id: text,
    fullName: text,
    emailAddress: text,
    contactNumber: text,
    residentialAddress: text,
    billingAddress: text, // Address for billing purposes
    idDocumentType: text, // Passport, National ID, Driver's License
    idDocumentNumber: text,
    service: Service,
});

// Define payload types for Equipment, Service, and Customer
const EquipmentPayload = Record({
    equipmentType: text,
    serialNumber: text,
    macAddress: text,
});

const ServicePayload = Record({
    serviceType: text,
    servicePlan: text,
    connectionSpeed: text,
    installationDate: text,
    technicianName: text,
    paymentMethod: text,
    billingCycle: text,
});

const CustomerPayload = Record({
    fullName: text,
    emailAddress: text,
    contactNumber: text,
    residentialAddress: text,
    billingAddress: text,
    idDocumentType: text,
    idDocumentNumber: text,
});

// Define variant type for error messages
const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text
});

// Initialize storage for Equipment, Service, and Customer
const equipmentStorage = StableBTreeMap(0, text, Equipment);
const serviceStorage = StableBTreeMap(1, text, Service);
const customerStorage = StableBTreeMap(2, text, Customer);

// Define a Canister with query and update functions
export default Canister({

    // Query functions

    // Query function to get all equipments
    getEquipments: query([], Vec(Equipment), () => {
        return equipmentStorage.values();
    }),

    // Query function to get all services
    getServices: query([], Vec(Service), () => {
        return serviceStorage.values();
    }),

    // Query function to get all customers
    getCustomers: query([], Vec(Customer), () => {
        return customerStorage.values();
    }),

    // Query function to get an equipment by ID
    getEquipment: query([text], Result(Equipment, Message), (id) => {
        const equipmentOpt = equipmentStorage.get(id);
        if ("None" in equipmentOpt) {
            return Err({ NotFound: `equipment with id=${id} not found` });
        }
        return Ok(equipmentOpt.Some);
    }),

    // Query function to get a service by ID
    getService: query([text], Result(Service, Message), (id) => {
        const serviceOpt = serviceStorage.get(id);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `service with id=${id} not found` });
        }
        return Ok(serviceOpt.Some);
    }),

    // Query function to get a customer by ID
    getCustomer: query([text], Result(Customer, Message), (id) => {
        const customerOpt = customerStorage.get(id);
        if ("None" in customerOpt) {
            return Err({ NotFound: `customer with id=${id} not found` });
        }
        return Ok(customerOpt.Some);
    }),

    // Query function to sort customers by full name
    sortCustomer: query([], Vec(Customer), () => {
        // Sort customers by fullName
        const customers = customerStorage.values();
        return customers.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }),

    // Update functions

    // Update function to create a new equipment
    createEquipment: update([EquipmentPayload], Result(Equipment, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payoad" })
        }
        const equipment = { id: uuidv4(), ...payload };
        equipmentStorage.insert(equipment.id, equipment);
        return Ok(equipment);
    }),

    // Update function to create a new service
    createService: update([ServicePayload], Result(Service, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payoad" })
        }
        const service = {
            id: uuidv4(),
            equipments: [],
            ...payload
        };
        serviceStorage.insert(service.id, service);
        return Ok(service);
    }),

    // Update function to create a new customer
    createCustomer: update([CustomerPayload], Result(Customer, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payoad" })
        }
        const customer = {
            id: uuidv4(),
            ...payload,
            service: {
                id: uuidv4(),
                equipments: [],
                serviceType: "",
                servicePlan: "",
                connectionSpeed: "",
                installationDate: "",
                technicianName: "",
                paymentMethod: "",
                billingCycle: "",
            },
        };
        customerStorage.insert(customer.id, customer);
        return Ok(customer);
    }),

    // Update function to update an existing equipment
    updateEquipment: update([text, EquipmentPayload], Result(Equipment, Message), (id, payload) => {
        const equipmentOpt = equipmentStorage.get(id);
        if ("None" in equipmentOpt) {
            return Err({ NotFound: `equipment with id=${id} not found` });
        }
        const equipment = equipmentOpt.Some;
        equipmentStorage.insert(id, { ...equipment, ...payload });
        return Ok({ ...equipment, ...payload });
    }),

    // Update function to update an existing service
    updateService: update([text, ServicePayload], Result(Service, Message), (id, payload) => {
        const serviceOpt = serviceStorage.get(id);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `service with id=${id} not found` });
        }
        const service = serviceOpt.Some;
        serviceStorage.insert(id, { ...service, ...payload });
        return Ok({ ...service, ...payload });
    }),

    // Update function to update an existing customer
    updateCustomer: update([text, CustomerPayload], Result(Customer, Message), (id, payload) => {
        const customerOpt = customerStorage.get(id);
        if ("None" in customerOpt) {
            return Err({ NotFound: `customer with id=${id} not found` });
        }
        const customer = customerOpt.Some;
        customerStorage.insert(id, { ...customer, ...payload });
        return Ok({ ...customer, ...payload });
    }),

    // Update function to add an equipment to a service
    addEquipmentToService: update([text, text], Result(Service, Message), (serviceId, equipmentId) => {
        const serviceOpt = serviceStorage.get(serviceId);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `service with id=${serviceId} not found` });
        }
        const service = serviceOpt.Some;
        const equipmentOpt = equipmentStorage.get(equipmentId);
        if ("None" in equipmentOpt) {
            return Err({ NotFound: `equipment with id=${equipmentId} not found` });
        }
        service.equipments.push(equipmentOpt.Some);
        serviceStorage.insert(serviceId, service);
        return Ok(service);
    }),

    // Update function to add a service to a customer
    addServiceToCustomer: update([text, text], Result(Customer, Message), (customerId, serviceId) => {
        const customerOpt = customerStorage.get(customerId);
        if ("None" in customerOpt) {
            return Err({ NotFound: `customer with id=${customerId} not found` });
        }
        const customer = customerOpt.Some;
        const serviceOpt = serviceStorage.get(serviceId);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `service with id=${serviceId} not found` });
        }
        customer.service = serviceOpt.Some;
        customerStorage.insert(customerId, customer);
        return Ok(customer);
    })
});

// A workaround to make uuid package work with Azle
globalThis.crypto = {
    getRandomValues: () => {
        let array = new Uint8Array(32);
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return array;
    }
};
