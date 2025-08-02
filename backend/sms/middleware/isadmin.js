const isadmin = (req,res,next) => {
    console.log(req.user)
    if (req.user && req.user.role === 'admin') {
        return next(); // User is admin, proceed to the next middleware or route handler
    }
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    };  

module.exports = isadmin ;







