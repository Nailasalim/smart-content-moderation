export const submitContent = (req, res) => {
    const { text } = req.body;
  
    if (!text) {
      return res.status(400).json({
        message: "Content text is required",
      });
    }
  
    return res.status(201).json({
      message: "Content submitted successfully and pending moderation",
      content: {
        text,
        status: "PENDING",
        submittedBy: req.user.id,
      },
    });
  };
  