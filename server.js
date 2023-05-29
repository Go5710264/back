const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const uuid = require('uuid');

const app = new Koa();

app.use(koaBody({
    urlencoded: true,
    multipart: true,
}))

let tickets = [
    {
        id:'1',
        name: 'Установить обновление',
        status: true,
        created: 1672651320000,
    },
    {
        id:'2',
        name: 'Заменить принтер',
        status: false,
        created: 1684137600000,
    }
];

let ticketFull = [
    {
        id:'1',
        name: 'Установить обновление',
        description: 'Вышло новое обновление Linux, необоходимо перезапустить все ПК на 8 этаже',
        status: true,
        created: 1672651320000,
    },
    {
        id:'2',
        name: 'Заменить принтер',
        description: 'Заявка на замену принтера поступила 01.05.2020, пора уже заменить. 126 кабинет.',
        status: false,
        created: 1684137600000,
    }
] 

function getTecket (contex, next) {
    contex.response.set('Access-Control-Allow-Origin', '*');
    const { method } = contex.request.query;
    
    switch (method){
        case 'allTickets':

            contex.response.body = tickets;

            return;

        case 'ticketById':
            
            const { id: ticketID } = contex.request.query;
            
            contex.response.body = ticketFull.find((item) => {
                if(item.id == ticketID) return true;
            });

            return;

        case 'createTicket':

            contex.request.body.id = uuid.v4();
            contex.request.body.created = Date.now();

            ticketFull.push(contex.request.body);

            const copyTicket = { ...contex.request.body }
            delete copyTicket.description
            
            tickets.push(copyTicket)
        
            contex.response.body = contex.request.body;
            return;

        case 'editedTicket':

            let receivedTicket = JSON.parse(contex.request.body)

            let candidate = tickets.find((t) => t.id === receivedTicket.id)

            if(!candidate) contex.response.status = 404;

            candidate.status = receivedTicket.status;
            candidate.name = receivedTicket.name;

            candidate = ticketFull.find((t) => t.id === receivedTicket.id)

            candidate.status = receivedTicket.status;
            candidate.name = receivedTicket.name;
            candidate.description = receivedTicket.description;
            
            contex.response.status = 204;

            return;
            
        default:

            contex.response.status = 404;
            return;
    }
}


app.use((ctx, next) => {

    if(ctx.request.method !== 'OPTIONS'){
        next();

        return;
    }

    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');

    ctx.response.status = 204;
})


app.use((ctx, next) => {

    if(ctx.request.method !== 'DELETE'){
        next();

        return;
    }
    ctx.response.set('Access-Control-Allow-Origin', '*');

    let { method: id } = ctx.request.query;

    tickets = tickets.filter((task) => task.id !== id);

    ticketFull = ticketFull.filter((task) => task.id !== id);

    ctx.response.status = 200;

    // Данный текст должен отображаться в response DewTools
    ctx.response.body = 'ticket deleted';
})

app.use((ctx, next) => {
    getTecket(ctx, next)
    // console.log('----')
    // console.log(tickets);
    // console.log(ticketFull);

})


const server = http.createServer(app.callback());
const port = 7070;

server.listen(port, (err) => {
    if(err) {
        console.log(err);
        return;
    }

    console.log('Server is listening to ' + port)
})