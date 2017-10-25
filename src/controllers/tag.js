import ApiError from '../errors/ApiError';
import { Group, Note, Tag } from '../models';

export async function getList(ctx) {
  const { id } = ctx.session;
  const tags = await Tag.find({ user: id });
  ctx.body = tags;
}

export async function getById(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const note = await Note.findOne({ user, id }).populate('tags');
  ctx.body = note;
}

export async function add(ctx) {
  const { id } = ctx.session;
  const { body } = ctx.request;
  const { title, content, group } = body;
  const count = await Group.count({ id: group, user: id });
  if (count === 0) throw new ApiError('GROUP_NOT_EXISTS');
  const note = await Note.create({ user: id, title, content, group });

  ctx.body = note;
}

export async function del(ctx) {
  const { id } = ctx.params;
  const note = await Note.findOneAndRemove({ id, user: ctx.session.id });
  if (!note) throw new ApiError('NOTE_NOT_EXISTS');
}

export async function update(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const note = await Note.findOne({ id, user });
  if (!note) throw new ApiError('NOTE_NOT_EXISTS');
  const { title, content, tags: tagNames } = ctx.request.body;
  const tags = await Promise.all(tagNames.map(async (name) => {
    let tag = await Tag.findOne({ name, user });
    if (!tag) {
      tag = await Tag.create({ name, user });
    }
    return tag;
  }));
  const tagIds = tags.map(tag => (tag._id));

  const res = await Note.findOneAndUpdate({ id, user }, {
    title, content, tags: tagIds
  }, { new: true });

  ctx.body = res;
}
