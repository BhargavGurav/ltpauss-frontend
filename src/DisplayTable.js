import React,{useEffect,useState} from 'react';
  async function fetchData(){
    const response=await fetch('/api/data');
    const data=await response.json();
    return data;
  }


  const DataTable=()=>{
    const [data,setData]=useState([]);
    const [currentTime,setCurrentTime]=useState(new Date());
     useEffect(()=>{
        const interval=setInterval(()=>{
            setCurrentTime(new Date());
        },1000);

        return()=>clearInterval(interval);
     },[]);

    useEffect(()=>{
        fetchData().then((responseData)=>{
            const LimitedData=responseData.slice(0,20);
            setData(LimitedData);
        });
    },[]);

    return(
        <div>
            <h1>Data Table</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item)=>{
                        <tr key={item.id}>
                            <td>{currentTime.toLocaleString()}</td>
                            <td>{item.time}</td>
                            <td>{item.data}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );


  };

  export default DataTable;