import ApiError from '../errors/ApiError';
import { Group, Api } from '../models';

export async function getList(ctx) {
  const { id } = ctx.session;
  let groups = await Group.find({ user: id });
  if (groups.length === 0) {
    await Group.create({ name: '我的分组', user: id });
    groups = await Group.find({ user: id });
  }
  ctx.body = groups;
}


export async function add(ctx) {
  const { id } = ctx.session;
  const { body } = ctx.request;
  const { name, parent, type, project } = body;
  let parents;
  if (type === 0) {
    parents = [parent];
  } else {
    const parentGroup = await Group.findById(parent);
    parents = [...parentGroup.parents, parent]
  }

  const group = await Group.create({ user: id, project, name, parent, parents, parent_type: type });

  ctx.body = group;
}

export async function del(ctx) {
  const { id } = ctx.params;
  const groups = await Group.find({
    $or: [{ id }, { parents: id }],
    $and: [{ user: ctx.session.id }]
  }).select('_id');
  const groupdIds = [];
  groups.forEach(item => {
    groupdIds.push(item._id);
  });
  await Group.remove({ _id: { $in: groupdIds } });
  await Api.remove({ parent: { $in: groupdIds } });
  // const res = await Group.remove({
  //   $or: [{ id }, { parents: id }],
  //   $and: [{ user: ctx.session.id }]
  // });
  // if (res.result.n === 0) throw new ApiError('GROUP_NOT_EXISTS');
}

export async function edit(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const res = await Group.findOneAndUpdate({ id, user }, {
    name: body.name
  }, { new: true });
  ctx.body = res;
}
