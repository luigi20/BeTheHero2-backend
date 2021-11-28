const bcrypt = require('bcryptjs');
const connection = require('../database/connection');
const authconfig = require('../config/auth');

const jwt = require('jsonwebtoken');

function generateToken(params = {}) {
    const token = jwt.sign(params, authconfig.key.secret, {
        expiresIn: 86400,
    });
    return token;
}

module.exports = {
    async authenticate(req, res) {
        const { email, password } = req.body;
        const ong = await connection('ongs').
            where('email', email).
            select('password', 'id', 'name')
            .first();

        if (!ong) {
            return res.status(400).send({ Error: "Ong Not Found" });
        }

        const { name, id } = ong;
        if (!await bcrypt.compare(password, ong.password)) {
            return res.status(400).send({ Error: "Invalid Password" });
        }
        const token = 'Bearer ' + generateToken({ idToken: ong.id })
        await connection('ongs').
            where('id', id).
            update({
                'token': token
            })

        return res.json({ token, name, id });
    }
}
