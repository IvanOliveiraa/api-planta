const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    app.use(cors());
    next();
});

const ControllerUsers = require('./controllers/ControllerUsers');
const ControllerPlantas = require('./controllers/ControllerPlantas')


//USUARIOS
app.post('/usuario/insert', ControllerUsers.insert);
app.put('/usuario/update/:id', ControllerUsers.update);
app.get('/usuarios', ControllerUsers.findAll);
app.get('/selectusuarios', ControllerUsers.SelectList);
app.get('/usuario/:id', ControllerUsers.findById);
app.delete('/usuario/:id', ControllerUsers.delete);
//plantas
app.get('/plantas', ControllerPlantas.findAll);
app.get('/plantasuser/:id', ControllerPlantas.findByIdUser);
app.get('/plantas/:id', ControllerPlantas.findById);
app.post('/planta/insert', ControllerPlantas.insert);
app.delete('/planta/:id', ControllerPlantas.delete);
app.put('/planta/update/:id', ControllerPlantas.update);

app.get('/regas/:id', ControllerPlantas.Regasbyplanta);
app.post('/planta/novarega/:id', ControllerPlantas.inserirNovaRega);

app.put('/planta/updateloc/:id', ControllerPlantas.updateloc);




const PORT = 8080;
app.listen(PORT, () => {
    console.log(`------------------------------`);
    console.log(`    🌱 API planta 🌱`);
    console.log(`🔥FUNCIONANDO COM SUCESSO🔥`);
    console.log(`   🚪 NA PORTA ${PORT} 🚪`);
    console.log(`______________________________`);
})