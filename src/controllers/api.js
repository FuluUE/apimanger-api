import ApiError from '../errors/ApiError';
import { Project, Group, Tag, Api } from '../models';

export async function getList(ctx) {
  const { id } = ctx.session;
  const { tag, status, version_status, name } = ctx.query;
  const condition = {};
  if (tag) {
    condition.tags = tag;
  } else if (name) {
    condition.name = new RegExp(name, 'i');
  } else if (version_status) {
    condition.version_status = version_status;
  } else if (status) {
    condition.status = status;
  }

  const notes = await Api.find({ user: id, ...condition })
    .sort('-created_at')
    .populate('project')
    .populate('tags');
  ctx.body = notes;
}

export async function getById(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const api = await Api.findOne({ user, id })
    .populate('project').populate('tags');
  const res = { api };
  if (api.parent_type === 0) {
    res.parent = await Project.findOne({ user, id: api.parent });
  } else {
    res.parent = await Group.findOne({ user, id: api.parent });
  }
  ctx.body = res;
}

async function getTagIdByName(names, user) {
  if (!names) return [];
  const tags = await Promise.all(names.map(async (name) => {
    let tag = await Tag.findOne({ name, user });
    if (!tag) {
      tag = await Tag.create({ name, user });
    }
    return tag;
  }));
  const tagIds = tags.map(tag => (tag._id));
  return tagIds;
}

export async function add(ctx) {
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const { tags: tagNames } = body;

  const tagIds = await getTagIdByName(tagNames, user);

  const api = await Api.create({ ...body, user, tags: tagIds });
  ctx.params.id = api.id;
  await getById(ctx);
}

export async function del(ctx) {
  const { id } = ctx.params;
  const note = await Api.findOneAndRemove({ id, user: ctx.session.id });
  if (!note) throw new ApiError('API_NOT_EXISTS');
}

export async function update(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const note = await Api.findOne({ id, user });
  if (!note) throw new ApiError('API_NOT_EXISTS');
  const { tags: tagNames } = ctx.request.body;

  const tagIds = await getTagIdByName(tagNames, user);

  await Api.findOneAndUpdate({ id, user }, {
    ...ctx.request.body, tags: tagIds
  });

  await getById(ctx);
}
