import Classroom from "../models/Classroom.js";
import generateJoinCode from "../services/join_code.js";
import User from "../models/User.js";

export const create = (req, res, next) => {
  const newClassroom = new Classroom({
    name: req.body.name,
    join_code: generateJoinCode(),
    owner_id: req.userId,
  });

  Classroom.create(newClassroom, (err, data) => {
    if (err) {
      console.log(err);
      return next(new Error("Internal_Server_Error"));
    }
    res.send({ join_code: newClassroom.join_code });
  });
};

export const findAll = async (req, res, next) => {
  try {
    Classroom.getAll(async (err, classrooms) => {
      if (err) {
        console.log(err);
        return next(new Error("Internal_Server_Error"));
      }

      // memisahkan student_id menjadi int tunggal
      const classroomsStudentsOwner = await Promise.all(
        classrooms.map(async (classroom) => {
          // Pengecekan apakah student_id tidak null
          const studentIds = classroom.student_id
            ? JSON.parse(classroom.student_id)
            : [];

          // get data student jika student_id tidak null
          const students =
            studentIds.length > 0
              ? await Promise.all(
                  studentIds.map(async (studentId) => {
                    try {
                      const student = await new Promise((resolve, reject) => {
                        User.findById(studentId, (err, user) => {
                          if (err) {
                            reject(err);
                          } else {
                            resolve(user);
                          }
                        });
                      });
                      return student
                        ? student
                        : { id: studentId, message: "not found" };
                    } catch (error) {
                      console.log(
                        `Error fetching user with ID ${studentId}:`,
                        error
                      );
                      // return next(new Error("Internal_Server_Error"));
                      return { id: studentId, message: "not found" }; // tidak lanjutkan ke error handler, tapi tambahkan objek dengan pesan
                    }
                  })
                )
              : [];

          // get data owner
          const owner = await new Promise((resolve, reject) => {
            User.findById(classroom.owner_id, (err, user) => {
              if (err) {
                reject(err);
              } else {
                resolve(user);
              }
            });
          });
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
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const findOne = async (req, res, next) => {
  try {
    Classroom.findById(req.params.id, async (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          res.status(404).send({
            message: `Not found classroom with id : ${req.params.id}`,
          });
        } else {
          return next(new Error("Internal_Server_Error"));
        }
      } else {
        // Pengecekan apakah student_id tidak null
        const studentIds = data.student_id ? JSON.parse(data.student_id) : [];

        // get data student jika student_id tidak null
        const students =
          studentIds.length > 0
            ? await Promise.all(
                studentIds.map(async (studentId) => {
                  try {
                    const student = await new Promise((resolve, reject) => {
                      User.findById(studentId, (err, user) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(user);
                        }
                      });
                    });
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

        // get data owner
        const owner = await new Promise((resolve, reject) => {
          User.findById(data.owner_id, (err, user) => {
            if (err) {
              reject(err);
            } else {
              resolve(user);
            }
          });
        });

        const classroomExpanded = {
          id: data.id,
          name: data.name,
          join_code: data.join_code,
          owner_id: data.owner_id,
          owner,
          student_id: data.student_id,
          students,
        };

        res.send(classroomExpanded);
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const update = (req, res, next) => {
  const classroomData = new Classroom(req.body);
  Classroom.update(req.params.id, classroomData, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found classroom with id : ${req.params.id}`,
        });
      } else {
        return next(new Error("Internal_Server_Error"));
      }
    } else {
      res.send(data);
    }
  });
};

export const destroy = (req, res, next) => {
  Classroom.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found classroom with id : ${req.params.id}`,
        });
      } else {
        return next(new Error("Internal_Server_Error"));
      }
    } else {
      res.send({ msg: "Success delete classroom" });
    }
  });
};

export const join = (req, res, next) => {
  const { join_code } = req.body;
  const user_id = req.userId;

  if (!join_code || !user_id) {
    return res
      .status(400)
      .send({ message: "Join code and user ID are required." });
  }

  Classroom.join(join_code, user_id, (err, data) => {
    if (err) {
      if (err.type === "invalid_join_code") {
        console.log(join_code);
        console.log(user_id);
        return res.status(400).send({ message: "Invalid join code" });
      } else if (err.type === "user_already_joined") {
        return res
          .status(400)
          .send({ message: "User already joined this classroom." });
      } else if (err.type === "invalid_student_id_format") {
        return res
          .status(500)
          .send({ message: "Invalid format for student IDs" });
      } else {
        console.log(err);
        return next(new Error("Error_Disini_Woy"));
      }
    } else {
      res.send(data);
    }
  });
};
