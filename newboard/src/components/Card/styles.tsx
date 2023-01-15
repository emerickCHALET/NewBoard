import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 60px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  margin-bottom: 8px;
  padding: 6px 8px;
  overflow: hidden;
`;

export const Title = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: start;
  word-break: break-all;
`;

export const Input = styled.textarea`
  font-family: sans-serif;
  width: 100%;
  background: #fff;
  border: none;
  border-radius: 3px;
  resize: none;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  min-height: 20px;
  display: block;

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
`;
