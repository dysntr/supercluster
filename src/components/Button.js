import styled from "styled-components";

const StyledButton = styled.button`
  font-family: 'Inter', sans-serif;
  align-items: center;
  padding: 8px 16px;
  background: #4F87F6;
  border-radius: 24px;
  color: white;
  border: none;
  font-weight: 500;
  font-size: 20px;
`

export default function Button(props) {
  return (
    <StyledButton onClick={props.onClick}>{props.children}</StyledButton>
  )
}