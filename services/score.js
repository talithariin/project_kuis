import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

export const calculateScore = async (quizId, userId, classroomId) => {
  const quizID = parseInt(quizId);
  const userID = parseInt(userId);
  const classroomID = classroomId ? parseInt(classroomId) : null;

  try {
    // 1. Mencari data kuis by Quiz Id
    const quiz = await Quiz.findById(quizID);

    // Jika kuis tidak ditemukan
    if (!quiz) {
      throw { status: 404, message: `Not found quiz with id : ${quizID}` };
    }

    // 2. Mencari total question
    const questionIds = await Question.findAllQuestionId(quizID);

    // 3. Mengambil semua nilai is_true
    const totalCorrect = await Answer.getUserTrueCount(userID, questionIds);

    // 4. Menghitung Score
    const totalQuestionsCount = questionIds.length;
    console.log(`Total pertanyaan${totalQuestionsCount}`);
    console.log(`Jumlah Benar${totalCorrect}`);

    const score = (totalCorrect / totalQuestionsCount) * 100;
    const intScore = parseInt(score);
    console.log(`Score ${intScore}`);

    return intScore;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Internal_Server_Error");
  }
};
