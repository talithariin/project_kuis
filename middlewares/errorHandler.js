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
    case "Answer_Already_Exist":
      statusCode = 400;
      message = "Answer already exist";
      break;
    case "JoinCode_And_UserID_Required":
      statusCode = 400;
      message = "Join code and user ID are required";
      break;
    case "Invalid_Join_Code":
      statusCode = 400;
      message = "Invalid join code";
      break;
    case "User_Already_Joined_Classroom":
      statusCode = 400;
      message = "User already joined this classroom";
      break;
    case "Owner_Cannot_Join":
      statusCode = 400;
      message = "Owner cannot join their classroom";
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
    case "Update_Classroom_Permission":
      statusCode = 403;
      message = "You do not have permission to update & delete this class";
      break;
    case "Update_Question_Permission":
      statusCode = 403;
      message = "You do not have permission to update & delete this question";
      break;
    case "Create_Quiz_Permission":
      statusCode = 403;
      message = "You do not have permission to create a quiz in this class";
      break;
    case "Update_Quiz_Permission":
      statusCode = 403;
      message = "You do not have permission to update & delete this quiz";
      break;
    case "Unauthorized_Access":
      statusCode = 403;
      message = "Unauthorized access role";
      break;
    case "User_Not_Registered":
      statusCode = 404;
      message = "User not registered";
      break;
    case "Result_Not_Found":
      statusCode = 404;
      message = "Result data not found";
      break;
    case "User_Not_Found":
      statusCode = 404;
      message = "User not found";
      break;
    case "Question_Not_Found":
      statusCode = 404;
      message = "Question not found";
      break;
    case "Quiz_Not_Found":
      statusCode = 404;
      message = "Quiz not found";
      break;
    case "No_Fields_To_Update":
      statusCode = 404;
      message = "No fields to update";
      break;
    case "Invalid_Format_StudentID":
      statusCode = 500;
      message = "Invalid format for student IDs";
      break;
    case "Error_Fetching_Classroom":
      statusCode = 500;
      message = "Error fetching classroom data";
      break;
    case "Error_Save_Result":
      statusCode = 500;
      message = "Error saving result";
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
