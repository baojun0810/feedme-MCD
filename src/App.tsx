import React, { useEffect, useRef, useState } from 'react';
import Logo from "./static/logo.png"

type OrderType = {
  id: number,
  type: "NORMAL" | "VIP",
  status: "PENDING" | "PROCESSING" | "COMPLETED"
}

type BotType = {
  id: number,
  status: "IDLE" | "BUSY",
  processId?: number,
  timeout?: NodeJS.Timeout
}

function App() {

  const [bots, setBots] = useState<BotType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([])
  const orderId = useRef(1);
  const botId = useRef(1);

  const handleOrder = (type: "NORMAL" | "VIP") => {

    

    setOrders(prev => {

      //if normal order, can just insert to the last
      if(type === "NORMAL")
        return [...prev, {id: orderId.current, type, status: "PENDING"}]
      //else, we need to insert the VIP order before the first normal order
      else {

        //find the index of first normal order
        const index = orders.findIndex(data => data.type === "NORMAL");

        if(orders.length === 0 || index === -1)
          return [...orders, {id: orderId.current, type, status: "PENDING"}];
        else {
          
          const updatedOrders: OrderType[] = [
            ...orders.slice(0, index),
            {id: orderId.current, type, status: "PENDING"},
            ...orders.slice(index)
          ]
          return updatedOrders; 
        }
      }
    })
    
    //id increase to ensure uniqueness
    orderId.current++;
  }

  const addBot = () => {
    
    setBots([...bots, {id: botId.current, status: "IDLE"}])
    botId.current++;
  }

  const deleteBot = () => {
    const removeBot = bots[bots.length - 1];
    setBots(bots.slice(0, -1));

    //here is to clear the timeout to terminate the setTimeout and also reset the order status
    if(removeBot.status === 'BUSY') {
      clearTimeout(removeBot.timeout)
      setOrders(prev => prev.map(data => data.id === removeBot.processId ? {...data, status: "PENDING"} : data))
    }
  }

  useEffect(() => {

    const process = (id: number) => {

      //get the order
      const order = orders.find(data => data.status === "PENDING");
  
      if(!order) {
        console.log("no order")
        return;
      }
  
      //simulate order scenario
      const timeout = setTimeout(() => {
        setBots(prev =>
          prev.map(data =>
            data.id === id ? { ...data, status: "IDLE" } : data
          )
        );
        setOrders(prev => prev.map(data => data.id === order.id ? {...data, status: "COMPLETED"} : data))
      }, 10000)
      
      setBots(prev =>
        prev.map(data =>
          data.id === id ? { ...data, status: "BUSY", processId: order.id, timeout: timeout } : data
        )
      );
  
      setOrders(prev => prev.map(data => data.id === order.id ? {...data, status: "PROCESSING"} : data));
    }

    //if dont have pending order and idle bot, then return
    if(bots.filter(data => data.status === "IDLE").length === 0 || orders.filter(data => data.status === "PENDING").length === 0)
      return;

    const availableBot = bots.find(data => data.status === "IDLE");

    if(!availableBot) {
      console.log("no bot")
      return;
    }

    process(availableBot.id)

  }, [bots, orders])

  return (
    <div className="App">
      <header className='w-full py-3 px-8 flex items-center shadow-xl'>
        <img src={Logo} className='w-8 h-8 mr-4' alt='logo'/>
        <h1 className='font-bold text-lg'>McDonald's</h1>
      </header>
      <main>
        <div className='w-full max-w-[1024px] mx-auto flex px-8 py-12 gap-[4%]'>
          <div className='w-[48%]'>
            <h2 className='text-center text-xl font-bold mb-4'>Order</h2>
            <div className='flex py-4 justify-center mb-6'>
              <button className='bg-yellow-400 py-2 px-4 rounded-lg font-bold mr-6' onClick={()=> handleOrder("NORMAL")}>Normal Order</button>
              <button className='bg-yellow-400 py-2 px-4 rounded-lg font-bold' onClick={()=> handleOrder("VIP")}>VIP order</button>
            </div>
            <div className='mb-6'>
              <h3 className='mb-4 font-semibold text-lg'>Pending Orders</h3> 
              <div className='h-[250px] outline outline-1 px-4 overflow-auto w-full'>
                <table className='w-full'>
                  <thead className='font-bold'>
                    <th className='w-[10%] py-4'>Order</th>
                    <th>Type</th>
                    <th>Status</th>
                  </thead>
                  <tbody>
                    {
                      orders.filter(data => data.status === "PENDING" || data.status === "PROCESSING").map((data) => (
                        <tr key={data.id}>
                          <td className='text-center py-2'>{data.id}</td>  
                          <td className='text-center py-2'>{data.type}</td>
                          <td className='text-center py-2'>{data.status}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className='mb-4 font-semibold text-lg'>Completed Orders</h3> 
              <div className='h-[250px] outline outline-1 px-4 overflow-auto w-full'>
                <table className='w-full'>
                  <thead className='font-bold'>
                    <th className='w-[10%] py-4'>Order</th>
                    <th>Type</th>
                    <th>Status</th>
                  </thead>
                  <tbody>
                    {
                       orders.filter(data => data.status === "COMPLETED").map((data) => (
                        <tr key={data.id}>
                          <td className='text-center py-2'>{data.id}</td>  
                          <td className='text-center py-2'>{data.type}</td>
                          <td className='text-center py-2'>{data.status}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='w-[48%]'>
            <h2 className='text-center text-xl font-bold mb-4'>Cooking Bots</h2>
            <div className='flex py-4 justify-center mb-6'>
              <button className='bg-yellow-400 py-2 px-4 rounded-lg font-bold mr-6' onClick={() => addBot()}>+ Bot</button>
              <button className='bg-yellow-400 py-2 px-4 rounded-lg font-bold' onClick={() => deleteBot()}>- Bot</button>
            </div>
            <div className='mb-6'>
              <h3 className='mb-4 font-semibold text-lg'>Bots</h3> 
              <div className='h-[250px] outline outline-1 px-4 overflow-auto w-full'>
                <table className='w-full'>
                  <thead className='font-bold'>
                    <th className='w-[10%] py-4'>Bot</th>
                    <th>Status</th>
                  </thead>
                  <tbody>
                    {
                       bots.map((data) => (
                        <tr key={data.id}>
                          <td className='text-center py-2'>{data.id}</td>  
                          <td className='text-center py-2'>{data.status === "BUSY" ? `Processing Order ${data.processId}` : "IDLE"}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
