const { SPageFileGraphicStruct, SPageFilePhysicsStruct, SPageFileStaticStruct } = require('./types-definition');
const memoryMappedFile = require('./memoryMappedFile');
const WebSocket = require('ws');

const graphic = new memoryMappedFile(SPageFileGraphicStruct, 'Local\\acpmf_graphics', true);
const physics = new memoryMappedFile(SPageFilePhysicsStruct, 'Local\\acpmf_physics', true);
const staticdata = new memoryMappedFile(SPageFileStaticStruct, 'Local\\acpmf_static', false);

const wss = new WebSocket.Server({
	port: 9999,
});

process.on('SIGINT', ()=>{
	graphic.close();
	physics.close();
	staticdata.close();
	process.exit();
});

graphic.open();
physics.open();
staticdata.open();

wsSessions = [];

wss.on('connection', function connection(ws) {
	let session = new WSSession(ws);
	/*wsSessions.push(session);
	ws.once('close',()=>{
		wsSessions = wsSessions.filter(s=>s!=session);
	});*/
});

class WSSession {
	constructor(websocket) {
		this.websocket = websocket;
		websocket.on('message',(msg)=>{
			this.parseMessage(msg);
		});
	}
	/*
	messages: 
		op: 1 register
		op: 2 unregister
		op: 3 get static data
	*/
	parseMessage(message){
		message = JSON.parse(message);
		switch(message.op){
			case 'register':
				if(!message.args)
					return;
				for(let arg of message.args){
					console.log(arg)
					if(arg == 'graphic'){
						this._graphicCallback = ()=>{
							this.websocket.send(JSON.stringify({"type":"graphic",data:graphic}));
						}
						graphic.on('packet',this._graphicCallback);
					}
					else if(arg == 'physics'){
						console.log("physics subscribed")
						this._physicsCallback = ()=>{
							this.websocket.send(JSON.stringify({"type":"physics",data:physics}));
						}
						console.log(this._physicsCallback)
						physics.on('packet',this._physicsCallback)
					}

				}
			break;
			case 'unregister':
				if(!message.args)
					return;
				for(let arg of message.args){
					if(arg == 'graphic'){
						graphic.removeListener('packet',this._graphicCallback);
					}
					else if(arg == 'physics'){
						physics.removeListener('packet',this._physicsCallback);
					}
				}
			break;
			case 'getstaticdata':
				this.websocket.send(JSON.stringify(staticdata));
			break
		}
	}

}