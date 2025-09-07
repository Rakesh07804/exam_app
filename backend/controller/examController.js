const questions = require("../data/questions");
const Result = require("../model/result");

exports.getQuestions = (req, res) => {
  try {
    if (!questions || questions.length === 0) {
      return res.status(404).json({ msg: "No questions available" });
    }

    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, 3));
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.submitExam = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ msg: "Answers must be an array" });
    }

    let score = 0;
    questions.forEach((q) => {
      const ans = answers.find((a) => a.id === q.id);
      if (ans && ans.answer === q.answer) score++;
    });

    const newResult = await Result.create({
      userId: req.user, 
      answers,
      score,
      total: questions.length,
    });

    res.json({
      msg: "Exam submitted successfully",
      submissionId: newResult._id,
      score,
      total: questions.length,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getResult = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Result ID is required" });
    }

    const result = await Result.findById(id).populate("userId", "name email");
    if (!result) {
      return res.status(404).json({ msg: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
