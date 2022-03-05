//LiteLoaderScript Dev Helper
/// <reference path="e:\PersonCode\lite-loader-library/Library/JS/Api.js" />

ll.registerPlugin('消息插件', '上线离线通知，服务器公告', [0, 0, 1])

const conf = new JsonConfigFile('./plugins/notification/config.json')

conf.init('masterName', '')
conf.init('announcement', '')
conf.init('isStatusNotice', true)
conf.init('isAnnNotice', true)

let masterName = conf.get('masterName')
let announcement = conf.get('announcement')
let isStatusNotice = conf.get('isStatusNotice')
let isAnnNotice = conf.get('isAnnNotice')

/**
  PermType.Any
  PermType.GameMasters
  PermType.Console
 */

mc.listen('onServerStarted', () => {
  const cmd = mc.newCommand(
    'notification',
    '消息指令，可设置上线下线提示，服务器公告',
    PermType.GameMasters
  )
  cmd.setAlias('ncn')
  cmd.setEnum('ChangeMaster', ['master'])
  cmd.setEnum('ChangeAnnouncement', ['ann'])

  cmd.setEnum('ChangeStatus', ['close', 'open'])
  cmd.setEnum('ChangeStatusItem', ['stn', 'ant'])

  cmd.mandatory('action', ParamType.Enum, 'ChangeMaster', 1)
  cmd.mandatory('action', ParamType.Enum, 'ChangeAnnouncement', 1)
  cmd.mandatory('action', ParamType.Enum, 'ChangeStatus', 1)

  cmd.mandatory('statusItem', ParamType.Enum, 'ChangeStatusItem', 1)

  cmd.mandatory('name', ParamType.String)
  cmd.mandatory('notice', ParamType.String)

  cmd.overload(['ChangeMaster', 'name'])
  cmd.overload(['ChangeAnnouncement', 'notice'])
  cmd.overload(['ChangeStatus', 'ChangeStatusItem'])

  cmd.setCallback((cmd, origin, output, results) => {
    if (origin.player && origin.player.name !== masterName) {
      output.success(`你没有执行此命令的权限，该命令仅提供给服主使用`)
      log(`你没有执行此命令的权限，该命令仅提供给服主使用`)
      return
    }
    switch (results.action) {
      case 'master':
        conf.set('masterName', results.name)
        log(`已更新服主名称为：${results.name}`)
        masterName = conf.get('masterName')
        output.success(`已更新服主名称为： ${results.name}`)
        break

      case 'ann':
        conf.set('announcement', results.notice)
        announcement = conf.get('announcement')
        log(`已更新公告为：${results.notice}`)
        output.success(`已更新公告为：${results.notice}`)
        break

      default:
        break
    }

    switch (results.statusItem) {
      case 'stn':
        let stnInfo
        if (results.action === 'open') {
          isStatusNotice = true
          stnInfo = '开启'
        } else {
          isStatusNotice = false
          stnInfo = '关闭'
        }
        conf.set('isStatusNotice', isStatusNotice)
        log(`已${stnInfo}上线离线通知`)
        output.success(`已${stnInfo}上线离线通知`)
        break

      case 'ant':
        let antInfo
        if (results.action === 'open') {
          isAnnNotice = true
          antInfo = '开启'
        } else {
          isAnnNotice = false
          antInfo = '关闭'
        }
        conf.set('isAnnNotice', isAnnNotice)
        log(`已${antInfo}公告`)
        output.success(`已${antInfo}公告`)
        break
      default:
        break
    }
    // 重载配置文件
    conf.reload()
  })

  // // 疫情查询指令
  const epCmd = mc.newCommand(
    'epidemic',
    '疫情查询指令，玩游戏也不要忘记关注疫情哦~',
    PermType.Any
  )
  epCmd.setAlias('ep')
  epCmd.mandatory('province', ParamType.String)
  epCmd.optional('city', ParamType.String)

  epCmd.overload(['province', 'city'])

  epCmd.setCallback((cmd, origin, output, results) => {
    let { province, city } = results
    mc.broadcast('疫情数据查询中...')
    network.httpGet('http://t-cms-api.tj520.top/epidemic', (status, result) => {
      let queryData = {}
      let queryMessage
      if (status === 200) {
        const epResult = JSON.parse(result)
        const provinceData = epResult.data.children
        log(epResult.message)
        const targetProvinceData = provinceData.find(item => {
          return item.name === province
        })
        if (!city) {
          city = ''
          queryData = handleStorageEpidemicData(targetProvinceData)
        } else {
          const targetCityData = targetProvinceData.children.find(item => {
            return item.name === city
          })
          queryData = handleStorageEpidemicData(targetCityData)
        }

        if (queryData) {
          city = city + ' '
          queryMessage = `查询成功！
          截至目前： ${province} ${city}的疫情数据为： 
          现有确诊： ${queryData.nowConfirm}
          累计确诊： ${queryData.totalConfirm}
          比较昨日： ${queryData.contrastConfirm}
          死亡： ${queryData.totalDead}
          治愈： ${queryData.totalHeal}
          提醒大家做好防疫工作， 多通风， 少聚集。
          最后, 中国加油！！
          `
        } else {
          queryMessage = `
          未查到当地数据，请检查指令格式是否正确。
          正确的格式为：ep 省 或 ep 省 市
          示例：  ep 湖北 或 ep 湖北 武汉
          `
        }
      } else {
        queryMessage = `疫情数据查询失败...
        接口可能挂掉了。
        请联系开发人员： vx: bishu0913`
      }
      log(queryMessage)
      mc.broadcast(queryMessage)
    })
  })

  epCmd.setup()
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

  if (isStatusNotice) {
    log('已启用上线离线通知')
  } else {
    log('已禁用上线离线通知')
  }

  if (isAnnNotice) {
    log(`已启用公告`)
  } else {
    log('已禁用公告')
  }
})

