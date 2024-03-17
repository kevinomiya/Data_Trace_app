import { update, query, text, Record, StableBTreeMap, Vec, Result, Ok, Err, ic, Principal } from "azle";
import { v4 as uuidv4 } from "uuid";

// Define types for Equipment, Service, and Customer
type Equipment = Record<{
    id: string;
    equipmentType: string;
    serialNumber: string;
    macAddress: string;
}>;

type Service = Record<{
    id: string;
    serviceType: string;
    servicePlan: string;
    connectionSpeed: string;
    equipments: Vec<Equipment>;
    installationDate: string;
    technicianName: string;
    paymentMethod: string;
    billingCycle: string;
}>;

type Customer = Record<{
    id: string;
    fullName: string;
    emailAddress: string;
    contactNumber: string;
    residentialAddress: string;
    billingAddress: string;
    idDocumentType: string;
    idDocumentNumber: string;
    service: Service;
}>;

// Define payload types for Equipment, Service, and Customer
type EquipmentPayload = Omit<Equipment, "id">;
type ServicePayload = Omit<Service, "id" | "equipments"> & { equipments: Equipment[] };
type CustomerPayload = Omit<Customer, "id" | "service"> & { service: Service };

// Define message variants for error handling
type Message = { NotFound: string } | { InvalidPayload: string };

// Define storage for Equipment, Service, and Customer
const equipmentStorage = new StableBTreeMap<string, Equipment>(0);
const serviceStorage = new StableBTreeMap<string, Service>(1);
const customerStorage = new StableBTreeMap<string, Customer>(2);

// Implement Canister
export default Canister({
    // Query functions
    getEquipments: query([], Vec(Equipment), () => equipmentStorage.values()),
    getServices: query([], Vec(Service), () => serviceStorage.values()),
    getCustomers: query([], Vec(Customer), () => customerStorage.values()),

    getEquipment: query([text], Result(Equipment, Message), (id) => getResultFromStorage(id, equipmentStorage)),
    getService: query([text], Result(Service, Message), (id) => getResultFromStorage(id, serviceStorage)),
    getCustomer: query([text], Result(Customer, Message), (id) => getResultFromStorage(id, customerStorage)),

    // Update functions
    createEquipment: update([EquipmentPayload], Result(Equipment, Message), (payload) => createRecord(payload, equipmentStorage)),
    createService: update([ServicePayload], Result(Service, Message), (payload) => createRecord(payload, serviceStorage)),
    createCustomer: update([CustomerPayload], Result(Customer, Message), (payload) => createRecord(payload, customerStorage)),

    updateEquipment: update([text, EquipmentPayload], Result(Equipment, Message), (id, payload) => updateRecord(id, payload, equipmentStorage)),
    updateService: update([text, ServicePayload], Result(Service, Message), (id, payload) => updateRecord(id, payload, serviceStorage)),
    updateCustomer: update([text, CustomerPayload], Result(Customer, Message), (id, payload) => updateRecord(id, payload, customerStorage)),

    // Utility function to handle result from storage
    getResultFromStorage: (id: string, storage: StableBTreeMap<string, Record>) => {
        const record = storage.get(id).Some;
        return record ? Ok(record) : Err({ NotFound: `Record with id=${id} not found` });
    },

    // Utility function to create a new record
    createRecord: <T extends Record>(payload: Omit<T, "id">, storage: StableBTreeMap<string, Record>) => {
        const record: T = { id: uuidv4(), ...payload };
        storage.insert(record.id, record);
        return Ok(record);
    },

    // Utility function to update an existing record
    updateRecord: <T extends Record>(id: string, payload: Partial<T>, storage: StableBTreeMap<string, Record>) => {
        const record = storage.get(id).Some;
        if (!record) return Err({ NotFound: `Record with id=${id} not found` });
        const updatedRecord = { ...record, ...payload };
        storage.insert(id, updatedRecord);
        return Ok(updatedRecord);
    },

    // Sort customers by fullName
    sortCustomers: query([], Vec(Customer), () => customerStorage.values().sort((a, b) => a.fullName.localeCompare(b.fullName)))
});

// Mock getRandomValues function for uuid package
globalThis.crypto = {
    getRandomValues: () => {
        const array = new Uint8Array(32);
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return array;
    }
};
