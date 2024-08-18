const express = require('express');
const router = express.Router();
const db = require('../index').db;  // Importar o Firestore do index.js
const admin = require('firebase-admin');  // Importar admin do Firebase para trabalhar com Timestamps

// Rota para buscar o histórico de vendas
router.get('/historico', async (req, res) => {
    try {
        const { query, data } = req.query;
        console.log('Received query:', query, 'Received data:', data);

        let historicoRef = db.collection('historico');
        
        if (data) {
            const dataInicio = new Date(data + 'T00:00:00');
            const dataFim = new Date(data + 'T23:59:59');

            console.log('Data range:', dataInicio, dataFim);

            historicoRef = historicoRef
                .where('data', '>=', admin.firestore.Timestamp.fromDate(dataInicio))
                .where('data', '<=', admin.firestore.Timestamp.fromDate(dataFim));
        }

        const snapshot = await historicoRef.get();
        let vendas = snapshot.docs.map(doc => {
            console.log('Fetched doc:', doc.data());
            return { id: doc.id, ...doc.data() };
        });

        if (query) {
            const queryLower = query.toLowerCase();
            vendas = vendas.filter(venda => {
                console.log('Filtering venda:', venda);
                return venda.cliente?.toLowerCase().includes(queryLower) ||
                    venda.copo?.toLowerCase().includes(queryLower) ||
                    (venda.frutas || []).some(item => item.toLowerCase().includes(queryLower)) ||
                    (venda.coberturas || []).some(item => item.toLowerCase().includes(queryLower)) ||
                    (venda.acompanhamentos || []).some(item => item.toLowerCase().includes(queryLower)) ||
                    (venda.adicionais || []).some(item => item.toLowerCase().includes(queryLower));
            });
        }

        console.log('Filtered vendas:', vendas);
        res.status(200).json(vendas);
    } catch (error) {
        console.error("Erro ao buscar histórico de vendas: ", error);
        res.status(500).json({ message: "Erro ao buscar histórico de vendas", error });
    }
});


module.exports = router;
