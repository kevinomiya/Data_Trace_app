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
    serviceOwner: Opt(Principal),
    serviceType: text,
    servicePlan: text,
    servicePrice: nat64,
    connectionSpeed: text,
    equipments: Vec(Equipment), // Modem, Router, Switch
    installationDate: text,
    technicianName: text,
    paymentMethod: text,
    billingCycle: text,
});


const Customer = Record({
    id: text,
    owner: Principal,
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
    servicePrice: nat64,
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


const PayStatus = Variant({
    PaymentPending: text,
    Completed: text
});



// Stay with implementing Payment for Reserving 
const PayReserve = Record({
    CustomerId: text,
    price: nat64,
    status: PayStatus,
    payer: Principal,
    paidTo: Principal,
    paid_at_block: Opt(nat64),
    memo: nat64
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
const persistedPay = StableBTreeMap(3, Principal, PayReserve);
const pendingPay = StableBTreeMap(4, nat64, PayReserve);

const TIMEOUT_PERIOD = 3600n; // reservation period in seconds


/* 
    initialization of the Ledger canister. The principal text value is hardcoded because 
    we set it in the `dfx.json`
*/
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));


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
            serviceOwner: Some(ic.caller()),
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
            owner: ic.caller(),
            ...payload,
            service: {
                id: uuidv4(),
                serviceOwner: None,
                equipments: [],
                serviceType: "",
                servicePlan: "",
                servicePrice: 0n,
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
    }),


    createReservePayout: update([text], Result(PayReserve, Message), (customerId) => {
        const customerOpt = customerStorage.get(customerId);
        if ("None" in customerOpt) {
            return Err({ NotFound: `cannot reserve Customer Service: Customer with id=${customerId} not found` });
        }

        const customer = customerOpt.Some;
        const service = customer.service;
        const payReserve = {
            CustomerId: customerId,
            price: service.servicePrice,
            status: { PaymentPending: "PAYMENT_PENDING" },
            payer: ic.caller(),
            paidTo: service.serviceOwner.Some,
            paid_at_block: None,
            memo: generateCorrelationId(customerId)
        };

        pendingPay.insert(payReserve.memo, payReserve);
        discardByTimeout(payReserve.memo, TIMEOUT_PERIOD);
        return Ok(payReserve);
    }
    ),

    completeReservePayment: update([Principal,text,nat64, nat64, nat64], Result(PayReserve, Message), async (reservor,customerId,reservePrice, block, memo) => {
        const paymentVerified = await verifyPaymentInternal(reservor,reservePrice, block, memo);
        if (!paymentVerified) {
            return Err({ NotFound: `cannot complete the reserve: cannot verify the payment, memo=${memo}` });
        }
        const pendingReservePayoutOpt = pendingPay.remove(memo);
        if ("None" in pendingReservePayoutOpt) {
            return Err({ NotFound: `cannot complete the reserve: there is no pending reserve with id=${memo}` });
        }
        const reserve = pendingReservePayoutOpt.Some;
        const updatedReserve = { ...reserve, status: { Completed: "COMPLETED" }, paid_at_block: Some(block) };
        const customerOpt = customerStorage.get(customerId);
        if ("None" in customerOpt){
            throw Error(`Customer with id=${customerId} not found`)
        }
        const customer = customerOpt.Some;
        const service = customer.service;
        service.serviceOwner = Some(reservor);
        customer.service = service;
        customerStorage.insert(customer.id, customer);
        persistedPay.insert(ic.caller(), updatedReserve);
        return Ok(updatedReserve);

    }
    ),


    verifyPayment: query([Principal, nat64, nat64, nat64], bool, async (receiver, amount, block, memo) => {
        return await verifyPaymentInternal(receiver, amount, block, memo);
    }),

    /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
    getAddressFromPrincipal: query([Principal], text, (principal) => {
        return hexAddressFromPrincipal(principal, 0);
    }),

});


/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
*/
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};


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



// HELPER FUNCTIONS
function generateCorrelationId(bookId: text): nat64 {
    const correlationId = `${bookId}_${ic.caller().toText()}_${ic.time()}`;
    return hash(correlationId);
};

/*
    after the order is created, we give the `delay` amount of minutes to pay for the order.
    if it's not paid during this timeframe, the order is automatically removed from the pending orders.
*/
function discardByTimeout(memo: nat64, delay: Duration) {
    ic.setTimer(delay, () => {
        const order = pendingPay.remove(memo);
        console.log(`Reserve discarded ${order}`);
    });
};

async function verifyPaymentInternal(receiver: Principal, amount: nat64, block: nat64, memo: nat64): Promise<bool> {
    const blockData = await ic.call(icpCanister.query_blocks, { args: [{ start: block, length: 1n }] });
    const tx = blockData.blocks.find((block) => {
        if ("None" in block.transaction.operation) {
            return false;
        }
        const operation = block.transaction.operation.Some;
        const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
        const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
        return block.transaction.memo === memo &&
            hash(senderAddress) === hash(operation.Transfer?.from) &&
            hash(receiverAddress) === hash(operation.Transfer?.to) &&
            amount === operation.Transfer?.amount.e8s;
    });
    return tx ? true : false;
};