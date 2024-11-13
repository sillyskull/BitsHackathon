const User = require('../models/user');
const {setToken, validateToken} = require('../services/auth');

async function handleLogin(req, res) {
    const {username, password} = req.body;
    const user = await User.findOne({
        username: username,

        password: password
    });

    console.log(user);

    if (!user) {
        return res.json({
            msg: "Invalid credentials",
            authenticatedUser: "False"
        });
    }

    const token = setToken(user);
    res.cookie("token", token);
    res.user = user;

    return res.json({
        msg: "success",
        authenticatedUser: "True"
    });
}


async function handleSignUp(req, res) {
    const {username, email, password} = req.body;

    if (password !== "undefined") {
        const user = await User.findOne({
            username: username,
            email: email
        });

        if (user) return res.json({
            msg: "User already exists."
        });

        User.create({
            username: username,
            email: email,
            password: password
        });

        return res.json({
            msg: "Successfully signed up.",
        });


    } else {
        const user = await User.findOne({
            username: username,
            email: email
        });

        console.log(user);

        if (user) {
            return res.json({msg: "User Google Info already exists."});
        }

        User.create({
            username: username,
            email: email,
            password: password
        });

        return res.json({msg: "Successfully stored use in database."});
    }
    return res.json({msg: "there is an internal server...."});
}

function getUserDetails(req, res) {
    const token = req.cookies.token;
    const user = validateToken(token);

    console.log(user);

    return res.json(user);
}


module.exports = {
    handleLogin,
    handleSignUp,
    getUserDetails,
}