import { auto } from "@popperjs/core";
import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { id } from "azle/src/lib/ic/id";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";


const Equipment = Record({
    id : text,
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


const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text
});


const equipmentStorage = StableBTreeMap(0,text, Equipment)
const serviceStorage = StableBTreeMap(1,text, Service)
const customerStorage = StableBTreeMap(2,text, Customer)




export default Canister({

    getEquipments: query([], Vec(Equipment),() => {
        return equipmentStorage.values();
    }
    ),
    getServices: query([], Vec(Service), () => {
        return serviceStorage.values();
    }),
    getCustomers: query([], Vec(Customer), () => {
        return customerStorage.values();
    }),

    getEquipment: query([text], Result(Equipment, Message), (id) => {
        const equipmentOpt = equipmentStorage.get(id);
        if ("None" in equipmentOpt) {
            return Err({ NotFound: `equipment with id=${id} not found` });
        }
        return Ok(equipmentOpt.Some);
    }),

    getService: query([text], Result(Service, Message), (id) => {
        const serviceOpt = serviceStorage.get(id);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `service with id=${id} not found` });
        }
        return Ok(serviceOpt.Some);
    }),

    getCustomer: query([text], Result(Customer, Message), (id) => {
        const customerOpt = customerStorage.get(id);
        if ("None" in customerOpt) {
            return Err({ NotFound: `customer with id=${id} not found` });
        }
        return Ok(customerOpt.Some);
    }),

    createEquipment: update([EquipmentPayload], Result(Equipment, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payoad" })
        }
        const equipment = { id: uuidv4(), ...payload};
        equipmentStorage.insert(equipment.id, equipment);
        return Ok(equipment);
    } 
    ),

    

    createService: update([ServicePayload], Result(Service, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payoad" })
        }
        const service = { 
            id: uuidv4(),
            equipments: [],
            ...payload};
        serviceStorage.insert(service.id, service);
        return Ok(service);
    } 
    ),

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
    } 
    ),

    updateEquipment: update([text, EquipmentPayload], Result(Equipment, Message), (id, payload) => {
        const equipmentOpt = equipmentStorage.get(id);
        if ("None" in equipmentOpt) {
            return Err({ NotFound: `equipment with id=${id} not found` });
        }
        const equipment = equipmentOpt.Some;
        equipmentStorage.insert(id, { ...equipment, ...payload });
        return Ok({ ...equipment, ...payload });
    }),

    updateService: update([text, ServicePayload], Result(Service, Message), (id, payload) => {
        const serviceOpt = serviceStorage.get(id);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `service with id=${id} not found` });
        }
        const service = serviceOpt.Some;
        serviceStorage.insert(id, { ...service, ...payload });
        return Ok({ ...service, ...payload });
    }),

    updateCustomer: update([text, CustomerPayload], Result(Customer, Message), (id, payload) => {
        const customerOpt = customerStorage.get(id);
        if ("None" in customerOpt) {
            return Err({ NotFound: `customer with id=${id} not found` });
        }
        const customer = customerOpt.Some;
        customerStorage.insert(id, { ...customer, ...payload });
        return Ok({ ...customer, ...payload });
    }),

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
    }

    ),

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
    } 
    ),

    // sort the Customer by the fullName
    sortCustomer: query([], Vec(Customer), () => {
        const customers = customerStorage.values();
        return customers.sort((a, b) => a.fullName.localeCompare(b.fullName));
    })  

});



// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};


