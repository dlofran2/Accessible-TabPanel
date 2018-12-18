// Accessibility documentation: https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './TabPanel.css';

/** TAB PANEL
 * @param  {React.Children} {children} Can consist of <TabList>, <Tab>, <Panels> and <Panel>
 * @example 
 * <TabPanel>
 *  <TabList ariaLabel="Types of coffee">
 *    <Tab ariaControls={'dripCoffeeTab'} ariaLabelledbyId={'drip coffee'}>Drip Coffee</Tab>
 *    <Tab ariaControls={'latteTab'} ariaLabelledbyId={'latte'}>Latte</Tab>
 *    <Tab ariaControls={'espressoTab'} ariaLabelledbyId={'espresso'}>Espresso</Tab>
 *  </TabList>
 *  <Panels>
 *    <Panel controlsId={'dripCoffeeTab'} ariaLabelledby={'drip coffee'}>This is the drip coffee panel</Panel>
 *    <Panel controlsId={'latteTab'} ariaLabelledby={'latte'}>This is the latte panel</Panel>
 *    <Panel controlsId={'espressoTab'} ariaLabelledby={'espresso'}>This is the espresso panel</Panel>
 *  </Panels>
 * </TabPanel>
 */
const TabPanel = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);
    const tabFocus = useRef();

    useEffect(() => {
        tabFocus.current.focus();
    });

    /**
     * @param  {Effect} e Used to determine last key pressed
     * @description When left/right key is pressed, set the active tab one to the left/right with cycling.
     * When the home/end key is pressed, set the active tab to the first/last tab.
     * @summary Handles left arrow, right arrow, home, and end keys.
     */
    const handleKeyPress = (e) => {
        const tabListLength = children[0].props.children.length;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (activeTab !== 0)
                setActiveTab(activeTab - 1);
            else
                setActiveTab(tabListLength - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (activeTab !== tabListLength - 1)
                setActiveTab(activeTab + 1);
            else
                setActiveTab(0);
        } else if (e.key === 'Home') {
            e.preventDefault();
            setActiveTab(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            setActiveTab(tabListLength - 1);
        }
    }

    const child = React.Children.map(children, (child, index) => {
        return React.cloneElement(child,
            {
                activeTab,
                onSelectTab: (idx) => setActiveTab(idx),
                handleKeyPress: (idx) => handleKeyPress(idx),
                tabFocus,
            });
    });

    return (<div>{child}</div>);
};

TabPanel.PropTypes = {
    children: PropTypes.element.isRequired,
}

export default TabPanel;



/** TAB LIST
 * @param  {React.Children} {children} Can consist of <Tab> elements
 * @param  {number} {activeTab} The index of the currently selected tab
 * @param  {func} {onSelectTab} Used to select a new tab
 * @param  {func} {handleKeyPress} Used to handle left and right arrows, as well as home and end
 * @param  {string} {ariaLabel} Label describing the TabPanel components purpose
 * @param  {ref} {tabFocus} Reference to currently selected tabs DOM node 
 */
export const TabList = ({ children, activeTab, onSelectTab, handleKeyPress, ariaLabel, tabFocus }) => {
    console.log(tabFocus);
    const child = React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
            active: index === activeTab,
            onSelectTab: () => onSelectTab(index),
            handleKeyPress,
            tabFocus,
        });
    });

    return (<div role={'tablist'} aria-label={ariaLabel} className={'tabList'}>{child}</div>);
}

TabList.PropTypes = {
    children: PropTypes.element.isRequired,
    activeTab: PropTypes.number.isRequired,
    onSelectTab: PropTypes.func.isRequired,
    handleKeyPress: PropTypes.func.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    tabFocus: PropTypes.shape({
        current: PropTypes.string.isRequired,
    }).isRequired,
}



/** TAB
 * @param  {React.Children} {children} Can be any HTML element
 * @param  {boolean} {active} Represents if the current tab is active
 * @param  {func} {onSelectTab} Used to select a new tab
 * @param  {func} {handleKeyPress} Used to handle left and right arrows, as well as home and end keys
 * @param  {ref} {tabFocus} Reference to currently selected tabs DOM node 
 * @param  {IDREF (string)} {ariaControls} Must match controlsId in corresponding Panel component
 * @param  {IDREF (string)} {ariaLabelledbyId} ID that must match ariaLabelledby in corresponding Panel component
 */
export const Tab = ({ children, active, onSelectTab, handleKeyPress, tabFocus, ariaControls, ariaLabelledbyId }) => {
    const css = classNames(
        'tab', { 'activeTab': active }
    );

    return (
        <button
            role={'tab'}
            aria-selected={active}
            aria-controls={ariaControls}
            id={ariaLabelledbyId}
            tabIndex={active ? 0 : -1}
            className={css}
            ref={active ? tabFocus : null}
            onClick={onSelectTab}
            onKeyDown={handleKeyPress}
        >
            {children}
        </button>
    )
}

Tab.PropTypes = {
    children: PropTypes.element.isRequired,
    active: PropTypes.bool.isRequired,
    onSelectTab: PropTypes.func.isRequired,
    handleKeyPress: PropTypes.func.isRequired,
    tabFocus: PropTypes.shape({
        current: PropTypes.string.isRequired,
    }).isRequired,
    ariaControls: PropTypes.string.isRequired,
    ariaLabelledbyId: PropTypes.string.isRequired,
};



/** PANELS
 * @param  {React.Children} {children} Can consist of only <Panel> elements
 * @param  {number} {activeTab} The index of the currently selected tab
 */
export const Panels = ({ children, activeTab }) => {
    return (<>{children[activeTab]}</>);
}

Panels.PropTypes = {
    children: PropTypes.element.isRequired,
    activeTab: PropTypes.number.isRequired,
};



/** PANEL
 * @param  {React.Children} {children} Can be any HTML element
 * @param  {IDREF (string)} {controlsId} ID that must match ariaControls in corresponding <Tab> component
 * @param  {IDREF (string)} {ariaLabelledby} Must match ariaLabelledId in corresponding <Tab> component
 */
export const Panel = ({ children, controlsId, ariaLabelledby }) => (
    <div
        role={'tabpanel'}
        aria-labelledby={ariaLabelledby}
        id={controlsId}
        tabIndex={'0'}
        className={'panel'}
    >
        {children}
    </div>
);

Panel.PropTypes = {
    children: PropTypes.element.isRequired,
    controlsId: PropTypes.string.isRequired,
    ariaLabelledby: PropTypes.string.isRequired,
}