const handleStorageEpidemicData = epData => {
  if (!epData) return null
  return {
    totalConfirm: epData.total.confirm,
    totalDead: epData.total.dead,
    totalHeal: epData.total.heal,
    nowConfirm: epData.total.confirm - epData.total.dead - epData.total.heal,
    contrastConfirm: '+' + epData.today.confirm
  }
}

// 上线
const handleOnJoin = player => {
  const message = handleLoginStatusMessage(player, 1)
  if (message && isStatusNotice) {
    setTimeout(() => {
      mc.broadcast(message)
    }, 500)
  }
}

// 下线
const handleOnLeft = player => {
  const message = handleLoginStatusMessage(player, 0)
  if (message && isStatusNotice) {
    mc.broadcast(message)
  }
}

// 生成提示信息
const handleLoginStatusMessage = (player, loginStatus) => {
  const isOp = player.isOP()
  const statusMessage = loginStatus ? '上线了~' : '下线了~'
  let message
  if (player.realName === masterName) {
    message = `${Format.Gold}服主：${Format.Red}${Format.Bold} ${player.name} ${Format.Clear}${Format.Gold}${statusMessage}${Format.Clear}`
  } else if (isOp) {
    message = `${Format.DarkPurple}管理员：${Format.DarkAqua}${Format.Bold} ${player.name} ${Format.Clear}${Format.DarkPurple}${statusMessage}${Format.Clear}`
  } else {
    message = false
  }

  if (loginStatus && announcement.length && isAnnNotice) {
    setTimeout(() => {
      player.tell(
        Format.Bold +
          Format.Gold +
          '公告： ' +
          Format.Clear +
          Format.Red +
          announcement +
          Format.Clear
      )
    }, 1000)
  }

  return message
}

// 监听上线
mc.listen('onJoin', handleOnJoin)

// 监听下线
mc.listen('onLeft', handleOnLeft)
