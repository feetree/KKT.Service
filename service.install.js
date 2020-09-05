let Service = require('node-windows').Service;
let svc = new Service({
    name:'WBT.KKT.Service',
    description: 'Service for Atol KKT',
    script: __dirname+'\\bin\\www',
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ]
});
svc.on('install',function(){
    svc.start();
});
svc.install();