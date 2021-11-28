const connection = require('../database/connection');

module.exports = {

    async index(req, res) {
        const ong_id = req.headers.context;
        try {
            const incidents = await connection('incidents').where('ong_id', ong_id).select('*');
            if (!incidents) {
                return res.status(400).send({ Error: "Incidents Not Found" });
            }
            return res.json(incidents);
        } catch (error) {
            return res.status(400).send({ Error: "ONG Has No Recorded Incidents" })
        }
    },

    async findById(req, res) {
        try {
            const { id } = req.params;
            const incidents = await connection('incidents').where('id', id).select('*').first();
            if (!incidents) {
                return res.status(400).send({ Error: "Incidents Not Found" });
            }
            return res.json(incidents);
        } catch (error) {
            return res.status(400).send({ Error: "ONG Has No Recorded Incidents" })
        }
    }


}