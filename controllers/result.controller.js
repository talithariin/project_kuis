import Result from "../models/Result.js";
import { calculateScore } from "../services/score.js";

export const postResult = async (req, res, next) => {
  const classroomId = req.params.classroomId ? req.params.classroomId : null;
  const {
    userId,
    params: { quizId },
  } = req;

  try {
    const score = await calculateScore(quizId, userId, classroomId);

    const newResult = {
      user_id: userId,
      quiz_id: parseInt(quizId),
      score: score,
      classroom_id: classroomId ? parseInt(classroomId) : null,
    };

    const insertedResult = await Result.postResult(newResult);
    res.send(insertedResult);
  } catch (error) {
    console.error("Error while saving result:", error);
    return next(new Error("Error_Save_Result"));
  }
};

export const getRank = async (req, res, next) => {
  try {
    const { classroomId, quizId } = req.params;
    const data = { classroomId, quizId };
    const ranks = await Result.getRank(data);
    res.send(ranks);
  } catch (err) {
    if (err.type === "not_found") {
      return next(new Error("Result_Not_Found"));
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};
