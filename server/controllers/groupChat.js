const groupChatModel = require("../models/groupChat");

/**
 * 获取群聊相关内容
 * @param   groupMsg  群聊信息
 * @param   groupInfo  群资料
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */

let getGroupDetail = async (ctx, next) => {
  try {
    const groupId = ctx.query.groupId,
      RowDataPacket1 = await groupChatModel.getGroupMsg(groupId),
      RowDataPacket2 = await groupChatModel.getGroupInfo(groupId),
      RowDataPacket3 = await groupChatModel.getGroupMember(groupId),
      groupMsg = JSON.parse(JSON.stringify(RowDataPacket1)),
      groupInfo = JSON.parse(JSON.stringify(RowDataPacket2)),
      groupMember = JSON.parse(JSON.stringify(RowDataPacket3));
    const newGroupMember = [];
    groupMember.forEach(element => {
      newGroupMember.push(element.group_member_id);
    });
    // console.log('newGroupMember',newGroupMember)
    ctx.body = {
      success: true,
      data: {
        groupMsg: groupMsg,
        groupInfo: groupInfo,
        groupMember: newGroupMember
      }
    };
  } catch (error) {
    console.log(error);
  }
};
/**
 * 存储群聊信息
 * @param   userId  用户id
 * @param   groupId 群id
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */
let saveGroupMsg = async (ctx, next) => {
  const userId = ctx.request.body.userId,
    groupId = ctx.request.body.groupId,
    message = ctx.request.body.message,
    name = ctx.request.body.name,
    time = ctx.request.body.time;
  // console.log(userId,groupId,message,name,time)
  await groupChatModel.saveGroupMsg(userId, groupId, message, name, time)
    .then(result => {
      console.log("saveGroupMsg11", result);
      if (result) {
        ctx.body = {
          success: true
        };
        console.log("保存群消息成功");
      }
    })
    .catch(err => {
      console.log(err);
    });
};
/**
 * 群添加成员
 * @param   userId  用户id
 * @param   groupId 群id
 * @return
 */
let addGroupUserRelation = async (ctx, next) => {
  const userId = ctx.request.body.userId,
    groupId = ctx.request.body.groupId;
  await groupChatModel.addGroupUserRelation(userId, groupId);
  const RowDataPacket = await groupChatModel.getGroupMember(groupId),
    groupMember = JSON.parse(JSON.stringify(RowDataPacket));
  ctx.body = {
    success: true,
    data: {
      groupMember: groupMember
    }
  };
  console.log("添加群成员成功");
};

module.exports = {
  getGroupDetail,
  saveGroupMsg,
  addGroupUserRelation
};