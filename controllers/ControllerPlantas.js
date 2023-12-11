const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/uploadimage');


module.exports = {
    async insert(req, res) {
        let latitude = -23.5489;
        let longitude = -46.6388;

        let sql = `
            INSERT INTO plantas 
            SET 
                NOME_PLANTA = ?,
                usuario_id = ?,
                hardware = ?,
                LOC = ST_GeomFromText('POINT(${latitude} ${longitude})')
        `;

        let values = [
            req.body.NOME_PLANTA,
            req.body.usuario,
            req.body.hardware
        ];

        try {
            let response = await db.query(sql, values);
            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Erro ao inserir planta.' });
        }
    } //FIM INSERT NORMAL


    //INICIO UPDATE
    ,
    async update(req, res) {
        let id = req.params.id;


        let datas = {
            "NOME_PLANTA": req.body.NOME_PLANTA,
            "hardware": req.body.hardware,
            "REGA_TEMPO": req.body.REGA_TEMPO
        }

        try {
            let response = await db.query('UPDATE plantas SET ? WHERE id = ?', [datas, id]);
            res.send('update deu certo');
        } catch (error) {
            console.log(error);
            res.send('Erro no update');
        }
    } //FIM UPDATE 

    //INICIO LISTAR TODOS
    ,
    async SelectList(req, res) {
        try {
            let response = await db.query('SELECT * FROM `plantas` order by id desc');
            res.json(response[0]);
        } catch (error) {
            console.log(error);
        }
    }//FIM LISTAR TODOS
    //INICIO LISTAR TODOS
    ,
    async findAll(req, res) {
        try {
            let response = await db.query('SELECT * from plantas');
            res.json(response[0]);
        } catch (error) {
            console.log(error);
        }
    }//FIM LISTAR TODOS


    //INICIO LISTAR POR ID
    ,
    async findById(req, res) {
        let id = req.params.id;
        try {
            let response = await db.query(`SELECT  p.id ,p.hardware, p.NOME_PLANTA, p.LOC, p.BOMBA_STATUS, p.REGA_TEMPO, p.UMIDADE, u.nome AS nome_usuario FROM plantas p JOIN usuarios u ON p.usuario_id = u.id WHERE p.id = ? `, [id]);

            res.send(response[0]);
        } catch (error) {
            console.log(error);
        }
    }//FIM LISTAR POR ID


    //INICIO DELETE
    ,

    async delete(req, res) {
        let id = req.params.id;

        try {
            let response = await db.query(`DELETE FROM plantas WHERE id = ${id}`);
            res.json(response);

        } catch (error) {
            console.log(error);
        }
    }//FIM DELETE

    //INICIO LISTAR REGAS POR PLANTA
    ,
    async Regasbyplanta(req, res) {
        let id = req.params.id;
        try {
            let response = await db.query(`SELECT * from regas where planta_id = ? order by id desc `, [id]);

            res.send(response[0]);
        } catch (error) {
            console.log(error);
        }
    },//FIM LISTAR REGAS POR PLANTA

    async inserirNovaRega(req, res) {
        try {
            // Obtenha o ID da planta a partir dos parâmetros da solicitação
            let id = req.params.id;

            const dataAtualUTC = new Date();
            const offsetBrasilia = -4; // Horário de Brasília é UTC-3
            const dataAtualBrasilia = new Date(dataAtualUTC.getTime() + offsetBrasilia * 60 * 60 * 1000);
            // Formate a data no formato desejado (por exemplo, "2023-09-20T20:30:55.000Z")
            const dataFormatada = dataAtualBrasilia.toISOString();

            // Construa o objeto com os dados da rega
            const dadosRega = {
                "planta_id": id,
                "data_hora": dataFormatada
            };

            // Execute a inserção no banco de dados (substitua este trecho com seu código de inserção)
            const response = await db.query('INSERT INTO regas SET ?', [dadosRega]);

            // Retorne a resposta ao cliente
            res.json(response[0]);

        } catch (error) {
            console.error("Erro ao inserir nova rega:", error);
            res.status(500).json({ error: 'Erro ao inserir planta.' });
            // Trate o erro conforme necessário
        }
    },
    async findByIdUser(req, res) {
        let id = req.params.id;
        try {
            let response = await db.query(`SELECT  p.id ,p.hardware, p.NOME_PLANTA, p.LOC, p.BOMBA_STATUS, p.REGA_TEMPO, p.UMIDADE, u.nome AS nome_usuario FROM plantas p JOIN usuarios u ON p.usuario_id = u.id WHERE p.usuario_id = ? `, [id]);

            res.send(response[0]);
        } catch (error) {
            console.log(error);
        }
    },//FIM LISTAR POR ID

    async updateloc(req, res) {
        let id = req.params.id;
        let latitude = req.body.latitude;
        let longitude = req.body.longitude;

        // Correção na string SQL
        let sql = `UPDATE plantas SET LOC = ST_GeomFromText('POINT(${latitude} ${longitude})') WHERE id = ?`;

        try {
            let response = await db.query(sql, id);
            res.json(response);
        } catch (error) {
            console.log(error);
            res.send('Erro no update');
        }
    }



}