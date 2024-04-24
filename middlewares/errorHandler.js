const errorHandler = (err, req, res, next) => {
  let statusCode;
  let message;
  console.log(err.message);
  switch (err.message) {
    case "Error_Disini_Woy":
      statusCode = 404;
      message = "Error disini woy";
      break;
    case "Username_Already_Exist":
      statusCode = 400;
      message = "Username already exist";
      break;
    case "Missing_Token":
      statusCode = 401;
      message = "Missing access token";
      break;
    case "Invalid_Password":
      statusCode = 401;
      message = "Invalid password";
      break;
    case "Invalid_Token":
      statusCode = 403;
      message = "Invalid token";
      break;
    case "Unauthorized_Access":
      statusCode = 403;
      message = "Unauthorized access role";
      break;
    case "User_Not_Registered":
      statusCode = 404;
      message = "User not registered";
      break;
    case "Not_Found_User_Id":
      statusCode = 404;
      message = `Not found user with id : ${err.params}`;
      break;
    case "User_Not_Found":
      statusCode = 404;
      message = "User not found";
      break;
    case "No_Fields_To_Update":
      statusCode = 404;
      message = "No fields to update";
      break;
    default:
      statusCode = 500;
      message = "Internal server error";
      break;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
