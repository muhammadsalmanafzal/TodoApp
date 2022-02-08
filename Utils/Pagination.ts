class Pagination {
  private perPage: number = 3;
  private page: number = 1;

  constructor(perPage: number, page: number) {
    this.perPage = perPage;
    this.page = page;
  }

  skip(): number {
    return (this.page - 1) * this.perPage;
  }
}

export { Pagination };
