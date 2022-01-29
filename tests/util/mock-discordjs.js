exports.mockMsg = function(text = false, author = false, channel = false, isDM = false){
  if (!text) text = "mock text provided by framework"
  if (!author) author = exports.mockSimpleUser()
  if (!channel) channel = exports.mockChannel()
  return {
    id: 'mockuserid',
    guild: !isDM,
    content: text,
    channel: channel,
    author: author,
    member: {
      nickname: 'mockmembernickname'
    },
    react: (r) => console.log(`mock message reaction: ${r}`),
    reply: (r) => console.log(`mock message reply: ${r}`),
    send: (s) => console.log(`mock message send: ${r}`),
    delete: () => console.log(`mock message delete`)
  }
}

exports.mockSimpleUser = function(userid = 'mockSIMPLEruserdefaultID', username = 'mockSIMPLEuserNAME', isBot = false){
  return {
    id: userid,
    username: username,
    nickname: false,
    bot: isBot,
    admin: false,
    send: (txt) => console.log(`mock simple user send: ${txt}`),
    roles: [ "everyone" ]
  }
}

exports.mockModUser = function(userid = 'mockMODuserdefaultID', username = 'mockMODuserNAME'){
  return {
    id: userid,
    username: username,
    nickname: false,
    bot: isBot,
    admin: false,
    send: (txt) => console.log(`mock mod user send: ${txt}`),
    roles: [ "admin", "moderator", "everyone" ]
  }
}

exports.mockChannel = function(id = 'mockchannelIDdefault', isDM = false){
  return {
    id: 'chanid',
    recipient: isDM,
    send: (s) => console.log(`mock channel send: ${s}`)
  }
}

exports.mockServer = function(id = 'mockserverID'){
  return {
    id: id
  }
}
