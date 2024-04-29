import Result from "../models/Result.js";
import { calculateScore } from "../services/score.js";

export const postResult = (req, res) => {
  const classroomId = req.params.classroomId ? req.params.classroomId : null;
  console.log(`Classroom ID ${classroomId}`);

  const {
    userId,
    params: { quizId },
  } = req;

  calculateScore(quizId, userId, classroomId, (err, score) => {
    if (err) {
      console.error("Error while calculating score:", err);

      if (err.status === 404) {
        return res.status(404).send({ msg: err.message });
      } else if (err.status === 403) {
        return res.status(403).send({ msg: err.message });
      } else {
        return next(new Error("Internal_Server_Error"));
      }
    }

    const newResult = new Result({
      user_id: userId,
      quiz_id: parseInt(quizId),
      score: score,
      classroom_id: classroomId ? parseInt(classroomId) : null,
    });

    console.log(newResult);

    Result.postResult(newResult, (err, data) => {
      if (err) {
        console.error("Error while saving result:", err);
        return next(new Error("Error_Save_Result"));
      }
      res.send(data);
    });
  });
};

export const getRank = (req, res) => {
  const { classroomId, quizId } = req.params;
  Result.getRank({ classroomId, quizId }, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        return next(new Error("Result_Not_Found"));
      } else {
        return next(new Error("Internal_Server_Error"));
      }
    }
    res.send(data);
  });
};
