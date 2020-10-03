import React, {useRef, useEffect } from "react";

import PissApp from './piss-app';

const App = () => {
    const appElm = useRef(null);
    useEffect(() => {
        const pissApp = new PissApp(appElm.current);
        pissApp.init();
    })

    return (
        <div ref={appElm} className="app"></div>
    )
}

export default App;