import { styled } from "@mui/material/styles";
import { Box, Card } from "@mui/material";

export const ReflectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 10,
  padding: 10,
  cursor: "pointer",
  backgroundColor: "#26248F",
  color: "white",
  lineHeight: 1.5,
}));

export const ModalBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#26248F",
  color: "white",
  padding: 10,
  borderRadius: 10,
  outline: "none",
}));

export const ModalArrowBox = styled(Box)(({ theme }) => ({
  margin: "auto",
  width: 20,
  cursor: "pointer",
}));

export const ModalContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: 10,
}));
