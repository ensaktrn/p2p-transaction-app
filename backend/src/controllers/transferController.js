const { transferMoney } = require('../services/transferService');

const handleTransfer = async (req, res) => {
    const { receiverEmail, amount } = req.body;
    const senderId = req.user.id;
  
    try {
      const result = await transferMoney({
        senderId,
        receiverEmail,
        amount,
      });
  
      res.status(200).json({
        message: "Transfer successful",
        ...result,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

module.exports = {
  handleTransfer,
};
