import * as React from 'react';
import {PowerGrid} from "./powerGrid";

export default function App(){
  const data = {
      hello: 'Hello'
  };

  return (
    <div>
      <PowerGrid data={data}/>
    </div>)
}
