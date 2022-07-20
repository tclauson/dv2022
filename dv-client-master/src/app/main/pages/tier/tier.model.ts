export class Tier {

  tier1: {
    _id: string;
    fee: number;
    description: string;
  }

  tier2: {
    _id: string;
    fee: number;
    description: string;
  }

  /**
   * Constructor
   *
   * @param roles
   */
  constructor(roles?) {
    // Separate initialization to avoid memory dangling
    this.tier1 = {
      _id: '',
      fee: 0,
      description: ''
    }
    this.tier2 = {
      _id: '',
      fee: 0,
      description: ''
    }

    roles = roles?.length > 0 ? roles : [];
    roles.forEach(role => {
      if (role.name === 'Tier 1') {
        this.tier1._id = role._id;
        this.tier1.fee = role.fee;
        this.tier1.description = role.description;
      } else if (role.name === 'Tier 2') {
        this.tier2._id = role._id;
        this.tier2.fee = role.fee;
        this.tier2.description = role.description;
      }
    })
  }
}
