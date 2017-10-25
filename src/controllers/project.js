import _ from 'lodash';
import ApiError from '../errors/ApiError';
import { Group, Project, Api } from '../models';

export async function getList(ctx) {
  const { id } = ctx.session;
  const projects = await Project.find({ user: id });
  const groups = await Group.find({ user: id });
  const apis = await Api.find({ user: id })
    // .populate('parent.Group')
    // .populate('project')
    .populate('tags');

  ctx.body = { projects, groups, apis };
}


export async function add(ctx) {
  const { id } = ctx.session;
  const { body } = ctx.request;
  const project = await Project.create({ ...body, user: id });

  ctx.body = project;
}

export async function del(ctx) {
  const { id } = ctx.params;
  await Project.remove({ id, user: ctx.session.id });
  await Group.remove({ project: id, user: ctx.session.id });
  await Api.remove({ project: id, user: ctx.session.id });
}

export async function edit(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const res = await Project.findOneAndUpdate({ id, user }, {
    ...body
  }, { new: true });
  ctx.body = res;
}

export async function set(ctx) {
  const { id: user } = ctx.session;
  const { ids } = ctx.request.body;
  await Project.update({ user }, { hide: true }, { multi: true });
  await Project.update({ id: { $in: ids }, user }, { hide: false }, { multi: true });
}
