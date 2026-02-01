import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

export const createChat =  async(req, res) => {
    try{
        const {userId} = req.body;

        if(!userId){
            res.status(404).json({error: "User not found"});
        }

        let chat = await Chat.findOne({
            participants: { $all: [req.user._id, userId]},
            isGroup: false,
         })
         .populate("participants", "-password")
         .populate("lastMessage");

          if (chat) return res.json(chat);

    // create new chat
    const newChat = await Chat.create({
      participants: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "participants",
      "-password"
    );

    res.status(201).json(fullChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route GET /api/chat
// @access Protected
export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(chats);
}
         catch(err){
        res.status(500).json({error: err.message});
    }
}

