function Loader({ size = "loading-lg", fullScreen = true }) {
  return (
    <div
      className={`flex justify-center items-center ${
        fullScreen ? "min-h-screen" : "py-8"
      }`}
    >
      <span className={`loading loading-spinner ${size}`}></span>
    </div>
  );
}

export default Loader;