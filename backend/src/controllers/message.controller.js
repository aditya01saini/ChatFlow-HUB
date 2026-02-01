import Message from "../models/message.model.js"
import Chat from "../models/chat.model.js"

export const sendMessage = async(req, res) => {
    try {
        const {content, chatId} = req.body;

        if(!content || !chatId) {
            return res.status(404).json({err: "Contend and chatId required"});
        }

        let message = await Message.create({
            sender: req.user._id,
            content,
            chat: chatId,
        });

        message = await message.populate("sender", "name email");
        message = await message.populate("chat");

        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: message._id,
        });

        res.status(202).json(message);

    }catch(err){
        res.status(500).json({error: err.message});
    }
}


export const getMessages = async(req, res) => {
    try {
        const messages = await Message.find({
            chat: req.params.chatId,
        }).populate("sender", "name email");

        res.json(messages);

    }catch(error){
        res.status(500).json({err: error.message});
    }
}