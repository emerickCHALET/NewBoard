import styled from "styled-components";

interface InputProps {
  readonly isEditing: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ebecf0;
  width: 272px;
  max-width: 272px;
  min-width: 272px;
  max-height: 100%;
  border-radius: 3px;
  padding: 0 4px 8px;
  margin-right: 12px;
`;

export const CardList = styled.div`
  min-height: 1px;
  height: 100%;
  overflow-y: auto;
  padding: 4px 4px 0 4px;
  margin-bottom: 4px;

  ::-webkit-scrollbar {
    width: 4px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: #dadbe2;
    border-radius: 5px;
    margin: 0 12px;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #bfc3cd;
    border-radius: 5px;
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #bfc3cd;
  }
`;

export const Button = styled.button`
  color: #5e6c84;
  background-color: transparent;
  border-radius: 3px;
  padding: 8px;
  margin: 0 4px;
  font-size: 14px;
  cursor: pointer;

  &:hover,
  &:focus {
    outline: none;
    background-color: rgba(9, 30, 66, 0.08);
    color: #172b4d;
  }
`;

export const Header = styled.div`
  padding: 8px 4px;
  position: relative;
`;

export const Title = styled.h2`
  display: none;
  text-align: start;
  color: #172b4d;
  font-size: 14px;
  line-height: 14px;
  font-weight: 600;
  min-height: 20px;
  padding: 8px;
  margin: 0;
`;

export const Input = styled.textarea<InputProps>`
  font-family: sans-serif;
  width: 100%;
  color: #172b4d;
  background: ${({ isEditing }) => (isEditing ? "#fff" : "transparent")};
  border: none;
  border-radius: 3px;
  box-shadow: ${({ isEditing }) =>
    isEditing ? "inset 0 0 0 2px #0079bf" : "none"};
  resize: none;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  min-height: 20px;
  padding: 4px 8px;
  margin: 0;
  display: block;
  transition: all 0.1s linear;

  &:focus {
    outline: none;
  }
`;

export const EditTitleButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 4px;
`;
