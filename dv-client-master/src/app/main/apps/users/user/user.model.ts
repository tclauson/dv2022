import { PreAssetType } from '@dv/types';

export class User {

  _id?: string;
  name: string;
  email: string;
  tel: string;
  dob: string;
  role: string;
  gender: 'male' | 'female' | 'other';
  avatar?: PreAssetType;

  /**
   * Constructor
   *
   * @param user
   */
  constructor(user?) {

    this.name = user?.name || '';
    this.email = user?.email || '';
    this.tel = user?.tel || '';
    this.dob = user?.dob || '';
    this.gender = user?.gender || 'male';
    this.role = user?.role?._id || user?.role || '';

    if (user?._id) {
      this._id = user._id;
      this.avatar = user.avatar || {};
    }
  }
}
