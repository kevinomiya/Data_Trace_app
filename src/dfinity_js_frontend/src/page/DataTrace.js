import React, { useCallback, useEffect, useState } from 'react'
import AddCustomer from '../components/customers/AddCustomer'
import AddService from '../components/services/AddService'
import AddEquipment from '../components/equipments/AddEquipment'
import { toast } from 'react-toastify'
import { Row } from 'react-bootstrap'

import { createCustomer, createEquipment, createService,
   getCustomers as getCustomersList,
    getEquipments as getEquipmentsList,
     getServices as getServiceList,
     sortCustomer as sortCustomerList } from '../utils/dataTrace'
import Customer from '../components/customers/Customer'
import Service from '../components/services/Service'
import Equipment from '../components/equipments/Equipment'
import { NotificationError, NotificationSuccess } from '../components/utils/Notifications'

const DataTrace = () => {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [equipments, setEquipments] = useState([]);


  const [loading, setLoading] = useState(false);
  

  const getCustomers = useCallback( async () => {
    try {
      setLoading(true);
      setCustomers(await getCustomersList());
      console.log(customers)
    } catch (error) {
      console.log({error});
    } finally {
      setLoading(false);
    }
  })

  const getServices = useCallback( async () => {
    try {
      setLoading(true);
      setServices(await getServiceList());
      console.log(services)
    } catch (error) {
      console.log({error});
    } finally {
      setLoading(false);
    }
  })


  const getEquipments = useCallback( async () => {
    try {
      setLoading(true);
      setEquipments(await getEquipmentsList());
      console.log(equipments)
    } catch (error) {
      console.log({error});
    } finally {
      setLoading(false);
    }
  } )


  const addCustomer = async (data) => {
    try {
      setLoading(true);
      createCustomer(data).then(()=>{
        getCustomers();
    })
      toast(<NotificationSuccess text="Customer created successfully." />);
    } catch (error) {
      console.log({error});
      toast(<NotificationError text="Failed to create a Customer." />);
    } finally {
      setLoading(false)
    }
  }


  const addService = async (data) => {
    try {
      setLoading(true);
      data.servicePrice = parseInt(data.servicePrice, 10) * 1000000000;
      createService(data).then(()=>{
        getServices();
    })
      toast(<NotificationSuccess text="Service created successfully." />);
    } catch (error) {
      console.log({error});
      toast(<NotificationError text="Failed to create a Service." />);
    } finally {
      setLoading(false)
    }
  }

  const addEquipment = async (data) => {
    try {
      setLoading(true);
      createEquipment(data).then(()=>{
        getEquipments();
    })
      toast(<NotificationSuccess text="Equipment created successfully." />);
    } catch (error) {
      console.log({error});
      toast(<NotificationError text="Failed to create a Equipment." />);
    } finally {
      setLoading(false)
    }
  }

  const sortCustomer = async () => {
    try {
      setLoading(true);
      setCustomers(await sortCustomerList());
    } catch (error) {
      console.log({error});
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    getCustomers();
    getServices();
    getEquipments();
  } , [])

  return (
    <>
    {/* Header Section */}
    <div className="d-flex justify-content-between">
      <div>
        <button className="btn btn-primary"
        onClick={() => {
          sortCustomer()
        } }
        >
          Sort
        </button>
      </div>
      <div>
        <AddCustomer save={addCustomer} />
        <AddService save={addService} />
        <AddEquipment save={addEquipment} />
      </div>
    </div>


    {/* Customers Section  */}
    <hr />
    <h3>Customers</h3>
    <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5 mt-4">
      {customers.map((_customer, index) => (
        <Customer
          customer={{
            ..._customer,
          }}
          key={index}
        />
      ))} 
    </Row>
    {/* Services  */}
    <hr />
    <h3>Services</h3>
    <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5 mt-4">
      {services.map((_service, index) => (
        <Service
          service={{
            ..._service,
          }}
          key={index}
        />
      ))}

    </Row>



    {/* Equipments */}
    <hr />
    <h3>Equipments</h3>
    <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5 mt-4">
      {equipments.map((_equipment, index) => (
        <Equipment
          equipment={{
            ..._equipment,
          }}
          key={index}
        />
      ))}
    </Row>

    
    </>
  )
}

export default DataTrace