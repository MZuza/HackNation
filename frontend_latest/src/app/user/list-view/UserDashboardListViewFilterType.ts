export class UserDashboardListViewFilterType {
  constructor(public readonly value: string, public readonly description: string) {}

  public static getTypes(): Array<UserDashboardListViewFilterType> {
    return [];
  }

  toString(): string {
    return this.value;
  }
}
