const ref = require('ref-napi');
const StructType = require('ref-struct-di')(ref);

function wcharArray(size){
	return {
		size: ref.sizeof.int16*size,
		indirection: 1,
		get: function(buffer, offset){
			return buffer.toString('utf16le',offset,buffer.indexOf('\0',offset,'utf16le'));
		},
		alignment:2
	}
}
function array(type,len){
	return {
		size: type.size*len,
		indirection: 1,
		get: function(buffer, offset){
			let arr = [];
			for(let i=0;i<len;i++){
				arr[i] = type.get(buffer,offset+i*type.size);
			}
			return arr;
		},
		alignment:type.alignment
	}
}

const SPageFileGraphicStruct = StructType({
	packetId: ref.types.int,
	status: ref.types.int,
	session: ref.types.int,
	currentTime: wcharArray(15),
	lastTime: wcharArray(15),
	bestTime: wcharArray(15),
	split: wcharArray(15),
	completedLaps: ref.types.int,
	position: ref.types.int,
	iCurrentTime: ref.types.int,
	iLastTime: ref.types.int,
	iBestTime: ref.types.int,
	sessionTimeLeft: ref.types.float,
	distanceTraveled: ref.types.float,
	isInPit: ref.types.int,
	currentSectorIndex: ref.types.int,
	lastSectorTime: ref.types.int,
	numberOfLaps: ref.types.int,
	tyreCompound: wcharArray(33),
	replayTimeMultiplier: ref.types.float,
	normalizedCarPosition: ref.types.float,
	carCoordinates: array(ref.types.float,3),
	penaltyTime: ref.types.float,
	flag: ref.types.int,
	idealLineOn: ref.types.int,
	isInPitLane: ref.types.int,
	surfaceGrip: ref.types.float,
});

const SPageFilePhysicsStruct = StructType({
	packetId: ref.types.int,
	gas: ref.types.float,
	brake: ref.types.float,
	fuel: ref.types.float,
	gear: ref.types.int,
	rpms: ref.types.int,
	steerAngle: ref.types.float,
	speedKmh: ref.types.float,
	velocity: array(ref.types.float,3),
	accG: array(ref.types.float,3),
	wheelSlip: array(ref.types.float,4),
	wheelLoad: array(ref.types.float,4),
	wheelsPressure: array(ref.types.float,4),
	wheelAngularSpeed: array(ref.types.float,4),
	tyreWear: array(ref.types.float,4),
	tyreDirtyLevel: array(ref.types.float,4),
	tyreCoreTemperature: array(ref.types.float,4),
	camberRAD: array(ref.types.float,4),
	suspensionTravel: array(ref.types.float,4),
	drs: ref.types.float,
	tc: ref.types.float,
	heading: ref.types.float,
	pitch: ref.types.float,
	roll: ref.types.float,
	cgHeight: ref.types.float,
	carDamage: array(ref.types.float,5),
	numberOfTyresOut: ref.types.int,
	pitLimiterOn: ref.types.int,
	abs: ref.types.float,
	kersCharge: ref.types.float,
	kersInput: ref.types.float,
	autoShifterOn: ref.types.int,
	rideHeight: array(ref.types.float,2),
	turboBoost: ref.types.float,
	ballast: ref.types.float,
	airDensity: ref.types.float,
	airTemp: ref.types.float,
	roadTemp: ref.types.float,
	localAngularVel: array(ref.types.float,3),
	finalFF: ref.types.float,
	performanceMeter: ref.types.float,
	engineBrake: ref.types.int,
	ersRecoveryLevel: ref.types.int,
	ersPowerLevel: ref.types.int,
	ersHeatCharging: ref.types.int,
	ersIsCharging: ref.types.int,
	kersCurrentKJ: ref.types.float,
	drsAvailable: ref.types.int,
	drsEnabled: ref.types.int,
	brakeTemp: array(ref.types.float,4),
	clutch: ref.types.float,
	tyreTempI: array(ref.types.float,4),
	tyreTempM: array(ref.types.float,4),
	tyreTempO: array(ref.types.float,4),
	isAIControlled: ref.types.int,
	tyreContactPoint: array(array(ref.types.float,3),4),
	tyreContactNormal: array(array(ref.types.float,3),4),
	tyreContactHeading: array(array(ref.types.float,3),4),
	brakeBias: ref.types.float
});

const SPageFileStaticStruct = StructType({
	smVersion: wcharArray(15),
	acVersion: wcharArray(15),
	numberOfSessions: ref.types.int,
	numCars: ref.types.int,
	carModel: wcharArray(33),
	track: wcharArray(33),
	playerName: wcharArray(33),
	playerSurname: wcharArray(33),
	playerNick: wcharArray(33),
	sectorCount: ref.types.int,
	maxTorque: ref.types.float,
	maxPower: ref.types.float,
	maxRpm: ref.types.int,
	maxFuel: ref.types.float,
	suspensionMaxTravel: array(ref.types.float,4),
	tyreRadius: array(ref.types.float,4),
	maxTurboBoost: ref.types.float,
	deprecated_1: ref.types.float,
	deprecated_2: ref.types.float,
	penaltiesEnabled: ref.types.int,
	aidFuelRate: ref.types.float,
	aidTireRate: ref.types.float,
	aidMechanicalDamage: ref.types.float,
	aidAllowTyreBlankets: ref.types.int,
	aidStability: ref.types.float,
	aidAutoClutch: ref.types.int,
	aidAutoBlip: ref.types.int,
	hasDRS: ref.types.int,
	hasERS: ref.types.int,
	hasKERS: ref.types.int,
	kersMaxJ: ref.types.float,
	engineBrakeSettingsCount: ref.types.int,
	ersPowerControllerCount: ref.types.int,
	trackSPlineLength: ref.types.float,
	trackConfiguration: wcharArray(33),
	ersMaxJ: ref.types.float,
});

module.exports = {
	SPageFileGraphicStruct: SPageFileGraphicStruct,
	SPageFileStaticStruct: SPageFileStaticStruct,
	SPageFilePhysicsStruct: SPageFilePhysicsStruct
}