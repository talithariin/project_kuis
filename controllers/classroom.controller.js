import Classroom from "../models/Classroom.js";
import generateJoinCode from "../services/join_code.js";
import User from "../models/User.js";

export const create = async (req, res, next) => {
  try {
    const newClassroom = {
      name: req.body.name,
      join_code: generateJoinCode(),
      owner_id: req.userId,
    };

    const classroomData = await Classroom.create(newClassroom);

    res.send({ join_code: classroomData.join_code });
  } catch (error) {
    console.log(error);
    next(new Error("Internal_Server_Error"));
  }
};

export const findAll = async (req, res, next) => {
  try {
    const classrooms = await Classroom.getAll();
    const classroomsStudentsOwner = await Promise.all(
      classrooms.map(async (classroom) => {
        let studentIds = null;

        if (
          classroom.student_id !== null &&
          classroom.student_id !== undefined
        ) {
          studentIds = classroom.student_id;
        }

        const students =
          studentIds !== null
            ? await Promise.all(
                studentIds.map(async (studentId) => {
                  try {
                    const student = await User.findById(studentId);
                    return student
                      ? student
                      : { id: studentId, message: "not found" };
                  } catch (error) {
                    console.log(
                      `Error fetching user with ID ${studentId}:`,
                      error
                    );
                    return { id: studentId, message: "not found" };
                  }
                })
              )
            : [];

        const owner = await User.findById(classroom.owner_id);

        return {
          id: classroom.id,
          name: classroom.name,
          join_code: classroom.join_code,
          owner_id: classroom.owner_id,
          owner,
          student_id: classroom.student_id,
          students,
        };
      })
    );

    res.send(classroomsStudentsOwner);
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const findOne = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return next({
        status: 404,
        message: `Not found classroom with id : ${req.params.id}`,
      });
    }

    let studentIds = null;
    if (classroom.student_id !== null && classroom.student_id !== undefined) {
      studentIds = classroom.student_id;
    }

    const students =
      studentIds !== null
        ? await Promise.all(
            studentIds.map(async (studentId) => {
              try {
                const student = await User.findById(studentId);
                return student
                  ? student
                  : { id: studentId, message: "not found" };
              } catch (error) {
                console.log(`Error fetching user with ID ${studentId}:`, error);
                return { id: studentId, message: "not found" };
              }
            })
          )
        : [];

    const owner = await User.findById(classroom.owner_id);

    const classroomExpanded = {
      id: classroom.id,
      name: classroom.name,
      join_code: classroom.join_code,
      owner_id: classroom.owner_id,
      owner,
      student_id: classroom.student_id,
      students,
    };

    res.send(classroomExpanded);
  } catch (error) {
    console.log("Error:", error);
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found user with id : ${req.params.id}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export const findByUserId = async (req, res, next) => {
  try {
    const user_id = req.userId;
    const data = await Classroom.findByUserId(user_id);
    res.send(data);
  } catch (error) {
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found classroom with user id : ${req.userId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export const update = async (req, res, next) => {
  const userId = req.userId;
  const classroomId = req.params.classroomId;

  try {
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(404).send({
        message: `Not found classroom with id : ${classroomId}`,
      });
    }

    const ownerId = classroom.owner_id;

    if (userId !== ownerId) {
      return next(new Error("Update_Classroom_Permission"));
    }

    const updatedClassroomData = {
      name: req.body.name,
    };

    const updateResult = await Classroom.update(
      classroomId,
      updatedClassroomData
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).send({
        message: `Not found classroom with id : ${classroomId}`,
      });
    }

    res.send({ id: classroomId, data: updatedClassroomData });
  } catch (error) {
    console.log("Error:", error.type);
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found user with id : ${req.params.id}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export const destroy = async (req, res, next) => {
  const userId = req.userId;
  const classroomId = req.params.classroomId;

  try {
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(404).send({
        message: `Not found classroom with id : ${classroomId}`,
      });
    }

    const ownerId = classroom.owner_id;

    if (userId !== ownerId) {
      return next(new Error("Delete_Classroom_Permission"));
    }

    const deleteResult = await Classroom.delete(classroomId);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).send({
        message: `Not found classroom with id : ${classroomId}`,
      });
    }
    res.send({ msg: "Success delete classroom" });
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const join = async (req, res, next) => {
  const { join_code } = req.body;
  const user_id = req.userId;

  try {
    if (!join_code || !user_id) {
      throw new Error("JoinCode_And_UserID_Required");
    }

    const result = await Classroom.join(join_code, user_id);

    if (result.success === false) {
      if (
        result.message === "Invalid_Join_Code" ||
        result.message === "User_Already_Joined_Classroom" ||
        result.message === "Invalid_Format_StudentID" ||
        result.message === "Owner_Cannot_Join"
      ) {
        return next(new Error(result.message));
      } else {
        throw new Error("Internal_Server_Error");
      }
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};
