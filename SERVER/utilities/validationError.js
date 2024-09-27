const HandleValidationError = (error, res) => {
  if (error.name === "SequelizeValidationError") {
    const errorMessages = error.errors.map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return res.status(400).json({
      error_message: "Validation failed.",
      errors: errorMessages,
    });
  }

  console.log(error);
  return res.status(500).json({ error_message: "Internal server error." });
};

module.exports = {HandleValidationError}