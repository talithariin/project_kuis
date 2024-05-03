import Classroom from "../models/Classroom.js";

const classroomAccess = async (req, res, next) => {
  try {
    const user_id = req.userId;
    const classroom_id = req.params.classroomId;

    const classroom = await Classroom.findById(classroom_id);
    let studentIds = null;

    const ownerId = classroom.owner_id;
    if (classroom.student_id !== null && classroom.student_id !== undefined) {
      studentIds = classroom.student_id;
    }

    if (user_id === ownerId || studentIds.includes(user_id)) {
      req.classroom = classroom;
      next();
    } else {
      return next(new Error("Classroom_Permission"));
    }
  } catch (error) {
    console.log("Error:", error);
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found classroom with id : ${req.params.classroomId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export default classroomAccess;
