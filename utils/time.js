const util = require("./util.js")



function reConstructDataByTimeSlot (data){

  var slots = [
    //{t_start: 0, t_end: 0, child:[]}
  ]

  for(var i=0;i<data.length;i++){
    
    // Add procressed time data for compare in
    var el = data[i]
    el.t_start = parseTimeToFloat(data[i].startTime)
    el.t_end = parseTimeToFloat(data[i].endTime)

    // check if fit any slot group
    var inSlot = ifInTimeSlotGroup(el, slots)

    if (inSlot){

      // Cuz if slot equal to 0 will equal to false, has to convert for passing the gate
      inSlot = inSlot - 1
      
      // If fit slot than
      // Update start, end and child
      slots[inSlot] = updateSingleSlot(el, inSlot, slots)

      // Check if slot crossed
      var hasCross = ifSlotHasCross(slots[inSlot], inSlot, slots)

      // If than merge
      if (hasCross){
        slots = mergeSlot(slots[inSlot], inSlot, hasCross.g, hasCross.i, slots)
      }

    } else {
      // not fit slot
      var newSlot = {
        t_start: el.t_start,
        t_end: el.t_end,
        child: [el]
      }
      // Push a new slot
      slots.push(newSlot)
    }
    //console.log(i, hardCopy(slots))
  }
  
  return slots
}

function hardCopy (val) {

  var c = JSON.stringify(val)
  return JSON.parse(c)
}

function mergeSlot(slot1, slot1Index, slot2, slot2Index, slotGroup) {

  //console.log(slot1)
  //console.log(slot2)

  var slot1Child = slot1.child
  var slot2Child = slot2.child

  var newSlot = {
    t_start: slot1.t_start <= slot2.t_start ? slot1.t_start : slot2.t_start, // Smaller the best
    t_end: slot1.t_end >= slot2.t_end ? slot1.t_end : slot2.t_end, // Larger the best
    child: slot1Child.concat(slot2Child)
  }
  //console.log(newSlot.child.length)
  slotGroup.splice(slot1Index, 1)
  slotGroup.splice(slot2Index, 1)
  slotGroup.push(newSlot)
  return slotGroup

}

function updateSingleSlot(target, index, slotGroup){

  var sS = slotGroup[index]
  
  if (target.t_start < sS.t_start ){
    sS.t_start = target.t_start
  }

  if (target.t_end > sS.t_end) {
    sS.t_end = target.t_end
  }

  var child = sS.child
  child.push(target)

  sS.child = child


  return sS
}

function ifSlotHasCross(target, index, group) {
  
  for(var i=0;i<group.length;i++){
    if(i != index){
      if (compareTimeSlot(target, group[i])) {
        return { g: group[i], i: i }
      }
    }
  }

  return false
}



function ifInTimeSlotGroup(target, group){

  if(group.length < 1){

    return false
  }

  for(var i=0;i<group.length;i++){
    if (compareTimeSlot(target, group[i])){
      return i+1
    }
  }

  return false
}

function compareTimeSlot(target, ref){

  // AS <= BS && AE > BS
  // AS < BE && AE > BS

  var refStart = ref.t_start
  var refEnd = ref.t_end
  var tarStart = target.t_start
  var tarEnd = target.t_end

  if (
    (tarStart <= refStart && tarEnd > refStart) ||
    (tarStart < refEnd && tarEnd > refStart)
  ) 
  {
    return true
  } 
  
  else if(tarStart == refStart && tarEnd == refEnd){
    return true
  }
  
  else {
    //console.log(refStart, refEnd, tarStart, tarEnd)
    return false
  }
}

function parseTimeToFloat(data) {
  var tc = data.split(':')

  if (!tc) {
    return false
  }
  
  tc = parseFloat(tc[0] + "." + tc[1])
  
  return tc
}

function timeToSize(startTime, endTime, slotHeight){

  var top = 0
  var height = 0

  var s = startTime.split(":")
  var e = endTime.split(":")

  s = util.allToInt(s)
  e = util.allToInt(e)

  const start = {
    hour: s[0],
    minute: s[1]
  }
  const end = {
    hour: e[0] != 0 ? e[0] : 24,
    minute: e[1]
  }

  if(start.hour == 24){
    start.hour == 0
  }

  // Cal Top
  top = (start.hour * slotHeight) + start.minute
  //console.log(height)


  // Cal Height 
  var hh

  // end.min >= start.min
  // 16:20 - 14:10 = (16 - 14) + (20 - 10) = 2h 10m 
  // 18:30 - 14:20 = (18 - 14) + (30 - 20) = 4h 10m

  // end.min < start.min
  // 16:10 - 14:20 = ( 16-14 - 1) + ((60+10) - 20) = 1h 50m
  // 16:20 - 14:40 = (16-14-1) + ((60 + 20) - 40) = 1h 40m

  // 00:00 - 14:00 = if(end.hour == 0) end.hour = 24 = 24:00 - 14:00

  if (end.minute >= start.minute) {
    hh = { hour: end.hour - start.hour, minute: end.minute - start.minute }
  } else {
    hh = { hour: end.hour - start.hour - 1, minute: (60 + end.minute) - start.minute }
  }

  height = (hh.hour * slotHeight) + hh.minute

  if (height == 0) {
    height = 1
  }

  return { status: true, top: top, height: height }

}



module.exports={
  timeToSize: timeToSize,
  reConstructDataByTimeSlot: reConstructDataByTimeSlot
}