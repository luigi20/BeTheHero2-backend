const connection = require('../database/connection');

module.exports = {

    async index(req, res) {

        const { page = 1 } = req.query;
        const [count] = await connection('incidents').count();
        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf']);
        res.header('X-Total-Count', count['count(*)']);
        return res.json(incidents);
    },

    async create(req, res) {
        const { title, description, value } = req.body;
        let ong_id = req.headers.context;
        let ong = token(req.headers.authorization, ong_id);
        try {
            if (!ong) {
                return res.status(404).send({ Error: "You are not authorized to access this application." });
            }
            const [id] = await connection('incidents').insert({
                title,
                description,
                value,
                ong_id
            })
            return res.json({ id });
        } catch (error) {
            res.status(400).send({ error: "Registration Failed" })
        }
    },

    async update(req, res) {
        const { id } = req.params;
        const ong_id = req.headers.context;
        const { title, description, value } = req.body;
        const data = new Date();
        const str_data = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
        const str_hora = data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();
        let ong = token(req.headers.authorization, ong_id);
        try {
            if (!ong) {
                return res.status(404).send({ Error: "You are not authorized to access this application." });
            }
            const incident = await connection('incidents').where('id', id).select('ong_id').first();
            if (!incident) {
                return res.status(404).send({ error: "Incident not Found" })
            }
            if (incident.ong_id !== ong_id) {
                return res.status(401).json({ Error: "Operation not permitted" });
            }

            await connection('incidents').update({
                'title': title,
                'description': description,
                'value': value,
                'updated_at_incident': str_data + ' ' + str_hora,

            }).where('id', id);
            return res.status(204).send();
        } catch (error) {
            console.log(error);
            return res.status(400).send({ error: "Update Failed" });
        }
    },

    async delete(req, res) {
        const { id } = req.params;
        const ong_id = req.headers.context;
        let ong = token(req.headers.authorization, ong_id);
        try {
            if (!ong) {
                return res.status(404).send({ Error: "You are not authorized to access this application." });
            }
            const incident = await connection('incidents').where('id', id).select('ong_id').first();
            if (!incident) {
                return res.status(404).send({ error: "Incident not Found" })
            }
            if (incident.ong_id !== ong_id) {
                return res.status(401).json({ Error: "Operation not permitted" });
            }
            await connection('incidents').where('id', id).delete();
            return res.status(204).send();
        } catch (error) {
            return res.status(400).send({ error: "Delete Failed" });
        }
    }
}

async function token(token, ong_id) {
    const ong = await connection('ongs').
        where('token', '=', token).where('id', '=', ong_id);
    return ong;
}