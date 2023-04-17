import { createContext, createSignal, ParentComponent, useContext } from "solid-js";
import type { JSX, Accessor, Setter } from "solid-js";

export type PopUpContextType = {
    component: Accessor<JSX.Element>
    setCompent: Setter<JSX.Element>
    visible: Accessor<boolean>
    setVisible: Setter<boolean>
}

export const PopUpContext = createContext<PopUpContextType>(undefined!);

export const PopUpProvider: ParentComponent<{}> = (props) => {
    const [component, setCompent] = createSignal(<></>)
    const [visible, setVisible] = createSignal(false)
    const value: PopUpContextType = {
        component: component,
        setCompent: setCompent,
        visible: visible,
        setVisible: setVisible,
    }
     return (
      <PopUpContext.Provider value={value}>
        {props.children}
      </PopUpContext.Provider>
    );
}

export const usePopUp = () => useContext(PopUpContext);