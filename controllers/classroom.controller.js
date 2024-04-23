import Classroom from "../models/Classroom.js";
import generateJoinCode from "../services/join_code.js";
import User from "../models/User.js";

export const create = (req, res) => {
  const newClassroom = new Classroom({
    name: req.body.name,
    join_code: generateJoinCode(),
    owner_id: req.userId,
  });

  Classroom.create(newClassroom, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Exist some error" });
    }
    res.send({ join_code: newClassroom.join_code });
  });
};

export const findAll = async (req, res) => {
  try {
    Classroom.getAll(async (err, classrooms) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Exist some error" });
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
                      return student;
                    } catch (error) {
                      console.log(
                        `Error fetching user with ID ${studentId}:`,
                        error
                      );
                      return null;
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
    res.status(500).send({ msg: "Exist some error" });
  }
};
