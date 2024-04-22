import Classroom from "../models/Classroom.js";

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

const generateJoinCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let joinCode = "";

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    joinCode += characters[randomIndex];
  }

  return joinCode;
};
