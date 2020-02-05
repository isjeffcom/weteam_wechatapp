const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkLogin() {
  
  var token = wx.getStorageSync("login_token")
  var uuid = wx.getStorageSync("login_uuid")
  var sNum = getSNum()
  var psw = getPsw()

  if (token && uuid && sNum && psw){
    return { res: true, token: token, uuid: uuid, status: 2 }
  } 

  else if(token && uuid && !sNum && !psw){
    return { res: true, token: token, uuid: uuid, status: 1 }
  }
  
  else {
    return { res: false }
  }
}

function getToken (){
  var token = wx.getStorageSync("login_token")
  if (token) {
    return token
  } else {
    return false
  }
}

function getUUID() {
  var uuid = wx.getStorageSync("login_uuid")
  if (uuid) {
    return uuid
  } else {
    return false
  }
}

function getSNum() {
  var res = wx.getStorageSync("login_snum")
  if (res) {
    return res
  } else {
    return false
  }
}

function getPsw() {
  var res = wx.getStorageSync("login_psw")
  if (res) {
    return res
  } else {
    return false
  }
}

function getTT(){
  var tt = wx.getStorageSync("data_tt")
  if (tt) {
    return tt
  } else {
    return false
  }
}

function getGTT(gid){
  var tt = wx.getStorageSync("data_gtt_"+gid)
  if (tt) {
    return tt
  } else {
    return false
  }
}

function getName(){
  var tt = wx.getStorageSync("data_n")
  if (tt) {
    return tt
  } else {
    return false
  }
}

function getImg() {
  var tt = wx.getStorageSync("login_img")
  if (tt) {
    return tt
  } else {
    return false
  }
}

function getAccInfo() {
  const snum = wx.getStorageSync("login_snum")
  const em = 's' + snum + '@ed.ac.uk'
  const na = wx.getStorageSync("data_n")
  if (snum) {
    return { snum: snum, email: em, name: na }
  } else {
    return false
  }
}


function getGroups() {
  var res = wx.getStorageSync("data_groups")
  if (res) {
    return res
  } else {
    return false
  }
}

function ifSingleAddZero (tar) {
  tar = String(tar)
  tar = tar.length == 1 ? "0" + tar : tar
  return tar
}

function timeEvtMatcher (target, obj) {

  // Target is sth. like "2020-04-23"
  var arr = []
  for (var i = 0; i < obj.length; i++) {

    var date = obj[i].start
    date = date.split(",")[0]

    if (target == date) {
      obj[i].startTime = obj[i].start.split(",")[1]
      obj[i].endTime = obj[i].end.split(",")[1]
      arr.push(obj[i])
    }
  }

  return arr
}

function checkInput(str) { 

  if(str.length > 12){
    return false
  }

  var p = new RegExp("[^[\u4e00-\u9fa5_a-zA-Z0-9]+$");
  if (p.test(str)) {
    return true;
　}
　return false;
}


function checkInputNumOnly (str) {
  var p = new RegExp("^[0-9]+$");
  if (p.test(str)) {
    return true
  } else {
    return false
  }
}

function constURLParam (obj) {
  var str = "?"
  for(var i=0;i<obj.length;i++){
    str = str + obj[i].key + "=" + obj[i].val
    if(i != obj.length - 1){
      str = str + "&"
    }
  }

  return str
}




function allToInt(arr) {
  var res = []
  for (var i = 0; i < arr.length; i++) {
    res[i] = parseInt(arr[i])
  }

  return res
}

function whereInArr(target, arr){
  
  for(var i=0;i<arr.length;i++){
    if(target == arr[i]){
      return i
    }
  }
  return false
}

function removeEmoji(str){
  return str.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "")
}

function logout(){
  wx.showLoading({
    title: '正在退出',
  })

  wx.clearStorage()
  wx.hideLoading()
  wx.redirectTo({
    url: '/pages/index/index',
  })

}

module.exports = {
  formatTime: formatTime,
  checkLogin: checkLogin,
  logout: logout,
  getToken: getToken,
  getUUID: getUUID,
  getTT: getTT,
  getGTT: getGTT,
  getName: getName,
  getImg: getImg,
  getAccInfo: getAccInfo,
  timeEvtMatcher: timeEvtMatcher,
  ifSingleAddZero: ifSingleAddZero,
  getSNum: getSNum,
  getPsw: getPsw,
  getGroups: getGroups,
  allToInt: allToInt,
  whereInArr: whereInArr,
  checkInput: checkInput,
  checkInputNumOnly: checkInputNumOnly,
  constURLParam: constURLParam,
  removeEmoji: removeEmoji
}
