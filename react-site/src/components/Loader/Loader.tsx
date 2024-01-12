import "./Loader.scss";
import { useAppSelector } from "../../hooks/redux";
import { Box } from "@mui/material";

const Loader = () => {
  const loaderImg = useAppSelector((state) => state.imagesInfo.loader_img);
  return (
    <>
      <Box
        sx={{
          color: "white",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(50px)",
          WebkitBackdropFilter: "blur(50px)",
          overflow: "hidden",
        }}
      >
        <img
          src={loaderImg}
          alt=""
          style={{
            height: "450px",
            width: "450px",
          }}
        />
      </Box>
    </>
  );
};

export default Loader;
