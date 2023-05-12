const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');

const app = new Koa();

app.use(koaBody({
    urlencoded: true,
}))

const tickets = [
    {
        id:1,
        name: 'Установить обновление',
        status: true,
        created: 1672651320000,
    },
    {
        id:2,
        name: 'Заменить принтер',
        status: false,
        created: 1684137600000,
    }
];

const ticketFull = [
    {
        id:1,
        name: 'Установить обновление',
        description: 'Вышло новое обновление Linux, необоходимо перезапустить все ПК на 8 этаже',
        status: true,
        created: 1672651320000,
    },
    {
        id:2,
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
            return next();

        case 'ticketById':
            const { id: ticketID } = contex.request.query;
            
            contex.response.body = ticketFull.find((item) => {
                if(item.id == ticketID) return true;
            });

            return next();
        case 'createTicket':
            console.log(contex.request.body)
            // Тело запроса не отображается
            return;
        default:
            contex.response.status = 404;
            return;
    }
}

app.use((ctx, next) => {
    getTecket(ctx, next)
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