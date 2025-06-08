import React from "react";
import {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Cancel,
} from "@radix-ui/react-alert-dialog";
import PropTypes from "prop-types";
import "./alert-dialog.css";
import {Button} from "./button.js";

const AlertDialogC = ({children, title, description}) => {
  // return (<>{children}</>)
  
  return (
    <Root>
      <Trigger asChild>
        <button>{children}</button>
      </Trigger>
      <Portal>
        <Overlay className="alert-dialog-overlay"/>
        <Content className="alert-dialog-content bg-slate-900 border border-white/25">
          <Title className="alert-dialog-title">
            <h2 className={"text-[1.55rem] font-medium text-white"}>{title}</h2>
          </Title>
          <Description className="alert-dialog-description my-5">
            <p className="text text-slate-300">{description}</p>
          </Description>
          <div style={{display: "flex", gap: 25, justifyContent: "flex-end"}}>
            <Cancel asChild>
              <Button className={"py-1 text text-primary bg-white hover:bg-gray-300 focus:bg-gray-300"}>Fechar</Button>
            </Cancel>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

AlertDialogC.propTypes = {
  children: PropTypes.string | PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default AlertDialogC;
