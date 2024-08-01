module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      message: err.message,
      errorIn: err.stack,
    });
  }
  if (process.env.NODE_ENV === "Production") {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }
};
