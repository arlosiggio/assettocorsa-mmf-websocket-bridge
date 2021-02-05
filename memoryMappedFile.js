const ffi = require('ffi-napi');
const ref = require('ref-napi');
const EventEmitter = require('events');
const StructType = require('ref-struct-di')(ref)
const Kernel32dll = ffi.Library('Kernel32', {
  'CreateFileMappingA': ['int', ['int', 'int', 'int', 'int', 'int', 'string'] ],
  'MapViewOfFile': ['void *', ['int', 'int', 'int', 'int', 'uint32'] ],
  'UnmapViewOfFile': ['int', ['void *'] ],
  'CloseHandle': ['int', ['int'] ]
});
const INVALID_HANDLE_VALUE = -1;
const PAGE_READONLY = 0x02;
const FILE_MAP_READ = 0x04;

class MemoryMappedFile extends EventEmitter {
	constructor(structType, file, checkUpdates){
		super();
		this.structType = structType;
		this.file = file;
		this.checkUpdates = checkUpdates;
	}
	toJSON(){
		if(this.buffer){
			let retObj = {};
			for(let property in this.structType.fields){
				retObj[property] = this.data[property];
			}
			return retObj;
		}
	}
	open(){
		this.handle = Kernel32dll.CreateFileMappingA(
			INVALID_HANDLE_VALUE,
			ref.NULL,
			PAGE_READONLY,
			0,
			this.structType.size,
			this.file
		);
		if(!this.handle)
			throw 'CreateFileMappingA err';
		this.buffer = Kernel32dll.MapViewOfFile(
			this.handle,
			FILE_MAP_READ,
			0,
			0,
			this.structType.size
		);
		if(!this.buffer)
			throw 'MapViewOfFile err';
		this.emit('open');
		this.data = this.structType.get(ref.reinterpret(this.buffer,this.structType.size,0),0);
		if(this.checkUpdates){
			this.interval = setInterval(()=>{
				if(this.currentPacketId!=this.data.packetId){
					this.currentPacketId = this.data.packetId;
					this.emit('packet');
				}
			},10);
		}
	}
	close(){
		if(this.buffer)
			Kernel32dll.UnmapViewOfFile(this.buffer);
		if(this.handle)
			Kernel32dll.CloseHandle(this.handle);
		clearInterval(this.interval);
		this.emit('close');
	}
}

module.exports = MemoryMappedFile;