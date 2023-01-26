import styled from "styled-components";

export const Container = styled.button`
  display: flex;
  flex-direction: column;
  background-color: hsla(0, 0%, 100%, 0.24);
  color: #fff;
  width: 272px;
  max-width: 272px;
  min-width: 272px;
  border-radius: 3px;
  padding: 8px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  margin-right: 12px;
  user-select: none;

  &:hover,
  &:focus {
    outline: none;
    background-color: hsla(0, 0%, 100%, 0.32);
  }
`;
