const NotFoundError = (req,res) => res.status(404).json('You are not allowed to access this route')


module.exports = NotFoundError