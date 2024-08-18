const express = require('express');
const router = express.Router();
const db = require('../index').db;  // Importar o Firestore do index.js

// Rota para criação de um novo copo
router.post('/copos', async (req, res) => {
    try {
        const newCopo = {
            ml: req.body.ml,
            preco: req.body.preco
        };

        const docRef = await db.collection('copos').add(newCopo);
        res.status(200).json({ id: docRef.id, ...newCopo });
    } catch (error) {
        console.error("Erro ao adicionar copo ao Firestore: ", error);
        res.status(500).send("Erro ao adicionar copo ao Firestore");
    }
});

// Rota para criação de uma nova fruta
router.post('/frutas', async (req, res) => {
    try {
        const newFruta = {
            nome: req.body.nome
        };

        const docRef = await db.collection('frutas').add(newFruta);
        res.status(200).json({ id: docRef.id, ...newFruta });
    } catch (error) {
        console.error("Erro ao adicionar fruta ao Firestore: ", error);
        res.status(500).send("Erro ao adicionar fruta ao Firestore");
    }
});

// Rota para criação de uma nova cobertura
router.post('/coberturas', async (req, res) => {
    try {
        const newCobertura = {
            nome: req.body.nome
        };

        const docRef = await db.collection('coberturas').add(newCobertura);
        res.status(200).json({ id: docRef.id, ...newCobertura });
    } catch (error) {
        console.error("Erro ao adicionar cobertura ao Firestore: ", error);
        res.status(500).send("Erro ao adicionar cobertura ao Firestore");
    }
});

// Rota para criação de um novo acompanhamento
router.post('/acompanhamentos', async (req, res) => {
    try {
        const newAcompanhamento = {
            nome: req.body.nome
        };

        const docRef = await db.collection('acompanhamentos').add(newAcompanhamento);
        res.status(200).json({ id: docRef.id, ...newAcompanhamento });
    } catch (error) {
        console.error("Erro ao adicionar acompanhamento ao Firestore: ", error);
        res.status(500).send("Erro ao adicionar acompanhamento ao Firestore");
    }
});

// Rota para criação de um novo pedido
router.post('/pedidos', async (req, res) => {
    try {
        const newPedido = {
            tipo_acai: req.body.tipo_acai,
            copo: db.collection('copos').doc(req.body.copoId),
            frutas: req.body.frutas.map(id => db.collection('frutas').doc(id)),
            coberturas: req.body.coberturas.map(id => db.collection('coberturas').doc(id)),
            acompanhamentos: req.body.acompanhamentos.map(id => db.collection('acompanhamentos').doc(id)),
            adicionais: req.body.adicionais,
            preco_total: req.body.preco_total
        };

        const docRef = await db.collection('pedidos').add(newPedido);
        res.status(200).json({ id: docRef.id, ...newPedido });
    } catch (error) {
        console.error("Erro ao adicionar pedido ao Firestore: ", error);
        res.status(500).send("Erro ao adicionar pedido ao Firestore");
    }
});
// Rota para listar todas as frutas
router.get('/frutas', async (req, res) => {
    try {
        const frutasSnapshot = await db.collection('frutas').get();
        const frutas = frutasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(frutas);
    } catch (error) {
        console.error("Erro ao listar frutas do Firestore: ", error);
        res.status(500).send("Erro ao listar frutas do Firestore");
    }
});

// Rota para listar todas as coberturas
router.get('/coberturas', async (req, res) => {
    try {
        const coberturasSnapshot = await db.collection('coberturas').get();
        const coberturas = coberturasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(coberturas);
    } catch (error) {
        console.error("Erro ao listar coberturas do Firestore: ", error);
        res.status(500).send("Erro ao listar coberturas do Firestore");
    }
});

// Rota para listar todos os acompanhamentos
router.get('/acompanhamentos', async (req, res) => {
    try {
        const acompanhamentosSnapshot = await db.collection('acompanhamentos').get();
        const acompanhamentos = acompanhamentosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(acompanhamentos);
    } catch (error) {
        console.error("Erro ao listar acompanhamentos do Firestore: ", error);
        res.status(500).send("Erro ao listar acompanhamentos do Firestore");
    }
});

router.delete('/:tipo/:id', async (req, res) => {
    try {
        const tipo = req.params.tipo;  // frutas, coberturas, acompanhamentos, copos
        const id = req.params.id;

        const documentRef = db.collection(tipo).doc(id);
        await documentRef.delete();
        res.status(200).send({ success: true, message: 'Item excluído com sucesso' });
    } catch (error) {
        console.error("Erro ao excluir item do Firestore: ", error);
        res.status(500).send("Erro ao excluir item do Firestore");
    }
});

router.get('/copos', async (req, res) => {
    try {
        const coposSnapshot = await db.collection('copos').get();
        const copos = coposSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(copos);
    } catch (error) {
        console.error("Erro ao listar copos do Firestore: ", error);
        res.status(500).send("Erro ao listar copos do Firestore");
    }
});

// Rota para criação de um novo adicional
router.post('/adicionais', async (req, res) => {
    try {
        const newAdicional = {
            nome: req.body.nome
        };

        const docRef = await db.collection('adicionais').add(newAdicional);
        res.status(200).json({ id: docRef.id, ...newAdicional });
    } catch (error) {
        console.error("Erro ao adicionar adicional ao Firestore: ", error);
        res.status(500).send("Erro ao adicionar adicional ao Firestore");
    }
});

// Rota para listar todos os adicionais
router.get('/adicionais', async (req, res) => {
    try {
        const adicionaisSnapshot = await db.collection('adicionais').get();
        const adicionais = adicionaisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(adicionais);
    } catch (error) {
        console.error("Erro ao listar adicionais do Firestore: ", error);
        res.status(500).send("Erro ao listar adicionais do Firestore");
    }
});

// Rota para salvar uma venda no histórico
router.post('/historico', async (req, res) => {
    try {
        const venda = req.body;
        venda.data = new Date();  // Adiciona a data da venda

        const docRef = await db.collection('historico').add(venda);
        res.status(200).json({ id: docRef.id, ...venda });
    } catch (error) {
        console.error("Erro ao salvar venda no Firestore: ", error);
        res.status(500).send("Erro ao salvar venda no Firestore");
    }
});

router.delete('/:tipo/:id', async (req, res) => {
    try {
        const tipo = req.params.tipo;  // frutas, coberturas, acompanhamentos, copos
        const id = req.params.id;

        const documentRef = db.collection(tipo).doc(id);
        await documentRef.delete();
        res.status(200).send({ success: true, message: 'Item excluído com sucesso' });
    } catch (error) {
        console.error("Erro ao excluir item do Firestore: ", error);
        res.status(500).send("Erro ao excluir item do Firestore");
    }
});



module.exports = router;
