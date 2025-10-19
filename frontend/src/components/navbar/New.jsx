import React from 'react'
import { useState } from "react";

const New = () => {
    const [count, setCount] = useState(0);

  return (
    <div>
        <h1>Counter</h1>
        <h1>{count}</h1>
        <button onClick={()=>setCount(count+1)}>Add</button>
    </div>
  )
}

export default New