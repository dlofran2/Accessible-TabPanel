import React from 'react';
import TabPanel, { TabList, Tab, Panels, Panel } from './TabPanel';
import './App.css';

const App = () => (
  <div className='app'>
    <TabPanel>
      <TabList ariaLabel="Types of coffee">
        <Tab ariaControls={'dripCoffeeTab'} ariaLabelledbyId={'drip coffee'}>Drip Coffee</Tab>
        <Tab ariaControls={'latteTab'} ariaLabelledbyId={'latte'}>Latte</Tab>
        <Tab ariaControls={'espressoTab'} ariaLabelledbyId={'espresso'}>Espresso</Tab>
      </TabList>
      <Panels>
        <Panel controlsId={'dripCoffeeTab'} ariaLabelledby={'drip coffee'}>
          <p>This is the drip coffee panel</p>
          <a href="https://www.google.com">To google</a>
        </Panel>
        <Panel controlsId={'latteTab'} ariaLabelledby={'latte'}>This is the latte panel</Panel>
        <Panel controlsId={'espressoTab'} ariaLabelledby={'espresso'}>This is the espresso panel</Panel>
      </Panels>
    </TabPanel>
  </div >
);

export default App;
