import validator from 'validator';
import randomize from 'randomatic';
import ApiError from '../errors/ApiError';
import { User, UserActive } from '../models';
import { decrypt } from '../utils/rsa';
import md5 from '../utils/md5';
import sendEmail from '../utils/email';
import config from '../config';

export async function sendActiveEmail(ctx) {
  const { email } = ctx.request.body;
  if (!validator.isEmail(email)) throw new ApiError('EMAIL_INVALID');
  const count = await User.count({ email });
  if (count === 0) throw new ApiError('USER_NOT_EXISTS');

  const token = randomize('a0', 32);
  await UserActive.create({ email, token });

  const activeUrl = `${config.ui}/api/account/active?email=${email}&token=${token}`;

  const html = `<style class="fox_global_style">div.fox_html_content { line-height: 1.5; }p { margin-top: 0px; margin-bottom: 0px; }div.fox_html_content { font-size: 10.5pt; font-family: 微软雅黑; color: rgb(0, 0, 0); line-height: 1.5; }</style><center> <table cellpadding="0" cellspacing="0" class="email-container" align="center" width="550" style="font-family: Lato, 'Lucida Sans', 'Lucida Grande', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: normal; line-height: 22px; color: #444444; text-align: left; border: 1px solid rgb(177, 213, 245); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; width: 550px;"> <tbody><tr> <td> <table cellpadding="0" cellspacing="0" class="padding" width="100%" style="padding-left: 40px; padding-right: 40px; padding-top: 30px; padding-bottom: 35px;"> <tbody> <tr class="header"> <td align="center"> <h1 style="font-size: 24px; line-height: 1.3em; margin-bottom: 5px;">欢迎云笔记</h1> </td> </tr> <tr class="content"> <td align="center"> <p style="font-size: 15px; font-weight: normal; line-height: 22px;">点击下面的按钮确认电子邮件地址。</p> </td> </tr> <tr> <td align="center"> <table cellpadding="12" border="0" style="font-family: Lato, 'Lucida Sans', 'Lucida Grande', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 25px; color: #444444; text-align: left;"> <tbody><tr> <td class="button" style="color: rgb(255, 255, 255); font-size: 16px; line-height: 24px; text-align: center; display: block;"> <a href="${activeUrl}" style="color: rgb(255, 255, 255); text-align: center; display: block; padding: 12px 20px; height: 100%; border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; text-decoration: none; background-color: rgb(43, 136, 217); min-width: 150px;"><strong>激活帐户</strong></a> </td> </tr> </tbody></table> </td> </tr> </tbody> </table> </td> </tr> </tbody></table> <table border="0" cellpadding="0" cellspacing="0" align="center" class="footer" style="max-width: 550px; font-family: Lato, 'Lucida Sans', 'Lucida Grande', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 22px; color: #444444; text-align: left; padding: 20px 0; font-weight: normal;"> <tbody><tr> <td align="center" style="text-align: center; font-size: 12px; line-height: 18px; color: rgb(163, 163, 163); padding: 5px 0px;"> <!-- Hack: trick validate-assets... true --> </td> </tr> <tr> <td style="text-align: center; font-weight: normal; font-size: 12px; line-height: 18px; color: rgb(163, 163, 163); padding: 5px 0px;"> <p>© 2017 <a name="footer_copyright" href="${config.ui}" style="color: rgb(43, 136, 217); text-decoration: underline;">Hengkx</a></p> </td> </tr> </tbody></table> </center>`;

  const res = await sendEmail({ to: email, subject: '帐号激活', html });
  if (res.response !== '250 Data Ok: queued as freedom') {
    throw new ApiError('SEND_EMAIL_ERROR');
  }
}

export async function signup(ctx) {
  const { ip, body } = ctx.request;
  const { email, password } = body;

  if (!validator.isEmail(email)) throw new ApiError('EMAIL_INVALID');
  if (!password) throw new ApiError('ACCOUNT_PASSWORD_IS_NULL');
  let decryptPass = '';
  try {
    decryptPass = decrypt(password);
  } catch (error) {
    throw new ApiError('ACCOUNT_PASSWORD_DECRYPT_ERROR');
  }

  if (decryptPass.length < 6) throw new ApiError('ACCOUNT_PASSWORD_INVALID');

  const count = await User.count({ email });
  if (count > 0) throw new ApiError('EMAIL_EXISTS');
  await User.create({
    email,
    password: md5(decryptPass),
    name: email.substring(0, email.indexOf('@')),
    avatar: 'test',
    reg_ip: ip
  });

  await sendActiveEmail(ctx);
}

export async function active(ctx) {
  const { email, token } = ctx.query;
  if (!validator.isEmail(email)) throw new ApiError('EMAIL_INVALID');

  const count = await UserActive.count({ email, token, is_used: false });
  if (count === 0) throw new ApiError('ACTIVE_INFO_INVALID');
  await UserActive.findOneAndUpdate({ email, token, is_used: false }, { is_used: true });
  await User.findOneAndUpdate({ email }, {
    is_actived: true
  }, { new: true });
}

export async function signin(ctx) {
  const { body } = ctx.request;
  const { email, password } = body;

  if (!validator.isEmail(email)) throw new ApiError('EMAIL_INVALID');
  if (!password) throw new ApiError('ACCOUNT_PASSWORD_IS_NULL');

  let decryptPass = '';
  try {
    decryptPass = decrypt(password);
  } catch (error) {
    throw new ApiError('ACCOUNT_PASSWORD_DECRYPT_ERROR');
  }
  const user = await User.findOne({ email, password: md5(decryptPass) });
  if (!user) throw new ApiError('USERNAME_OR_PASSWORD_ERROR');
  // if (!user.is_actived) throw new ApiError('ACCOUNT_NOT_ACTIVATED');
  ctx.session.id = user.id;
  ctx.session.user = user.user;
}

export async function forgot(ctx) {
  const { email } = ctx.request.body;
  if (!validator.isEmail(email)) throw new ApiError('EMAIL_INVALID');
  const count = await User.count({ email });
  if (count === 0) throw new ApiError('USER_NOT_EXISTS');
  const password = randomize('Aa0', 12);
  await User.findOneAndUpdate({ email }, { password: md5(password) });

  const html = `您的密码为：${password}`;
  sendEmail({ to: email, subject: '重置密码', html });
}
