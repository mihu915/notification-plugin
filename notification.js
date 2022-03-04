//LiteLoaderScript Dev Helper
/// <reference path="e:\PersonCode\lite-loader-library/Library/JS/Api.js" />

ll.registerPlugin('消息通知插件', '管理员上线离线通知，进服公告', [0, 0, 1])

const conf = new JsonConfigFile('./plugins/notification/config.json')

conf.init('masterName', '')
conf.init('announcement', '')

const masterName = conf.get('masterName')
const announcement = conf.get('announcement')

/**
  PermType.Any
  PermType.GameMasters
  PermType.Console
 */

mc.listen('onServerStarted', () => {
  const cmd = mc.newCommand('notification', '测试指令', PermType.GameMasters)
  cmd.setAlias('ncn')
  cmd.setEnum('ChangeAction', ['master'])

  cmd.mandatory('action', ParamType.Enum, 'ChangeAction', 1)

  cmd.mandatory('name', ParamType.String)
  cmd.mandatory('aaa', ParamType.String)
  cmd.overload(['ChangeAction', 'name'])

  cmd.setCallback((cmd, origin, output, results) => {
    log('测试指令被调用')
    log(results.action)
    log(results.name)
    switch (results.action) {
      case 'master':
        log('master被执行')
        // conf.set('masterName', args[0])
        // log(`已更新服主名称为：${args[0]}`)
        return
      case 'ann':
        log('ann被执行')
      default:
        return
    }
  })

  cmd.setup()

  if (!masterName || !masterName.length) {
    log(`
        当前未设置服主名称
        请执行：ncn master <服主名称> 进行设置
        例：ncn master Superman
        `)
  } else {
    log(`当前服主名称为：${masterName}`)
  }

  if (!announcement || !announcement.length) {
    log(`
        当前未设置服务器公告
        请执行：ncn ann <公告内容> 进行设置
        ncn ann 进服须知：禁TNT！！！！
      `)
  }
})

// mc.regPlayerCmd('test', '测试命令', () => {
//   log('test----------111111')
// })

// 上线
const handleOnJoin = player => {
  const message = handleLoginStatusMessage(player, 1)
  setTimeout(() => {
    mc.broadcast(message)
  }, 500)

  setTimeout(() => {
    player.tell('123123123')
  }, 1000)
}

// 下线
const handleOnLeft = player => {
  const message = handleLoginStatusMessage(player, 0)
  mc.broadcast(message)
}

const handleLoginStatusMessage = (player, type) => {
  const isOp = player.isOP()
  const statusMessage = type ? '上线了~' : '下线了~'
  let message
  if (player.realName === masterName) {
    message = `${Format.Gold}服主：${Format.Red} ${player.name} ${Format.Gold}${statusMessage}`
  } else if (isOp) {
    message = `${Format.DarkPurple}管理员：${Format.DarkAqua} ${player.name} ${Format.DarkPurple}${statusMessage}`
  }

  return message
}

// 监听上线
mc.listen('onJoin', handleOnJoin)

// 监听下线
mc.listen('onLeft', handleOnLeft)
