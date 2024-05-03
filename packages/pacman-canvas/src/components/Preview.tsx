import React from 'react';
import {PacmanCanvas} from '../../lib/components/PacmanCanvas/PacmanCanvas';
import Logger from 'js-logger';


const Preview = () => {

  const [debug, setDebug] = React.useState(false);
  const [showDirectionControls, setShowDirectionControls] = React.useState(true);

  const toggleDebug = () => { 
    Logger.setLevel(debug ? Logger.ERROR : Logger.DEBUG);
    setDebug(!debug);
  };

  return <>
  <div style={{textAlign: "center"}}>
  <h1>Pacman Canvas Preview</h1>
  <button onClick={() => toggleDebug()}>Toggle Debug</button> (debug: {debug.toString()})
  <button onClick={() => setShowDirectionControls(!showDirectionControls)}>Toggle Direction Controls</button> (show: {showDirectionControls.toString()})
  </div>
  <PacmanCanvas debug={debug} showDirectionControls={showDirectionControls}/>
  </>;
}

export default Preview;