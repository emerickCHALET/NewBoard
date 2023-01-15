import React from "react";

import { Container } from "./styles";

interface Props {
  onClick: () => void;
}

const AddColumnButton: React.FC<Props> = ({ onClick }) => {
  return <Container onClick={onClick}>Adicionar outra lista</Container>;
};

export default AddColumnButton;
