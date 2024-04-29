import Classroom from "../models/Classroom.js";

const classroomAccess = async (req, res, next) => {
  const user_id = req.userId;
  const classroom_id = req.params.classroomId;
  try {
    Classroom.findById(classroom_id, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          return res.status(404).send({
            message: `Not found classroom with id : ${req.params.classroomId}`,
          });
        } else {
          return res.status(500).send({ msg: "Exist some error" });
        }
      }

      const studentId = data.student_id ? JSON.parse(data.student_id) : [];
      const ownerId = data.owner_id;
      if (user_id === ownerId || studentId.includes(user_id)) {
        next();
      } else {
        return res.status(403).send({
          message: "You do not have access to this class",
        });
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send({ msg: "Exist some error" });
  }
};

export default classroomAccess;
