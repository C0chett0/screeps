var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var target;
            if (creep.memory.destination != undefined) {
                target = Game.getObjectById(creep.memory.destination);
            }
            if (target == undefined) {
                var targets = creep.room.find(FIND_DROPPED_ENERGY);
                var opti = {'id': undefined, 'qty': undefined};
                for(var i = targets.length - 1; i>=0; i--) {
                    if(opti.id == undefined || opti.qty < targets[i].amount) {
                        opti.id = targets[i].id;
                        opti.qty = targets[i].energy;
                    }
                }
                if(opti.id != undefined) {
                    target = Game.getObjectById(opti.id);
                    creep.memory.destination = opti.id;
                } else {
                    target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    if (target != undefined) {
                        creep.memory.destination = target.id;
                    }
                }
            }
            if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                creep.memory.destination = undefined;
            }
        }
        else {
            creep.memory.destination = undefined;
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                }
            });
            if(target != undefined) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity});
                if(target != undefined) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }  else {
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_STORAGE});
                    if(target != undefined) {
                        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    } else {
                        creep.moveTo(27,33);
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;