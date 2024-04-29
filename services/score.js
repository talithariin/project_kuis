import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

// export const calculateScorePublic = async (quizId, userId, next) => {
//   const quizID = parseInt(quizId);
//   console.log(typeof quizId, quizId, typeof userId, userId);

//   try {
//     // 1. Mencari data kuis by Quiz Id
//     Quiz.findById(quizID, (err, quiz) => {
//       if (err) {
//         console.error("Error while finding quiz:", err);
//         return next(new Error("Internal_Server_Error"));
//       }

//       // Jika kuis tidak ditemukan
//       if (!quiz) {
//         return next({
//           status: 404,
//           message: `Not found quiz with id : ${quizID}`,
//         });
//       }

//       // 2. Cek nilai is_public
//       if (!quiz.is_public) {
//         return next({
//           status: 403,
//           message: `The quiz with id : ${quizID} is not public`,
//         });
//       }

//       // 3. Mencari total question
//       Question.findAllQuestionId(quizID, (err, questionIds) => {
//         if (err) {
//           console.error("Error while getting question IDs:", err);
//           return next(new Error("Internal_Server_Error"));
//         }
//         console.log(`Question ID ${questionIds}`);

//         // 4. Mengambil semua nilai is_true
//         Answer.getUserTrueCount(userId, questionIds, (err, totalCorrect) => {
//           if (err) {
//             console.error("Error while getting question IDs:", err);
//             return next(new Error("Internal_Server_Error"));
//           }
//           // 4. Menghitung Score
//           const totalQuestionsCount = questionIds.length;
//           console.log(`Total pertanyaan${totalQuestionsCount}`);
//           console.log(`Jumlah Benar${totalCorrect}`);

//           const score = (totalCorrect / totalQuestionsCount) * 100;
//           const intScore = parseInt(score);

//           return next(null, intScore);
//         });
//       });
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return next(new Error("Internal_Server_Error"));
//   }
// };

export const calculateScore = async (quizId, userId, classroomId, next) => {
  const quizID = parseInt(quizId);
  const userID = parseInt(userId);
  const classroomID = classroomId ? parseInt(classroomId) : null;
  console.log("Quiz ID" + typeof quizId + quizId);
  console.log("User ID" + typeof userID + userID);

  try {
    // 1. Mencari data kuis by Quiz Id
    Quiz.findById(quizID, (err, quiz) => {
      if (err) {
        console.error("Error while finding quiz:", err);
        return next(new Error("Internal_Server_Error"));
      }

      // Jika kuis tidak ditemukan
      if (!quiz) {
        return next({
          status: 404,
          message: `Not found quiz with id : ${quizID}`,
        });
      }
      console.log(quiz);

      // 2. Mencari total question
      Question.findAllQuestionId(quizID, (err, questionIds) => {
        if (err) {
          console.error("Error while getting question IDs:", err);
          return next(new Error("Internal_Server_Error"));
        }
        console.log(`Question ID ${questionIds}`);

        // 3. Mengambil semua nilai is_true
        Answer.getUserTrueCount(userId, questionIds, (err, totalCorrect) => {
          if (err) {
            console.error("Error while getting question IDs:", err);
            return next(new Error("Internal_Server_Error"));
          }
          // 4. Menghitung Score
          const totalQuestionsCount = questionIds.length;
          console.log(`Total pertanyaan${totalQuestionsCount}`);
          console.log(`Jumlah Benar${totalCorrect}`);

          const score = (totalCorrect / totalQuestionsCount) * 100;
          const intScore = parseInt(score);
          console.log(intScore);

          return next(null, intScore);
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};
