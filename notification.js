//LiteLoaderScript Dev Helper
/// <reference path="e:\PersonCode\lite-loader-library/Library/JS/Api.js" />

ll.registerPlugin('消息通知插件', '管理员上线离线通知 ，进服公告', [0, 0, 1])

const handleOnJoin = player => {
  log(player.name)
  log(player.xuid)
  log(player.permLevel)
  log(player.realName)
  log(player.pos)
  const message = handleLoginStatusMessage(player, 1)
  setTimeout(() => {
    mc.broadcast(message)
  }, 100)
}

const handleOnLeft = player => {
  const message = handleLoginStatusMessage(player, 0)
  mc.broadcast(message)
}

const handleLoginStatusMessage = (player, type) => {
  const isOp = player.isOP()
  let message
  if (isOp && type) {
    message = `${Format.Gold}管理员:${Format.Green}${player.name}${Format.Gold}上线了~`
  } else if (isOp && !type) {
    message = `${Format.Gold}管理员:${Format.Green}${player.name}${Format.Gold}下线了~`
  }

  return message
}

// 监听上线
mc.listen('onJoin', handleOnJoin)

// 监听下线
mc.listen('onLeft', handleOnLeft)
